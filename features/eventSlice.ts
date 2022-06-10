import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Event} from '../models/types';
import {RootState} from '../store';

const initialState: Event = {
  event_id: '',
  attendees: [],
  availability: [],
  companyMediaFilename: '',
  companyName: '',
  dateActualFrom: '',
  dateActualUntil: '',
  dateCreated: '',
  datePublishFrom: '',
  dateSalesFrom: '',
  dateSalesUntil: '',
  favoritedTimes: 0,
  hasFreeInventoryItems: false,
  hasInventoryItems: false,
  isActual: false,
  maxPrice: {},
  mediaFilename: '',
  minPrice: {},
  name: '',
  place: '',
  pricingInformation: '',
  productType: 0,
  salesEnded: false,
  salesOngoing: false,
  salesPaused: false,
  salesStarted: false,
  timeUntilActual: 0,
  timeUntilSalesStart: 0,
  photoUrl: '',
};

export const eventSlice = createSlice({
  name: 'event',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    changeEvent: (state, action: PayloadAction<Event>) => {
      state.value = action.payload;
    },
  },
});

export const {changeEvent} = eventSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectEvent = (state: RootState) => state.event.value;

export default eventSlice.reducer;
