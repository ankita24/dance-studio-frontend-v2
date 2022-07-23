import React from 'react'
import { View, ActivityIndicator } from 'react-native'

import { StyleSheet } from 'react-native'

export default function Loader() {
  return (
    <View style={[styles.vertical, styles.horizontal]}>
      <ActivityIndicator size='large' color='#FF7083' />
    </View>
  )
}

export const styles = StyleSheet.create({
  vertical: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
})
