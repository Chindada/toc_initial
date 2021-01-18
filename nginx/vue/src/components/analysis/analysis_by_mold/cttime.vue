<template>
  <mdb-container fluid>
    <mdb-card>
      <mdb-card-body>
        <!-- ***************************** -->
        <div style="height:10%">
          <b-row>
            <b-col cols="2">
              <div style="align-items: center;">
                <b-row>
                  <b-col cols="4" class="title">{{ $t('mold') }} :</b-col>
                  <b-col cols="8">
                    <model-select
                      required
                      v-model="moldselected"
                      :options="moldobject"
                      :placeholder="this.$t('product_unselect')"
                    ></model-select>
                  </b-col>
                </b-row>
              </div>
            </b-col>
            <div>
              <span>{{ $t('all') }} :</span>
              <span style="opacity:0">12</span>
            </div>
            <b-form-checkbox
              id="checkbox-1"
              v-model="selectdate"
              name="checkbox-1"
            ></b-form-checkbox>

            <b-col cols="3">
              <div>
                <b-row>
                  <b-col cols="4" class="title" style="padding:0px">
                    <label>{{ $t('start_date') }} :</label>
                  </b-col>
                  <b-col cols="3">
                    <input type="date" v-model="starttime" :disabled="selectdate" />
                  </b-col>
                </b-row>
              </div>
            </b-col>
            <b-col cols="3">
              <div>
                <b-row>
                  <b-col cols="4" class="title">
                    <label>{{ $t('end_date') }} ：</label>
                  </b-col>
                  <b-col cols="3">
                    <input type="date" v-model="endtime" :disabled="selectdate" />
                  </b-col>
                </b-row>
              </div>
            </b-col>
            <b-col cols="1">
              <mdb-btn size="sm" color="primary" v-on:click="searchtime()">
                {{ $t('search') }}
              </mdb-btn>
            </b-col>
            <b-col cols="3"></b-col>
          </b-row>

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
import { moldSelectAPI } from '@/plugins/basicapis.js'
import { mlodCttimeAPI } from '@/plugins/analyze.js'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import naturalCompare from 'string-natural-compare'
import { ModelSelect } from 'vue-search-select'

am4core.useTheme(am4themes_animated)
export default {
  name: 'DatatablePage',
  components: {
    ModelSelect
  },
  data() {
    return {
      timervalue: 0,
      // machinenumber: '',
      selectdate: false, //選擇all
      chartshowflag: false,
      nowdaytimestamp: 0, //今天日期timestamp
      btn1: 'btn btn-info',
      btn2: 'btn btn-info',
      btn3: 'btn btn-info',
      moldobject: [],
      moldselected: 0,
      starttime: '',
      endtime: '',
      autosearch: false
    }
  },
  created() {
    this.initime()
    // this.getmold()
  },
  mounted() {
    this.inichart()
  },
  methods: {
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

      this.starttime = this.timeStamptodate(starttime, 'yyyy-mm-dd')
      this.endtime = this.timeStamptodate(endtime, 'yyyy-mm-dd')
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
      this.stoptimer()
    },
    //搜尋
    searchtime() {
      // this.setmachinenumber()
      this.chartshowflag = false
      if (this.selectdate == false) {
        var t1 = this.stringToTimestampFunc(new Date(this.starttime + 'T00:00')) //開始時間轉timestamp
        var t2 = this.stringToTimestampFunc(new Date(this.endtime + 'T00:00')) //結束時間轉timestamp
        if (t1 > t2) {
          this.$layer.msg('日期錯誤!')
          this.chartshowflag = true
        } else {
          if (this.autosearch) {
            this.btn1 = 'btn btn-info'
            this.btn2 = 'btn btn-info'
            this.btn3 = 'btn btn-info'
            this.autosearch = false
          }

          this.getdata()
        }
      } else {
        this.getdata()
      }
    },
    //搜尋設定title設備編號
    // setmachinenumber() {
    //   if (this.moldobject != null) {
    //     for (var i = 0; i < this.moldobject.length; i++) {
    //       if (this.moldselected == this.moldobject[i].value) {
    //         this.machinenumber = this.moldobject[i].text
    //         break
    //       }
    //     }
    //   }
    // },
    //取得模具
    getmold() {
      var access_token_val = this.$cookies.get('access_token')
      moldSelectAPI({
        headers: {
          access_token: access_token_val,
          workshop: 'true'
        }
      }).then(
        res => {
          if (res.data != null) {
            res.data.sort((a, b) => naturalCompare(a.number, b.number)) //排序設備編號
            res.data.forEach(item => {
              this.moldobject.push({ value: item.id, text: item.number })
            })
            if (this.moldselected == 0) {
              //初始化預設第一個
              // this.machinenumber = res.data[0].number
              this.moldselected = res.data[0].id
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
      this.getmold()
    },
    //設定下載檔案名稱
    getchartfilename() {
      var tempstring =
        'IoM_Mold_Cycle_Time_' +
        this.timeStampToStringFunc(this.stringToTimestampFunc(new Date()), 'yyyymmddhhmm')
      return tempstring
    },

    //chart圖初始化
    inichart() {
      var chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart)
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
      chart.data = [
        // {
        //   timestamp: 1582473600000,
        //   IomIndex: 1587
        // },
        // {
        //   timestamp: 1582473700000,
        //   IomIndex: 1567
        // },
        // {
        //   timestamp: 1582473800000,
        //   IomIndex: 1555
        // },
        // {
        //   timestamp: 1582473900000,
        //   IomIndex: 555
        // }
      ]
      chart.paddingRight = 20

      var dateAxis = chart.xAxes.push(new am4charts.DateAxis())
      dateAxis.renderer.minGridDistance = 50
      dateAxis.renderer.labels.template.rotation = 30
      dateAxis.gridIntervals.setAll([
        { timeUnit: 'second', count: 1 },
        { timeUnit: 'minute', count: 1 },
        { timeUnit: 'hour', count: 1 },
        { timeUnit: 'day', count: 1 },
        { timeUnit: 'month', count: 1 }
      ])

      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
      valueAxis.tooltip.disabled = true
      valueAxis.min = 0

      var series = chart.series.push(new am4charts.StepLineSeries())
      series.dataFields.dateX = 'timestamp'
      series.dataFields.valueY = 'cycleTime'
      series.tooltipText = '{valueY.value}'
      series.strokeWidth = 3

      chart.cursor = new am4charts.XYCursor()
      chart.cursor.xAxis = dateAxis
      chart.cursor.fullWidthLineX = true
      chart.cursor.lineX.strokeWidth = 0
      chart.cursor.lineX.fill = chart.colors.getIndex(2)
      chart.cursor.lineX.fillOpacity = 0.1

      // chart.scrollbarX = new am4core.Scrollbar();
      var scrollbarX = new am4charts.XYChartScrollbar()
      scrollbarX.series.push(series)
      chart.scrollbarX = scrollbarX

      this.chart = chart
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
      let starttime = ''
      let endtime = ''
      if (this.selectdate == true) {
        //預設給空直
        // endtime = this.stringToTimestampFunc(new Date(this.resetendtime())) //結束時間預設前個整點
      } else {
        starttime = this.stringToTimestampFunc(new Date(this.starttime + 'T00:00')) //開始時間轉timestamp
        if (this.checktoday()) {
          //今天
          endtime = this.stringToTimestampFunc(new Date(this.resetendtime()))
        } else {
          //非今天
          endtime = this.stringToTimestampFunc(new Date(this.endtime + 'T00:00')) + 86400000 //結束時間轉timestamp
        }
      }
      var access_token_val = this.$cookies.get('access_token')
      mlodCttimeAPI({
        headers: {
          access_token: access_token_val,
          startTime: starttime,
          endTime: endtime,
          moldId: this.moldselected
        }
      }).then(
        res => {
          if (res.data != null) {
            this.dealdateinput(res.data[0], res.data[res.data.length - 1])
            /******************************
            var tempdata = [{timestamp: 1581634800000,greenProduction: 85.2,redProduction: 0,yellowProduction: 0}, {timestamp: 1581638400000,greenProduction: 260,redProduction: 21.3,yellowProduction: 1},{timestamp: 1581642000000,greenProduction: 348,redProduction: 17.4,yellowProduction: 8},{ timestamp: 1581645600000,greenProduction: 451.3,redProduction: 21.5,yellowProduction: 5},{ timestamp: 1581649200000,greenProduction: 483.3,redProduction: 20.4, yellowProduction: 15}]
            /*************************** */
            this.chart.data = res.data
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

    //取得第一、最後一筆時間塞回input
    dealdateinput(st, end) {
      this.starttime = this.timeStamptodate(st.timestamp, 'yyyy-mm-dd')
      this.endtime = this.timeStamptodate(end.timestamp, 'yyyy-mm-dd')
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
.card-body {
  height: 88vh;
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
  height: 90%;
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
