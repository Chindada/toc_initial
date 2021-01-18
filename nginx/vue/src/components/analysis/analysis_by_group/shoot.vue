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
          <!-- <div class="mx-3">
          <div align="center">
            <h2>稼動分析({{ workshopname }})</h2>
          </div>
          </div>-->
          <hr />
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
import { GroupShootAPI } from '@/plugins/analyze.js'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import naturalCompare from 'string-natural-compare'
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
    /********************************* */
    /********************************* */
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

    /********************************* */
    /********************************* */

    //預設日周月搜尋
    autosearchfunc(type) {
      this.chartshowflag = false //"下一個"btm禁用
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
      // this.stop()
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

        this.stoptimer()
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
    //設定下載檔案名稱
    getchartfilename() {
      var tempstring =
        'IoM_Whole_Field_Availability_' +
        this.timeStampToStringFunc(this.stringToTimestampFunc(new Date()), 'yyyymmddhhmm')
      return tempstring
    },

    //chart圖初始化
    inichart() {
      var chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart)
      chart.data = []
      chart.legend = new am4charts.Legend()
      chart.legend.position = 'top'
      // chart.scrollbarY = new am4core.Scrollbar();
      chart.cursor = new am4charts.XYCursor()
      //匯出

      //chart.exporting.filePrefix = this.getchartfilename()
      //chart.exporting.menu = new am4core.ExportMenu()
      //chart.exporting.menu.align = 'left'
      //chart.exporting.menu.verticalAlign = 'top'
      var colorSet = new am4core.ColorSet()
      colorSet.saturation = 0.4
      //chart.exporting.menu.items = [
      //   {
      //     label: '...',
      //     menu: [{ label: 'xlsx', type: 'xlsx' }]
      //   }
      // ]
      //chart.exporting.menu.align = 'left'
      //chart.exporting.menu.verticalAlign = 'top'
      var colorSet = new am4core.ColorSet()
      colorSet.saturation = 0.4
      //chart.exporting.menu.items = [
      //   {
      //     label: '...',
      //     menu: [{ label: 'xlsx', type: 'xlsx' }]
      //   }
      // ]

      // Create axes
      var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis())
      categoryAxis.dataFields.category = 'machineNumber'
      // categoryAxis.renderer.grid.template.opacity = 0;
      categoryAxis.title.text = this.$t('machine_number')
      categoryAxis.renderer.minGridDistance = 1 //顯示所有title

      var valueAxis = chart.xAxes.push(new am4charts.ValueAxis())
      valueAxis.title.text = this.$t('utilization_rate') + '(%)'
      valueAxis.min = 0
      valueAxis.renderer.grid.template.opacity = 0
      valueAxis.renderer.ticks.template.strokeOpacity = 0.5
      valueAxis.renderer.ticks.template.stroke = am4core.color('#495C43')
      valueAxis.renderer.ticks.template.length = 10
      valueAxis.renderer.line.strokeOpacity = 0.5
      valueAxis.renderer.baseGrid.disabled = true
      valueAxis.renderer.minGridDistance = 40

      valueAxis.renderer.labels.template.adapter.add('text', function(text) {
        return text + '%'
      })

      chart.colors.list = [
        am4core.color('#00a136'), //綠
        am4core.color('#808080'), //灰
        am4core.color('#8b0000'), //澄
        am4core.color('#ff0000') //紅
      ]

      // Create series
      function createSeries(field, name) {
        var series = chart.series.push(new am4charts.ColumnSeries())
        series.dataFields.valueX = field
        series.dataFields.categoryY = 'machineNumber'
        // series.dataFields.valueXShow = 'totalPercent'
        series.stacked = true
        series.name = name
        series.columns.template.tooltipText = '{valueX}'

        valueAxis.calculateTotals = true
        valueAxis.min = 0
        valueAxis.max = 100
        valueAxis.strictMinMax = true

        // var series1 = chart.series.push(new am4charts.ColumnSeries())
        // series1.columns.template.width = am4core.percent(80)
        // series1.columns.template.tooltipText =
        //   '設備編號:{machineNumber} {status} {openDateX} ~ {dateX}  '

        var labelBullet = series.bullets.push(new am4charts.LabelBullet())
        labelBullet.locationX = 0.5
        labelBullet.label.text = '{valueX}'
        labelBullet.label.fill = am4core.color('#fff')
        // labelBullet.label.truncate = true
        labelBullet.label.hideOversized = true //字體超過區間空間不顯示
      }

      createSeries('running', this.$t('title_running'))
      createSeries('stop', this.$t('title_shutdown'))
      createSeries('idle', this.$t('title_idle'))
      createSeries('abnormal', this.$t('title_error'))

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

      GroupShootAPI({
        headers: {
          access_token: access_token_val,
          startTime: starttime,
          endTime: endtime,
          workShopIds: workshopArrayString
        }
      }).then(
        res => {
          if (res.data != null) {
            res.data.sort((a, b) => naturalCompare(b.machineNumber, a.machineNumber)) //排序設備編號
            var nullname = ' '
            res.data = this.countavg(res.data)
            //補齊13台
            if (res.data.length < 13) {
              for (var i = res.data.length; i < 13; i++) {
                nullname += ' '
                res.data.push({
                  machineNumber: nullname,
                  machineName: nullname,
                  running: 0,
                  idle: 0,
                  abnormal: 0,
                  stop: 0
                })
              }
            }
            this.chart.data = res.data

            //設定chart圖高度
            if (this.chart.data.length > 13) {
              var totalpx = this.chart.data.length * 35 + 100
              this.chart.svgContainer.htmlElement.style.height = totalpx + 'px'
            }
          }
          this.chartshowflag = true
        },
        error => {
          this.chartshowflag = true
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //檢查連欄位是否存在
    checkarray(data) {
      if (data == undefined || data == null) {
        return 0
      } else {
        return data
      }
    },
    //計算全部平均
    countavg(data) {
      var total_running = 0
      var total_idle = 0
      var total_abnormal = 0
      var total_stop = 0
      var total_num = 0
      data.forEach(item => {
        item.running = this.checkarray(item.running)
        item.idle = this.checkarray(item.idle)
        item.abnormal = this.checkarray(item.abnormal)
        item.stop = this.checkarray(item.stop)
        if (item.running != 0 || item.idle != 0 || item.abnormal != 0 || item.stop != 0) {
          total_running += item.running
          total_idle += item.idle
          total_abnormal += item.abnormal
          total_stop += item.stop
          total_num++
        }
      })
      var avage = [total_running, total_idle, total_abnormal, total_stop]

      if (total_num != 0) {
        var total = 0
        for (var i = 0; i < 4; i++) {
          avage[i] = Math.round(avage[i] / total_num)
          total += avage[i]
        }
        if (total != 0 && total < 100) {
          for (var i = 0; i < 4; i++) {
            if (Math.max(...avage) == avage[i]) {
              avage[i] += 1
            }
          }
        }
      } else {
        avage = [0, 0, 0, 0]
      }

      data.push({
        machineNumber: this.$t('all'),
        machineName: 'nullname',
        running: avage[0],
        idle: avage[1],
        abnormal: avage[2],
        stop: avage[3]
      })

      return data
    },
    timeStamptodate(time, type) {
      //timestamp 轉data
      if (type == 'yyyy-mm-ddThh:00') {
        time = time - 3600000
      }
      let tempvalue = this.timeStampToStringFunc(time, type)
      return tempvalue
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
  /* height: 88vh; */
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
  /* min-height: 90%; */
  min-height: 75vh;
}
.image-container {
  width: 100%;
  height: 655px;
  display: flex;
  justify-content: center;
}
img {
  display: block;
  margin: auto;
}
</style>
