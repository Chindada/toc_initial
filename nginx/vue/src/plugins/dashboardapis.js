import axios from 'axios'

const ApiRequest = axios.create({
  headers: { 'Cache-Control': 'no-cache' }
})
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
const NotifyURL = '/ioms5system/crud/notification/setting' //主動推播
const NotifyDeleteMultiURL = '/ioms5system/crud/notification/setting/multi' //主動推播多筆刪除
const NotificationrecordURL = '/ioms5data/crud/system/notificationrecord' //推播列表
const workshopKanbanURL = '/ioms5system/crud/basic/workshopkanban' //廠區看板
const workshopKanbanCategoryURL = '/ioms5system/crud/basic/workshopkanban/category' // 取得單個廠區看板資訊
// const workshopKanbanCategoriesURL = '/ioms5system/crud/basic/workshopkanban/categories' //  取得複數個廠區看板資訊
const workshopKanbanCategoriesURL = '/ioms5data/function/system/workshopkanban' //  取得複數個廠區看板資訊

//看板版本
export const KanbanModeAPI = config =>
  ApiRequest.get('/ioms5data/function/system/kanbanmode', config)
//系統時間、語言、checkTesk、廠區、系統設定for看版
export const RemoteInfoAPI = config =>
  ApiRequest.get('/ioms5data/function/system/remoteinfo', config)
//對時
export const SystemTimeAPI = config => ApiRequest.get('/ioms5system/function/system/time', config)
//設備任務
export const TaskkanbanAPI = config => ApiRequest.get('/ioms5data/analyze/kanban/task', config)
//設備狀態
export const MachineStatusAPI = config =>
  ApiRequest.get('/ioms5data/analyze/kanban/machinestatus', config)
//UAPQ
export const TeepAPI = config => ApiRequest.get('/ioms5system/analyze/kanban/teep', config)
//30模次週期時間
export const RecentsctAPI = config =>
  ApiRequest.get('/ioms5system/analyze/kanban/recentsct', config)
//24小時GYR
export const GyrAPI = config => ApiRequest.get('/ioms5system/analyze/kanban/gyr', config)
//取得下三個排程
export const NextScheduleAPI = config =>
  ApiRequest.get('/ioms5system/analyze/kanban/nextschedule', config)

export const NotifyDeleteMultiAPI = {
  delete: function(config) {
    return ApiRequest.delete(NotifyDeleteMultiURL, config)
  }
}
export const NotifyAPI = {
  get: function(config) {
    return ApiRequest.get(NotifyURL, config)
  },
  post: function(data, config) {
    return ApiRequest.post(NotifyURL, data, config)
  },
  put: function(data, config) {
    return ApiRequest.put(NotifyURL, data, config)
  },
  delete: function(config) {
    return ApiRequest.delete(NotifyURL, config)
  }
}

export const NotificationrecordAPI = {
  get: function(config) {
    return ApiRequest.get(NotificationrecordURL, config)
  },
  put: function(data, config) {
    return ApiRequest.put(NotificationrecordURL, data, config)
  }
}

export const workshopKanbanAPI = {
  get: function(config) {
    return ApiRequest.get(workshopKanbanURL, config)
  },
  post: function(data, config) {
    return ApiRequest.post(workshopKanbanURL, data, config)
  },
  put: function(data, config) {
    return ApiRequest.put(workshopKanbanURL, data, config)
  },
  delete: function(config) {
    return ApiRequest.delete(workshopKanbanURL, config)
  }
}

export const workshopKanbanCategoryAPI = {
  get: function(config) {
    return ApiRequest.get(workshopKanbanCategoryURL, config)
  }
}

export const workshopKanbanCategoriesAPI = {
  get: function(config) {
    return ApiRequest.get(workshopKanbanCategoriesURL, config)
  }
}
