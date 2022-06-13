import {configureStore} from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import friendReducer from './features/friendSlice';
import eventReducer from './features/eventSlice';
import eventsReducer from './features/eventsSlice';
import friendsReducer from './features/friendsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    friend: friendReducer,
    event: eventReducer,
    events: eventsReducer,
    friends: friendsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
