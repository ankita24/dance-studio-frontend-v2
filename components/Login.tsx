import { StatusBar } from 'expo-status-bar'
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
import { Ionicons, AntDesign } from '@expo/vector-icons'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'
import { validate } from '../utils/helper'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Profile } from 'types'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../App'

type Props = NativeStackScreenProps<
  RootStackParamList,
  'danceStudios' | 'ownerStep1' | 'ownerStep2' | 'profile'
>

export default function Login({ route, navigation }: Props) {
  const navigate = useNavigation()
  const [focus, setFocus] = useState({ pwd: false, user: false })
  const [data, setData] = useState({ pwd: '', user: '' })

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
        'http://192.168.29.91:9999/api/login',

        {
          username: data.user,
          password: data.pwd,
        }
      )
      .then(res => {
        if (res?.data?.status === 'error') {
          Alert.alert(res?.data?.error)
        } else if (res.status === 200 && res.data?.id) {
          storeProfileId(res?.data?.id, res?.data?.type).then(() => {
            if (res?.data?.type === 'user') navigation.navigate('danceStudios')
            /**
             * TODO: change it to profile below
             */
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
              else navigation.navigate('profile', { id: res.data.id })
            }
          })
        }
      })
      .catch(e => console.error(e))
  }

  const storeProfileId = async (id: string, type: string) => {
    try {
      await AsyncStorage.setItem('@id', id)
      await AsyncStorage.setItem('@type', type)
    } catch (e) {
      // saving error
    }
  }
  const { user, pwd } = focus
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <StatusBar style='auto' />
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <Ionicons
          name='person-outline'
          size={30}
          color={user ? '#D1D100' : 'grey'}
        />
        <TextInput
          placeholderTextColor='grey'
          onBlur={() => setFocus({ ...focus, user: false })}
          onFocus={() => setFocus({ ...focus, user: true })}
          placeholder='Username'
          style={[styles.input, user ? styles.yellow : null]}
          onChangeText={text => setData({ ...data, user: text })}
        />
      </View>
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <AntDesign
          name='lock1'
          size={30}
          color={pwd ? '#D1D100' : 'grey'}
          style={{ marginTop: 32 }}
        />
        <TextInput
          placeholderTextColor='grey'
          onBlur={() => setFocus({ ...focus, pwd: false })}
          onFocus={() => setFocus({ ...focus, pwd: true })}
          placeholder='Password'
          textContentType='password'
          secureTextEntry
          style={[styles.input, styles.margin, pwd ? styles.yellow : null]}
          onChangeText={text => setData({ ...data, pwd: text })}
        />
      </View>
      <TouchableHighlight style={[styles.button, styles.marginTop25]}>
        <Button
          title='LOGIN'
          color='#fff'
          onPress={handleLogin}
          disabled={!data.user && !data.pwd}
        />
      </TouchableHighlight>
      <Text style={[styles.signUpText, styles.marginTop25]}>
        First time here?{' '}
        <TouchableHighlight>
          <Button
            color='#D1D100'
            title='Sign up!'
            onPress={() => navigation.navigate('signup')}
          />
        </TouchableHighlight>
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#171717',
    alignItems: 'center',
    justifyContent: 'center',
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
  margin: {
    marginTop: 25,
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
  signUpText: {
    // color: '#fff',
  },
  lastText: {
    fontWeight: 'bold',
  },
  title: {
    // color: '#fff',
    marginBottom: 100,
    fontSize: 50,
    marginRight: 150,
  },
})
