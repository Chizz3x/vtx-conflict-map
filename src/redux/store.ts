import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './slices';

const IS_DEV = process.env.NODE_ENV === 'development';

export const store = configureStore({
  reducer: rootReducer,
  devTools: IS_DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
