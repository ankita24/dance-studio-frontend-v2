import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native'
import axios from 'axios'
import { IP_ADDRESS } from '@env'
import { StudioBookings } from 'types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Loader } from '../partials'
import EmptyStudios from '../images/EmptyStudios.png'

export default function BookedClasses() {
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true,
    minute: 'numeric',
  })
  const [id, setId] = useState<string | null>()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchId()
  }, [])

  const fetchId = async () => {
    const type = await AsyncStorage.getItem('@id')
    setId(type)
  }
  useEffect(() => {
    getBookingDetails()
  }, [id])
  const [data, setData] = useState<StudioBookings[] | undefined>()

  const getBookingDetails = () => {
    if (!!id) {
      setLoading(true)
      axios
        .get<{ data: StudioBookings[] }>(
          `${IP_ADDRESS}/api/studio-bookings/${id}`
        )
        .then(response => {
          setData(response.data.data)
        })
        .catch(er => {
          console.error(er)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  const formatDate = (date: Date | undefined) => {
    if (!!date)
      return `${new Date(date).getDate()}/${
        new Date(date).getMonth() + 1
      }/${new Date(date).getFullYear()}`
    return ''
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

  if (loading) {
    return <Loader />
  }

  return data && data.length ? (
    <ScrollView style={styles.container}>
      <FlatList
        key='_id'
        data={data}
        style={styles.listStyle}
        renderItem={({ item, index }) => {
          const endTime = item.slot.slice(item.slot.indexOf('-') + 1)
          const startTime = item.slot.slice(0, item.slot.indexOf('-'))
          const status = renderStatus(startTime, endTime, item.date)
          return (
            <View style={styles.listCtn} key={index}>
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
                <Text style={{ color: '#fff', textAlign: 'center' }}>
                  {status}
                </Text>
              </View>
              <View style={{ width: '90%' }}>
                <View style={[styles.marginBottom6, styles.flex]}>
                  <Text style={[styles.fontWeight, styles.textStyle]}>
                    Name:
                  </Text>
                  <Text style={styles.textStyle}>{item.userDetails?.name}</Text>
                </View>
                <View style={[styles.marginBottom6, styles.flex]}>
                  <Text style={[styles.fontWeight, styles.textStyle]}>
                    Email:
                  </Text>
                  <Text style={styles.textStyle}>
                    {item.userDetails?.email}
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
                  <Text style={styles.textStyle}>{formatDate(item.date)}</Text>
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
    </ScrollView>
  ) : (
    <View style={styles.container}>
      <Image source={EmptyStudios} style={styles.imageStyle} />
      <Text style={styles.noStudiosText}>No Previous Bookings</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignContent: 'center',
  },
  listStyle: {
    alignSelf: 'center',
    paddingBottom: 40,
  },
  listCtn: {
    marginTop: 40,
    width: 320,
    minHeight: 150,
    borderColor: '#FF7083',
    borderRadius: 8,
    alignSelf: 'center',
    shadowColor: '#FF7083',
    shadowOpacity: 0.7,
    backgroundColor: '#fff',
    elevation: 12,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    borderWidth: 1,
    padding: 20,
  },
  marginBottom6: {
    marginBottom: 6,
  },
  marginBottom10: {
    marginBottom: 10,
  },
  textStyle: {
    fontSize: 14,
    color: '#030169',
  },
  flex: {
    display: 'flex',
    flexDirection: 'row',
  },
  fontWeight: {
    fontWeight: 'bold',
    marginRight: 6,
  },
  tag: {
    width: 110,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    textAlign: 'center',
  },
  red: {
    backgroundColor: '#FF6F91',
  },
  green: {
    backgroundColor: '#A8A8A8',
  },
  yellow: {
    backgroundColor: '#FFD700',
  },
  imageStyle: {
    height: 400,
    width: 330,
    marginTop: 30,
    marginLeft: 25,
  },
  noStudiosText: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#030169',
    marginLeft: -15,
  },
})
