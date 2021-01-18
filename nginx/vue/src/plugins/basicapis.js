import axios from 'axios'
axios.defaults.headers.common['Cache-Control'] = 'no-cache'
const ApiRequest = axios.create({})

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

const ProductURL = '/ioms5system/crud/basic/product' //製品
const ProductmultideleteURL = '/ioms5system/crud/basic/product/multi' //製品多筆刪除
const MoldURL = '/ioms5system/crud/basic/mold' //模具
const MoldmultideleteURL = '/ioms5system/crud/basic/mold/multi' //模具多筆刪除

const MoldImportURL = '/ioms5system/function/mold/importrel' //模具匯入關聯
const ImportProductURL = '/ioms5system/function/product/importproductinfo' //匯入製品
const MachineURL = '/ioms5system/crud/basic/machine' //設備
const MachineDeleteMultiURL = '/ioms5system/crud/basic/machine/multi' //設備刪除多個
const MaterialURL = '/ioms5system/crud/basic/material' //原料
const MaterialmultideleteURL = '/ioms5system/crud/basic/material/multi' //原料多筆刪除

const EmployeeClassURL = '/ioms5system/crud/basic/class' //人員班別
const EmployeeClassDeleteMultiURL = '/ioms5system/crud/basic/class/multi' //人員班別多筆刪除
const EmployeeHolidayURL = '/ioms5system/crud/basic/holiday' //人員假日
const EmployeeHolidayDeleteMultiURL = '/ioms5system/crud/basic/holiday/multi' //人員假日多筆刪除
const EmployeeScheduleURL = '/ioms5system/crud/basic/class/schedule' //人員排班
const EmployeeScheduleDeleteMultURL = '/ioms5system/crud/basic/class/schedule/multi' //人員排班多筆刪除

const dcURL = '/ioms5system/crud/system/dc' //DC
const dcDeleteMultiURL = '/ioms5system/crud/system/dc/multi' //DC多筆刪除
const DsURL = '/ioms5system/crud/system/ds' //DS
const DsDeleteMultiURL = '/ioms5system/crud/system/ds/multi' //DS

const WorkShopURL = '/ioms5system/crud/basic/workshop' //廠區
const WorkShopmultideleteURL = '/ioms5system/crud/basic/workshop/multi' //廠區多筆刪除

const WorkShopTypeURL = '/ioms5system/crud/basic/workshopclass' //廠別
const WorkShopTypemultideleteURL = '/ioms5system/crud/basic/workshopclass/multi' //廠別多筆刪除

const CompanyURL = '/ioms5system/crud/basic/company' //夥伴
const SystemSettingMultiURL = '/ioms5system/crud/system/setting/multi' //系統設定多個
const SystemSettingURL = '/ioms5system/crud/system/setting' //系統設定

// 取得txt資料
export const gettxtversion = config => ApiRequest.get('../../../version.txt', config)

// Login
export const apiLogin = config => ApiRequest.get('/ioms5system/auth/login', config)
// Logout
export const apiLogout = config => ApiRequest.get('/ioms5system/auth/logout', config)
// 取得語言
export const getlanguage = config => ApiRequest.get('/ioms5system/function/system/language', config)

// 取得未登入的DC
export const UnregisteredDevice = config => ApiRequest.get('/ioms5data/options/deviceinfo', config)
//取得已關聯設備的模具
export const Moldisassociated = config =>
  ApiRequest.get('/ioms5system/function/mold/isassociated', config)

//匯入製品
export const ImportProductAPI = {
  post: function(data, config) {
    return ApiRequest.post(ImportProductURL, data, config)
  }
}
//模具匯入關聯
export const MoldImportAPI = {
  put: function(data, config) {
    return ApiRequest.put(MoldImportURL, data, config)
  }
}
//選單
//設備
export const gmachineSelectAPI = config => ApiRequest.get('/ioms5system/options/machine', config)
//原料
export const gmaterialSelectAPI = config => ApiRequest.get('/ioms5system/options/material', config)
//模具
export const moldSelectAPI = config => ApiRequest.get('/ioms5system/options/mold', config)
//製品
export const productSelectAPI = config => ApiRequest.get('/ioms5system/options/product', config)
//OEE品檢入庫
export const scheduleSelectAPI = config => ApiRequest.get('/ioms5system/options/schedule', config)
//OEE排程模具選單
export const moldSelectOEEAPI = config =>
  ApiRequest.get('/ioms5system/crud/basic/availablemold', config)

//OEE排程模具篩選設備選單
export const moldmachineSelectAPI = config =>
  ApiRequest.get('/ioms5system/options/moldmachine', config)

export const SystemSettingAPI = {
  get: function(config) {
    return ApiRequest.get(SystemSettingURL, config)
  },
  put: function(data, config) {
    return ApiRequest.put(SystemSettingURL, data, config)
  },
  delete: function(config) {
    return ApiRequest.delete(SystemSettingURL, config)
  }
}

export const SystemSettingMultiAPI = {
  get: function(config) {
    return ApiRequest.get(SystemSettingMultiURL, config)
  },
  delete: function(config) {
    return ApiRequest.delete(SystemSettingMultiURL, config)
  }
}

export const ProductmultideleteAPI = {
  delete: function(config) {
    return ApiRequest.delete(ProductmultideleteURL, config)
  }
}
export const ProductAPI = {
  get: function(config) {
    return ApiRequest.get(ProductURL, config)
  },
  post: function(data, config) {
    return ApiRequest.post(ProductURL, data, config)
  },
  put: function(data, config) {
    return ApiRequest.put(ProductURL, data, config)
  },
  delete: function(config) {
    return ApiRequest.delete(ProductURL, config)
  }
}

export const CompanyAPI = {
  get: function(config) {
    return ApiRequest.get(CompanyURL, config)
  },
  post: function(data, config) {
    return ApiRequest.post(CompanyURL, data, config)
  },
  put: function(data, config) {
    return ApiRequest.put(CompanyURL, data, config)
  },
  delete: function(config) {
    return ApiRequest.delete(CompanyURL, config)
  }
}

export const MoldmultideleteAPI = {
  delete: function(config) {
    return ApiRequest.delete(MoldmultideleteURL, config)
  }
}
export const MoldAPI = {
  get: function(config) {
    return ApiRequest.get(MoldURL, config)
  },
  post: function(data, config) {
    return ApiRequest.post(MoldURL, data, config)
  },
  put: function(data, config) {
    return ApiRequest.put(MoldURL, data, config)
  },
  delete: function(config) {
    return ApiRequest.delete(MoldURL, config)
  }
}

export const MachineDeleteMultiAPI = {
  delete: function(config) {
    return ApiRequest.delete(MachineDeleteMultiURL, config)
  }
}
export const MachineAPI = {
  get: function(config) {
    return ApiRequest.get(MachineURL, config)
  },
  post: function(data, config) {
    return ApiRequest.post(MachineURL, data, config)
  },
  put: function(data, config) {
    return ApiRequest.put(MachineURL, data, config)
  },
  delete: function(config) {
    return ApiRequest.delete(MachineURL, config)
  }
}

export const MaterialmultideleteAPI = {
  delete: function(config) {
    return ApiRequest.delete(MaterialmultideleteURL, config)
  }
}
export const MaterialAPI = {
  get: function(config) {
    return ApiRequest.get(MaterialURL, config)
  },
  post: function(data, config) {
    return ApiRequest.post(MaterialURL, data, config)
  },
  put: function(data, config) {
    return ApiRequest.put(MaterialURL, data, config)
  },
  delete: function(config) {
    return ApiRequest.delete(MaterialURL, config)
  }
}
export const EmployeeClassDeleteMultiAPI = {
  delete: function(config) {
    return ApiRequest.delete(EmployeeClassDeleteMultiURL, config)
  }
}
export const EmployeeClassAPI = {
  get: function(config) {
    return ApiRequest.get(EmployeeClassURL, config)
  },
  post: function(data, config) {
    return ApiRequest.post(EmployeeClassURL, data, config)
  },
  put: function(data, config) {
    return ApiRequest.put(EmployeeClassURL, data, config)
  },
  delete: function(config) {
    return ApiRequest.delete(EmployeeClassURL, config)
  }
}

export const EmployeeHolidayDeleteMultiAPI = {
  delete: function(config) {
    return ApiRequest.delete(EmployeeHolidayDeleteMultiURL, config)
  }
}
export const EmployeeHolidayAPI = {
  get: function(config) {
    return ApiRequest.get(EmployeeHolidayURL, config)
  },
  post: function(data, config) {
    return ApiRequest.post(EmployeeHolidayURL, data, config)
  },
  put: function(data, config) {
    return ApiRequest.put(EmployeeHolidayURL, data, config)
  },
  delete: function(config) {
    return ApiRequest.delete(EmployeeHolidayURL, config)
  }
}
export const EmployeeScheduleDeleteMultAPI = {
  delete: function(config) {
    return ApiRequest.delete(EmployeeScheduleDeleteMultURL, config)
  }
}
export const EmployeeScheduleAPI = {
  get: function(config) {
    return ApiRequest.get(EmployeeScheduleURL, config)
  },
  post: function(data, config) {
    return ApiRequest.post(EmployeeScheduleURL, data, config)
  },
  put: function(data, config) {
    return ApiRequest.put(EmployeeScheduleURL, data, config)
  },
  delete: function(config) {
    return ApiRequest.delete(EmployeeScheduleURL, config)
  }
}

export const DCDeleteMultiAPI = {
  delete: function(config) {
    return ApiRequest.delete(dcDeleteMultiURL, config)
  }
}
export const DCAPI = {
  get: function(config) {
    return ApiRequest.get(dcURL, config)
  },
  post: function(data, config) {
    return ApiRequest.post(dcURL, data, config)
  },
  put: function(data, config) {
    return ApiRequest.put(dcURL, data, config)
  },
  delete: function(config) {
    return ApiRequest.delete(dcURL, config)
  }
}

export const DsDeleteMultiAPI = {
  delete: function(config) {
    return ApiRequest.delete(DsDeleteMultiURL, config)
  }
}
export const DSAPI = {
  get: function(config) {
    return ApiRequest.get(DsURL, config)
  },
  post: function(data, config) {
    return ApiRequest.post(DsURL, data, config)
  },
  put: function(data, config) {
    return ApiRequest.put(DsURL, data, config)
  },
  delete: function(config) {
    return ApiRequest.delete(DsURL, config)
  }
}
export const WorkShopmultideleteAPI = {
  delete: function(config) {
    return ApiRequest.delete(WorkShopmultideleteURL, config)
  }
}
export const WorkShopAPI = {
  get: function(config) {
    return ApiRequest.get(WorkShopURL, config)
  },
  post: function(data, config) {
    return ApiRequest.post(WorkShopURL, data, config)
  },
  put: function(data, config) {
    return ApiRequest.put(WorkShopURL, data, config)
  },
  delete: function(config) {
    return ApiRequest.delete(WorkShopURL, config)
  }
}

export const WorkShopTypemultideleteAPI = {
  get: function(config) {
    return ApiRequest.get(WorkShopTypemultideleteURL, config)
  },
  delete: function(config) {
    return ApiRequest.delete(WorkShopTypemultideleteURL, config)
  }
}
export const WorkShopTypeAPI = {
  get: function(config) {
    return ApiRequest.get(WorkShopTypeURL, config)
  },
  post: function(data, config) {
    return ApiRequest.post(WorkShopTypeURL, data, config)
  },
  put: function(data, config) {
    return ApiRequest.put(WorkShopTypeURL, data, config)
  },
  delete: function(config) {
    return ApiRequest.delete(WorkShopTypeURL, config)
  }
}
