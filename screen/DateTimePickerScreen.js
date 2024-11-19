import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, FlatList, ToastAndroid, KeyboardAvoidingView } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { db, auth } from '../Firebase/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import moment from 'moment';

export default function DateTimePickerScreen({ route, navigation }) {
  const { selectedItem } = route.params;
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeList, setTimeList] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const timelist = [];
    for (let i = 8; i <= 12; i++) {
      timelist.push({ time: `${i}:00 AM` });
      timelist.push({ time: `${i}:30 AM` });
    }
    for (let i = 1; i <= 7; i++) {
      timelist.push({ time: `${i}:00 PM` });
      timelist.push({ time: `${i}:30 PM` });
    }
    setTimeList(timelist);
  }, []);

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime) {
      ToastAndroid.show('Please select Date and Time', ToastAndroid.LONG);
      return;
    }

    const email = auth.currentUser.email;
    const bookingId = `${email}_${selectedItem.id}_${Date.now()}`;

    const bookingData = {
      serviceId: selectedItem.id,
      serviceName: selectedItem.name,
      email,
      selectedDate: moment(selectedDate).format('YYYY-MM-DD'),
      selectedTime,
      note,
      status: 'Booked',
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'bookings', bookingId), bookingData);
      ToastAndroid.show('Booking confirmed successfully!', ToastAndroid.LONG);
      
      navigation.navigate('Home'); // Change to 'Home' screen after confirmation
    } catch (error) {
      console.error("Error saving booking: ", error);
      ToastAndroid.show('Error confirming booking. Please try again.', ToastAndroid.LONG);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <KeyboardAvoidingView style={{ padding: 20 }}>
        <Text style={[styles.header, { marginTop: -70 }]}>Select Date</Text>
        <View style={styles.calendarContainer}>
          <CalendarPicker
            onDateChange={date => setSelectedDate(date)}
            width={300}
            minDate={new Date()}
            todayBackgroundColor="#FF6347"
            todayTextStyle={{ color: 'white' }}
            selectedDayColor="black"
            selectedDayTextColor="white"
          />
        </View>

        <Text style={[styles.header, { marginTop: 30 }]}>Select Time Slot</Text>
        <FlatList
          data={timeList}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => setSelectedTime(item.time)}>
              <Text style={[selectedTime === item.time ? styles.selectedTime : styles.unselectedTime]}>
                {item.time}
              </Text>
            </TouchableOpacity>
          )}
        />

        <Text style={[styles.header, { marginTop: 30 }]}>Suggestion</Text>
        <TextInput
          style={styles.noteInput}
          placeholder="Note"
          value={note}
          onChangeText={setNote}
          multiline
        />

        <View style={styles.confirmButtonContainer}>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmBooking}>
            <Text style={styles.confirmButtonText}>Confirm & Book</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  header: {
    fontSize: 18,
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  calendarContainer: {
    backgroundColor: '#FFF3F1',
    padding: 20,
    borderRadius: 15,
  },
  selectedTime: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#FF6347',
    borderRadius: 99,
    paddingHorizontal: 18,
    backgroundColor: '#FF6347',
    color: 'white',
  },
  unselectedTime: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#FF6347',
    borderRadius: 99,
    paddingHorizontal: 18,
    color: '#FF6347',
  },
  noteInput: {
    borderColor: '#FF6347',
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    marginBottom: 20,
    height: 80,
    textAlignVertical: 'top',
    backgroundColor: 'white',
  },
  confirmButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#FF6347',
    padding: 15,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
