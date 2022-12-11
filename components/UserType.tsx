import React, { useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Button,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useIsFocused } from '@react-navigation/native'
import { RootStackParamList } from '../App'

type Props = NativeStackScreenProps<RootStackParamList>

export default function UserType({ navigation }: Props) {
  const isFocused=useIsFocused()
  useEffect(() => {
    getData()
  }, [isFocused])

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@id')
      const type = await AsyncStorage.getItem('@type')
      if (value !== null) {
        if (type === 'owner') navigation.navigate('Profile', { id: value })
        else navigation.navigate('Studios', { id: value })
      }
    } catch (e) {
      // error reading value
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Danvue</Text>

      <View style={styles.innerContainer}>
        <Text style={styles.subtitle}>
          Give your dancing shoes a beautiful{' '}
          <Text style={{ color: '#FB304B' }}>background</Text>{' '}
        </Text>
        <TouchableHighlight
          style={[styles.button, styles.marginTop81]}
          onPress={() =>
            navigation.navigate('signup', { type: 'user', id: '' })
          }
        >
          <Text style={styles.userTypeText}>User</Text>
        </TouchableHighlight>
        <Text style={[styles.marginTop36, styles.white]}>Or</Text>

        <TouchableHighlight
          style={[styles.button, styles.marginTop36]}
          onPress={() =>
            navigation.navigate('signup', { type: 'owner', id: '' })
          }
        >
          <Text style={styles.userTypeText}>Owner</Text>
        </TouchableHighlight>
      </View>
      <Text style={styles.footerText}>
        Not the first time?{' '}
        <TouchableHighlight style={{ marginTop: -12 }}>
          <Button
            color='#FF7083'
            title='Login'
            onPress={() => navigation.navigate('login')}
          />
        </TouchableHighlight>
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030169',
    color: '#fff',
  },
  button: {
    height: 63,
    width: 220,
    backgroundColor: '#FF7083',
    borderRadius: 50,
    padding: 12,
    textAlign: 'center',
  },
  welcomeText: {
    marginTop: 80,
    fontSize: 64,
    color: '#FF7083',
    marginLeft: 80,
  },
  innerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 36,
  },
  white: {
    color: '#FFF',
  },
  marginTop81: {
    marginTop: 81,
  },
  marginTop36: {
    marginTop: 36,
  },
  userTypeText: {
    fontSize: 32,
    textAlign: 'center',
    color: '#FFF',
  },
  footerText: {
    marginTop: 10,
    color: '#fff',
    marginLeft: 90,
  },
  subtitle: {
    width: 250,
    marginLeft: 35,
    lineHeight: 24,
    fontSize: 17,
    color: '#fff', 
  },
})
