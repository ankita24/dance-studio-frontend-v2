import { StatusBar } from 'expo-status-bar'
import React, { useState, useEffect, useRef } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  Button,
  Alert,
} from 'react-native'
import { Entypo } from '@expo/vector-icons'
import axios from 'axios'
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete'
import UploadImage from '../partials/UploadImage'

import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../App'
import { Profile } from 'types'
import { IP_ADDRESS, GOOGLE_MAPS_KEY } from '@env'

type Props = NativeStackScreenProps<
  RootStackParamList,
  'signup' | 'profile' | 'login'
>

export default function OwnerRequired({ route, navigation }: Props) {
  const ref = useRef<GooglePlacesAutocompleteRef | null>(null)

  const { id } = route.params || {}
  const [focus, setFocus] = useState({ cost: false, location: false })
  const [data, setData] = useState({
    cost: 0,
    location: '',
    lat: 0,
    long: 0,
    hour: 0,
  })
  const [image, setImage] = useState<string[]>([])
  const { location, cost } = focus

  useEffect(() => {
    fetchProfile()
  }, [])

  useEffect(() => {
    ref.current?.setAddressText(data.location)
  }, [])

  const fetchProfile = () => {
    axios
      .get<{ user: Profile }>(`${IP_ADDRESS}/api/profile/${id}`)
      .then(response => {
        const { location, cost, lat, long, duration } = response?.data?.user
        /**
         * TODO: Add images also(min 2) in the query.
         * TODO: Check what is the place to check the ownerStep1, ownerStep2 and profile.
         */
        if (!!location && !!cost && !!duration && id) {
          navigation.navigate('ownerStep2', { id })
        } else
          setData({
            ...data,
            location,
            cost,
            lat,
            long,
            hour: duration,
          })
      })
      .catch(error => console.error(error))
  }

  const handleStepOne = () => {
    const ownerStep1Data = { ...data, images: image }
    if (id) {
      axios
        .put<{ status: string; error: string }>(
          `${IP_ADDRESS}/api/owner/${id}`,
          ownerStep1Data
        )
        .then(res => {
          if (res?.data?.status === 'error') {
            Alert.alert(res?.data?.error)
          } else {
            if (id) navigation.navigate('ownerStep2', { id })
          }
        })
        .catch(e => console.error(e))
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Studio Information</Text>
      <StatusBar style='auto' />
      <View
        style={{ display: 'flex', flexDirection: 'row', marginLeft: 57 }}
        focusable
      >
        <Entypo
          name='location'
          size={30}
          color={location ? '#D1D100' : 'grey'}
        />
        <GooglePlacesAutocomplete
          ref={ref}
          placeholder='Search location'
          onPress={(data1, details) => {
            setData({
              ...data,
              location: details?.formatted_address ?? '',
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
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', width: 275 }}>
        <Entypo
          name='price-tag'
          size={30}
          color='grey'
          style={{ marginTop: 32 }}
        />
        <TextInput
          placeholderTextColor='grey'
          onBlur={() => setFocus({ ...focus, cost: false })}
          onFocus={() => setFocus({ ...focus, cost: true })}
          placeholder='rent'
          style={[
            styles.input,
            styles.margin,
            styles.costWidth,
            cost ? styles.yellow : null,
          ]}
          onChangeText={text => setData({ ...data, cost: Number(text) })}
          value={data?.cost?.toString() ?? ''}
        />
        <Text style={{ marginTop: 32, fontSize: 19 }}>/</Text>
        <TextInput
          placeholderTextColor='grey'
          onBlur={() => setFocus({ ...focus, cost: false })}
          onFocus={() => setFocus({ ...focus, cost: true })}
          placeholder='hour'
          style={[
            styles.input,
            styles.margin,
            styles.costWidth,
            cost ? styles.yellow : null,
          ]}
          onChangeText={text => {
            setData({ ...data, hour: !!text ? Number(text) : 0 })
          }}
          value={data.hour?.toString()}
          keyboardType='numeric'
        />
      </View>
      <Text style={{ marginTop: 32, fontWeight: 'bold' }}>
        Upload Studio Image (min 2)
      </Text>
      <View style={styles.imageView}>
        <UploadImage
          receiveImage={(data: string) => setImage([...image, data])}
          squared
          image={image.length >= 1 ? image[0] : ''}
        />
        <UploadImage
          receiveImage={(data: string) => setImage([...image, data])}
          squared
          image={image.length >= 2 ? image[1] : ''}
        />
        {image.length < 3 ? (
          <UploadImage
            receiveImage={(data: string) => setImage([...image, data])}
            squared
            addMore
            image={''}
          />
        ) : (
          image.map((item, index) =>
            index === 2 ? (
              <UploadImage
                key={item}
                receiveImage={(data: string) => setImage([...image, data])}
                squared
                image={item}
              />
            ) : null
          )
        )}
      </View>
      {image.length >= 3 ? (
        <View style={[styles.imageView, styles.flexStart]}>
          {image.map((item, index) =>
            index >= 3 ? (
              <UploadImage
                key={item}
                receiveImage={(data: string) => setImage([...image, data])}
                squared
                image={item}
              />
            ) : null
          )}
          {image.length !== 6 ? (
            <UploadImage
              receiveImage={(data: string) => setImage([...image, data])}
              squared
              addMore
              image={''}
            />
          ) : null}
        </View>
      ) : null}
      <TouchableHighlight style={[styles.button, styles.marginTop25]}>
        <Button
          title='Next'
          color='#fff'
          onPress={handleStepOne}
          disabled={!data.location && !data.cost}
        />
      </TouchableHighlight>

      <TouchableHighlight>
        <Button
          color='#D1D100'
          title='Skip'
          onPress={() => navigation.navigate('ownerStep2', { id: id ?? '' })} //change this
        />
      </TouchableHighlight>
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
