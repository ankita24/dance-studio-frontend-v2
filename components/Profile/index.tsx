import axios from 'axios'
import React, { useEffect, useState } from 'react'
import {
  Text,
  View,
  TextInput,
  TouchableHighlight,
  Button,
  Alert,
  ScrollView,
  FlatList,
} from 'react-native'
import { Profile as ProfileType, UserBookings } from '../../types'
import { getInitials } from '../../utils/helper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../App'
import { IP_ADDRESS } from '@env'
import { styles } from './styles'
import { RadioButton, Loader, UploadImage } from '../../partials'
import { useDispatch } from 'react-redux'
import { setType } from '../../redux/typeSlice'

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Studios' | 'ownerStep1' | 'ownerStep2' | 'home'
>

const currentTime = new Date().toLocaleTimeString('en-US', {
  hour: 'numeric',
  hour12: true,
  minute: 'numeric',
})

let start = new Date()
start.setHours(0, 0, 0, 0)

export default function Profile({ route, navigation }: Props) {
  const [id, setId] = useState<string | null>()
  const [typeOfUser, setTypeOfUser] = useState<string | null>('')
  const [profile, setProfile] = useState<ProfileType>()
  const [edit, setEdit] = useState(false)
  const [editableData, setEditableData] = useState<ProfileType>()
  const [bookings, setBookings] = useState<UserBookings[]>([])
  const [loading, setLoading] = useState(false)
  const isFocused = useIsFocused()
  const dispatch = useDispatch()

  useEffect(() => {
    getData()
  }, [isFocused])

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
          if (typeOfUser !== 'owner') {
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

  const handleTextChange = (key: string, value: string | boolean) => {
    if (!!editableData) {
      // if (['rent', 'duration', 'area', 'rooms'].includes(key))
      //   setEditableData({ ...editableData, [key]: Number(value) })
      setEditableData({ ...editableData, [key]: value })
    }
  }

  const fetchImage = (img: string) => {
    if (editableData)
      setEditableData({
        ...editableData,
        images: [...editableData.images, ...img],
      })
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
            fetchProfile()
            setEdit(false)
          }
        })
        .catch(e => console.error(e))
    }
  }

  const logOut = async () => {
    try {
      await AsyncStorage.removeItem('@id')
      await AsyncStorage.removeItem('@type')
      const id = await AsyncStorage.getItem('@id')
      const type = await AsyncStorage.getItem('@id')
      dispatch(setType(''))
      if (!id && !type) {
        // navigation.reset({
        //   index: 0,
        //   routes: [{ name: 'home' }],
        // })
        navigation.navigate('home')
        return true
      }
    } catch (exception) {
      console.error(exception)
      return false
    }
  }

  const renderStatus = (startTime: string, endTime: string, date: Date) => {
    if (date >= new Date()) {
      if (currentTime > endTime) {
        return 'Past Booking'
      } else if (currentTime > startTime) {
        return 'In Progress'
      }
      return 'Upcoming'
    }
    return 'Past Booking'
  }

  const formatDate = (date: Date | undefined) => {
    if (!!date)
      return `${new Date(date).getDate()}/${
        new Date(date).getMonth() + 1
      }/${new Date(date).getFullYear()}`
    return ''
  }
  if (loading) {
    return <Loader />
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.innerContainer}>
        {profile?.image || edit ? (
          <UploadImage
            image={editableData?.image}
            receiveImage={(image: string) => {
              if (editableData) setEditableData({ ...editableData, image })
            }}
            edit={edit}
          />
        ) : (
          <View style={styles.containerStyle}>
            <Text style={styles.profileText}>
              {getInitials(profile?.name ?? '')}
            </Text>
          </View>
        )}
      </View>

      {!edit ? (
        <Button title='Edit' color='#FF7083' onPress={() => setEdit(true)} />
      ) : (
        <View style={[styles.flex, styles.alignSelfCenter]}>
          <Button color='#FF7083' title='Save' onPress={SaveDetails} />
          <Button
            title='Cancel'
            color='#FF7083'
            onPress={() => {
              setEdit(false)
              setEditableData(profile)
            }}
          />
        </View>
      )}
      {profile ? (
        <ScrollView style={{ padding: 10 }}>
          <View style={styles.section}>
            <View style={[styles.marginBottom6, styles.flex]}>
              <Text style={[styles.fontWeight, styles.textStyle]}>Name:</Text>
              {edit ? (
                <TextInput
                  style={styles.inputStyle}
                  value={editableData?.name}
                  onChangeText={value => handleTextChange('name', value)}
                />
              ) : (
                <Text style={styles.textStyle}>{profile.name}</Text>
              )}
            </View>
            <View style={[styles.marginBottom6, styles.flex]}>
              <Text style={[styles.fontWeight, styles.textStyle]}>Email:</Text>
              <Text style={styles.textStyle}>{profile.email}</Text>
            </View>
            <View style={[styles.marginBottom6, styles.flex]}>
              <Text style={[styles.fontWeight, styles.textStyle]}>Phone:</Text>
              <Text style={styles.textStyle}>{profile.phone}</Text>
            </View>
            {profile.__t == 'OwnerSchema' && (
              <View style={[styles.marginBottom6, styles.flex]}>
                <Text style={[styles.fontWeight, styles.textStyle]}>
                  Location:
                </Text>
                <Text style={[styles.textStyle, styles.flexShrink]}>
                  {profile.location}
                </Text>
              </View>
            )}
          </View>
          {profile.__t == 'OwnerSchema' ? (
            <ScrollView>
              <View style={[styles.section, styles.marginTop26]}>
                <View style={[styles.marginBottom6, styles.flex]}>
                  <Text style={[styles.fontWeight, styles.textStyle]}>
                    Rent
                  </Text>
                  {edit ? (
                    <View style={styles.flexRow}>
                      <TextInput
                        value={editableData?.cost?.toString()}
                        onChangeText={value => handleTextChange('rent', value)}
                      />
                      <Text style={styles.textStyle}> Rs/</Text>
                    </View>
                  ) : (
                    <Text style={styles.textStyle}>{profile.cost} Rs/</Text>
                  )}
                  {edit ? (
                    <TextInput
                      value={editableData?.duration?.toString()}
                      onChangeText={value =>
                        handleTextChange('duration', value)
                      }
                    />
                  ) : (
                    <Text style={styles.textStyle}>{profile.duration}</Text>
                  )}
                  <Text style={styles.textStyle}>hrs</Text>
                </View>
                <View style={[styles.marginBottom6, styles.flex]}>
                  <Text style={[styles.fontWeight, styles.textStyle]}>
                    Area:
                  </Text>
                  {edit ? (
                    <TextInput
                      value={editableData?.area?.toString()}
                      onChangeText={value => handleTextChange('area', value)}
                    />
                  ) : (
                    <Text style={styles.textStyle}>{profile.area}</Text>
                  )}
                  <Text style={styles.textStyle}>sq ft</Text>
                </View>
                <View style={[styles.marginBottom6, styles.flex]}>
                  <Text style={[styles.fontWeight, styles.textStyle]}>
                    No of rooms:
                  </Text>
                  {edit ? (
                    <TextInput
                      value={editableData?.rooms?.toString()}
                      onChangeText={value => handleTextChange('rooms', value)}
                    />
                  ) : (
                    <Text style={styles.textStyle}>{profile.rooms}</Text>
                  )}
                </View>
                {!edit ? (
                  <>
                    <View style={[styles.marginBottom6, styles.flex]}>
                      <Text style={[styles.fontWeight, styles.textStyle]}>
                        Is Soundproof?:
                      </Text>

                      <Text style={styles.textStyle}>
                        {profile?.isSoundProof === true ? 'Yes' : 'No'}
                      </Text>
                    </View>
                    <View style={[styles.marginBottom6, styles.flex]}>
                      <Text style={[styles.fontWeight, styles.textStyle]}>
                        Has changing room?:
                      </Text>

                      <Text style={styles.textStyle}>
                        {profile?.hasChangingRoom === true ? 'Yes' : 'No'}
                      </Text>
                    </View>
                  </>
                ) : (
                  <View style={[styles.flexRow, styles.justifyContent]}>
                    <View>
                      <Text style={[styles.fontWeight, styles.textStyle]}>
                        Is Soundproof?:
                      </Text>

                      <RadioButton
                        value={editableData?.isSoundProof ?? false}
                        onUpdate={(isSoundProof: boolean) =>
                          handleTextChange('isSoundProof', isSoundProof)
                        }
                      />
                    </View>
                    <View>
                      <Text style={[styles.fontWeight, styles.textStyle]}>
                        Has changing room?:
                      </Text>
                      <RadioButton
                        value={editableData?.hasChangingRoom ?? false}
                        onUpdate={(hasChangingRoom: boolean) =>
                          handleTextChange('hasChangingRoom', hasChangingRoom)
                        }
                      />
                    </View>
                  </View>
                )}
              </View>
              <View style={[styles.marginTop26, styles.marginLeft28]}>
                <Text style={[styles.fontWeight, styles.textStyle]}>
                  Photos for users to see (min 2)
                </Text>
                <View
                  style={[
                    styles.flexRow,
                    styles.justifyContent,
                    styles.marginLeft75,
                  ]}
                >
                  {editableData?.images.map(item => {
                    return (
                      <UploadImage
                        squared
                        image={item}
                        receiveImage={fetchImage}
                        edit={edit}
                      />
                    )
                  })}
                  {!editableData?.images.length && !edit && (
                    <Text style={styles.noImagesText}>
                      Please edit and add images
                    </Text>
                  )}
                  {edit && (
                    <View style={{ marginLeft: 50 }}>
                      <UploadImage
                        addMore
                        edit={edit}
                        squared
                        image=''
                        receiveImage={fetchImage}
                      />
                    </View>
                  )}
                </View>
              </View>
            </ScrollView>
          ) : bookings.length ? (
            <>
              <Text
                style={[
                  styles.fontWeight,
                  styles.textStyle,
                  styles.marginTop26,
                  styles.marginLeft28,
                ]}
              >
                Bookings
              </Text>
              <FlatList
                key='_id'
                data={bookings}
                style={styles.listStyle}
                renderItem={({ item, index }) => {
                  const endTime = item.slot.slice(item.slot.indexOf('-') + 1)
                  const startTime = item.slot.slice(0, item.slot.indexOf('-'))
                  const status = renderStatus(startTime, endTime, item.date)
                  return (
                    <View
                      style={[styles.section, styles.marginTop40]}
                      key={index}
                    >
                      <View
                        style={[
                          styles.marginBottom10,
                          styles.tag,
                          status === 'Past Booking'
                            ? styles.green
                            : status === 'In Progress'
                            ? styles.yellow
                            : styles.red,
                        ]}
                      >
                        <Text style={styles.statusText}>{status}</Text>
                      </View>
                      <View style={{ width: '90%' }}>
                        <View style={[styles.marginBottom6, styles.flex]}>
                          <Text style={[styles.fontWeight, styles.textStyle]}>
                            Name:
                          </Text>
                          <Text style={styles.textStyle}>
                            {item.studioDetails?.name}
                          </Text>
                        </View>
                        <View style={[styles.marginBottom6, styles.flex]}>
                          <Text style={[styles.fontWeight, styles.textStyle]}>
                            Email:
                          </Text>
                          <Text style={styles.textStyle}>
                            {item.studioDetails?.email}
                          </Text>
                        </View>
                        <View style={[styles.marginBottom6, styles.flex]}>
                          <Text style={[styles.fontWeight, styles.textStyle]}>
                            Price:
                          </Text>
                          <Text style={styles.textStyle}>{item.price}</Text>
                        </View>
                        <View style={[styles.marginBottom6, styles.flex]}>
                          <Text style={[styles.fontWeight, styles.textStyle]}>
                            Date:
                          </Text>
                          <Text style={styles.textStyle}>
                            {formatDate(item.date)}
                          </Text>
                        </View>
                        <View style={[styles.marginBottom6, styles.flex]}>
                          <Text style={[styles.fontWeight, styles.textStyle]}>
                            Slot:
                          </Text>
                          <Text style={styles.textStyle}>{item.slot}</Text>
                        </View>
                      </View>
                    </View>
                  )
                }}
              />
            </>
          ) : (
            <View />
          )}
          <TouchableHighlight style={styles.logoutStyle}>
            <Button color='#FF7083' title='Log out' onPress={logOut} />
          </TouchableHighlight>
        </ScrollView>
      ) : (
        <TouchableHighlight style={styles.logoutStyle}>
          <Button color='#FF7083' title='Log out' onPress={logOut} />
        </TouchableHighlight>
      )}
    </ScrollView>
  )
}
