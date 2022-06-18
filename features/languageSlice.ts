import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Language} from '../models/types';
import {RootState} from '../store';

const initialState: Language = {
  language: '',
};

export const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    changeLanguage: (state, action: PayloadAction<Language>) => {
      state.value = action.payload;
    },
  },
});

export const {changeLanguage} = languageSlice.actions;

export const selectLanguage = (state: RootState) => state.language.value;

export default languageSlice.reducer;
