import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Events} from '../models/types';
import {RootState} from '../store';

const initialState: Events = {
  events: [],
};

export const eventsSlice = createSlice({
  name: 'events',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    changeEvents: (state, action: PayloadAction<Events>) => {
      state.value = action.payload;
    },
  },
});

export const {changeEvents} = eventsSlice.actions;

export const selectEvents = (state: RootState) => state.events.value;

export default eventsSlice.reducer;
