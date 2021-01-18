<template>
  <mdb-container fluid>
    <mdb-card>
      <mdb-card-body>
        <div class="mb-4"></div>
        <b-row class="rowcss">
          <!-- <b-col cols="2" class="title">{{ $t('to_schedule_workshop') }} :</b-col> -->
          <b-col cols="2" class="title">{{ $t('report_type') }} :</b-col>
          <b-col cols="3">
            <div style="width:100%">
              <select
                :disabled="btndisable"
                class="browser-default custom-select custom-select-sm"
                v-model="reporttypeobject"
                @change="reporttypechange"
                style="margin:auto"
              >
                <option
                  v-for="(timetype, key) in reporttypeselect"
                  :key="key"
                  :value="timetype.value"
                  >{{ timetype.text }}</option
                >
              </select>
            </div>
          </b-col>
        </b-row>
        <b-row class="rowcss" v-if="showproductivitytime">
          <!-- <b-col cols="2" class="title">{{ $t('to_schedule_workshop') }} :</b-col> -->
          <b-col cols="2" class="title">{{ $t('report_range') }} :</b-col>
          <b-col cols="3">
            <div style="width:100%">
              <select
                :disabled="btndisable"
                class="browser-default custom-select custom-select-sm"
                v-model="daytypeobject"
                style="margin:auto"
              >
                <option
                  v-for="(timetype, key) in daytypeoptions"
                  :key="key"
                  :value="timetype.value"
                  >{{ timetype.text }}</option
                >
              </select>
            </div>
          </b-col>
        </b-row>
        <b-row class="rowcss">
          <b-col cols="2" class="title">{{ $t('to_schedule_workshop') }} :</b-col>
          <b-col cols="3">
            <div style="width:100%">
              <select
                :disabled="btndisable"
                class="browser-default custom-select custom-select-sm"
                v-model="workshopselected"
                style="margin:auto"
              >
                <option
                  v-for="(workshopitem, key) in workshopobject"
                  :key="key"
                  :value="workshopitem.value"
                  >{{ workshopitem.text }}</option
                >
              </select>
            </div>
          </b-col>
        </b-row>

        <b-row class="rowcss">
          <b-col cols="2" class="title">
            <label>{{ $t('report_date') }} :</label>
          </b-col>
          <b-col cols="3">
            <input
              type="date"
              v-if="showdayilyweekinput()"
              v-model="time_dayily_week"
              :disabled="btndisable"
              style="width:100%"
            />
            <input
              type="month"
              v-if="showmonseainput()"
              v-model="time_mon_sea"
              :disabled="btndisable"
              style="width:100%"
            />
            <input
              v-if="showyearinput()"
              type="number"
              min="2000"
              required
              v-model="time_year"
              :disabled="btndisable"
              style="width:100%"
            />
          </b-col>
        </b-row>
        <!-- <b-row class="rowcss">
          <b-col cols="2"> </b-col>
          <b-col cols="3">
            <mdb-btn
              size="sm"
              color="primary"
              v-on:click="checktime()"
              :disabled="btndisable"
              icon="download"
              style="margin:0px"
            ></mdb-btn>
          </b-col>
        </b-row>-->
        <b-row class="rowcss">
          <b-col cols="2" class="title"></b-col>
          <b-col cols="3">
            <div class="image-container" v-show="btndisable">
              <img
                alt="AIOM"
                class="img-center"
                width="20px"
                height="20px"
                src="../../assets/loading-1.gif"
              />
            </div>
            <mdb-btn
              :disabled="btnunable"
              v-show="!btndisable"
              size="sm"
              color="primary"
              v-on:click="downloadfile()"
              icon="download"
              style="margin:0px"
            ></mdb-btn>
          </b-col>

          <b-col></b-col>
        </b-row>

        <!-- lllllllllllllllllllllllllllllllll -->

        <hr align="center" width="100%" />
        <div class="mb-4"></div>
        <div>
          <!-- 收件者設定 -->
          <b-row class="rowcss">
            <b-col cols="2" class="title">
              <label>{{ $t('recipient_setting') }} :</label>
            </b-col>
            <b-col cols="3" style="text-align: center;">{{ $t('recipient_name') }}</b-col>
            <b-col cols="3" style="text-align: center;">Email</b-col>
            <b-col cols="3" style="text-align: center;">{{ $t('to_schedule_workshop') }}</b-col>
          </b-row>
          <b-row class="rowcss">
            <b-col cols="2"></b-col>
            <b-col cols="3">
              <mdb-input style="width:100%" v-model="userarray[0].recipient" :disabled="editflag">
                <span class="input-group-text" slot="prepend" style="font-size:small">{{
                  $t('recipient_1')
                }}</span>
              </mdb-input>
            </b-col>
            <b-col cols="3">
              <mdb-input style="width:100%" v-model="userarray[0].email" :disabled="editflag">
                <span></span>
              </mdb-input>
            </b-col>
            <b-col cols="3">
              <mdb-select
                :disabled="editflag"
                multiple
                @getValue="onChange1"
                :options="userarray[0].wokshopoption"
              />
            </b-col>
          </b-row>
          <b-row class="rowcss">
            <b-col cols="2"></b-col>
            <b-col cols="3">
              <mdb-input v-model="userarray[1].recipient" style="width:100%" :disabled="editflag">
                <span class="input-group-text" slot="prepend" style="font-size:small">
                  {{ $t('recipient_2') }}
                </span>
              </mdb-input>
            </b-col>
            <b-col cols="3">
              <mdb-input style="width:100%" v-model="userarray[1].email" :disabled="editflag">
                <span></span>
              </mdb-input>
            </b-col>
            <b-col cols="3">
              <mdb-select
                :disabled="editflag"
                multiple
                @getValue="onChange2"
                :options="userarray[1].wokshopoption"
              />
            </b-col>
          </b-row>
          <b-row class="rowcss">
            <b-col cols="2"></b-col>
            <b-col cols="3">
              <mdb-input v-model="userarray[2].recipient" style="width:100%" :disabled="editflag">
                <span class="input-group-text" slot="prepend" style="font-size:small">
                  {{ $t('recipient_3') }}
                </span>
              </mdb-input>
            </b-col>
            <b-col cols="3">
              <mdb-input style="width:100%;" v-model="userarray[2].email" :disabled="editflag">
                <span></span>
              </mdb-input>
            </b-col>
            <b-col cols="3">
              <mdb-select
                :disabled="editflag"
                multiple
                @getValue="onChange3"
                :options="userarray[2].wokshopoption"
              />
            </b-col>
          </b-row>
          <!-- <b-row>
            <div>ajajaj</div>
          </b-row>-->
          <!-- end收件者設定 -->
          <!-- 警示設定 -->
          <b-row class="rowcss">
            <b-col cols="2" class="title">
              <label>{{ $t('warning_setting') }} :</label>
            </b-col>
          </b-row>
          <b-row class="rowcss">
            <b-col cols="2"></b-col>
            <b-col cols="3">
              <mdb-input
                style="width:100%"
                required
                type="number"
                v-model="report_red_boundary"
                :min="0"
                :max="100"
                :disabled="editflag"
              >
                <span class="input-group-text" slot="prepend" style="font-size:small">{{
                  $t('red_setting')
                }}</span>
              </mdb-input>
            </b-col>
          </b-row>
          <b-row class="rowcss">
            <b-col cols="2"></b-col>
            <b-col cols="3">
              <mdb-input
                type="number"
                v-model="report_yellow_boundary"
                style="width:100%"
                :min="0"
                :max="100"
                :disabled="editflag"
              >
                <span class="input-group-text" slot="prepend" style="font-size:small">
                  {{ $t('yellow_setting') }}
                </span>
              </mdb-input>
            </b-col>
          </b-row>

          <!-- end警示設定 -->
          <!-- 郵件伺服器設定 -->
          <div class="mb-4"></div>

          <b-row class="rowcss">
            <b-col cols="2" class="title">
              <label>{{ $t('mail_server_setting') }} :</label>
            </b-col>
            <b-col>
              <div class="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  class="custom-control-input"
                  id="defaultChecked2"
                  v-model="maildefault"
                  :disabled="editflag"
                />
                <label class="custom-control-label" for="defaultChecked2">
                  {{ $t('defaultmailserver') }}
                </label>
              </div>
            </b-col>
          </b-row>
          <b-row class="rowcss" v-show="!maildefault">
            <b-col cols="2"></b-col>
            <b-col cols="3">
              <mdb-input style="width:100%" v-model="mail_server_host" :disabled="editflag">
                <span class="input-group-text" slot="prepend">{{ $t('mail_host') }}</span>
              </mdb-input>
            </b-col>
          </b-row>
          <b-row class="rowcss" v-show="!maildefault">
            <b-col cols="2"></b-col>
            <b-col cols="3">
              <mdb-input style="width:100%" v-model="mail_server_port" :disabled="editflag">
                <span class="input-group-text" slot="prepend">{{ $t('mail_port') }}</span>
              </mdb-input>
            </b-col>
          </b-row>
          <b-row class="rowcss" v-show="!maildefault">
            <b-col cols="2"></b-col>
            <b-col cols="3">
              <mdb-input style="width:100%" v-model="mail_server_user" :disabled="editflag">
                <span class="input-group-text" slot="prepend">{{ $t('mail_account') }}</span>
              </mdb-input>
            </b-col>
          </b-row>
          <b-row class="rowcss" v-show="!maildefault">
            <b-col cols="2"></b-col>
            <b-col cols="3">
              <mdb-input
                type="password"
                style="width:100%"
                v-model="mail_server_password"
                :disabled="editflag"
              >
                <span class="input-group-text" slot="prepend">{{ $t('mail_password') }}</span>
              </mdb-input>
            </b-col>
          </b-row>
          <!-- end郵件伺服器設定 -->
          <!-- 編輯/送出/取消 -->
          <b-row>
            <b-col cols="2"></b-col>
            <b-col cols="2">
              <mdb-btn
                v-show="editflag"
                size="sm"
                style="margin:0px"
                icon="pencil-alt"
                color="mdb-color"
                v-on:click="editbtm('edit')"
              ></mdb-btn>

              <mdb-btn
                v-show="!editflag"
                size="sm"
                style="margin:0px"
                color="info"
                v-on:click="checkvalue()"
                >{{ $t('submit') }}</mdb-btn
              >
            </b-col>
            <b-col cols="2">
              <mdb-btn
                v-show="!editflag"
                size="sm"
                style="margin:0px"
                color="#000"
                type="button"
                @click="editbtm('cancel')"
                >{{ $t('cancel') }}</mdb-btn
              >
            </b-col>
          </b-row>
          <!-- end編輯/送出/取消 -->
        </div>
        <hr align="center" width="100%" />

        <!-- /************************************************* */ -->
        <!-- /************************************************* */ -->
      </mdb-card-body>
    </mdb-card>
  </mdb-container>
  <!-- <div class="classic-form-page">
    
  </div>-->
</template>

<script>
import {
  DailyReportDonloadAPI,
  MailuserAPI,
  DailyReportDonloadExcelAPI,
  DailyReport2DonloadExcelAPI,
  QualityReportDonloadExcelAPI,
  ErrorReportDonloadExcelAPI,
  BroadcastReportDonloadExcelAPI,
  ReportDonloadExcelAPI
} from '@/plugins/analyze.js'
import { WorkShopAPI } from '@/plugins/basicapis.js'
import { SystemSettingAPI } from '@/plugins/basicapis.js'
import naturalCompare from 'string-natural-compare'
// import workshopVue from '../basicsetting/workshop.vue'
export default {
  components: {},
  watch: {
    report_red_boundary: function(value) {
      if (value > 100) {
        this.report_red_boundary = 100
      }
      if (value < 0) {
        this.report_red_boundary = 0
      }
    },
    report_yellow_boundary: function(value) {
      if (value > 100) {
        this.report_yellow_boundary = 100
      }
      if (value < 0) {
        this.report_yellow_boundary = 0
      }
    }
  },
  data() {
    var reporttype = [
      { value: 1, text: this.$t('report_daily_pdf') }, //PDF 生產日報表
      { value: 2, text: this.$t('report_daily_xls') }, //XLS 生產日報表
      // { value: 6, text: this.$t('report_daily2_xls') }, //XLS 生產日報表2
      { value: 3, text: this.$t('report_productivity') }, //XLS 生產效率報表
      { value: 4, text: this.$t('report_exception') }, //XLS 異常報表
      { value: 5, text: this.$t('report_quality') }, //XLS 品質報表
      { value: 6, text: this.$t('report_broadcast') } //推播報表
    ]
    var reporttypeOEE = [
      { value: 1, text: this.$t('report_daily_pdf') }, //PDF 生產日報表
      { value: 2, text: this.$t('report_daily_xls') }, //XLS 生產日報表
      // { value: 6, text: this.$t('report_daily2_xls') }, //XLS 生產日報表2
      { value: 3, text: this.$t('report_productivity') }, //XLS 生產效率報表
      { value: 5, text: this.$t('report_quality') }, //XLS 品質報表, //XLS 品質報表
      { value: 6, text: this.$t('report_broadcast') } //推播報表
    ]
    var daytype = [
      // { value: 1, text: this.$t('report_week') }, //周
      { value: 2, text: this.$t('report_month_compare') }, //月
      { value: 3, text: this.$t('report_season_compare') }, //季
      { value: 4, text: this.$t('report_year_compare') } //年
    ]

    var daytype1 = [
      // { value: 1, text: this.$t('report_week') }, //周
      { value: 2, text: this.$t('report_month') }, //月
      { value: 3, text: this.$t('report_season') }, //季
      { value: 4, text: this.$t('report_year') } //年
    ]
    // var machineworkshoptype = [
    //   { value: 1, text: this.$t('to_schedule_workshop') }, //廠區
    //   { value: 2, text: this.$t('to_schedule_machine') } //設備
    // ]
    return {
      reporttypeOEE, //OEE版本報表下載
      reporttype, //OEE+、IPS下載報表類型
      reporttypeselect: [], //報表下載選單
      btnunable: true, //禁用下載按鈕
      showproductivitytime: false,
      daytypeoptions: [], //周月季年選項
      daytype, //周月季年(比較)
      daytype1, //周月季年
      daytypeobject: 2,
      // machineworkshoptype, //廠區或設備報表
      reporttypeobject: 1, //
      maildefault: true,
      userarray: [],
      mail_server_host: '',
      mail_server_port: '',
      mail_server_user: '',
      mail_server_password: '',
      editflag: true,
      report_red_boundary: 0,
      report_yellow_boundary: 0,
      time_dayily_week: '', //日周
      time_mon_sea: '', //月季
      time_year: '', //年
      btndisable: false,
      workshopobject: [],
      workshopselected: 0,
      enable_default_mail_server: ''
    }
  },
  created() {
    this.iniver()
    this.initime()
    this.getredyellow()
    this.getworkshop()
  },
  methods: {
    //根據版本設定報表類型
    iniver() {
      var Value = localStorage.getItem('version')

      if (Value == '"1"') {
        this.reporttypeselect = this.reporttypeOEE
      }
      if (Value == '"2"') {
        this.reporttypeselect = this.reporttype
      }
      if (Value == '"3"') {
        this.reporttypeselect = this.reporttype
      }
    },
    //報表類型改變
    reporttypechange() {
      // console.log(this.reporttypeobject)

      this.initime() //初始化時間
      switch (this.reporttypeobject) {
        case 1: //日報表(pdf)
          // this.initime() //初始化時間
          this.showproductivitytime = false
          break
        case 2: //日報表(excel)
          // this.initime() //初始化時間
          this.showproductivitytime = false
          break
        case 3: //生產效率報表
          this.showproductivitytime = true
          this.daytypeoptions = this.daytype
          // this.initime() //初始化時間
          break
        case 4: //異常報表
          // this.initime() //初始化時間
          this.showproductivitytime = true
          this.daytypeoptions = this.daytype1
          break
        case 5: //品質報表
          // this.initime() //初始化時間
          this.showproductivitytime = true
          this.daytypeoptions = this.daytype1
          break
        case 6: //推播報表
          this.showproductivitytime = true
          this.daytypeoptions = this.daytype1
          break
      }
    },
    //點擊下載按鈕
    downloadfile() {
      switch (this.reporttypeobject) {
        case 1: //下載日報表(pdf)
          this.checktime('pdf')
          break
        case 2: //下載日報表(excel)
          this.checktime('excel')
          break
        case 3: //生產效率報表
          this.productivitychecktime(3)
          break
        case 4: //異常報表
          this.productivitychecktime(4)
          break
        case 5: //品質報表
          this.productivitychecktime(5)
          break
        case 6: //推播報表
          this.productivitychecktime(6)
          break
      }
    },
    // //是否顯周月季年輸入
    // showproductivitytime() {
    //   if (this.reporttypeobject == 3) {
    //     return true
    //   }
    //   return false
    // },
    //是否顯示年月日輸入
    showdayilyweekinput() {
      if (this.reporttypeobject == 1 || this.reporttypeobject == 2) {
        return true
      }
      if (this.reporttypeobject == 3 && this.daytypeobject == 1) {
        return true
      }
      if (this.reporttypeobject == 4 && this.daytypeobject == 1) {
        return true
      }
      if (this.reporttypeobject == 5 && this.daytypeobject == 1) {
        return true
      }
      if (this.reporttypeobject == 6 && this.daytypeobject == 1) {
        return true
      }

      return false
    },
    //是否顯示年月輸入
    showmonseainput() {
      if (
        this.reporttypeobject == 3 ||
        this.reporttypeobject == 4 ||
        this.reporttypeobject == 5 ||
        this.reporttypeobject == 6
      ) {
        if (this.daytypeobject == 2 || this.daytypeobject == 3) {
          return true
        }
      }
      return false
    },
    //是否顯示年輸入
    showyearinput() {
      if (this.reporttypeobject == 3 && this.daytypeobject == 4) {
        return true
      }
      if (this.reporttypeobject == 4 && this.daytypeobject == 4) {
        return true
      }
      if (this.reporttypeobject == 5 && this.daytypeobject == 4) {
        return true
      }
      if (this.reporttypeobject == 6 && this.daytypeobject == 4) {
        return true
      }
      return false
    },
    onChange1(value) {
      this.userarray[0].workShopSetting = value
    },
    onChange2(value) {
      this.userarray[1].workShopSetting = value
    },
    onChange3(value) {
      this.userarray[2].workShopSetting = value
    },
    editbtm(value) {
      if (value == 'cancel') {
        this.editflag = true
      } else {
        this.editflag = false
      }
    },
    //檢查參數
    checkvalue() {
      this.report_red_boundary = parseInt(this.report_red_boundary)
      this.report_yellow_boundary = parseInt(this.report_yellow_boundary)
      if (this.report_red_boundary > this.report_yellow_boundary) {
        this.$layer.msg(this.$t('report_red_yellow_mes'))
      } else {
        this.report_red_boundary = this.report_red_boundary.toString()
        this.report_yellow_boundary = this.report_yellow_boundary.toString()
        this.submitredyellow()
      }
    },
    //送出紅黃參數
    submitredyellow() {
      var tempstring = ''
      if (this.maildefault) {
        tempstring = 'true'
      } else {
        tempstring = 'false'
      }
      var stbmitarray = [
        {
          parameter: 'report_red_boundary',
          value: this.report_red_boundary
        },
        {
          parameter: 'report_yellow_boundary',
          value: this.report_yellow_boundary
        },
        {
          parameter: 'mail_host',
          value: this.mail_server_host
        },
        {
          parameter: 'mail_port',
          value: this.mail_server_port
        },
        {
          parameter: 'mail_user',
          value: this.mail_server_user
        },
        {
          parameter: 'mail_password',
          value: this.mail_server_password
        },
        {
          parameter: 'enable_default_mail_server',
          value: tempstring
        }
      ]

      var access_token_val = this.$cookies.get('access_token')
      SystemSettingAPI.put(JSON.stringify(stbmitarray), {
        headers: {
          access_token: access_token_val,
          multi: true
        }
      }).then(
        () => {
          this.submitmailuser()
          // this.editbtm('cancel')
          // this.getredyellow()
        },
        error => {
          this.editbtm('cancel')
          this.getredyellow()
          this.getusermail()
          console.log(error.response)
          this.findsamedata(error.response.data.errorData)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //送出收件者設定
    submitmailuser() {
      var tempnum = 0
      for (var i = 0; i < 3; i++) {
        var object = this.dealworkShopSetting(JSON.parse(JSON.stringify(this.userarray[i])))
        var access_token_val = this.$cookies.get('access_token')
        MailuserAPI.put(JSON.stringify(object), {
          headers: {
            access_token: access_token_val
          }
        }).then(
          () => {
            tempnum++
            if (tempnum == 3) {
              this.editbtm('cancel')
              this.getredyellow()
            }
          },
          () => {
            // this.editbtm('cancel')
            // this.getredyellow()
            // this.getusermail()
            // console.log(error.response)
            // this.findsamedata(error.response.data.errorData)
            this.$layer.msg('Email error')
          }
        )
      }
    },
    dealworkShopSetting(data) {
      var tempstring = '['
      var tempobject = data.workShopSetting

      tempobject.forEach(item => {
        if (item != null && item != 0) {
          tempstring += item + ','
        }
      })
      if (tempstring.length > 2) {
        tempstring = tempstring.substring(0, tempstring.length - 1) + ']'
      } else {
        tempstring += ']'
      }
      data.workShopSetting = tempstring
      return data
    },
    //取得收件者設定
    getusermail() {
      this.userarray = []
      var access_token_val = this.$cookies.get('access_token')
      MailuserAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          if (res.data != null) {
            res.data.forEach(item => {
              var tempworkshopobject = JSON.parse(JSON.stringify(this.workshopobject))
              item.workShopSetting = this.intstring2intarray(item.workShopSetting) //字串轉int array
              item.wokshopoption = [
                { value: null, text: this.$t('select_workshop'), disabled: true }
              ]
              tempworkshopobject.forEach(option => {
                //設定預設
                if (item.workShopSetting.includes(option.value)) {
                  option.selected = true
                }
                if (item.workShopSetting) item.wokshopoption.push(option)
              })
            })
          }
          this.userarray = JSON.parse(JSON.stringify(res.data))
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //字串轉int array
    intstring2intarray(str) {
      str = str.substring(1, str.length - 1)
      return Array.from(str.split(','), Number)
    },
    //取得red yellow、mail參數
    getredyellow() {
      var access_token_val = this.$cookies.get('access_token')
      SystemSettingAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          if (res.data != null) {
            res.data.forEach(item => {
              switch (item.parameter) {
                case 'report_red_boundary':
                  this.report_red_boundary = parseInt(item.value)
                  break
                case 'report_yellow_boundary':
                  this.report_yellow_boundary = parseInt(item.value)
                  break
                case 'mail_host':
                  this.mail_server_host = item.value
                  break
                case 'mail_port':
                  this.mail_server_port = item.value
                  break
                case 'mail_user':
                  this.mail_server_user = item.value
                  break
                case 'mail_password':
                  this.mail_server_password = item.value
                  break
                case 'enable_default_mail_server':
                  if (item.value == 'false') {
                    this.maildefault = false
                  } else {
                    this.maildefault = true
                  }
                  break
              }
            })
          }
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
      this.time_dayily_week = this.timeStampToStringFunc(timestamp, 'yyyy-mm-dd') //轉timestamp
      this.time_mon_sea = this.timeStampToStringFunc(timestamp, 'yyyy-mm') //轉timestamp
      this.time_year = this.timeStampToStringFunc(timestamp, 'yyyy') //轉timestamp
    },
    //檢未來時間
    checkfuturetime(timestampinput) {
      let timestampnow = this.stringToTimestampFunc(
        new Date(
          this.timeStampToStringFunc(
            this.stringToTimestampFunc(new Date(new Date())),
            'yyyy-mm-dd'
          ) + 'T06:00'
        )
      )
      if (timestampinput > timestampnow) {
        this.$layer.msg(this.$t('download_error2'))
        return false
      }
      return true
    },

    //生產效率報表檢查時間
    productivitychecktime(type) {
      //type 3 生產效率  、4異常、5品質 、6推播
      let timearray = []
      let timestampinput = ''
      let callapiflag = false
      switch (this.daytypeobject) {
        case 1: //周
          timestampinput = this.stringToTimestampFunc(new Date(this.time_dayily_week + 'T06:00'))
          if (this.checkfuturetime(timestampinput)) {
            callapiflag = true
            timearray = this.timeStampToStringFunc(timestampinput, '[yyyy,mmm,dd]') //timestamp拆解為array
          }

          break
        case 2: //月
          timestampinput = this.stringToTimestampFunc(new Date(this.time_mon_sea + '-01T06:00'))
          if (this.checkfuturetime(timestampinput)) {
            callapiflag = true
            timearray = this.timeStampToStringFunc(timestampinput, '[yyyy,mmm,dd]') //timestamp拆解為array
          }

          break
        case 3: //季
          timestampinput = this.stringToTimestampFunc(new Date(this.time_mon_sea + '-01T06:00'))
          if (this.checkfuturetime(timestampinput)) {
            callapiflag = true
            timearray = this.timeStampToStringFunc(timestampinput, '[yyyy,mmm,dd]') //timestamp拆解為array
          }
          break
        case 4: //年
          timestampinput = this.stringToTimestampFunc(new Date(this.time_year + '-01-01T06:00'))
          if (this.checkfuturetime(timestampinput)) {
            callapiflag = true
            timearray = this.timeStampToStringFunc(timestampinput, '[yyyy,mmm,dd]') //timestamp拆解為array
          }
          break
      }
      if (callapiflag) {
        //type 3 生產效率  、4異常、5品質、6推播
        if (type == 3) {
          this.callproductivityapi(this.daytypeobject, timearray)
        } else if (type == 4) {
          this.callErrorapi(this.daytypeobject, timearray)
        } else if (type == 5) {
          this.callQualityapi(this.daytypeobject, timearray)
        } else if (type == 6) {
          this.callBroadcastapi(this.daytypeobject, timearray)
        }
      }
    },

    //檢查日報表時間
    checktime(filetype) {
      var timestamp = this.stringToTimestampFunc(new Date(this.time_dayily_week + 'T06:00')) //開始時間轉timestamp
      var timestampnow = this.stringToTimestampFunc(
        new Date(
          this.timeStampToStringFunc(
            this.stringToTimestampFunc(new Date(new Date())),
            'yyyy-mm-dd'
          ) + 'T06:00'
        )
      )
      // 未來時間
      if (timestamp > timestampnow) {
        this.$layer.msg(this.$t('download_error2'))
      } else {
        this.workshopobject.forEach(item => {
          if (this.workshopselected == item.value) {
            if (item.firstStatusTime > timestamp) {
              //超過本廠第一筆資料之前
              this.$layer.msg(this.$t('download_error1'))
            } else {
              if (filetype == 'pdf') {
                this.downpdffunc()
              } else if (filetype == 'excel') {
                this.downexcelfunc()
              } else if (filetype == 'excel2') {
                this.downexcel2func()
              }
            }
          }
        })
      }
    },
    //推播報表下載
    callBroadcastapi(type, timearray) {
      this.btndisable = true
      var access_token_val = this.$cookies.get('access_token')
      let workShopId = ''

      if (this.workshopselected == 'All') {
        workShopId = ''
      } else {
        workShopId = this.workshopselected
      }
      BroadcastReportDonloadExcelAPI({
        headers: {
          access_token: access_token_val,
          periodtype: type, //周月季年
          workShopId: workShopId,
          year: timearray[0],
          month: timearray[1],
          day: 1
        },
        responseType: 'blob' //設定格式為blob
      }).then(
        res => {
          const url = URL.createObjectURL(
            new Blob([res.data], {
              type: 'application/vnd.ms-excel'
            })
          )
          const link = document.createElement('a')

          let filename = res.headers['content-disposition'].split('filename=')[1]

          link.href = url
          link.download = filename
          document.body.appendChild(link)
          link.click()
          this.btndisable = false
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('report_error'))
          this.btndisable = false
        }
      )
    },
    //下載品質周月季年excel報表
    callQualityapi(type, timearray) {
      this.btndisable = true
      var access_token_val = this.$cookies.get('access_token')
      let workShopId = ''

      if (this.workshopselected == 'All') {
        workShopId = ''
      } else {
        workShopId = this.workshopselected
      }
      QualityReportDonloadExcelAPI({
        headers: {
          access_token: access_token_val,
          periodtype: type, //周月季年
          workShopId: workShopId,
          year: timearray[0],
          month: timearray[1],
          day: timearray[2]
        },
        responseType: 'blob' //設定格式為blob
        // responseType: 'application/vnd.ms-excel' //設定格式為blob
      }).then(
        res => {
          const url = URL.createObjectURL(
            new Blob([res.data], {
              type: 'application/vnd.ms-excel'
              // type: 'xlsx'
            })
          )
          const link = document.createElement('a')
          // let con = url.openConnection()
          // // // get and verify the header field
          // let fieldValue = con.getHeaderField('Content-Disposition')
          // let tempfilename = fieldValue.substring(
          //   fieldValue.indexOf('filename="') + 10,
          //   fieldValue.length() - 1
          // )
          /******************** */
          let filetype = ''
          if (type == 2) {
            filetype = 'IoM_QC_Monthly_Report_'
          } else if (type == 3) {
            filetype = 'IoM_QC_Quarterly_Report_'
          } else if (type == 4) {
            filetype = 'IoM_QC_Yearly_Report_'
          }

          var tempworkshopname = ''
          if (this.workshopobject != null) {
            this.workshopobject.forEach(item => {
              if (this.workshopselected == item.value) {
                tempworkshopname = item.text
              }
            })
          }
          let filename =
            filetype +
            tempworkshopname +
            '_' +
            this.timeStampToStringFunc(this.stringToTimestampFunc(new Date()), 'yyyymmddhhmm') +
            '.xlsx'

          /****************** */

          link.href = url
          link.download = filename
          // link.setAttribute('download')
          document.body.appendChild(link)
          link.click()
          // this.saveByteArray(tempanme, res.data)
          this.btndisable = false
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('report_error'))
          this.btndisable = false
        }
      )
    },
    //下載異常周月季年excel報表
    callErrorapi(type, timearray) {
      this.btndisable = true
      var access_token_val = this.$cookies.get('access_token')
      let workShopId = ''

      if (this.workshopselected == 'All') {
        workShopId = ''
      } else {
        workShopId = this.workshopselected
      }
      ErrorReportDonloadExcelAPI({
        headers: {
          access_token: access_token_val,
          periodtype: type, //周月季年
          workShopId: workShopId,
          year: timearray[0],
          month: timearray[1],
          day: timearray[2]
        },
        responseType: 'blob' //設定格式為blob
        // responseType: 'application/vnd.ms-excel' //設定格式為blob
      }).then(
        res => {
          const url = URL.createObjectURL(
            new Blob([res.data], {
              type: 'application/vnd.ms-excel'
              // type: 'xlsx'
            })
          )
          const link = document.createElement('a')
          // let con = url.openConnection()
          // // // get and verify the header field
          // let fieldValue = con.getHeaderField('Content-Disposition')
          // let tempfilename = fieldValue.substring(
          //   fieldValue.indexOf('filename="') + 10,
          //   fieldValue.length() - 1
          // )
          /******************** */
          let filetype = ''
          if (type == 2) {
            filetype = 'IoM_Alarm_Monthly_Report_'
          } else if (type == 3) {
            filetype = 'IoM_Alarm_Quarterly_Report_'
          } else if (type == 4) {
            filetype = 'IoM_Alarm_Yearly_Report_'
          }

          var tempworkshopname = ''
          if (this.workshopobject != null) {
            this.workshopobject.forEach(item => {
              if (this.workshopselected == item.value) {
                tempworkshopname = item.text
              }
            })
          }
          let filename =
            filetype +
            tempworkshopname +
            '_' +
            this.timeStampToStringFunc(this.stringToTimestampFunc(new Date()), 'yyyymmddhhmm') +
            '.xlsx'

          /****************** */

          link.href = url
          link.download = filename
          // link.setAttribute('download')
          document.body.appendChild(link)
          link.click()
          // this.saveByteArray(tempanme, res.data)
          this.btndisable = false
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('report_error'))
          this.btndisable = false
        }
      )
    },
    //下載生產效率周月季年excel報表
    callproductivityapi(type, timearray) {
      this.btndisable = true
      var access_token_val = this.$cookies.get('access_token')
      let workShopId = ''

      if (this.workshopselected == 'All') {
        workShopId = ''
      } else {
        workShopId = this.workshopselected
      }
      ReportDonloadExcelAPI({
        headers: {
          access_token: access_token_val,
          periodtype: type, //周月季年
          workShopId: workShopId,
          year: timearray[0],
          month: timearray[1],
          day: timearray[2]
        },
        responseType: 'blob' //設定格式為blob
        // responseType: 'application/vnd.ms-excel' //設定格式為blob
      }).then(
        res => {
          const url = URL.createObjectURL(
            new Blob([res.data], {
              type: 'application/vnd.ms-excel'
              // type: 'xlsx'
            })
          )
          const link = document.createElement('a')
          // let con = url.openConnection()
          // // // get and verify the header field
          // let fieldValue = con.getHeaderField('Content-Disposition')
          // let tempfilename = fieldValue.substring(
          //   fieldValue.indexOf('filename="') + 10,
          //   fieldValue.length() - 1
          // )
          /******************** */
          let filetype = ''
          if (type == 2) {
            filetype = 'IoM_Monthly_Report_'
          } else if (type == 3) {
            filetype = 'IoM_Quarterly_Report_'
          } else if (type == 4) {
            filetype = 'IoM_Yearly_Report_'
          }

          var tempworkshopname = ''
          if (this.workshopobject != null) {
            this.workshopobject.forEach(item => {
              if (this.workshopselected == item.value) {
                tempworkshopname = item.text
              }
            })
          }
          let filename =
            filetype +
            tempworkshopname +
            '_' +
            this.timeStampToStringFunc(this.stringToTimestampFunc(new Date()), 'yyyymmddhhmm') +
            '.xlsx'

          /****************** */

          link.href = url
          link.download = filename
          // link.setAttribute('download')
          document.body.appendChild(link)
          link.click()
          // this.saveByteArray(tempanme, res.data)
          this.btndisable = false
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('report_error'))
          this.btndisable = false
        }
      )
    },

    // 下載excel報表2
    downexcel2func() {
      var timestamp = this.stringToTimestampFunc(new Date(this.time_dayily_week + 'T00:00')) //開始時間轉timestamp
      var timearray = this.timeStampToStringFunc(timestamp, '[yyyy,mmm,dd]') //timestamp拆解為
      this.btndisable = true
      var access_token_val = this.$cookies.get('access_token')
      DailyReport2DonloadExcelAPI({
        headers: {
          access_token: access_token_val,
          workShopId: this.workshopselected,
          year: timearray[0],
          month: timearray[1],
          day: timearray[2]
        },
        responseType: 'blob' //設定格式為blob
        // responseType: 'application/vnd.ms-excel' //設定格式為blob
      }).then(
        res => {
          const url = URL.createObjectURL(
            new Blob([res.data], {
              type: 'application/vnd.ms-excel'
            })
          )
          var tempworkshopname = ''
          if (this.workshopobject != null) {
            this.workshopobject.forEach(item => {
              if (this.workshopselected == item.value) {
                tempworkshopname = item.text
              }
            })
          }
          var tempanme =
            'IoM_Daily_Report2_' +
            tempworkshopname +
            '_' +
            this.timeStampToStringFunc(this.stringToTimestampFunc(new Date()), 'yyyymmddhhmm') +
            '.xlsx'
          const link = document.createElement('a')
          link.href = url
          // link.download = "filename.xlsx";
          link.setAttribute('download', tempanme)
          document.body.appendChild(link)
          link.click()
          // this.saveByteArray(tempanme, res.data)
          this.btndisable = false
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
          this.btndisable = false
        }
      )
    },
    // 下載excel報表
    downexcelfunc() {
      var timestamp = this.stringToTimestampFunc(new Date(this.time_dayily_week + 'T00:00')) //開始時間轉timestamp
      var timearray = this.timeStampToStringFunc(timestamp, '[yyyy,mmm,dd]') //timestamp拆解為
      this.btndisable = true
      var access_token_val = this.$cookies.get('access_token')
      DailyReportDonloadExcelAPI({
        headers: {
          access_token: access_token_val,
          workShopId: this.workshopselected,
          year: timearray[0],
          month: timearray[1],
          day: timearray[2]
        },
        responseType: 'blob' //設定格式為blob
        // responseType: 'application/vnd.ms-excel' //設定格式為blob
      }).then(
        res => {
          const url = URL.createObjectURL(
            new Blob([res.data], {
              type: 'application/vnd.ms-excel'
            })
          )
          var tempworkshopname = ''
          if (this.workshopobject != null) {
            this.workshopobject.forEach(item => {
              if (this.workshopselected == item.value) {
                tempworkshopname = item.text
              }
            })
          }
          var tempanme =
            'IoM_Daily_Report_' +
            tempworkshopname +
            '_' +
            this.timeStampToStringFunc(this.stringToTimestampFunc(new Date()), 'yyyymmddhhmm') +
            '.xlsx'
          const link = document.createElement('a')
          link.href = url
          // link.download = "filename.xlsx";
          link.setAttribute('download', tempanme)
          document.body.appendChild(link)
          link.click()
          // this.saveByteArray(tempanme, res.data)
          this.btndisable = false
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
          this.btndisable = false
        }
      )
    },
    //下載PDF報表
    downpdffunc() {
      var timestamp = this.stringToTimestampFunc(new Date(this.time_dayily_week + 'T00:00')) //開始時間轉timestamp
      var timearray = this.timeStampToStringFunc(timestamp, '[yyyy,mmm,dd]') //timestamp拆解為array
      this.btndisable = true
      var access_token_val = this.$cookies.get('access_token')
      DailyReportDonloadAPI({
        headers: {
          access_token: access_token_val,
          workShopId: this.workshopselected,
          year: timearray[0],
          month: timearray[1],
          day: timearray[2]
        },
        responseType: 'blob' //設定格式為blob
      }).then(
        res => {
          var tempworkshopname = ''
          if (this.workshopobject != null) {
            this.workshopobject.forEach(item => {
              if (this.workshopselected == item.value) {
                tempworkshopname = item.text
              }
            })
          }
          var tempanme =
            'IoM_Daily_Report_' +
            tempworkshopname +
            '_' +
            this.timeStampToStringFunc(this.stringToTimestampFunc(new Date()), 'yyyymmddhhmm')
          this.saveByteArray(tempanme, res.data)
          this.btndisable = false
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
          this.btndisable = false
        }
      )
    },
    saveByteArray(reportName, byte) {
      var blob = new Blob([byte], { type: 'application/pdf' })
      var link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      var fileName = reportName
      link.download = fileName
      link.click()
    },
    //取得廠區
    getworkshop() {
      this.workshopobject = [] //清空廠區選單
      var access_token_val = this.$cookies.get('access_token')
      WorkShopAPI.get({
        headers: {
          access_token: access_token_val,
          workShop: 'true'
        }
      }).then(
        res => {
          if (res.data != null) {
            res.data.sort((a, b) => naturalCompare(a.number, b.number))
            this.workshopobject.push({
              value: 'All',
              text: 'All',
              firstStatusTime: res.data[0].firstStatusTime
            })
            this.btnunable = false //啟用下載按鈕
            res.data.forEach(item => {
              this.workshopobject.push({
                value: item.id,
                text: item.name,
                firstStatusTime: item.firstStatusTime
              })
            })
            if (this.workshopselected == 0) {
              //初始化預設第一個
              this.workshopname = this.$t('all') // res.data[0].name
              this.workshopselected = 'All' //res.data[0].id
            }
          }
          this.getusermail() //取得收件者設定
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    }
  }
}
</script>

<style scoped>
.rowcss {
  margin-bottom: 0.8rem;
}
.md-form {
  margin: 0px;
}
.title {
  text-align: center;
}
.test {
  height: 100vh;
  width: 100vw;
  background-color: aqua;
}
.main {
  padding: 0px;
}
</style>
