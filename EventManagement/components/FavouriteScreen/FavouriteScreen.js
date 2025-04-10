import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db, auth } from '../../Firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';

export default function FavouriteEvents({ navigation }) {
  const [favouriteEvents, setFavouriteEvents] = useState([]);

  const fetchFavouriteEvents = async () => {
    try {
      const uid = auth.currentUser.uid;
      const snapshot = await getDocs(collection(db, 'users', uid, 'events'));
      const favourites = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.favourite) {
          favourites.push({ id: doc.id, ...data });
        }
      });

      setFavouriteEvents(favourites);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to load favourite events');
    }
  };

  useEffect(() => {
    fetchFavouriteEvents();
  }, []);

  const deleteEvent = async (eventId) => {
    // Show confirmation alert before deleting
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this event?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const eventRef = doc(db, 'users', auth.currentUser.uid, 'events', eventId);
              await deleteDoc(eventRef);
  
              setFavouriteEvents((prevEvents) => prevEvents.filter((e) => e.id !== eventId));
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to delete event');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };
  

  return (
    <LinearGradient
      colors={['#3E82F7', '#A55DE8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-left" size={20} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.heading}>Favourite Events</Text>

      <FlatList
        data={favouriteEvents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <View style={styles.eventHeader}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.eventTime}>{item.time} {item.timezone}</Text>
            </View>
            <View style={styles.eventDetails}>
              <Text style={styles.eventLocation}>📍 {item.location}</Text>
              <Text style={styles.eventDescription}>{item.description}</Text>
            </View>

            <View style={styles.eventActions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('EditEvent', { event: item, eventId: item.id })}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteEvent(item.id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noEvent}>No favourite events.</Text>}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  eventCard: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 10,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  eventTime: {
    fontSize: 14,
    color: '#5E60CE',
  },
  eventDetails: {
    marginTop: 10,
  },
  eventLocation: {
    fontSize: 16,
    color: '#777',
    marginBottom: 6,
  },
  eventDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  eventActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#5E60CE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: '#D72638',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  noEvent: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
    marginTop: 40,
  },
});

