import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db, auth } from '../../Firebase'; // Ensure db and auth are imported from your Firebase config
import { collection, getDocs } from 'firebase/firestore'; // Ensure you have the correct imports for Firestore
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';

export default function EventList({ navigation }) {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const uid = auth.currentUser.uid; // Get the current user's ID
      const snapshot = await getDocs(collection(db, 'users', uid, 'events')); // Query the events collection of the user
      const allEvents = [];

      snapshot.forEach((doc) => {
        allEvents.push({ id: doc.id, ...doc.data() });
      });

      setEvents(allEvents); // Set the state with the fetched events
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to load events');
    }
  };

  useEffect(() => {
    fetchEvents(); // Fetch events when the component mounts
  }, []);

  const renderEvent = ({ item }) => (
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
  );

  const deleteEvent = async (eventId) => {
    try {
      const eventRef = doc(db, 'users', auth.currentUser.uid, 'events', eventId);
      await deleteDoc(eventRef);

      setEvents((prevEvents) => prevEvents.filter((e) => e.id !== eventId)); // Remove deleted event from state
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to delete event');
    }
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

      <Text style={styles.heading}>All Events</Text>

      <FlatList
        data={events} // Use the events state
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={renderEvent} // Render each event using the renderEvent function
        ListEmptyComponent={<Text style={styles.noEvent}>No events available.</Text>}
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
