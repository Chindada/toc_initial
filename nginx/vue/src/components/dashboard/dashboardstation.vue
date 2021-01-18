<template>
  <mdb-container fluid>
    <div v-show="false">
      <audio controls id="player">
        <source src="../../assets/alarmsound.wav" type="audio/mpeg" />
      </audio>
      <button @click="playAudio()" type="button">Play Audio</button>
      <button @click="pauseAudio()" type="button">Pause Audio</button>
    </div>
    <!-- *************** -->
    <!-- <h2>單站看版</h2> -->
    <!-- <h1>{{ machineobjectonboarddata }}</h1> -->
    <!-- *************** -->

    <section class="section">
      <row class="titleebar" style="padding:0px 15px 0px 15px">
        <mdb-card class="mb-2" style="width:100%">
          <mdb-card-body style="padding:0.5rem">
            <h4 class="text-center">
              <div class="onerow">
                <b-row>
                  <b-col style="margin:auto">
                    <b-form-select v-model="machineselect" @change="machineChange()">
                      <optgroup
                        v-for="(workshopitem, key) in workshopobjects"
                        :key="key"
                        :label="workshopitem.name"
                      >
                        <option
                          v-for="(object, key) in workshopitem.machindoption"
                          :key="key"
                          :value="object.value"
                          >{{ object.text }}</option
                        >
                      </optgroup>
                    </b-form-select>
                  </b-col>
                  <b-col cols="1" class="pcclass">
                    <mdb-btn
                      :disabled="beforeBtmDisable"
                      color="mdb-color"
                      @click="nextmachine(-1)"
                      type="button"
                      style="padding:0.4rem;float:left"
                      icon="chevron-left"
                    ></mdb-btn>
                    <mdb-btn
                      :disabled="afterBtmDisable"
                      color="mdb-color"
                      @click="nextmachine(1)"
                      type="button"
                      style="padding:0.4rem;float:left"
                      icon="chevron-right"
                    ></mdb-btn>
                  </b-col>
                  <b-col cols="2" style="margin:auto" class="pcclass">
                    <select
                      class="browser-default custom-select custom-select-sm"
                      v-model="modeselected"
                      style="margin:auto;height:38px"
                      label="Example label"
                      @change="optionchange()"
                    >
                      <option
                        v-for="(modeitem, key) in modeobject"
                        :key="key"
                        :value="modeitem.value"
                        >{{ modeitem.text }}</option
                      >
                    </select>
                  </b-col>
                  <b-col class="phoneclass" cols="2">
                    <mdb-btn
                      :disabled="beforeBtmDisable"
                      color="mdb-color"
                      @click="nextmachine(-1)"
                      type="button"
                      style="padding:0.4rem;float:left"
                      icon="chevron-left"
                    ></mdb-btn>
                    <mdb-btn
                      :disabled="afterBtmDisable"
                      color="mdb-color"
                      @click="nextmachine(1)"
                      type="button"
                      style="padding:0.4rem;float:left"
                      icon="chevron-right"
                    ></mdb-btn>
                  </b-col>
                  <b-col style="margin:auto" class="phoneclass">
                    <select
                      class="browser-default custom-select custom-select-sm"
                      v-model="modeselected"
                      style="margin:auto;height:38px"
                      label="Example label"
                      @change="optionchange()"
                    >
                      <option
                        v-for="(modeitem, key) in modeobject"
                        :key="key"
                        :value="modeitem.value"
                        >{{ modeitem.text }}</option
                      >
                    </select>
                  </b-col>

                  <b-col class="pcclass"></b-col>
                </b-row>
              </div>
              <div class="tworow">
                <b-row>
                  <b-col cols="9" style="margin:auto">
                    <b-form-select v-model="machineselect" @change="machineChange()">
                      <optgroup
                        v-for="(workshopitem, key) in workshopobjects"
                        :key="key"
                        :label="workshopitem.name"
                      >
                        <option
                          v-for="(object, key) in workshopitem.machindoption"
                          :key="key"
                          :value="object.value"
                          >{{ object.text }}</option
                        >
                      </optgroup>
                    </b-form-select>
                  </b-col>
                  <b-col cols="3" style="padding:0px">
                    <mdb-btn
                      :disabled="beforeBtmDisable"
                      color="mdb-color"
                      @click="nextmachine(-1)"
                      type="button"
                      style="padding:0.4rem;float:left"
                      icon="chevron-left"
                    ></mdb-btn>
                    <mdb-btn
                      :disabled="afterBtmDisable"
                      color="mdb-color"
                      @click="nextmachine(1)"
                      type="button"
                      style="padding:0.4rem;float:left"
                      icon="chevron-right"
                    ></mdb-btn>
                  </b-col>
                </b-row>
                <b-row>
                  <b-col cols="9" style="margin:auto">
                    <select
                      class="browser-default custom-select custom-select-sm"
                      v-model="modeselected"
                      style="margin:auto;height:38px"
                      label="Example label"
                      @change="optionchange()"
                    >
                      <option
                        v-for="(modeitem, key) in modeobject"
                        :key="key"
                        :value="modeitem.value"
                        >{{ modeitem.text }}</option
                      >
                    </select>
                  </b-col>
                  <b-col></b-col>
                </b-row>
              </div>
            </h4>
          </mdb-card-body>
        </mdb-card>
      </row>

      <mdb-row>
        <mdb-col style="padding-right:5px" class="col-md-5 rightcard">
          <!-- 卡片 -->
          <stationcard-components
            :machineobjectonboarddata="machineobjectonboarddata"
          ></stationcard-components>
          <!-- End 卡片 -->
          <!-- 下三個排程table -->
          <stationtable-components :nextschedule="nextschedule"></stationtable-components>

          <!-- end下三個排程table -->
        </mdb-col>

        <div class="col-md-7 leftcard">
          <!-- UAPQ指標 -->
          <stationUAPQ-components :fulldayUAPQ="fulldayUAPQ"></stationUAPQ-components>
          <!-- endUAPQ指標 -->

          <div class="card mb-2">
            <div class="card-body" style="padding-top:5px;padding-bottom:0px">
              <div ref="CTchart" style="height:365px;width:100%!important"></div>
            </div>
          </div>
          <div class="card mb-2">
            <div class="card-body gyrclass" style="padding-top:5px;padding-bottom:0px">
              <div ref="GYRchart" style="height:250px"></div>
            </div>
          </div>
        </div>
      </mdb-row>
    </section>
    <!-- /.Section: data tables -->
  </mdb-container>
</template>
<script>
import stationcard from '@/components/dashboard/stationcard'
import stationtable from '@/components/dashboard/stationtable'
import stationUAPQ from '@/components/dashboard/stationUAPQ'
// import stationtable from '@/components/dashboard/stationtable'
import * as d3 from 'd3'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import naturalCompare from 'string-natural-compare'
am4core.useTheme(am4themes_animated)
import { WorkShopAPI } from '@/plugins/basicapis.js'
import {
  TeepAPI,
  RecentsctAPI,
  GyrAPI,
  NextScheduleAPI,
  MachineStatusAPI,
  TaskkanbanAPI,
  RemoteInfoAPI
} from '@/plugins/dashboardapis.js'
export default {
  name: 'Dashboardv2',
  components: {
    'stationcard-components': stationcard,
    'stationtable-components': stationtable,
    'stationUAPQ-components': stationUAPQ
  },

  data() {
    var modeobject = [
      { value: 0, text: this.$t('efficiency_mode') }, //'效率指標' },
      { value: 1, text: this.$t('stability_mode') } //'穩定指標' }
    ]
    var machineobjectonboarddata = {
      accmulationQty: '0',
      color: this.color('gray'), //'#808080',
      id: 0,
      machineName: '',
      machineNumber: '',
      progress: 0,
      progresscolor: 'blue',
      leftup1: '',
      leftup2: '',
      leftdown: '',
      rightup: '',
      rightdown: '',
      middleone: '- / -',
      middletwo: '',
      middlethree: '0h 0m',
      middlefour: '0h 0m',
      showqtyandbar: false,
      status: 0,
      citclecolor: this.color('gray') //'#808080'
    }
    var machineobjectonboarddatanull = JSON.parse(JSON.stringify(machineobjectonboarddata))
    return {
      checkTask: false, //看板istasked
      modeselected: 0, //模式selected
      modeobject, //模式
      // myAudio,
      getmachineflag: true,
      getctflag: true,
      getflag: true,
      getUAPQ5minflag: true,
      getfulldayflag: true,
      getgyrflag: true,
      getscheduleflag: true,
      beforeBtmDisable: true,
      afterBtmDisable: false,
      machineobjectonboarddatanull,
      machineobjectonboarddata,
      machineselect: 1,
      timenum: 0,
      machineobjects: [],
      workshopobjects: [],
      fulldayUAPQ: {
        u: 0,
        a: 0,
        p: 0,
        q: 0
      },
      gyrdata: [],
      timer: '',
      nextschedule: [
        {
          scheduleSerial: '-',
          moldName: '-',
          startTime: '-',
          qty: '-',
          color: this.color('next_schedule_one') //'#D2F1FF'
        },
        { scheduleSerial: '-', moldName: '-', startTime: '-', qty: '-' },
        { scheduleSerial: '-', moldName: '-', startTime: '-', qty: '-' }
      ],

      machineid: ''
    }
  },
  created() {
    this.getworkshop()
    this.machineid = window.location.search.substring(4, window.location.search.length) //取得machineid
    this.getmachine(this.machineid, 1)
    if (this.machineid != '') {
      this.getct(this.machineid) //30 CT
      this.getUAPQ(this.machineid, 1) //UAPQ 5 min
      this.getnextthreeschedule(this.machineid) //下三個排程
      this.getgyr(this.machineid) //24hr GYR
      this.getUAPQ(this.machineid, 0) //UAPQfull
    }
  },
  mounted() {
    this.player = document.getElementById('player')
    this.iniCTchart()
    this.iniGYRchart()
    this.iniCTchart()
    this.getsystem()
    this.timer = setInterval(this.startpagetemp, 10000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    //checkTesk
    getsystem() {
      RemoteInfoAPI({}).then(
        res => {
          this.checkTask = res.data.checkTask //檢查任務啟用
        },
        error => {
          console.log(error)
        }
      )
    },
    //警報聲撥放
    playAudio() {
      this.player.loop = true
      this.player.play()
    },
    //警報聲停止
    pauseAudio() {
      this.player.pause()
    },
    //上下一台設備//-1上一台 ，1下一台
    nextmachine(mode) {
      var temptindex = 0
      for (var i = 0; i < this.machineobjects.length; i++) {
        if (this.machineid == this.machineobjects[i].value) {
          temptindex = i
          break
        }
      }
      temptindex += mode
      this.machineid = this.machineobjects[temptindex].value
      this.optionchange()
    },
    //選擇設備
    machineChange() {
      this.machineid = this.machineselect
      this.optionchange()
    },
    //初始化apge data
    optionchange() {
      this.timenum = 0
      clearInterval(this.timer)
      //初始化all
      this.chart.data = []
      this.CTchart.data = []
      this.nextschedule = [
        {
          scheduleSerial: '-',
          moldName: '-',
          startTime: '-',
          qty: '-',
          color: '#abd0e4'
        },
        { scheduleSerial: '-', moldName: '-', startTime: '-', qty: '-' },
        { scheduleSerial: '-', moldName: '-', startTime: '-', qty: '-' }
      ]
      this.machineobjectonboarddata = JSON.parse(JSON.stringify(this.machineobjectonboarddatanull))

      this.getmachine(this.machineid, 1) //卡片
      this.getct(this.machineid) //30 CT
      this.getUAPQ(this.machineid, 1) //UAPQ 5 min
      this.getnextthreeschedule(this.machineid) //下三個排程
      this.getgyr(this.machineid) //24hr GYR
      this.getUAPQ(this.machineid, 0) //UAPQfull

      this.setbeforafterbtmdisable()
      this.timer = setInterval(this.startpagetemp, 10000)
    },
    //設定上下一台按鈕disable
    setbeforafterbtmdisable() {
      var temptindex = 0
      var lasti = 0
      for (var i = 0; i < this.machineobjects.length; i++) {
        if (this.machineid == this.machineobjects[i].value) {
          temptindex = i
        }
        lasti = i
      }
      if (temptindex == 0) {
        this.beforeBtmDisable = true
        this.afterBtmDisable = false
      } else if (temptindex == lasti) {
        this.beforeBtmDisable = false
        this.afterBtmDisable = true
      } else {
        this.beforeBtmDisable = false
        this.afterBtmDisable = false
      }
    },
    //取得廠區
    getworkshop() {
      var access_token_val = this.$cookies.get('access_token')
      WorkShopAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(res => {
        if (res.data != null) {
          this.workshopobjects = res.data
          this.workshopobjects.forEach(item => {
            item.machindoption = []
          })
        }

        this.getmachine(this.machineid, 0)
      })
    },
    //ini data
    startpagetemp() {
      this.timenum++
      this.tensec()
      if (this.timenum == 30) {
        this.fivemin()
        this.timenum = 0
      }
    },
    //  getmachineflag: true,
    //       getctflag: true,
    //       getflag: true,
    //       getUAPQ5minflag: true,
    //       getfulldayflag: true,
    //       getgyrflag: true,

    //10秒call 一次
    tensec() {
      if (this.getmachineflag) {
        this.getmachineflag = false
        this.getmachine(this.machineid, 1) //卡片
      }
      if (this.getctflag) {
        this.getctflag = false
        this.getct(this.machineid) //30 CT
      }
      this.getUAPQ(this.machineid, 1) //UAPQ 5 min
    },
    //300秒call 一次
    fivemin() {
      if (this.getscheduleflag) {
        this.getscheduleflag = false
        this.getnextthreeschedule(this.machineid) //下三個排程
      }
      if (this.getgyrflag) {
        this.getgyrflag = false
        this.getgyr(this.machineid) //24hr GYR
      }

      this.getUAPQ(this.machineid, 0) //UAPQfull
    },
    //取得UAPQ
    getUAPQ(id, mode) {
      //5分鐘時間
      if (mode == 1) {
        var endtime = this.stringToTimestampFunc(new Date())
        var starttime = endtime - 300000
      }
      var access_token_val = this.$cookies.get('access_token')
      TeepAPI({
        headers: {
          access_token: access_token_val,
          id: id,
          mode: mode,
          startTime: starttime,
          endTime: endtime
        }
      }).then(
        res => {
          res.data.u = this.dealUAPQ(res.data.u)
          res.data.a = this.dealUAPQ(res.data.a)
          res.data.p = this.dealUAPQ(res.data.p)
          res.data.q = this.dealUAPQ(res.data.q)
          //全天
          if (mode == 0) {
            this.fulldayUAPQ = res.data
            //5分鐘
          } else {
            this.UAPQ('U', res.data.u, 0)
            this.UAPQ('A', res.data.a, 0)
            this.UAPQ('P', res.data.p, 0)
            this.UAPQ('Q', res.data.q, 0)

            this.UAPQ('U', res.data.u, 1)
            this.UAPQ('A', res.data.a, 1)
            this.UAPQ('P', res.data.p, 1)
            this.UAPQ('Q', res.data.q, 1)
          }
        },
        error => {
          console.log(error.responseJSON.response)
        }
      )
    },
    dealUAPQ(value) {
      if (value > 100) {
        value = 100
      }
      return value
    },
    // 30模次週期時間
    getct(id) {
      var access_token_val = this.$cookies.get('access_token')
      RecentsctAPI({
        headers: {
          access_token: access_token_val,
          id: id,
          number: 30
        }
      }).then(
        res => {
          this.getctflag = true

          if (res.data != null) {
            // var total = res.data.length
            let ctarray = []
            res.data.forEach((item, index) => {
              ctarray.push(item.cycleTime)
              item.Time = index + 1 //total - index
            })
            this.CTchart.data = res.data
            this.CTchart.yAxes.values[0].max = Math.max(...ctarray) * 1.25
            this.CTchart.yAxes.values[0].min = Math.min(...ctarray) * 0.75
          }
        },
        error => {
          this.getctflag = true
          console.log(error)
        }
      )
    },
    //24小時GYR
    getgyr(id) {
      var access_token_val = this.$cookies.get('access_token')
      GyrAPI({
        headers: {
          access_token: access_token_val,
          id: id
        }
      }).then(
        res => {
          this.getgyrflag = true
          if (res.data != null) {
            res.data.forEach(item => {
              item.Time = item.Time.substring(11, 13) + ':00'
            })
            this.chart.data = res.data
          }
        },
        error => {
          this.getgyrflag = true
          console.log(error)
        }
      )
    },
    //取得下三個排程
    getnextthreeschedule(id) {
      var access_token_val = this.$cookies.get('access_token')
      NextScheduleAPI({
        headers: {
          access_token: access_token_val,
          id: id,
          number: 3 //三個排程
        }
      }).then(
        res => {
          var tempobject
          var temparray = []
          var nextschedulearray = []
          var oeenowscheduleobject = []
          var oeenowscheduleobjectflag = false

          if (res.data != null) {
            res.data.forEach(item => {
              if (item.moldNumber.length > 50) {
                item.moldNumber = this.dealnameoverfloat(item.moldNumber, 50)
              }
              if (item.status == 2) {
                tempobject = JSON.parse(JSON.stringify(item))
                if (item.update) {
                  //OEE 當下排程
                  oeenowscheduleobject = item
                  oeenowscheduleobjectflag = true
                } else {
                  //OEE 非當下排程
                  temparray.push(item)
                }
              } else {
                nextschedulearray.push(item)
              }
            })
          }
          if (localStorage.getItem('version') == '"1"') {
            //OEE
            nextschedulearray = temparray
          }
          this.getscheduleflag = true
          // var nowtimestamp = this.stringToTimestampFunc(new Date()) //當下timestamp
          nextschedulearray = nextschedulearray.sort(function(a, b) {
            //依開始時間排序
            return a.startTime > b.startTime ? 1 : -1
          })
          if (localStorage.getItem('version') != '"1"') {
            //OEE+、IPS版本
            if (tempobject == undefined) {
              //當無當下排程補一筆
              // if (res.data[0].startTime > nowtimestamp) {
              nextschedulearray.unshift({
                scheduleSerial: '-',
                moldName: '-',
                moldNumber: '-',
                startTime: '-',
                qty: 0
              })
              if (nextschedulearray.length == 4) {
                nextschedulearray.splice(3, 1)
              }
              // }
            } else {
              nextschedulearray.unshift(tempobject)
            }
          } else {
            if (oeenowscheduleobjectflag) {
              //OEE有當下排程
              nextschedulearray.unshift(oeenowscheduleobject)
            } else {
              //OEE 無當下排程補值
              nextschedulearray.unshift({
                scheduleSerial: '-',
                moldName: '-',
                moldNumber: '-',
                startTime: '-',
                qty: 0
              })
            }
          }

          nextschedulearray.forEach(item => {
            item.qty = this.dealThousands('-', item.qty) //qty每千位加逗點

            //處理timestamp
            if (item.startTime != '-') {
              item.startTime = this.timeStampToStringFunc(item.startTime, 'yyyy-mm-dd hh:mm')
            }
          })

          this.nextschedule = nextschedulearray
          //補值
          if (this.nextschedule.length < 3) {
            var num = 3 - this.nextschedule.length
            for (var i = 0; i < num; i++) {
              nextschedulearray.push({
                scheduleSerial: '-',
                moldName: '-',
                startTime: '-',
                moldNumber: '-',
                qty: '-'
              })
            }
          }

          this.nextschedule[0].color = this.color('next_schedule_one') //設定第一筆顏色
          this.nextschedule = this.nextschedule.slice(0, 3)
        },
        error => {
          this.getscheduleflag = true
          console.log(error)
        }
      )
    },
    //取得設備
    getmachine(id, num) {
      if (num == 0) {
        id = ''
      }
      var access_token_val = this.$cookies.get('access_token')
      MachineStatusAPI({
        headers: {
          access_token: access_token_val,
          id: id
        }
      }).then(
        res => {
          this.getmachineflag = true
          this.setbeforafterbtmdisable()
          //取得設備列表

          if (num == 0) {
            this.machineobjects = []
            res.data.data.sort((a, b) => naturalCompare(a.machineNumber, b.machineNumber))
            res.data.data.forEach(item => {
              for (var i = 0; i < this.workshopobjects.length; i++) {
                if (item.workShopId == this.workshopobjects[i].id) {
                  this.workshopobjects[i].machindoption.push({
                    machineNumber: item.machineNumber,
                    value: item.id,
                    text:
                      this.$t('machine_number') +
                      ': ' +
                      // '編號 : ' +
                      item.machineNumber +
                      ' / ' +
                      // this.$t('machine_model') +
                      // ' 型號 : ' +
                      // ': ' +
                      item.machineModel
                  })
                }
              }
            })
            //根據work重新排序machineId
            this.workshopobjects.forEach(item => {
              // item.machindoption.sort((a, b) => naturalCompare(a.machineNumber, b.machineNumber))
              item.machindoption.forEach(item1 => {
                this.machineobjects.push(item1)
              })
            })
          } else {
            if (id == '') {
              if (res.data != null) {
                res.data.data.sort((a, b) => naturalCompare(a.machineNumber, b.machineNumber))
                this.machineobject = res.data.data[0]
                this.machineid = this.machineobject.id
                this.machineselect = this.machineobject.id

                // this.getscheduledata(this.machineid)
                this.getcard(this.machineid)
                this.getct(this.machineid) //30 CT
                this.getUAPQ(this.machineid, 1) //UAPQ 5 min
                this.getnextthreeschedule(this.machineid) //下三個排程
                this.getgyr(this.machineid) //24hr GYR
                this.getUAPQ(this.machineid, 0) //UAPQfull
              }
            } else {
              this.machineobject = res.data.data
              this.machineid = this.machineobject.id
              this.machineselect = this.machineid
              // this.getscheduledata(this.machineid)
              this.getcard(this.machineid)
            }
          }
        },
        error => {
          this.getmachineflag = true
          console.log(error)
        }
      )
    },
    //取得卡片
    getcard(id) {
      var access_token_val = this.$cookies.get('access_token')
      TaskkanbanAPI({
        headers: {
          'Cache-Control': 'no-cache',
          access_token: access_token_val,
          id: id
        }
      }).then(res => {
        if (res.data != null) this.dealdata(res.data[0])
      })
    },
    dealdata(data) {
      /***********測試************** */
      // data.errorFlag = true
      // data.alarmType = 2

      /************************* */

      //異常訊號，更改狀態為4，設定動畫
      if (data.errorFlag) {
        data.animation = true
        if (data.alarmType == 2) {
          //有勾選聲音
          this.playAudio()
        }
      } else {
        data.animation = false
        this.pauseAudio()
      }

      if (!this.checkTask) {
        data.scheduled = true
        data.tasked = true
      }
      //檢查任務啟用
      //閒置狀態下無排程且無任務顯示停機
      if (data.status == 3 && !data.scheduled && !data.tasked) {
        data.status = 2
      }

      this.machineobject = JSON.parse(JSON.stringify(this.machineobjectonboarddatanull))
      this.machineobject.animation = data.animation //閃爍
      this.machineobject.machineName = this.dealnameoverfloat(data.machineModel, 7) //設備名稱
      this.machineobject.machineNumber = this.dealnameoverfloat(data.machineNumber, 9) //設備編號
      this.machineobject.color = this.cardcolor(data.status) //標頭顏色
      if (
        data.status == 9 ||
        data.status == 10 ||
        data.status == 11 ||
        data.status == 12 ||
        data.status == 13 ||
        data.status == 14 ||
        data.status == 15
      ) {
        this.machineobject.leftdown = '-' //左下exqut
        this.machineobject.rightdown = '-' //右下QTY
        this.machineobject.middleone = this.errorstatus(data.status) //CT/SCT
        this.machineobject.middletwo = '' //Tr
        this.machineobject.middlethree = '' //剩餘時間
        this.machineobject.middlefour = '' //狀態持續時間

        this.machineobject.progress = 0 //進度條
        // this.machineobject.progresscolor = this.setprogresscolor(data.qty, data.taskQTY) //進度條顏色

        this.machineobject.rightup = this.dealnameoverfloat(data.materialAbbreviation, 7) //右上材料
        this.machineobject.leftup1 = this.dealPN(data.productNumbers, data.moldNumber) //左上 PN
        this.machineobject.citclecolor = this.color('gary') //圓圈顏色
      } else {
        this.machineobject.leftdown = this.dealThousands('-', data.taskQTY) //左下exqut
        this.machineobject.rightdown = this.dealThousands('-', data.qty) //右下QTY
        this.machineobject.middleone =
          this.dealCTSCTtime(data.cycleTime) + ' / ' + this.dealCTSCTtime(data.sct) //CT/SCT

        this.machineobject.middlethree = this.countremaintime(data.qty, data.taskQTY, data.sct) //剩餘時間
        this.machineobject.middlefour = this.timestampdatetime(data.continuedTime / 1000) //狀態持續時間
        if (data.tasked) {
          if (this.modeselected == 0) {
            //效率指標顯示tr
            this.machineobject.middletwo = this.dealCTSCTtime(data.planCycleTime) + ' sec' //Tr
          } else if (this.modeselected == 1) {
            //穩定指標隱藏tr
            this.machineobject.middletwo = ''
          }

          this.machineobject.citclecolor = this.cytr(
            data.cycleTime,
            data.sct,
            data.planCycleTime,
            data.moldGreenRange,
            data.moldYellowRange
          ) //圓圈顏色
          if (this.machineobject.color == this.color('gary')) {
            this.machineobject.progress = 0
          } else {
            this.machineobject.progress = this.countprogress(data.qty, data.taskQTY) //進度條
          }
        } else {
          if (this.modeselected == 0) {
            //效率指標顯示tr
            this.machineobject.middletwo = '- sec' //Tr
          } else if (this.modeselected == 1) {
            //穩定指標隱藏tr
            this.machineobject.middletwo = ''
          }

          this.machineobject.citclecolor = this.color('gary') //圓圈顏色
          this.machineobject.progress = 0
        }

        if (data.materialAbbreviation == null) {
          this.machineobject.rightup = '-' //右上原料簡稱
        } else {
          this.machineobject.rightup = this.dealnameoverfloat(data.materialAbbreviation, 15) //右上原料簡稱
        }
        this.machineobject.leftup1 = this.dealPN(data.productNumbers, data.moldNumber) //左上 PN
        if (this.machineobject.color == this.color('gary')) {
          this.machineobject.progress = 0
        } else {
          this.machineobject.progresscolor = this.setprogresscolor(data.qty, data.taskQTY) //進度條顏色
        }
        //停機圓圈顏色改為0
        if (data.status == 2) {
          this.machineobject.citclecolor = this.color('gary') //圓圈顏色
        }
      }
      this.machineobjectonboarddata = JSON.parse(JSON.stringify(this.machineobject))
    },

    //PN
    dealPN(productarray, moldnumber) {
      return this.dealnameoverfloat(moldnumber, 15)
    },
    //判斷效率
    cytr(cycletime, sct, tr, greenrange, yellowrange) {
      if (greenrange == 0) {
        greenrange = 0.1
      }
      if (yellowrange == 0) {
        yellowrange = 0.2
      }

      if (this.modeselected == 0) {
        if (cycletime == 0 || tr == 0) {
          return this.color('gary')
        }
        //效率指標
        var num = (tr / cycletime) * 100
      } else if (this.modeselected == 1) {
        if (cycletime == 0 || sct == 0) {
          return this.color('gary')
        }
        //穩定指標
        var num = (cycletime / sct) * 100
      }

      if (num == 0) {
        return this.color('gary')
      }
      if (num <= 100 * (greenrange + 1) && num >= 100 * (1 - greenrange)) {
        return this.color('green')
      } else if (num > 100 * (yellowrange + 1) || num < 100 * (1 - yellowrange)) {
        return this.color('red')
      } else {
        return this.color('yellow')
      }
    },

    //週期時間chart ini
    iniCTchart() {
      var chartCT = am4core.create(this.$refs.CTchart, am4charts.XYChart)
      var Ytitle = this.$t('ct_yaxis')
      var Xtitle = this.$t('ct_xaxis')
      chartCT.hiddenState.properties.opacity = 0
      chartCT.paddingRight = 20

      chartCT.data = []
      // Create axes
      var categoryAxis = chartCT.xAxes.push(new am4charts.CategoryAxis())

      categoryAxis.renderer.minGridDistance = 15 //x軸網格間距(顯示所有X軸title)，越大顯示越少

      // categoryAxis.renderer.labels.template.rotation = 25 //x軸標題傾斜度
      // categoryAxis.renderer.labels.template.horizontalCenter = 'left' //旋轉中心點
      categoryAxis.dataFields.category = 'Time'
      categoryAxis.renderer.grid.template.location = 0
      categoryAxis.title.text = Xtitle
      var valueAxis = chartCT.yAxes.push(new am4charts.ValueAxis())

      valueAxis.title.text = Ytitle

      // Create series
      var series = chartCT.series.push(new am4charts.StepLineSeries())
      series.dataFields.valueY = 'cycleTime'
      series.dataFields.categoryX = 'Time'
      series.strokeWidth = 5
      series.fill = am4core.color('Blue')
      series.tooltipText = '[bold]{valueY}[/]'
      series.interpolationDuration = 0

      var bullet = series.bullets.push(new am4charts.CircleBullet()) //點
      bullet.circle.radius = 3
      chartCT.cursor = new am4charts.XYCursor()
      chartCT.cursor.behavior = 'none'
      chartCT.cursor.lineY.disabled = true
      this.CTchart = chartCT
    },
    //GYR chart ini
    iniGYRchart() {
      var GYRchart = am4core.create(this.$refs.GYRchart, am4charts.XYChart)
      var Ytitle = this.$t('gyr_yaxis')
      // var Xtitle = '時間'
      var Green = this.$t('gyr_xaxis1')
      var Yellow = this.$t('gyr_xaxis2')
      var Red = this.$t('gyr_xaxis3')
      GYRchart.data = []
      var categoryAxis = GYRchart.xAxes.push(new am4charts.CategoryAxis())
      categoryAxis.renderer.minGridDistance = 50 //x軸網格間距(顯示所有X軸title)，越大顯示越少

      categoryAxis.dataFields.category = 'Time'
      categoryAxis.renderer.grid.template.location = 0
      categoryAxis.autoGridCount = true
      categoryAxis.gridCount = 5

      GYRchart.legend = new am4charts.Legend()
      GYRchart.cursor = new am4charts.XYCursor()
      GYRchart.cursor.behavior = 'none'

      // categoryAxis.title.text = Xtitle
      var valueAxis = GYRchart.yAxes.push(new am4charts.ValueAxis())
      valueAxis.renderer.inside = false //顯示Y軸數量在chart圖裡
      valueAxis.renderer.labels.template.disabled = false //顯示Y軸數量
      valueAxis.min = 0

      valueAxis.title.text = Ytitle //y軸名稱
      GYRchart.colors.list = [
        am4core.color(this.color('green')),
        am4core.color(this.color('yellow')),
        am4core.color(this.color('red'))
      ]
      this.createSeries('GreenProduction', Green, GYRchart)
      this.createSeries('YellowProduction', Yellow, GYRchart)
      this.createSeries('RedProduction', Red, GYRchart)
      this.chart = GYRchart
    },
    createSeries(field, name, chart) {
      // Set up series
      var series = chart.series.push(new am4charts.ColumnSeries())
      series.name = name
      series.dataFields.valueY = field
      series.dataFields.categoryX = 'Time'
      series.sequencedInterpolation = true

      // Make it stacked
      series.stacked = true

      // Configure columns
      series.columns.template.width = am4core.percent(60)
      series.columns.template.tooltipText = '[bold]{name}[/]\n[font-size:14px]{categoryX}: {valueY}'

      // Add label
      var labelBullet = series.bullets.push(new am4charts.LabelBullet())
      series.tooltipText = ' {valueY}'

      // labelBullet.label.text = "{valueY}";//顯示數量在長條圖內
      labelBullet.locationY = -0.1 //位置
      labelBullet.label.rotation = 340 //角度

      return series
    },

    UAPQ(type, datavalue, divid) {
      let size = 65
      let thickness = 25
      let idname = '#chartdiv' + type
      if (divid == 1) {
        idname = '#chartdiv1' + type
      }

      this.$(idname).empty()

      var color = d3.scale
        .linear()
        .domain([0, 50, 100])

        .range([this.color('red'), this.color('yellow'), this.color('green')])
      // .domain([0, 17, 33, 50, 67, 83, 100])
      // .range(['#db4639', '#db7f29', '#d1bf1f', '#92c51b', '#48ba17', '#12ab24', '#0f9f59']);

      var arc = d3.svg
        .arc()
        .innerRadius(size - thickness)
        .outerRadius(size)
        .startAngle(-Math.PI / 2)

      var svg = d3
        .select(idname)
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
          .call(textTween, v)
      }

      function arcTween(transition, v) {
        var newAngle = (v / 100) * Math.PI - Math.PI / 2
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
    }
  }
}
</script>
<style>
.el-progress-bar__outer {
  height: 4px !important;
}
</style>
<!-- Add 'scoped" attribute to limit CSS to this component only -->
<style scoped>
.table1 {
  border: 1px solid;
  color: white;
  padding-left: 0px;
  padding-right: 0px;
  max-height: 60px !important;
  height: 60px !important;
}
.progressline {
  margin-bottom: 1rem;
}
.tooltip1 {
  position: relative;
  background: rgb(61, 145, 188);
  color: white;
  height: 20px !important;
  width: 20px !important;
  font-size: 15px;
  text-align: center;
  border-radius: 50%;
  /* display: inline-block; */
  border-bottom: 1px dotted black;
  float: right;
}

.tooltip1 .tooltiptext1 {
  visibility: hidden;
  /* visibility: visible; */
  width: 190px;
  background: rgb(61, 145, 188);
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 6px;
  top: 15px;
  right: 105%;

  position: absolute;
  z-index: 1;
}

.tooltip1:hover .tooltiptext1 {
  visibility: visible;

  box-shadow: -2px 3px 2px 1px #cccccc;
}
.fulldayUAPQtitleclass {
  position: absolute;
  top: -10px;
  left: 1rem;
  margin: 0.2rem;
}
.fulldayUAPQclass {
  /*
  text-align: center;
  vertical-align: top; */
  font-size: 25.5px;
  position: absolute;
  top: -10px;
  right: 1rem;
  margin: 0.2rem;
}
.card-header {
  padding: 0.4rem 0.75rem;
  border-bottom: 0px;
}
.cascading-admin-card {
  margin-top: 0px;
  /* width: 600px; */
}
.headerclass {
  width: 100%;
  color: #fff;
  font-size: 1.1rem;
  position: absolute;
}

.headerclasstext {
  color: #fff;
  font-size: 1.1rem;
}
.rowclass {
  margin-bottom: 5px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(175px, 1fr));
  margin: 5px;
  margin-left: 0px;
}

.alignright {
  float: right;
}
.title-body {
  padding-top: 0px;
  padding-bottom: 0px;
}
.totoal-val {
  font-weight: bolder;
  text-align: center;
  margin-bottom: 0px;
}
.totoal-title {
  border-radius: 0px 0px 5px 5px;
  font-weight: bolder;
  color: #fff;
  text-align: center;
  padding-top: 0px;
  padding-bottom: 0px;
}

.circle {
  text-align: center;
  border: 10px solid green;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  width: 250px;
  height: 250px;

  margin: auto;
}
.md-progress .progress-bar {
  height: 100% !important;
}
.hideclass {
  opacity: 0;
}
.fullscreen-head {
  width: 100%;
  display: -ms-grid;
  display: grid;
  -ms-grid-columns: 145px 250px 1fr 250px 145px;
  grid-template-columns: 145px 250px 1fr 250px 145px;
  grid-row-gap: 10px;
  margin-bottom: 5px;
  /* height: 40px; */
  /* position: relative; */
}
.fullscreen-main-slogan {
  text-align: center;
  color: #000;
  font-size: 59px;
  font-weight: 900;
}
.fullscreen-main-time {
  margin: auto;
  color: #000;
  font-size: 30px;
  margin: auto;
  font-weight: 900;
}
.title-body.card-body {
  padding-right: 5px;
  padding-left: 5px;
}
@-webkit-keyframes fade {
  from {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.blink {
  color: red;
  animation: fade 500ms infinite;
}
.phoneclass {
  display: none;
}
.tworow {
  display: none;
}
/*手機直式 */
@media only screen and (max-width: 500px) and (max-height: 950px) and (orientation: portrait) {
  .onerow {
    display: none;
  }
  .tworow {
    display: block;
  }

  .container-fluid {
    padding: 0px;
    width: 100vw;
  }
  .col-md-7 {
    padding-right: 5px;
  }
  .titleebar {
    padding-right: 5px !important;
  }
  .card-body.gyrclass {
    /* padding-bottom: 50px !important; */
    margin-bottom: 50px !important;
  }
}
/*手機橫式 */
@media only screen and (max-width: 950px) and (max-height: 500px) and (orientation: landscape) {
  .onerow {
    display: block;
  }
  .tworow {
    display: none;
  }
  .pcclass {
    display: none;
  }
  .phoneclass {
    display: block;
  }
  .container-fluid {
    padding-left: 0px;
    padding-right: 30px;
    /* width: 100vw; */
  }
}

/*平板直式 */
@media screen and (min-width: 768px) and (max-width: 1024px) {
  .onerow {
    display: none;
  }
  .tworow {
    display: block;
  }

  .container-fluid {
    padding: 0px;
    width: 100vw;
  }
  .col-md-7.leftcard {
    padding-right: 5px;
    flex: 0 0 100%;
    max-width: 100%;
    -webkit-box-flex: 0;
  }
  .col-md-5.rightcard {
    padding-right: 5px;
    flex: 0 0 100%;
    max-width: 100%;
    -webkit-box-flex: 0;
  }
  .titleebar {
    padding-right: 5px !important;
  }
  .card-body.gyrclass {
    /* padding-bottom: 50px !important; */
    margin-bottom: 50px !important;
  }
}
/*平板橫式 */
@media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
  .onerow {
    display: block;
  }
  .tworow {
    display: none;
  }
  .pcclass {
    display: none;
  }
  .phoneclass {
    display: block;
  }
}
</style>
