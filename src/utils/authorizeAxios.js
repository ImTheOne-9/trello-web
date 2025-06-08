import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from './validators'
import { logoutUserAPI } from '~/redux/user/userSlice'
import { refreshTokenAPI } from '~/apis'

// Initialize an Axios instance to customize and configure common settings for the project
let authorizeAxiosInstance = axios.create()

//The maximum waiting time is 10 minutes
authorizeAxiosInstance.defaults.timeout = 1000 * 60 * 10

//Allow Axios to automatically send cookies with each request to the backend
// (used for storing JWT tokens — refresh & access — in the browser's httpOnly cookies).
authorizeAxiosInstance.defaults.withCredentials = true

// Add a request interceptor
authorizeAxiosInstance.interceptors.request.use((config) => {
  // Do something before request is sent
  // Prevent spam click
  interceptorLoadingElements(true)
  return config
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
})

// Inject store: su dung redux store o cac file ngoai pham vi component nhu file nay
let axiosReduxStore

export const injectStore = mainStore => { axiosReduxStore = mainStore }

let refreshTokenPromise = null

// Add a response interceptor
authorizeAxiosInstance.interceptors.response.use((response) => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  // Prevent spam click
  interceptorLoadingElements(false)
  return response
}, (error) => {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  // Prevent spam click
  interceptorLoadingElements(false)

  // refreshToken auto
  // Th1: 401
  if (error.response?.status === 401) {
    axiosReduxStore.dispatch(logoutUserAPI(false))
  }

  // Th1: 410
  const originalRequest = error.config
  // console.log(originalRequest)
  if (error.response?.status === 410) {
    // // Gan them _retry = true trong thoi gian cho, dam bao refresh token chi luon goi 1 lan tai 1 thoi diem 
    // originalRequest._retry = true
    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenAPI()
        .then(res => {
          return res?.accessToken
        })
        .catch(( _error ) => {
          // Neu refresh token bi loi, thi se logout
          axiosReduxStore.dispatch(logoutUserAPI(false))
          return Promise.reject(_error)
        })
        .finally(() => {
          refreshTokenPromise = null
        })
    }

    //
    return refreshTokenPromise.then(accessToken => {
      /** Doi voi truong hop du an can luu accessToken vao localStorage hoac dau do thi viet code xu li o day */
      //axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;

      // Return lai axios instance ket hop cac originalRequest de goi lai nhung api ban dau bi loi
      return authorizeAxiosInstance(originalRequest)
    })
  }

  let errorMessage = error?.message

  if (error.response?.data?.message) {
    errorMessage = error.response?.data?.message
  }

  if (error.response?.status !== 410) {
    // If the error is not a 410 (Gone), display the error message to th
    toast.dismiss()
    toast.error(errorMessage)
  }
  return Promise.reject(error)
})

export default authorizeAxiosInstance
