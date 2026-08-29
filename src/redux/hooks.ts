import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch as useDispatchDefault, useSelector as useSelectorDefault } from 'react-redux';
import type { AppDispatch, RootState } from './store';

export const useDispatch = () => useDispatchDefault<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorDefault;
