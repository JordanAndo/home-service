import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, RefreshControl, TouchableOpacity, Alert, Modal } from 'react-native';
import { db, auth } from '../Firebase/firebaseConfig';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';

const imageMap = {
  // 'qEgiKTovsn6OwWMbhtV3': require('../assets/image/cleaning1.png'),
  // 'xMzhyDPCzuq7CnexMl74': require('../assets/image/cleaning2.png'),
  // 'nkVtiuVIondPpMuiUK8U': require('../assets/image/cleaning3.png'),
  // 'ZVvmlqUcKZlpi85IeC33': require('../assets/image/cleaning4.png'),
  // '4oTtspwW2lHmok9krCoW': require('../assets/image/repairing1.png'),
  // 'R1D9hJweATK1ltjzrqbc': require('../assets/image/repairing2.png'),
  // '37IiCBqNddOZGRiNI09J': require('../assets/image/painting1.png'),
  // 'VeecBj9llRRgnGCTJsX3': require('../assets/image/painting2.png'),
  // 'XdxL8pbYHirCUuxC4Ye3': require('../assets/image/plumbing1.png'),
  // 'GuK5yrUOKnqpBhS8Pw3Z': require('../assets/image/plumbing2.png'),
  // Your image mapping here
};

export default function BookingScreen({ navigation }) {
  const [bookings, setBookings] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
 

  // New state to track payment button presses
  const [paymentPressed, setPaymentPressed] = useState({});

  const fetchBookings = async () => {
    if (!auth.currentUser) return;

    const email = auth.currentUser.email;
    try {
      const querySnapshot = await getDocs(collection(db, 'bookings'));
      const allBookings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const userBookings = allBookings.filter(booking => {
        const [bookingEmail] = booking.id.split('_');
        return bookingEmail === email;
      });

      const sortedBookings = userBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBookings(sortedBookings);
    } catch (error) {
      console.error("Error fetching bookings: ", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const refreshBookings = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  const deleteBooking = async (bookingId) => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      await deleteDoc(bookingRef);
      setBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId));
    } catch (error) {
      console.error("Error deleting booking: ", error);
    }
  };

  const showDeleteOption = (bookingId) => {
    Alert.alert(
      "Delete Booking",
      "Are you sure you want to delete this booking?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => deleteBooking(bookingId), style: "destructive" },
      ],
      { cancelable: true }
    );
  };

  const openReviewModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    setModalVisible(true);
  };

  const renderBooking = ({ item }) => {
    let displayStatus = item.status;
    let statusStyle = styles.statusButton;

    if (item.status === 'Canceled') {
      displayStatus = 'Canceled';
      statusStyle = styles.canceledStatus;
    } else if (item.status === 'Completed') {
      displayStatus = 'Completed';
      statusStyle = styles.completedStatus;
    } else if (item.status === 'Accepted') {
      displayStatus = 'Accepted';
      statusStyle = styles.AcceptedStatus;
    } else {
      displayStatus = 'Booked';
      statusStyle = styles.bookedStatus;
    }

    return (
      <View style={styles.bookingContainer}>
        <Image
          source={imageMap[item.serviceId] || { uri: 'https://via.placeholder.com/80' }}
          style={styles.image}
        />
        <View style={styles.details}>
          <Text style={styles.name}>{item.serviceName}</Text>
          <Text style={styles.amount}>Selected Date: {item.selectedDate}</Text>

          {/* Status Button */}
          <TouchableOpacity style={[styles.statusButton, statusStyle]}>
            <Text style={styles.statusButtonText}>{displayStatus}</Text>
          </TouchableOpacity>
        </View>

        {/* Ellipsis icon in the right corner with delete option */}
        <TouchableOpacity style={styles.ellipsisButton} onPress={() => showDeleteOption(item.id)}>
          <Icon name="ellipsis-vertical" size={24} color="black" />
        </TouchableOpacity>

        {/* Payment Button - Show only if status is Completed and not pressed */}
        {item.status === 'Completed' && !paymentPressed[item.id] && (
          <TouchableOpacity 
            style={styles.paymentButton} 
            onPress={() => {
              setPaymentPressed(prev => ({ ...prev, [item.id]: true })); // Mark payment button as pressed
              navigation.navigate('Payment', {
                selectedDate: item.selectedDate, // Ensure this field exists in your data
                selectedTime: item.selectedTime,
                selectedItem: { id: item.serviceId, name: item.serviceName }
              });
            }}
          >
            <Text style={styles.paymentButtonText}>Payment</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {bookings.length > 0 ? (
        <FlatList
          data={bookings}
          renderItem={renderBooking}
          keyExtractor={item => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshBookings} />}
        />
      ) : (
        <Text>No bookings available.</Text>
      )}

      {/* Modal for Review */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {/* Your modal content can go here */}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  bookingContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    alignItems: 'center',
    position: 'relative',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  amount: {
    fontSize: 16,
    marginBottom: 10,
  },
  statusButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bookedStatus: {
    backgroundColor: 'purple',
  },
  AcceptedStatus: {
    backgroundColor: '#FF6347',
  },
  canceledStatus: {
    backgroundColor: 'red',
  },
  completedStatus: {
    backgroundColor: 'green',
  },
  statusButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  paymentButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    alignSelf: 'flex-end',
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  ellipsisButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
