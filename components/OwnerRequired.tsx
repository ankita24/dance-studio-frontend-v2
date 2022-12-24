import React, { useState, useEffect, useRef } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,

  Alert,
  Platform,
} from 'react-native'
import axios from 'axios'
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from 'react-native-google-places-autocomplete'
import { UploadImage, Button } from '../partials'

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
  })
  const [image, setImage] = useState<string[]>([])

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
        const { location, cost, lat, long } = response?.data?.user
        if (!!location && !!cost && id) {
          navigation.navigate('ownerStep2', { id })
        } else
          setData({
            ...data,
            cost,
            lat,
            long
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
        <View style={styles.locationCtn}>
          <GooglePlacesAutocomplete
            placeholder='Search location'
            onPress={(data1, details) => {
              setData({
                ...data,
                lat: details?.geometry.location.lat ?? 0,
                long: details?.geometry.location.lng ?? 0,
                location: data1.description
              })
            }}
            query={{
              key: GOOGLE_MAPS_KEY,
              language: 'en',
            }}
            onFail={err => console.warn(err)}
            fetchDetails
            listUnderlayColor={'#D1D100'}
            textInputProps={{ style: styles.input }}
            renderRow={(rowData) => {
              const title = rowData.structured_formatting.main_text;
              const address = rowData.structured_formatting.secondary_text;
              return (
                <View>
                  <Text style={{ fontSize: 14 }}>{title}</Text>
                  <Text style={{ fontSize: 14 }}>{address}</Text>
                </View>
              );
            }}
          />
        </View>
        <Text style={[styles.label, styles.marginTop166]}>Rent (per hour)</Text>
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

        </View>
        <Text style={[styles.label, styles.marginTop20]}>
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
          <View style={styles.imageView}>
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
        <Button
          touchOpacityStyles={[styles.button, styles.marginTop20]}
          androidButtonStyled={{
            textAlign: 'center',
            fontSize: 16,
            color: !data.location && !data.cost ? 'grey' : '#fff',
          }}
          onPress={() => {
            if (!!data.location && !!data.cost && !!data.lat && !!data.long && image?.length) handleStepOne()
          }}
          title={'CONFIRM'}
          color='#fff'
          disabled={!data.location && !data.cost}
        />
        <Button
          touchOpacityStyles={{ marginRight: 22 }}
          androidButtonStyled={{
            marginTop: 22,
            textAlign: 'center',
            fontSize: 16,
            color: '#FF7083',
          }}
          onPress={() =>
            navigation.navigate('ownerStep2', { id: id ?? '' })
          }
          color={'#FF7083'}
          title={'Skip'}
          disabled={false}
        />
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
  marginTop20: {
    marginTop: 20,
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
    marginTop: -20,
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
    marginTop: 20,
  },
  hash: {
    fontSize: 40,
    paddingLeft: 8,
    paddingRight: 8,
    marginTop: -10,
    color: '#030169',
  },
  locationCtn: {
    display: 'flex',
    borderColor: '#030169',
    width: 290,
    flexDirection: 'row',
    padding: 4,
  },
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
})
