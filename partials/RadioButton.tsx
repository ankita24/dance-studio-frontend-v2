import React from 'react'
import { View, TouchableHighlight, Button } from 'react-native'

export default function RadioButton({
  value,
  onUpdate,
}: {
  value: boolean
  onUpdate: (data: boolean) => void
}) {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        marginTop: 30,
      }}
    >
      <View>
        <TouchableHighlight
          style={{
            backgroundColor: !!value ? '#030169' : '#fff',
            borderColor: '#030169',
            borderWidth: 1,
            borderTopLeftRadius: 24,
            borderBottomLeftRadius: 24,height:50,width:55,
            padding:4
          }}
        >
          <Button
            title='Yes'
            color={!!value ? '#fff' : '#030169'}
            onPress={() => onUpdate(true)}
          />
        </TouchableHighlight>
      </View>
      <View>
        <TouchableHighlight
          style={{
            backgroundColor: !value ? '#030169' : '#fff',
            borderColor: '#030169',
            borderWidth: 1,
            borderTopRightRadius: 24,
            borderBottomRightRadius: 24,height:50,width:55,padding:4
          }}
        >
          <Button
            title='No'
            color={!value ? '#fff' : '#030169'}
            onPress={() => onUpdate(false)}
          />
        </TouchableHighlight>
      </View>
    </View>
  )
}
