import React from 'react'
import { StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import {
  UserType,
  Login,
  SignUp,
  OwnerRequired,
  OwnerStep2,
  DanceStudios,
  Profile,
  StudioDetails,
} from './components'

const Stack = createNativeStackNavigator<RootStackParamList>()

export type RootStackParamList = {
  home: undefined
  login: undefined
  signup: { id: string; type: string }
  ownerStep1: { id: string; type?: string }
  ownerStep2: { id: string; type?: string }
  danceStudios: { id: string; type?: string }
  profile: { id: string; type?: string }
  studioDetails: { id: string }
}

const App: React.FC<RootStackParamList> = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='home' component={UserType} />
        <Stack.Screen name='login' component={Login} />
        <Stack.Screen name='signup' component={SignUp} />
        <Stack.Screen name='ownerStep1' component={OwnerRequired} />
        <Stack.Screen name='ownerStep2' component={OwnerStep2} />
        <Stack.Screen name='danceStudios' component={DanceStudios} />
        <Stack.Screen
          name='profile'
          component={Profile}
          //TODO: Remove back button
        />
        <Stack.Screen name='studioDetails' component={StudioDetails} />
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

export default App
