import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView, Image, Animated
} from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../App'
import axios from 'axios'
import { StudioWithSlots } from 'types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { IP_ADDRESS } from '@env'
import { cloudinaryUrl } from '../utils'
import { Button } from '../partials'

const currentTime = new Date().toLocaleTimeString('en-US', {
  hour: 'numeric',
  hour12: true,
  minute: 'numeric',
})

type Props = NativeStackScreenProps<RootStackParamList, 'studioDetails'>

export default function StudioDetails({ route, navigation }: Props) {
  const { params: { id } = {} } = route
  const [studio, setStudios] = useState<StudioWithSlots | undefined>()
  const [userId, setUserId] = useState('')
  let animVal = new Animated.Value(0)

  useEffect(() => {
    getUserId()
  }, [])
  useEffect(() => {
    axios
      .get<{ studioDetails: StudioWithSlots }>(`${IP_ADDRESS}/api/studio/${id}`)
      .then(response => {
        setStudios(response.data.studioDetails)
      })
      .catch(err => {
        console.error(err)
      })
  }, [id])

  const getUserId = async () => {
    const value = await AsyncStorage.getItem('@id')
    setUserId(value ?? '')
  }
  const [selectedSlot, setSelectedSlot] = useState<number | undefined>()

  const handleBooking = () => {
    //call api to send userId, ownerId, timings
    if (selectedSlot || selectedSlot === 0) {
      axios
        .post(`${IP_ADDRESS}/api/booking/${id}`, {
          userId,
          slot: studio?.slots[selectedSlot],
          price: studio?.cost,
          date: new Date(),
        })
        .then(async response => {
          if (response.status === 200) {
            await sendPushNotification(
              studio?.deviceToken ?? '',
              `${studio?.slots[selectedSlot]} booked for today`
            )
            navigation.navigate('Profile', { id: userId })
          }
        })
        .catch(e => {
          console.error('oops')
        })
    }
  }

  function to24HrTime(time: any) {
    let [hr, min, ap] = time.toLowerCase().match(/\d+|[a-z]+/g) || []
    return `${(hr % 12) + (ap == 'am' ? 0 : 12)}:${min}`
  }

  const toShow = (endTime: string) => {
    const endFullhour = to24HrTime(endTime)
    const currentTimeHour = to24HrTime(currentTime)
    if (currentTimeHour > endFullhour) {
      return false
    }
    return true
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <View />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={10}
          pagingEnabled
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { x: animVal } } },
          ])}
          style={styles.carousal}
        >
          {studio?.images.length ? (
            studio?.images?.map(item => {
              return (
                <Image
                  source={{ uri: cloudinaryUrl(item) }}
                  style={styles.image}
                />
              )
            })
          ) : (
            <View />
          )}
        </ScrollView>
        <View style={styles.innerContainer}>

          <View
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'row',
              width: 340,
            }}
          >

            <Text style={{ fontSize: 24, color: '#030169' }}>
              {studio?.name}
            </Text>
            <Text style={{ fontSize: 20, color: '#8F8F8F' }}>
              {studio?.distance ?? '4kms'}
            </Text>
          </View>
          <Text style={styles.infoCtn}>{studio?.location}</Text>
          <Text style={styles.cost}>र {studio?.cost} / 1 hour</Text>
          <View style={{ marginTop: 30 }}>
            <Text style={styles.subPara}>Area: {studio?.area} sq ft</Text>
            <Text style={[styles.subPara, styles.marginTop5]}>
              Is Soundproof?: {studio?.isSoundProof ?? 'No'}
            </Text>
            <Text style={[styles.subPara, styles.marginTop5]}>
              Has changing room?: {studio?.hasChangingRoom ?? 'No'}
            </Text>
          </View>
          <Text style={[styles.subPara, styles.marginTop30]}>Book Slot</Text>
          <View style={styles.flexTag}>
            {studio?.slots.map((item, index) => {
              const endTime = item.slice(item.indexOf('-') + 1)
              const status = toShow(endTime)
              if (status)
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.tag,
                      (selectedSlot || selectedSlot === 0) &&
                        index === selectedSlot
                        ? styles.selectedTag
                        : styles.notSelectedTag,
                    ]}
                    onPress={() => setSelectedSlot(index)}
                  >
                    <Text
                      style={{
                        padding: 9,
                        color:
                          (selectedSlot || selectedSlot === 0) &&
                            index === selectedSlot
                            ? '#fff'
                            : '#FF7083',
                      }}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                )
            })}
          </View>
          <Button
            title='BOOK'
            color='#fff'
            onPress={handleBooking}
            disabled={!selectedSlot && selectedSlot !== 0}
            touchOpacityStyles={[styles.button, styles.marginTop25]}
            androidButtonStyled={{
              textAlign: 'center',
              marginTop: 10,
              fontSize: 16,
              color: !selectedSlot && selectedSlot !== 0 ? 'grey' : '#fff',
            }}
          />
        </View>
      </View>
    </ScrollView>
  )
}

async function sendPushNotification(expoPushToken: string, slot: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: `${slot} booked`,
    body: 'Please check Booking tabs for more details',
    data: { someData: 'goes here' },
  }

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  })
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    paddingBottom: 50,
  },
  innerContainer: {
    padding: 15,
  },
  tag: {
    backgroundColor: 'silver',
    width: '48%',
    marginTop: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  flexTag: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  infoCtn: {
    fontSize: 16,
    marginTop: 5,
    color: '#8F8F8F',
  },
  cost: {
    color: '#FF7083',
    fontSize: 16,
    marginTop: 5,
  },
  selectedTag: {
    backgroundColor: '#FF7083',
    color: '#fff',
  },
  button: {
    height: 63,

    backgroundColor: '#FF7083',
    borderRadius: 50,
    padding: 10,
  },
  marginTop25: {
    marginTop: 25,
  },
  subPara: {
    color: '#030169',
    fontSize: 16,
  },
  marginTop5: {
    marginTop: 5,
  },
  marginTop30: {
    marginTop: 30,
  },
  notSelectedTag: {
    borderWidth: 1,
    borderColor: '#FF7083',
    backgroundColor: '#fff',
  },
  image: {
    width: 400,
    height: 300,
  },
  carousal: {
    height: 156,
  },
})
