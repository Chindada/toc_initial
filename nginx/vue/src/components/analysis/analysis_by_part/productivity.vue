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
                  <b-col cols="3" class="title">{{ $t('product') }} :</b-col>
                  <b-col cols="9">
                    <model-select
                      required
                      v-model="partselected"
                      :options="partobject"
                      :placeholder="this.$t('product_unselect')"
                    ></model-select>
                    <!-- <div>
                    <mdb-col style="margin:auto">
                      <select
                        class="browser-default custom-select custom-select-sm"
                        v-model="partselected"
                        style="margin:auto"
                      >
                        <option
                          v-for="(mahineitem, key) in partobject"
                          :key="key"
                          :value="mahineitem.value"
                          >{{ mahineitem.text }}</option
                        >
                      </select>
                    </mdb-col>
                    </div>-->
                  </b-col>
                </b-row>
              </div>
            </b-col>

            <b-col cols="3">
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
            <b-col cols="3">
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
                :disabled="!autosearch"
              >
                <i class="fa fa-chevron-right"></i>
              </button>
            </b-col>
          </b-row>
          <!-- </div> -->

          <!-- ************************************ -->
          <!-- <div class="mx-3">
          <div align="center">
            <h2>生產效率分析({{ machinenumber }})</h2>
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
import { productSelectAPI } from '@/plugins/basicapis.js'
import { ProduceProductivityAPI } from '@/plugins/analyze.js'
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
      chartshowflag: false,
      nowdaytimestamp: 0, //今天日期timestamp
      btn1: 'btn btn-info',
      btn2: 'btn btn-info',
      btn3: 'btn btn-info',
      partobject: [],
      partselected: 0,
      starttime: new Date(),
      endtime: new Date(),
      autosearch: false
    }
  },
  created() {
    this.initime()
    this.getmachine()
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

      this.starttime = this.timeStampToStringFunc(starttime, 'yyyy-mm-dd')
      this.endtime = this.timeStampToStringFunc(endtime, 'yyyy-mm-dd')
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
        var starttime = this.timeStampToStringFunc(this.nowdaytimestamp, 'yyyy-mm-dd') //轉timestamp
      } else if (type == 'week') {
        this.btn1 = 'btn btn-info'
        this.btn2 = 'btn btn-success'
        this.btn3 = 'btn btn-info'
        var starttime = this.timeStampToStringFunc(this.nowdaytimestamp - 604800000, 'yyyy-mm-dd') //轉timestamp -7天
      } else if (type == 'month') {
        this.btn1 = 'btn btn-info'
        this.btn2 = 'btn btn-info'
        this.btn3 = 'btn btn-success'
        var starttime = this.timeStampToStringFunc(this.nowdaytimestamp - 2592000000, 'yyyy-mm-dd') //轉timestamp -30天
      }

      var endtime = this.timeStampToStringFunc(this.nowdaytimestamp, 'yyyy-mm-dd') //結束日期今天
      this.starttime = starttime
      this.endtime = endtime
      this.stoptimer()
    },
    //搜尋
    searchtime() {
      // this.setmachinenumber()
      this.chartshowflag = false
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
    //搜尋設定title設備編號
    // setmachinenumber() {
    //   if (this.partobject != null) {
    //     for (var i = 0; i < this.partobject.length; i++) {
    //       if (this.partselected == this.partobject[i].value) {
    //         this.machinenumber = this.partobject[i].text
    //         break
    //       }
    //     }
    //   }
    // },
    //取得設備
    getmachine() {
      var access_token_val = this.$cookies.get('access_token')
      productSelectAPI({
        headers: {
          access_token: access_token_val,
          workshop: 'true'
        }
      }).then(
        res => {
          console.log(res.data)
          if (res.data != null) {
            res.data.sort((a, b) => naturalCompare(a.number, b.number)) //排序設備編號
            res.data.forEach(item => {
              this.partobject.push({ value: item.id, text: item.number })
            })
            if (this.partselected == 0) {
              //初始化預設第一個
              this.partselected = res.data[0].id
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
      timestamp = this.timeStampToStringFunc(timestamp, 'yyyy-mm-dd') //轉timestamp
      this.starttime = timestamp
      this.endtime = timestamp
    },
    //設定下載檔案名稱
    getchartfilename() {
      var tempstring =
        'IoM_Part_Production_Efficiency_' +
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
      // Increase contrast by taking evey second color
      chart.colors.step = 2
      // Add data
      chart.data = []
      // Create axe
      var dateAxis = chart.xAxes.push(new am4charts.DateAxis())
      dateAxis.renderer.minGridDistance = 50
      dateAxis.title.text = this.$t('employee_time') //'時間' //x軸名稱'時間'

      // Create series
      function createAxisAndSeries(field, name, opposite, bullet) {
        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
        valueAxis.min = 0
        valueAxis.max = 120
        valueAxis.strictMinMax = true
        // if (field == 'u') {
        //   valueAxis.title.text = '生產效率(%)' //Y軸名稱
        // }
        var series = chart.series.push(new am4charts.LineSeries())
        series.dataFields.valueY = field
        series.dataFields.dateX = 'timestamp'
        series.strokeWidth = 2
        series.yAxis = valueAxis
        series.name = name
        series.tooltipText = '{name}: [bold]{valueY}[/]'
        series.tensionX = 1 //折線曲度

        var interfaceColors = new am4core.InterfaceColorSet()
        switch (bullet) {
          case 'triangle':
            var bullet = series.bullets.push(new am4charts.Bullet())
            bullet.width = 12
            bullet.height = 12
            bullet.horizontalCenter = 'middle'
            bullet.verticalCenter = 'middle'

            var triangle = bullet.createChild(am4core.Triangle)
            triangle.stroke = interfaceColors.getFor('background')
            triangle.strokeWidth = 2
            triangle.direction = 'top'
            triangle.width = 12
            triangle.height = 12
            break
          case 'rectangle':
            var bullet = series.bullets.push(new am4charts.Bullet())
            bullet.width = 10
            bullet.height = 10
            bullet.horizontalCenter = 'middle'
            bullet.verticalCenter = 'middle'
            var rectangle = bullet.createChild(am4core.Rectangle)
            rectangle.stroke = interfaceColors.getFor('background')
            rectangle.strokeWidth = 2
            rectangle.width = 10
            rectangle.height = 10
            break
          default:
            var bullet = series.bullets.push(new am4charts.CircleBullet())
            bullet.circle.stroke = interfaceColors.getFor('background')
            bullet.circle.strokeWidth = 2
            break
        }
        valueAxis.renderer.opposite = opposite
        valueAxis.renderer.labels.template.disabled = opposite //隱藏Y軸
        valueAxis.renderer.line.strokeOpacity = 1
        valueAxis.renderer.line.strokeWidth = 2
        valueAxis.renderer.line.stroke = series.stroke
        valueAxis.renderer.labels.template.fill = series.stroke
        valueAxis.renderer.grid.template.disabled = true
        if (field == 'u') {
          // valueAxis.title.text = "模次"//Y軸名稱
        }
      }
      createAxisAndSeries('u', 'U', false, 'circle')
      createAxisAndSeries('a', 'A', true, 'triangle')
      createAxisAndSeries('p', 'P', true, 'rectangle')
      createAxisAndSeries('s', 'S', true, 'rectangle')
      // Add legend
      chart.legend = new am4charts.Legend()
      // Add cursor
      chart.cursor = new am4charts.XYCursor()
      // generate some random data, quite different range

      this.chart = chart
    },
    //Call API取得資料
    getdata() {
      var starttime = this.stringToTimestampFunc(new Date(this.starttime + 'T00:00')) //開始時間轉timestamp
      var endtime = this.stringToTimestampFunc(new Date(this.endtime + 'T00:00')) + 86400000 //結束時間轉timestamp
      var access_token_val = this.$cookies.get('access_token')
      ProduceProductivityAPI({
        headers: {
          access_token: access_token_val,
          startTime: starttime,
          endTime: endtime,
          productId: this.partselected
        }
      }).then(
        res => {
          if (res.data != null) {
            // console.log(res.data)
            /********************************
            var tempdata = [{timestamp: 1581883200000,U: 10,A: 15,P: 20,S: 5},{timestamp: 1581886800000,U: 15,A: 7,P: 55, S: 13},{timestamp: 1581890400000,U: 26,A: 77,P: 37, S: 13},{timestamp: 1581894000000,U: 26,A: 87, P: 37,S: 40}]
            /*************************** */
            this.chart.data = this.countavag(res.data)
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
    checkisnan(data) {
      if (data == undefined) {
        return 0
      } else {
        return data
      }
    },
    //計算平均
    countavag(data) {
      var temparray = []
      data.forEach((item, index) => {
        // this.checkisnan(item.u)
        item.u = this.checkisnan(item.u)
        item.a = this.checkisnan(item.a)
        item.p = this.checkisnan(item.p)
        item.s = this.checkisnan(item.s)

        item.timestamp = this.checkisnan(item.timestamp)
        if (index % 24 == 0) {
          let temp = 0
          let firstp = 0
          if (item.p != 0) {
            temp = item.a
          }
          if (item.p == 0 && item.a != 0) {
            firstp = 100
          } else {
            firstp = item.p * item.a
          }
          let tempsa = item.s * item.a
          let tempdaycount = 0
          if (item.u != 0) {
            tempdaycount = 1
          }

          temparray.push({
            timestamp: new Date(this.timeStampToStringFunc(item.timestamp, 'yyyy-mm-ddThh:00')),
            u: item.u,
            a: item.a,
            p: firstp,
            s: tempsa,
            scount: temp,
            daycount: tempdaycount
          })
        } else {
          var arrindex = Math.floor(index / 24)
          temparray[arrindex].u += item.u
          temparray[arrindex].a += item.a
          temparray[arrindex].s += item.s * item.a
          if (item.u != 0) {
            temparray[arrindex].daycount++
          }
          let tempitemp = item.p
          if (item.p == 0 && item.a != 0) {
            temparray[arrindex].p += 100
            tempitemp = 100
          }
          temparray[arrindex].p += item.p * item.a

          if (tempitemp != 0) {
            temparray[arrindex].scount += item.a
          }
        }
      })

      let temparray1 = []

      JSON.parse(JSON.stringify(temparray)).forEach(item => {
        let tempp = 0
        if (item.scount != 0 && item.p != 0) {
          tempp = Math.round((item.p / item.scount) * 10) / 10
        } else {
          tempp = 0
        }
        let temps
        if (item.a == 0) {
          temps = 0
        } else {
          temps = Math.round((item.s / item.a) * 10) / 10
        }
        let tempu = Math.round((item.u / item.daycount) * 10) / 10
        let tempa = Math.round((item.a / item.daycount) * 10) / 10
        // item.s = Math.round((item.s / item.a) * 10) / 10
        // item.u = Math.round((item.u / 24) * 10) / 10
        // item.a = Math.round((item.a / 24) * 10) / 10
        temparray1.push({
          timestamp: item.timestamp,
          u: this.checkisnan1(tempu),
          a: this.checkisnan1(tempa),
          p: this.checkisnan1(tempp),
          s: this.checkisnan1(temps)
        })
      })

      return temparray1
    },
    checkisnan1(data) {
      if (isNaN(data)) {
        return 0
      } else {
        return data
      }
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
