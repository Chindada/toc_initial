<template>
  <b-container fluid>
    <mdb-card>
      <mdb-card-body>
        <!-- <div class="mx-3">
          <h2>帳號管理</h2>
        </div>-->

        <b-col lg="16" class="my-1">
          <mdb-input
            style="width:50%"
            v-model="filter"
            type="search"
            id="filterInput"
            :placeholder="
              this.$t('account_account') +
                '、' +
                this.$t('account_name') +
                '、' +
                this.$t('account_mail') +
                '、' +
                this.$t('account_phone') +
                '、' +
                this.$t('account_role')
            "
          >
            <span class="input-group-text" slot="prepend">{{ $t('search') }}</span>

            <!-- <mdb-btn size="sm" color="primary" :disabled="!filter" @click="filter = ''">清除</mdb-btn> -->
          </mdb-input>
        </b-col>

        <!-- 新增 -->
        <mdb-btn
          v-if="newbtm"
          size="sm"
          color="primary"
          v-on:click="newmoldwindow()"
          icon="plus"
          style="padding:0.5rem"
        ></mdb-btn>

        <!-- 刪除 -->
        <mdb-btn
          v-if="deletebtm"
          size="sm"
          color="danger"
          :disabled="selected ? selected == 0 : false"
          @click.native="warning = true"
          icon="trash-alt"
          style="padding:0.5rem"
        ></mdb-btn>

        <b-table
          class="accountpctableclass"
          no-border-collapse
          sticky-header="590px"
          :busy="isbusy"
          id="pc"
          responsive
          show-empty
          bordered
          :hover="true"
          selectable
          select-mode="multi"
          @row-selected="onRowSelected"
          :items="tabledata"
          :fields="fields"
          :current-page="currentPage"
          :per-page="perPage"
          :filter="filter"
          :filterIncludedFields="filterOn"
          :sort-by.sync="sortBy"
          sort-desc.sync="asc"
          :sort-direction="sortDirection"
          @filtered="onFiltered"
        >
          <template v-slot:table-busy>
            <div class="text-center my-3">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Loading...</strong>
            </div>
          </template>
          <template v-slot:cell(numberserial)="row" class="col-sm-3">{{ row.index }}</template>
          <template v-slot:cell(actions)="row">
            <!-- 編輯 -->
            <mdb-btn
              v-if="editbtm"
              color="mdb-color"
              @click="editmoldwindow(row.item, row.index, 'edit')"
              type="button"
              style="padding:0.1rem"
              icon="pencil-alt"
            ></mdb-btn>
            <!-- 變更密碼 -->
            <mdb-btn
              v-if="editbtm"
              color="mdb-color"
              @click="changepw(row.item, row.index)"
              type="button"
              style="padding:0.1rem"
              icon="key"
            ></mdb-btn>

            <mdb-btn style="width: 0px;padding: 0.1rem 0px;" icon="trash-alt"></mdb-btn>
            <!-- 固定欄高 -->
            <!-- <b-button size="sm" @click="row.toggleDetails">{{ row.detailsShowing ? '隱藏' : '顯示' }} 詳細</b-button> -->
          </template>
          <!--詳細資訊 -->
          <template v-slot:row-details="row">
            <b-card>
              <ul>
                <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
              </ul>
            </b-card>
          </template>
        </b-table>
        <b-table
          id="mobile"
          responsive
          show-empty
          bordered
          :hover="true"
          selectable
          select-mode="multi"
          @row-selected="onRowSelected"
          stacked
          :items="tabledata"
          :fields="fields"
          :current-page="currentPage"
          :per-page="perPage"
          :filter="filter"
          :filterIncludedFields="filterOn"
          :sort-by.sync="sortBy"
          sort-desc.sync="asc"
          :sort-direction="sortDirection"
          @filtered="onFiltered"
        >
          <template v-slot:cell(numberserial)="row" class="col-sm-3">{{ row.index }}</template>
          <!-- <template v-slot:cell(name)="row">{{ row.value }}</template> -->
          <!--<template v-slot:cell(checkbox)="row">
            <b-form-checkbox></b-form-checkbox>
          </template>-->

          <!-- <template v-slot:cell(actions)="row">
            <b-button size="sm" @click="moldwindow(row.item, row.index, 'edit')">編輯</b-button>
          </template>-->
          <!--詳細資訊 -->
          <template v-slot:row-details="row">
            <b-card>
              <ul>
                <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
              </ul>
            </b-card>
          </template>
        </b-table>
        <b-row>
          <b-col cols="8">
            <b-form-group
              label-align-sm="right"
              label-size="sm"
              label-for="perPageSelect"
              class="mb-0"
            >
              {{ this.$t('show_perpage_produce_1') }}
              {{ page_first }}
              {{ this.$t('show_perpage_produce_2') }}
              {{ page_last }}
              {{ this.$t('show_perpage_produce_3') }}
              {{ page_total }}
              {{ this.$t('show_perpage_produce_4') }}
              <b-form-select
                v-model="perPage"
                id="perPageSelect"
                size="sm"
                style="width:80px"
                :options="pageOptions"
              ></b-form-select>
              <span>{{ this.$t('show_perpage_produce_5') }}</span>
            </b-form-group>
          </b-col>
          <b-col>
            <b-pagination
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              align="right"
              size="lg"
              class="my-0"
            ></b-pagination>
          </b-col>
        </b-row>
      </mdb-card-body>
    </mdb-card>
    <mdb-modal centered :show="warning" @close="warning = false">
      <mdb-modal-header>
        <mdb-modal-title>{{ $t('warrning_title') }}</mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body>{{ $t('warrning_body') }}</mdb-modal-body>
      <mdb-modal-footer>
        <mdb-btn color="info" v-on:click="deletemold()" @click.native="warning = false">{{
          $t('delete')
        }}</mdb-btn>
        <mdb-btn color="0000" @click.native="warning = false">{{ $t('close') }}</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>

    <!-- 新增 -->
    <mdb-modal centered :show="newmodal" @close="closemodal($event)">
      <form v-on:submit.prevent="newsubmit">
        <mdb-modal-header>
          <mdb-modal-title>{{ operate }} {{ $t('account_account') }}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <div>
            <mdb-input class="mb-3" required v-model="AccountObject.account">
              <span class="input-group-text" slot="prepend">
                <span class="requileclass">*</span>
                {{ $t('account_account') }}
              </span>
            </mdb-input>
            <mdb-input class="mb-3" required type="password" v-model="AccountObject.passwordreal">
              <span class="input-group-text" slot="prepend">
                <span class="requileclass">*</span>
                {{ $t('account_pw') }}
              </span>
            </mdb-input>
            <mdb-input
              class="mb-3"
              required
              type="password"
              v-model="AccountObject.confirmpassword"
            >
              <span class="input-group-text" slot="prepend">
                <span class="requileclass">*</span>
                {{ $t('account_confirm_pw') }}
              </span>
            </mdb-input>
            <mdb-input class="mb-3" required v-model="AccountObject.name">
              <span class="input-group-text" slot="prepend">
                <span class="requileclass">*</span>
                {{ $t('account_name') }}
              </span>
            </mdb-input>
            <div class="input-group" style="margin-bottom: 1rem">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">
                  <span class="requileclass">*</span>
                  {{ $t('account_role') }}
                </label>
              </div>
              <b-form-select
                v-model="AccountObject.roldId"
                :options="RoleOption"
                @change="rolechange($event)"
                required
              ></b-form-select>
            </div>
            <mdb-input class="mb-3" type="email" v-model="AccountObject.email">
              <span class="input-group-text" slot="prepend">{{ $t('account_mail') }}</span>
            </mdb-input>
            <mdb-input class="mb-3" v-model="AccountObject.phoneNumber">
              <span class="input-group-text" slot="prepend">{{ $t('account_phone') }}</span>
            </mdb-input>
          </div>
          <div style="text-align:center;color:red">{{ errormessage }}</div>
        </mdb-modal-body>
        <mdb-modal-footer>
          <mdb-btn color="info" type="submit">{{ $t('submit') }}</mdb-btn>
          <mdb-btn color="0000" @click.native="newmodal = false" type="button">{{
            $t('close')
          }}</mdb-btn>
        </mdb-modal-footer>
      </form>
    </mdb-modal>
    <!-- 編輯 -->
    <mdb-modal centered :show="editmodal" @close="closemodal($event)">
      <form v-on:submit.prevent="editsubmit">
        <mdb-modal-header>
          <mdb-modal-title>{{ operate }} {{ $t('account_account') }}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <div>
            <mdb-input class="mb-3" required v-model="AccountObject.account" disabled>
              <span class="input-group-text" slot="prepend">
                <span class="requileclass">*</span>
                {{ $t('account_account') }}
              </span>
            </mdb-input>
            <mdb-input class="mb-3" required v-model="AccountObject.name" :disabled="ifisdefault">
              <span class="input-group-text" slot="prepend">
                <span class="requileclass">*</span>
                {{ $t('account_name') }}
              </span>
            </mdb-input>
            <div class="input-group" style="margin-bottom: 1rem">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">
                  <span class="requileclass">*</span>
                  {{ $t('account_role') }}
                </label>
              </div>
              <b-form-select
                :disabled="ifisdefault"
                v-model="AccountObject.roldId"
                :options="RoleOption"
                @change="rolechange($event)"
                required
              ></b-form-select>
            </div>
            <mdb-input class="mb-3" type="email" v-model="AccountObject.email">
              <span class="input-group-text" slot="prepend">{{ $t('account_mail') }}</span>
            </mdb-input>
            <mdb-input class="mb-3" v-model="AccountObject.phoneNumber">
              <span class="input-group-text" slot="prepend">{{ $t('account_phone') }}</span>
            </mdb-input>
          </div>
          <div style="text-align:center;color:red">{{ errormessage }}</div>
        </mdb-modal-body>
        <mdb-modal-footer>
          <mdb-btn color="info" type="submit">{{ $t('submit') }}</mdb-btn>
          <mdb-btn color="0000" @click.native="editmodal = false" type="button">{{
            $t('close')
          }}</mdb-btn>
        </mdb-modal-footer>
      </form>
    </mdb-modal>
    <!-- 變更密碼 -->
    <mdb-modal centered :show="changepwmodal" @close="closemodal($event)">
      <form v-on:submit.prevent="changepwsubmit">
        <mdb-modal-header>
          <mdb-modal-title>{{ $t('change_pw') }}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <div>
            <mdb-input class="mb-3" required type="password" v-model="AccountObject.passwordreal">
              <span class="input-group-text" slot="prepend">
                <span class="requileclass">*</span>
                {{ $t('account_new_pw') }}
              </span>
            </mdb-input>
            <mdb-input
              class="mb-3"
              required
              type="password"
              v-model="AccountObject.confirmpassword"
            >
              <span class="input-group-text" slot="prepend">
                <span class="requileclass">*</span>
                {{ $t('account_confirm_pw') }}
              </span>
            </mdb-input>
          </div>
          <div style="text-align:center;color:red">{{ errormessage }}</div>
        </mdb-modal-body>
        <mdb-modal-footer>
          <mdb-btn color="info" type="submit">{{ $t('submit') }}</mdb-btn>
          <mdb-btn color="0000" @click.native="changepwmodal = false" type="button">{{
            $t('close')
          }}</mdb-btn>
        </mdb-modal-footer>
      </form>
    </mdb-modal>
  </b-container>
</template>

<script>
// import naturalCompare from 'string-natural-compare'
import { mapState } from 'vuex'

import md5 from 'js-md5'
import { AccountAPI, AccountDeleteMultiAPI, RoleAPI, ChangePwdAPI } from '@/plugins/systemapis.js'
export default {
  watch: {
    currentPage: function() {
      this.setfooternum() //設定頁數
    },
    perPage: function() {
      this.setfooternum() //設定頁數
    }
  },
  components: {},
  data() {
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
      confirmpassword: ''
    }

    var AccountObjectnull = JSON.parse(JSON.stringify(AccountObject))
    return {
      page_first: 0, //第一條
      page_last: 0, //最後一筆
      page_total: 0, //總共筆數
      isbusy: true,
      errormessage: '',
      newbtm: false, //新增
      editbtm: false, //編輯
      deletebtm: false, //刪除
      customize1: false, //自定義一
      customize2: false, //自定義二
      customize3: false, //自定義三
      rolddata: [], //角色列表
      DSoption: [],
      machineoption: [],
      deletebundisable: true,
      selected: [],
      AccountObject,
      RoleOption: [], //角色option
      AccountObjectnull,
      operate: '',
      warning: false, //刪除警示
      newmodal: false, //新增
      editmodal: false, //編輯
      changepwmodal: false, //變更密碼
      ifisdefault: false, //是否為預設5個帳號
      tabledata: [],
      fields: [
        {
          key: 'account',
          label: this.$t('account_account'), //'帳號',
          sortDirection: 'desc',
          class: 'text-center',
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'name',
          label: this.$t('account_name'), //''姓名',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'email',
          label: this.$t('account_mail'), //''email',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            if (value == '') {
              return '-'
            }
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'phoneNumber',
          label: this.$t('account_phone'), //'電話',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            if (value == '') {
              return '-'
            }
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'roleName',
          label: this.$t('account_role'), //'角色',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'actions',
          label: this.$t('operating'),
          class: 'text-center',
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        }
      ],
      totalRows: 0,
      currentPage: 1,
      perPage: 100,
      pageOptions: [20, 50, 100],
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [],
      infoModal: {
        id: 'info-modal',
        title: '',
        content: ''
      }
    }
  },
  computed: {
    ...mapState({
      authority: state => state.Authority
    }),
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key }
        })
    }
  },
  mounted() {
    // Set the initial number of items
    // this.totalRows = this.items.length;
  },
  created() {
    this.iniright()
    this.getrole()
  },
  methods: {
    //設定權限
    iniright() {
      this.authority.forEach(item => {
        if (item.name == 'system_account') {
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
    //取得帳號列表
    getdata() {
      var access_token_val = this.$cookies.get('access_token')
      AccountAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          var temparray = []
          if (res.data != null) {
            if (this.rolddata != null) {
              res.data.forEach(item => {
                for (var i = 0; i < this.rolddata.length; i++) {
                  if (item.roleId == this.rolddata[i].id) {
                    item.roleName = this.rolddata[i].name
                    break
                  }
                }
                //排除root
                if (item.roleId != 1) {
                  temparray.push(item)
                }
              })
            }

            this.totalRows = temparray.length
          } else {
            this.totalRows = 0
          }
          this.tabledata = temparray
          this.setfooternum() //設定頁數
          this.isbusy = false
        },
        error => {
          this.isbusy = false
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //設定顯示第 0 到第 0 條紀錄，總共 172 條紀錄
    setfooternum() {
      this.page_total = this.dealThousands('num', this.totalRows)
      if (this.totalRows != 0) {
        //第一頁
        if (this.currentPage == 1) {
          this.page_first = 1
          if (this.totalRows >= this.perPage) {
            //非最後一頁
            this.page_last = this.perPage
          } else {
            //只有一頁
            this.page_last = this.totalRows
          }
        } else {
          //非第一頁
          this.page_first = (this.currentPage - 1) * this.perPage + 1
          if (this.totalRows - this.page_first >= this.perPage) {
            //非最後一頁
            this.page_last = this.page_first + this.perPage - 1
          } else {
            //最後一頁
            this.page_last = this.totalRows
          }
        }
      } else {
        this.page_first = 0
        this.page_last = 0
      }
      this.page_first = this.dealThousands('num', this.page_first)
      this.page_last = this.dealThousands('num', this.page_last)
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
          this.getdata() //取得帳號
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //modal背景點擊不關閉
    closemodal(value) {
      if (value == undefined) {
        this.newmodal = false
        this.warning = false
        this.editmodal = false
        this.changepwmodal = false
      }
    },

    //   resetInfoModal() {
    //     this.infoModal.title = ''
    //     this.infoModal.content = ''
    //   },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    //新增
    newmoldwindow() {
      this.AccountObject = JSON.parse(JSON.stringify(this.AccountObjectnull))
      this.operate = this.$t('new')
      this.newmodal = true
    },
    //變更角色
    rolechange(value) {
      this.AccountObject.roleId = value
    },
    //新增送出
    newsubmit() {
      //檢查密碼一致
      if (this.AccountObject.passwordreal != this.AccountObject.confirmpassword) {
        // this.AccountObject.confirmpassword = ''
        this.errormessage = this.$t('pw_not_same') //'兩次輸入的密碼不一致'
      } else {
        this.errormessage = ''
        this.AccountObject.password = md5(this.AccountObject.passwordreal)
        this.callnewAPI()
      }
    },
    //新增送出
    callnewAPI() {
      var access_token_val = this.$cookies.get('access_token')
      AccountAPI.post(JSON.stringify(this.AccountObject), {
        headers: {
          access_token: access_token_val
        }
      }).then(
        () => {
          this.newmodal = false
          this.errormessage = ''
          this.$layer.msg(this.$t('scuccess'))
          this.isbusy = true
          this.getrole()
        },
        error => {
          if (
            error.response.data.response == "Error 1062: Duplicate entry 'admin' for key 'account'"
          ) {
            this.errormessage = this.$t('account_existed') //'帳號以已存在'
          } else {
            console.log(error.response)
          }
        }
      )
    },
    //編輯
    editmoldwindow(item) {
      this.AccountObject = JSON.parse(JSON.stringify(item))
      if (item.id < 5) {
        this.ifisdefault = true
      } else {
        this.ifisdefault = false
      }
      this.operate = this.$t('edit')
      this.AccountObject.roldId = item.roleId
      this.editmodal = true
    },
    //編輯送出
    editsubmit() {
      var access_token_val = this.$cookies.get('access_token')
      AccountAPI.put(JSON.stringify(this.AccountObject), {
        headers: {
          access_token: access_token_val
        }
      }).then(
        () => {
          this.editmodal = false
          this.errormessage = ''
          this.$layer.msg(this.$t('scuccess'))

          this.isbusy = true
          this.getrole()
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
          this.editmodal = false
        }
      )
    },
    //變更密碼
    changepw(item) {
      this.AccountObject = JSON.parse(JSON.stringify(item))
      this.changepwmodal = true
    },
    //變更密碼送出
    changepwsubmit() {
      if (this.AccountObject.passwordreal != this.AccountObject.confirmpassword) {
        // this.AccountObject.confirmpassword = ''
        this.errormessage = this.$t('pw_not_same') //'兩次輸入的密碼不一致'
      } else {
        this.errormessage = ''
        var pw = md5(this.AccountObject.passwordreal)
        var access_token_val = this.$cookies.get('access_token')
        ChangePwdAPI({
          headers: {
            access_token: access_token_val,
            id: this.AccountObject.id,
            password: pw
          }
        }).then(
          () => {
            this.changepwmodal = false
            this.$layer.msg(this.$t('scuccess'))
          },
          error => {
            console.log(error.response)
          }
        )
      }
    },

    // 刪除
    deletemold() {
      var access_token_val = this.$cookies.get('access_token')
      let temparray = []

      // //預設5個帳號不能刪
      this.selected.forEach(item => {
        if (item.id > 5) {
          temparray.push(item)
        }
      })

      AccountDeleteMultiAPI.delete({
        headers: {
          access_token: access_token_val,
          ids: this.selectedArrayToString(temparray)
        }
      }).then(
        () => {
          this.modal = false
          this.$layer.msg(this.$t('scuccess'))
          this.isbusy = true
          this.getrole()
        },
        error => {
          console.log(error.response.data.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
          this.modal = false
        }
      )
    },
    //複選
    onRowSelected(items) {
      this.selected = items
      this.deletebundisable = false
    },
    // selectAllRows() {
    //   this.$refs.selectableTable.selectAllRows();
    // },
    clearSelected() {
      this.$refs.selectableTable.clearSelected()
    },
    selectThirdRow() {
      // Rows are indexed from 0, so the third row is index 2
      this.$refs.selectableTable.selectRow(2)
    },
    unselectThirdRow() {
      // Rows are indexed from 0, so the third row is index 2
      this.$refs.selectableTable.unselectRow(2)
    }
  }
}
</script>
<style>
.accountpctableclass {
  max-height: calc(100vh - 305px) !important;
}
.moldnumberclass {
  max-width: 30px;
  text-align: center;
}
table.table td {
  vertical-align: middle;
  padding-top: 0;
  padding-bottom: 0rem;
}
#mobile {
  display: none;
}
@media (max-width: 768px) {
  #pc {
    display: none;
  }
  #mobile {
    display: block;
  }
}
</style>
