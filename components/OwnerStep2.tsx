import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  Button,
  ScrollView,
  Alert,
} from 'react-native'
import { Entypo, MaterialIcons } from '@expo/vector-icons'
import axios from 'axios'
import { Card } from 'react-native-elements'
import DateTimePicker from '@react-native-community/datetimepicker'
import { AntDesign, FontAwesome } from '@expo/vector-icons'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../App'
import { IP_ADDRESS } from '@env'

type Props = NativeStackScreenProps<RootStackParamList, 'profile'>

var start = new Date()
start.setHours(0, 0, 0, 0)

const addStartHours = 2 * 1000 * 3600
const addEndHours = 5 * 1000 * 3600

const addDefaultStartHours = start.getTime() + addStartHours
const addDefaultEndHours = start.getTime() + addEndHours

export default function OwnerStep2({ route, navigation }: Props) {
  const { id } = route.params || {}
  const [focus, setFocus] = useState({ area: false, rooms: false })
  const [data, setData] = useState({
    area: 0,
    rooms: 0,
  })

  const [week, setWeek] = useState<
    { day: string; timings: { start: Date; end: Date }[]; enable: boolean }[]
  >([
    {
      day: 'Monday',
      timings: [],
      enable: false,
    },
    {
      day: 'Tuesday',
      timings: [],
      enable: false,
    },
    {
      day: 'Wednesday',
      timings: [],
      enable: false,
    },
    {
      day: 'Thursday',
      timings: [],
      enable: false,
    },
    {
      day: 'Friday',
      timings: [],
      enable: false,
    },
    {
      day: 'Saturday',
      timings: [],
      enable: false,
    },
    {
      day: 'Sunday',
      timings: [],
      enable: false,
    },
  ])
  const { area, rooms } = focus

  const handleStepTwo = () => {
    if (id) {
      const availabilty = week.map(({ enable, ...keepRest }) => keepRest)
      axios
        .put<{ status: string; error: string }>(
          `${IP_ADDRESS}/api/owner/${id}`,
          {
            ...data,
            availabilty,
          }
        )
        .then(res => {
          if (res?.data?.status === 'error') {
            Alert.alert(res?.data?.error)
          } else {
            navigation.navigate('profile', { id })
          }
        })
        .catch(e => console.error(e))
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Studio Information Step 2</Text>
      <StatusBar style='auto' />
      <View style={{ display: 'flex', flexDirection: 'row', width: 275 }}>
        <Entypo
          name='area-graph'
          size={30}
          color='grey'
          style={{ marginTop: 32 }}
        />
        <TextInput
          placeholderTextColor='grey'
          onBlur={() => setFocus({ ...focus, area: false })}
          onFocus={() => setFocus({ ...focus, area: true })}
          placeholder='Area(sq feet)'
          style={[
            styles.input,
            styles.marginTop25,
            area ? styles.yellow : null,
          ]}
          onChangeText={text => {
            if (!isNaN(Number(text))) setData({ ...data, area: Number(text) })
          }}
          keyboardType='number-pad'
          value={!!data.area ? data.area.toString() : ''}
        />
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', width: 275 }}>
        <MaterialIcons
          name='meeting-room'
          size={30}
          color='grey'
          style={{ marginTop: 32 }}
        />
        <TextInput
          placeholderTextColor='grey'
          onBlur={() => setFocus({ ...focus, rooms: false })}
          onFocus={() => setFocus({ ...focus, rooms: true })}
          placeholder='No of rooms'
          style={[
            styles.input,
            styles.marginTop25,
            rooms ? styles.yellow : null,
          ]}
          onChangeText={text => {
            if (!isNaN(Number(text))) setData({ ...data, rooms: Number(text) })
          }}
          keyboardType='number-pad'
          value={!!data.rooms ? data.rooms.toString() : ''}
        />
      </View>
      <View style={{ width: 275 }}>
        <Text style={{ marginTop: 32, fontWeight: 'bold' }}>
          Weekly Availabilty
        </Text>
        <ScrollView style={{ width: 275, height: 420 }}>
          {week.map((item, index1) => (
            <Card
              key={item.day}
              containerStyle={{ width: 285, marginLeft: -10 }}
            >
              <Card.Title>{item.day}</Card.Title>
              <Card.Divider />
              {item.enable ? (
                item.timings.map((timing, index2) => {
                  return (
                    <View
                      key={item.day + timing.start}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        margin: 0,
                        justifyContent: 'center',
                        marginTop: 10,
                      }}
                    >
                      <DateTimePicker
                        mode='time'
                        value={timing.start}
                        style={{ width: 90, padding: 0 }}
                        onChange={(e, date) => {
                          if (!!date) {
                            const arr = [...week]
                            arr[index1].timings[index2].start = date
                            setWeek(arr)
                          }
                        }}
                      />
                      <Text>-</Text>
                      <DateTimePicker
                        mode='time'
                        value={timing.end}
                        style={{ width: 90, padding: 0 }}
                        onChange={(e, date) => {
                          if (
                            !!date &&
                            date.getTime() > timing.start.getTime()
                          ) {
                            const arr = [...week]
                            arr[index1].timings[index2].end = date
                            setWeek(arr)
                          } else {
                            const arr = [...week]
                            arr[index1].timings[index2].end = timing.end
                            setWeek(arr)
                          }
                        }}
                      />
                      <AntDesign
                        name='pluscircleo'
                        size={20}
                        color='grey'
                        style={{ marginLeft: 10 }}
                        onPress={() => {
                          const arr = [...week]
                          arr[index1].timings.push({
                            start: new Date(
                              item.timings[index2].end.getTime() + addStartHours
                            ),
                            end: new Date(
                              item.timings[index2].end.getTime() + addEndHours
                            ),
                          })
                          setWeek(arr)
                        }}
                      />
                      <FontAwesome
                        name='remove'
                        size={20}
                        color='grey'
                        style={{ marginLeft: 10 }}
                        onPress={() => {
                          const arr = [...week]
                          arr[index1].timings.splice(index2, 1)
                          if (!arr[index1].timings.length)
                            arr[index1].enable = false
                          setWeek(arr)
                        }}
                      />
                    </View>
                  )
                })
              ) : (
                <Button
                  title='Add Time'
                  onPress={() => {
                    setWeek(
                      week.map(i => {
                        if (i.day === item.day)
                          return {
                            ...i,
                            enable: !item.enable,
                            timings: [
                              {
                                start: new Date(addDefaultStartHours),
                                end: new Date(addDefaultEndHours),
                              },
                            ],
                          }
                        else return i
                      })
                    )
                  }}
                />
              )}
            </Card>
          ))}
        </ScrollView>
      </View>

      <TouchableHighlight style={[styles.button, styles.marginTop10]}>
        <Button
          title='Next'
          color='#fff'
          onPress={handleStepTwo}
          disabled={!data.area && !data.rooms}
        />
      </TouchableHighlight>

      <TouchableHighlight>
        <Button
          color='#D1D100'
          title='Skip'
          onPress={() => navigation.navigate('profile', { id: id ?? '' })}
        />
      </TouchableHighlight>
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
    width: 250,
    borderBottomWidth: 1,
    borderRadius: 10,
    padding: 10,
    borderColor: 'grey',
    marginTop: -8,
    color: 'grey',
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
  marginTop10: {
    marginTop: 10,
  },
  title: {
    fontSize: 30,
    marginTop: 10,
  },
})
