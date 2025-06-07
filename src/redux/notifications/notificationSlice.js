import { asyncThunkCreator, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { isEmpty } from 'lodash'
import { API_ROOT } from '~/utils/constants'
import { generatePlaceHolderCard } from '~/utils/formatters'
import { mapOrder } from '~/utils/sorts'
import authorizeAxiosInstance from '~/utils/authorizeAxios'

// Defines the default state of This Slice
const initialState = {
  currentNotification: null
}

// Handling call Api (Async) and update data to redux: using middleware createAsyncThunk & extraReducer
export const fetchInvitationAPI = createAsyncThunk(
  'notification/fetchInvitationAPI',
  async () => {
    const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/invitations`)
    return response.data
  }
)

export const updateBoardInvitationAPI = createAsyncThunk(
  'notification/updateBoardInvitationAPI',
  async ({ status, invitationId }) => {
    const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/invitations/board/${invitationId}`, { status })
    return response.data
  }
)
// Defines Slice in Redux Store
export const notificationSlice = createSlice({
  name: 'notification',
  initialState,

  // reducer handle sync logic:
  reducers: {
    updateCurrentNotification: (state, action) => {
      state.currentNotification = action.payload
    },

    clearCurrentNotification: (state) => {
      state.currentNotification = ''
    },

    addNotification: (state, action) => {
      const inComingInvitation = action.payload
      state.currentNotification.unshift(inComingInvitation)
    }
  },

  // ExtraReducer handle async logic
  extraReducers: (builder) => {
    builder.addCase(fetchInvitationAPI.fulfilled, (state, action) => {
      // action.payload = response.data
      let incomingInvitations = action.payload

      state.currentNotification = Array.isArray(incomingInvitations) ? incomingInvitations.reverse() : []
    }),

    builder.addCase(updateBoardInvitationAPI.fulfilled, (state, action) => {
      // action.payload = response.data
      const incomingInvitations = action.payload

      const getInvitation = state.currentNotification.find(i => i._id === incomingInvitations._id)
      if (getInvitation) {
        getInvitation.boardInvitation = incomingInvitations.boardInvitation
      }
    })
  }
})

// Action creators are generated for each case reducer function
export const { updateCurrentNotification, clearCurrentNotification, addNotification } = notificationSlice.actions

// Selector to get data from the Redux store
export const selectCurrentNotification = (state) => {
  return state.notification.currentNotification
}

// export reducer
export const notificationReducer = notificationSlice.reducer