import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, RefreshControl, TouchableOpacity, Alert, Modal } from 'react-native';
import { db, auth } from '../Firebase/firebaseConfig';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';

export default function BookingScreen({ navigation }) {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [paymentPressed, setPaymentPressed] = useState({});

  // Fetch services to map the serviceId to the image
  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Fetch cleaning services
        const cleaningSnapshot = await getDocs(collection(db, 'cleaning'));
        const cleaningList = cleaningSnapshot.docs.map(doc => {
          const data = doc.data();
          return { id: doc.id, ...data, image: data.image || null };
        });

        // Fetch plumbing services
        const plumbingSnapshot = await getDocs(collection(db, 'plumbing'));
        const plumbingList = plumbingSnapshot.docs.map(doc => {
          const data = doc.data();
          return { id: doc.id, ...data, image: data.image || null };
        });

        // Fetch repairing services
        const repairingSnapshot = await getDocs(collection(db, 'repairing'));
        const repairingList = repairingSnapshot.docs.map(doc => {
          const data = doc.data();
          return { id: doc.id, ...data, image: data.image || null };
        });

        // Fetch painting services
        const paintingSnapshot = await getDocs(collection(db, 'painting'));
        const paintingList = paintingSnapshot.docs.map(doc => {
          const data = doc.data();
          return { id: doc.id, ...data, image: data.image || null };
        });

        // Combine all service lists into one
        const allServices = [...cleaningList, ...plumbingList, ...repairingList, ...paintingList];
        setServices(allServices);

      } catch (error) {
        console.error("Error fetching services: ", error);
      }
    };
    fetchServices();
  }, []);

  // Fetch bookings
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
    // Find the corresponding service
    const service = services.find(service => service.id === item.serviceId);
    const serviceImage = service ? service.image : '';

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
        {serviceImage ? (
          <Image source={{ uri: serviceImage }} style={styles.image} />
        ) : (
          <Text>No Service Image Available</Text>
        )}
        <View style={styles.details}>
          <Text style={styles.name}>{item.serviceName}</Text>
          <Text style={styles.amount}>Selected Date: {item.selectedDate}</Text>

          <TouchableOpacity style={[styles.statusButton, statusStyle]}>
            <Text style={styles.statusButtonText}>{displayStatus}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.ellipsisButton} onPress={() => showDeleteOption(item.id)}>
          <Icon name="ellipsis-vertical" size={24} color="black" />
        </TouchableOpacity>

        {item.status === 'Completed' && !paymentPressed[item.id] && (
          <TouchableOpacity
            style={styles.paymentButton}
            onPress={() => {
              setPaymentPressed(prev => ({ ...prev, [item.id]: true }));
              navigation.navigate('Payment', {
                selectedDate: item.selectedDate,
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
