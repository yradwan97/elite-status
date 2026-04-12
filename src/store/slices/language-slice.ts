import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LanguageState {
  currentLanguage: 'en' | 'ar';
}

const initialState: LanguageState = {
  currentLanguage: 'en', // default
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<'en' | 'ar'>) => {
      state.currentLanguage = action.payload;
    },
    toggleLanguage: (state) => {
      state.currentLanguage = state.currentLanguage === 'en' ? 'ar' : 'en';
    },
  },
});

export const { setLanguage, toggleLanguage } = languageSlice.actions;
export default languageSlice.reducer;