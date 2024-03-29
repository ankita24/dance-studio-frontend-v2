import React, { useEffect } from 'react'
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useIsFocused } from '@react-navigation/native'
import { RootStackParamList } from '../App'
import { Button } from '../partials'

type Props = NativeStackScreenProps<RootStackParamList>

export default function UserType({ navigation }: Props) {
  const isFocused = useIsFocused()
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
        <Text style={styles.welcomeText}>DaView</Text>

        <View style={styles.innerContainer}>
          <Text style={styles.subtitle}>
            Give your dancing shoes a beautiful{' '}
            <Text style={{ color: '#FB304B' }}>background</Text>{' '}
          </Text>
          <TouchableHighlight
            style={[styles.button, styles.marginTop20]}
            onPress={() =>
              navigation.navigate('signup', { type: 'user', id: '' })
            }
          >
            <Text style={styles.userTypeText}>User</Text>
          </TouchableHighlight>
          <Text style={[styles.marginTop20, styles.white]}>Or</Text>

          <TouchableHighlight
            style={[styles.button, styles.marginTop20]}
            onPress={() =>
              navigation.navigate('signup', { type: 'owner', id: '' })
            }
          >
            <Text style={styles.userTypeText}>Owner</Text>
          </TouchableHighlight>
        </View>
        <Text style={styles.footerText}>
          Not the first time?{' '}
          <Button
            color='#FF7083'
            title='Login'
            onPress={() => navigation.navigate('login')}
            touchOpacityStyles={{ marginTop: -12 }}
            androidButtonStyled={styles.androidButtonStyles}
          />
        </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030169',
    color: '#fff',
    display:'flex',
    flexDirection:'column',
    justifyContent:'center'
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
    fontSize: 40,
    textAlign: 'center',
    color: '#FF7083',
    
  },
  innerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  white: {
    color: '#FFF',
  },
  marginTop20: {
    marginTop: 20,
  },
  userTypeText: {
    fontSize: 24,
    textAlign: 'center',
    color: '#FFF',
    fontWeight:"400"
  },
  footerText: {
    marginTop: 20,
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    width: 250,
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 16,
    color: '#fff',
    fontStyle:'italic'
  },
  androidButtonStyles: {
    textAlign: 'center',
    fontSize: 16,
    marginLeft: 4,
    marginBottom: -5,
    color: '#FF7083',
  },
})
