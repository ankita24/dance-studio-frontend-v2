import React from 'react'
import { StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Login from './components/Login'
import OwnerRequired from './components/OwnerRequired'
import SignUp from './components/SignUp'
import UserType from './components/UserType'
import OwnerStep2 from './components/OwnerStep2'
import Profile from './components/Profile'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='home' component={UserType} />
        <Stack.Screen name='login' component={Login} />
        <Stack.Screen name='signup' component={SignUp} />
        <Stack.Screen name='ownerStep1' component={OwnerRequired} />
        <Stack.Screen name='ownerStep2' component={OwnerStep2} />
        <Stack.Screen name='profile' component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
