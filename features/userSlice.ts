import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../store';
// Define a type for the slice state
interface UserState {
  username: string | null;
  email: string | null;
  phoneNumber?: number;
  photo: string | null;
  uid: string;
  friends: string[];
  posts: string[];
}

// Define the initial state using that type
const initialState: UserState = {
  username: '',
  email: '',
  phoneNumber: undefined,
  photo: '',
  uid: '',
  friends: [],
  posts: [],
};

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    changeUser: (state, action: PayloadAction<UserState>) => {
      state.value = action.payload;
    },
  },
});

export const {changeUser} = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user.value;

export default userSlice.reducer;
