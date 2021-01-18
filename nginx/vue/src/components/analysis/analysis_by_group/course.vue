<template>
  <mdb-container fluid>
    <mdb-card>
      <mdb-card-body>
        <div style="height:10%">
          <b-row>
            <b-col cols="2">
              <div style="align-items: center;">
                <b-row>
                  <b-col
                    cols="4"
                    class="title"
                    style="padding-right:5px;padding-left:0px;padding-top:10px"
                    >{{ $t('to_schedule_workshop') }} :</b-col
                  >
                  <b-col cols="8" style="padding:1px">
                    <mdb-select
                      :selectAllPlaceholder="this.$t('select_all')"
                      multiple
                      search
                      selectAll
                      @getValue="onChange"
                      :options="workshopobject"
                    />
                  </b-col>
                </b-row>
              </div>
            </b-col>

            <b-col cols="3" class="grouptitle">
              <div>
                <b-row>
                  <b-col cols="4" class="title">
                    <label>{{ $t('start_date') }} :</label>
                  </b-col>
                  <b-col cols="3">
                    <input type="date" v-model="starttime" />
                  </b-col>
                </b-row>
              </div>
            </b-col>
            <b-col cols="3" class="grouptitle">
              <div>
                <b-row>
                  <b-col cols="4" class="title">
                    <label>{{ $t('end_date') }} ：</label>
                  </b-col>
                  <b-col cols="3">
                    <input type="date" v-model="endtime" />
                  </b-col>
                </b-row>
              </div>
            </b-col>
            <b-col cols="1">
              <mdb-btn size="sm" color="primary" v-on:click="searchtime()">
                {{ $t('search') }}
              </mdb-btn>
            </b-col>
            <b-col cols="3">
              <button
                type="button"
                class="btn btn-info"
                id="beforeid"
                v-on:click="beforeafterclick('before')"
                :disabled="!autosearch"
              >
                <i class="fa fa-chevron-left"></i>
              </button>
              <button type="button" :class="btn1" v-on:click="autosearchfunc('day')">
                {{ $t('day') }}
              </button>
              <button type="button" :class="btn2" v-on:click="autosearchfunc('week')">
                {{ $t('day_7') }}
              </button>
              <button type="button" :class="btn3" v-on:click="autosearchfunc('month')">
                {{ $t('day_30') }}
              </button>
              <button
                type="button"
                class="btn btn-info"
                v-on:click="beforeafterclick('after')"
                :disabled="!autosearch || autosearchlastday"
              >
                <i class="fa fa-chevron-right"></i>
              </button>
            </b-col>
          </b-row>

          <hr />
        </div>
        <div class="mx-3">
          <div align="center">
            <a
              type="button"
              class="btn btn-primary"
              style="height: 3ch; background-color:#808080!important;border-color :#808080!important;"
            ></a>
            <span>
              {{ $t('title_shutdown') }}
              <span style="opacity:0;">W</span>
            </span>
            <a
              type="button"
              class="btn btn-primary"
              style="height: 3ch; background-color: #00a136!important;border-color :#00a136 !important;"
            ></a>
            <span>
              {{ $t('title_running') }}
              <span style="opacity:0;">W</span>
            </span>
            <a
              type="button"
              class="btn btn-primary"
              style="height: 3ch; background-color: #8b0000!important;border-color :#8b0000 !important;"
            ></a>
            <span>
              {{ $t('title_idle') }}
              <span style="opacity:0;">W</span>
            </span>
            <a
              type="button"
              class="btn btn-primary"
              style="height: 3ch; background-color: #ff0000!important;border-color :#ff0000 !important;"
            ></a>
            <span>
              {{ $t('title_error') }}
              <span style="opacity:0;">W</span>
            </span>
          </div>
        </div>
        <div class="chart" ref="chartdiv" v-show="chartshowflag"></div>
        <div class="image-container" v-show="!chartshowflag">
          <img
            alt="AIOM"
            class="img-center"
            width="100px"
            height="100px"
            src="../../../assets/loading-1.gif"
          />
        </div>
      </mdb-card-body>
    </mdb-card>
  </mdb-container>
</template>

<script>
import { WorkShopAPI } from '@/plugins/basicapis.js'
import { GroupCourseAPI } from '@/plugins/analyze.js'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import naturalCompare from 'string-natural-compare'
// import { numberToString } from '@amcharts/amcharts4/.internal/core/utils/Utils'
am4core.useTheme(am4themes_animated)
export default {
  name: 'DatatablePage',
  components: {},
  data() {
    return {
      timervalue: 0,
      workshopname: '',
      chartshowflag: false,
      nowdaytimestamp: 0, //今天日期timestamp
      btn1: 'btn btn-info',
      btn2: 'btn btn-info',
      btn3: 'btn btn-info',
      workshopobject: [],
      workshopselected: [],
      starttime: new Date(),
      endtime: new Date(),
      autosearch: false,
      autosearchlastday: true
    }
  },
  created() {
    this.initime()
    this.getworkshop()
  },
  mounted() {
    this.inichart()
  },
  methods: {
    onChange(value) {
      this.workshopselected = value
    },
    //前/後日周月
    beforeafterclick(value) {
      this.chartshowflag = false
      var starttime = this.stringToTimestampFunc(new Date(this.starttime + 'T00:00')) //開始時間
      var endtime = this.stringToTimestampFunc(new Date(this.endtime + 'T00:00')) //結束時間
      //前一個
      if (value == 'before') {
        //日
        if (endtime - starttime == 0) {
          starttime = starttime - 86400000
          endtime = endtime - 86400000
          //周
        } else if (endtime - starttime == 604800000) {
          starttime = starttime - 604800000
          endtime = endtime - 604800000
          //月
        } else {
          starttime = starttime - 2592000000
          endtime = endtime - 2592000000
        }

        //後一個
      } else if (value == 'after') {
        //日
        if (endtime - starttime == 0) {
          starttime = starttime + 86400000
          endtime = endtime + 86400000
          //周
        } else if (endtime - starttime == 604800000) {
          starttime = starttime + 604800000
          endtime = endtime + 604800000
          //月
        } else {
          starttime = starttime + 2592000000
          endtime = endtime + 2592000000
        }
      }

      var timeendvalue = new Date(new Date()) //取得現在date
      var timestamp = this.timeStamptodate(this.stringToTimestampFunc(timeendvalue), 'yyyy-mm-dd')
      this.starttime = this.timeStamptodate(starttime, 'yyyy-mm-dd')
      this.endtime = this.timeStamptodate(endtime, 'yyyy-mm-dd')
      if (this.endtime == timestamp) {
        //"下一個"btm禁用
        this.autosearchlastday = true
      } else {
        this.autosearchlastday = false
      }
      this.stoptimer()
    },
    //開始timer
    starttimer() {
      var tempthis = this
      this.timervalue = window.setTimeout(function() {
        tempthis.getdata()
      }, 2000) //2秒後callfunction
    },

    stoptimer() {
      //停止timer
      clearTimeout(this.timervalue)
      this.starttimer()
    },
    //預設日周月搜尋
    autosearchfunc(type) {
      this.chartshowflag = false
      this.autosearch = true
      if (type == 'day') {
        this.btn1 = 'btn btn-success'
        this.btn2 = 'btn btn-info'
        this.btn3 = 'btn btn-info'
        var starttime = this.timeStamptodate(this.nowdaytimestamp, 'yyyy-mm-dd') //轉timestamp
      } else if (type == 'week') {
        this.btn1 = 'btn btn-info'
        this.btn2 = 'btn btn-success'
        this.btn3 = 'btn btn-info'
        var starttime = this.timeStamptodate(this.nowdaytimestamp - 604800000, 'yyyy-mm-dd') //轉timestamp -7天
      } else if (type == 'month') {
        this.btn1 = 'btn btn-info'
        this.btn2 = 'btn btn-info'
        this.btn3 = 'btn btn-success'
        var starttime = this.timeStamptodate(this.nowdaytimestamp - 2592000000, 'yyyy-mm-dd') //轉timestamp -30天
      }

      var endtime = this.timeStamptodate(this.nowdaytimestamp, 'yyyy-mm-dd') //結束日期今天
      this.starttime = starttime
      this.endtime = endtime
      this.autosearchlastday = true
      this.stoptimer()
    },
    //搜尋
    searchtime() {
      this.chartshowflag = false
      this.setworkshopname()
      var t1 = this.stringToTimestampFunc(new Date(this.starttime + 'T00:00')) //開始時間轉timestamp
      var t2 = this.stringToTimestampFunc(new Date(this.endtime + 'T00:00')) //結束時間轉timestamp
      if (t1 > t2) {
        this.$layer.msg('日期錯誤!')
      } else {
        if (this.autosearch) {
          this.btn1 = 'btn btn-info'
          this.btn2 = 'btn btn-info'
          this.btn3 = 'btn btn-info'
          this.autosearch = false
        }

        this.getdata()
      }
    },
    //搜尋設定title廠區
    setworkshopname() {
      if (this.workshopobject != null) {
        for (var i = 0; i < this.workshopobject.length; i++) {
          if (this.workshopselected == this.workshopobject[i].value) {
            this.workshopname = this.workshopobject[i].text
            break
          }
        }
      }
    },
    //取得廠區
    getworkshop() {
      var access_token_val = this.$cookies.get('access_token')
      WorkShopAPI.get({
        headers: {
          access_token: access_token_val,
          workshop: 'true'
        }
      }).then(
        res => {
          if (res.data != null) {
            res.data.forEach(item => {
              this.workshopobject.push({ value: item.id, text: item.name })
            })
            if (this.workshopselected == 0) {
              //初始化預設第一個
              this.workshopname = res.data[0].name
              this.workshopselected.push(res.data[0].id)
            }
          }
          this.getdata()
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //時間初始化
    initime() {
      var timeendvalue = new Date(new Date()) //取得現在date
      var timestamp = this.stringToTimestampFunc(timeendvalue) //date轉timestamp
      this.nowdaytimestamp = timestamp
      timestamp = this.timeStamptodate(timestamp, 'yyyy-mm-dd') //轉timestamp
      this.starttime = timestamp
      this.endtime = timestamp
    },
    //chart圖初始化
    inichart() {
      var chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart)
      chart.hiddenState.properties.opacity = 0 // this creates initial fade-in
      chart.paddingRight = 30
      chart.dateFormatter.inputDateFormat = 'yyyy-MM-dd HH:mm'

      //匯出
      //       //chart.exporting.filePrefix = this.getchartfilename()
      // //chart.exporting.menu = new am4core.ExportMenu()
      // //chart.exporting.menu.align = 'left'
      // //chart.exporting.menu.verticalAlign = 'top'
      // var colorSet = new am4core.ColorSet()
      // colorSet.saturation = 0.4
      // //chart.exporting.menu.items = [
      //   {
      //     label: '...',
      //     filePrefix: 'wlala',
      //     menu: [{ label: 'xlsx', type: 'xlsx' }]
      //   }
      // ]
      // //chart.exporting.menu.align = 'left'
      // //chart.exporting.menu.verticalAlign = 'top'
      // var colorSet = new am4core.ColorSet()
      // colorSet.saturation = 0.4
      // //chart.exporting.menu.items = [
      //   {
      //     label: '...',
      //     menu: [{ label: 'xlsx', type: 'xlsx' }]
      //   }
      // ]

      chart.data = [
        // {
        //   machineName: 'RRRRR',
        //   machineNumber: 'Joh',
        //   sttime: '2018-01-01 09:00',
        //   endtime: '2018-01-10 12:00',
        //   color: '#8b0000'
        // }
      ]

      var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis())
      categoryAxis.dataFields.category = 'machineNumber'
      categoryAxis.renderer.grid.template.location = 0
      categoryAxis.renderer.inversed = true
      categoryAxis.autoDispose = false
      categoryAxis.renderer.minGridDistance = 1

      var dateAxis = chart.xAxes.push(new am4charts.DateAxis())
      dateAxis.dateFormatter.dateFormat = 'yyyy-MM-dd HH:mm'
      dateAxis.renderer.minGridDistance = 60
      dateAxis.baseInterval = { count: 5, timeUnit: 'minute' }
      dateAxis.groupIntervals.setAll([
        { timeUnit: 'hour', count: 1 },
        { timeUnit: 'day', count: 1 },
        { timeUnit: 'month', count: 1 },
        { timeUnit: 'year', count: 1 }
      ])
      dateAxis.strictMinMax = true
      // dateAxis.renderer.tooltipLocation = 0
      dateAxis.groupData = true
      dateAxis.renderer.grid.template.location = 0

      var series1 = chart.series.push(new am4charts.ColumnSeries())
      series1.columns.template.width = am4core.percent(80)
      series1.columns.template.tooltipText =
        this.$t('report_machine_number') + ':{machineNumber} {status} {openDateX} ~ {dateX}  '

      series1.dataFields.openDateX = 'sttime'
      series1.dataFields.dateX = 'endtime'
      series1.dataFields.categoryY = 'machineNumber'
      series1.columns.template.propertyFields.fill = 'color' // get color from data
      series1.columns.template.propertyFields.stroke = 'color'
      series1.columns.template.strokeOpacity = 1

      // XY軸指標、標籤
      chart.cursor = new am4charts.XYCursor()
      chart.cursor.xAxis = dateAxis
      chart.scrollbarX = new am4core.Scrollbar()
      this.chart = chart
    },
    //處理選擇Id
    dealworkshopselected(data) {
      var tempstring = '['
      data.forEach(item => {
        tempstring = tempstring + item + ','
      })
      let returnval = tempstring.substring(0, tempstring.length - 1) + ']'
      if (returnval == ']') {
        returnval = '[]'
      }
      return returnval
    },
    //檢查日否為今天
    checktoday() {
      var timestamp = this.timeStamptodate(
        this.stringToTimestampFunc(new Date(new Date())),
        'yyyy-mm-dd'
      ) //轉timestamp
      if (timestamp == this.endtime) {
        return true
      } else {
        return false
      }
    },
    //重設endtime
    resetendtime() {
      return this.timeStamptodate(this.nowdaytimestamp, 'yyyy-mm-ddThh:00')
    },
    //Call API取得資料
    getdata() {
      var starttime = this.stringToTimestampFunc(new Date(this.starttime + 'T00:00')) //開始時間轉timestamp
      var endtime = this.stringToTimestampFunc(new Date(this.endtime + 'T00:00')) + 86400000 //結束時間轉timestamp
      var access_token_val = this.$cookies.get('access_token')
      var workshopArrayString = this.dealworkshopselected(this.workshopselected)
      if (this.checktoday()) {
        endtime = this.stringToTimestampFunc(new Date(this.resetendtime()))
      }
      GroupCourseAPI({
        headers: {
          access_token: access_token_val,
          startTime: starttime,
          endTime: endtime,
          workShopIds: workshopArrayString
        }
      }).then(
        res => {
          if (res.data.utilizationProcess != null) {
            res.data.utilizationProcess.sort((a, b) =>
              naturalCompare(a.machineNumber, b.machineNumber)
            ) //排序設備編號
            this.chart.data = this.dealdata(res.data.utilizationProcess, res.data.startTime) //分析圖附值

            //設定chart圖高度
            let totalnum = this.conumttotalnum(this.chart.data)

            if (totalnum > 13) {
              var totalpx = totalnum * 20 + 100
              this.chart.svgContainer.htmlElement.style.height = totalpx + 'px'
            }
          } else {
            this.chart.data = []
          }
          this.chartshowflag = true
        },
        error => {
          this.chart.data = []
          this.chartshowflag = true
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //計算設備總數
    conumttotalnum(data) {
      let num = 1
      let tempmachineNumber = data[0].machineNumber
      data.forEach(item => {
        if (item.machineNumber != tempmachineNumber) {
          num++
          tempmachineNumber = item.machineNumber
        }
      })

      return num
    },
    //檢查data欄位
    checkchartarray(data) {
      if (data.machineName == undefined) {
        data.machineName = ''
      }
      if (data.machineNumber == undefined) {
        data.machineNumber = ''
      }

      return data
    },
    //處理資料
    dealdata(data, now) {
      var chartarray = new Array()
      var chartarray1 = new Array()
      data.forEach(item => {
        chartarray.push(item)
      })
      // chartarray = data
      for (var i = 0; i < chartarray.length; i++) {
        this.checkchartarray(chartarray[i])
        chartarray1.push({
          machineName: chartarray[i].machineName,
          machineNumber: chartarray[i].machineNumber,
          sttime: this.timeStamptoString(now), //start_time,
          endtime: this.timeStamptoString(chartarray[i].processes[0].timestamp),
          color: this.statuscolor(chartarray[i].processes[0].status),
          status: this.status(chartarray[i].processes[0].status)
        })
        if (chartarray[i].processes.length > 1) {
          for (var j = 1; j < chartarray[i].processes.length; j++) {
            chartarray1.push({
              machineName: chartarray[i].machineName,
              machineNumber: chartarray[i].machineNumber,
              sttime: this.timeStamptoString(chartarray[i].processes[j - 1].timestamp),
              endtime: this.timeStamptoString(chartarray[i].processes[j].timestamp),
              color: this.statuscolor(chartarray[i].processes[j].status),
              status: this.status(chartarray[i].processes[j].status)
            })
          }
        }
      }
      var nullnamee = ' '
      if (chartarray.length < 13) {
        for (var i = chartarray.length; i < 13; i++) {
          nullnamee += ' '
          chartarray1.unshift({
            machineNumber: nullnamee,
            machineName: nullnamee,
            processes: null
          })
        }
      }

      return chartarray1
    },
    statuscolor(status) {
      if (status == 3) {
        return '#8b0000'
      } else if (status == 4) {
        return '#ff0000'
      } else if (status == 5) {
        return '#00a136'
      } else {
        return '#808080'
      }
    },
    status(status) {
      if (status == 3) {
        return this.$t('title_idle')
      } else if (status == 4) {
        return this.$t('title_error')
      } else if (status == 5) {
        return this.$t('title_running')
      } else {
        return this.$t('title_shutdown')
      }
    },
    timeStamptodate(time, type) {
      //timestamp 轉data
      if (type == 'yyyy-mm-ddThh:00') {
        time = time - 3600000
      }

      let tempvalue = this.timeStampToStringFunc(time, type)
      return tempvalue
    },
    //timestamp to date
    timeStamptoString(time, numflag) {
      var datetime = new Date()
      datetime.setTime(time)
      var year = datetime.getFullYear()
      var month = this.pushZeroFunc(datetime.getMonth() + 1)
      var date = this.pushZeroFunc(datetime.getDate())
      var hour = this.pushZeroFunc(datetime.getHours())
      var minute = this.pushZeroFunc(datetime.getMinutes())
      if (numflag == 2) {
        if (hour == 0 && minute == 0 && second == 0) {
          time -= 86400000
          datetime = new Date()
          datetime.setTime(time)
          year = datetime.getFullYear()
          month = this.pushZeroFunc(datetime.getMonth() + 1)
          date = this.pushZeroFunc(datetime.getDate())
          hour = this.pushZeroFunc(datetime.getHours())
          minute = this.pushZeroFunc(datetime.getMinutes())
        }
      }

      return year + '-' + month + '-' + date + ' ' + hour + ':' + minute
    }
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
    }
  }
}
</script>

<style>
.dataTables-scrollBody {
  max-height: 400px;
}
</style>
<style scoped>
.grouptitle {
  padding-top: 10px;
}
.card-body {
  min-height: 88vh;
}
.btn.btn-sm {
  padding: 10px;
}
.title {
  padding-right: 0px;
  text-align: right;
}
.btn {
  padding: 10px;
  margin-top: 0px;
}
.chart {
  width: 100%;
  min-height: 75vh;
}
.image-container {
  width: 100%;
  height: 620px;
  display: flex;
  justify-content: center;
}
img {
  display: block;
  margin: auto;
}
</style>
