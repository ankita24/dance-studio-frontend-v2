import React, { useState } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  Alert,
  Button,
} from 'react-native'
import axios from 'axios'
import { validateEmail } from '../utils/helper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Profile } from 'types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../App'
import { IP_ADDRESS } from '@env'

type Props = NativeStackScreenProps<RootStackParamList>

export default function Login({ route, navigation }: Props) {
  const [focus, setFocus] = useState({ pwd: false, user: false })
  const [data, setData] = useState({ pwd: '', email: '' })

  const handleLogin = async () => {
    axios
      .post<
        | {
            status?: 'error' | 'ok'
            id: string
            type: 'owner' | 'user'
            user: Profile
            error: string
          }
        | undefined
      >(
        `${IP_ADDRESS}/api/login`,

        {
          email: data.email.trim(),
          password: data.pwd,
        }
      )
      .then(res => {
        if (res?.data?.status === 'error') {
          Alert.alert(res?.data?.error)
        } else if (res.status === 200 && res.data?.id) {
          if (storeProfileId(res?.data?.id, res?.data?.type)) {
            if (res?.data?.type === 'user')
              navigation.navigate('Studios', { id: res.data.id })
            else {
              if (res.data?.user) {
                const {
                  data: { user },
                } = res
                if (!user.location && !user.cost && !user.duration)
                  navigation.navigate('ownerStep1', { id: res.data.id })
                else if (
                  !user.rooms &&
                  !user.area &&
                  !user?.availabilty &&
                  !user.availabilty?.length
                )
                  navigation.navigate('ownerStep2', { id: res.data.id })
                else navigation.navigate('Profile', { id: res.data.id })
              }
            }
          }
        }
      })
      .catch(e => console.error(e))
  }

  const storeProfileId = async (id: string, type: string) => {
    try {
      await AsyncStorage.setItem('@id', id)
      await AsyncStorage.setItem('@type', type)
      return true
    } catch (e) {
      // saving error
      return false
    }
  }
  const { user, pwd } = focus
  return (
    <View style={styles.container}>
      <View style={{ marginLeft: 51 }}>
        <Text style={styles.title}>Login</Text>
        <Text style={[styles.label, styles.marginTop166]}>Email</Text>

        <TextInput
          textContentType='emailAddress'
          placeholderTextColor='grey'
          onBlur={() => setFocus({ ...focus, user: false })}
          onFocus={() => setFocus({ ...focus, user: true })}
          placeholder='Enter email id'
          autoCapitalize='none'
          style={[styles.input]}
          onChangeText={text => setData({ ...data, email: text })}
        />

        {!validateEmail(data.email) && !!data.email && !focus.user ? (
          <Text style={{ color: 'red' }}>Email is invalid</Text>
        ) : null}
        <Text style={[styles.label, styles.marginTop33]}>Password</Text>
        <TextInput
          placeholderTextColor='grey'
          onBlur={() => setFocus({ ...focus, pwd: false })}
          onFocus={() => setFocus({ ...focus, pwd: true })}
          placeholder='Enter Password'
          textContentType='password'
          secureTextEntry
          style={[styles.input]}
          onChangeText={text => setData({ ...data, pwd: text })}
        />
        <TouchableHighlight style={[styles.button, styles.marginTop56]}>
          <Button
            title='LOGIN'
            color='#fff'
            onPress={handleLogin}
            disabled={!data.email || !data.pwd || !validateEmail(data.email)}
          />
        </TouchableHighlight>
        <Text style={[styles.signUpText, styles.marginTop25]}>
          First time here?{' '}
          <TouchableHighlight style={{ marginTop: -12.5 }}>
            <Button
              color='#FF7083'
              title='Sign up!'
              onPress={() => navigation.navigate('home')}
            />
          </TouchableHighlight>
        </Text>
      </View>
    </View>
  )
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
    marginTop: -8,
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
  signUpText: {
    color: '#fff',
    marginLeft: 50,
  },

  title: {
    color: '#FF7083',
    marginTop: 80,
    fontSize: 56,
    marginRight: 150,
  },
  marginTop56: {
    marginTop: 56,
  },
  label: {
    color: '#FF7083',
    marginBottom: 16,
    marginLeft: 10,
    fontSize: 17,
  },
  marginTop166: {
    marginTop: 166,
  },
  marginTop33: {
    marginTop: 33,
  },
})
