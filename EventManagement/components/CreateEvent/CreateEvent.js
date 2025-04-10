import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { auth, db } from '../../Firebase';
import { addDoc, collection } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';  // For the back icon

export default function CreateEventScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [timezone, setTimezone] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const timeOptions = ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
  const timezoneOptions = ['GMT+03:00', 'UTC+10:30'];

  const handleAddEvent = async () => {
    if (!title || !selectedTime || !timezone) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }

    try {
      await addDoc(collection(db, 'users', user.uid, 'events'), {
        title,
        date: date.toISOString(),
        time: selectedTime,
        timezone,
        location,
        description,
        createdAt: new Date()
      });

      Alert.alert('Success', 'Event added successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
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

      <Text style={styles.header}>Add New Event</Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
        placeholderTextColor="#aaa"
        value={title}
        onChangeText={setTitle}
      />

      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
        <Text style={styles.dateText}>{date.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <Text style={styles.label}>Select Time</Text>
      <View style={styles.row}>
        {timeOptions.map((time) => (
          <TouchableOpacity
            key={time}
            style={[styles.timeBtn, selectedTime === time && styles.timeBtnSelected]}
            onPress={() => setSelectedTime(time)}
          >
            <Text style={selectedTime === time ? styles.timeTextSelected : styles.timeText}>{time}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Time Zone</Text>
      <View style={styles.row}>
        {timezoneOptions.map((zone) => (
          <TouchableOpacity
            key={zone}
            style={[styles.timeBtn, timezone === zone && styles.timeBtnSelected]}
            onPress={() => setTimezone(zone)}
          >
            <Text style={timezone === zone ? styles.timeTextSelected : styles.timeText}>{zone}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Location (Optional)"
        placeholderTextColor="#aaa"
        value={location}
        onChangeText={setLocation}
      />

      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Description (Optional)"
        placeholderTextColor="#aaa"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddEvent}>
        <Text style={styles.addButtonText}>Add Event</Text>
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
  dateText: {
    color: '#000',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 8,
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  timeBtn: {
    backgroundColor: '#eee',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    width: '30%',
    alignItems: 'center',
  },
  timeBtnSelected: {
    backgroundColor: '#5e3cf7',
  },
  timeText: {
    color: '#000',
  },
  timeTextSelected: {
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
