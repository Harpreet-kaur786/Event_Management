import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db, auth } from '../../Firebase';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';

export default function FavouriteEvents({ navigation }) {
  const [favouriteEvents, setFavouriteEvents] = useState([]);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    const eventsRef = collection(db, 'users', uid, 'events');

    const unsubscribe = onSnapshot(eventsRef, (snapshot) => {
      const favourites = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.favourite) {
          favourites.push({ id: doc.id, ...data });
        }
      });
      setFavouriteEvents(favourites);
    });

    return () => unsubscribe(); // Clean up listener
  }, []);

  const deleteEvent = async (eventId) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const eventRef = doc(db, 'users', auth.currentUser.uid, 'events', eventId);
              await deleteDoc(eventRef);
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

  const toggleFavourite = async (eventId, value) => {
    try {
      const eventRef = doc(db, 'users', auth.currentUser.uid, 'events', eventId);
      await updateDoc(eventRef, {
        favourite: value,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to update favourite status');
    }
  };

  return (
    <LinearGradient
      colors={['#ffe66d', '#A55DE8','#ff6b6b']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-left" size={20} color="#000" />
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
              <TouchableOpacity onPress={() => toggleFavourite(item.id, false)}>
                <Icon name="heart" size={22} color="red" />
              </TouchableOpacity>
            </View>
            <Text style={styles.eventTime}>{item.time} {item.timezone}</Text>
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
    color: '#ff6b6b',
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
    marginTop: 6,
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
