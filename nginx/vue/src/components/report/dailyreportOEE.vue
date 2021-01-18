<template>
  <mdb-container
    fluid
    class="print1"
    style="  padding-right: 1rem !important;padding-left: 0px !important;padding-top: 0px !important;padding-bottom: 0px !important;"
  >
    <div class="mx-3" style="margin:0px">
      <div v-if="!show" class="ready" style="opacity: 0"></div>
      <div class="headercss" v-html="headertag"></div>
      <div class="headbody_page_firstpage">
        <div align="center" id="totalconunt">
          <div class="total1 first">
            <div style="font-size: 0.5vw;opacity:0">s</div>
            <div id="chartM" style="text-align:center;"></div>
          </div>
          <div class="total1 sec">
            <div style="font-size: 0.5vw;opacity:0">s</div>
            <div id="chartA" style="text-align:center;"></div>
          </div>
          <div class="total1 sec">
            <div style="font-size: 0.5vw;opacity:0">s</div>
            <div id="chartP" style="text-align:center;"></div>
          </div>
          <div class="total1 sec">
            <div style="font-size: 0.5vw;opacity:0">s</div>
            <div id="chartQ" style="text-align:center;"></div>
          </div>
          <div class="total1 sec">
            <div style="font-size: 0.5vw;opacity:0">s</div>
            <div id="chartS" style="text-align:center;"></div>
          </div>
          <div class="total first">
            <span style="font-size: 1.5vw">M: {{ lagnuage.manufacture_chart }} </span>
          </div>
          <div class="total sec">
            <span style="font-size: 1.5vw">A: {{ lagnuage.equipment_chart }}</span>
          </div>
          <div class="total sec">
            <span style="font-size: 1.5vw">P: {{ lagnuage.efficiency_chart }}</span>
          </div>
          <div class="total sec">
            <span style="font-size: 1.5vw">Q: {{ lagnuage.efficiency1_chart }}</span>
          </div>
          <div class="total sec">
            <span style="font-size: 1.5vw">S: {{ lagnuage.stability_chart }}</span>
          </div>
        </div>

        <h2 style="margin: 0px">1.{{ lagnuage.manufacture_index }}</h2>
      </div>
      <div class="tablecss" v-html="table1"></div>

      <div class="headercss" v-html="headertag"></div>
      <h2 style="margin: 0px">2.{{ lagnuage.equipment_index }}</h2>
      <h6 class="gap">111</h6>
      <div class="tablecss" v-html="table2"></div>

      <div class="headercss" v-html="headertag"></div>
      <h2 style="margin: 0px">3.{{ lagnuage.efficiency_index }}</h2>
      <h6 class="gap">111</h6>
      <div class="tablecss" v-html="table3"></div>

      <div class="headercss" v-html="headertag"></div>
      <h2 style="margin: 0px">4.{{ lagnuage.stability_index }}</h2>
      <h6 class="gap">111</h6>
      <div class="tablecss" v-html="table4"></div>

      <div class="headercss" v-html="headertag"></div>
      <h2 style="margin: 0px">5.{{ lagnuage.schedules_index }}</h2>
      <h6 class="gap">111</h6>
      <div class="tablecss" v-html="table5"></div>
    </div>
  </mdb-container>
</template>

<script>
import * as d3 from 'd3'
import { DailyInfoAPI } from '@/plugins/analyze.js'
import { WorkShopAPI } from '@/plugins/basicapis.js'
import { SystemSettingAPI, getlanguage } from '@/plugins/basicapis.js'
import naturalCompare from 'string-natural-compare'
export default {
  name: 'DatatablePage',
  components: {},
  mounted() {
    this.inilanguage() //取得語言
  },
  created() {
    this.geturlvalue() //取得URL日期
  },
  data() {
    return {
      companyLogo: '', //公司logo
      companyName: '', //公司名稱
      workShopName: '', //廠區名稱
      sortorderdata: [],
      sortorderdata_scheduled: [],
      redboundary: 30, //紅參數
      yellowboundary: 60, //黃參數
      totalpage: 1,
      currentpage: 1,
      footer1: '', //公司、廠區名稱
      footer2: '', //日期
      lastfooter1: '', //公司、廠區名稱
      lastfooter2: '', //日期

      headertag: '',
      headertag1:
        '<h1 class="gap">111</h1>' +
        '<div style="width: 100%;text-align:center" id="title-head">' +
        '<img alt="AIOM"class="img-center"style="max-height: 55px;max-width:131px;margin: auto;margin-left:0px; "src="',

      headertag2:
        '"/>' +
        '<span class="ex5-box" style="font-size:4ch">IoM Daily Report</span>' +
        // ' <span style="opacity:0">walalala</span>' +
        '<img alt="AIOM"class="img-center"style="max-height: 55px;max-width:131px;float:right;margin: auto;margin-right:0px; "src="' +
        require('../../assets/AIOM-1.png') +
        '"/>' +
        ' </div>' +
        '<hr align="center" width="100%" style="border: 2.5px solid black;margin-top:0px; " />',
      table1: '',
      table2: '',
      table3: '',
      table4: '',
      table5: '',
      titalM: 100,
      titalA: 0,
      titalP: 0,
      titalQ: 0,
      titalS: 0,
      show: true,
      workShopId: 0,
      year: '',
      month: '',
      day: '',
      lagnuage: {
        // manufacture_chart: '製造指標', //製造指標
        // equipment_chart: '設備指標', //設備指標
        // efficiency_chart: '效率指標', //效率指標
        // efficiency1_chart: '良率指標', //良率指標
        // stability_chart: '穩定指標', //穩定指標
        // manufacture_index: '製造指標', //1.製造指標
        // equipment_index: '設備指標', //2.設備指標
        // efficiency_index: '效率指標', //3.效率指標
        // stability_index: '穩定指標', //4.穩定指標
        // schedules_index: '本日排程', //5.本日排程
        // reportdate: '報表日期', //報表日期
        // downdtime: '下載日期', //下載日期
        // plan_number: '計畫產量', //計畫產量
        // production_number: '累積模次', //生產量
        // storage_number: '入庫量', //入庫量
        // storage_rate: '入庫率', //入庫率
        // storage_yieldrate: '良率', //入庫良率(Q)
        // remaining_time: '餘工時', //餘工時
        // report_manufacture_number: '製令編號', //製令編號
        // report_machine_number: '設備編號', //設備編號
        // d_day: '當日指標', //當日指標
        // d_day_1: '前一日', //前一日
        // d_day_2: '前二日', //前二日
        // d_day_3: '前三日', //前三日
        // d_day_7: '前七日', //前七日
        // d_day_30: '前三十日', //前三十日
        // short_tern: '短期趨勢', //短期趨勢
        // logn_tern: '長期趨勢', //長期趨勢
        // report_schedule_number: '排程編號', //排程編號
        // report_mold_number: '模具編號', //模具編號
        // plan_molds: '計畫模次', //計畫模次
        // nodata: '無資料' //無資料
      }
    }
  },
  methods: {
    //設定語系
    inilanguage() {
      var access_token_val = this.$cookies.get('access_token')
      getlanguage({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          var lang = res.data.language
          localStorage.setItem('locale', lang)
          this.setlanguage(lang) //設定語系
          this.settable() //設定table title
          this.getdata() //callAPI取得資料
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //初始設定footer(公司名稱、logo、廠區、時間)
    setfooterini() {
      var temptime = this.year + '-' + this.month + '-' + this.day

      var cosname = this.companyName + '【' + this.workShopName + '】'
      var pagetime =
        this.lagnuage.reportdate +
        ': ' +
        this.timeStamptodate(this.stringToTimestampFunc(new Date(temptime)), 'pagedatedata') +
        ' ' +
        this.lagnuage.downdtime +
        ': ' +
        this.timeStampToStringFunc(
          this.stringToTimestampFunc(new Date(new Date())),
          'yyyy/mm/dd hh:mm'
        ) //轉timestamp
      this.lastfooter1 =
        ' <div align="center" class="pagefooter"style="page-break-after: avoid;">' +
        '<hr align="center" width="100%" style="border: 2.5px solid black; " />' +
        '<h4>' +
        '<b-row>' +
        '<b-col cols="4">' +
        '<span style="float: left;">' +
        cosname +
        '</span>'
      ;('</b-col>')
      this.footer1 =
        ' <div align="center" class="pagefooter" style="page-break-after: always;">' +
        '<hr align="center" width="100%" style="border: 2.5px solid black; " />' +
        '<h4>' +
        '<b-row>' +
        '<b-col cols="4">' +
        '<span style="float: left;">' +
        cosname +
        '</span>'
      ;('</b-col>')
      this.footer2 =
        '<b-col cols="4">' +
        ' <span style="float: right;">' +
        pagetime +
        ' </span>' +
        '</b-col>' +
        '</b-row>' +
        '</h4>' +
        '</div>'
      this.headertag = this.headertag1 + this.companyLogo + this.headertag2
      // this.getdata() //取得報表資料
    },
    //取得公司名稱、logo
    getcompanyname() {
      var access_token_val = this.$cookies.get('access_token')
      SystemSettingAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          if (res.data != null) {
            res.data.forEach(item => {
              if (item.parameter == 'company_name') {
                this.companyName = item.value
              }
              if (item.parameter == 'company_logo') {
                this.companyLogo = item.value
              }
            })
          }
          this.setfooterini() //設定footer
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //取得廠區
    getworkshop(id) {
      var access_token_val = this.$cookies.get('access_token')
      WorkShopAPI.get({
        headers: {
          access_token: access_token_val,
          workShop: 'true'
        }
      }).then(
        res => {
          if (res.data != null) {
            res.data.forEach(item => {
              if (id == item.id) {
                this.workShopName = item.name
              }
            })
          }

          this.getcompanyname() //取得公司名稱
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //處理timestamp
    timeStamptodate(time, type) {
      //timestamp 轉data
      var datetime = new Date()
      datetime.setTime(time)
      var year = datetime.getFullYear()
      var month = datetime.getMonth() + 1
      var date = datetime.getDate()
      var week = datetime.getDay()
      var hour = datetime.getHours()
      var min = datetime.getMinutes()
      switch (week) {
        case 0:
          week = this.lagnuage.sun1 //'日'
          break
        case 1:
          week = this.lagnuage.mon1 //'一'
          break
        case 2:
          week = this.lagnuage.tue1 //'二'
          break
        case 3:
          week = this.lagnuage.wed1 //'三'
          break
        case 4:
          week = this.lagnuage.thu1 //'四'
          break
        case 5:
          week = this.lagnuage.fri1 //'五'
          break
        case 6:
          week = this.lagnuage.sat1 //'六'
          break
      }
      if (month < 10) {
        month = '0' + month
      }
      if (date < 10) {
        date = '0' + date
      }
      if (hour < 10) {
        hour = '0' + hour
      }
      if (min < 10) {
        min = '0' + min
      }
      if (type == 'pagedatedata') {
        return year + '/' + month + '/' + date + '(' + week + ')'
      }
    },
    geturlvalue() {
      this.workShopId = this.$route.query.workShopId
      this.year = this.$route.query.year
      this.month = this.$route.query.month
      this.day = this.$route.query.day

      // this.getworkshop(this.workShopId) //取得廠區名稱
      // for (var i = 0; i < 5; i++) {
      //   this.tesethtml += '<div>' + i + '</div>'
      // }
    },
    getdata() {
      // /***** call API
      var access_token_val = this.$cookies.get('access_token')
      DailyInfoAPI({
        headers: {
          access_token: access_token_val,
          workShopId: this.workShopId,
          recal: 'false', //先寫死
          year: this.year,
          month: this.month,
          day: this.day
        }
      }).then(
        res => {
          this.companyName = res.data.companyName
          this.companyLogo = res.data.companyLogo
          if (this.workShopId == 'All') {
            //全部廠區
            this.workShopName = 'All'
          } else {
            this.workShopName = res.data.workShopName
          }
          this.redboundary = res.data.reportRedBoundary
          this.yellowboundary = res.data.reportYellowBoundary
          this.setfooterini()
          this.dealdata(res.data)
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //處理資料
    dealdata(data) {
      // this.sortorder(data.order) //分類排序製造指標處理成
      this.counttotalpage(data) //計算總頁數
      this.drawchart(data) //統計繪圖
      this.order(data.order) //製造指標
      this.machine(data.machine) //設備報表
      this.efficiency(data.efficiency) //設備效率報表
      this.stablility(data.stablility) //設備穩定度報表
      this.schedule(data.schedule) //當日製令報表
      this.test()
    },
    //計算總頁數
    counttotalpage(data) {
      var total = 0
      var firstnum = 18
      var secnum = 21
      if (data.order != null) {
        total += this.counteachtotal(data.order.length, firstnum, secnum)
      } else {
        total += 1
      }
      if (data.machine != null) {
        total += this.counteachtotal(data.machine.length, secnum, secnum)
      } else {
        total += 1
      }
      if (data.efficiency != null) {
        total += this.counteachtotal(data.efficiency.length, secnum, secnum)
      } else {
        total += 1
      }
      if (data.stablility != null) {
        total += this.counteachtotal(data.stablility.length, secnum, secnum)
      } else {
        total += 1
      }
      if (data.schedule != null) {
        total += this.counteachtotal(data.schedule.length, secnum, secnum)
      } else {
        total += 1
      }
      this.totalpage = total
    },

    //添加最後footer
    addlastfooter() {
      var tempstring =
        this.lastfooter1 +
        '<b-col cols="4">' +
        '<span id="page"' +
        ' > <span id="order_current_page1">' +
        this.currentpage +
        '</span> /' +
        '<span class="total_page">' +
        this.totalpage +
        ' </span>' +
        '</span>' +
        '</b-col>' +
        this.footer2
      this.currentpage++
      return tempstring
    },
    //添加footer
    addfooter() {
      var tempstring =
        this.footer1 +
        '<b-col cols="4">' +
        '<span id="page"' +
        ' > <span id="order_current_page1">' +
        this.currentpage +
        '</span> /' +
        '<span class="total_page"> ' +
        this.totalpage +
        ' </span>' +
        '</span>' +
        '</b-col>' +
        this.footer2
      this.currentpage++
      return tempstring
    },
    filllastpage(num1, num) {
      if (num == num1) {
        return ''
      }
      var tempstring = '<table>'
      for (var i = 0; i <= num; i++) {
        tempstring +=
          '<tr><td style=" border: 1px solid white;">' +
          '</td><td style=" border: 1px solid white;">' +
          '</td><td style=" border: 1px solid white;">' +
          '</td><td style=" border: 1px solid white;">' +
          '</td><td style=" border: 1px solid white;">' +
          '</td><td style=" border: 1px solid white;">' +
          '</td><td style=" border: 1px solid white;">' +
          '</td><td style=" border: 1px solid white;">' +
          '</td><td style=" border: 1px solid white;">' +
          '</td><td style=" border: 1px solid white;">' +
          '</td></tr>'
      }
      tempstring += '</table>'
      return tempstring
    },
    //製造指標
    order(data) {
      // var temparray = []
      // for (var i = 0; i < 20; i++) {
      //   data.forEach(item => {
      //     temparray.push(item)
      //   })
      // }
      // data = temparray
      // data = null
      var firstnum = 18
      var secnum = 21
      var startstring = this.table1 //tabletitle
      if (data != null) {
        data.sort((a, b) => naturalCompare(a.machineNumber, b.machineNumber))
        //資歷料少於一頁
        if (data.length < firstnum) {
          data.forEach((item, index) => {
            this.filltable1(item, index)
          })

          this.table1 += '</table>'
          this.table1 += this.filllastpage(firstnum, firstnum - data.length)
        } else {
          //資歷料大於一頁
          data.forEach((item, index) => {
            //第一頁
            if (index < firstnum) {
              this.filltable1(item, index)
            } else {
              if (index == firstnum || (index % secnum == 0 && index != secnum)) {
                //第一頁滿or第二頁滿28個
                this.table1 += '</table>'
                this.table1 += this.addfooter()
                this.table1 +=
                  this.headertag +
                  '<h2 style="margin: 0px">1.' +
                  this.lagnuage.manufacture_index +
                  '</h2><h6 class="gap">111</h6>'
                this.table1 += startstring
              }
              this.filltable1(item, index)
            }
          })
          this.table1 += '</table>'
          this.table1 += this.filllastpage(secnum, secnum - ((data.length - firstnum) % secnum))
        }
        this.table1 += this.addfooter()
      } else {
        this.table1 += '<tr><td colspan="13">' + this.lagnuage.nodata + '</td></tr>'
        this.table1 += '</table>'
        this.table1 += this.filllastpage(0, firstnum)
        this.table1 += this.addfooter()
      }
    },
    //設備指標
    machine(data) {
      // data = null
      // var temparray = []
      // for (var i = 0; i < 40; i++) {
      //   data.forEach(item => {
      //     temparray.push(item)
      //   })
      // }
      // data = temparray
      var secnum = 21
      var startstring = this.table2 //tabletitle
      if (data != null) {
        data.sort((a, b) => naturalCompare(a.MachineNumber, b.MachineNumber))
        //資歷料少於一頁
        if (data.length < secnum) {
          data.forEach((item, index) => {
            this.filltable2(item, index)
          })

          this.table2 += '</table>'
          this.table2 += this.filllastpage(secnum, secnum - data.length)
        } else {
          //資歷料大於一頁
          data.forEach((item, index) => {
            if (index % secnum == 0 && index != 0) {
              //頁滿
              this.table2 += '</table>'
              this.table2 += this.addfooter()
              this.table2 +=
                this.headertag +
                '<h2 style="margin: 0px">2.' +
                this.lagnuage.equipment_index +
                '</h2><h6 class="gap">111</h6>'
              this.table2 += startstring
            }
            this.filltable2(item, index)
          })

          this.table2 += '</table>'
          this.table2 += this.filllastpage(secnum, secnum - ((data.length - secnum) % secnum))
        }
        this.table2 += this.addfooter()
      } else {
        this.table2 += '<tr><td colspan="10">' + this.lagnuage.nodata + '</td></tr>'
        this.table2 += '</table>'
        this.table2 += this.filllastpage(0, secnum)
        this.table2 += this.addfooter()
      }
    },
    //效率指標
    efficiency(data) {
      // data = null
      var secnum = 21
      // var temparray = []
      // for (var i = 0; i < 40; i++) {
      //   data.forEach(item => {
      //     temparray.push(item)
      //   })
      // }
      // data = temparray
      var startstring = this.table3 //tabletitle
      if (data != null) {
        data.sort((a, b) => naturalCompare(a.MachineNumber, b.MachineNumber))
        //資歷料少於一頁
        if (data.length < 29) {
          data.forEach((item, index) => {
            this.filltable3(item, index)
          })
          this.table3 += '</table>'
          this.table3 += this.filllastpage(29, secnum - data.length)
        } else {
          //資歷料大於一頁
          data.forEach((item, index) => {
            if (index % secnum == 0 && index != 0) {
              //頁滿
              this.table3 += '</table>'
              this.table3 += this.addfooter()
              this.table3 +=
                this.headertag +
                '<h2 style="margin: 0px">2.' +
                this.lagnuage.efficiency_index +
                '</h2><h6 class="gap">111</h6>'
              this.table3 += startstring
            }
            this.filltable3(item, index)
          })
          this.table3 += '</table>'
          this.table3 += this.filllastpage(secnum, secnum - ((data.length - secnum) % secnum))
        }
        this.table3 += this.addfooter()
      } else {
        this.table3 += '<tr><td colspan="10">' + this.lagnuage.nodata + '</td></tr>'
        this.table3 += '</table>'
        this.table3 += this.filllastpage(0, secnum)
        this.table3 += this.addfooter()
      }
    },
    //穩定指標
    stablility(data) {
      // data = null
      var secnum = 21
      var startstring = this.table4 //tabletitle
      if (data != null) {
        data.sort((a, b) => naturalCompare(a.MachineNumber, b.MachineNumber))
        //資歷料少於一頁
        if (data.length < secnum) {
          data.forEach((item, index) => {
            this.filltable4(item, index)
          })
          this.table4 += '</table>'
          this.table4 += this.filllastpage(secnum, secnum - data.length)
        } else {
          //資歷料大於一頁
          data.forEach((item, index) => {
            if (index % secnum == 0 && index != 0) {
              //頁滿
              this.table4 += '</table>'
              this.table4 += this.addfooter()
              this.table4 +=
                this.headertag +
                '<h2 style="margin: 0px">3.' +
                this.lagnuage.stability_index +
                '</h2><h6 class="gap">111</h6>'
              this.table4 += startstring
            }
            this.filltable4(item, index)
          })
          this.table4 += '</table>'
          this.table4 += this.filllastpage(secnum, secnum - ((data.length - secnum) % secnum))
        }
        this.table4 += this.addfooter()
      } else {
        this.table4 += '<tr><td colspan="10">' + this.lagnuage.nodata + '</td></tr>'
        this.table4 += '</table>'
        this.table4 += this.filllastpage(0, secnum)
        this.table4 += this.addfooter()
      }
    },
    //本日排程
    schedule(data) {
      // data = null
      var secnum = 21
      var startstring = this.table5 //tabletitle
      if (data != null) {
        data.sort((a, b) => naturalCompare(a.scheduleId, b.scheduleId))
        //資歷料少於一頁
        if (data.length < secnum) {
          data.forEach((item, index) => {
            this.filltable5(item, index)
          })
          this.table5 += '</table>'
          this.table5 += this.filllastpage(secnum, secnum - data.length)
        } else {
          //資歷料大於一頁
          data.forEach((item, index) => {
            if (index % secnum == 0 && index != 0) {
              //頁滿
              this.table5 += '</table>'
              this.table5 += this.addfooter()
              this.table5 +=
                this.headertag +
                '<h2 style="margin: 0px">4.' +
                this.lagnuage.schedules_index +
                '</h2><h6 class="gap">111</h6>'
              this.table5 += startstring
            }
            this.filltable5(item, index)
          })
          this.table5 += '</table>'
          this.table5 += this.filllastpage(secnum, secnum - ((data.length - secnum) % secnum))
        }
        this.table5 += this.addlastfooter()
      } else {
        this.table5 += '<tr><td colspan="10">' + this.lagnuage.nodata + '</td></tr>'
        this.table5 += '</table>'
        this.table5 += this.filllastpage(0, secnum)
        this.table5 += this.addlastfooter()
      }
    },
    //table5塞資料
    filltable5(data) {
      //分隔線
      // if (data.scheduleId == 'nulldata') {
      //   this.table5 +=
      //     '<tr ><td style="height:0px!important;background-color:black;">' +
      //     '</td><td style="height:0px!important;background-color:black;">' +
      //     '</td><td style="height:0px!important;background-color:black;">' +
      //     '</td><td style="height:0px!important;background-color:black;">' +
      //     '</td><td style="height:0px!important;background-color:black;">' +
      //     '</td><td style="height:0px!important;background-color:black;">' +
      //     '</td></tr>'
      // } else {
      this.table5 +=
        '<tr><td>' +
        data.scheduleId +
        '</td><td>' +
        data.machineNumber +
        '</td><td>' +
        data.moldNumber +
        '</td><td>' +
        this.dealThousands('num', Math.round(data.planNumber)) +
        '</td><td>' +
        this.timeStampToStringFunc(data.startTime, 'yyyy-mm-dd hh:mm') +
        '</td><td>' +
        this.timeStampToStringFunc(data.endTime, 'yyyy-mm-dd hh:mm') +
        '</td></tr>'
      // }
    },

    //table4塞資料
    filltable4(data) {
      this.table4 +=
        '<tr><td>' +
        data.MachineNumber +
        '</td><td style="background-color: ' +
        this.setbackgroundcolor(data.Today) +
        ';-webkit-print-color-adjust: exact;">' +
        Math.round(data.Today) +
        '</td><td style="background-color: ' +
        this.setbackgroundcolor(data.OneDayBefore) +
        ';-webkit-print-color-adjust: exact;">' +
        Math.round(data.OneDayBefore) +
        '</td><td style="background-color: ' +
        this.setbackgroundcolor(data.TwoDayBefore) +
        ';-webkit-print-color-adjust: exact;">' +
        Math.round(data.TwoDayBefore) +
        '</td><td style="background-color: ' +
        this.setbackgroundcolor(data.ThreeDayBefore) +
        ';-webkit-print-color-adjust: exact;">' +
        Math.round(data.ThreeDayBefore) +
        '</td><td style="background-color: ' +
        this.setbackgroundcolor(data.OneWeekBefore) +
        ';-webkit-print-color-adjust: exact;">' +
        Math.round(data.OneWeekBefore) +
        '</td><td style="background-color: ' +
        this.setbackgroundcolor(data.OneMonthBefore) +
        ';-webkit-print-color-adjust: exact;">' +
        Math.round(data.OneMonthBefore) +
        '</td><td>' +
        this.shortturnfunc(data) +
        '</td><td>' +
        this.longturnfunc(data) +
        '</td></tr>'
    },
    //table3塞資料
    filltable3(data) {
      this.table3 +=
        '<tr><td>' +
        data.MachineNumber +
        '</td><td style="background-color: ' +
        this.setbackgroundcolor(data.Today) +
        ';-webkit-print-color-adjust: exact;">' +
        Math.round(data.Today) +
        '</td><td style="background-color: ' +
        this.setbackgroundcolor(data.OneDayBefore) +
        ';-webkit-print-color-adjust: exact;">' +
        Math.round(data.OneDayBefore) +
        '</td><td style="background-color: ' +
        this.setbackgroundcolor(data.TwoDayBefore) +
        ';-webkit-print-color-adjust: exact;">' +
        Math.round(data.TwoDayBefore) +
        '</td><td style="background-color: ' +
        this.setbackgroundcolor(data.ThreeDayBefore) +
        ';-webkit-print-color-adjust: exact;">' +
        Math.round(data.ThreeDayBefore) +
        '</td><td style="background-color: ' +
        this.setbackgroundcolor(data.OneWeekBefore) +
        ';-webkit-print-color-adjust: exact;">' +
        Math.round(data.OneWeekBefore) +
        '</td><td style="background-color: ' +
        this.setbackgroundcolor(data.OneMonthBefore) +
        ';-webkit-print-color-adjust: exact;">' +
        Math.round(data.OneMonthBefore) +
        '</td><td>' +
        this.shortturnfunc(data) +
        '</td><td>' +
        this.longturnfunc(data) +
        '</td></tr>'
    },
    //table2塞資料
    filltable2(data) {
      this.table2 +=
        '<tr><td>' +
        data.MachineNumber +
        '</td><td style="background-color: ' +
        this.setbackgroundcolor(data.Today) +
        ';-webkit-print-color-adjust: exact;">' +
        Math.round(data.Today) +
        '</td><td style="background-color: ' +
        this.setbackgroundcolor(data.OneDayBefore) +
        ';-webkit-print-color-adjust: exact;">' +
        Math.round(data.OneDayBefore) +
        '</td><td style="background-color: ' +
        this.setbackgroundcolor(data.TwoDayBefore) +
        ';-webkit-print-color-adjust: exact;">' +
        Math.round(data.TwoDayBefore) +
        '</td><td style="background-color: ' +
        this.setbackgroundcolor(data.ThreeDayBefore) +
        ';-webkit-print-color-adjust: exact;">' +
        Math.round(data.ThreeDayBefore) +
        '</td><td style="background-color: ' +
        this.setbackgroundcolor(data.OneWeekBefore) +
        ';-webkit-print-color-adjust: exact;">' +
        Math.round(data.OneWeekBefore) +
        '</td><td style="background-color: ' +
        this.setbackgroundcolor(data.OneMonthBefore) +
        ';-webkit-print-color-adjust: exact;">' +
        Math.round(data.OneMonthBefore) +
        '</td><td>' +
        this.shortturnfunc(data) +
        '</td><td>' +
        this.longturnfunc(data) +
        '</td></tr>'
    },
    //table1塞資料
    filltable1(data) {
      //分隔線
      // if (data.machineNumber == 'nulldata') {
      //   this.table5 +=
      //     '<tr ><td style="height:0px!important;background-color:black;">' +
      //     '</td><td style="height:0px!important;background-color:black;">' +
      //     '</td><td style="height:0px!important;background-color:black;">' +
      //     '</td><td style="height:0px!important;background-color:black;">' +
      //     '</td><td style="height:0px!important;background-color:black;">' +
      //     '</td><td style="height:0px!important;background-color:black;">' +
      //     '</td></tr>'
      // } else {
      var OEE = (data.a * data.p * data.qualifiedRatio) / 10000
      var OES = (data.a * data.p * data.s) / 10000
      this.table1 +=
        '<tr><td>' +
        data.scheduleId +
        // index +
        '</td><td>' +
        data.machineNumber +
        '</td><td>' +
        this.dealThousands('num', Math.round(data.planNumber)) +
        '</td><td>' +
        this.dealThousands('num', Math.round(data.accmulateNumber)) +
        '</td><td>' +
        this.dealThousands('num', Math.round(data.storageNumber)) +
        '</td><td style="background-color: ' +
        this.setbackgroundcolor(data.storageRatio) +
        ';-webkit-print-color-adjust: exact;">' +
        Math.round(data.storageRatio) +
        '</td><td style="background-color: ' +
        this.setbackgroundcolor(data.qualifiedRatio) +
        ';-webkit-print-color-adjust: exact;">' +
        Math.round(data.qualifiedRatio) +
        '</td><td>' +
        this.timestampdatetime(data.remainTime / 1000) +
        '</td><td style="background-color: ' +
        this.setbackgroundcolor((OEE * 100) / 100) +
        ';-webkit-print-color-adjust: exact;">' +
        Math.round(OEE * 100) / 100 +
        '</td><td style="background-color: ' +
        this.setbackgroundcolor((OES * 100) / 100) +
        ';-webkit-print-color-adjust: exact;">' +
        Math.round(OES * 100) / 100 +
        '</td>' +
        '<td style="background-color: ' +
        this.setbackgroundcolor((data.a * 100) / 100) +
        ';-webkit-print-color-adjust: exact;">' +
        Math.round(data.a * 10) / 10 +
        '</td>' +
        '<td style="background-color: ' +
        this.setbackgroundcolor((data.p * 100) / 100) +
        ';-webkit-print-color-adjust: exact;">' +
        Math.round(data.p * 10) / 10 +
        '</td>' +
        '<td style="background-color: ' +
        this.setbackgroundcolor((data.s * 100) / 100) +
        ';-webkit-print-color-adjust: exact;">' +
        Math.round(data.s * 10) / 10 +
        '</td>' +
        '</tr>'
      // }
    },
    /********************製造指標分類*************************** */
    /********************製造指標分類*************************** */
    /********************製造指標分類*************************** */

    // //製造指標分類
    // sortorder(data) {
    //   console.log(data)

    //   var data6 = [] //其他
    //   var data5 = [] //中止
    //   var data4 = [] //任務中
    //   var data3 = [] //已完成
    //   data.forEach(item => {
    //     if (item.statue == 3) {
    //       data3.push(item)
    //     } else if (item.statue == 4) {
    //       data4.push(item)
    //     } else if (item.statue == 5) {
    //       data5.push(item)
    //     } else if (item.statue == 6) {
    //       data6.push(item)
    //     }
    //   })

    //   // for (var i = 0; i < data.length; i++) {
    //   //   if (data[i].scheduleId != '') {
    //   //     data1.push(data[i])
    //   //   } else {
    //   //     data2.push(data[i])
    //   //   }
    //   // }

    //   // for (var i = 0; i < data1.length; i++) {
    //   //   if (data1[i].remainTime == 0) {
    //   //     data3.push(data1[i])
    //   //   } else {
    //   //     data4.push(data1[i])
    //   //   }
    //   // }
    //   // //畫線
    //   // if (data3.length != 0) {
    //   //   data3.push('')
    //   // }
    //   // for (var i = 0; i < data4.length; i++) {
    //   //   data3.push(data4[i])
    //   // }
    //   // //畫線
    //   // if (data4.length != 0) {
    //   //   data3.push('')
    //   // }
    //   // // data3.push("")
    //   // for (var i = 0; i < data2.length; i++) {
    //   //   data3.push(data2[i])
    //   // }
    //   this.sortorderdata = data3
    //   this.sortorderdata_scheduled = data4
    // },
    // /********************製造指標分類*************************** */
    // /********************製造指標分類*************************** */
    // /********************製造指標分類*************************** */
    // /*****************本日排程處理****************** */
    // /*****************本日排程處理****************** */
    // /*****************本日排程處理****************** */
    // /*****************本日排程處理****************** */
    // //當日排程分類
    // sortschedule(runningdata, data) {
    //   data = data.sort(function(a, b) {
    //     return a.machineNumber > b.machineNumber ? 1 : -1
    //   })

    //   var data1 = [] //進行中排程
    //   var data2 = [] //未進行中排程

    //   //取進行中排程
    //   for (var i = 0; i < runningdata.length; i++) {
    //     for (var j = 0; j < data.length; j++) {
    //       if (data[j].scheduleId == runningdata[i].scheduleId) {
    //         data1.push(data[j])
    //       }
    //     }
    //   }
    //   //取未進行排程
    //   data2 = listDifference(data, data1)
    //   //依開始時間排序
    //   // data1 = data1.sort(function (a, b) {
    //   //     return a.startTime > b.startTime ? 1 : -1;
    //   // });
    //   // data2 = data2.sort(function (a, b) {
    //   //     return a.startTime > b.startTime ? 1 : -1;
    //   // });
    //   //畫線
    //   if (data1.length != 0) {
    //     data1.push('')
    //   }
    //   for (var i = 0; i < data2.length; i++) {
    //     data1.push(data2[i])
    //   }
    //   return data1
    // },
    // // 差集
    // listDifference(x, y) {
    //   let clone = x.slice(0)
    //   for (let i = 0; i < y.length; i++) {
    //     let temp = y[i]
    //     for (let j = 0; j < clone.length; j++) {
    //       // 普通数组 (temp === clone[j])
    //       if (temp.scheduleId === clone[j].scheduleId) {
    //         clone.splice(j, 1)
    //       }
    //     }
    //   }
    //   return listRemoveRepeat(clone)
    // },
    // // 去重
    // listRemoveRepeat(x) {
    //   let result = []
    //   for (let i = 0; i < x.length; i++) {
    //     let flag = true
    //     let temp = x[i]
    //     for (let j = 0; j < result.length; j++) {
    //       // 普通数组 (temp === result[j])
    //       if (temp.scheduleId === result[j].scheduleId) {
    //         flag = false
    //         break
    //       }
    //     }
    //     if (flag) {
    //       result.push(temp)
    //     }
    //   }
    //   return result
    // },
    // /*****************本日排程處理****************** */
    // /*****************本日排程處理****************** */
    // /*****************本日排程處理****************** */
    // /*****************本日排程處理****************** */
    //長期統計
    longturnfunc(data) {
      var total_count = 0
      var maxvalue = data.Today + 2
      var minvalue = data.Today - 2

      if (minvalue > data.OneMonthBefore) {
        total_count += 2
      } else if (maxvalue < data.OneMonthBefore) {
        total_count -= 2
      }

      if (minvalue > data.OneWeekBefore) {
        total_count += 1
      } else if (maxvalue < data.OneWeekBefore) {
        total_count -= 1
      }

      return this.totalcounttostring(total_count)
    },
    //短期統計
    shortturnfunc(data) {
      var total_count = 0
      var maxvalue = data.Today + 2
      var minvalue = data.Today - 2

      if (minvalue > data.OneDayBefore) {
        total_count += 1
      } else if (maxvalue < data.OneDayBefore) {
        total_count -= 1
      }

      if (minvalue > data.TwoDayBefore) {
        total_count += 1
      } else if (maxvalue < data.TwoDayBefore) {
        total_count -= 1
      }

      if (minvalue > data.ThreeDayBefore) {
        total_count += 1
      } else if (maxvalue < data.ThreeDayBefore) {
        total_count -= 1
      }

      return this.totalcounttostring(total_count)
    },
    //設定Table表格顏色
    setbackgroundcolor(value) {
      if (this.redboundary == 0 && this.yellowboundary == 0) {
        return 'white'
      }
      if (value < this.redboundary) {
        return 'red;color:white;'
      } else if (value > this.yellowboundary) {
        return 'white'
      } else {
        return 'yellow'
      }
    },
    // 趨勢轉成箭頭
    totalcounttostring(num) {
      var total_string = ''
      switch (num) {
        case -3:
          total_string = '↓↓↓'
          break
        case -2:
          total_string = '↓↓'
          break
        case -1:
          total_string = '↓'
          break
        case 0:
          total_string = '---'
          break
        case 1:
          total_string = '↑'
          break
        case 2:
          total_string = '↑↑'
          break
        case 3:
          total_string = '↑↑↑'
          break
      }
      return total_string
    },
    //統計指標圖
    drawchart(data) {
      //M
      if (data.order == null) {
        var M = 0
      } else {
        var M = this.orderM(data.order)
      }
      // A
      if (data.machine == null) {
        var A = 0
      } else {
        var A = this.equipmentA(data.machine)
      }
      // P
      if (data.efficiency == null) {
        var P = 0
      } else {
        var P = this.efficiencyP(data.efficiency, data.machine)
      }
      // Q
      if (data.order == null) {
        var Q = 0
      } else {
        var Q = this.orderQ(data.order)
      }
      // S
      if (data.stablility == null) {
        var S = 0
      } else {
        var S = this.stablilityS(data.stablility, data.machine)
      }

      this.UAPQ('M', Math.round(M * 10) / 10)
      this.UAPQ('A', Math.round(A * 10) / 10)
      this.UAPQ('P', Math.round(P * 10) / 10)
      this.UAPQ('Q', Math.round(Q * 10) / 10)
      this.UAPQ('S', Math.round(S * 10) / 10)

      this.titalM = Math.round(M)
      this.titalA = Math.round(A)
      this.titalP = Math.round(P)
      this.titalQ = Math.round(Q)
      this.titalS = Math.round(S)
    },
    //統計M
    orderM(data) {
      var total = 0
      for (var i = 0; i < data.length; i++) {
        if (data[i].planNumber != 0) {
          total += data[i].storageRatio
        }
      }

      return total / data.length
    },
    //統計A
    equipmentA(data) {
      var total = 0
      var num = 0
      for (var i = 0; i < data.length; i++) {
        if (data[i].Today > 100) {
          total += 100
          num++
        } else if (data[i].Today <= 0) {
          total += 0
        } else {
          total += data[i].Today
          num++
        }
      }
      if (total == 0 || num == 0) {
        return 0
      }
      return total / num
    },
    //統計P
    efficiencyP(data, dataA) {
      var total = 0
      var totalA = 0
      for (var i = 0; i < data.length; i++) {
        if (data[i].Today <= 0) {
          total += 0
          totalA += 0 //dataA[i].Today
        } else {
          total += data[i].Today * dataA[i].Today

          totalA += dataA[i].Today
        }
      }
      if (total == 0 || totalA == 0) {
        return 0
      }
      return total / totalA
    },
    //統計Q
    orderQ(data) {
      var total = 0
      for (var i = 0; i < data.length; i++) {
        if (data[i].qualifiedRatio > 100) {
          total += 100
        } else if (data[i].qualifiedRatio < 0) {
          total += 0
        } else {
          total += data[i].qualifiedRatio
        }
      }
      return total / data.length
    },
    //統計S
    stablilityS(data, dataA) {
      var total = 0
      var totalA = 0
      for (var i = 0; i < data.length; i++) {
        if (data[i].Today <= 0) {
          total += 0
          totalA += dataA[i].Today
        } else {
          total += data[i].Today * dataA[i].Today

          totalA += dataA[i].Today
        }
      }
      if (total == 0 || totalA == 0) {
        return 0
      }
      return total / totalA
    },
    /************************** */
    /************************** */
    /************************** */
    //渲染後!!重要!!
    test() {
      console.log('AHAHAAAAA')
      this.show = false
    },
    /************************** */
    /************************** */
    UAPQ(type, datavalue) {
      var size = 65
      var thickness = 23
      var classname = '#chart' + type
      this.$(classname).empty()

      var color = d3.scale
        .linear()
        .domain([0, 50, 100])
        .range(['#db2828', '#fbbd08', '#21ba45'])
      // .domain([0, 17, 33, 50, 67, 83, 100])
      // .range(['#db4639', '#db7f29', '#d1bf1f', '#92c51b', '#48ba17', '#12ab24', '#0f9f59']);

      var arc = d3.svg
        .arc()
        .innerRadius(size - thickness)
        .outerRadius(size)
        .startAngle(-Math.PI / 2)

      var svg = d3
        .select(classname)
        .append('svg')
        .attr('width', size * 2)
        .attr('height', size + 20)
        .attr('class', 'gauge')

      var chart = svg.append('g').attr('transform', 'translate(' + size + ',' + size + ')')

      chart
        .append('path')
        .datum({
          endAngle: Math.PI / 2
        })
        .style('fill', '#ddd')
        .attr('d', arc)

      var foreground = chart
        .append('path')
        .datum({
          endAngle: -Math.PI / 2
        })
        .style('fill', '#db2828')
        .attr('d', arc)

      var value = svg
        .append('g')
        .attr('transform', 'translate(' + size + ',' + size * 0.9 + ')')
        .append('text')
        .text(0)
        .attr('text-anchor', 'middle')
        .attr('class', 'value')

      var scale = svg
        .append('g')
        .attr('transform', 'translate(' + size + ',' + (size + 15) + ')')
        .attr('class', 'scale')

      scale
        .append('text')
        .text(100)
        .attr('text-anchor', 'middle')
        .attr('x', size - thickness / 2)

      scale
        .append('text')
        .text(0)
        .attr('text-anchor', 'middle')
        .attr('x', -(size - thickness / 2))

      update(datavalue)

      function update(v) {
        var durationtime = 0
        var tempvalue = v.toString()
        if (v > 100) {
          v = 100
        }

        v = d3.format('.1f')(v)
        foreground
          .transition()
          .duration(durationtime) //動畫時間
          .style('fill', function() {
            return color(v)
          })
          .call(arcTween, v)

        value
          .transition()
          .duration(durationtime) //動畫時間
          .call(textTween, Math.round(tempvalue * 10) / 10)
      }

      function arcTween(transition, v) {
        var newAngle = (v / 100 - 0.5) * Math.PI
        // var newAngle = (v / 100) * Math.PI - Math.PI / 2
        transition.attrTween('d', function(d) {
          var interpolate = d3.interpolate(d.endAngle, newAngle)
          return function(t) {
            d.endAngle = interpolate(t)
            return arc(d)
          }
        })
      }

      function textTween(transition, v) {
        transition.tween('text', function() {
          var interpolate = d3.interpolate(this.innerHTML, v),
            split = (v + '').split('.'),
            round = split.length > 1 ? Math.pow(10, split[1].length) : 1

          return function(t) {
            this.style.fontSize = '1.5rem'
            // var phonewindow = document.documentElement.clientHeight //取得螢幕高度for手機
            // if (phonewindow < 425) {
            //   this.style.fontSize = '6vh'
            // } else {
            //   this.style.fontSize = '2.5vh'
            // }

            this.innerHTML =
              d3.format('.f')(Math.round(interpolate(t) * round) / round) + '<tspan>%</tspan>'
          }
        })
      }
    },
    //設定語系
    setlanguage(value) {
      var zntw = {
        manufacture_chart: '製造指標', //製造指標
        equipment_chart: '設備指標', //設備指標
        efficiency_chart: '效率指標', //效率指標
        efficiency1_chart: '良率指標', //良率指標
        stability_chart: '穩定指標', //穩定指標
        manufacture_index: '製造指標', //1.製造指標
        equipment_index: '設備指標', //2.設備指標
        efficiency_index: '效率指標', //3.效率指標
        stability_index: '穩定指標', //4.穩定指標
        schedules_index: '本日排程', //5.本日排程
        reportdate: '報表日期', //報表日期
        downdtime: '下載日期', //下載日期

        plan_number: '計畫產量', //計畫產量
        production_number: '累積數量', //累積數量
        storage_number: '入庫量', //入庫量
        storage_rate: '入庫率', //入庫率
        storage_yieldrate: '良率', //入庫良率(Q)
        remaining_time: '餘工時', //餘工時
        report_manufacture_number: '製令編號', //製令編號
        report_machine_number: '設備編號', //設備編號
        d_day: '當日指標', //當日指標
        d_day_1: '前一日', //前一日
        d_day_2: '前二日', //前二日
        d_day_3: '前三日', //前三日
        d_day_7: '前七日', //前七日
        d_day_30: '前三十日', //前三十日
        short_tern: '短期趨勢', //短期趨勢
        logn_tern: '長期趨勢', //長期趨勢
        report_schedule_number: '排程編號', //排程編號
        report_mold_number: '模具編號', //模具編號
        plan_molds: '計畫模次', //計畫模次
        nodata: '無資料', //無資料

        mon1: '一', //一
        tue1: '二', //二
        wed1: '三', //三
        thu1: '四', //四
        fri1: '五', //五
        sat1: '六', //六
        sun1: '日', //日

        employee_start_time: '開始時間', //開始時間
        employee_end_time: '結束時間' //結束時間
      }
      var english = {
        manufacture_chart: 'Manufacture', //製造指標
        equipment_chart: 'Machine', //設備指標
        efficiency_chart: 'Efficiency', //效率指標
        efficiency1_chart: 'Yield(FPY)', //良率指標
        stability_chart: 'Stability(Index)', //穩定指標
        manufacture_index: 'Manufacture Index', //1.製造指標
        equipment_index: 'Machine Index', //2.設備指標
        efficiency_index: 'Efficiency Index', //3.效率指標
        stability_index: 'Stability Index', //4.穩定指標
        schedules_index: 'Schedules', //5.本日排程
        reportdate: 'Date', //報表日期
        downdtime: 'Print Date', //下載日期

        plan_number: 'Plan Aty', //計畫產量
        production_number: 'Cumlative Qty', //生產量
        storage_number: 'Storage Qty', //入庫量
        storage_rate: 'Storage Rate', //入庫率
        storage_yieldrate: 'Qualified Rate', //入庫良率(Q)
        remaining_time: 'Time Remaining', //餘工時
        report_manufacture_number: 'Manufature Order Number', //製令編號
        report_machine_number: 'Machine Number', //設備編號
        d_day: 'D-Day', //當日指標
        d_day_1: 'D-1 Day', //前一日
        d_day_2: 'D-2 Day', //前二日
        d_day_3: 'D-3 Day', //前三日
        d_day_7: 'Last 7 days Average', //前七日
        d_day_30: 'Last 30 days Average', //前三十日
        short_tern: 'Short-term Trend', //短期趨勢
        logn_tern: 'Long-term Trend', //長期趨勢
        report_schedule_number: 'Schedule Number', //排程編號
        report_mold_number: 'Mold Number', //模具編號
        plan_molds: 'Plan Shots', //計畫模次
        nodata: 'N/A', //無資料
        mon1: 'Mon', //一
        tue1: 'Tue', //二
        wed1: 'Wed', //三
        thu1: 'Thu', //四
        fri1: 'Fri', //五
        sat1: 'Sat', //六
        sun1: 'Sun', //日

        employee_end_time: 'End Time', //結束時間
        employee_start_date: 'Start Date' //開始日期
      }
      this.lagnuage = zntw //預設中文
      if (value == 'English') {
        this.lagnuage = english // 英文
      }
    },
    //設定table title
    settable() {
      this.table1 =
        '<table style="border: 2px solid black;text-align:center;" width="100%"><tr><td class="tabletitle">' +
        this.lagnuage.report_schedule_number +
        '</td><td class="tabletitle">' +
        this.lagnuage.report_machine_number +
        '</td><td class="tabletitle">' +
        this.lagnuage.plan_number +
        '</td><td class="tabletitle">' +
        this.lagnuage.production_number +
        '</td><td class="tabletitle">' +
        this.lagnuage.storage_number +
        '</td><td class="tabletitle">' +
        this.lagnuage.storage_rate +
        '</td><td class="tabletitle">' +
        this.lagnuage.storage_yieldrate +
        '</td><td class="tabletitle">' +
        this.lagnuage.remaining_time +
        '</td> <td class="tabletitle">OEE</td><td class="tabletitle">OES</td><td class="tabletitle">A</td><td class="tabletitle">P</td><td class="tabletitle">S</td></tr>'
      this.table2 =
        '<table style="border: 2px solid black;text-align:center;" width="100%"><tr><td class="tabletitle">' +
        this.lagnuage.report_machine_number +
        '</td><td class="tabletitle">' +
        this.lagnuage.d_day +
        '</td><td class="tabletitle">' +
        this.lagnuage.d_day_1 +
        '</td><td class="tabletitle">' +
        this.lagnuage.d_day_2 +
        '</td><td class="tabletitle">' +
        this.lagnuage.d_day_3 +
        '</td><td class="tabletitle">' +
        this.lagnuage.d_day_7 +
        '</td><td class="tabletitle">' +
        this.lagnuage.d_day_30 +
        '</td><td class="tabletitle">' +
        this.lagnuage.short_tern +
        '</td> <td class="tabletitle">' +
        this.lagnuage.logn_tern +
        '</td></tr>'
      this.table3 =
        '<table style="border: 2px solid black;text-align:center;" width="100%"><tr><td class="tabletitle">' +
        this.lagnuage.report_machine_number +
        '</td><td class="tabletitle">' +
        this.lagnuage.d_day +
        '</td><td class="tabletitle">' +
        this.lagnuage.d_day_1 +
        '</td><td class="tabletitle">' +
        this.lagnuage.d_day_2 +
        '</td><td class="tabletitle">' +
        this.lagnuage.d_day_3 +
        '</td><td class="tabletitle">' +
        this.lagnuage.d_day_7 +
        '</td><td class="tabletitle">' +
        this.lagnuage.d_day_30 +
        '</td><td class="tabletitle">' +
        this.lagnuage.short_tern +
        '</td> <td class="tabletitle">' +
        this.lagnuage.logn_tern +
        '</td></tr>'
      this.table4 =
        '<table style="border: 2px solid black;text-align:center;" width="100%"><tr><td class="tabletitle">' +
        this.lagnuage.report_machine_number +
        '</td><td class="tabletitle">' +
        this.lagnuage.d_day +
        '</td><td class="tabletitle">' +
        this.lagnuage.d_day_1 +
        '</td><td class="tabletitle">' +
        this.lagnuage.d_day_2 +
        '</td><td class="tabletitle">' +
        this.lagnuage.d_day_3 +
        '</td><td class="tabletitle">' +
        this.lagnuage.d_day_7 +
        '</td><td class="tabletitle">' +
        this.lagnuage.d_day_30 +
        '</td><td class="tabletitle">' +
        this.lagnuage.short_tern +
        '</td> <td class="tabletitle">' +
        this.lagnuage.logn_tern +
        '</td></tr>'
      this.table5 =
        '<table style="border: 2px solid black;text-align:center;" width="100%"><tr><td class="tabletitle"> ' +
        this.lagnuage.report_schedule_number +
        '</td><td class="tabletitle">' +
        this.lagnuage.report_machine_number +
        '</td><td class="tabletitle">' +
        this.lagnuage.report_mold_number +
        '</td><td class="tabletitle">' +
        this.lagnuage.plan_molds +
        '</td><td class="tabletitle">' +
        this.lagnuage.employee_start_time +
        '</td><td class="tabletitle">' +
        this.lagnuage.employee_end_time +
        '</td></tr>'
    }
  }
}
</script>

<style scoped type="text/css">
.teset {
  background-color: aqua;
}
.flexible-navbar.navbar {
  display: none !important;
}
.toptext {
  height: 15px;
}
.subtext {
  height: 20px;
}
.headbody_page {
  height: 50px;
}
.headbody_page_firstpage {
  height: 200px;
}

.gauge {
  /* display: ; */
  align-items: center;
  justify-content: center;
}

.ex5-box {
  display: flex;
  align-items: center;
  justify-content: center;
}

#page {
  float: center;
}

.gap {
  opacity: 0;
}
.headercss >>> .gap {
  opacity: 0;
}
.tablecss >>> .gap {
  opacity: 0;
}

body {
  -webkit-print-color-adjust: exact;
  counter-reset: PageNumber;
}

.remainTimeapr {
  /* width: 1000px!important; */
  padding-right: 0px !important;
  padding-left: 0px !important;
}

.tablecss.tablecss >>> .tabletitle {
  background-color: #3d91bc !important;
  color: white !important;
  font-weight: bold;
  font-size: large;
}
.tablecss >>> td {
  border: 1px solid black;
  text-align: center;
  font-size: medium;
  height: 40px;
}
.always {
  page-break-after: always;
}
.always:last-child {
  page-break-after: auto;
}
/* style="border: 2px solid black;text-align:center;" width="100%" */

@media print {
  .print1 {
    width: 100%;
    align-items: center;
    padding-right: 1rem !important;
    padding-left: 0px !important;
    padding-top: 0px !important;
    padding-bottom: 0px !important;
    /* margin: 0; */
  }
  .always {
    page-break-after: always;
  }
  .always:last-child {
    page-break-after: auto;
  }
  .tablecss.tablecss >>> .tabletitle {
    background-color: #3d91bc !important;
    color: white !important;
    font-weight: bold;
    -webkit-print-color-adjust: exact;
  }
  .headbody_page {
    height: 50px;
  }

  .headercss >>> .ex5-box {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .tablecss >>> .ex5-box {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .remainTimeapr {
    /* width: 1000px!important; */
    padding-right: 0px !important;
    padding-left: 0px !important;
  }

  /* .table-bordered tr,
  td {
    border: 1px solid black !important;
  } */

  /* .table-bordered > thead > tr > th,
  .table-bordered > tbody > tr > th,
  .table-bordered > tfoot > tr > th,
  .table-bordered > thead > tr > td,
  .table-bordered > tbody > tr > td,
  .table-bordered > tfoot > tr > td {
    border: 1px solid black !important;
  } */
  /*
  .table td.redparent {
    background-color: red !important;
  } */

  /* .timeparent {
            width: 10vw
        } */

  /* .redclass {
    color: white !important;
  } */

  /* .table td.yellowparent {
    background-color: yellow !important;
  } */

  /* table {
    border: solid #000 !important;
    border-width: 1px 0 0 1px !important;
  }*/

  /* th,
  td {
    border: solid #000 !important;
    border-width: 0 1px 1px 0 !important;
  } */

  /* .total.first {
    border-top-style: solid;
    border-right-style: solid;
    border-left-style: solid;
    border-bottom-style: solid;
  } */

  /* .total.sec {
    border-top-style: solid;
    border-right-style: solid;
    border-left-style: solid;
    border-bottom-style: solid;
  } */

  /* .total1.first {
    border-top-style: solid;
    border-right-style: solid;
    border-left-style: solid;
  } */

  /* .total1.sec {
    border-top-style: solid;
    border-right-style: solid;
    border-left-style: solid;
  } */
}
@page {
  size: A4 portrait;
  margin-right: -20px;
  margin-left: -35px;
  margin-top: -30px;
  margin-bottom: 0px;
}
.total.first {
  border-top-style: solid;
  border-right-style: solid;
  border-left-style: solid;
  border-bottom-style: solid;
}

.total.sec {
  border-top-style: solid;
  border-right-style: solid;
  /* border-left-style: solid; */
  border-bottom-style: solid;
}

.total1.first {
  border-top-style: solid;
  border-right-style: solid;
  border-left-style: solid;
}

.total1.sec {
  border-top-style: solid;
  border-right-style: solid;
  /* border-left-style: solid; */
}

#totalconunt {
  width: 100%;
  display: -ms-grid;
  display: grid;
  -ms-grid-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  /* grid-row-gap: 10px; */
  margin-bottom: 15px;
  position: relative;
}

.headercss >>> #title-head {
  width: 100%;
  display: -ms-grid;
  display: grid;
  -ms-grid-columns: 1fr 1fr 1fr;
  grid-template-columns: 1fr 4fr 1fr;
  grid-row-gap: 20px;
  margin-bottom: 15px;
  position: relative;
}
.tablecss >>> #title-head {
  width: 100%;
  display: -ms-grid;
  display: grid;
  -ms-grid-columns: 1fr 1fr 1fr;
  grid-template-columns: 1fr 4fr 1fr;
  grid-row-gap: 20px;
  margin-bottom: 15px;
  position: relative;
}
.main-sidebar {
  display: none !important;
}

.main-header {
  display: none !important;
}

.main-footer {
  display: none !important;
}

.gauge .background1 {
  fill: #ddd;
}

/* .gauge .scale text {
  fill: #999;
  font-size: 0.75rem;
} */

.th-inner {
  background-color: #3d91bc;
  color: white;
}

.content-wrapper {
  margin: 0%;
  background-color: white;
  /* min-height:100%!important; */
}

.table-bordered tr,
td {
  border: 1px solid black;
}
/*
.table-bordered > thead > tr > th,
.table-bordered > tbody > tr > th,
.table-bordered > tfoot > tr > th,
.table-bordered > thead > tr > td,
.table-bordered > tbody > tr > td,
.table-bordered > tfoot > tr > td {
  border: 1px solid black;
} */
</style>
