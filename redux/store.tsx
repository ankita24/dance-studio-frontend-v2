import { configureStore } from '@reduxjs/toolkit'
import typeReducer from './typeSlice'

export const store = configureStore({
  reducer: {
    type: typeReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
