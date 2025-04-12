import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { auth, db } from '../../Firebase';
import { collection, onSnapshot, updateDoc, doc, deleteDoc, getDoc } from 'firebase/firestore';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';


export default function Dashboard({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [events, setEvents] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [calendarVisible, setCalendarVisible] = useState(true);
  const [userName, setUserName] = useState('');

  const toggleCalendar = () => setCalendarVisible(!calendarVisible);
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserName(data.name); 
        }
      } catch (error) {
        Alert.alert('Error', 'Unable to fetch user name');
      }
    };
  
    fetchUserName();
  
    const unsubscribe = onSnapshot(
      collection(db, 'users', auth.currentUser.uid, 'events'),
      (snapshot) => {
        const fetchedEvents = [];
        const datesWithEvents = {};
  
        snapshot.forEach((doc) => {
          const data = doc.data();
          const eventDate = moment(data.date).format('YYYY-MM-DD');
          fetchedEvents.push({ id: doc.id, ...data });
          datesWithEvents[eventDate] = { marked: true };
        });
  
        setEvents(fetchedEvents);
        setMarkedDates(datesWithEvents);
      },
      (error) => {
        Alert.alert('Error', error.message || 'Failed to load events');
      }
    );
  
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
      await updateDoc(eventRef, { favourite: !event.favourite });
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update favourite');
    }
  };

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
              await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'events', eventId));
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

  return (
    <LinearGradient colors={['#ffe66d', '#A55DE8','#ff6b6b']} style={styles.container}>
         <View style={styles.header}>
  <Text style={styles.title}>Dashboard</Text>
  
  <View style={styles.rightIcons}>
    {/* Logout Icon */}
    <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
      <Icon name="sign-out" size={24} color="#333" />
    </TouchableOpacity>
  </View>
</View>

<Text style={styles.welcomeText}>
  Welcome , {userName} — Let’s create something special 🌟
</Text>


      <TouchableOpacity
        onPress={toggleCalendar}
        style={styles.calendarToggle}
      >
        <Text style={styles.calendarToggleText}>
          {calendarVisible ? 'Hide Calendar' : 'Show Calendar'}
          <Icon name="calendar" size={20} color="#333" style={{ marginLeft: 8 }} />
        </Text>
        <Icon
          name={calendarVisible ? 'angle-up' : 'angle-down'}
          size={24}
          color="#333"
        />
      </TouchableOpacity>

      {calendarVisible && (
        <Calendar
          onDayPress={(day) => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          theme={styles.calendarTheme}
          style={styles.calendar}
        />
      )}

      <View style={{ flex: 1 }}>
        <FlatList
          data={events.filter((e) => moment(e.date).format('YYYY-MM-DD') === selectedDate)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.eventContainer}>
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
                      color={item.favourite ? 'red' : '#000'}
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
            </View>
          )}
          ListEmptyComponent={<Text style={styles.noEvent}>No events for this date.</Text>}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 40, 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 15,
    backgroundColor: '#fff',  
    elevation: 4,  
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5E60CE', 
    marginBottom: 12,
    marginTop: 12,
    marginLeft: 16,
    fontStyle: 'italic',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  
  menuButton: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5E60CE',
  },
  rightIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 15,
    padding: 5,
  },
  calendarToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#ffb085',
    borderRadius: 10,
    elevation: 3,
    marginVertical: 10
  },
  calendarToggleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  calendar: {
    marginBottom: 10,
    borderRadius: 14,
    elevation: 4,
    overflow: 'hidden',
    backgroundColor: '#ff7e5f',
  },
  calendarTheme: {
    backgroundColor: '#ff7e5f',
    calendarBackground: '#ff7e5f',
    textSectionTitleColor: '#000',
    textDayHeaderFontSize: 16,
    textDayHeaderFontWeight: 'bold',
    textDayFontSize: 16,
    textDayFontWeight: '500',
    selectedDayBackgroundColor: '#5E60CE',
    selectedDayTextColor: '#fff',
    todayTextColor: '#5E60CE',
    dayTextColor: '#000',
    arrowColor: '#5E60CE',
    monthTextColor: '#000',
    textMonthFontSize: 18,
    textMonthFontWeight: 'bold',
  },
  eventContainer: {
    marginBottom: 10,
  },
  eventCard: {
    backgroundColor: '#ffc3a0',
    padding: 16,
    borderRadius: 14,
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
    fontWeight: 'bold'
  },
  eventDetails: {
    marginTop: 8,
  },
  eventLocation: {
    fontSize: 15,
    color: '#666',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: '#555',
    fontWeight: 'bold'
  },
  eventActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  favouriteButton: {
    padding: 6,
  },
  buttons: {
    flexDirection: 'row',
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
  noEvent: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 65,
    paddingHorizontal: 16,
    backgroundColor: '#FFEBB7', 
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    elevation: 3,
    marginTop: 20,
    width: '100%'
  },
  
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#5E60CE',
    textAlign: 'center',
    flex: 1,
  },
  
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  iconButton: {
    paddingHorizontal: 6,
    paddingVertical: 10,
  },
  
});
