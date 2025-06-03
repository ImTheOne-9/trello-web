import { asyncThunkCreator, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { isEmpty } from 'lodash'
import { API_ROOT } from '~/utils/constants'
import { generatePlaceHolderCard } from '~/utils/formatters'
import { mapOrder } from '~/utils/sorts'
import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { toast } from 'react-toastify'

// Defines the default state of This Slice
const initialState = {
  currentUser: null
}

// Handling call Api (Async) and update data to redux: using middleware createAsyncThunk & extraReducer
export const loginUserAPI = createAsyncThunk(
  'user/loginUserAPI',
  async (data) => {
    const response = await authorizeAxiosInstance.post(`${API_ROOT}/v1/users/login`, data)
    return response.data
  }
)

export const logoutUserAPI = createAsyncThunk(
  'user/logoutUserAPI',
  async (showSuccessMessage = true) => {
    const response = await authorizeAxiosInstance.delete(`${API_ROOT}/v1/users/logout`)
    if (showSuccessMessage) {
      toast.success('Logged out successfully')
    }
    return response.data
  }
)

// Defines Slice in Redux Store
export const userSlice = createSlice({
  name: 'user',
  initialState,

  // reducer handle sync logic:
  reducers: {
  },

  // ExtraReducer handle async logic
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      // action.payload = response.data
      const user = action.payload
      state.currentUser = user
    }),

    builder.addCase(logoutUserAPI.fulfilled, (state) => {
      state.currentUser = null
    })
  }
})

// Action creators are generated for each case reducer function
// export const { } = userSlice.actions

// Selector to get data from the Redux store
export const selectCurrentUser = (state) => {
  return state.user.currentUser
}

// export reducer
export const userReducer = userSlice.reducer