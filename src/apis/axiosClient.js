import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

const axiosClient = axios.create({
  baseURL: API_ROOT,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request Interceptor
axiosClient.interceptors.request.use(
  (config) => {
    // Thêm Authorization token nếu có
    // const token = localStorage.getItem('accessToken')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý lỗi toàn cục (ví dụ: hết hạn token)
    // if (error.response?.status === 401) {
    //   console.warn('Unauthorized - redirect to login')
    //   // window.location.href = '/login'
    // }

    // Ghi log lỗi nếu cần
    // console.error('API Error:', error)

    return Promise.reject(error)
  }
)

export default axiosClient