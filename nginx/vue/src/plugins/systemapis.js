import axios from 'axios'
axios.defaults.headers.common['Cache-Control'] = 'no-cache'
const ApiRequest = axios.create({})
const DefectURL = '/ioms5system/crud/basic/defect' //缺陷
const AccountURL = '/ioms5system/crud/auth/account' //帳號
const AccountDeleteMultiURL = '/ioms5system/crud/auth/account/multi' //帳號
const RoleURL = '/ioms5system/crud/auth/role' //角色
const RoleResourceURL = '/ioms5system/crud/auth/roleresourcerel' //角色資源
const RoleResourceMultiURL = '/ioms5system/crud/auth/roleresourcerel/multi' //角色資源多筆編輯
const ResourceURL = '/ioms5system/crud/auth/resource' //資源列表

// 邊更密碼
export const ChangePwdAPI = config =>
  ApiRequest.get('/ioms5system/crud/auth/account/changePwd', config)

ApiRequest.interceptors.response.use(
  function(response) {
    return response
  },
  function(error) {
    var message = error.response.data.response
    if (message == 'token invalid') {
      window.location.assign('/')
    }
    return Promise.reject(error)
  }
)

export const DefectAPI = {
  get: function(config) {
    return ApiRequest.get(DefectURL, config)
  },
  post: function(data, config) {
    return ApiRequest.post(DefectURL, data, config)
  },
  put: function(data, config) {
    return ApiRequest.put(DefectURL, data, config)
  },
  delete: function(config) {
    return ApiRequest.delete(DefectURL, config)
  }
}

export const RoleAPI = {
  get: function(config) {
    return ApiRequest.get(RoleURL, config)
  },
  post: function(data, config) {
    return ApiRequest.post(RoleURL, data, config)
  },
  put: function(data, config) {
    return ApiRequest.put(RoleURL, data, config)
  },
  delete: function(config) {
    return ApiRequest.delete(RoleURL, config)
  }
}
export const AccountDeleteMultiAPI = {
  delete: function(config) {
    return ApiRequest.delete(AccountDeleteMultiURL, config)
  }
}
export const AccountAPI = {
  get: function(config) {
    return ApiRequest.get(AccountURL, config)
  },
  post: function(data, config) {
    return ApiRequest.post(AccountURL, data, config)
  },
  put: function(data, config) {
    return ApiRequest.put(AccountURL, data, config)
  },
  delete: function(config) {
    return ApiRequest.delete(AccountURL, config)
  }
}

export const RoleResourceMultiAPI = {
  put: function(data, config) {
    return ApiRequest.put(RoleResourceMultiURL, data, config)
  }
}
export const RoleResourceAPI = {
  get: function(config) {
    return ApiRequest.get(RoleResourceURL, config)
  },
  put: function(data, config) {
    return ApiRequest.put(RoleResourceURL, data, config)
  }
}

export const ResourceAPI = {
  get: function(config) {
    return ApiRequest.get(ResourceURL, config)
  },
  post: function(data, config) {
    return ApiRequest.post(ResourceURL, data, config)
  },
  put: function(data, config) {
    return ApiRequest.put(ResourceURL, data, config)
  },
  delete: function(config) {
    return ApiRequest.delete(ResourceURL, config)
  }
}
