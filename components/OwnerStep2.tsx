import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  Button,
} from 'react-native'
import { Entypo, MaterialIcons } from '@expo/vector-icons'
import axios from 'axios'
import { useNavigation } from '@react-navigation/native'

export default function OwnerStep2({
  route: {
    params: { id },
  },
}: {
  route: { params: { id: number } }
}) {
  const navigate = useNavigation()
  const [focus, setFocus] = useState({ area: false, rooms: false })
  const [data, setData] = useState({
    area: 0,
    rooms: 0,
  })
  const { area, rooms } = focus

  const handleStepTwo = () => {
    if (id) {
      axios
        .put(`http://192.168.29.91:9999/api/owner/${id}`, data)
        .then(res => {
          if (res?.data?.status === 'error') {
            Alert.alert(res?.data?.error)
          } else {
            navigate.navigate('profile', { id })
          }
        })
        .catch(e => console.log(e))
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Studio Information Step 2</Text>
      <StatusBar style='auto' />
      <View style={{ display: 'flex', flexDirection: 'row', width: 275 }}>
        <Entypo
          name='area-graph'
          size={30}
          color='grey'
          style={{ marginTop: 32 }}
        />
        <TextInput
          placeholderTextColor='grey'
          onBlur={() => setFocus({ ...focus, area: false })}
          onFocus={() => setFocus({ ...focus, area: true })}
          placeholder='Area(sq feet)'
          style={[styles.input, styles.margin, area ? styles.yellow : null]}
          onChangeText={text => {
            if (!isNaN(Number(text))) setData({ ...data, area: Number(text) })
          }}
          keyboardType='number-pad'
          value={!!data.area ? data.area.toString() : ''}
        />
      </View>
      <View style={{ display: 'flex', flexDirection: 'row', width: 275 }}>
        <MaterialIcons
          name='meeting-room'
          size={30}
          color='grey'
          style={{ marginTop: 32 }}
        />
        <TextInput
          placeholderTextColor='grey'
          onBlur={() => setFocus({ ...focus, rooms: false })}
          onFocus={() => setFocus({ ...focus, rooms: true })}
          placeholder='No of rooms'
          style={[styles.input, styles.margin, rooms ? styles.yellow : null]}
          onChangeText={text => {
            if (!isNaN(Number(text))) setData({ ...data, rooms: Number(text) })
          }}
          keyboardType='number-pad'
          value={!!data.rooms ? data.rooms.toString() : ''}
        />
      </View>

      <TouchableHighlight style={[styles.button, styles.marginTop25]}>
        <Button
          title='Next'
          color='#fff'
          onPress={handleStepTwo}
          disabled={!data.area && !data.rooms}
        />
      </TouchableHighlight>

      <TouchableHighlight>
        <Button
          color='#D1D100'
          title='Skip'
          onPress={() => navigate.navigate('profile', { id })} //change this
        />
      </TouchableHighlight>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#171717',
    alignItems: 'center',
    // justifyContent: 'center',
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
  imageView: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 10,
    width: 320,
    justifyContent: 'space-between',
  },
  flexStart: {
    justifyContent: 'space-evenly',
  },
})
