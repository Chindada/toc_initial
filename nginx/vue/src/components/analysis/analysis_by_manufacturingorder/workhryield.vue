<template>
  <mdb-container fluid>
    <mdb-card>
      <mdb-card-body>
        <!-- ***************************** -->
        <div style="height:10%">
          <b-row>
            <b-col cols="4">
              <div style="align-items: center;">
                <b-row>
                  <b-col cols="4" class="title" style="padding-top:10px"
                    >{{ $t('manufacturingorder') }} :</b-col
                  >
                  <b-col cols="8">
                    <div class="content">
                      <el-select
                        ref="test"
                        v-model="manufacturingorderselected"
                        :placeholder="$t('please_select') + $t('manufacturingorder')"
                        multiple
                        collapse-tags
                        style="margin-left: 0px;width:100%"
                        v-el-select-loadmore:rangeNumber="loadMore(rangeNumber)"
                      >
                        <el-input
                          v-model="search"
                          size="small"
                          :placeholder="$t('search')"
                        ></el-input>
                        <el-option
                          v-for="(item, index) in optionsArr.slice(0, rangeNumber)"
                          v-show="item.show"
                          :key="index"
                          :disabled="item.disabled"
                          :label="item.text"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                    </div>
                    <!-- <model-select
                      required
                      v-model="manufacturingorderselected"
                      :options="manufacturingorderobject"
                      :placeholder="this.$t('select_machine')"
                    >
                    </model-select>-->
                  </b-col>
                </b-row>
              </div>
            </b-col>
            <b-col cols="1">
              <mdb-btn size="sm" color="primary" v-on:click="searchtime()">
                {{ $t('search') }}
              </mdb-btn>
            </b-col>
          </b-row>

          <!-- <div class="mx-3">
            <div align="center">
              <h2>工時產量({{ machinenumber }})</h2>
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
import { ManufacturingorderSelectAPI } from '@/plugins/produceapis.js'
import { analyzeManuFacturingOrderWorkhryieldAPI } from '@/plugins/analyze.js'
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
      machinenumber: '',
      chartshowflag: false,
      btn1: 'btn btn-info',
      btn2: 'btn btn-info',
      btn3: 'btn btn-info',
      manufacturingorderobject: [],
      manufacturingorderselected: [],
      optionsArr: [],
      starttime: new Date(),
      endtime: new Date(),
      autosearch: false,
      rangeNumber: 100,
      orgRangeNumber: 100,
      search: ''
    }
  },
  directives: {
    'el-select-loadmore': {
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
        SELECTWRAP_DOM.addEventListener('scroll', function() {
          /**
           * scrollHeight 获取元素内容高度(只读)
           * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
           * clientHeight 读取元素的可见高度(只读)
           * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
           * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
           */
          const condition = this.scrollHeight - this.scrollTop <= this.clientHeight
          if (condition) binding.value()
        })
      }
    }
  },
  created() {
    this.getmachine()
  },
  mounted() {
    this.inichart()
  },
  watch: {
    search(newVal) {
      if (newVal) {
        this.optionsArr = JSON.parse(JSON.stringify(this.manufacturingorderobject))
        let flag = true //無搜尋結果flag
        //搜尋符合顯示True，其他false
        for (let i = 0; i < this.optionsArr.length; i++) {
          if (this.optionsArr[i].text.includes(newVal)) {
            flag = false
            this.optionsArr[i].show = true
          } else {
            this.optionsArr[i].show = false
          }
        }
        //篩選true返回
        this.optionsArr = this.optionsArr.filter(item => {
          if (item.show) {
            return item
          }
        })
        //全部篩選已選擇，顯示設為false塞入選單
        if (this.manufacturingorderselected.length != 0) {
          this.manufacturingorderselected.forEach(item => {
            this.manufacturingorderobject.forEach(object => {
              if (object.value == item) {
                let tempobj = JSON.parse(JSON.stringify(object))
                tempobj.show = false //隱藏已選擇
                this.optionsArr.unshift(tempobj)
              }
            })
          })
        }
        this.rangeNumber += this.manufacturingorderselected.length
        //無結果塞一條無結果
        if (flag) {
          this.optionsArr.push({
            text: this.$t('nodata'),
            disabled: true,
            show: true,
            value: -1
          })
        }
      } else {
        //清空搜尋結果
        this.rangeNumber = this.orgRangeNumber //回復初始值
        this.optionsArr = this.manufacturingorderobject
      }
    }
  },

  methods: {
    loadMore() {
      return () => (this.rangeNumber += 100) //加載下100比
    },
    onChange(value) {
      this.manufacturingorderselected = value
    },
    //搜尋
    searchtime() {
      // this.setmachinenumber()
      this.chartshowflag = false
      this.getdata()
    },
    //取得製令
    getmachine() {
      var access_token_val = this.$cookies.get('access_token')
      ManufacturingorderSelectAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          if (res.data != null) {
            res.data.sort((a, b) => naturalCompare(a.number, b.number)) //排序編號

            res.data.forEach(item => {
              this.manufacturingorderobject.push({ value: item.id, text: item.number, show: true })
              this.optionsArr.push({ value: item.id, text: item.number, show: true })
            })
            this.optionsArr.push({
              text: this.$t('nodata'),
              disabled: true,
              show: false,
              value: -1
            })
            this.manufacturingorderobject.push({
              text: this.$t('nodata'),
              disabled: true,
              show: false,
              value: -1
            })
            if (this.manufacturingorderselected == 0) {
              //初始化預設第一個
              this.manufacturingorderselected.push(res.data[0].id)
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
    //設定下載檔案名稱
    getchartfilename() {
      var tempstring =
        'IoM_Manufacturingorder_Production_Per_Hour_' +
        this.timeStampToStringFunc(this.stringToTimestampFunc(new Date()), 'yyyymmddhhmm')
      return tempstring
    },

    //chart圖初始化
    inichart() {
      var chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart)
      chart.colors.list = [
        am4core.color('#00a136'),
        am4core.color('#FFF03C'),
        am4core.color('#ff0000')
      ]
      var colorSet = new am4core.ColorSet()
      colorSet.saturation = 0.4
      var colorSet = new am4core.ColorSet()
      colorSet.saturation = 0.4
      chart.data = []

      chart.dateFormatter.inputDateFormat = 'yyyy-MM-dd-H'
      var dateAxis = chart.xAxes.push(new am4charts.DateAxis())
      dateAxis.renderer.minGridDistance = 60

      dateAxis.title.text = this.$t('employee_time') //'時間' //x軸名稱'時間'
      dateAxis.baseInterval = {
        timeUnit: 'hour',
        count: 1
      }
      dateAxis.gridIntervals.setAll([
        { timeUnit: 'hour', count: 1 },
        { timeUnit: 'day', count: 1 },
        { timeUnit: 'month', count: 1 }
      ])

      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
      valueAxis.tooltip.disabled = true
      valueAxis.title.text = this.$t('gyr_yaxis') //'模次' //Y軸名稱
      valueAxis.min = 0

      var series = chart.series.push(new am4charts.ColumnSeries())
      series.dataFields.dateX = 'timestamp'
      series.name = this.$t('gyr_xaxis1') //'綠品'
      series.dataFields.valueY = 'greenProduction'
      series.tooltipText = '[#000]{valueY.value}[/]'
      series.tooltip.background.fill = am4core.color('#FFF')
      series.tooltip.getStrokeFromObject = true
      series.tooltip.background.strokeWidth = 3
      series.tooltip.getFillFromObject = false
      series.fillOpacity = 0.6
      series.strokeWidth = 2
      series.stacked = true

      var series2 = chart.series.push(new am4charts.ColumnSeries())
      series2.name = this.$t('gyr_xaxis2') //'黃品'
      series2.dataFields.dateX = 'timestamp'
      series2.dataFields.valueY = 'yellowProduction'
      series2.tooltipText = '[#000]{valueY.value}[/]'
      series2.tooltip.background.fill = am4core.color('#FFF')
      series2.tooltip.getFillFromObject = false
      series2.tooltip.getStrokeFromObject = true
      series2.tooltip.background.strokeWidth = 3
      series2.sequencedInterpolation = true
      series2.fillOpacity = 0.6
      series2.stacked = true
      series2.strokeWidth = 2

      var series3 = chart.series.push(new am4charts.ColumnSeries())
      series3.name = this.$t('gyr_xaxis3') //'紅品(單位: 模次)'
      series3.dataFields.dateX = 'timestamp'
      series3.dataFields.valueY = 'redProduction'
      series3.tooltipText = '[#000]{valueY.value}[/]'
      series3.tooltip.background.fill = am4core.color('#FFF')
      series3.tooltip.getFillFromObject = false
      series3.tooltip.getStrokeFromObject = true
      series3.tooltip.background.strokeWidth = 3
      series3.sequencedInterpolation = true
      series3.fillOpacity = 0.6
      series3.defaultState.transitionDuration = 1000
      series3.stacked = true
      series3.strokeWidth = 2

      chart.cursor = new am4charts.XYCursor()
      chart.cursor.xAxis = dateAxis
      chart.scrollbarX = new am4core.Scrollbar()
      chart.legend = new am4charts.Legend() // Add a legend
      chart.legend.position = 'top'

      this.chart = chart
    },
    //處理選擇Id
    dealmanufacturingorderselected(data) {
      let tempstring = '['
      data.forEach(item => {
        tempstring = tempstring + item + ','
      })
      let returnval = tempstring.substring(0, tempstring.length - 1) + ']'
      if (returnval == ']') {
        returnval = '[]'
      }
      return returnval
    },
    //Call API取得資料
    getdata() {
      var access_token_val = this.$cookies.get('access_token')
      var manufacturingorderArrayString = this.dealmanufacturingorderselected(
        this.manufacturingorderselected
      )

      analyzeManuFacturingOrderWorkhryieldAPI({
        headers: {
          access_token: access_token_val,
          ids: manufacturingorderArrayString
        }
      }).then(
        res => {
          if (res.data != null) {
            res.data.forEach(item => {
              item.greenProduction = Math.round(item.greenProduction)
              item.yellowProduction = Math.round(item.yellowProduction)
              item.redProduction = Math.round(item.redProduction)
              item.timestamp = this.timeStamptodate(item.timestamp, 'yyyy-mm-dd hh')
            })
            this.chart.data = res.data
          } else {
            this.chart.data = []
            this.$layer.msg(this.$t('無資料'))
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
    timeStamptodate(time, type) {
      //timestamp 轉data
      if (type == 'yyyy-mm-dd hh') {
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
  text-align: center;
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
.content {
  padding: 0px;
}
.content .el-input {
  width: 400px;
  margin: 20px;
}
</style>
