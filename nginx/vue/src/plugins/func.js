exports.install = function(Vue) {
  //時間戳記轉字串
  Vue.prototype.timeStampToStringFunc = function(time, mode) {
    if (time === 0) {
      return 0
    }
    let datetime = new Date()
    datetime.setTime(time)
    let year = datetime.getFullYear().toString()
    let month = this.pushZeroFunc(datetime.getMonth() + 1).toString()
    let date = this.pushZeroFunc(datetime.getDate()).toString()
    let hour = this.pushZeroFunc(datetime.getHours()).toString()
    let minute = this.pushZeroFunc(datetime.getMinutes()).toString()
    var second = this.pushZeroFunc(datetime.getSeconds()).toString()

    let tempstring = ''

    if (mode == 'yyyy-mm-dd hh:mm') {
      tempstring = year + '-' + month + '-' + date + ' ' + hour + ':' + minute
    } else if (mode == 'yyyy-mm-dd hh') {
      tempstring = year + '-' + month + '-' + date + ' ' + hour
    } else if (mode == 'yyyy-mm-dd') {
      tempstring = year + '-' + month + '-' + date
    } else if (mode == 'yyyy-mm') {
      tempstring = year + '-' + month
    } else if (mode == 'yyyy') {
      tempstring = year
    } else if (mode == 'yyyy-mm-dd hh:mm:ss') {
      tempstring = year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
    } else if (mode == 'yyyymmdd') {
      tempstring = year + month + date
    } else if (mode == 'yyyymmddhhmm') {
      tempstring = year + month + date + hour + minute
    } else if (mode == '[yyyy,mmm,dd]') {
      tempstring = [year, month, date]
      // } else if (mode == 'yyyy/mm/dd(ww)') {
      //   tempstring = year + '/' + month + '/' + date + '(' + week + ')'
    } else if (mode == 'yyyy/mm/dd') {
      tempstring = year + '/' + month + '/' + date
    } else if (mode == 'yyyy/mm/dd hh:mm') {
      tempstring = year + '/' + month + '/' + date + ' ' + hour + ':' + minute
    } else if (mode == 'yyyy-mm-ddThh:mm') {
      tempstring = year + '-' + month + '-' + date + 'T' + hour + ':' + minute
    } else if (mode == 'yyyy-mm-ddThh:00') {
      tempstring = year + '-' + month + '-' + date + 'T' + hour + ':00'
    } else if (mode == 'hh:mm:ss') {
      tempstring = hour + ':' + minute + ':' + second
    }
    return tempstring
  }
  //字串轉時間戳記
  Vue.prototype.stringToTimestampFunc = function(value) {
    let timestamp = Date.parse(value)
    return timestamp
  }
  //日期補0
  Vue.prototype.pushZeroFunc = function(value) {
    if (value < 10) {
      return '0' + value
    }
    return value
  }
  //選擇的array轉字串(刪除多筆用)
  Vue.prototype.selectedArrayToString = function(value) {
    let deletearray = '['
    value.forEach(item => {
      deletearray += item.id + ','
    })
    deletearray = deletearray.substring(0, deletearray.length - 1) + ']'
    return deletearray
  }
  //超過千位+逗點
  Vue.prototype.dealThousands = function(type, value) {
    if (value == 0 || value == null) {
      switch (type) {
        case 'num':
          return 0
        case '0':
          return '0'
        case '-':
          return '-'
      }
    }
    let c =
      value.toString().indexOf('.') !== -1
        ? value.toLocaleString()
        : value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
    return c
  }
  //檢查匯入是否為字串
  Vue.prototype.checkNumberToString = function(value) {
    if (typeof value == 'number') {
      value = String(value)
    }
    return value
  }
  //顏色
  Vue.prototype.color = function(value) {
    let color = '#999999'
    switch (value) {
      case 'blue':
        color = '#3d91bc' //'#026FB2'
        break
      case 'green':
        color = '#00a136' //'#009245'
        break
      case 'yellow':
        color = '#FFE317'
        break
      case 'orange':
        color = '#8b0000' //'#603813'
        break
      case 'red':
        color = '#FF0000' //'#FF0000'
        break
      case 'darkgray':
        color = '#515151'
        break
      case 'gray':
        color = '#808080' //'#999999'
        break
      case 'white':
        color = '#FFFFFF'
        break
      case 'black':
        color = '#000000'
        break
      case 'next_schedule_title':
        color = '#026FB2'
        break
      case 'next_schedule_one':
        color = '#D2F1FF'
        break
      default:
        color = '#999999'
        break
    }
    return color
  }
  //判斷異常
  Vue.prototype.errorstatus = function(value) {
    //9同步 10EG異常 11DC異常 12設備保養 13設備停機 14EG已關閉 15IoM即將關閉
    let errormes = ''
    switch (value) {
      case 9:
        errormes = this.$t('eg_sync')
        break
      case 10:
        errormes = this.$t('eg_error')
        break
      case 11:
        errormes = this.$t('dc_error')
        break
      case 12:
        errormes = this.$t('dashboard_machine_maintenance')
        break
      case 13:
        errormes = this.$t('dashboard_machine_shutdown')
        break
      case 14:
        errormes = this.$t('dashboard_EG_shutdown')
        break
      case 15:
        errormes = this.$t('dashboard_data_shutdown')
        break
      default:
        //預設(算停機)
        errormes = ''
        break
    }
    return errormes
  }
  //週期時間過百，不顯示小數
  Vue.prototype.dealCTSCTtime = function(value) {
    if (value == 0) {
      return '-'
    }
    value = Math.round(value * 10) / 10
    if (value >= 100) {
      value = Math.round(value)
    }
    return value
  }
  //狀態顏色
  Vue.prototype.cardcolor = function(value) {
    let color = this.color('gray')
    switch (value) {
      case 2: //停機
        color = this.color('gray')
        break
      case 3: //閒置
        color = this.color('orange')
        break
      case 4: //異常
        color = this.color('red')
        break
      case 5: //運行
        color = this.color('green')
        break
      default:
        //預設(算停機)
        color = this.color('gray')
        break
    }
    return color
  }
  //計算%數
  Vue.prototype.countprogress = function(qty, accmulationQty) {
    if (accmulationQty == 0 || qty == 0) {
      return 0
    }
    if (accmulationQty >= qty) {
      return 100
    } else {
      return Math.round((accmulationQty / qty) * 100)
    }
  }
  //剩餘數量
  Vue.prototype.countremainqty = function(qty, accmulationQty) {
    if (accmulationQty == 0) {
      return 0
    } else if (accmulationQty >= qty) {
      return 0
    } else {
      return qty - accmulationQty
    }
  }
  //進度顏色
  Vue.prototype.setprogresscolor = function(qty, accmulationQty) {
    if (qty == 0 || accmulationQty == 0) {
      return this.color('blue') //'#2196f3' //'blue'
    } else {
      let tempprogress = Math.round((accmulationQty / qty) * 100)
      if (tempprogress < 100) {
        return this.color('blue') //'#2196f3' //'blue'
      } else if (tempprogress < 104 && tempprogress >= 100) {
        return this.color('green') //'#4caf50' //'green'
      } else {
        return this.color('red') //'#f44336' //Red
      }
    }
  }
  //名稱過長
  Vue.prototype.dealnameoverfloat = function(value, num) {
    if (value != null) {
      if (value.length > num) {
        value = value.substring(0, num)
      }
      return value
    } else {
      return ''
    }
  }
  //名稱過長1
  Vue.prototype.dealnameoverfloat1 = function(value, num1, num2) {
    value = value.substring(num1, num2)
    return value
  }
  //timestamp 轉 MD dm
  Vue.prototype.timestampdatetime = function(value) {
    let timeint = parseInt(value)
    let day = Math.floor(timeint / 86400)
    let hr = Math.floor((timeint % 86400) / 3600)
    let min = Math.floor(((timeint % 86400) % 3600) / 60)
    let timeString = ''
    if (day == 0) {
      timeString = hr + 'h ' + min + 'm'
    } else {
      timeString = day + 'd ' + hr + 'h'
    }
    // timeint = null
    // day = null
    // hr = null
    // min = null

    return timeString
  }
  //計算剩餘時間
  Vue.prototype.countremaintime = function(qty, accmulationQty, sct) {
    var tremaintimetimestamp = 0
    if (qty == 0) {
      tremaintimetimestamp = 0
    } else if (qty <= accmulationQty) {
      tremaintimetimestamp = 0
    } else {
      tremaintimetimestamp = (qty - accmulationQty) * sct
    }

    if (sct == '-') {
      tremaintimetimestamp = 0
    }
    return this.timestampdatetime(tremaintimetimestamp)
  }
  //計算個頁數
  Vue.prototype.counteachtotal = function(len, num1, num2) {
    let total = 0
    if (len < num1) {
      total += 1
    } else {
      total += Math.ceil((len - num1) / num2) + 1
    }
    return total
  }
  //計算機台狀態總數
  Vue.prototype.countstatus = function(temptotalstatus, value) {
    temptotalstatus.total++
    switch (value) {
      case 2: //停機
        temptotalstatus.stop++
        break
      case 3: //閒置
        temptotalstatus.idle++
        break
      case 4: //異常
        temptotalstatus.error++
        break
      case 5: //運行
        temptotalstatus.running++
        break
      case 9: //同步中
        temptotalstatus.stop++
        break
      case 10: //EG異常
        temptotalstatus.stop++
        break
      case 11: //DC異常
        temptotalstatus.stop++
        break
      case 12: //12設備保養
        temptotalstatus.stop++
        break
      case 13: //13設備停機
        temptotalstatus.stop++
        break
      case 14: //14EG已關閉
        temptotalstatus.stop++
        break
      case 15: //15IoM即將關閉
        temptotalstatus.stop++
        break
      default:
        //預設(算停機)
        temptotalstatus.stop++
        break
    }
    return temptotalstatus
  }
  //統計css
  Vue.prototype.totalCardStyle = function(value) {
    let obj = {
      backgroundColor: this.color(value)
    }
    return obj
  }
}

//   defineColors: {
//           blue: '#026FB2',
//           green: '#009245',
//           yellow: '#FFE317',
//           orange: '#603813',
//           red: 'FF0000',
//           darkgray: '#515151',
//           gray: '#999999',
//           white: '#FFFFFF',
//           black: '#000000',
//         },
