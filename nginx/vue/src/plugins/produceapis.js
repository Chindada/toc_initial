import axios from 'axios'
axios.defaults.headers.common['Cache-Control'] = 'no-cache'
const ApiRequest = axios.create({})
const ManufacturingorderURL = '/ioms5system/crud/info/manufacturingorder' //製令
const ManufacturingorderImportURL = '/ioms5system/crud/info/manufacturingorder/excel' //製令匯入
const ManufacturingordermultideleteURL = '/ioms5system/crud/info/manufacturingorder/multi' //製令多筆刪除
const ManufacturingorderallURL = '/ioms5system/crud/info/manufacturingorder/filter' //製令getall

const ScheduleMultiURL = '/ioms5system/crud/info/schedule/multi' //排程multi
const ScheduleTtimeURL = '/ioms5system/function/schedule/timerange' //排程依時間
const TaskURL = '/ioms5system/crud/post/taskrecord' //任務
const TaskDeleteMultiURL = '/ioms5system/crud/post/taskrecord/multi' //任務多筆刪除
const TaskallURL = '/ioms5system/crud/post/taskrecord/filter' //任務getall
const ProductInspectorRecordURL = '/ioms5system/crud/post/productinspectorrecord' //品檢
const ProductInspectorRecordDeleteMultiURL = '/ioms5system/crud/post/productinspectorrecord/multi' //品檢多筆刪除
const ProductInspectorRecordallURL = '/ioms5system/crud/post/productinspectorrecord/filter' //品檢all
const ProductStorageRecordURL = '/ioms5system/crud/post/productrecord' //入庫
const ProductStorageRecordDeleteMultiURL = '/ioms5system/crud/post/productrecord/multi' //入庫多筆刪除
const ProductStorageRecordallURL = '/ioms5system/crud/post/productrecord/filter' //入庫all
const AbnormalURL = '​/ioms5system​/crud​/basic​/errorrecord' //異常
const taskerrorURL = '/ioms5system/crud/basic/errorrecord' //任務異常回報

const ScheduleOEEURL = '/ioms5system/function/schedule/oee' //排程OEE
const ScheduleOEEnewmultiURL = '/ioms5system/function/schedule/oee/multi' //新增排程多個OEE
const ScheduleOEEplusURL = '/ioms5system/function/schedule/oeeplus' //排程OEEplus
const ScheduleOEEmultieditURL = '/ioms5system/function/schedule/oee/multi' //排程OEE多筆編輯
const ScheduleOEEplusmultieditURL = '/ioms5system/function/schedule/oeeplus/multi' //排程OEEplus多筆編輯

const ScheduleIPSURL = '/ioms5system/crud/info/schedule' //排程IPS
const ScheduleOEEplusallURL = '/ioms5system/function/schedule/oeeplus/filter' //排程OEEplus getall
const ScheduleOEEallURL = '/ioms5system/function/schedule/oee/filter' //排程OEE getall
const ScheduleOEEplusMoldMachineURL = '/ioms5system/options/moldmachine' //排程OEE+編輯取得模具對應設備

const ManufacturingorderSelectURL = '/ioms5system/options/manufacturingorder' //製令選單

//製品匯出
export const manufactureorderReportDonloadExcelAPI = config =>
  ApiRequest.get('/ioms5system/analyze/report/manufactureorder', config)

// 品檢-製品模具設備搜尋
export const InspectorSearch = config =>
  ApiRequest.get('/ioms5system/function/task/searchingforinspector', config)
// 入庫-製品模具設備搜尋
export const StorageSearch = config =>
  ApiRequest.get('/ioms5system/function/task/searchingforpostrecord', config)

// 品檢入庫islast確認
export const ProductrecordInfoAPI = config =>
  ApiRequest.get('/ioms5system/crud/post/productrecord/info', config)

// //入庫-製品模具設備搜尋
// export const StorageSearch = config =>
//   ApiRequest.get('​/ioms5system/task/searchingforpostrecord', config)

// 取得任務下製令製品
export const GetTaskManufacturingorder = config =>
  ApiRequest.get('/ioms5system/function/manufacturingorder/manufactureOrderInfo', config)

// 取得未完成品檢之任務
export const GetInspectoroptions = config =>
  ApiRequest.get('/ioms5system/task/inspectoroptions', config)

// 取得未完成入庫之任務
export const GetProductRecordOptions = config =>
  ApiRequest.get('/ioms5system/task/productRecordOptions', config)

// OEE+取得模具關聯設備
export const GetMoldMachineOEEplusAPI = config =>
  ApiRequest.get('/ioms5system/function/schedule/oeeplus/molddetail', config)

// 取得製令編號
export const GetOEEScheduleSerialAPI = config =>
  ApiRequest.get('/ioms5system/function/schedule/oee/serial', config)
// 取得製令編號
export const GetManufactureNumAPI = config =>
  ApiRequest.get('/ioms5system/function/manufacturingorder/number', config)
// 取得品檢編號
export const GetInspectorNumAPI = config =>
  ApiRequest.get('/ioms5system/function/product/inspectornumber', config)
// 取得入庫編號
export const GetStorageNumAPI = config =>
  ApiRequest.get('/ioms5system/function/product/storagenumber', config)
// 製令轉模具
export const ManufacturetoToMold = config =>
  ApiRequest.get('/ioms5system/function/schedule/manufacturetotomold/v3', config)
//製令模具轉排程
export const ManufactureToSchedule = (data, config) =>
  ApiRequest.post('/ioms5system/function/schedule/manufacturetoschedule/v3', data, config)
//排程編輯IPS
export const ScheduleChange = (data, config) =>
  ApiRequest.post('/ioms5system/function/schedule/change/v3', data, config)
// 製令匯出
export const ExportManufacturingorder = config =>
  ApiRequest.get('/ioms5system/function/manufacturingorder/report', config)

// 結束任務異常
// export const EndTaskErrorURL = config =>
//   ApiRequest.put(' /ioms5system/crud/basic/errorrecordrel', data, config)

// OEE品檢排成選單
export const OptionScheduleInspecting = config =>
  ApiRequest.get('/ioms5system/options/schedule/inspecting', config)
// OEE入庫排成選單
export const OptionSchedule = config =>
  ApiRequest.get('/ioms5system/options/schedule/postingproduct', config)

//批量解除任務異常
export const Errorrecordrelall = (data, config) =>
  ApiRequest.put('/ioms5system/crud/basic/errorrecordrel/multi', data, config)

const EndTaskErrorURL = '/ioms5system/crud/basic/errorrecordrel' //結束任務異常
export const EndTaskError = {
  put: function(data, config) {
    return ApiRequest.put(EndTaskErrorURL, data, config)
  }
}
export const TaskallAPI = {
  get: function(config) {
    return ApiRequest.get(TaskallURL, config)
  }
}

export const TaskDeleteMultiAPI = {
  delete: function(config) {
    return ApiRequest.delete(TaskDeleteMultiURL, config)
  }
}
export const TaskAPI = {
  get: function(config) {
    return ApiRequest.get(TaskURL, config)
  },
  post: function(data, config) {
    return ApiRequest.post(TaskURL, data, config)
  },
  put: function(data, config) {
    return ApiRequest.put(TaskURL, data, config)
  },
  delete: function(config) {
    return ApiRequest.delete(TaskURL, config)
  }
}

export const ProductStorageRecordallAPI = {
  get: function(config) {
    return ApiRequest.get(ProductStorageRecordallURL, config)
  }
}

export const ProductStorageRecordDeleteMultiAPI = {
  delete: function(config) {
    return ApiRequest.delete(ProductStorageRecordDeleteMultiURL, config)
  }
}

export const ProductStorageRecordAPI = {
  get: function(config) {
    return ApiRequest.get(ProductStorageRecordURL, config)
  },
  post: function(data, config) {
    return ApiRequest.post(ProductStorageRecordURL, data, config)
  },
  put: function(data, config) {
    return ApiRequest.put(ProductStorageRecordURL, data, config)
  },
  delete: function(config) {
    return ApiRequest.delete(ProductStorageRecordURL, config)
  }
}

export const ProductInspectorRecordallAPI = {
  get: function(config) {
    return ApiRequest.get(ProductInspectorRecordallURL, config)
  }
}
export const ProductInspectorRecordDeleteMultiAPI = {
  delete: function(config) {
    return ApiRequest.delete(ProductInspectorRecordDeleteMultiURL, config)
  }
}
export const ProductInspectorRecordAPI = {
  get: function(config) {
    return ApiRequest.get(ProductInspectorRecordURL, config)
  },
  post: function(data, config) {
    return ApiRequest.post(ProductInspectorRecordURL, data, config)
  },
  put: function(data, config) {
    return ApiRequest.put(ProductInspectorRecordURL, data, config)
  },
  delete: function(config) {
    return ApiRequest.delete(ProductInspectorRecordURL, config)
  }
}

export const ScheduleAPI = {
  get: function(config) {
    return ApiRequest.get(ScheduleIPSURL, config)
  },
  delete: function(config) {
    return ApiRequest.delete(ScheduleIPSURL, config)
  }
}
export const ScheduleTtimeAPI = {
  get: function(config) {
    return ApiRequest.get(ScheduleTtimeURL, config)
  }
}
export const ScheduleMultiAPI = {
  get: function(config) {
    return ApiRequest.get(ScheduleMultiURL, config)
  },
  delete: function(config) {
    return ApiRequest.delete(ScheduleMultiURL, config)
  }
}

export const ManufacturingorderallAPI = {
  get: function(config) {
    return ApiRequest.get(ManufacturingorderallURL, config)
  }
}

export const ManufacturingordermultideleteAPI = {
  delete: function(config) {
    return ApiRequest.delete(ManufacturingordermultideleteURL, config)
  }
}

export const ManufacturingorderImportAPI = {
  post: function(data, config) {
    return ApiRequest.post(ManufacturingorderImportURL, data, config)
  }
}
export const ManufacturingorderAPI = {
  get: function(config) {
    return ApiRequest.get(ManufacturingorderURL, config)
  },
  post: function(data, config) {
    return ApiRequest.post(ManufacturingorderURL, data, config)
  },
  put: function(data, config) {
    return ApiRequest.put(ManufacturingorderURL, data, config)
  },
  delete: function(config) {
    return ApiRequest.delete(ManufacturingorderURL, config)
  }
}
export const ManufacturingorderSelectAPI = {
  get: function(config) {
    return ApiRequest.get(ManufacturingorderSelectURL, config)
  }
}

export const ScheduleOEEnewmultiAPI = {
  post: function(data, config) {
    return ApiRequest.post(ScheduleOEEnewmultiURL, data, config)
  }
}
export const ScheduleOEEAPI = {
  get: function(config) {
    return ApiRequest.get(ScheduleOEEURL, config)
  },
  post: function(data, config) {
    return ApiRequest.post(ScheduleOEEURL, data, config)
  },
  put: function(data, config) {
    return ApiRequest.put(ScheduleOEEURL, data, config)
  },
  delete: function(config) {
    return ApiRequest.delete(ScheduleOEEURL, config)
  }
}
export const ScheduleOEEplusMoldMachineAPI = {
  get: function(config) {
    return ApiRequest.get(ScheduleOEEplusMoldMachineURL, config)
  }
}
export const ScheduleOEEallAPI = {
  get: function(config) {
    return ApiRequest.get(ScheduleOEEallURL, config)
  }
}
export const ScheduleOEEmultieditAPI = {
  put: function(data, config) {
    return ApiRequest.put(ScheduleOEEmultieditURL, data, config)
  }
}
export const ScheduleOEEplusAPI = {
  post: function(data, config) {
    return ApiRequest.post(ScheduleOEEplusURL, data, config)
  },
  put: function(data, config) {
    return ApiRequest.put(ScheduleOEEplusURL, data, config)
  },
  delete: function(config) {
    return ApiRequest.delete(ScheduleOEEplusURL, config)
  }
}
export const ScheduleOEEplusmultieditAPI = {
  put: function(data, config) {
    return ApiRequest.put(ScheduleOEEplusmultieditURL, data, config)
  }
}

export const ScheduleOEEplusallAPI = {
  get: function(config) {
    return ApiRequest.get(ScheduleOEEplusallURL, config)
  }
}

export const AbnormalAPI = {
  post: function(data, config) {
    return ApiRequest.post(AbnormalURL, data, config)
  },
  put: function(data, config) {
    return ApiRequest.put(AbnormalURL, data, config)
  },
  delete: function(config) {
    return ApiRequest.delete(AbnormalURL, config)
  }
}
export const taskerrorAPI = {
  post: function(data, config) {
    return ApiRequest.post(taskerrorURL, data, config)
  },
  put: function(data, config) {
    return ApiRequest.put(taskerrorURL, data, config)
  },
  delete: function(config) {
    return ApiRequest.delete(taskerrorURL, config)
  }
}
