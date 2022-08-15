import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack'
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
import { Provider, useSelector, useDispatch } from 'react-redux'
import { store, RootState } from './redux/store'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { Profile as ProfileType } from 'types'
import { IP_ADDRESS } from '@env'
import { setType } from './redux/typeSlice'
import { navigationRef } from './RootNavigation';
import * as RootNavigation from './RootNavigation';

const Stack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator()
type Props = NativeStackScreenProps<RootStackParamList>

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
  const dispatch = useDispatch()
  useEffect(() => {
    fetchProfile()
  }, [typeofUser])

  const fetchProfile = async () => {
    const id = await AsyncStorage.getItem('@id')
    if (!!id) {
      axios
        .get<{ user: ProfileType }>(`${IP_ADDRESS}/api/profile/${id}`)
        .then(response => {
          const {
            data: { user },
          } = response
          console.log(response.data.user.name, typeofUser)
          const ifOwner = user.__t === 'OwnerSchema'
          if (ifOwner) {
            dispatch(setType('owner'))
            if (!user.location || !user.cost || !user.duration)
            RootNavigation.navigate('ownerStep1', { id })
            else if (
              !user.rooms ||
              !user.area ||
              !user?.availabilty ||
              !user.availabilty?.length
            )
            RootNavigation.navigate('ownerStep2', { id})
            else if (!user.availabilty.find(item => item.timings.length))
            RootNavigation.navigate('ownerStep3', { id })
          } else {
            dispatch(setType('user'))
          }
        })
        .catch(error => {
          console.error(error)
        })
    }
  }

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
        <NavigationContainer ref={navigationRef}>
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
