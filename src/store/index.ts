import { configureStore } from '@reduxjs/toolkit'
// Import your slices here later
// import uiReducer from './slices/uiSlice'
import languageReducer from './slices/language-slice'
import authReducer from './slices/authSlice'

export const store = configureStore({
  reducer: {
    language: languageReducer,
    auth: authReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch