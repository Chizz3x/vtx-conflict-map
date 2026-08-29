import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BaseModalOptions {
  title?: string;
  zIndex?: number;
  status?: 'opening' | 'open' | 'closing';
}

export type ModalsState = Record<string, BaseModalOptions & Record<string, unknown>>;

export interface ModalsSliceState {
  entries: ModalsState;
  zIndexCounter: number;
}

export type OpenPayload = Record<string, BaseModalOptions & Record<string, unknown> | null>;

export type ClosePayload = string | string[];

const initialState: ModalsSliceState = {
  entries: {},
  zIndexCounter: 1000,
};

export const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    openModal(state, action: PayloadAction<OpenPayload>) {
      const { payload } = action;
      if (!payload) return;

      for (const key in payload) {
        if (!Object.prototype.hasOwnProperty.call(payload, key)) continue;
        const v = payload[key];
        if (v == null) {
          delete state.entries[key];
        } else {
          const { zIndex, ...rest } = v;
          state.entries[key] = {
            ...rest,
            zIndex: zIndex ?? ++state.zIndexCounter,
          };
        }
      }
    },

    closeModal(state, action: PayloadAction<ClosePayload>) {
      const ids = Array.isArray(action.payload) ? action.payload : [action.payload];
      ids.forEach((id) => {
        delete state.entries[id];
      });
    },

    bringToFront(state, action: PayloadAction<{ id: string }>) {
      const inst = state.entries[action.payload.id];
      if (inst) {
        inst.zIndex = ++state.zIndexCounter;
      }
    },

    setStatus(state, action: PayloadAction<{ id: string; status: BaseModalOptions['status'] }>) {
      const inst = state.entries[action.payload.id];
      if (inst) inst.status = action.payload.status;
    },
  },
});

export const { openModal, closeModal, bringToFront, setStatus } = modalsSlice.actions;

export const selectAllModals = (state: { modals: ModalsSliceState }) =>
  Object.entries(state.modals.entries) as [string, BaseModalOptions & Record<string, unknown>][];
