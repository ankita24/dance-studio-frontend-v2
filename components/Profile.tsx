import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  Button,
} from 'react-native'
import { Profile as ProfileType } from '../types'
import { cloudinaryUrl } from '../utils'
import { getInitials } from '../utils/helper'
import { Avatar } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function Profile({
  route: {
    params: { id },
  },
}: {
  route: { params: { id: number } }
}) {
  const navigate = useNavigation()
  const [profile, setProfile] = useState<ProfileType>()
  const [edit, setEdit] = useState(false)
  const [editableData, setEditableData] = useState<ProfileType | undefined>()

  useEffect(() => {
    fetchProfile()
    getData()
  }, [])

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('id')
      if (value !== null) {
        navigation.navigate('profile', { id: value })
      }
    } catch (e) {
      // error reading value
    }
  }

  const fetchProfile = () => {
    axios
      .get(`http://192.168.29.91:9999/api/profile/${id}`)
      .then(response => {
        setProfile(response.data.user)
        setEditableData(response.data.user)
      })
      .catch(error => console.error(error))
  }

  const handleTextChange = (key: string, value: string) => {
    if (!!editableData) {
      // if (['rent', 'duration', 'area', 'rooms'].includes(key))
      //   setEditableData({ ...editableData, [key]: Number(value) })
      setEditableData({ ...editableData, [key]: value })
    }
  }

  const SaveDetails = () => {
    if (id) {
      axios
        .put(`http://192.168.29.91:9999/api/owner/${id}`, editableData)
        .then(res => {
          if (res?.data?.status === 'error') {
            Alert.alert(res?.data?.error)
          } else {
            fetchProfile()
            setEdit(false)
          }
        })
        .catch(e => console.log(e))
    }
  }

  const logOut = async () => {
    try {
      await AsyncStorage.removeItem('@id')
      navigate.navigate('home')
      return true
    } catch (exception) {
      console.error(exception)
      return false
    }
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, styles.marginBottom20]}>
        Studio Information
      </Text>
      {!edit ? (
        <Button title='Edit' onPress={() => setEdit(true)} />
      ) : (
        <View style={styles.flex}>
          <Button title='Save' onPress={SaveDetails} />
          <Button
            title='Cancel'
            onPress={() => {
              setEdit(false)
              setEditableData(profile)
            }}
          />
        </View>
      )}
      {profile ? (
        <View style={{ padding: 10 }}>
          <Avatar
            title={
              profile.image
                ? cloudinaryUrl(profile.image)
                : getInitials(profile.name)
            }
            rounded
            containerStyle={{
              backgroundColor: '#D1D100',
              alignSelf: 'center',
              marginBottom: 30,
            }}
            size={100}
          />

          <View style={[styles.marginBottom20, styles.flex]}>
            <Text style={[styles.fontWeight, styles.textSize]}>Name:</Text>
            {edit ? (
              <TextInput
                style={{ height: 20, width: 100 }}
                value={editableData?.name}
                onChangeText={value => handleTextChange('name', value)}
              />
            ) : (
              <Text style={styles.textSize}>{profile.name}</Text>
            )}
          </View>
          <Text style={[styles.marginBottom20, styles.textSize]}>
            <Text style={[styles.fontWeight, styles.textSize]}>Email:</Text>
            {profile.email}
          </Text>
          {profile.__t == 'OwnerSchema' && (
            <View>
              <Text style={[styles.marginBottom20, styles.textSize]}>
                <Text style={[styles.fontWeight, styles.textSize]}>
                  Location:
                </Text>
                {profile.location}
              </Text>
              <View style={[styles.marginBottom20, styles.flex]}>
                <Text style={[styles.fontWeight, styles.textSize]}>Rent</Text>
                {edit ? (
                  <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <TextInput
                      value={editableData?.cost.toString()}
                      onChangeText={value => handleTextChange('rent', value)}
                    />
                    <Text style={styles.textSize}> Rs/</Text>
                  </View>
                ) : (
                  <Text style={styles.textSize}>{profile.cost} Rs/</Text>
                )}
                {edit ? (
                  <TextInput
                    value={editableData?.duration.toString()}
                    onChangeText={value => handleTextChange('duration', value)}
                  />
                ) : (
                  <Text style={styles.textSize}>{profile.duration}</Text>
                )}
                <Text style={styles.textSize}>hrs</Text>
              </View>
              <View style={[styles.marginBottom20, styles.flex]}>
                <Text style={[styles.fontWeight, styles.textSize]}>Area:</Text>
                {edit ? (
                  <TextInput
                    value={editableData?.area.toString()}
                    onChangeText={value => handleTextChange('area', value)}
                  />
                ) : (
                  <Text style={styles.textSize}>{profile.area}</Text>
                )}
                <Text style={styles.textSize}>sq ft</Text>
              </View>
              <View style={[styles.marginBottom20, styles.flex]}>
                <Text style={[styles.fontWeight, styles.textSize]}>
                  No of rooms:
                </Text>
                {edit ? (
                  <TextInput
                    value={editableData?.rooms.toString()}
                    onChangeText={value => handleTextChange('rooms', value)}
                  />
                ) : (
                  <Text style={styles.textSize}>{profile.rooms}</Text>
                )}
              </View>
            </View>
          )}
          <TouchableHighlight >
            <Button title='Log out' color='#fff' onPress={logOut} />
          </TouchableHighlight>
        </View>
      ) : (
        <View />
      )}
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
  title: {
    // color: '#fff',

    fontSize: 50,
    marginRight: 150,
  },
  marginBottom20: {
    marginBottom: 30,
  },
  textSize: {
    fontSize: 20,
  },
  input: {
    height: 40,
    width: 250,
    borderBottomWidth: 1,
    borderRadius: 10,
    padding: 10,
    borderColor: 'yellow',
    marginTop: -8,
    color: 'black',
  },
  flex: {
    display: 'flex',
    flexDirection: 'row',
  },
  fontWeight: {
    fontWeight: 'bold',
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
})
