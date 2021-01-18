<template>
  <mdb-container fluid>
    <mdb-card>
      <mdb-card-body>
        <div></div>
        <form v-on:submit.prevent="submitfunc">
          <div>
            <!-- 公司名稱 -->
            <mdb-input
              class="mb-3"
              v-model="systemsetting.company_name"
              style="width:50%"
              :disabled="editflag"
            >
              <span class="input-group-text" slot="prepend" style="width:300px">
                {{ $t('company_name') }}
              </span>
            </mdb-input>
            <!-- 預設語系 -->
            <div class="input-group" style="margin-bottom: 1rem;width:50%">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01" style="width:300px">
                  {{ $t('language') }}
                </label>
              </div>
              <b-form-select
                v-model="systemsetting.language"
                @change="onChange($event)"
                :disabled="editflag"
              >
                <option v-for="(lang, i) in langs" :key="`Lang${i}`" :value="lang">
                  {{ lang }}
                </option>
              </b-form-select>
            </div>
            <!-- 輪播頻率 -->
            <mdb-input
              class="mb-3"
              required
              type="number"
              v-model="systemsetting.dashboard_frequency"
              style="width:50%"
              :disabled="editflag"
            >
              <span class="input-group-text" slot="prepend" style="width:300px">
                {{ $t('carousel_frequency') }}
              </span>
            </mdb-input>
            <!-- 製品後綴 -->
            <mdb-input
              class="mb-3"
              v-model="systemsetting.postfix_p1"
              style="width:50%"
              :disabled="editflag"
            >
              <span class="input-group-text" slot="prepend" style="width:300px">
                {{ $t('product_suffix') }}
              </span>
            </mdb-input>
            <!-- 製品模式 -->
            <div class="input-group" style="margin-bottom: 1rem;width:50%">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01" style="width:300px">
                  {{ $t('product_suffix_mode') }}
                </label>
              </div>
              <b-form-select
                :disabled="editflag"
                v-model="systemsetting.postfix_p2"
                :options="postfix_p2_options"
              ></b-form-select>
            </div>
            <!-- 製令匯出模式 -->
            <div class="input-group" style="margin-bottom: 1rem;width:50%">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01" style="width:300px">
                  {{ $t('manufacturingorder_output_type') }}
                </label>
              </div>
              <b-form-select
                :disabled="editflag"
                v-model="systemsetting.output_manufacturingorder_type"
                :options="output_manufacturingorder_type_options"
              ></b-form-select>
            </div>
            <!-- 服務器ip -->
            <mdb-input
              class="mb-3"
              v-model="systemsetting.web_url"
              style="width:50%"
              :disabled="editflag"
            >
              <span class="input-group-text" slot="prepend" style="width:300px">
                {{ $t('server_ip') }}
              </span>
            </mdb-input>
            <!-- 每日起迄時間 -->
            <div class="input-group" style="margin-bottom: 1rem;width:50%">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01" style="width:300px">
                  {{ $t('analysis_time') }}
                </label>
              </div>
              <b-form-select
                :disabled="editflag"
                v-model="systemsetting.analyze_start"
                :options="analyze_start_options"
              ></b-form-select>
            </div>
            <!-- 自動解除推播 -->
            <div class="input-group" style="margin-bottom: 1rem;width:50%">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01" style="width:300px">
                  {{ $t('auto_relieve_notification') }}
                </label>
              </div>
              <b-form-select
                :disabled="editflag"
                v-model="systemsetting.auto_relieve_notification"
                :options="auto_relieve_notification_options"
              ></b-form-select>
            </div>
            <!-- ****** -->
          </div>
          <hr />
          <div class="mx-3" style="width:50%">
            <b-row align-v="center">
              <b-col style="text-align: center; height: 100px; overflow: hidden;">
                <div class="img_group" style="padding-top:10%">
                  <div>{{ $t('img_title_2') }}</div>
                  <div>{{ $t('img_title_2_info') }}</div>
                </div>
              </b-col>
              <b-col>
                <img :src="systemsetting.company_logo" align="middle" />
              </b-col>
              <b-col>
                <input
                  id="fileUpload"
                  type="file"
                  @change="onFileChange"
                  accept="image/jpeg, image/png"
                  hidden
                />
                <button
                  v-show="!editflag"
                  @click="chooseFiles()"
                  type="button"
                  style="background:#1E9FFF;color:#fff;  top: 20%;border-radius: 8px;
                "
                >
                  {{ $t('update_btm_title') }}
                </button>
              </b-col>
            </b-row>
          </div>
          <hr />
          <div class="mx-3" style="width:50%">
            <b-row align-v="center">
              <b-col style="text-align: center; height: 100px; overflow: hidden;">
                <div class="img_group" style="padding-top:10%">
                  <div>{{ $t('img_title_1') }}</div>
                  <div>{{ $t('img_title_1_info') }}</div>
                </div>
              </b-col>
              <b-col>
                <img :src="systemsetting.dashboard_logo" style="width:100px" />
              </b-col>
              <b-col>
                <input
                  id="fileUpload1"
                  type="file"
                  @change="onFileChange_dashboard"
                  accept="image/jpeg, image/png"
                  hidden
                />
                <button
                  v-show="!editflag"
                  @click="chooseFiles1()"
                  type="button"
                  style="background:#1E9FFF;color:#fff;  top: 20%;border-radius: 8px;
                "
                >
                  {{ $t('update_btm_title') }}
                </button>
              </b-col>
            </b-row>
          </div>
          <!-- <mdb-btn
          :disabled="!runningflag"
          color="mdb-color"
          @click="taskwindow(row.item, row.index, 'edit')"
          type="button"
          style="padding:0.4rem"
          icon="pencil-alt"
          ></mdb-btn>-->
          <mdb-btn
            v-if="editbtm"
            v-show="editflag"
            type="button"
            icon="pencil-alt"
            color="mdb-color"
            @click="edit()"
          ></mdb-btn>
          <mdb-btn v-show="!editflag" color="info" type="submit">{{ $t('submit') }}</mdb-btn>
          <mdb-btn v-show="!editflag" color="#000" type="button" @click="cancel()">
            {{ $t('cancel') }}
          </mdb-btn>
        </form>
        <hr />
      </mdb-card-body>
    </mdb-card>
  </mdb-container>
</template>

<script>
import { SystemSettingAPI, DSAPI } from '@/plugins/basicapis.js'
import { mapState } from 'vuex'
export default {
  name: 'DatatablePage',
  components: {},
  watch: {
    image: function(newVal) {
      console.log(newVal)
    }
  },
  computed: {
    ...mapState({
      authority: state => state.Authority
    })
  },
  created() {
    // this.test()
    this.iniright()
    this.getdata()
  },
  data() {
    var systemsetting = {
      company_logo: '',
      dashboard_logo: '',
      postfix_p1: '-#',
      postfix_p2: '1',
      dashboard_frequency: '15',
      company_name: '型創',
      language: '中文',
      web_rul: '',
      web_daily_report_url: '/report/daily',
      output_manufacturingorder_type: '1',
      auto_relieve_notification: 'false',
      mail_content:
        "<html><head><style>.pad {padding-left:50px;}</style><title></title></head><body><h4>To whom it may concern , </h4><h4 class='pad'>Please refer to the attached daily report for more details. </h4><h4 class='pad'>Sincerely,</h4><h4>Moloding Innovation Technology Co., Ltd.</h4><h4>Tel : +886-2-82589155</h4><h4>E-mail : info@minnotec.com</h4><table border='0' cellpadding='0' cellspacing='0' style='padding:0px;margin:0px;width:100%;'><tr><td colspan='3' height='20' style='padding:0px;margin:0px;font-size:20px;height:20px;'>&nbsp;</td></tr><tr><td style='padding:0px;margin:0px;'>&nbsp;</td><td style='padding:0px;margin:0px;' width='560'></td><td style='padding:0px;margin:0px;'>&nbsp;</td></tr><tr><td colspan='3' height='20' style='padding:0px;margin:0px;font-size:20px;height:20px;'>&nbsp;</td></tr></table></body></html>",
      mail_subject: 'IoM Daily Report',
      analyze_start: 0,
      auto_relieve_notification: false
    }
    return {
      version: '"1"',
      newbtm: false, //新增
      editbtm: false, //編輯
      deletebtm: false, //刪除
      customize1: false, //自定義一
      customize2: false, //自定義二
      customize3: false, //自定義三
      editflag: true,
      langs: ['中文', 'English'],
      language_options: [
        { text: '中文', value: '中文' },
        { text: 'English', value: 'English' }
      ],
      output_manufacturingorder_type_options: [
        { text: this.$t('multiple_page'), value: '1' }, //分頁
        { text: this.$t('one_page'), value: '2' } //合併
      ],
      auto_relieve_notification_options: [
        { text: this.$t('disable'), value: 'false' },
        { text: this.$t('actvite'), value: 'true' }
      ],
      analyze_start_options: [
        { text: 0, value: '0' },
        { text: 1, value: '1' },
        { text: 2, value: '2' },
        { text: 3, value: '3' },
        { text: 4, value: '4' },
        { text: 5, value: '5' },
        { text: 6, value: '6' },
        { text: 7, value: '7' },
        { text: 8, value: '8' },
        { text: 9, value: '9' },
        { text: 10, value: '10' },
        { text: 11, value: '11' },
        { text: 12, value: '12' },
        { text: 13, value: '13' },
        { text: 14, value: '14' },
        { text: 15, value: '15' },
        { text: 16, value: '16' },
        { text: 17, value: '17' },
        { text: 18, value: '18' },
        { text: 19, value: '19' },
        { text: 20, value: '20' },
        { text: 21, value: '21' },
        { text: 22, value: '22' },
        { text: 23, value: '23' }
      ],
      postfix_p2_options: [{ text: '1', value: '1' }],
      systemsetting,
      defectobject: {},
      image: ''
    }
  },
  methods: {
    // test() {
    //   var tempnum = []
    //   for (var i = 0; i < 10; i++) {
    //     console.log(i)
    //   }
    //   console.log(tempnum)
    //   console.log('-----')
    // },
    //設定權限
    iniright() {
      this.version = localStorage.getItem('version')

      this.authority.forEach(item => {
        if (item.name == 'system_environment') {
          if (!item.operation.includes(1)) {
            if (item.operation.includes(4)) {
              this.newbtm = true
            } //新增
            if (item.operation.includes(2)) {
              this.editbtm = true
            } //編輯
            if (item.operation.includes(3)) {
              this.deletebtm = true
            } //刪除
            if (item.operation.includes(5)) {
              this.customize1 = true
            } //自定義一
            if (item.operation.includes(6)) {
              this.customize2 = true
            } //自定義二
            if (item.operation.includes(7)) {
              this.customize3 = true
            } //自定義三
          }
        }
      })
    },
    edit() {
      this.editflag = !this.editflag
    },
    chooseFiles() {
      document.getElementById('fileUpload').click()
    },
    chooseFiles1() {
      document.getElementById('fileUpload1').click()
    },
    //取得DS
    getDS() {
      var access_token_val = this.$cookies.get('access_token')
      DSAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          if (res.data != null) {
            this.changeDSuel(res.data)
          } else {
            //無DS儲存成功
            this.editflag = !this.editflag
            this.$layer.msg(this.$t('scuccess'))
            localStorage.setItem('login', 0)
            location.reload()
          }
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //更改DSurl
    changeDSuel(data) {
      var tempnum = 0
      var access_token_val = this.$cookies.get('access_token')
      var tempstr = data[0].url
      var oldip = tempstr.substring(7, tempstr.search('/remote'))
      //ip沒有更動
      if (oldip == this.systemsetting.web_url) {
        this.editflag = !this.editflag
      } else {
        //ip更動，更改所有DSurl
        var newurl = 'http://10.10.10.100'
        if (this.systemsetting.web_url != '') {
          newurl = 'http://' + this.systemsetting.web_url
        }
        data.forEach(item => {
          item.url = newurl + item.url.substring(item.url.search('/remote'), item.url.length)

          DSAPI.put(JSON.stringify(item), {
            headers: {
              access_token: access_token_val
            }
          }).then(
            () => {
              tempnum++
              //全部DS更新完成後，重load畫面
              if (tempnum == data.length) {
                this.editflag = !this.editflag
                this.$layer.msg(this.$t('scuccess'))
                localStorage.setItem('login', 0)
                location.reload()
              }
            },
            error => {
              console.log(error.response)
              this.editflag = !this.editflag
              this.$layer.msg(this.$t('fail') + error.response.data.response)
              this.modal = false
            }
          )
        })
      }
    },
    //送出
    submitfunc() {
      var weburltemp = '/report/dailyOEE'
      if (this.version == '"2"' || this.version == '"3"') {
        weburltemp = '/report/daily'
      }
      var dailyurl = ''
      if (
        this.systemsetting.web_url == '' ||
        this.systemsetting.web_url == 'undefined' ||
        this.systemsetting.web_url == undefined
      ) {
        dailyurl = 'http://10.10.10.100' + weburltemp
      } else {
        dailyurl = 'http://' + this.systemsetting.web_url + weburltemp
      }
      var stbmitarray = [
        {
          parameter: 'company_logo',
          value: this.systemsetting.company_logo
        },
        {
          parameter: 'dashboard_logo',
          value: this.systemsetting.dashboard_logo
        },
        {
          parameter: 'postfix_p1',
          value: this.systemsetting.postfix_p1
        },
        {
          parameter: 'postfix_p2',
          value: this.systemsetting.postfix_p2
        },
        {
          parameter: 'dashboard_frequency',
          value: this.systemsetting.dashboard_frequency
        },
        {
          parameter: 'company_name',
          value: this.systemsetting.company_name
        },
        {
          parameter: 'language',
          value: this.systemsetting.language
        },
        {
          parameter: 'output_manufacturingorder_type',
          value: this.systemsetting.output_manufacturingorder_type
        },
        {
          parameter: 'web_url',
          value: this.systemsetting.web_url
        },
        {
          parameter: 'web_daily_report_url',
          value: dailyurl
        },
        {
          parameter: 'mail_content',
          value: this.systemsetting.mail_content
        },
        {
          parameter: 'mail_subject',
          value: this.systemsetting.mail_subject
        },
        {
          parameter: 'analyze_start',
          value: this.systemsetting.analyze_start
        },
        {
          parameter: 'auto_relieve_notification',
          value: this.systemsetting.auto_relieve_notification
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
          this.getDS() //檢查更改DS

          this.$layer.msg(this.$t('scuccess'))
        },
        error => {
          this.editflag = !this.editflag
          console.log(error.response)
          this.findsamedata(error.response.data.errorData)
        }
      )
    },
    cancel() {
      this.editflag = !this.editflag
      this.getdata()
    },
    onFileChange_dashboard(e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) return
      this.createImage_dashboard(files[0])
    },
    createImage_dashboard(file) {
      // var image = new Image()
      var reader = new FileReader()
      var vm = this

      reader.onload = e => {
        vm.systemsetting.dashboard_logo = e.target.result
      }
      reader.readAsDataURL(file)
    },
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files
      if (!files.length) return
      this.createImage(files[0])
    },
    createImage(file) {
      // var image = new Image()
      var reader = new FileReader()
      var vm = this

      reader.onload = e => {
        vm.systemsetting.company_logo = e.target.result
      }
      reader.readAsDataURL(file)
    },
    removeImage: function() {
      console.log(this.image)
      this.image = ''
    },
    //取得資料
    getdata() {
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
                case 'company_logo':
                  this.systemsetting.company_logo = item.value
                  break
                case 'dashboard_logo':
                  this.systemsetting.dashboard_logo = item.value
                  break
                case 'postfix_p1':
                  this.systemsetting.postfix_p1 = item.value
                  break
                case 'postfix_p2':
                  this.systemsetting.postfix_p2 = item.value
                  break
                case 'dashboard_frequency':
                  this.systemsetting.dashboard_frequency = item.value
                  break
                case 'company_name':
                  this.systemsetting.company_name = item.value
                  break
                case 'language':
                  this.systemsetting.language = item.value
                  break
                case 'output_manufacturingorder_type':
                  this.systemsetting.output_manufacturingorder_type = item.value
                  break
                case 'web_url':
                  this.systemsetting.web_url = item.value
                  break
                case 'analyze_start':
                  this.systemsetting.analyze_start = item.value
                  break
                case 'auto_relieve_notification':
                  this.systemsetting.auto_relieve_notification = item.value
                  break
              }
            })
          }
          this.iniimg()
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //預設img
    iniimg() {
      if (this.systemsetting.company_logo == '') {
        this.systemsetting.company_logo =
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABVgAAAFNCAYAAAD1rgTqAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKTWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQWaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28AAgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaOWJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHiwmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryMAgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0lYqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHiNLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYAQH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6cwR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBiewhi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1cQPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqOY4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hMWEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgohJZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSUEko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/pdLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Yb1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7OUndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsbdi97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxrPGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H08PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+Hvqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsGLww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjgR2yIuB9pGZkX+X0UKSoyqi7qUbRTdHF09yzWrORZ+2e9jvGPqYy5O9tqtnJ2Z6xqbFJsY+ybuIC4qriBeIf4RfGXEnQTJAntieTE2MQ9ieNzAudsmjOc5JpUlnRjruXcorkX5unOy553PFk1WZB8OIWYEpeyP+WDIEJQLxhP5aduTR0T8oSbhU9FvqKNolGxt7hKPJLmnVaV9jjdO31D+miGT0Z1xjMJT1IreZEZkrkj801WRNberM/ZcdktOZSclJyjUg1plrQr1zC3KLdPZisrkw3keeZtyhuTh8r35CP5c/PbFWyFTNGjtFKuUA4WTC+oK3hbGFt4uEi9SFrUM99m/ur5IwuCFny9kLBQuLCz2Lh4WfHgIr9FuxYji1MXdy4xXVK6ZHhp8NJ9y2jLspb9UOJYUlXyannc8o5Sg9KlpUMrglc0lamUycturvRauWMVYZVkVe9ql9VbVn8qF5VfrHCsqK74sEa45uJXTl/VfPV5bdra3kq3yu3rSOuk626s91m/r0q9akHV0IbwDa0b8Y3lG19tSt50oXpq9Y7NtM3KzQM1YTXtW8y2rNvyoTaj9nqdf13LVv2tq7e+2Sba1r/dd3vzDoMdFTve75TsvLUreFdrvUV99W7S7oLdjxpiG7q/5n7duEd3T8Wej3ulewf2Re/ranRvbNyvv7+yCW1SNo0eSDpw5ZuAb9qb7Zp3tXBaKg7CQeXBJ9+mfHvjUOihzsPcw83fmX+39QjrSHkr0jq/dawto22gPaG97+iMo50dXh1Hvrf/fu8x42N1xzWPV56gnSg98fnkgpPjp2Snnp1OPz3Umdx590z8mWtdUV29Z0PPnj8XdO5Mt1/3yfPe549d8Lxw9CL3Ytslt0utPa49R35w/eFIr1tv62X3y+1XPK509E3rO9Hv03/6asDVc9f41y5dn3m978bsG7duJt0cuCW69fh29u0XdwruTNxdeo94r/y+2v3qB/oP6n+0/rFlwG3g+GDAYM/DWQ/vDgmHnv6U/9OH4dJHzEfVI0YjjY+dHx8bDRq98mTOk+GnsqcTz8p+Vv9563Or59/94vtLz1j82PAL+YvPv655qfNy76uprzrHI8cfvM55PfGm/K3O233vuO+638e9H5ko/ED+UPPR+mPHp9BP9z7nfP78L/eE8/sl0p8zAAA6OWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzIgNzkuMTU5Mjg0LCAyMDE2LzA0LzE5LTEzOjEzOjQwICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgICAgICAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNS41IChXaW5kb3dzKTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8eG1wOkNyZWF0ZURhdGU+MjAxNi0xMS0wMlQxNTo1NzozMiswODowMDwveG1wOkNyZWF0ZURhdGU+CiAgICAgICAgIDx4bXA6TWV0YWRhdGFEYXRlPjIwMTYtMTEtMDJUMTU6NTc6MzIrMDg6MDA8L3htcDpNZXRhZGF0YURhdGU+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDE2LTExLTAyVDE1OjU3OjMyKzA4OjAwPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcE1NOkluc3RhbmNlSUQ+eG1wLmlpZDpkM2QzOTA4Ni02YzhlLTFjNDUtYTM4My1mNzY5NWE2YWM4NDg8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDpmNmNmZjcwYS1hMGQxLTExZTYtODVmOC05YzhiYTk0ZmU0MzM8L3htcE1NOkRvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+eG1wLmRpZDo2YzZmOWEyYi03ZGFiLTk4NDgtOTBiMy0wNDRhMDkzZTE3NjE8L3htcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOkhpc3Rvcnk+CiAgICAgICAgICAgIDxyZGY6U2VxPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5jcmVhdGVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6NmM2ZjlhMmItN2RhYi05ODQ4LTkwYjMtMDQ0YTA5M2UxNzYxPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE2LTExLTAyVDE1OjU3OjMyKzA4OjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNS41IChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6ZDNkMzkwODYtNmM4ZS0xYzQ1LWEzODMtZjc2OTVhNmFjODQ4PC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE2LTExLTAyVDE1OjU3OjMyKzA4OjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNS41IChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOlNlcT4KICAgICAgICAgPC94bXBNTTpIaXN0b3J5PgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3BuZzwvZGM6Zm9ybWF0PgogICAgICAgICA8cGhvdG9zaG9wOkNvbG9yTW9kZT4zPC9waG90b3Nob3A6Q29sb3JNb2RlPgogICAgICAgICA8cGhvdG9zaG9wOklDQ1Byb2ZpbGU+c1JHQiBJRUM2MTk2Ni0yLjE8L3Bob3Rvc2hvcDpJQ0NQcm9maWxlPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOllSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4xMzY4PC9leGlmOlBpeGVsWERpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6UGl4ZWxZRGltZW5zaW9uPjMzMzwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+aPukBQAAACBjSFJNAAB6JQAAgIMAAPn/AACA6QAAdTAAAOpgAAA6mAAAF2+SX8VGAAB2I0lEQVR42uzdd7gcVfnA8W8IoZdQJEhX+RFpETB0FGxYQA0oO+dSRLFAQCyAgh0REBuiIkFUUFHvmbVFigIK0qUEkVCjIEoPzRAgQEj5/TETCeHe5N7dmd3Z3e/nee6D5t49M/ueM7Mz7555z4j58+cjSZIkSZIkSRq+pQyBJEmSJEmSJDXGBKskSZIkSZIkNcgEqyRJkiRJkiQ1yASrJEmSJEmSJDXIBKskSZIkSZIkNcgEqyRJkiRJkiQ1yASrJEmSJEmSJDXIBKskSZIkSZIkNcgEqyRJkiRJkiQ1yASrJEmSJEmSJDXIBKskSZIkSZIkNcgEqyRJkiRJkiQ1yASrJEmSJEmSJDXIBKskSZIkSZIkNcgEqyRJkiRJkiQ1yASrJEmSJEmSJDXIBKskSZIkSZIkNcgEqyRJkiRJkiQ1yASrJEmSJEmSJDXI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'
      }
      if (this.systemsetting.dashboard_logo == '') {
        this.systemsetting.dashboard_logo =
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEcAAAA3CAYAAABeklfeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKTWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQWaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28AAgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaOWJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHiwmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryMAgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0lYqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHiNLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYAQH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6cwR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBiewhi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1cQPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqOY4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hMWEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgohJZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSUEko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/pdLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Yb1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7OUndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsbdi97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxrPGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H08PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+Hvqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsGLww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjgR2yIuB9pGZkX+X0UKSoyqi7qUbRTdHF09yzWrORZ+2e9jvGPqYy5O9tqtnJ2Z6xqbFJsY+ybuIC4qriBeIf4RfGXEnQTJAntieTE2MQ9ieNzAudsmjOc5JpUlnRjruXcorkX5unOy553PFk1WZB8OIWYEpeyP+WDIEJQLxhP5aduTR0T8oSbhU9FvqKNolGxt7hKPJLmnVaV9jjdO31D+miGT0Z1xjMJT1IreZEZkrkj801WRNberM/ZcdktOZSclJyjUg1plrQr1zC3KLdPZisrkw3keeZtyhuTh8r35CP5c/PbFWyFTNGjtFKuUA4WTC+oK3hbGFt4uEi9SFrUM99m/ur5IwuCFny9kLBQuLCz2Lh4WfHgIr9FuxYji1MXdy4xXVK6ZHhp8NJ9y2jLspb9UOJYUlXyannc8o5Sg9KlpUMrglc0lamUycturvRauWMVYZVkVe9ql9VbVn8qF5VfrHCsqK74sEa45uJXTl/VfPV5bdra3kq3yu3rSOuk626s91m/r0q9akHV0IbwDa0b8Y3lG19tSt50oXpq9Y7NtM3KzQM1YTXtW8y2rNvyoTaj9nqdf13LVv2tq7e+2Sba1r/dd3vzDoMdFTve75TsvLUreFdrvUV99W7S7oLdjxpiG7q/5n7duEd3T8Wej3ulewf2Re/ranRvbNyvv7+yCW1SNo0eSDpw5ZuAb9qb7Zp3tXBaKg7CQeXBJ9+mfHvjUOihzsPcw83fmX+39QjrSHkr0jq/dawto22gPaG97+iMo50dXh1Hvrf/fu8x42N1xzWPV56gnSg98fnkgpPjp2Snnp1OPz3Umdx590z8mWtdUV29Z0PPnj8XdO5Mt1/3yfPe549d8Lxw9CL3Ytslt0utPa49R35w/eFIr1tv62X3y+1XPK509E3rO9Hv03/6asDVc9f41y5dn3m978bsG7duJt0cuCW69fh29u0XdwruTNxdeo94r/y+2v3qB/oP6n+0/rFlwG3g+GDAYM/DWQ/vDgmHnv6U/9OH4dJHzEfVI0YjjY+dHx8bDRq98mTOk+GnsqcTz8p+Vv9563Or59/94vtLz1j82PAL+YvPv655qfNy76uprzrHI8cfvM55PfGm/K3O233vuO+638e9H5ko/ED+UPPR+mPHp9BP9z7nfP78L/eE8/sl0p8zAAA78mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxMzggNzkuMTU5ODI0LCAyMDE2LzA5LzE0LTAxOjA5OjAxICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgICAgICAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICAgICAgICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgICAgICAgICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIj4KICAgICAgICAgPHhtcDpDcmVhdG9yVG9vbD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoTWFjaW50b3NoKTwveG1wOkNyZWF0b3JUb29sPgogICAgICAgICA8eG1wOkNyZWF0ZURhdGU+MjAxNi0xMS0wMlQxNTo1ODoyNyswODowMDwveG1wOkNyZWF0ZURhdGU+CiAgICAgICAgIDx4bXA6TWV0YWRhdGFEYXRlPjIwMTYtMTItMTVUMTQ6NTk6MzcrMDg6MDA8L3htcDpNZXRhZGF0YURhdGU+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDE2LTEyLTE1VDE0OjU5OjM3KzA4OjAwPC94bXA6TW9kaWZ5RGF0ZT4KICAgICAgICAgPHhtcE1NOkluc3RhbmNlSUQ+eG1wLmlpZDozMjk1NjUxMy0zZmNiLTRhYmQtOGVlOC1lYmFiNjI4ZjJlNDY8L3htcE1NOkluc3RhbmNlSUQ+CiAgICAgICAgIDx4bXBNTTpEb2N1bWVudElEPmFkb2JlOmRvY2lkOnBob3Rvc2hvcDo2Y2E1YmM2ZS0wMzIyLTExN2EtYWI2ZC05MTFmZTEyMjY1OTA8L3htcE1NOkRvY3VtZW50SUQ+CiAgICAgICAgIDx4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ+eG1wLmRpZDozMGJmYjIxOC00Y2QxLWQ1NDctOWQ2Yi0yZThjNjZjYjUyOTQ8L3htcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOkhpc3Rvcnk+CiAgICAgICAgICAgIDxyZGY6U2VxPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5jcmVhdGVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6MzBiZmIyMTgtNGNkMS1kNTQ3LTlkNmItMmU4YzY2Y2I1Mjk0PC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE2LTExLTAyVDE1OjU4OjI3KzA4OjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNS41IChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6NmFiNmIyMzItZDBmZi1lNDRlLTg0MmEtZTk3YTBlN2RlNTQwPC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE2LTExLTAyVDE1OjU4OjI3KzA4OjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNS41IChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6MzI5NTY1MTMtM2ZjYi00YWJkLThlZTgtZWJhYjYyOGYyZTQ2PC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE2LTEyLTE1VDE0OjU5OjM3KzA4OjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNyAoTWFjaW50b3NoKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgIDwvcmRmOlNlcT4KICAgICAgICAgPC94bXBNTTpIaXN0b3J5PgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3BuZzwvZGM6Zm9ybWF0PgogICAgICAgICA8cGhvdG9zaG9wOkNvbG9yTW9kZT4zPC9waG90b3Nob3A6Q29sb3JNb2RlPgogICAgICAgICA8cGhvdG9zaG9wOklDQ1Byb2ZpbGU+c1JHQiBJRUM2MTk2Ni0yLjE8L3Bob3Rvc2hvcDpJQ0NQcm9maWxlPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj43MjAwMDAvMTAwMDA8L3RpZmY6WFJlc29sdXRpb24+CiAgICAgICAgIDx0aWZmOllSZXNvbHV0aW9uPjcyMDAwMC8xMDAwMDwvdGlmZjpZUmVzb2x1dGlvbj4KICAgICAgICAgPHRpZmY6UmVzb2x1dGlvblVuaXQ+MjwvdGlmZjpSZXNvbHV0aW9uVW5pdD4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj43MTwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj41NTwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg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'
      }
    }
  }
}
</script>

<style scoped>
.custom-select:disabled {
  color: black;
  background-color: white;
}
.img_group {
  display: table-cell;
  vertical-align: middle;
}
.ui.selection.dropdown {
  border: 0px !important;
}
img {
  width: 100%;
  margin: auto;
  display: block;
  margin-bottom: 10px;
}
.dataTables-scrollBody {
  max-height: 400px;
}
</style>
