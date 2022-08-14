import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {
  UserType,
  Login,
  SignUp,
  OwnerRequired,
  OwnerStep2,
  DanceStudios,
  Profile,
  StudioDetails,
  BookedClasses,
  TimeSlots,
} from './components'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { Provider, useSelector } from 'react-redux'
import { store, RootState } from './redux/store'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useDispatch } from 'react-redux'
import { setType } from './redux/typeSlice'

const Stack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator()

export type RootStackParamList = {
  home: undefined
  login: undefined
  signup: { id: string; type: string }
  ownerStep1: { id: string; type?: string }
  ownerStep2: { id: string; type?: string }
  Studios: { id: string; type?: string }
  Profile: { id: string; type?: string }
  studioDetails: { id: string }
  userBookedClasses: { id: string }
  Tabs: any
  bookedClasses: { id: string }
  ownerStep3: { id: string; signUpStep?: boolean }
}

const AppWrapper: React.FC<RootStackParamList> = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

const App = () => {
  const { type: typeofUser } = useSelector((state: RootState) => state.type)

  function Tabs() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName
            if (route.name === 'Bookings' || route.name === 'Studios') {
              iconName = 'reorder-four'
            } else if (route.name === 'Profile') {
              iconName = 'person'
            } else if (route.name === 'Slots') {
              iconName = 'time'
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />
          },
          tabBarActiveTintColor: '#FF7083',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen
          name={typeofUser === 'owner' ? 'Bookings' : 'Studios'}
          component={
            typeofUser === 'owner' ? BookedOwnerClasses : DanceStudiosNavigator
          }
          options={{ headerShown: typeofUser === 'owner' }}
        />
        {typeofUser === 'owner' && (
          <Tab.Screen
            name='Slots'
            component={TimeSlots}
            options={{ headerShown: typeofUser === 'owner' }}
          />
        )}
        <Tab.Screen name='Profile' component={Profile} />
      </Tab.Navigator>
    )
  }

  function BookedOwnerClasses() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name='Studios'
          component={BookedClasses}
          options={{ headerShown: false, headerBackVisible: false }}
        />
      </Stack.Navigator>
    )
  }
  function DanceStudiosNavigator() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name='Studios'
          component={DanceStudios}
          options={{ headerShown: false, headerBackVisible: false }}
        />
        <Stack.Screen name='studioDetails' component={StudioDetails} />
      </Stack.Navigator>
    )
  }
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name='Tabs'
              component={Tabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name='home'
              component={UserType}
              options={{ headerBackVisible: false }}
            />
            <Stack.Screen name='login' component={Login} />
            <Stack.Screen name='signup' component={SignUp} />
            <Stack.Screen name='ownerStep1' component={OwnerRequired} />
            <Stack.Screen name='ownerStep2' component={OwnerStep2} />
            <Stack.Screen name='ownerStep3' component={TimeSlots} />

            <Stack.Screen
              name='userBookedClasses'
              component={BookedClasses}
              options={{ headerBackVisible: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  )
}

export default AppWrapper
