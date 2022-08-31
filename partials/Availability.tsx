import React, { useState } from 'react'
import {
  Text,
  View,
  Button,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native'
import { Card } from 'react-native-elements'
import DateTimePicker from '@react-native-community/datetimepicker'
import { AntDesign, FontAwesome } from '@expo/vector-icons'
import { Profile } from 'types'

export default function Availability({
  editableData,
  edit,
  onStartChange,
  onEndChange,
  onAddition,
  onRemove,
  onFirstTimeAddition,
}: {
  editableData: Profile | undefined
  edit: boolean
  onStartChange: (
    date: Date | undefined,
    index1: number,
    index2: number
  ) => void
  onEndChange: (
    date: Date | undefined,
    index1: number,
    index2: number,
    timing: { start: Date; end: Date }
  ) => void
  onAddition: (
    index1: number,
    index2: number,
    item: {
      day: string
      timings: [
        {
          start: Date
          end: Date
        }
      ]
    }
  ) => void
  onRemove: (index1: number, index2: number) => void
  onFirstTimeAddition: (item: {
    day: string
    timings: [
      {
        start: Date
        end: Date
      }
    ]
  }) => void
}) {
  const [startIndex, setStartIndex] = useState<number | undefined>()
  const [endIndex, setEndIndex] = useState<number | undefined>()
  return (
    <View style={styles.marginLeft28}>
      {editableData?.availabilty?.map((item, index1) => (
        <Card key={item.day} containerStyle={styles.cardStyle}>
          <Card.Title style={{ color: '#030169' }}>{item.day}</Card.Title>
          <Card.Divider style={styles.dividerStyle} />
          {!!item.timings?.length ? (
            item.timings.map((timing, index2) => {
              return (
                <View key={item.day + timing.start} style={styles.timings}>
                  {Platform.OS === 'android' && startIndex !== index1 ? (
                    <TouchableOpacity>
                      <Text onPress={() => setStartIndex(index1)}>
                        {new Date(timing.start)
                          .toLocaleTimeString()
                          .slice(0, -3)}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <DateTimePicker
                      mode='time'
                      disabled={!edit}
                      value={new Date(timing.start)}
                      style={styles.dateStyle}
                      onChange={(e, date) => {
                        onStartChange(date, index1, index2)
                        setStartIndex(undefined)
                      }}
                    />
                  )}
                  <Text>-</Text>
                  {Platform.OS === 'android' && endIndex !== index1 ? (
                    <Text onPress={() => setEndIndex(index1)}>
                      {new Date(timing.end).toLocaleTimeString().slice(0, -3)}
                    </Text>
                  ) : (
                    <DateTimePicker
                      mode='time'
                      disabled={!edit}
                      value={new Date(timing.end)}
                      style={styles.dateStyle}
                      onChange={(e, date) => {
                        onEndChange(date, index1, index2, timing)
                        setEndIndex(undefined)
                      }}
                    />
                  )}
                  {edit && (
                    <AntDesign
                      name='pluscircleo'
                      size={20}
                      color='#FF7083'
                      style={styles.marginLeft10}
                      onPress={() => onAddition(index1, index2, item)}
                    />
                  )}

                  {edit && (
                    <FontAwesome
                      name='remove'
                      size={20}
                      color='#FF7083'
                      style={styles.marginLeft10}
                      onPress={() => onRemove(index1, index2)}
                    />
                  )}
                </View>
              )
            })
          ) : edit ? (
            <Button
              title='Add Time'
              color='#FF7083'
              onPress={() => onFirstTimeAddition(item)}
            />
          ) : (
            <Text style={styles.textAlign}>No Slots added</Text>
          )}
        </Card>
      ))}
    </View>
  )
}

export const styles = StyleSheet.create({
  timings: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 0,
    justifyContent: 'center',
    marginTop: 10,
    color: '#030169',
  },
  containerStyle: {
    alignSelf: 'center',
    marginTop: 58,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF7083',
    borderRadius: 999,
    shadowColor: '#FF7083',
    shadowOpacity: 0.7,
    elevation: 12,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
  cardStyle: {
    width: 306,
    marginLeft: 0,
    borderColor: '#FF7083',
    borderRadius: 24,
  },
  dateStyle: { width: 90, padding: 0, color: '#030169' },
  marginLeft10: {
    marginLeft: 10,
  },
  textAlign: {
    textAlign: 'center',
  },
  marginLeft28: {
    marginLeft: 28,
  },
  dividerStyle: {
    width: 60,
    backgroundColor: '#030169',
    alignSelf: 'center',
    marginTop: -5,
  },
})
