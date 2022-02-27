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
import { RootStackParamList } from '../App'

type Props = NativeStackScreenProps<RootStackParamList>

export default function UserType({ route, navigation }: Props) {
  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@id')
      const type = await AsyncStorage.getItem('@type')
      if (value !== null) {
        if (type === 'owner') navigation.navigate('profile', { id: value })
        /**
         * TODO:Change the booked classes to danceStudios
         */ else navigation.navigate('userBookedClasses', { id: value })
      }
    } catch (e) {
      // error reading value
    }
  }
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to Generic Dance studio</Text>
      <View style={styles.innerContainer}>
        <Text>New Here? Are you a...</Text>
        <View style={[styles.horizontalFlex, styles.marginTop25]}>
          <TouchableHighlight style={[styles.button, styles.marginLeft30]}>
            <Button
              color='#D1D100'
              title='USER'
              onPress={() =>
                navigation.navigate('signup', { type: 'user', id: '' })
              }
            />
          </TouchableHighlight>

          <TouchableHighlight style={[styles.button]}>
            <Button
              color='#D1D100'
              title='OWNER'
              onPress={() =>
                navigation.navigate('signup', { type: 'owner', id: '' })
              }
            />
          </TouchableHighlight>
        </View>
      </View>
      <Text style={{ marginTop: 50 }}>
        Not the first time?{' '}
        <TouchableHighlight>
          <Button
            color='#D1D100'
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
    alignItems: 'center',
  },
  button: {
    height: 40,
    width: 120,
    borderColor: '#D1D100',
    borderWidth: 1,
  },
  welcomeText: {
    marginTop: 100,
    fontSize: 30,
  },
  innerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    //flex: 1,
    marginTop: 200,
  },
  horizontalFlex: {
    display: 'flex',
    flexDirection: 'row',
  },
  marginTop25: {
    marginTop: 25,
  },
  lastText: {
    fontWeight: 'bold',
    color: '#D1D100',
  },
  marginLeft22: {
    marginLeft: 22,
  },
  marginLeft30: {
    marginLeft: 30,
  },
})
