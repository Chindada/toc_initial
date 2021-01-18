export const version = {
  get: function(data) {
    var resource = data.resource
    //角色停用or未設定資源
    if (data.resource == null) {
      return []
    }

    var tempresource = []
    if (data.edition == '1') {
      resource.forEach(item => {
        if (
          item.name != 'manufacturingorder' && //製令管理
          item.name != 'task' && //任務
          item.name != 'product' && //製品
          item.name != 'material' && //原料
          item.name != 'employee' && //人員
          item.name != 'employeeschedule' && //人員排班
          item.name != 'employeeclass' && //人員班別
          item.name != 'employeeholiday' && //人員假日
          item.name != 'analyzepart' && //製品分析
          item.name != 'analyzemanufacturingorder' //製令分析
        ) {
          tempresource.push(item)
        }
      })
    } else if (data.edition == '2') {
      resource.forEach(item => {
        if (
          item.name != 'employee' && //人員
          item.name != 'employeeschedule' && //人員排班
          item.name != 'employeeclass' && //人員班別
          item.name != 'employeeholiday' //人員假日
        ) {
          tempresource.push(item)
        }
      })
      // } else if (data.edition == 'IPS') {
    } else if (data.edition == '3') {
      resource.forEach(item => {
        tempresource.push(item)
      })
    }

    return tempresource
  }
}
