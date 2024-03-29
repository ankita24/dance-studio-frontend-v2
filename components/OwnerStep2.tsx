import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, TextInput, View, Alert } from 'react-native'
import axios from 'axios'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../App'
import { IP_ADDRESS } from '@env'
import { RadioButton, Button } from '../partials'
import { Profile } from 'types'

type Props = NativeStackScreenProps<
  RootStackParamList,
  'Profile' | 'ownerStep1' | 'login'
>

export default function OwnerStep2({ route, navigation }: Props) {
  const { id } = route.params || {}
  const [focus, setFocus] = useState({ area: false, rooms: false })
  const [data, setData] = useState({
    area: 0,
    rooms: 0,
    soundProof: true,
    hasChangingRoom: true,
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = () => {
    axios
      .get<{ user: Profile }>(`${IP_ADDRESS}/api/profile/${id}`)
      .then(response => {
        const { area, rooms, soundProof, hasChangingRoom } =
          response?.data?.user
        if (!!area && !!rooms && !!soundProof && hasChangingRoom && id) {
          navigation.navigate('ownerStep2', { id })
        } else
          setData({
            ...data,
            area,
            rooms,
            soundProof: soundProof ?? true,
            hasChangingRoom: hasChangingRoom ?? true,
          })
      })
      .catch(error => console.error(error))
  }

  const handleStepTwo = () => {
    if (id) {
      axios
        .put<{ status: string; error: string }>(
          `${IP_ADDRESS}/api/owner/${id}`,
          {
            ...data,
          }
        )
        .then(res => {
          if (res?.data?.status === 'error') {
            Alert.alert(res?.data?.error)
          } else {
            navigation.navigate('ownerStep3', { id })
          }
        })
        .catch(e => console.error(e))
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Studio Information</Text>
        <View style={styles.section}>
          <View>
            <Text style={styles.label}>Area(sq ft):</Text>
            <TextInput
              placeholderTextColor='grey'
              onBlur={() => setFocus({ ...focus, area: false })}
              onFocus={() => setFocus({ ...focus, area: true })}
              style={[styles.input, styles.marginTop25]}
              onChangeText={text => {
                if (!isNaN(Number(text)))
                  setData({ ...data, area: Number(text) })
              }}
              keyboardType='number-pad'
              value={!!data.area ? data.area.toString() : ''}
            />
          </View>
          <View>
            <Text style={styles.label}>No of rooms</Text>
            <TextInput
              placeholderTextColor='grey'
              onBlur={() => setFocus({ ...focus, rooms: false })}
              onFocus={() => setFocus({ ...focus, rooms: true })}
              style={[styles.input, styles.marginTop25]}
              onChangeText={text => {
                if (!isNaN(Number(text)))
                  setData({ ...data, rooms: Number(text) })
              }}
              keyboardType='number-pad'
              value={!!data.rooms ? data.rooms.toString() : ''}
            />
          </View>
        </View>
        <View style={styles.section}>
          <View>
            <Text style={styles.label}>Is soundproof?</Text>
            <RadioButton
              value={data.soundProof}
              onUpdate={(soundProof: boolean) =>
                setData({ ...data, soundProof })
              }
            />
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[styles.label, styles.marginRight30]}>
              Has changing room?
            </Text>
            <RadioButton
              value={data.hasChangingRoom}
              onUpdate={(hasChangingRoom: boolean) =>
                setData({ ...data, hasChangingRoom })
              }
            />
          </View>
        </View>
        <Button
          title='CONFIRM'
          disabled={!data.area && !data.rooms}
          onPress={() => {
            if (!!data.area && !!data.rooms) 
            handleStepTwo()
          }}
          androidButtonStyled={{
            textAlign: 'center',
            marginTop: 10,
            fontSize: 16,
            color: !data.area && !data.rooms ? 'grey' : '#fff',
          }}
          touchOpacityStyles={[
            styles.button,
            styles.marginTop45,
            styles.marginRight30,
          ]}
          color='#fff'
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    display:'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignContent:'center',alignItems:'center'
  },
  innerContainer: { marginLeft: 40, marginTop: 50 },
  input: {
    height: 56,
    width: 109,
    borderRadius: 24,
    padding: 20,
    color: 'grey',
    backgroundColor: '#fff',
    borderColor: '#030169',
    borderWidth: 1,
    marginTop: -100,
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
  marginTop45: {
    marginTop: 45,
  },
  title: {
    color: '#FF7083',
    fontSize: 40,
    textAlign:'center'
  },
  section: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 290,
    marginTop: 25,
  },
  label: {
    color: '#030169',
    marginLeft: 10,
    fontSize: 17,
    marginBottom: -16,
  },
  marginRight30: {
    marginRight: -30,
  },
})
