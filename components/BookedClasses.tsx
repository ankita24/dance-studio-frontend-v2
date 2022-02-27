import React from 'react'
import { View, Text } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../App'
type Props = NativeStackScreenProps<RootStackParamList, 'studioDetails'>

export default function BookedClasses({ route }: Props) {
  const { params: { id } = {} } = route
  console.log(id)
  return (
    <View>
      <Text>Booked Classes</Text>
    </View>
  )
}
