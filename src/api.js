// axiosInstance.js
import axios from 'axios';

const baseURL = 'https://carcareapp.runasp.net/api';

const axiosInstance = axios.create({ baseURL });

let isRefreshing = false;
let failedQueue = [];

const getTokenAndType = () => {
  if (localStorage.getItem('UserToken')) return { token: localStorage.getItem('UserToken'), type: 'User' };
  if (localStorage.getItem('TechnicalToken')) return { token: localStorage.getItem('TechnicalToken'), type: 'Technical' };
  if (localStorage.getItem('AdminToken')) return { token: localStorage.getItem('AdminToken'), type: 'Admin' };
  return { token: null, type: null };
};

const getRefreshToken = () => localStorage.getItem('refreshToken');

const setNewTokens = (type, accessToken, refreshToken) => {
  if (type === 'User') localStorage.setItem('UserToken', accessToken);
  if (type === 'Technical') localStorage.setItem('TechnicalToken', accessToken);
  if (type === 'Admin') localStorage.setItem('AdminToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const clearTokens = () => {
  localStorage.removeItem('UserToken');
  localStorage.removeItem('TechnicalToken');
  localStorage.removeItem('AdminToken');
  localStorage.removeItem('refreshToken');
};

const processQueue = (error, token = null) => {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor
axiosInstance.interceptors.request.use(
  config => {
    const { token } = getTokenAndType();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { token, type } = getTokenAndType();
      const refreshToken = getRefreshToken();

      if (!token || !refreshToken) {
        clearTokens();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            },
            reject: err => reject(err),
          });
        });
      }

      isRefreshing = true;

      try {
        const res = await axios.post(`${baseURL}/account/Get-Refresh-Token`, {
          token,
          refreshToken,
        });

        console.log('Refresh response:', res.data);

        // Make sure the field names match the actual API response!
        const {
          token: accessToken,
          refreshToken: newRefreshToken,
        } = res.data;

        if (!accessToken || !newRefreshToken) {
          throw new Error('Invalid refresh response format');
        }

        setNewTokens(type, accessToken, newRefreshToken);
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        clearTokens();
        window.dispatchEvent(new CustomEvent('token-expired')); // Optional: listen to this globally
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
