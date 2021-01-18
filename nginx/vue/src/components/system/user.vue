<template>
  <mdb-container fluid>
    <mdb-card>
      <mdb-card-body>
        <form v-on:submit.prevent="checkvalue">
          <div>
            <!-- 基本資料 -->
            <b-row class="rowcss">
              <b-col cols="2" class="title">
                <label>{{ $t('personal_page') }} :</label>
              </b-col>
            </b-row>
            <b-row class="rowcss">
              <b-col cols="2"></b-col>
              <b-col cols="3">
                <mdb-input style="width:100%" required v-model="AccountObject.account" disabled>
                  <span class="input-group-text" slot="prepend">{{ $t('account_account') }}</span>
                </mdb-input>
              </b-col>
            </b-row>
            <b-row class="rowcss">
              <b-col cols="2"></b-col>
              <b-col cols="3">
                <mdb-input
                  v-model="AccountObject.name"
                  style="width:100%"
                  :disabled="editflag"
                  required
                >
                  <span class="input-group-text" slot="prepend">{{ $t('account_name') }}</span>
                </mdb-input>
              </b-col>
            </b-row>
            <b-row class="rowcss">
              <b-col cols="2"></b-col>
              <b-col cols="3">
                <mdb-input v-model="AccountObject.rolename" style="width:100%" disabled>
                  <span class="input-group-text" slot="prepend">{{ $t('account_role') }}</span>
                </mdb-input>
              </b-col>
            </b-row>
            <b-row class="rowcss">
              <b-col cols="2"></b-col>
              <b-col cols="3">
                <mdb-input v-model="AccountObject.email" style="width:100%" :disabled="editflag">
                  <span class="input-group-text" slot="prepend">{{ $t('account_mail') }}</span>
                </mdb-input>
              </b-col>
            </b-row>
            <b-row class="rowcss">
              <b-col cols="2"></b-col>
              <b-col cols="3">
                <mdb-input
                  v-model="AccountObject.phoneNumber"
                  style="width:100%"
                  :disabled="editflag"
                >
                  <span class="input-group-text" slot="prepend">{{ $t('account_phone') }}</span>
                </mdb-input>
              </b-col>
            </b-row>

            <!-- end基本資料 -->
          </div>
          <b-row>
            <b-col cols="2"></b-col>
            <b-col cols="2" style="text-align:center;color:red">
              {{ datamessage }}
            </b-col>
          </b-row>
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
                type="button"
                v-on:click="editbtm('edit')"
              ></mdb-btn>

              <mdb-btn v-show="!editflag" size="sm" style="margin:0px" color="info" type="submit">{{
                $t('submit')
              }}</mdb-btn>
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
        </form>
        <!-- end編輯/送出/取消 -->
        <hr align="center" width="100%" />

        <div>
          <form v-on:submit.prevent="checkpw">
            <!-- 變更密碼 -->
            <b-row class="rowcss">
              <b-col cols="2" class="title">
                <label>{{ $t('change_pw') }} :</label>
              </b-col>
            </b-row>
            <b-row class="rowcss">
              <b-col cols="2"></b-col>
              <b-col cols="3">
                <mdb-btn
                  v-show="!showpw"
                  size="sm"
                  style="margin:0px"
                  icon="key"
                  color="mdb-color"
                  v-on:click="changepw()"
                  type="button"
                ></mdb-btn>
              </b-col>
            </b-row>
            <b-row class="rowcss" v-show="showpw">
              <b-col cols="2"></b-col>
              <b-col cols="3">
                <mdb-input v-model="newpw.newpw1" style="width:100%" required type="password">
                  <span class="input-group-text" slot="prepend">
                    {{ $t('account_new_pw') }}
                  </span>
                </mdb-input>
              </b-col>
            </b-row>
            <b-row class="rowcss" v-show="showpw">
              <b-col cols="2"></b-col>
              <b-col cols="3">
                <mdb-input v-model="newpw.newpw2" style="width:100%" required type="password">
                  <span class="input-group-text" slot="prepend">
                    {{ $t('account_confirm_pw') }}
                  </span>
                </mdb-input>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="2"></b-col>
              <b-col cols="2" style="text-align:center;color:red">
                {{ pwmessage }}
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="2"></b-col>
              <b-col cols="2">
                <mdb-btn v-show="showpw" size="sm" style="margin:0px" color="info" type="submit">{{
                  $t('submit')
                }}</mdb-btn>
              </b-col>
              <b-col cols="2">
                <mdb-btn
                  v-show="showpw"
                  size="sm"
                  style="margin:0px"
                  color="#000"
                  type="button"
                  @click="changepwcancle('cancel')"
                  >{{ $t('cancel') }}</mdb-btn
                >
              </b-col>
            </b-row>
          </form>
          <!-- end警示設定 -->
        </div>
        <hr align="center" width="100%" />
      </mdb-card-body>
    </mdb-card>
  </mdb-container>
  <!-- <div class="classic-form-page">
    
  </div>-->
</template>

<script>
import md5 from 'js-md5'
// import { AccountAPI, RoleAPI, ChangePwdAPI } from '@/plugins/systemapis.js'
import { RoleAPI, ChangePwdAPI, AccountAPI } from '@/plugins/systemapis.js'
export default {
  components: {},

  data() {
    var newpw = {
      newpw1: '',
      newpw2: ''
    }
    var AccountObject = {
      id: 0,
      account: '',
      avatar: '',
      email: '',
      name: '',
      passwordreal: '',
      password: '',
      phoneNumber: '',
      roleId: 0,
      status: true,
      confirmpassword: '',
      rolename: ''
    }
    return {
      ifisdefault: false, //是否為預設5個帳號
      pwmessage: '', //pw錯誤訊息
      datamessage: '', //個人資料錯誤訊息
      newpw,
      AccountObject,
      editflag: true,
      rolddata: [],
      showpw: false
    }
  },
  created() {
    this.getrole()
  },
  methods: {
    //初始化資料
    inidata() {
      var userdata = JSON.parse(localStorage.getItem('user'))
      var tempid = userdata.id
      var access_token_val = this.$cookies.get('access_token')
      AccountAPI.get({
        headers: {
          access_token: access_token_val,
          id: tempid
        }
      }).then(
        res => {
          this.AccountObject = res.data
          if (this.rolddata != null) {
            this.rolddata.forEach(item => {
              if (this.AccountObject.roleId == item.id) {
                this.AccountObject.rolename = item.name //關聯角色名稱
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
    //取得角色列
    getrole() {
      var access_token_val = this.$cookies.get('access_token')
      this.RoleOption = []
      RoleAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          if (res.data != null) {
            res.data.forEach(item => {
              if (item.id != 1) {
                this.RoleOption.push({ value: item.id, text: item.name })
              }
            })
            this.rolddata = res.data
          }
          this.inidata()
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //變更pw
    changepw() {
      this.newpw.newpw1 = ''
      this.newpw.newpw2 = ''
      this.showpw = true
    },
    //檢查pw
    checkpw() {
      if (this.newpw.newpw1 != this.newpw.newpw2) {
        this.pwmessage = this.$t('pw_not_same') //'兩次輸入的密碼不一致'
      } else {
        this.pwmessage = ''
        this.changepwcallAPI()
      }
    },
    //變更pw API
    changepwcallAPI() {
      var pw = md5(this.newpw.newpw1)
      var access_token_val = this.$cookies.get('access_token')
      ChangePwdAPI({
        headers: {
          access_token: access_token_val,
          id: this.AccountObject.id,
          password: pw
        }
      }).then(
        () => {
          this.showpw = false
          this.$layer.msg(this.$t('scuccess'))
        },
        error => {
          console.log(error.response)
        }
      )
    },
    //取消變更pw
    changepwcancle() {
      this.pwmessage = ''
      this.showpw = false
    },
    //個人資料編輯
    editbtm(value) {
      //取消變更個人資料
      if (value == 'cancel') {
        this.editflag = true
        this.getrole()
      } else {
        this.editflag = false
      }
    },
    //個人資料送出
    checkvalue() {
      var access_token_val = this.$cookies.get('access_token')
      AccountAPI.put(JSON.stringify(this.AccountObject), {
        headers: {
          access_token: access_token_val
        }
      }).then(
        () => {
          this.editflag = true
          this.datamessage = ''
          this.errormessage = ''
          this.$layer.msg(this.$t('scuccess'))
          this.getrole()
        },
        error => {
          if (error.response.data.response == 'email format error') {
            this.datamessage = '信箱格式錯誤'
          } else {
            this.datamessage = error.response.data.response
          }
          console.log(error.response)
          // this.$layer.msg(this.$t('fail') + error.response.data.response)
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
