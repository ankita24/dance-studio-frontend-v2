import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  TouchableOpacity,
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

type Props = NativeStackScreenProps<RootStackParamList, 'studioDetails'>

export default function DanceStudios({ route, navigation }: Props) {
  const [location, setLocation] = useState({
    lat: 0,
    long: 0,
  })

  useEffect(() => {
    if (!!location.lat && !!location.long) getStudios()
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

  const handleCurrentLocation = () => {
    Location.installWebGeolocationPolyfill()
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      setLocation({
        lat: coords.latitude,
        long: coords.longitude,
      })
    })
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dance studios near me</Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: 250,
          marginTop: -75,
        }}
      >
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
          listUnderlayColor={'#D1D100'}
        />
        <MaterialIcons
          name='my-location'
          size={24}
          color='black'
          onPress={handleCurrentLocation}
        />
      </View>
      <FlatList
        key='_id'
        data={studios}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.listCtn}
            key={item._id}
            onPress={() =>
              navigation.navigate('studioDetails', { id: item._id })
            }
          >
            <View style={{ width: '80%' }}>
              <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
              <Text style={{ marginTop: 7 }}>
                {item.cost} ₹ / {item.duration} hrs
              </Text>
              <Text style={{ marginTop: 7 }}>{item.distance} kms</Text>
              <Text style={{ marginTop: 7 }} numberOfLines={2}>
                {item.location}
              </Text>
            </View>
            <Text>
              <Button
                title='Book'
                onPress={() => console.error('do something')}
              />
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: 300,
    borderBottomWidth: 1,
    borderRadius: 10,
    padding: 10,
    borderColor: 'grey',
    marginTop: -8,
    color: 'grey',
    marginLeft: -25,
  },
  button: {
    height: 40,
    width: 150,
    backgroundColor: '#000',
    borderRadius: 10,
  },
  title: {
    marginBottom: 100,
    fontSize: 30,
    width: 300,
    marginTop: 20,
  },
  listCtn: {
    display: 'flex',
    flexDirection: 'row',
    width: 300,
    height: 150,
    borderColor: 'grey',
    borderWidth: 1,
    marginTop: 30,
    padding: 10,
  },
})
