import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons'; // For the back icon
import { auth, db } from '../../Firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function EditEvent({ route, navigation }) {
  const { event } = route.params; // Receive the event data from the Dashboard screen

  // State to store the updated values
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description);
  const [location, setLocation] = useState(event.location);
  const [time, setTime] = useState(event.time);
  const [timezone, setTimezone] = useState(event.timezone);
  const [favourite, setFavourite] = useState(event.favourite);

  // Handle updating the event
 // Handle updating the event
const handleUpdateEvent = async () => {
  if (!title || !description || !location || !time || !timezone) {
    Alert.alert('Error', 'Please fill in all fields');
    return;
  }

  // Ensure the 'favourite' field is a valid boolean value (either true or false)
  const updatedFavourite = typeof favourite === 'boolean' ? favourite : false; // Default to false if undefined

  try {
    const eventRef = doc(db, 'users', auth.currentUser.uid, 'events', event.id);
    
    await updateDoc(eventRef, {
      title,
      description,
      location,
      time,
      timezone,
      favourite: updatedFavourite, // Make sure 'favourite' is valid
    });

    Alert.alert('Success', 'Event updated');
    navigation.goBack(); // Navigate back after updating
  } catch (error) {
    // Log the actual error message for debugging
    console.error("Update error:", error);
    Alert.alert('Error', `Failed to update event: ${error.message}`);
  }
};


  return (
    <LinearGradient
      colors={['#3E82F7', '#A55DE8']} // Gradient colors
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={30} color="#fff" />
      </TouchableOpacity>

      {/* Gradient Circles */}
      <LinearGradient
        colors={['#61C2F3', '#C66AE1']}
        style={[styles.circle, styles.circle1]}
      />
      <LinearGradient
        colors={['#61C2F3', '#C66AE1']}
        style={[styles.circle, styles.circle2]}
      />

      <Text style={styles.header}>Edit Event</Text>

      <TextInput
        style={styles.input}
        placeholder="Event Title"
        placeholderTextColor="#aaa"
        value={title}
        onChangeText={setTitle}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Event Description"
        placeholderTextColor="#aaa"
        value={description}
        onChangeText={setDescription}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Event Location"
        placeholderTextColor="#aaa"
        value={location}
        onChangeText={setLocation}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Event Time"
        placeholderTextColor="#aaa"
        value={time}
        onChangeText={setTime}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Event Timezone"
        placeholderTextColor="#aaa"
        value={timezone}
        onChangeText={setTimezone}
      />
      
      <TouchableOpacity onPress={() => setFavourite(!favourite)} style={styles.favouriteButton}>
        <Text style={styles.favouriteButtonText}>{favourite ? 'Unfavourite' : 'Favourite'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.addButton} onPress={handleUpdateEvent}>
        <Text style={styles.addButtonText}>Update Event</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  favouriteButton: {
    backgroundColor: '#5e3cf7',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginVertical: 15,
    alignItems: 'center',
  },
  favouriteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#e76f51',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Gradient circles for decoration
  circle: {
    position: 'absolute',
    borderRadius: 100,
    height: 200,
    width: 200,
  },
  circle1: {
    top: -50,
    left: -50,
  },
  circle2: {
    bottom: -50,
    right: -50,
  },
});
