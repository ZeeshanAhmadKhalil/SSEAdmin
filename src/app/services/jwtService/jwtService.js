import FuseUtils from '@fuse/utils/FuseUtils'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
/* eslint-disable camelcase */

class JwtService extends FuseUtils.EventEmitter {
  init() {
    this.setInterceptors()
    this.handleAuthentication()
    this.checkIfLoggedIn()
  }

  checkIfLoggedIn() {
    console.log("LOCALSTORAGE.GETITEM('USER_DATA')")
    console.log(localStorage.getItem('user_data'))
  }

  setInterceptors = () => {
    axios.interceptors.response.use(
      (response) => {
        return response
      },
      (err) => {
        return new Promise((resolve, reject) => {
          if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
            // if you ever get an unauthorized response, logout the user
            this.emit('onAutoLogout', 'Invalid access_token')
            this.setSession(null)
          }
          throw err
        })
      }
    )
  }

  handleAuthentication = () => {
    const access_token = this.getAccessToken()

    if (!access_token) {
      this.emit('onNoAccessToken')

      return
    }

    if (this.isAuthTokenValid(access_token)) {
      this.setSession(access_token)
      this.emit('onAutoLogin', true)
    } else {
      this.setSession(null)
      this.emit('onAutoLogout', 'access_token expired')
    }
  }

  createUser = (data) => {
    return new Promise((resolve, reject) => {
      axios.post('/api/auth/register', data).then((response) => {
        if (response.data.user) {
          this.setSession(response.data.access_token)
          resolve(response.data.user)
        } else {
          reject(response.data.error)
        }
      })
    })
  }

  signInWithEmailAndPassword = (email, password) => {
    return new Promise((resolve, reject) => {
      var myHeaders = new Headers()
      myHeaders.append("Content-Type", "application/json")

      var raw = JSON.stringify({
        "email": email,
        "password": password,
        "fcmToken": "12345",
      })

      var requestOptions = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      }

      fetch(process.env.REACT_APP_API_URL + "/Api/User/Login",
        requestOptions
      ).then(async response => {
        console.log("RESPONSE")
        console.log(response)
        return response.json().then(data => ({
          status: response.status,
          data,
        }))
      }).then(result => {
        console.log("RESULT")
        console.log(result)
        const { status, data } = result
        if (status == 200) {
          if (data.userModel.role.roleName == "Admin") {
            let userData = {
              role: [data.userModel.role.roleName.toLowerCase()],
              data: {
                displayName: data.userModel.fullName,
                photoURL: "https:" + data.userModel.profilePic,
                email: data.userModel.email,
                shortcuts: [],
              },
              redirectUrl: '/deposit-requests',
            }
            localStorage.setItem('user_data', userData)
            resolve(userData)
          } else {
            reject("Invalid email or password")
          }
        } else {
          reject("Invalid email or password")
        }
      }).catch(error => {
        console.error('error', error)
        reject(error)
      })
    })
  }

  signInWithToken = () => {
    return new Promise((resolve, reject) => {
      axios
        .get('/api/auth/access-token', {
          data: {
            access_token: this.getAccessToken(),
          },
        })
        .then((response) => {
          if (response.data.user) {
            this.setSession(response.data.access_token)
            resolve(response.data.user)
          } else {
            this.logout()
            reject(new Error('Failed to login with token.'))
          }
        })
        .catch((error) => {
          this.logout()
          reject(new Error('Failed to login with token.'))
        })
    })
  }

  updateUserData = (user) => {
    return axios.post('/api/auth/user/update', {
      user,
    })
  }

  setSession = (access_token) => {
    if (access_token) {
      localStorage.setItem('jwt_access_token', access_token)
      axios.defaults.headers.common.Authorization = `Bearer ${access_token}`
    } else {
      localStorage.removeItem('jwt_access_token')
      delete axios.defaults.headers.common.Authorization
    }
  }

  logout = () => {
    this.setSession(null)
  }

  isAuthTokenValid = (access_token) => {
    if (!access_token) {
      return false
    }
    const decoded = jwtDecode(access_token)
    const currentTime = Date.now() / 1000
    if (decoded.exp < currentTime) {
      console.warn('access token expired')
      return false
    }

    return true
  }

  getAccessToken = () => {
    return window.localStorage.getItem('jwt_access_token')
  }
}

const instance = new JwtService()

export default instance
