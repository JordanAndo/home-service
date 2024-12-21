import React, {useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, } from 'react-native';
import { db } from '../Firebase/firebaseConfig';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';

export default function AdminScreen() {
  const [bookings, setBookings] = useState([]);
 

  // Fetch bookings from Firestore
  const fetchBookings = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'bookings'));
      const allBookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookings(allBookings);
    } catch (error) {
      console.error('Error fetching bookings: ', error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Update booking status in Firestore
  const updateBookingStatus = async (id, newStatus) => {
    try {
      const bookingRef = doc(db, 'bookings', id);
      await updateDoc(bookingRef, { status: newStatus });
      setBookings(prevBookings =>
        prevBookings.map(booking => (booking.id === id ? { ...booking, status: newStatus } : booking))
      );
    } catch (error) {
      console.error('Error updating booking status: ', error);
    }
  };

  // Delete booking
  const deleteBooking = async (id) => {
    Alert.alert(
      'Delete Booking',
      'Are you sure you want to delete this booking?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const bookingRef = doc(db, 'bookings', id);
              await deleteDoc(bookingRef);
              setBookings(prevBookings => prevBookings.filter(booking => booking.id !== id));
            } catch (error) {
              console.error('Error deleting booking: ', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Render each booking row
  const renderBooking = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.id.split('_')[0]}</Text> {/* Display User Email */}
      <Text style={styles.cell}>{item.serviceName}</Text>
      <Text style={styles.cell}>{item.selectedDate || 'N/A'}</Text>
      <Picker
        selectedValue={item.status}
        style={styles.picker}
        onValueChange={(value) => updateBookingStatus(item.id, value)}
      >
       
        <Picker.Item label="Accepted" value="Accepted" />
        <Picker.Item label="Completed" value="Completed" />
        <Picker.Item label="Canceled" value="Canceled" />
      </Picker>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteBooking(item.id)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Admin Screen Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerCell}> Email</Text>
        <Text style={styles.headerCell}>Service</Text>
        <Text style={styles.headerCell}>Date</Text>
        <Text style={styles.headerCell}>Status</Text>
        <Text style={styles.headerCell}>Actions</Text>
      </View>

      {/* List of Bookings */}
      <FlatList
        data={bookings}
        renderItem={renderBooking}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  headerRow: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#ddd',
    marginBottom: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
     // Center align text in headers
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center', // Center align text in rows
  },
  picker: {
    flex: 1,
    height: 40,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#ff5555',
    borderRadius: 5,
    padding: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});