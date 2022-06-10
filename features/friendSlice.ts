import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Friend} from '../models/types';
import {RootState} from '../store';

// Define the initial state using that type
const initialState: Friend = {
  email: '',
  friends: [],
  id: '',
  photo: '',
  posts: [],
  username: '',
};

export const friendSlice = createSlice({
  name: 'friend',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    changeFriend: (state, action: PayloadAction<Friend>) => {
      state.value = action.payload;
    },
  },
});

export const {changeFriend} = friendSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectFriend = (state: RootState) => state.friend.value;

export default friendSlice.reducer;
