import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../App'
import axios from 'axios'
import { IP_ADDRESS } from '@env'
import { UserBookings } from 'types'
type Props = NativeStackScreenProps<RootStackParamList, 'studioDetails'>

export default function BookedClasses({ route }: Props) {
  const { params: { id } = {} } = route
  useEffect(() => {
    getBookingDetails()
  }, [])
  const [data, setData] = useState<UserBookings[] | undefined>()

  const getBookingDetails = () => {
    axios
      .get<{ data: UserBookings[] }>(`${IP_ADDRESS}/api/bookings/${id}`)
      .then(response => {
        setData(response.data.data)
      })
      .catch(er => {
        console.error(er)
      })
  }
  const current = new Date()
  const date = `${current.getDate()}/${
    current.getMonth() + 1
  }/${current.getFullYear()}`
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booked Classes</Text>
      <FlatList
        key='_id'
        data={data}
        renderItem={({ item }) => (
          <View style={styles.listCtn}>
            <View style={{ width: '90%' }}>
              <Text style={{ fontWeight: 'bold' }}>
                Studio: {item.studioDetails.name}
              </Text>
              <Text style={[styles.marginTop7, styles.email]}>
                {item.studioDetails.email}
              </Text>
              <Text style={styles.marginTop7}>₹ {item.price}</Text>
              <Text style={styles.marginTop7}>{date}</Text>
              <Text style={styles.marginTop7}>{item.slot}</Text>
              <Text style={styles.marginTop7} numberOfLines={2}>
                {item?.studioDetails?.location}
              </Text>
            </View>
          </View>
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
    height: 140,
    borderColor: 'grey',
    borderWidth: 1,
    marginTop: 30,
    padding: 10,
  },
  email: {
    fontStyle: 'italic',
    color: 'grey',
  },
  marginTop7: {
    marginTop: 7,
  },
})
