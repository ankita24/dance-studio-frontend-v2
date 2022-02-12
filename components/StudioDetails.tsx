import React, { useEffect } from 'react'
import { View, Text } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../App'
import axios from 'axios'

type Props = NativeStackScreenProps<RootStackParamList, 'studioDetails'>

export default function StudioDetails({ route }: Props) {
  const { params: { id } = {} } = route
  useEffect(() => {
    axios.get(`http://192.168.29.91:9999/api/studio/${id}`).then(response => {
      console.log(response)
    })
  }, [id])
  return (
    <View>
      <Text>Hey</Text>
    </View>
  )
}
