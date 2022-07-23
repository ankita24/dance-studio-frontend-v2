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
  'signup' | 'Profile' | 'login'
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
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Studio Information</Text>
        <Text style={[styles.label, styles.marginTop16]}>Search Location</Text>
        <View>
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
        <Text style={[styles.label, styles.marginTop166]}>Rent</Text>
        <View style={styles.cost}>
          <TextInput
            placeholderTextColor='grey'
            onBlur={() => setFocus({ ...focus, cost: false })}
            onFocus={() => setFocus({ ...focus, cost: true })}
            placeholder='Cost'
            style={[styles.input, styles.margin, styles.costWidth]}
            onChangeText={text => setData({ ...data, cost: Number(text) })}
            value={data?.cost?.toString() ?? ''}
          />
          <Text style={styles.hash}>/</Text>
          <TextInput
            placeholderTextColor='grey'
            onBlur={() => setFocus({ ...focus, cost: false })}
            onFocus={() => setFocus({ ...focus, cost: true })}
            placeholder='hour'
            style={[styles.input, styles.margin, styles.costWidth]}
            onChangeText={text => {
              setData({ ...data, hour: !!text ? Number(text) : 0 })
            }}
            value={data.hour?.toString()}
            keyboardType='numeric'
          />
        </View>
        <Text style={[styles.label, styles.marginTop30]}>
          Upload Studio Image
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
          <View style={[styles.imageView, styles.justifyContent]}>
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
        <TouchableHighlight style={[styles.button, styles.marginTop49]}>
          <Button
            title='CONFIRM'
            color='#fff'
            onPress={handleStepOne}
            disabled={!data.location && !data.cost}
          />
        </TouchableHighlight>
        <TouchableHighlight>
          <Button
            color='#FF7083'
            title='Skip'
            onPress={() => navigation.navigate('Studios', { id: id ?? '' })} //change this
          />
        </TouchableHighlight>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: { marginLeft: 40, marginTop: 50 },
  input: {
    height: 56,
    width: 290,
    borderRadius: 24,
    padding: 20,
    marginTop: -8,
    color: 'grey',
    backgroundColor: '#fff',
    borderColor: '#030169',
    borderWidth: 1,
  },
  cost: {
    display: 'flex',
    flexDirection: 'row',
    width: 275,
  },
  margin: {
    marginTop: -10,
  },
  button: {
    height: 63,
    width: 280,
    backgroundColor: '#FF7083',
    borderRadius: 50,
    padding: 10,
    marginLeft: 20,
  },
  marginTop49: {
    marginTop: 49,
  },
  title: {
    color: '#FF7083',
    fontSize: 40,
  },
  costWidth: {
    width: 109,
  },
  imageView: {
    display: 'flex',
    flexDirection: 'row',
    width: 250,
    marginLeft: 51,
    alignContent: 'center',
    justifyContent: 'space-between',
    marginTop: -10,
  },
  justifyContent: {
    justifyContent: 'space-evenly',
  },
  label: {
    color: '#030169',
    marginBottom: 20,
    marginLeft: 10,
    fontSize: 17,
  },
  marginTop16: {
    marginTop: 16,
  },
  marginTop166: {
    marginTop: 70,
  },
  marginTop30: {
    marginTop: 30,
  },
  hash: {
    fontSize: 40,
    paddingLeft: 8,
    paddingRight: 8,
    marginTop: -10,
    color: '#030169',
  },
})
