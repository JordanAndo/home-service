import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { db } from '../Firebase/firebaseConfig';
import { collection, getDocs } from "firebase/firestore";

const PaintingService = () => {
  const [services, setServices] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const serviceSnapshot = await getDocs(collection(db, 'painting'));
        const servicesList = serviceSnapshot.docs.map(doc => {
          const data = doc.data();
          console.log("Service Data:", data); // Debugging: Check what data is being fetched
          return {
            id: doc.id,
            ...data,
            image: data.image || null,  // Ensure image URL is properly assigned
            relatedImages: data.relatedImages || [], // Fetch relatedImages array
          };
        });
        setServices(servicesList);
      } catch (error) {
        console.error("Error fetching services: ", error);
      }
    };

    fetchServices();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelectedItem(item);
        setModalVisible(true);
      }}
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.image} />
      ) : (
        <Text style={styles.noImageText}>No Image Available</Text>
      )}
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.amount}>${item.amount}</Text>
        <View style={styles.locationContainer}>
          <Icon name="location-pin" size={20} color="purple" />
          <Text style={styles.location}>{item.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRelatedService = ({ item }) => (
    <TouchableOpacity style={styles.relatedServiceContainer}>
      {item ? (
        <Image source={{ uri: item }} style={styles.relatedImage} />
      ) : (
        <Text style={styles.noImageText}>No Related Image</Text>
      )}
    </TouchableOpacity>
  );
return (
    <View style={styles.container}>
      <FlatList
        data={services}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      {selectedItem && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity style={styles.backButton} onPress={() => setModalVisible(false)}>
            <Icon name="arrow-back" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.header}>Service Details</Text>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {selectedItem.image ? (
                <Image source={{ uri: selectedItem.image }} style={styles.fullImage} />
              ) : (
                <Text style={styles.noImageText}>No Image Available</Text>
              )}
              <Text style={styles.subName}>{selectedItem.name}</Text>
              <Text style={styles.name}>Rs.{selectedItem.amount}</Text>
              <View style={styles.locationContainer}>
                <Icon name="location-pin" size={20} color="purple" />
                <Text style={styles.location}>{selectedItem.location}</Text>
              </View>
              <Text style={styles.aboutTitle}>Description</Text>
              <Text style={styles.aboutDescription}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
              </Text>

              {/* Button Container with Book Now */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.bookNowButton]}
                  onPress={() => navigation.navigate("Booking Screen", { selectedItem })}
                >
                  <Text style={styles.buttonText}>Book Now</Text>
                </TouchableOpacity>
              </View>

              {/* Related Services Section */}
              <Text style={styles.relatedHeader}>Related Services</Text>
              <FlatList
                data={selectedItem.relatedImages}
                renderItem={renderRelatedService}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.relatedServicesList}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};


// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 15,
    marginRight: 15,
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  amount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  backButton: {
    marginLeft: 10,
    marginTop: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 12,
    color: '#888',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    marginTop: -50,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  subName: {
    fontSize: 18,
    color: '#666',
    marginBottom: 5,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  aboutDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  button: {
    flex: 1,
    borderRadius: 5,
    paddingVertical: 10,
    marginHorizontal: 100,
  },
  bookNowButton: {
    backgroundColor: 'purple',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  relatedHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  relatedServiceContainer: {
    marginHorizontal: 5,
    alignItems: 'center',
  },
  relatedImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  relatedServicesList: {
    paddingVertical: 10,
  }
});

export default PaintingService;
