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

//整廠-稼動分析
export const GroupShootAPI = config =>
  ApiRequest.get('/ioms5system/analyze/whole/utilizationrate', config)

//整廠-歷程分析
export const GroupCourseAPI = config =>
  ApiRequest.get('/ioms5system/analyze/whole/utilizationprocess', config)
//整廠-總產量分析
export const GroupTotalyieldAPI = config =>
  ApiRequest.get('/ioms5system/analyze/whole/totalyield', config)
//整廠-工時產量分析
export const GroupWorkhryieldAPI = config =>
  ApiRequest.get('/ioms5system/analyze/whole/workinghours', config)

//依設備-工時產量分析
export const MachineWorkhryieldAPI = config =>
  ApiRequest.get('/ioms5system/analyze/machine/workinghours', config)
//依設備-生產效率分析
export const MachineProductivityAPI = config =>
  ApiRequest.get('/ioms5system/analyze/machine/produceeffect', config)

//依製品-生產效率分析
export const ProduceProductivityAPI = config =>
  ApiRequest.get('/ioms5system/analyze/product/produceeffect', config)
//依製品-工時產量分析
export const ProduceWorkhryieldAPI = config =>
  ApiRequest.get('/ioms5system/analyze/product/workinghours', config)
//依製品-IoM指標分析
export const ProduceIomAPI = config =>
  ApiRequest.get('/ioms5system/analyze/product/iomindex', config)
//依製品-週期時間分析
export const ProduceCttimeAPI = config =>
  ApiRequest.get('/ioms5system/analyze/product/cycletime', config)
// //依製品-稼動分析
// export const ProduceShootAPI = config =>
//   ApiRequest.get('/ioms5system/analyze/whole/utilizationprocess', config)
// //依製品-產量分析
// export const ProduceYieldAPI = config =>
//   ApiRequest.get('/ioms5system/analyze/whole/utilizationprocess', config)

//依製令-工時產量分析
export const analyzeManuFacturingOrderWorkhryieldAPI = config =>
  ApiRequest.get('/ioms5system/analyze/manufactureorder/totalyield', config)
//依製令-生產效率分析
export const analyzeManuFacturingOrderProductivityAPI = config =>
  ApiRequest.get('/ioms5system/analyze/manufactureorder/produceeffect', config)

//依模具-工時產量分析
export const mlodWorkhryieldAPI = config =>
  ApiRequest.get('/ioms5system/analyze/mold/workinghours', config)
//依模具-週期時間分析
export const mlodCttimeAPI = config => ApiRequest.get('/ioms5system/analyze/mold/cycletime', config)
//依模具-IoM指標分析
export const mlodIomAPI = config => ApiRequest.get('/ioms5system/analyze/mold/iomindex', config)
/**************報表*********************** */
//日報表下載PDF
export const DailyReportDonloadAPI = config =>
  ApiRequest.get('/ioms5system/analyze/report/daily', config)

//日報表下載EXCEL
export const DailyReportDonloadExcelAPI = config =>
  ApiRequest.get('/ioms5system/analyze/report/excel', config)

//日報表2下載EXCEL
export const DailyReport2DonloadExcelAPI = config =>
  ApiRequest.get('/ioms5system/analyze/report/excel', config)

//生產效率報表月季年報表下載EXCEL
export const ReportDonloadExcelAPI = config =>
  ApiRequest.get('/ioms5system/analyze/report/produceeffect', config)

//品質報表月季年報表下載EXCEL
export const QualityReportDonloadExcelAPI = config =>
  ApiRequest.get('/ioms5system/analyze/report/quality', config)

//異常報表月季年報表下載EXCEL
export const ErrorReportDonloadExcelAPI = config =>
  ApiRequest.get('/ioms5system/analyze/report/expection', config)

//推播報表下載
export const BroadcastReportDonloadExcelAPI = config =>
  ApiRequest.get('/ioms5system/analyze/report/notification', config)

//日報表取得資料
export const DailyInfoAPI = config =>
  // ApiRequest.get('/ioms5system/analyze/report/dailyinfo', config)
  ApiRequest.get('/ioms5system/analyze/report/dailyinfobyworkshop', config)

const MailuserURL = '/ioms5system/crud/auth/mailaccount' //收件者設定
export const MailuserAPI = {
  get: function(config) {
    return ApiRequest.get(MailuserURL, config)
  },
  post: function(data, config) {
    return ApiRequest.post(MailuserURL, data, config)
  },
  put: function(data, config) {
    return ApiRequest.put(MailuserURL, data, config)
  },
  delete: function(config) {
    return ApiRequest.delete(MailuserURL, config)
  }
}
