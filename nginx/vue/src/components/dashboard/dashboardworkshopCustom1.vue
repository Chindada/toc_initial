<template>
  <div>
    <div class="settingclass" v-if="!this.fullscreen">
      <mdb-btn
        size="sm"
        color="primary"
        v-on:click="settext()"
        icon="cogs"
        style="padding:0.8rem"
        class="mobileFullScreenDisplay"
      ></mdb-btn>
    </div>
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
        <div class="fullscreen-main-slogan">{{ workshopName }}</div>

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
                    <h3 style="margin-bottom:0rem">{{ totalstatusshow.running }}</h3>
                  </mdb-card-footer>
                </mdb-card>
              </mdb-col>
              <mdb-col style="margin:auto;padding:0">
                <mdb-card cascade class="cascading-admin-card totalcard">
                  <mdb-card-body class="title-body">
                    <h1 class="totoal-val">{{ totalstatus.idle }}</h1>
                  </mdb-card-body>
                  <mdb-card-footer cascade class="totoal-title" :style="totalCardStyle('orange')">
                    <h3 style="margin-bottom:0rem">{{ totalstatusshow.idle }}</h3>
                  </mdb-card-footer>
                </mdb-card>
              </mdb-col>
              <mdb-col style="margin:auto;padding:0">
                <mdb-card cascade class="cascading-admin-card totalcard">
                  <mdb-card-body class="title-body">
                    <h1 class="totoal-val">{{ totalstatus.error }}</h1>
                  </mdb-card-body>
                  <mdb-card-footer cascade class="totoal-title" :style="totalCardStyle('red')">
                    <h3 style="margin-bottom:0rem">{{ totalstatusshow.abnormal }}</h3>
                  </mdb-card-footer>
                </mdb-card>
              </mdb-col>
              <mdb-col style="margin:auto;padding:0">
                <mdb-card cascade class="cascading-admin-card totalcard">
                  <mdb-card-body class="title-body">
                    <h1 class="totoal-val">{{ totalstatus.stop }}</h1>
                  </mdb-card-body>
                  <mdb-card-footer cascade class="totoal-title" :style="totalCardStyle('gray')">
                    <h3 style="margin-bottom:0rem">{{ totalstatusshow.stop }}</h3>
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

          <mdb-row class="rowclass">
            <span :key="index" v-for="(members, index) in members" align="center">
              <router-link :to="members.url">
                <!-- <mdb-card
                  class="cascading-admin-card"
                  style="margin-bottom: 1rem;margin-right:10px;margin-left:10px;"
                  align="left"
                >-->
                <mdb-card
                  class="cascading-admin-card"
                  style="margin-right:5px;margin-left:5px;min-height:260px; "
                  align="left"
                >
                  <!-- 閃爍 blink " -->
                  <mdb-card-header
                    v-bind:style="{ backgroundColor: members.color }"
                    :class="{ headerclass: true, blink: members.animation }"
                  >
                    <span style="opacity: 0;">1</span>
                    <span style="opacity: 0;">1</span>
                  </mdb-card-header>
                  <!-- end閃爍 title -->
                  <mdb-card-header class="headerclass">
                    <span style="padding-left:5px">{{ members.machineNumber }}</span>
                    <span class="title-alignright" style="padding-right:5px">
                      {{ members.machineName }}
                    </span>
                  </mdb-card-header>
                  <!-- end title 撐開header -->
                  <mdb-card-header class="headerclasstext">
                    <span style="opacity: 0;">1</span>
                    <span style="opacity: 0;">1</span>
                  </mdb-card-header>
                  <!-- end 撐開header -->
                  <mdb-card-body class="title-body">
                    <div
                      v-if="members.errormes != ''"
                      style="height:168px;text-align:center;padding-top:18%;font-size:40px"
                    >
                      {{ members.errormes }}
                    </div>
                    <div v-if="members.errormes == ''">
                      <!-- <div style="display: inline-flex;z-index:100">
                        <div style="align-self:flex-start;z-index:100;">123</div>
                        <div style="align-self:flex-end;z-index:100;">{{ members.rightup1 }}</div>
                      </div>-->
                      <div>
                        <b-row style cols="8">
                          <b-col style="padding-right: 0px;z-index:100;">
                            <!-- <b-row style="padding:0px;width:100%">
                              <b-col
                                style="padding-right:0px;overflow:hidden;text-overflow : ellipsis;white-space : nowrap;"
                                >{{ members.leftup1 }}</b-col
                              >
                              <b-col
                                cols="1"
                                style="padding:0px;display:inline-block;white-space : nowrap; "
                              >
                                {{ members.leftup2 }}
                              </b-col>
                            </b-row>-->
                            <div
                              style="white-space: nowrap;box-sizing: border-box;overflow: hidden;display: flex;"
                            >
                              <div
                                style="display: inline-block;overflow: hidden;text-overflow: ellipsis; margin-right: 5px"
                              >
                                {{ members.leftup1 }}
                              </div>
                              <div style="display: inline-block;">{{ members.leftup2 }}</div>
                            </div>

                            <!-- <span
                              style="max-width:80%;overflow:hidden;text-overflow : ellipsis;white-space : nowrap;"
                              >{{ members.leftup1 }}</span
                            >

                            <span style="min-width:20%;padding-left:2px;display:inline-block ">{{
                              members.leftup2
                            }}</span>-->
                          </b-col>

                          <b-col cols="5" style="padding-left:5px;display:inline-block ">
                            <div class="alignright1" style="width:100%;">
                              {{ members.rightup1 }}
                            </div>
                          </b-col>
                        </b-row>
                        <!-- <b-row style="">
                          <b-col
                            style="width:80%;padding-right: 0px;white-space: nowrap;z-index:100"
                          >
                            <div class>{{ members.leftup1 }}</div>
                          </b-col>

                          <b-col style="width:20%;">
                            <div class="alignright1" style="width:100%;">
                              {{ members.rightup1 }}
                            </div>
                          </b-col>
                        </b-row>-->
                      </div>

                      <b-row class="textsizeclass">
                        <b-col cols="6">
                          <div class="progress1 blue" style="background:white!important">
                            <span class="progress-left">
                              <span
                                class="progress-bar"
                                :style="progressLeft(members.citclevalue, members.citclecolor)"
                              ></span>
                            </span>
                            <span class="progress-right">
                              <span
                                class="progress-bar"
                                :style="progressRight(members.citclevalue, members.citclecolor)"
                              ></span>
                            </span>
                            <div class="progress-value">{{ members.citclevalue }} %</div>
                          </div>
                        </b-col>
                        <b-col cols="6" style="padding-left:10px">
                          <div class="alignright1" style="width:100%;">{{ members.rightup2 }}</div>
                          <div style>
                            <div v-if="remoteflag">{{ $t('dashboard_qty') }}:</div>
                            <div v-if="remoteflag">{{ members.leftdown }}</div>

                            <b-row v-if="!remoteflag">
                              <!-- <b-col cols="6" style="padding-right:0px">{{
                                $t('dashboard_qty')
                              }}</b-col> -->
                              <b-col style="padding-right:0px"> {{ $t('dashboard_qty') }}:</b-col>
                            </b-row>
                            <b-row>
                              <b-col style="padding:0px" class="textRight">{{
                                members.leftdown
                              }}</b-col>
                            </b-row>
                          </div>
                          <div v-if="!remoteflag">
                            <b-row>
                              <b-col style="padding-right:0px"
                                >{{ $t('dashboard_remaining_time') }}:</b-col
                              >
                            </b-row>
                            <b-row>
                              <b-col style="padding:0px" class="textRight">{{
                                members.remainingtime
                              }}</b-col>
                            </b-row>
                          </div>
                          <div v-if="remoteflag">
                            <div>{{ $t('dashboard_remaining_time') }}:</div>
                            <div>{{ members.remainingtime }}</div>
                            <!-- <b-row>
                              <b-col cols="6" style="padding-right:0px">{{
                                $t('dashboard_remaining_time')
                              }}</b-col>
                              <b-col style="padding:0px">: {{ members.remainingtime }}</b-col>
                            </b-row>-->
                          </div>
                        </b-col>
                      </b-row>

                      <div class="col-md-3 col-sm-6 textsizeclass"></div>
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
                    </div>
                    <b-progress :max="100">
                      <b-progress-bar
                        :style="{ 'background-color': members.progresscolor }"
                        :value="members.progress"
                      ></b-progress-bar>
                    </b-progress>
                    <br v-if="fullscreen && !remoteflag" />
                    <b-row>
                      <b-col style="padding-right:0px" class="textsizeclass"
                        >{{ $t('dashboard_schedule_start_time') }} :</b-col
                      >
                      <b-col style="text-align:right;padding-left:0px" class="texttimesizeclass">
                        {{ members.scheduleStart }}
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col style="padding-right:0px" class="textsizeclass"
                        >{{ $t('dashboard_schedule_end_time') }} :</b-col
                      >
                      <b-col style="text-align:right;padding-left:0px" class="texttimesizeclass">
                        {{ members.scheduleEnd }}
                      </b-col>
                    </b-row>
                  </mdb-card-body>
                </mdb-card>
              </router-link>
            </span>

            <span :key="index" v-for="(nullobject, index) in nullobject" align="center"></span>
          </mdb-row>
          <div v-if="!fullscreen" style="opacity: 0">---</div>
          <div v-if="!fullscreen" style="opacity: 0">---</div>
          <div v-if="!fullscreen" style="opacity: 0">---</div>
          <div v-if="!fullscreen" style="opacity: 0">---</div>
        </div>
      </mdb-container>
    </fullscreen>
    <mdb-modal centered :show="editmodal" @close="closemodal($event)">
      <mdb-modal-header>
        <mdb-modal-title>{{ $t('edit') }}</mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body>
        <!-- <mdb-input
          class="mb-3"
          v-model="titletext.total"
          maxlength="4"
          :placeholder="$t('dashboard_title_placeholder')"
        >
          <span class="input-group-text" slot="prepend"
            >{{ $t('original_text') }}{{ $t('upper_bracket') }}{{ titletextorg.total
            }}{{ $t('lower_bracket') }}</span
          >
        </mdb-input>-->
        <mdb-input
          class="mb-3"
          v-model="titletext.running"
          maxlength="4"
          :placeholder="$t('dashboard_title_placeholder')"
        >
          <span class="input-group-text" slot="prepend">
            {{ $t('original_text') }}{{ $t('upper_bracket') }}{{ $t('title_running')
            }}{{ $t('lower_bracket') }}
          </span>
        </mdb-input>
        <mdb-input
          class="mb-3"
          v-model="titletext.idle"
          maxlength="4"
          :placeholder="$t('dashboard_title_placeholder')"
        >
          <span class="input-group-text" slot="prepend">
            {{ $t('original_text') }}{{ $t('upper_bracket') }}{{ $t('title_idle')
            }}{{ $t('lower_bracket') }}
          </span>
        </mdb-input>
        <mdb-input
          class="mb-3"
          v-model="titletext.abnormal"
          maxlength="4"
          :placeholder="$t('dashboard_title_placeholder')"
        >
          <span class="input-group-text" slot="prepend">
            {{ $t('original_text') }}{{ $t('upper_bracket') }}{{ $t('title_error')
            }}{{ $t('lower_bracket') }}
          </span>
        </mdb-input>
        <mdb-input
          class="mb-3"
          v-model="titletext.stop"
          maxlength="4"
          :placeholder="$t('dashboard_title_placeholder')"
        >
          <span class="input-group-text" slot="prepend">
            {{ $t('original_text') }}{{ $t('upper_bracket') }}{{ $t('title_shutdown')
            }}{{ $t('lower_bracket') }}
          </span>
        </mdb-input>
      </mdb-modal-body>
      <mdb-modal-footer>
        <span style="color:red">{{ errormes }}</span>
        <mdb-btn color="info" v-on:click="editsetting()">{{ $t('submit') }}</mdb-btn>
        <mdb-btn color="0000" @click.native="editmodal = false">{{ $t('close') }}</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
  </div>
</template>

<script>
// import url from '@/router/index.js' //取得router裡SRV url
// import { SystemSettingAPI } from '@/plugins/basicapis.js'
import { TaskkanbanAPI, RemoteInfoAPI } from '@/plugins/dashboardapis.js'
import { WorkShopAPI } from '@/plugins/basicapis.js'
import { SystemSettingAPI } from '@/plugins/basicapis.js'
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
    var totalstatusshow = JSON.parse(JSON.stringify(totalstatus))
    var totalstatusnull = JSON.parse(JSON.stringify(totalstatus))
    // var temptotalstatus = JSON.parse(JSON.stringify(totalstatus));
    var modeobject = [
      { value: 0, text: this.$t('efficiency_mode') }, //'效率指標' },
      { value: 1, text: this.$t('stability_mode') } //'穩定指標' }
    ]
    var titletext = {
      // total: this.$t('title_total'),
      running: this.$t('title_running'),
      idle: this.$t('title_idle'),
      abnormal: this.$t('title_error'),
      stop: this.$t('title_shutdown')
    }
    var titletextorg = JSON.parse(JSON.stringify(titletext))
    return {
      totalstatusshow, //顯示用
      titletext,
      titletextorg,
      editmodal: false, //編輯視窗
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
      backgroundcol: this.color('red'),
      members,
      nullobject,
      totalstatus,
      totalstatusnull,
      fullscreen: false,
      timer: '',
      value: 0,
      remoteflag: false, //遠端flag
      type: 0, //看板模式
      wrokshopid: 0, //廠區id
      pagenum: 0, //輪播/頁
      workshopName: '',
      errormes: ''
    }
  },
  mounted() {
    this.getsystem(-1)
    // if (localStorage.getItem('checkTask') == 'false') {
    //   this.checkTask = false
    // } else {
    //   this.checkTask = true
    // }
    this.player = document.getElementById('player')
    this.timer = setInterval(this.dealtimeticker, 1000)
  },
  created() {
    // this.testfunc()
    this.checkremote() //檢查是否為投放模式
    // this.getenvdata() //取得環境變數
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    // testfunc() {
    //   let w = window.innerWidth
    //   let h = window.innerHeight
    //   console.log('W: ' + w)
    //   console.log('h: ' + h)
    // },

    checkorg(value, text) {
      if (value == text || value == '') {
        return ''
      } else {
        return value
      }
    },
    //modal背景點擊不關閉
    closemodal(value) {
      if (value == undefined) {
        this.editmodal = false
      }
    },

    //編輯設定送出
    editsetting() {
      // this.titletext.total = this.checkorg(this.titletext.total, this.$t('title_total'))
      this.titletext.running = this.checkorg(this.titletext.running, this.$t('title_running'))
      this.titletext.idle = this.checkorg(this.titletext.idle, this.$t('title_idle'))
      this.titletext.abnormal = this.checkorg(this.titletext.abnormal, this.$t('title_error'))
      this.titletext.stop = this.checkorg(this.titletext.stop, this.$t('title_shutdown'))
      let temparray = [
        // {
        //   parameter: 'total',
        //   value: this.titletext.total
        // },
        {
          parameter: 'running',
          value: this.titletext.running
        },
        {
          parameter: 'idle',
          value: this.titletext.idle
        },
        {
          parameter: 'abnormal',
          value: this.titletext.abnormal
        },
        {
          parameter: 'stop',
          value: this.titletext.stop
        }
      ]
      var access_token_val = this.$cookies.get('access_token')
      SystemSettingAPI.put(JSON.stringify(temparray), {
        headers: {
          access_token: access_token_val,
          multi: true
        }
      }).then(
        () => {
          this.editmodal = false
          this.getsystem(-1)
          this.$layer.msg(this.$t('scuccess'))
        },
        error => {
          this.errormes = error.response.data
        }
      )
    },
    //設定總數運轉閒置異常停機
    settext() {
      this.errormes = ''
      this.titletext = JSON.parse(JSON.stringify(this.titletextorg))
      this.titletext.running = this.checkorg1(this.titletext.running, this.$t('title_running'))
      this.titletext.idle = this.checkorg1(this.titletext.idle, this.$t('title_idle'))
      this.titletext.abnormal = this.checkorg1(this.titletext.abnormal, this.$t('title_error'))
      this.titletext.stop = this.checkorg1(this.titletext.stop, this.$t('title_shutdown'))
      this.editmodal = true
    },
    checkorg1(value, i18n) {
      if (value == i18n) {
        return ''
      } else {
        return value
      }
    },
    //檢查是否為投放模式
    checkremote() {
      var vars = {}
      window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        vars[key] = value
      })
      if (vars['type'] != undefined) {
        this.remoteflag = true
        this.fullscreen = true
        this.type = vars['type']
        this.wrokshopid = vars['group']
        this.pagenum = vars['page']
        this.mode = vars['mode']
        this.modeselected = vars['mode']
        // if (this.pagenum == 0) {
        //   // console.log('輪播')
        //   //輪播
        // } else {
        //   //停播
        //   // console.log('停播')
        //   this.carouselplay = false
        //   this.carouselstop = false
        // }
      }
      this.getsystem(-1)
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
              switch (item.parameter) {
                case 'dashboard_frequency':
                  this.dashboard_frequency = item.value
                  break
                case 'dashboard_logo':
                  this.fullscreenimg = item.value
                  break
                // case 'total':
                //   if (item.value != '') {
                //     this.titletext.total = item.value
                //   } else {
                //     this.titletext.total = this.$t('title_total')
                //   }
                //   break
                case 'running':
                  if (item.value != '') {
                    this.titletext.running = item.value
                  } else {
                    this.titletext.running = this.$t('title_running')
                  }
                  break
                case 'idle':
                  if (item.value != '') {
                    this.titletext.idle = item.value
                  } else {
                    this.titletext.idle = this.$t('title_idle')
                  }
                  break
                case 'abnormal':
                  if (item.value != '') {
                    this.titletext.abnormal = item.value
                  } else {
                    this.titletext.abnormal = this.$t('title_error')
                  }
                  break
                case 'stop':
                  if (item.value != '') {
                    this.titletext.stop = item.value
                  } else {
                    this.titletext.stop = this.$t('title_shutdown')
                  }
                  break
              }

              // if (item.parameter == 'dashboard_frequency') {
              //   this.dashboard_frequency = item.value
              // }
              // if (item.parameter == 'dashboard_logo') {
              //   this.fullscreenimg = item.value
              // }
            })
            this.totalstatusshow = JSON.parse(JSON.stringify(this.titletext))
            this.titletextorg = JSON.parse(JSON.stringify(this.titletext))
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
    workshoponChange(modeselectedvalue) {
      //按下模式按鈕
      if (modeselectedvalue != undefined && modeselectedvalue != this.modeselected) {
        this.modeselected = modeselectedvalue
      }
      this.timenum = 0
      this.carouselflag = true
      // this.getworkshop()
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
            if (this.currentpage == this.totalpage) {
              this.currentpage = 0
            }
            this.getmachinedatanew(this.currentpage)
          }
        }
        /********************************************** */
        //全螢幕off
      } else {
        //每5秒getdata
        if (this.timenum % 5 == 0) {
          if (this.apifinish && this.pagenum == 0) {
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
          let cardnum = 15
          if (this.remoteflag) {
            cardnum = 10
          }
          //全螢幕
          if (this.fullscreen) {
            if (tempmachinedata != null) {
              //計算
              if (tempmachinedata.length % cardnum == 0) {
                this.totalpage = tempmachinedata.length / cardnum
              } else {
                this.totalpage = Math.floor(tempmachinedata.length / cardnum) + 1
              }

              //切分頁
              var start = page * cardnum
              var end = start + cardnum
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

          item.machineNumber = this.dealnameoverfloat(item.machineNumber, 9) //設備編號
          item.machineName = this.dealnameoverfloat(item.machineModel, 7) //設備型號
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
            item.errormes = this.errorstatus(item.status)
            item.scheduleStart = this.dealStartEndTime(item.scheduleStart)
            item.scheduleEnd = this.dealStartEndTime(item.scheduleEnd)
          } else {
            item.errormes = ''
            item.leftdown = this.dealThousands('-', item.taskQTY * item.cavityNumber) //左下模次*模穴
            item.rightdown = this.dealThousands('-', item.qty * item.cavityNumber) //右下QTY*模穴

            item.progress = this.countprogress(item.qty, item.taskQTY) //進度條
            if (item.tasked) {
              item.citclecolor = this.cytr(
                item.cycleTime,
                item.sct,
                item.planCycleTime,
                item.moldGreenRange,
                item.moldYellowRange
              ) //圓圈顏色
              item.citclevalue = Math.round(
                this.cytrvalue(item.cycleTime, item.sct, item.planCycleTime)
              ) //圓圈數值
              if (item.color == this.color('gray')) {
                item.progress = 0
              } else {
                item.progresscolor = this.setprogresscolor(item.qty, item.taskQTY) //進度條顏色
              }
            } else {
              item.citclecolor = this.color('gray') //圓圈顏色
              item.citclevalue = 0 //圓圈數值
              item.progress = 0
            }
            //停機圓圈顏色改為0
            if (item.status == 2) {
              item.citclecolor = this.color('gary') //圓圈顏色
            }
            item.remainingtime = this.countremaintime(item.qty, item.taskQTY, item.sct) //剩餘時間

            // item.leftup1 = this.dealPN(item.moldNumber,  item.cavityNumber) //左上 PN1
            item.leftup1 = this.dealPN(item.moldNumber) //左上模具編號
            item.leftup2 = '/' + this.dealPN(item.cavityNumber) //左上模穴數
            item.rightup1 =
              this.dealCTSCTtime(item.cycleTime) + ' / ' + this.dealCTSCTtime(item.sct) //右上1CT/SCT
            item.rightup2 = this.dealCTSCTtime(item.planCycleTime) //右上2計畫週期時間

            item.scheduleStart = this.dealStartEndTime(item.scheduleStart)
            item.scheduleEnd = this.dealStartEndTime(item.scheduleEnd)
            // console.log(item)
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
    dealStartEndTime(value) {
      if (value == 0) {
        return '-'
      }
      return this.timeStampToStringFunc(value, 'yyyy-mm-dd hh:mm')
    },
    dealdegfunc(value) {
      let tempdeg = 0
      tempdeg = (180 / 50) * value
      return tempdeg
    },
    //圓圈右半邊0~50
    progressRight(value, color) {
      let tempdeg = 0
      if (value >= 50) {
        tempdeg = 180
      } else {
        tempdeg = this.dealdegfunc(value)
      }

      let obj = {
        borderColor: color,
        transform: 'rotate(' + tempdeg + 'deg)'
      }
      return obj
    },
    //圓圈左半邊50~100
    progressLeft(value, color) {
      let tempdeg = 0
      if (value < 50) {
        tempdeg = 0
      } else if (value > 100) {
        tempdeg = 180
      } else {
        tempdeg = this.dealdegfunc(value - 50)
      }

      let obj = {
        borderColor: color,
        transform: 'rotate(' + tempdeg + 'deg)'
      }
      return obj
    },

    //取得廠區
    getworkshop() {
      this.workshopobject = [{ value: '0', text: this.$t('all') }]
      var access_token_val = this.$cookies.get('access_token')
      WorkShopAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(res => {
        if (res.data != null) {
          res.data.forEach(item => {
            this.workshopobject.push({ value: item.number, text: item.name })
          })
        }
      })
    },

    //PN
    dealPN(value) {
      let returnval = '-'
      if (value != '' && value != 0) {
        returnval = value
      }
      return returnval
    },
    //判斷效率
    cytr(cycletime, sct, tr, greenrange, yellowrange) {
      if (this.modeselected != 0 && this.modeselected != 1) {
        return this.color('gray') //'#808080'
      }
      if (greenrange == 0) {
        greenrange = 0.1
      }
      if (yellowrange == 0) {
        yellowrange = 0.2
      }
      if (sct == 0) {
        return this.color('gray') //'#808080'
      }

      if (this.modeselected == 0) {
        //效率指標
        if (cycletime == 0 || tr == 0) {
          return this.color('gray') //'#808080'
        }
        var num = (tr / cycletime) * 100
      } else if (this.modeselected == 1) {
        //穩定指標
        if (cycletime == 0 || sct == 0) {
          return this.color('gray') //'#808080'
        }
        var num = (cycletime / sct) * 100
      }
      if (num == 0) {
        return this.color('gray') //'#808080'
      }
      if (num <= 100 * (greenrange + 1) && num >= 100 * (1 - greenrange)) {
        return this.color('green') //'#00a136'
      } else if (num > 100 * (yellowrange + 1) || num < 100 * (1 - yellowrange)) {
        return this.color('red') //'#ff0000'
      } else {
        return this.color('yellow') //'#FFD700'
      }
    },
    //判斷效率
    cytrvalue(cycletime, sct, tr) {
      if (this.modeselected != 0 && this.modeselected != 1) {
        return 0
      }

      if (sct == 0) {
        return 0
      }

      if (cycletime == 0 && tr == 0) {
        return 0
      } else {
        if (this.modeselected == 0) {
          //效率指標
          if (tr == 0) {
            return 0
          }
          var num = (tr / cycletime) * 100
        } else if (this.modeselected == 1) {
          //穩定指標
          var num = (cycletime / sct) * 100
        }
        if (num == 0) {
          return 0
        } else if (num >= 100) {
          //???????????????????????????????
          return 100
        }
        return num
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
    /********************** */

    /********************** */
  }
}
</script>

<style scoped>
.totalcard {
  white-space: nowrap;
}
.textsizeclass {
  white-space: nowrap;
}
.textRight {
  text-align: right;
  padding-right: 10% !important;
}
.nullcolDisplay {
  display: none;
}
.cascading-admin-card {
  margin-top: 0px !important;
}
.progress1 {
  width: 100px;
  height: 100px;
  line-height: 100px;
  background: none;
  margin: 0 auto;
  box-shadow: none;
  position: relative;
}
.progress1:after {
  content: '';
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 20px solid #e9ecef;
  /* border: 12px solid #fff; */
  position: absolute;
  top: 0;
  left: 0;
}
.progress1 > span {
  width: 50%;
  height: 100%;
  overflow: hidden;
  position: absolute;
  top: 0;
  z-index: 1;
}
.progress1 .progress-left {
  left: 0;
}
.progress1 .progress-bar {
  width: 100%;
  height: 100%;
  background: none;
  border-width: 20px;
  border-style: solid;
  position: absolute;
  top: 0;
}
.progress1 .progress-left .progress-bar {
  left: 100%;
  border-top-right-radius: 80px;
  border-bottom-right-radius: 80px;
  border-left: 0;
  -webkit-transform-origin: center left;
  transform-origin: center left;
}
.progress1 .progress-right {
  right: 0;
}
/* 右半邊0~50 */
.progress1 .progress-right .progress-bar {
  left: -100%;
  border-top-left-radius: 80px;
  border-bottom-left-radius: 80px;
  border-right: 0;
  -webkit-transform-origin: center right;
  transform-origin: center right;
}
/* 左半邊50~100 */
.progress1.blue .progress-left .progress-bar {
  /* -webkit-transform: rotate(90deg) !important;
  transform: rotate(90deg) !important; */
}
.progress1 .progress-value {
  width: 90%;
  height: 90%;
  border-radius: 50%;
  background: #fff;
  font-size: 20px;
  color: #44484b;
  line-height: 135px;
  text-align: center;
  position: absolute;
  top: -18%;
  left: 5%;
}

/* .progress1.blue .progress-bar {
  border-color: #049dff;
} */

@media only screen and (max-width: 990px) {
  .progress1 {
    margin-bottom: 20px;
  }
}

.settingclass {
  z-index: 1000;
  position: fixed;
  bottom: 40px;
  float: left;
}
.card-header {
  padding: 0.4rem 0.75rem;
  border-bottom: 0px;
}

.headerclass {
  padding: 0px;
  width: 100%;
  color: #fff;
  font-size: 1.1rem;
  position: absolute;
  border-radius: 5px 5px 0px 0px;
}
.headerclasstext {
  padding: 0px;
  color: #fff;
  font-size: 1.1rem;
}
.titlerowclass {
  margin-bottom: 10px;
  display: grid;
  gap: 10px 20px;
  grid-template-columns: repeat(auto-fit, minmax(175px, 1fr));
  margin: 5px;
  margin-left: 0px;
}
.rowclass {
  margin-bottom: 10px;
  margin: 5px;
  display: grid;
  grid-template-columns: repeat(5, minmax(322px, 1fr));
  grid-row-gap: 10px;
  margin-left: 0px;
  margin-right: 0px;
}
.totalcard {
  min-width: 100px;

  max-width: 165px;
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
  padding-left: 5px;
  text-align: left;
  border: 10px solid green;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: left;
  align-content: left;
  width: 140px;
  height: 140px;
}
.circletext {
  text-align: center;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: left;
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
  /* margin-left: auto;
  margin-right: auto; */
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

@media (max-width: 1900px) {
  .rowclass {
    margin-bottom: 10px;
    margin: 5px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(322px, 1fr));

    margin-left: 0px;
  }
  .cascading-admin-card.card {
    /* margin-top: 10px; */
  }
}
/* 1280*720 */
/* @media (max-width: 1500px) and (max-height: 800px) {
  .cascading-admin-card.card {
  }
  .textsizeclass {
    font-size: 14px;
  }
  .texttimesizeclass {
    font-size: 13px;
    padding-top: 3px;
  }
  .rowclass {
    margin-bottom: 10px;
    margin: 5px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;

    margin-left: 0px;
  }
} */
/*手機直式 */
@media only screen and (max-width: 500px) and (max-height: 950px) and (orientation: portrait) {
  .titlerowclass {
    margin-bottom: 10px;
    display: grid;
    gap: 10px 20px;
    grid-template-columns: 1fr 1fr;
    margin: 5px;
    margin-left: 0px;
  }
  .row {
    margin: 0px !important;
  }
  .totalcards {
    margin-top: 20px;
    text-align: center;
    padding-right: 0px;
    padding-left: 0rem !important;
    min-width: 100% !important;
    max-width: 100% !important;
    margin-left: 0px !important;
  }
  .totalstatus {
    min-width: 50%;
    text-align: center;
    padding-bottom: 5px !important;
    margin: auto;
  }
  .nullcolDisplay {
    display: block;
  }
  .mobiledisplay {
    display: none;
  }
  .mobileFullScreenDisplay {
    display: none;
  }
  .modeTypeColLeftclass {
    /* padding-left: 0px; */
    padding: 0px;
  }
  .modeTypeColRighttclass {
    /* padding-right: 0px; */
    padding: 0px;
  }
  .modeTypeColclass {
    padding: 0px;
    min-width: 100% !important;
  }
  .modeTypeLetfClass {
    width: 98% !important;
    margin-left: 0px;
  }
  .modeTypeRightClass {
    float: right;
    width: 98% !important;
    margin-right: 0px;
  }
  .browser-default.custom-select.custom-select-sm.select {
    margin: 0px !important;
  }
  .mobileSelectDisplayBlock {
    padding: 0px;
    min-width: 100% !important;
    display: block !important;
  }
  .mobileSelectDisplayNone {
    display: none;
  }
  .settingclass {
    z-index: 1000;
    position: fixed;
    bottom: 45px;
    float: left;
  }

  .rowclass {
    grid-gap: 10px;
    margin-bottom: 10px;
    margin: 0px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));

    margin-left: 0px;
  }
  .cascading-admin-card.card {
    /* margin-top: 10px; */
    margin-left: 0px !important;
    margin-right: 0px !important;
  }
  /* .workshopselecteclass {
    width: 150vw !important;
  } */
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
  .rowclass {
    margin-bottom: 10px;
    margin: 5px;
    display: grid;
    grid-template-columns: 1fr 1fr;

    gap: 10px 20px;
    margin-left: 0px;
  }
}
/*平板橫式 */
@media only screen and (min-height: 600px) and (min-width: 950px) and(max-width: 1400px) and (max-height: 1100px) and (orientation: landscape) {
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
  .rowclass {
    margin-bottom: 10px;
    margin: 5px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px 20px;

    margin-left: 0px;
  }
}

/*手機橫式 */
@media only screen and(max-height: 500px) and (max-width: 950px) and (orientation: landscape) {
  /* .totalstatus  {
    min-width: 0vw;
  } */
  .titlerowclass {
    margin-bottom: 10px;
    display: grid;
    gap: 10px 20px;
    margin: 5px;
    margin-left: 0px;
  }
  .totalcards {
    min-width: 93vw !important;
  }
  .mobileFullScreenDisplay {
    display: none;
  }
  .mobiledisplay {
    display: none;
  }
  .rowclass {
    margin-bottom: 10px;
    margin: 5px;
    display: grid;
    gap: 10px 20px;
    grid-template-columns: 1fr 1fr;
    margin-left: 0px;
  }
}
</style>
