import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const responseData = error.response?.data;
    const detailMessage = Array.isArray(responseData?.details)
      ? responseData.details.map((detail) => detail.message || detail).join('; ')
      : '';
    const message =
      detailMessage ||
      responseData?.error ||
      responseData?.message ||
      (error.response?.status >= 500
        ? 'The server could not complete the request. Please try again.'
        : error.message) ||
      'An unexpected error occurred. Please try again.';
    const requestError = new Error(message);
    requestError.status = error.response?.status;
    requestError.code = error.code;
    return Promise.reject(requestError);
  }
);

export default api;
