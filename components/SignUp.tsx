import { StatusBar } from 'expo-status-bar'
import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  Button,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native'
import axios from 'axios'
import { AntDesign } from '@expo/vector-icons'
import UploadImage from '../partials/UploadImage'
import { useNavigation } from '@react-navigation/native'
import { validate } from '../utils/helper'

export default function SignUp({
  route: {
    params: { type },
  },
}: {
  route: { params: { type: string } }
}) {
  const navigate = useNavigation()
  const [focus, setFocus] = useState({
    name: false,
    email: false,
    pwd: false,
    confirmPwd: false,
  })

  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    image: '',
  })
  const { name, email, pwd, confirmPwd } = focus

  const handleRegister = async () => {
    axios
      .post(
        'http://192.168.29.91:9999/api/register',

        {
          name: data.name,
          email: data.email,
          password: data.password,
          image: data.image,
          type,
        }
      )
      .then(res => {
        if (res?.data?.status === 'error') {
          Alert.alert(res?.data?.error)
        } else {
          storeProfileId(res?.data.response._id).then(() => {
            if (type === 'owner') {
              navigate.navigate('ownerStep1', {
                id: res?.data.response._id,
              })
            } else navigate.navigate('profile', {
              id: res?.data.response._id,
            })
          })
        }
      })
      .catch(e => console.error(e))
    /**
     * Delete next two lines once above code is uncommented
     */
    // if (type === 'owner')
    //   navigate.navigate('ownerStep1', { studioId: '61acfba84c7e58a0b4f279ea' })
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
      <Text style={styles.title}>Sign Up</Text>
      <StatusBar style='auto' />
      <UploadImage
        receiveImage={(image: string) => setData({ ...data, image })}
      />
      <TextInput
        placeholderTextColor='grey'
        onBlur={() => setFocus({ ...focus, name: false })}
        onFocus={() => setFocus({ ...focus, name: true })}
        placeholder='Name'
        style={[styles.input, styles.margin, name ? styles.yellow : null]}
        onChangeText={text => setData({ ...data, name: text })}
      />

      <TextInput
        placeholderTextColor='grey'
        onBlur={() => setFocus({ ...focus, email: false })}
        onFocus={() => setFocus({ ...focus, email: true })}
        placeholder='Email'
        style={[styles.input, styles.margin, email ? styles.yellow : null]}
        onChangeText={text => {
          setData({ ...data, email: text })
        }}
      />

      <Text style={{ color: 'red' }}>
        {!validate(data.email) && !!data.email ? `Email is invalid` : ''}
      </Text>
      <TextInput
        placeholderTextColor='grey'
        onBlur={() => setFocus({ ...focus, pwd: false })}
        onFocus={() => setFocus({ ...focus, pwd: true })}
        placeholder='Password'
        textContentType='password'
        secureTextEntry
        style={[styles.input, styles.margin, pwd ? styles.yellow : null]}
        onChangeText={text => setData({ ...data, password: text })}
      />
      <TextInput
        placeholderTextColor='grey'
        onBlur={() => setFocus({ ...focus, confirmPwd: false })}
        onFocus={() => setFocus({ ...focus, confirmPwd: true })}
        placeholder='Confirm Password'
        textContentType='password'
        secureTextEntry
        style={[styles.input, styles.margin, confirmPwd ? styles.yellow : null]}
        onChangeText={text => setData({ ...data, confirmPassword: text })}
      />

      <Text style={{ color: 'red' }}>
        {data.confirmPassword && data.password !== data.confirmPassword
          ? `Password and confirm password should match`
          : ''}
      </Text>

      <TouchableHighlight style={[styles.button, styles.marginTop25]}>
        <Button
          title='SIGN UP'
          color='#fff'
          onPress={handleRegister}
          /**
           * Uncomment
           */
          // disabled={
          //   (!data.email &&
          //     !data.name &&
          //     !data.password &&
          //     !data.confirmPassword) ||
          //   data.password !== data.confirmPassword ||
          //   !validate(data.email)
          // }
        />
      </TouchableHighlight>
      <Text style={[styles.signUpText, styles.marginTop25, styles.flex]}>
        Not the first time?{' '}
        <TouchableHighlight>
          <Button
            color='#D1D100'
            title='Login!'
            onPress={() => navigate.navigate('login')}
          />
        </TouchableHighlight>
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    color: '#fff',
  },
  lastText: {
    fontWeight: 'bold',
    color: '#D4F1F4',
  },
  flex: {
    display: 'flex',
    flexDirection: 'row',
  },
  title: {
    // color: '#fff',
    marginBottom: 100,
    fontSize: 50,
    marginRight: 70,
  },
  uploadBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
