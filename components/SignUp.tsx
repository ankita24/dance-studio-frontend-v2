import React, { useState, useEffect, useRef } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  ScrollView,
  Platform,
} from 'react-native'
import axios from 'axios'
import { UploadImage, Button } from '../partials'
import { validateEmail, validPhone } from '../utils/helper'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../App'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { IP_ADDRESS } from '@env'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { Subscription } from 'expo-modules-core'

const noWeek = [
  { day: 'Monday', timings: [] },
  { day: 'Tuesday', timings: [] },
  { day: 'Wednesday', timings: [] },
  { day: 'Thursday', timings: [] },
  { day: 'Friday', timings: [] },
  { day: 'Saturday', timings: [] },
  { day: 'Sunday', timings: [] },
]

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

type Props = NativeStackScreenProps<RootStackParamList, 'ownerStep1' | 'login'>

export default function SignUp({ route, navigation }: Props) {
  const { type } = route.params || {}
  const [focus, setFocus] = useState({
    name: false,
    email: false,
    pwd: false,
    confirmPwd: false,
    phone: false,
  })

  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    image: '',
    phone: '',
  })

  const [expoPushToken, setExpoPushToken] = useState('')
  const [notification, setNotification] = useState<Notification | undefined>()
  const notificationListener = useRef<Subscription>()
  const responseListener = useRef<Subscription>()

  useEffect(() => {
    registerForPushNotificationsAsync().then(token =>
      setExpoPushToken(token ?? '')
    )

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(
      notification => {
        setNotification(notification)
      }
    )

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      response => {
        console.log(response)
      }
    )

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current)
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  const handleRegister = async () => {
    axios
      .post<{ status: string; error: string; response: { _id: string } }>(
        `${IP_ADDRESS}/api/register`,
        {
          name: data.name,
          email: data.email,
          password: data.password,
          image: data.image,
          phone: data.phone,
          type,
          /**
           * TODO: change below to expoPushToken
           */
          deviceToken: expoPushToken,
          availabilty: noWeek,
        }
      )
      .then(res => {
        if (res?.data?.status === 'error') {
          Alert.alert(res?.data?.error)
        } else {
          storeProfileId(res?.data.response._id).then(async () => {
            if (!!type) {
              if (type === 'owner') {
                await sendPushNotification(expoPushToken)
                navigation.navigate('ownerStep1', {
                  id: res?.data.response._id,
                })
              } else
                navigation.navigate('Studios', {
                  id: res?.data.response._id,
                })
            }
          })
        }
      })
      .catch(e => console.error(e))
  }

  const storeProfileId = async (id: string) => {
    try {
      await AsyncStorage.setItem('@id', id)
    } catch (e) {
      // saving error
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={{ marginLeft: 51, overflow: 'scroll', marginBottom: 25 }}
      >
        <Text style={styles.title}>Register</Text>
        <UploadImage
          receiveImage={(image: string) => setData({ ...data, image })}
          image={data.image}
        />
        <Text style={[styles.label, styles.marginTop16]}>Name</Text>
        <TextInput
          placeholderTextColor='grey'
          onBlur={() => setFocus({ ...focus, name: false })}
          onFocus={() => setFocus({ ...focus, name: true })}
          placeholder='Name'
          style={styles.input}
          onChangeText={text => setData({ ...data, name: text })}
          autoCorrect={false}
        />
        <Text style={[styles.label, styles.marginTop16]}>Phone</Text>
        <TextInput
          textContentType='telephoneNumber'
          placeholderTextColor='grey'
          onBlur={() => setFocus({ ...focus, phone: false })}
          onFocus={() => setFocus({ ...focus, phone: true })}
          placeholder='Phone'
          style={styles.input}
          onChangeText={text => setData({ ...data, phone: text })}
          autoCorrect={false}
        />
        {!validPhone(data.phone) && !!data.phone && !focus.phone ? (
          <Text style={{ color: 'red' }}>
            Please enter 10 digit valid phone number
          </Text>
        ) : null}

        <Text style={[styles.label, styles.marginTop16]}>Email</Text>
        <TextInput
          textContentType='emailAddress'
          placeholderTextColor='grey'
          autoCapitalize='none'
          autoCorrect={false}
          onBlur={() => setFocus({ ...focus, email: false })}
          onFocus={() => setFocus({ ...focus, email: true })}
          placeholder='Email'
          style={styles.input}
          onChangeText={text => {
            setData({ ...data, email: text })
          }}
        />

        {!validateEmail(data.email) && !!data.email && !focus.email ? (
          <Text style={{ color: 'red' }}>Email is invalid</Text>
        ) : null}
        <Text style={[styles.label, styles.marginTop16]}>Password</Text>
        <TextInput
          placeholderTextColor='grey'
          onBlur={() => setFocus({ ...focus, pwd: false })}
          onFocus={() => setFocus({ ...focus, pwd: true })}
          placeholder='Password'
          textContentType='password'
          secureTextEntry
          autoCapitalize='none'
          autoCorrect={false}
          style={styles.input}
          onChangeText={text => setData({ ...data, password: text })}
        />
        <Text style={[styles.label, styles.marginTop16]}>Confirm Password</Text>
        <TextInput
          placeholderTextColor='grey'
          onBlur={() => setFocus({ ...focus, confirmPwd: false })}
          onFocus={() => setFocus({ ...focus, confirmPwd: true })}
          placeholder='Confirm Password'
          textContentType='password'
          secureTextEntry
          autoCapitalize='none'
          autoCorrect={false}
          style={styles.input}
          onChangeText={text => setData({ ...data, confirmPassword: text })}
        />

        <Text style={{ color: 'red' }}>
          {data.confirmPassword && data.password !== data.confirmPassword
            ? `Password and confirm password should match`
            : ''}
        </Text>
        <Button
          title='SIGN UP'
          color='#fff'
          onPress={handleRegister}
          disabled={
            (!data.email &&
              !validateEmail(data.email) &&
              !data.name &&
              !data.password &&
              !data.confirmPassword &&
              !data.phone &&
              !validPhone(data.phone)) ||
            data.password !== data.confirmPassword ||
            !validateEmail(data.email) ||
            !validPhone(data.phone)
          }
          touchOpacityStyles={[styles.button, styles.marginTop25]}
          androidButtonStyled={{
            textAlign: 'center',
            marginTop: 10,
            fontSize: 16,
            color: (!data.email &&
              !validateEmail(data.email) &&
              !data.name &&
              !data.password &&
              !data.confirmPassword &&
              !data.phone &&
              !validPhone(data.phone)) ||
              data.password !== data.confirmPassword ||
              !validateEmail(data.email) ||
              !validPhone(data.phone) ? 'grey' : '#fff',
          }}
        />
        <Text style={[styles.marginTop10, styles.loginText]}>
          Not the first time?{' '}
          <Button
            color='#FF7083'
            title='Login!'
            onPress={() => navigation.navigate('login')}
            androidButtonStyled={{
              textAlign: 'center',
              marginTop: 10,
              fontSize: 16,
              color: '#FF7083',
            }}
            touchOpacityStyles={{ marginTop: -12 }}
          />
        </Text>
      </ScrollView>
    </View>
  )
}

async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
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

async function registerForPushNotificationsAsync() {
  let token
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!')
      return
    }
    token = (await Notifications.getExpoPushTokenAsync()).data
  } else {
    alert('Must use physical device for Push Notifications')
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  }

  return token
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030169',
  },
  input: {
    height: 56,
    width: 290,
    borderRadius: 24,
    padding: 20,
    color: 'grey',
    backgroundColor: '#fff',
  },
  button: {
    height: 63,
    width: 280,
    backgroundColor: '#FF7083',
    borderRadius: 50,
    padding: 10,
  },
  marginTop25: {
    marginTop: 25,
  },
  title: {
    color: '#FF7083',
    marginTop: 80,
    fontSize: 56,
  },
  label: {
    color: '#FF7083',
    marginBottom: 16,
    marginLeft: 10,
    fontSize: 17,
  },
  marginTop16: {
    marginTop: 16,
  },
  loginText: {
    color: '#fff',
    marginLeft: 50,
  },
  marginTop10: {
    marginTop: 10,
  }
})
