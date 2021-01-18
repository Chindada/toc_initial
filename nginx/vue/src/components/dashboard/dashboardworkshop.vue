<template>
  <div>
    <div v-show="false">
      <audio controls id="player">
        <source src="../../assets/alarmsound.wav" type="audio/mpeg" />
      </audio>
      <button @click="playAudio()" type="button">Play Audio</button>
      <button @click="pauseAudio()" type="button">Pause Audio</button>
    </div>
    <fullscreen ref="fullscreen" @change="fullscreenChange" style="background:#eee">
      <div v-if="fullscreen" class="fullscreen-head">
        <img
          id="introduce_img"
          :src="fullscreenimg"
          width="80%"
          alt="User Image"
          style="margin:auto"
        />
        <div class="fullscreen-main-time">{{ this.pagetitle }}</div>
        <div class="fullscreen-main-slogan">AIoM Dashboard</div>

        <div class="fullscreen-main-time">{{ this.currentTime }}</div>
        <img
          id="introduce_img"
          src="../../assets/fullscreanAIOM.png"
          width="80%"
          alt="User Image"
          style="margin:auto"
        />
      </div>

      <mdb-container fluid>
        <div>
          <section>
            <mdb-row class="titlerowclass">
              <mdb-col style="margin:auto;padding:0">
                <mdb-card cascade class="cascading-admin-card totalcard">
                  <mdb-card-body class="title-body">
                    <h1 class="totoal-val">{{ totalstatus.total }}</h1>
                  </mdb-card-body>
                  <mdb-card-footer cascade class="totoal-title" :style="totalCardStyle('blue')">
                    <h3 style="margin-bottom:0rem">{{ $t('title_total') }}</h3>
                  </mdb-card-footer>
                </mdb-card>
              </mdb-col>
              <mdb-col style="margin:auto;padding:0">
                <mdb-card cascade class="cascading-admin-card totalcard">
                  <mdb-card-body class="title-body">
                    <h1 class="totoal-val">{{ totalstatus.running }}</h1>
                  </mdb-card-body>
                  <mdb-card-footer cascade class="totoal-title" :style="totalCardStyle('green')">
                    <h3 style="margin-bottom:0rem">{{ $t('title_running') }}</h3>
                  </mdb-card-footer>
                </mdb-card>
              </mdb-col>
              <mdb-col style="margin:auto;padding:0">
                <mdb-card cascade class="cascading-admin-card totalcard">
                  <mdb-card-body class="title-body">
                    <h1 class="totoal-val">{{ totalstatus.idle }}</h1>
                  </mdb-card-body>
                  <mdb-card-footer cascade class="totoal-title" :style="totalCardStyle('orange')">
                    <h3 style="margin-bottom:0rem">{{ $t('title_idle') }}</h3>
                  </mdb-card-footer>
                </mdb-card>
              </mdb-col>
              <mdb-col style="margin:auto;padding:0">
                <mdb-card cascade class="cascading-admin-card totalcard">
                  <mdb-card-body class="title-body">
                    <h1 class="totoal-val">{{ totalstatus.error }}</h1>
                  </mdb-card-body>
                  <mdb-card-footer cascade class="totoal-title" :style="totalCardStyle('red')">
                    <h3 style="margin-bottom:0rem">{{ $t('title_error') }}</h3>
                  </mdb-card-footer>
                </mdb-card>
              </mdb-col>
              <mdb-col style="margin:auto;padding:0">
                <mdb-card cascade class="cascading-admin-card totalcard">
                  <mdb-card-body class="title-body">
                    <h1 class="totoal-val">{{ totalstatus.stop }}</h1>
                  </mdb-card-body>
                  <mdb-card-footer cascade class="totoal-title" :style="totalCardStyle('gray')">
                    <h3 style="margin-bottom:0rem">{{ $t('title_shutdown') }}</h3>
                  </mdb-card-footer>
                </mdb-card>
              </mdb-col>
              <mdb-col class="nullcolDisplay" style="margin:auto"> </mdb-col>
              <!-- 選擇廠區 -->
              <mdb-col style="margin:auto">
                <select
                  class="browser-default custom-select custom-select-sm"
                  v-model="workshopselected"
                  style="margin:auto"
                  label="Example label"
                  @change="workshoponChange()"
                >
                  <option
                    v-for="(workshopitem, key) in workshopobject"
                    :key="key"
                    :value="workshopitem.value"
                    >{{ workshopitem.text }}</option
                  >
                </select>
              </mdb-col>
              <!-- end選擇廠區 -->
              <!-- 選擇模式 -->
              <mdb-col style="margin:auto">
                <select
                  class="browser-default custom-select custom-select-sm"
                  v-model="modeselected"
                  style="margin:auto"
                  label="Example label"
                  @change="workshoponChange()"
                >
                  <option
                    v-for="(modeitem, key) in modeobject"
                    :key="key"
                    :value="modeitem.value"
                    >{{ modeitem.text }}</option
                  >
                </select>
              </mdb-col>
              <!-- end選擇模式 -->
              <mdb-col style="margin:auto">
                <mdb-btn
                  size="sm"
                  v-if="carouselplay"
                  @click="stopcarousel"
                  icon="play"
                  color="success"
                ></mdb-btn>
                <mdb-btn
                  size="sm"
                  v-if="carouselstop"
                  @click="stopcarousel"
                  icon="stop"
                  color="danger"
                ></mdb-btn>
                <mdb-btn
                  class="mobileFullScreenDisplay"
                  v-if="!fullscreen"
                  type="button"
                  @click="toggle"
                  icon="arrows-alt"
                  size="sm"
                  style="font-size:1rem;background-color:#3d91bc!important;padding:0.5rem"
                ></mdb-btn>
              </mdb-col>
            </mdb-row>
          </section>

          <section class="my-1"></section>
          <div class="fullscreen-main-time" v-if="loading">Loading...</div>
          <!-- <div class="fullscreen-main-time" v-if="loading" style="text-align: center;">
            <img alt="loading" width="50%" src="../../assets/loading.gif" />
          </div>-->
          <!-- <section class="mb-3"> -->
          <mdb-row class="rowclass">
            <span :key="index" v-for="(members, index) in members" align="center">
              <!-- <a :href="members.url" style="color:black"> -->
              <router-link :to="members.url">
                <mdb-card
                  class="cascading-admin-card"
                  style="width:175px;margin-bottom: 1rem"
                  align="left"
                >
                  <!-- 閃爍 blink      "-->
                  <mdb-card-header
                    v-bind:style="{ backgroundColor: members.color }"
                    :class="{ headerclass: true, blink: members.animation }"
                  >
                    <span style="opacity: 0;">1</span>
                    <span style="opacity: 0;">1</span>
                  </mdb-card-header>
                  <!-- end閃爍 -->
                  <!-- title -->
                  <mdb-card-header class="headerclass">
                    <span>{{ members.machineNumber }}</span>
                    <span class="title-alignright">{{ members.machineName }}</span>
                  </mdb-card-header>
                  <!-- end title -->
                  <!-- 撐開header -->
                  <mdb-card-header class="headerclasstext">
                    <span style="opacity: 0;">1</span>
                    <span style="opacity: 0;">1</span>
                  </mdb-card-header>
                  <!-- end 撐開header -->
                  <mdb-card-body class="title-body">
                    <div>
                      <b-row>
                        <b-col style="width:80%;padding-right: 0px;white-space: nowrap;">
                          <div class>{{ members.leftup1 }}</div>
                        </b-col>

                        <b-col style="width:20%;">
                          <div class="alignright1" style="width:100%;">{{ members.rightup1 }}</div>
                        </b-col>
                      </b-row>
                    </div>
                    <!-- 圓圈 -->
                    <div class="circleparent">
                      <div
                        class="circle"
                        v-bind:style="{
                          borderColor: members.citclecolor
                        }"
                      ></div>
                    </div>
                    <!-- end圓圈 -->
                    <!-- 圈內內容 -->
                    <div class="circleparent">
                      <div class="circletext">
                        <span class="circlecont">{{ members.middleone }}</span>
                        <span class="circlecont">{{ members.middletwo }}</span>
                        <span class="circlecont">{{ members.middlethree }}</span>
                        <span class="circlecont">{{ members.middlefour }}</span>
                      </div>
                    </div>
                    <!-- end圈內內容 -->
                    <!-- 撐開卡片 -->
                    <div class>
                      <div class="circletext"></div>
                    </div>
                    <!-- end撐開卡片 -->
                    <div>
                      <b-row>
                        <b-col style="width:50%;padding-right: 0px;">
                          <div>{{ members.leftdown }}</div>
                        </b-col>

                        <b-col style="width:50%;">
                          <div
                            style="text-align:right"
                            class="alignright"
                            :class="{ hideclass: members.showqtyandbar }"
                          >
                            {{ members.rightdown }}
                          </div>
                        </b-col>
                      </b-row>
                    </div>
                    <!-- <div>{{ members.progress }}</div> -->
                    <!-- <mdb-progress
                      :progressid="members.machineId"
                      class="progressline"
                      :class="{ hideclass: members.showqtyandbar }"
                      :value="members.progress"
                      :color="members.progresscolor"
                      :style="progressColorfunc(members)"
                    /> -->
                    <el-progress
                      class="progressline"
                      :class="{ hideclass: members.showqtyandbar }"
                      :percentage="members.progress"
                      :color="members.progresscolor"
                      :show-text="false"
                    ></el-progress>
                  </mdb-card-body>
                </mdb-card>
              </router-link>
            </span>
            <span :key="index" v-for="(nullobject, index) in nullobject" align="center"></span>
          </mdb-row>
          <div style="opacity: 0">---</div>
          <div v-if="!fullscreen" style="opacity: 0">---</div>
          <div v-if="!fullscreen" style="opacity: 0">---</div>
        </div>

        <!-- </section> -->
      </mdb-container>
    </fullscreen>
  </div>
</template>

<script>
// import url from '@/router/index.js' //取得router裡SRV url
import { TaskkanbanAPI, RemoteInfoAPI } from '@/plugins/dashboardapis.js'

export default {
  name: 'Dashboardv1',
  components: {},
  data() {
    var timenum = 0
    var members = []
    var nullobject = []
    var totalstatus = {
      total: 0,
      running: 0,
      idle: 0,
      error: 0,
      stop: 0
    }
    var totalstatusnull = JSON.parse(JSON.stringify(totalstatus))
    // var temptotalstatus = JSON.parse(JSON.stringify(totalstatus));
    var modeobject = [
      { value: 0, text: this.$t('efficiency_mode') }, //'效率指標' },
      { value: 1, text: this.$t('stability_mode') } //'穩定指標' }
    ]
    return {
      checkTask: false, //看板istasked
      modeobject, //模式
      playsoundflag: false, //播放警報聲
      fullscreenimg: require('../../assets/client.png'),
      dashboard_frequency: 15,
      apifinish: true,
      carouselplay: false,
      carouselstop: false,
      carouselflag: true,
      loading: true,
      pagetitle: '',
      totalpage: 0, //
      currentpage: 1, //當前頁面
      localSRVtime: 0, //SRV與使用者時間差
      workshopobject: [],
      workshopselected: 0, //廠區selected
      modeselected: 0, //模式selected
      currentTime: '0',
      timenum,
      runningstyle: {
        backgroundColor: this.color('green'), //'#00a136',
        color: 'white'
      },
      idlestyle: {
        backgroundColor: this.color('orange'), //'#8b0000',
        color: 'white'
      },
      errorstyle: {
        backgroundColor: this.color('red'), //'#ff0000',
        color: 'white'
      },
      stopstyle: {
        backgroundColor: this.color('gray'), //'#ff0000',
        color: 'white'
      },
      backgroundcol: 'red',
      members,
      nullobject,
      totalstatus,
      totalstatusnull,
      fullscreen: false,
      timer: '',
      value: 0
    }
  },
  mounted() {
    this.player = document.getElementById('player')
    this.timer = setInterval(this.dealtimeticker, 1000)
  },
  created() {
    // this.getenvdata() //取得環境變數
    this.getsystem(-1)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    //系統時間、語言、checkTesk、廠區、系統設定for看版
    getsystem(num) {
      RemoteInfoAPI({}).then(
        res => {
          //初始化頁面
          if (num == -1) {
            this.checkTask = res.data.checkTask //檢查任務啟用
            res.data.settings.forEach(item => {
              //取得logo、輪播頻率
              if (item.parameter == 'dashboard_frequency') {
                this.dashboard_frequency = item.value
              }
              if (item.parameter == 'dashboard_logo') {
                this.fullscreenimg = item.value
              }
            })

            //設定廠區選單、title

            this.workshopobject = [{ value: '0', text: this.$t('all') }]
            if (res.data.workShops != null) {
              res.data.workShops.forEach(item => {
                if (this.wrokshopid == item.id) {
                  this.workshopselected = item.number
                  this.workshopName = '' + item.name + '' //中文20，
                }
                this.workshopobject.push({ value: item.number, text: item.name, id: item.id })
              })
              if (this.workshopName == '') {
                this.workshopName = 'AIoM Dashboard'
              }
              this.apifinish = false //暫時取消等待上次api 完成+++++
              this.getmachinedatanew(0)
            } else {
              this.workshopName = 'AIoM Dashboard'
            }
          }
          //設定時間
          var nowsystime = new Date().getTime()
          this.localSRV = nowsystime - res.data.timestamp
          var currentTime = new Date(res.data.timestamp)
          this.currentTime = this.timestamptotime(currentTime)
        },
        error => {
          console.log(error)
        }
      )
    },

    //輪播
    stopcarousel() {
      this.carouselflag = !this.carouselflag

      if (this.carouselflag) {
        //輪播
        this.carouselplay = false
        this.carouselstop = true
      } else {
        //停播
        this.carouselplay = true
        this.carouselstop = false
      }
    },
    //選擇車間
    workshoponChange() {
      this.timenum = 0
      this.carouselflag = true
      this.getsystem(-1)
      if (this.apifinish) {
        this.apifinish = false
        this.getmachinedatanew(0)
      }
      this.setcurrentTime()
      clearInterval(this.timer)
      this.timer = setInterval(this.dealtimeticker, 1000)
    },
    dealtimeticker() {
      this.timenum++
      if (this.timenum >= 1000) {
        this.timenum = 0
      }
      //全螢幕on
      if (this.fullscreen) {
        this.setcurrentTime()
        /********************************************** */

        if (this.totalpage > 1) {
          //切換廠區多於一頁輪播
          if (!this.carouselplay && !this.carouselstop) {
            this.carouselplay = false
            this.carouselstop = true
          }
          if (this.carouselflag) {
            //每_秒換頁
            if (this.timenum % this.dashboard_frequency == 0) {
              this.currentpage++
              if (this.currentpage == this.totalpage) {
                this.currentpage = 0
              }
            }
          }
        } else {
          //少於一頁無輪播
          this.carouselplay = false
          this.carouselstop = false
        }
        //每5秒getdata
        if (this.timenum % 5 == 0) {
          if (this.apifinish) {
            this.apifinish = false //暫時取消等待上次api 完成+++++
            this.getmachinedatanew(this.currentpage)
          }
        }
        /********************************************** */
        //全螢幕off
      } else {
        //每5秒getdata
        if (this.timenum % 5 == 0) {
          if (this.apifinish) {
            this.apifinish = false //暫時取消等待上次api 完成+++++

            this.getmachinedatanew(0)
          }
        }
      }
    },
    //設定全螢幕時間
    setcurrentTime() {
      //10分鐘對時
      if (this.timenum % 600 == 0) {
        this.getsystem()

        //一般時間顯示
      } else {
        var nowsystime = new Date().getTime() - this.localSRV
        this.currentTime = this.timestamptotime(nowsystime)
      }
    },
    timestamptotime(value) {
      var currentTime = new Date(value)
      var hour = currentTime.getHours()
      var min = currentTime.getMinutes()
      var sec = currentTime.getSeconds()
      var timeString =
        this.zeroPrefixer(hour) + ':' + this.zeroPrefixer(min) + ':' + this.zeroPrefixer(sec)
      return timeString
    },
    zeroPrefixer(num) {
      return (num < 10 ? '0' : '') + num
    },
    //取得設備
    getmachinedatanew(page) {
      var workShopId
      if (this.workshopselected == 0) {
        workShopId = ''
      } else {
        workShopId = this.workshopselected
      }
      this.temptotalstatus = JSON.parse(JSON.stringify(this.totalstatusnull)) //統計機台歸零
      this.value++
      var access_token_val = this.$cookies.get('access_token')
      TaskkanbanAPI({
        headers: {
          'Cache-Control': 'no-cache',
          access_token: access_token_val,
          workShopNumber: workShopId
        }
      }).then(
        res => {
          this.apifinish = true

          var tempmachinedata = []
          if (res.data != null) {
            tempmachinedata = res.data
          }
          this.temptotalstatus = JSON.parse(JSON.stringify(this.totalstatusnull)) //統計機台歸零
          this.playsoundflag = false //初始化聲音撥放flag
          if (tempmachinedata != null) {
            tempmachinedata.forEach(item => {
              //異常訊號，設定動畫
              if (item.errorFlag) {
                item.animation = true
              } else {
                item.animation = false
              }
              //其中一個需要撥放警報聲
              if (item.alarmType == 2) {
                this.playsoundflag = true
              }
              if (!this.checkTask) {
                item.scheduled = true
                item.tasked = true
              }

              //檢查任務啟用
              //閒置狀態下無排程且無任務顯示停機
              if (item.status == 3 && !item.scheduled && !item.tasked) {
                item.status = 2
              }

              //計算狀態總數
              this.counttotal(item.status)
            })
          }
          //全螢幕
          if (this.fullscreen) {
            if (tempmachinedata != null) {
              //計算
              if (tempmachinedata.length % 30 == 0) {
                this.totalpage = tempmachinedata.length / 30
              } else {
                this.totalpage = Math.floor(tempmachinedata.length / 30) + 1
              }
              //切分頁
              var start = page * 30
              var end = start + 30
              tempmachinedata = tempmachinedata.slice(start, end) //切設備
            }
            var realpage = page + 1
            this.pagetitle =
              this.$t('page1') + realpage + this.$t('page2') + this.totalpage + this.$t('page3')
          }
          if (this.playsoundflag) {
            this.playAudio() //播放警報聲
          } else {
            this.pauseAudio() //停止播放警報聲
          }
          this.dealdata(tempmachinedata)
        },
        error => {
          this.apifinish = true
          console.log(error)
          // console.log(error.responseJSON.response)
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
    //處理資料
    dealdata(data) {
      if (data != null) {
        data.forEach(item => {
          item.url = '/dashboard/dashboardstation?id=' + item.machineId //Url
          item.machineName = this.dealnameoverfloat(item.machineModel, 7) //設備名稱
          item.machineNumber = this.dealnameoverfloat(item.machineNumber, 9) //設備編號
          item.color = this.cardcolor(item.status) //標頭顏色

          if (
            item.status == 9 ||
            item.status == 10 ||
            item.status == 11 ||
            item.status == 12 ||
            item.status == 13 ||
            item.status == 14 ||
            item.status == 15
          ) {
            //9同步 10EG異常 11DC異常 12設備保養 13設備停機 14EG已關閉 15IoM即將關閉
            item.leftdown = '-' //左下exqut
            item.rightdown = '-' //右下QTY
            item.middleone = this.errorstatus(item.status) //CT/SCT"
            item.middletwo = ' ' //Tr
            item.middlethree = ' ' //剩餘時間
            item.middlefour = ' ' //狀態持續時間
            item.progress = 0 //進度條
            item.progresscolor = this.setprogresscolor(item.qty, item.taskQTY) //進度條顏色
            item.rightup1 = '-' //右上材料
            item.leftup1 = '-' //左上 PN
            item.citclecolor = this.color('gray') //圓圈顏色
          } else {
            item.leftdown = this.dealThousands('-', item.taskQTY) //左下exqut
            item.rightdown = this.dealThousands('-', item.qty) //右下QTY
            item.middleone =
              this.dealCTSCTtime(item.cycleTime) + ' / ' + this.dealCTSCTtime(item.sct) //CT/SCT
            item.progress = this.countprogress(item.qty, item.taskQTY) //進度條
            if (item.tasked) {
              if (this.modeselected == 0) {
                item.middletwo = this.dealCTSCTtime(item.planCycleTime) + ' sec' //Tr
              } else if (this.modeselected == 1) {
                item.middletwo = ''
              }

              item.citclecolor = this.cytr(
                item.cycleTime,
                item.sct,
                item.planCycleTime,
                item.moldGreenRange,
                item.moldYellowRange
              ) //圓圈顏色
              if (item.color == this.color('gray')) {
                item.progress = 0
              } else {
                item.progresscolor = this.setprogresscolor(item.qty, item.taskQTY) //進度條顏色
              }
            } else {
              if (this.modeselected == 0) {
                item.middletwo = '- sec' //Tr
              } else if (this.modeselected == 1) {
                item.middletwo = ''
              }

              item.citclecolor = this.color('gray') //圓圈顏色
              item.progress = 0
            }

            item.middlethree = this.countremaintime(item.qty, item.taskQTY, item.sct) //剩餘時間
            item.middlefour = this.timestampdatetime(item.continuedTime / 1000) //持續時間
            if (item.materialAbbreviation == null) {
              item.rightup1 = '-' //右上製品編號
            } else {
              item.rightup1 = this.dealnameoverfloat(item.materialAbbreviation, 7) //右上原料簡稱
            }
            //停機圓圈顏色改為0
            if (item.status == 2) {
              item.citclecolor = this.color('gary') //圓圈顏色
            }

            item.leftup1 = this.dealPN(item.productNumbers, item.moldNumber, 1) //左上 PN1
          }
        })
      }
      this.changetotoal() //更改統計
      this.members = data
      this.loading = false
      if (this.members != null) {
        if (this.members.length < 8) {
          this.nullobject = []
          var tempnum = 8 - this.members.length
          for (var i = 0; i < tempnum; i++) {
            this.nullobject.push({ item: i })
          }
        }
      }
    },

    //PN
    dealPN(productarray, moldnumber) {
      if (moldnumber == '') {
        return '-'
      } else {
        return this.dealnameoverfloat(moldnumber, 9)
      }
    },
    //判斷效率
    cytr(cycletime, sct, tr, greenrange, yellowrange) {
      if (this.modeselected != 0 && this.modeselected != 1) {
        return this.color('gray')
      }
      if (greenrange == 0) {
        greenrange = 0.1
      }
      if (yellowrange == 0) {
        yellowrange = 0.2
      }

      if (this.modeselected == 0) {
        //效率指標
        if (cycletime == 0 || tr == 0) {
          return this.color('gray')
        }
        var num = (tr / cycletime) * 100
      } else if (this.modeselected == 1) {
        //穩定指標
        if (cycletime == 0 || sct == 0) {
          return this.color('gray')
        }
        var num = (cycletime / sct) * 100
      }
      if (num == 0) {
        return this.color('gray')
      }
      if (num <= 100 * (greenrange + 1) && num >= 100 * (1 - greenrange)) {
        return this.color('green')
      } else if (num > 100 * (yellowrange + 1) || num < 100 * (1 - yellowrange)) {
        return this.color('red')
      } else {
        return this.color('yellow')
      }
    },

    //更改統計
    changetotoal() {
      this.totalstatus = this.temptotalstatus
    },

    //計算機台狀態總數
    counttotal(value) {
      this.temptotalstatus = this.countstatus(this.temptotalstatus, value)
    },
    toggle() {
      this.$refs['fullscreen'].toggle() // recommended
      // this.fullscreen = !this.fullscreen // deprecated
    },
    fullscreenChange(fullscreen) {
      this.fullscreen = fullscreen
      this.currentpage = 0
      if (this.fullscreen) {
        this.carouselplay = false
        this.carouselstop = true
      } else {
        this.carouselplay = false
        this.carouselstop = false
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

<style scoped>
.nullcolDisplay {
  display: none;
}
.progressline {
  height: 100%;
  margin-bottom: 1rem;
}
.card-header {
  padding: 0.4rem 0.75rem;
  border-bottom: 0px;
}
.cascading-admin-card {
  margin-top: 0px;
}
.headerclass {
  padding-top: 0px;
  padding-bottom: 0px;
  width: 100%;
  color: #fff;
  font-size: 1.1rem;
  position: absolute;
}
.headerclasstext {
  padding-top: 0px;
  padding-bottom: 0px;
  color: #fff;
  font-size: 1.1rem;
}
.titlerowclass {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(175px, 1fr));
  margin: 5px;
  margin-left: 0px;
}
.rowclass {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(175px, 1fr));
  margin: 5px;
  margin-left: 0px;
}
.totalcard {
  /* margin: auto; */
  /* style="width:175px;margin-bottom: 1rem" */
  min-width: 175px;
  max-width: calc(100% / 8);
  width: 100%;
  border: 1px black solid;
}
.alignleft1 {
  text-align: center;
}
.alignright {
  text-align: center;
}
.alignright1 {
  text-align: right;
}
.title-alignright {
  float: right;
}
.title-body {
  padding-top: 0px;
  padding-bottom: 0px;
  color: #000;
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
  border-top: 1px black solid;
}
.test {
  margin-top: 1rem;
}
.circle {
  text-align: center;
  border: 10px solid green;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  width: 140px;
  height: 140px;

  margin: auto;
}
.circletext {
  text-align: center;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  width: 140px;
  height: 140px;

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
@-webkit-keyframes fadeinside {
  from {
    opacity: 1;
    /* color: red; */
  }
  50% {
    opacity: 0;
    /* color: white; */
  }
  to {
    opacity: 1;
    /* color: red; */
  }
}
.blink {
  color: red;
  animation: fade 500ms infinite;
}
.circleparent {
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  position: absolute;
}
.circleparent > .blink {
  color: red;
  animation: fade 500ms infinite;
}
.circlecont {
  color: black;
  animation: none !important;
}
/*手機直式 */
@media only screen and (max-width: 500px) and (max-height: 950px) and (orientation: portrait) {
  .mobileFullScreenDisplay {
    display: none;
  }
  .nullcolDisplay {
    display: block;
  }
  .totalcard {
    /* margin: auto; */
    /* style="width:175px;margin-bottom: 1rem" */
    min-width: 100% !important;
    /* max-width: calc(100% / 8); */
    width: 100%;
    border: 1px black solid;
  }
  .titlerowclass {
    margin-bottom: 10px;
    display: grid;
    gap: 10px 20px;
    grid-template-columns: 1fr 1fr;
    margin: 5px;
    margin-left: 0px;
  }
}
/*手機橫式 */
@media only screen and (max-width: 950px) and (max-height: 500px) and (orientation: landscape) {
  .mobileFullScreenDisplay {
    display: none;
  }
  .titlerowclass {
    margin-bottom: 10px;
    display: grid;
    gap: 10px 20px;
    margin: 5px;
    margin-left: 0px;
  }
  .rowclass {
    gap: 0px 5px;
    margin-bottom: 10px;
    margin: 5px;
  }
}
/*平板直式 */
@media only screen and (min-width: 950px) and (min-height: 500px) and (max-width: 1100px) and (max-height: 1400px) and (max-height: 1400px) and (orientation: portrait) {
  .titlerowclass {
    margin-bottom: 10px;
    display: grid;
    gap: 10px 20px;
    margin: 5px;
    margin-left: 0px;
  }
  .totalcards {
    padding-top: 10px !important;
    min-width: 93vw !important;
  }
  /* .mobiledisplay {
    display: none;
  } */
  .mobileFullScreenDisplay {
    display: none;
  }
}
/*平板橫式 */
@media only screen and (min-width: 500px) and (max-width: 1400px) and (max-height: 1100px) and (orientation: landscape) {
  .titlerowclass {
    margin-bottom: 10px;
    display: grid;
    gap: 10px 20px;
    margin: 5px;
    margin-top: 10px;
    margin-left: 0px;
  }
  .totalcards {
    padding-top: 5px;
    min-width: 93vw !important;
  }
  /* .mobiledisplay {
    display: none;
  } */
  .mobileFullScreenDisplay {
    display: none;
  }
}
</style>
