import { asyncThunkCreator, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { isEmpty } from 'lodash'
import { API_ROOT } from '~/utils/constants'
import { generatePlaceHolderCard } from '~/utils/formatters'
import { mapOrder } from '~/utils/sorts'
import authorizeAxiosInstance from '~/utils/authorizeAxios'

// Defines the default state of This Slice
const initialState = {
  currentActiveCard: null
}


// Defines Slice in Redux Store
export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,

  // reducer handle sync logic:
  reducers: {
    clearCurrentActiveCard: (state) => {
      state.currentActiveCard = null
    },

    updateCurrentActiveCard: (state, action) => {
      const fullCard = action.payload

      // handle Data

      // Update currentActiveBoard data
      state.currentActiveCard = fullCard
    }
  },

  // ExtraReducer handle async logic
  extraReducers: (builder) => {
  }
})

// Action creators are generated for each case reducer function
export const { clearCurrentActiveCard, updateCurrentActiveCard } = activeCardSlice.actions

// Selector to get data from the Redux store
export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActiveCard
}

// export reducer
export const activeCardReducer = activeCardSlice.reducer