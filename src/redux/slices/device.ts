import { createSlice } from '@reduxjs/toolkit';
import { getDeviceId } from '@utils/get-device-id';

export interface DeviceSliceState {
  deviceId: string;
}

const initialState: DeviceSliceState = {
  deviceId: getDeviceId(),
};

export const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {},
});

export const selectDeviceId = (state: { device: DeviceSliceState }) => state.device.deviceId;
