<template>
  <div style="height:100vh">
    <div v-show="false">
      <audio controls id="player">
        <source src="../../assets/alarmsound.wav" type="audio/mpeg" />
      </audio>
      <button @click="playAudio()" type="button">Play Audio</button>
      <button @click="pauseAudio()" type="button">Pause Audio</button>
    </div>
    <fullscreen ref="fullscreen" @change="fullscreenChange" style="background:#fff">
      <div v-if="fullscreen" class="fullscreen-head">
        <img
          id="introduce_img"
          :src="fullscreenimg"
          width="80%"
          alt="User Image"
          style="margin:auto"
        />
        <div class="fullscreen-main-time" style="font-size:35px">{{ this.pagetitle }}</div>
        <div class="fullscreen-main-slogan">
          {{ workshopName }}
        </div>
        <div v-if="!timeready" class="fullscreen-main-time" style="font-size:35px"></div>
        <div v-if="timeready" class="fullscreen-main-time" style="font-size:35px">
          {{ this.currentTime }}
        </div>
        <img
          id="introduce_img"
          src="../../assets/fullscreanAIOM.png"
          width="80%"
          alt="User Image"
          style="margin:auto"
        />
      </div>

      <mdb-container fluid style="background-color:#fff">
        <div>
          <section>
            <mdb-row class="rowclass">
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
                    <h3 style="margin-bottom:0rem">
                      {{ $t('title_running') }}
                    </h3>
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
                    <h3 style="margin-bottom:0rem">
                      {{ $t('title_shutdown') }}
                    </h3>
                  </mdb-card-footer>
                </mdb-card>
              </mdb-col>
              <mdb-col style="margin:auto"> </mdb-col>
              <mdb-col></mdb-col>
              <mdb-col style="margin:auto"> </mdb-col>
            </mdb-row>
          </section>

          <section class="my-1"></section>
          <div class="fullscreen-main-time" v-if="loading">
            Loading...
          </div>

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
                    <span class>{{ members.machineNumber }}</span>
                    <span class="title-alignright">{{ members.machineName }}</span>
                  </mdb-card-header>
                  <mdb-card-body class="title-body">
                    <div>
                      <b-row>
                        <b-col style="width:80%;padding-right: 0px;white-space: nowrap;">
                          <div class="">
                            {{ members.leftup1 }}
                          </div>
                        </b-col>

                        <b-col style="width:20%;">
                          <div class="alignright1" style="width:100%;">{{ members.rightup1 }}</div>
                        </b-col>
                      </b-row>
                    </div>
                    <div>
                      <div class="circle" v-bind:style="{ borderColor: members.citclecolor }">
                        <!-- <span>{{ 100 - members.progress }}%</span> -->
                        <span>{{ members.middleone }}</span>
                        <span>{{ members.middletwo }}</span>
                        <span>{{ members.middlethree }}</span>
                        <span>{{ members.middlefour }}</span>
                      </div>
                    </div>
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
// import { SystemSettingAPI } from '@/plugins/basicapis.js'
import {
  // SystemTimeAPI,
  TaskkanbanAPI,
  RemoteInfoAPI
} from '@/plugins/dashboardapis.js'
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

    return {
      modeselected: 0, //看板模式
      checkTask: false, //看板istasked
      mode: 0, //模式
      playsoundflag: false, //播放警報聲
      timeready: false,
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
      workshopselected: 0,
      currentTime: '0',
      timenum,
      runningstyle: {
        backgroundColor: this.color('green'),
        color: 'white'
      },
      idlestyle: {
        backgroundColor: this.color('orange'),
        color: 'white'
      },
      errorstyle: {
        backgroundColor: this.color('red'),
        color: 'white'
      },
      stopstyle: {
        backgroundColor: this.color('gray'),
        color: 'white'
      },
      backgroundcol: this.color('red'),
      members,
      nullobject,
      totalstatus,
      totalstatusnull,
      fullscreen: true,
      timer: '',
      value: 0,
      type: 0, //看板模式
      wrokshopid: 0, //廠區id
      pagenum: 0, //輪播/頁
      workshopName: ''
    }
  },
  mounted() {
    this.player = document.getElementById('player')
    this.timer = setInterval(this.dealtimeticker, 1000)
  },
  created() {
    this.getUrlVars() //取得網址參數
    // this.getsystem(-1)
    // this.login() //登入
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },

  methods: {
    //警報聲撥放
    playAudio() {
      this.player.loop = true
      this.player.play()
    },
    //警報聲停止
    pauseAudio() {
      this.player.pause()
    },

    getUrlVars() {
      var vars = {}
      window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        vars[key] = value
      })
      this.type = vars['type']
      this.wrokshopid = vars['group']
      this.pagenum = vars['page']
      this.mode = vars['mode']
      this.modeselected = vars['mode']

      if (this.pagenum == 0) {
        // console.log('輪播')
        //輪播
        this.carouselplay = false
        this.carouselstop = true
        this.carouselflag = true
      } else {
        //停播
        // console.log('停播')
        this.carouselplay = true
        this.carouselstop = false
        this.carouselflag = false
      }
      this.getsystem(-1) //系統時間、語言、checkTesk、廠區、系統設定for看版
      // this.workshopselected = this.wrokshopid
    },

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

        if (this.totalpage > 1 && this.pagenum == 0) {
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
            if (this.totalpage > 1 && this.pagenum == 0) {
              this.getmachinedatanew(this.currentpage)
            } else {
              this.getmachinedatanew(0)
            }
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
        this.getsystem(1)
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
      if (this.pagenum != 0) {
        page = this.pagenum - 1
      }
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
              //異常訊號，更改狀態為4，設定動畫
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
              if (this.playsoundflag) {
                this.playAudio() //播放警報聲
              } else {
                this.pauseAudio() //停止播放警報聲
              }
            })
          }
          //全螢幕
          if (this.fullscreen) {
            if (tempmachinedata != null) {
              //計算
              if (tempmachinedata.length % 14 == 0) {
                this.totalpage = tempmachinedata.length / 14
              } else {
                this.totalpage = Math.floor(tempmachinedata.length / 14) + 1
              }
              //切分頁
              var start = page * 14
              var end = start + 14
              tempmachinedata = tempmachinedata.slice(start, end) //切設備
            }
            var realpage = page + 1
            this.pagetitle =
              this.$t('page1') + realpage + this.$t('page2') + this.totalpage + this.$t('page3')
          }
          if (!this.timeready) {
            this.timeready = !this.timeready
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
    //處理資料
    dealdata(data) {
      if (data != null) {
        data.forEach(item => {
          /*************************** */

          /******************************* */

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
            //9同步 10EG異常 11DC異常
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
              if (this.mode == 0) {
                item.middletwo = this.dealCTSCTtime(item.planCycleTime) + ' sec' //Tr
              } else if (this.mode == 1) {
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
              if (this.mode == 0) {
                item.middletwo = '- sec' //Tr
              } else if (this.middletwo == 1) {
                item.middletwo = ''
              }
              item.citclecolor = this.color('gray') //圓圈顏色
              item.progress = 0
            }
            //停機圓圈顏色改為0
            if (this.machineobject.status == 2) {
              this.machineobject.citclecolor = this.color('gary') //圓圈顏色
            }
            item.middlethree = this.countremaintime(item.qty, item.taskQTY, item.sct) //剩餘時間
            item.middlefour = this.timestampdatetime(item.continuedTime / 1000) //剩餘時間
            if (item.materialAbbreviation == null) {
              item.rightup1 = '-' //右上製品編號
            } else {
              item.rightup1 = this.dealnameoverfloat(item.materialAbbreviation, 7) //右上原料簡稱
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
      if (sct == 0) {
        return this.color('gray')
      }

      if (this.modeselected == 0) {
        if (cycletime == 0 || tr == 0) {
          return this.color('gray')
        }
        //效率指標
        var num = (tr / cycletime) * 100
      } else if (this.modeselected == 1) {
        if (cycletime == 0 || sct == 0) {
          return this.color('gray')
        }
        //穩定指標
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
.fixed-sn.bodyclass {
  background-color: white !important;
}
.el-progress-bar__outer {
  height: 4px !important;
}
</style>
<style scoped>
.progressline {
  height: 100%;
  margin-bottom: 1rem;
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
.card-header {
  padding: 0.4rem 0.75rem;
  border-bottom: 0px;
}
.cascading-admin-card {
  margin-top: 0px;
}
.headerclass {
  color: #fff;
  font-size: 1.1rem;
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
</style>
