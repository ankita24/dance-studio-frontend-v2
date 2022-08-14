import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
} from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import * as Location from 'expo-location'
import { MaterialIcons } from '@expo/vector-icons'
import axios from 'axios'
import { studiosDetails } from '../const'
import { Studio } from 'types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../App'
import { IP_ADDRESS, GOOGLE_MAPS_KEY } from '@env'
import { EvilIcons } from '@expo/vector-icons'
import { cloudinaryUrl } from '../utils'
import { useIsFocused } from '@react-navigation/native'
import EmptyStudios from '../images/EmptyStudios.png'

type Props = NativeStackScreenProps<RootStackParamList, 'studioDetails'>

export default function DanceStudios({ route, navigation }: Props) {
  let animVal = new Animated.Value(0)
  const [location, setLocation] = useState<{ lat: number; long: number }>({
    lat: 0,
    long: 0,
  })
  const isFocused = useIsFocused()
  useEffect(() => {
    handleCurrentLocation()
  }, [isFocused])

  useEffect(() => {
    if (!!location.lat && !!location.long) {
      getStudios()
    }
  }, [location])

  const [studios, setStudios] = useState(studiosDetails)

  const getStudios = () => {
    const { lat, long } = location
    axios
      .get<{ data: Studio[] }>(`${IP_ADDRESS}/api/studios`, {
        params: { lat, long },
      })
      .then(response => {
        console.log('user', response.data.data)
      })
      .catch(err => {
        console.error(err)
      })
  }

  const handleCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      return
    }
    Location.installWebGeolocationPolyfill()
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      if (coords)
        setLocation({
          lat: coords.latitude,
          long: coords.longitude,
        })
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <EvilIcons name='location' size={24} color='#FF7083' />
        <Text style={styles.title}>1C Lopamudra Enclave...</Text>
      </View>
      <View style={{ marginLeft: 44 }}>
        <View style={styles.locationCtn}>
          <GooglePlacesAutocomplete
            placeholder='Search location'
            onPress={(data1, details) => {
              setLocation({
                ...location,
                lat: details?.geometry.location.lat ?? 0,
                long: details?.geometry.location.lng ?? 0,
              })
            }}
            query={{
              /**
               * TODO: Keep the key in env variables
               */
              key: GOOGLE_MAPS_KEY,
              language: 'en',
            }}
            onFail={err => console.warn(err)}
            fetchDetails
            textInputProps={{ style: styles.input }}
          />
          <MaterialIcons
            name='my-location'
            size={24}
            color='#FF7083'
            style={styles.marginTop8}
            onPress={handleCurrentLocation}
          />
        </View>
        {location.lat !== 0 && studios.length ? (
          <FlatList
            key='_id'
            data={studios}
            style={{ marginBottom: 120 }}
            renderItem={({ item: studioItem }) => (
              <TouchableOpacity
                style={styles.listCtn}
                key={studioItem._id}
                onPress={() =>
                  navigation.navigate('studioDetails', { id: studioItem._id })
                }
              >
                <View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={10}
                    pagingEnabled
                    onScroll={Animated.event([
                      { nativeEvent: { contentOffset: { x: animVal } } },
                    ])}
                    style={styles.carousal}
                  >
                    {studioItem.images.length ? (
                      studioItem.images?.map(item => {
                        return (
                          <Image
                            source={{ uri: cloudinaryUrl(item) }}
                            style={styles.image}
                          />
                        )
                      })
                    ) : (
                      <View />
                    )}
                  </ScrollView>

                  <View style={styles.infoContent}>
                    <View>
                      <Text style={styles.danceClassName}>
                        {studioItem.name}
                      </Text>
                      <Text style={styles.distance}>
                        {studioItem.distance} kms
                      </Text>
                      <Text style={styles.cost}>
                        {studioItem.cost} ₹ / {studioItem.duration} hrs
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View>
            {/* <Image source={EmptyStudios} style={styles.imageStyle} /> */}
            <Text style={styles.noStudiosText}>
              No Studios Found around you
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    width: 300,
    marginLeft: 8,
    color: '#030169',
  },
  listCtn: {
    width: 300,
    height: 282,
    borderColor: '#030169',
    borderWidth: 1,
    marginTop: 30,
    borderRadius: 8,
  },
  infoContent: {
    width: 280,
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heading: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 8,
    marginTop: 65,
  },
  title: {
    color: '#030169',
  },
  locationCtn: {
    display: 'flex',
    flexDirection: 'row',
    width: 300,
    borderWidth: 1,
    borderColor: '#030169',
    marginLeft: 0,
    borderRadius: 8,
    marginTop: 28,
    padding: 4,
  },
  marginTop8: {
    marginTop: 8,
  },
  danceClassName: {
    fontWeight: 'bold',
    color: '#030169',
    fontSize: 24,
  },
  distance: {
    marginTop: 7,
    color: '#8F8F8F',
  },
  cost: {
    marginTop: 7,
    color: '#FF7083',
  },
  image: {
    width: 298,
    height: 156,
    borderRadius: 8,
  },
  carousal: {
    height: 156,
    width: 300,
  },
  imageStyle: {
    height: 400,
    width: 330,
    marginTop: 30,
    marginLeft: -15,
  },
  noStudiosText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#030169',
    marginLeft: -15,
  },
})
