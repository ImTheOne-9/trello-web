import { asyncThunkCreator, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { isEmpty } from 'lodash'
import axiosClient from '~/apis/axiosClient'
import { API_ROOT } from '~/utils/constants'
import { generatePlaceHolderCard } from '~/utils/formatters'
import { mapOrder } from '~/utils/sorts'

// Defines the default state of This Slice
const initialState = {
  currentActiveBoard: null
}

// Handling call Api (Async) and update data to redux: using middleware createAsyncThunk & extraReducer
export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId) => {
    const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
    return response.data
  }
)

// Defines Slice in Redux Store
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,

  // reducer handle sync logic:
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      const board = action.payload

      // handle Data

      // Update currentActiveBoard data
      state.currentActiveBoard = board
    }
  },

  // ExtraReducer handle async logic
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      // action.payload = response.data
      const board = action.payload

      // handle Data
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')
      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceHolderCard(column)]
          column.cardOrderIds = [generatePlaceHolderCard(column)._id]
        } else {
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })

      // Update currentActiveBoard data
      state.currentActiveBoard = board
    })
  }
})

// Action creators are generated for each case reducer function
export const { updateCurrentActiveBoard } = activeBoardSlice.actions

// Selector to get data from the Redux store
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

// export reducer
export const activeBoardReducer = activeBoardSlice.reducer