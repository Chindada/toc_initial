export const crumbsfunc = {
  get: function(value) {
    if (value.activePage == 'nullpage') {
      return ''
    }
    var language = localStorage.getItem('locale')

    if (language == 'English') {
      var tempvalue = ''
      var swdata = value.activePage

      switch (swdata) {
        case ' 看板管理 / 即時看版一':
          tempvalue = 'Dashboard / Public Dashboard 1'
          break
        case ' 看板管理 / 即時看版二':
          tempvalue = 'Dashboard / Public Dashboard 2'
          break
        case ' 看板管理 / 即時看版三':
          tempvalue = 'Dashboard / Public Dashboard 3'
          break
        case ' 看板管理 / 單站看版':
          tempvalue = 'Dashboard / Equipment Dashboard'
          break
        case ' 看板管理/遠端看版':
          tempvalue = 'Dashboard / Dashboard Settings'
          break
        case ' 生產管理 / 製令管理':
          tempvalue = 'Production  / Manufacture Order'
          break
        case ' 生產管理 / 排程管理':
          tempvalue = 'Production  / Scheduling'
          break
        case ' 生產管理 / 任務管理':
          tempvalue = 'Production  / Task'
          break
        case ' 生產管理 / 品檢管理':
          tempvalue = 'Production  / Quality'
          break
        case ' 生產管理 / 入庫管理':
          tempvalue = 'Production  / Storage'
          break
        case ' 製品管理':
          tempvalue = 'Part  '
          break
        case ' 模具管理':
          tempvalue = 'Mold  '
          break
        case ' 設備管理':
          tempvalue = 'Machine  '
          break
        case ' 原料管理':
          tempvalue = 'Material  '
          break
        case ' 人員管理':
          tempvalue = 'Staff  '
          break
        case ' 廠區管理':
          tempvalue = 'Workshop  '
          break
        case ' 夥伴管理':
          tempvalue = 'Partner  '
          break
        case ' 裝置管理 / 採集裝置':
          tempvalue = 'Device  / DC'
          break
        case ' 裝置管理 / 串流裝置':
          tempvalue = 'Device  / DS'
          break
        case ' 裝置管理 / RD':
          tempvalue = 'Device  / RD'
          break
        case ' 報表設定':
          tempvalue = 'Report Settings'
          break
        case ' 系統設定 / 缺陷設定':
          tempvalue = 'Settings / Defect'
          break
        case ' 用戶管理':
          tempvalue = 'User'
          break
        case ' 環境設定':
          tempvalue = 'Environment'
          break
        case ' 角色管理':
          tempvalue = 'Permission Settings'
          break
        case ' 資源列表':
          tempvalue = 'Resources'
          break
        case ' 帳號管理':
          tempvalue = 'Account '
          break
        case ' 權限認證':
          tempvalue = 'Authorization'
          break
      }

      return tempvalue
    } else {
      //中文
      return value.activePage
    }
  }
}
