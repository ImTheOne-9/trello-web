import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'

export const store = configureStore({
  reducer: {
    // Add your reducers here
    activeBoard: activeBoardReducer
  }
})