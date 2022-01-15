import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Button } from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import * as Location from 'expo-location'
import { MaterialIcons } from '@expo/vector-icons'

export default function DanceStudios() {
  const [location, setLocation] = useState({
    lat: 0,
    long: 0,
  })

  useEffect(() => {
    getStudios()
  }, [location])

  const getStudios = () => {
    /**
     * TODO: Api call to get studios
     */
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
      <Text style={styles.title}>Dance studios new me</Text>
      <View style={{ display: 'flex', flexDirection: 'row', width: 250 }}>
        <GooglePlacesAutocomplete
          placeholder='Search location'
          onPress={(data1, details) => {
            setLocation({
              ...location,
              lat: details?.geometry.location.lat ?? 0,
              long: details?.geometry.location.lng ?? 0,
            })
            console.log(data1)
          }}
          query={{
            /**
             * TODO: Keep the key in env variables
             */
            key: 'AIzaSyBygoa-D3AeuGajrVzOTRrFnNzkGTyZtjA',
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#171717',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  input: {
    height: 40,
    width: 250,
    borderBottomWidth: 1,
    borderRadius: 10,
    padding: 10,
    borderColor: 'grey',
    marginTop: -8,
    color: 'grey',
  },
  margin: {
    marginTop: 25,
  },
  yellow: {
    borderColor: '#D1D100',
  },
  button: {
    height: 40,
    width: 150,
    backgroundColor: '#000',
    borderRadius: 10,
  },
  marginTop25: {
    marginTop: 25,
  },
  signUpText: {
    // color: '#fff',
  },
  lastText: {
    fontWeight: 'bold',
  },
  title: {
    // color: '#fff',
    marginBottom: 100,
    fontSize: 50,
    marginRight: 150,
  },
  costWidth: {
    width: 60,
  },
  imageView: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
    width: 320,
    justifyContent: 'space-between',
  },
  flexStart: {
    justifyContent: 'space-evenly',
  },
})
