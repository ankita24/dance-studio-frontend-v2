import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { View, ScrollView, StyleSheet, Alert, Text } from 'react-native'
import { Profile as ProfileType, UserBookings } from '../types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../App'
import { IP_ADDRESS } from '@env'
import { Availability, Loader, Button } from '../partials'

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Studios' | 'ownerStep1' | 'ownerStep2' | 'home'
>

let start = new Date()
start.setHours(0, 0, 0, 0)

const addStartHours = 7 * 1000 * 3600
const addEndHours = 10 * 1000 * 3600

const addDefaultStartHours = start.getTime() + addStartHours
const addDefaultEndHours = start.getTime() + addEndHours

export default function Profile({ route, navigation }: Props) {
  const [id, setId] = useState<string | null>()
  const [typeOfUser, setTypeOfUser] = useState<string | null>('')
  const [profile, setProfile] = useState<ProfileType>()
  const [edit, setEdit] = useState(false)
  const [editableData, setEditableData] = useState<ProfileType>()
  const [bookings, setBookings] = useState<UserBookings[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@id')
      const type = await AsyncStorage.getItem('@type')
      setTypeOfUser(type)
      if (!value) navigation.navigate('home')
      setId(value)
    } catch (e) {
      // error reading value
    }
  }

  useEffect(() => {
    if (id) fetchProfile()
  }, [id])

  const fetchProfile = () => {
    setLoading(true)
    axios
      .get<{ user: ProfileType }>(`${IP_ADDRESS}/api/profile/${id}`)
      .then(response => {
        const {
          data: { user },
        } = response
        if (!!id) {
          if (typeOfUser === 'owner') {
            if (!user.location && !user.cost)
              navigation.navigate('ownerStep1', { id })
            else if (
              !user.rooms &&
              !user.area &&
              !user?.availabilty &&
              !user.availabilty?.length
            )
              navigation.navigate('ownerStep2', { id })
          } else {
            fetchPastBookings()
          }
          setProfile(user)
          setEditableData(user)
          setLoading(false)
        }
      })
      .catch(error => {
        console.error(error)
        setLoading(false)
      })
  }

  const fetchPastBookings = () => {
    if (!!id) {
      axios
        .get<{ data: UserBookings[] }>(`${IP_ADDRESS}/api/user-bookings/${id}`)
        .then(response => {
          setBookings(response.data.data)
        })
        .catch(er => {
          console.error(er)
        })
    }
  }

  const SaveDetails = () => {
    if (id) {
      axios
        .put<{ status: string; error: string }>(
          `${IP_ADDRESS}/api/owner/${id}`,
          editableData
        )
        .then(res => {
          if (res?.data?.status === 'error') {
            Alert.alert(res?.data?.error)
          } else {
            navigation.navigate('Profile', { id })
          }
        })
        .catch(e => console.error(e))
    }
  }

  if (loading) {
    return <Loader />
  }
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Time Slots</Text>
      {!edit ? (
        <Button
          title='Edit'
          color='#FF7083'
          onPress={() => setEdit(true)}
          androidButtonStyled={styles.androidButtonStyles}
        />
      ) : (
        <View style={[styles.flex, styles.alignSelfCenter]}>
          <Button
            color='#FF7083'
            title='Save'
            onPress={SaveDetails}
            androidButtonStyled={styles.androidButtonStyles}
          />
          <Button
            title='Cancel'
            color='#FF7083'
            onPress={() => {
              if (profile) {
                setEdit(false)
                const data = { ...profile }
                setEditableData({ ...data })
              }
            }}
            androidButtonStyled={styles.androidButtonStyles}
            touchOpacityStyles={{ marginLeft: 8 }}
          />
        </View>
      )}
      <View style={{ marginLeft: 13 }}>
        <Availability
          editableData={editableData}
          edit={edit}
          onStartChange={(date, index1, index2) => {
            if (!!date && editableData) {
              const arr = [...editableData?.availabilty]
              arr[index1].timings[index2].start = date
              setEditableData({
                ...editableData,
                availabilty: arr,
              })
            }
          }}
          onEndChange={(date, index1, index2, timing) => {
            if (!!editableData) {
              if (!!date && date.getTime() > timing.start.getTime()) {
                const arr = [...editableData.availabilty]
                arr[index1].timings[index2].end = date
                setEditableData({
                  ...editableData,
                  availabilty: arr,
                })
              } else {
                const arr = [...editableData.availabilty]
                arr[index1].timings[index2].end = timing.end
                setEditableData({
                  ...editableData,
                  availabilty: arr,
                })
              }
            }
          }}
          onAddition={(index1, index2, item) => {
            if (!!editableData) {
              const arr = [...editableData.availabilty]
              arr[index1].timings.push({
                start: new Date(
                  new Date(item.timings[index2].end).getTime() + addStartHours
                ),
                end: new Date(
                  new Date(item.timings[index2].end).getTime() + addEndHours
                ),
              })
              setEditableData({
                ...editableData,
                availabilty: arr,
              })
            }
          }}
          onRemove={(index1, index2) => {
            if (!!editableData) {
              const arr = [...editableData.availabilty]
              arr[index1].timings.splice(index2, 1)
              setEditableData({
                ...editableData,
                availabilty: arr,
              })
            }
          }}
          onFirstTimeAddition={item => {
            if (editableData) {
              setEditableData({
                ...editableData,
                availabilty: editableData.availabilty.map(i => {
                  if (i.day === item.day)
                    return {
                      day: item.day,
                      timings: [
                        {
                          start: new Date(addDefaultStartHours),
                          end: new Date(addDefaultEndHours),
                        },
                      ],
                    }
                  else return i
                }),
              })
            }
          }}
        />
      </View>
    </ScrollView>
  )
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignContent: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#FF7083',
    fontSize: 40,
    marginTop: 45,
    marginLeft: 28,
    marginBottom: 20,
  },
  textStyle: {
    fontSize: 14,
    color: '#030169',
  },
  fontWeight: {
    fontWeight: 'bold',
    marginRight: 6,
  },
  marginTop26: {
    marginTop: 25,
  },
  marginLeft28: {
    marginLeft: 28,
  },
  flex: {
    display: 'flex',
    flexDirection: 'row',
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
  androidButtonStyles: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    color: '#FF7083',
  },
})
