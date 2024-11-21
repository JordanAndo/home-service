import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { width: viewportWidth } = Dimensions.get('window');

  const [refreshing, setRefreshing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const sliderData = [
    { id: '1', image: require('../assets/image/Slider1.png') },
    { id: '2', image: require('../assets/image/Slider2.png') },
    { id: '3', image: require('../assets/image/Slider1.png') },
  ];

  const popularServicesData = [
    { id: '1', title: 'Floor Cleaning', image: require('../assets/image/Slider1.png'), screen: 'Cleaning Service' },
    { id: '2', title: 'Room Cleaning', image: require('../assets/image/Slider1.png'), screen: 'Cleaning Service' },
    { id: '3', title: 'Bathroom Cleaning', image: require('../assets/image/Slider1.png'), screen: 'Cleaning Service' },
  ];

  const categoriesData = [
    { id: '1', title: 'Cleaning', icon: 'cleaning-services', color: '#4CAF50', screen: 'Cleaning Service' },
    { id: '2', title: 'Repairing', icon: 'build', color: '#FF9800', screen: 'Repairing Service' },
    { id: '3', title: 'Plumbing', icon: 'water', color: '#2196F3', screen: 'Plumbing Service' },
    { id: '4', title: 'Painting', icon: 'brush', color: '#9C27B0', screen: 'Painting Service' },
  ];

  // Auto-slide the FlatList slider
  useEffect(() => {
    const interval = setInterval(() => {
      if (!refreshing) {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % sliderData.length;
          flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
          return nextIndex;
        });
      }
    }, 1000); // Slide every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [refreshing]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000); // Simulate data refresh delay
  }, []);

  const renderSliderItem = ({ item }) => (
    <View style={styles.slide(viewportWidth)}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
    </View>
  );

  const renderPopularServiceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.popularSlide(viewportWidth)}
      onPress={() => navigation.navigate(item.screen, { serviceName: item.title })}
    >
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.categoryContainer, { backgroundColor: item.color }]}
      onPress={() => navigation.navigate(item.screen)}
    >
      <Icon name={item.icon} size={30} color="white" />
      <Text style={styles.categoryTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Search services..." />
        <Icon name="search" size={20} color="#000" style={styles.icon} />
      </View>

      <Text style={styles.sectionTitle}>Special</Text>
      <FlatList
        ref={flatListRef}
        data={sliderData}
        renderItem={renderSliderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.slider}
      />

      <Text style={styles.sectionTitle}>Categories</Text>
      <FlatList
        data={categoriesData}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesList}
      />

      <Text style={styles.sectionTitle}>Popular Services</Text>
      <FlatList
        data={popularServicesData}
        renderItem={renderPopularServiceItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.popularSlider}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: 50,
  },
  searchInput: {
    height: 40,
    flex: 1,
  },
  icon: {
    marginLeft: 10,
  },
  categoriesList: {
    marginBottom: 10,
  },
  popularSlider: {
    marginBottom: 10,
  },
  categoryContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 20,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  categoryTitle: {
    marginTop: 5,
    fontSize: 14,
    color: 'white',
  },
  slider: {
    marginBottom: 10,
    marginTop: 10,
  },
  slide: (viewportWidth) => ({
    borderRadius: 5,
    height: 200,
    width: viewportWidth * 0.75,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:10,
  }),
  popularSlide: (viewportWidth) => ({
    backgroundColor: 'lightgray',
    borderRadius: 5,
    height: 200,
    width: viewportWidth * 0.75,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  }),
  image: {
    width: '100%',
    height: '80%',
    borderRadius: 5,
  },
  title: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    marginTop: 10,
  },
});

export default HomeScreen;
