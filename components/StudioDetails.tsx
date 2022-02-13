import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
  TouchableHighlight,
} from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { RootStackParamList } from '../App'
import axios from 'axios'
import { StudioWithSlots } from 'types'

type Props = NativeStackScreenProps<RootStackParamList, 'studioDetails'>

export default function StudioDetails({ route }: Props) {
  const { params: { id } = {} } = route
  const [studio, setStudios] = useState<StudioWithSlots | undefined>()
  useEffect(() => {
    axios
      .get<{ studioDetails: StudioWithSlots }>(
        `http://192.168.29.91:9999/api/studio/${id}`
      )
      .then(response => {
        setStudios(response.data.studioDetails)
      })
      .catch(err => {
        console.error(err)
      })
  }, [id])
  const [selectedSlot, setSelectedSlot] = useState<number | undefined>()
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 30 }}>{studio?.name}</Text>
      {/**
       * TODO: Add Images
       */}

      <Text style={styles.infoCtn}>{studio?.location}</Text>
      <Text style={styles.infoCtn}>Rs {studio?.cost} / 1 hour</Text>
      <Text style={styles.infoCtn}>{studio?.area} sq ft</Text>
      <View style={styles.flexTag}>
        {studio?.slots.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.tag,
                (selectedSlot || selectedSlot === 0) && index === selectedSlot
                  ? styles.selectedTag
                  : null,
              ]}
              onPress={() => setSelectedSlot(index)}
            >
              <Text style={{ padding: 9 }}>{item}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
      <TouchableHighlight style={[styles.button, styles.marginTop25]}>
        <Button
          title='BOOK'
          color='#fff'
          onPress={() => console.log('book it')}
          disabled={!selectedSlot && selectedSlot !== 0}
        />
      </TouchableHighlight>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    padding: 20,
  },
  tag: {
    backgroundColor: 'silver',
    width: '48%',
    marginTop: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  flexTag: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  infoCtn: {
    fontSize: 20,
    marginTop: 20,
  },
  selectedTag: {
    backgroundColor: '#D1D100',
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
})
