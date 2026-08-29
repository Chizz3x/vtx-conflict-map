import { combineReducers } from '@reduxjs/toolkit';
import { modalsSlice } from './modals';
import { deviceSlice } from './device';

export const rootReducer = combineReducers({
  [modalsSlice.name]: modalsSlice.reducer,
  [deviceSlice.name]: deviceSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
