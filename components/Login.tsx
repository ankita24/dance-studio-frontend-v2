import React, { useState } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  Alert,
} from 'react-native'
import axios from 'axios'
import { validateEmail } from '../utils/helper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Profile } from 'types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../App'
import { useDispatch } from 'react-redux'
import { IP_ADDRESS } from '@env'
import { setType } from '../redux/typeSlice'
import { Button } from '../partials'

type Props = NativeStackScreenProps<RootStackParamList>

export default function Login({ route, navigation }: Props) {
  console.log(IP_ADDRESS)
  const dispatch = useDispatch()
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
      .then(async res => {
        if (res?.data?.status === 'error') {
          Alert.alert(res?.data?.error)
        } else if (res.status === 200 && res.data?.id) {
          const storeValue = await storeProfileId(
            res?.data?.id,
            res?.data?.type
          )
          if (storeValue) {
            if (res?.data?.type === 'user')
              navigation.navigate('Tabs', {
                id: res.data.id,
                Screen: 'Studios',
              })
            else {
              if (res.data?.user) {
                const {
                  data: { user },
                } = res
                if (!user.location || !user.cost)
                  navigation.navigate('ownerStep1', { id: res.data.id })
                else if (
                  !user.rooms ||
                  !user.area ||
                  !user?.availabilty
                )
                  navigation.navigate('ownerStep2', { id: res.data.id })
                else if (!user.availabilty.find(item => item.timings.length))
                  navigation.navigate('ownerStep3', { id: res.data.id })
                else
                  navigation.navigate('Tabs', {
                    id: res.data.id,
                    Screen: 'Profile',
                  })
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
      dispatch(setType(type))
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
        <Text style={[styles.label, styles.marginTop16]}>Email</Text>

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
        <Button
          touchOpacityStyles={[styles.button, styles.marginTop56]}
          disabled={!data.email || !data.pwd || !validateEmail(data.email)}
          onPress={handleLogin}
          title='LOGIN'
          color='#fff'
          androidButtonStyled={{
            textAlign: 'center',
            marginTop: 10,
            fontSize: 16,
            color: !data.email || !data.pwd || !validateEmail(data.email) ? 'grey' : '#fff',
          }}
        />
        <Text style={[styles.signUpText, styles.marginTop25]}>
          First time here?{' '}
          <Button
            touchOpacityStyles={{ marginTop: -12.5 }}
            disabled={false}
            onPress={() => navigation.navigate('home')}
            title='Sign up!'
            color='#FF7083'
            androidButtonStyled={{
              textAlign: 'center',
              marginTop: 10,
              fontSize: 16,
              color: '#FF7083',
            }}
          />
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
    marginTop: 10,
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
  marginTop16: {
    marginTop: 16,
  },
  marginTop33: {
    marginTop: 33,
  },
})
