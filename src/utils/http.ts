import axios from 'axios';
import { getDeviceId } from './get-device-id';

const http = axios.create({
  withCredentials: true,
});

http.interceptors.request.use((config) => {
  config.headers.set('device-id', getDeviceId());
  return config;
});

export { http };
