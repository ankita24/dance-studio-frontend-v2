import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const typeSlice = createSlice({
  name: "type",
  initialState: {
    type: ""
  },
  reducers: {
    setType(state, action: PayloadAction<string>) {
      state.type = action.payload
    }
  }
})

export const { setType } = typeSlice.actions

export default typeSlice.reducer