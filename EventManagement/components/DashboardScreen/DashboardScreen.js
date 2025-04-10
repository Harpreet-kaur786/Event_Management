import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { auth, db } from '../../Firebase';
import { collection, getDocs, updateDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';

export default function Dashboard({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [events, setEvents] = useState([]);
  const [markedDates, setMarkedDates] = useState({});

  // Real-time listener for events
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'users', auth.currentUser.uid, 'events'),
      (snapshot) => {
        const fetchedEvents = [];
        const datesWithEvents = {};

        snapshot.forEach((doc) => {
          const data = doc.data();
          const eventDate = moment(data.date).format('YYYY-MM-DD');

          fetchedEvents.push({ id: doc.id, ...data });

          datesWithEvents[eventDate] = {
            marked: true,
            customStyles: {
              container: { backgroundColor: 'transparent' },
              text: { color: 'transparent' },
              dot: { backgroundColor: 'transparent' },
            },
          };
        });

        setEvents(fetchedEvents);
        setMarkedDates(datesWithEvents);
      },
      (error) => {
        Alert.alert('Error', error.message || 'Failed to load events');
      }
    );

    // Cleanup listener when component unmounts
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Logout Error', error.message);
    }
  };

  const toggleFavourite = async (eventId) => {
    try {
      const eventRef = doc(db, 'users', auth.currentUser.uid, 'events', eventId);
      const event = events.find((e) => e.id === eventId);

      await updateDoc(eventRef, {
        favourite: !event.favourite,
      });
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update favourite');
    }
  };

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
              // Optionally, update the UI to remove the event from the list
              setEvents((prevEvents) => prevEvents.filter((e) => e.id !== eventId));
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
  

  const editEvent = (eventId) => {
    const event = events.find((e) => e.id === eventId);
    navigation.navigate('EditEvent', { event, eventId });
  };

  const renderMarkedDates = () => {
    const customMarkedDates = {};
    for (const date in markedDates) {
      customMarkedDates[date] = {
        marked: true,
        customStyles: {
          container: { backgroundColor: 'transparent' },
          dot: { backgroundColor: 'transparent' },
        },
      };
    }
    return customMarkedDates;
  };

  return (
    <LinearGradient
      colors={['#f0f4ff', '#d6e4ff']}  // Light pleasant gradient
      style={styles.container}
    >
      <Text style={styles.heading}>{moment(selectedDate).format('MMMM YYYY')}</Text>

      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={renderMarkedDates()}
        theme={{
          selectedDayBackgroundColor: '#5E60CE',
          todayTextColor: '#5E60CE',
          arrowColor: '#5E60CE',
        }}
        style={styles.calendar}
      />
    {/* Icon to navigate to the Event List Screen */}
    <TouchableOpacity
        style={styles.iconButton}
        onPress={() => navigation.navigate('EventList')} // Navigate to the Event List Screen
      >
        <Icon name="calendar" size={30} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.favouriteIcon}
        onPress={() => navigation.navigate('Favourite')}
      >
        <Icon name="star" size={25} color="gold" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.logoutIcon}
        onPress={() => navigation.navigate('Login')}
      >
        <Icon name="power-off" size={30} color="#000" />
      </TouchableOpacity>

      <FlatList
        data={events.filter((e) => moment(e.date).format('YYYY-MM-DD') === selectedDate)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <View style={styles.eventHeader}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.eventTime}>{item.time} {item.timezone}</Text>
            </View>
            <View style={styles.eventDetails}>
              <Text style={styles.eventLocation}>Location: {item.location}</Text>
              <Text style={styles.eventDescription}>{item.description}</Text>
            </View>

            <View style={styles.eventActions}>
              <TouchableOpacity onPress={() => toggleFavourite(item.id)} style={styles.favouriteButton}>
                <Icon
                  name={item.favourite ? 'star' : 'star-o'}
                  size={20}
                  color={item.favourite ? 'gold' : '#ccc'}
                />
              </TouchableOpacity>

              <View style={styles.buttons}>
                <TouchableOpacity onPress={() => editEvent(item.id)} style={styles.editButton}>
                  <Text style={{ color: 'white' }}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteEvent(item.id)} style={styles.deleteButton}>
                  <Text style={{ color: 'white' }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.noEvent}>No events for this date.</Text>}
      />

      <TouchableOpacity
        style={styles.addEventButton}
        onPress={() => navigation.navigate('CreateEvent')}
      >
        <Text style={styles.addEventText}>+ Add New Event</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 50,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  calendar: {
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
    overflow: 'hidden',
  },
  eventCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
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
    marginTop: 8,
  },
  eventLocation: {
    fontSize: 15,
    color: '#666',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: '#555',
  },
  eventActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  favouriteButton: {
    padding: 6,
  },
  editButton: {
    backgroundColor: '#5E60CE',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: 'crimson',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addEventButton: {
    backgroundColor: '#5E60CE',
    paddingVertical: 14,
    borderRadius: 12,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addEventText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold',
  },
  logoutContainer: {
    marginTop: 12,
  },
  noEvent: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
  favouriteIcon: {
    position: 'absolute',
    top: 30,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 10,
    elevation: 5,
  },
  logoutIcon:{
      position: 'absolute',
      top: 30,
      right: 100,
      backgroundColor: '#fff',
      borderRadius: 30,
      padding: 10,
      elevation: 5,
  }
});
