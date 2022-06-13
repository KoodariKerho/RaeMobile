import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Friends} from '../models/types';
import {RootState} from '../store';

const initialState: Friends = {
  friends: [],
};

export const friendsSlice = createSlice({
  name: 'friends',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    changeFriends: (state, action: PayloadAction<Friends>) => {
      state.value = action.payload;
    },
  },
});

export const {changeFriends} = friendsSlice.actions;

export const selectFriends = (state: RootState) => state.friends.value;

export default friendsSlice.reducer;
