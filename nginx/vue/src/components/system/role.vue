<template>
  <b-container fluid>
    <mdb-card>
      <mdb-card-body>
        <!-- <div class="mx-3">
          <h2>角色管理</h2>
        </div>-->
        <!-- <b-col lg="16" class="my-1">
          <mdb-input style="width:50%" v-model="filter" type="search" id="filterInput" placeholder>
            <span class="input-group-text" slot="prepend">{{ $t('search') }}</span>
          </mdb-input>
        </b-col>-->

        <b-tabs
          active-nav-item-class="font-weight-bold text-uppercase "
          active-tab-class="font-weight-bold"
        >
          <!-- 角色列表 -->
          <b-tab :title="this.$t('role_list')" active style="padding-top:0">
            <div style="padding-top: 0.2rem;">
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
              <!-- <mdb-btn
              v-if="deletebtm"
              size="sm"
              color="danger"
              :disabled="selected ? selected == 0 : false"
              @click.native="warning = true"
              icon="trash-alt"
              style="padding:0.5rem"
              ></mdb-btn>-->
              <b-table
                class="rolepctableclass"
                no-border-collapse
                sticky-header="590px"
                :busy="isbusy"
                id="pc"
                responsive
                show-empty
                bordered
                :hover="true"
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
                <template v-slot:cell(numberserial)="row" class="col-sm-3">{{
                  row.index
                }}</template>
                <!-- <template v-slot:cell(name)="row">{{ row.value }}</template> -->
                <!--<template v-slot:cell(checkbox)="row">
            <b-form-checkbox></b-form-checkbox>
                </template>-->

                <template v-slot:cell(actions)="row">
                  <!-- {{ row.item }} -->
                  <!-- 編輯 -->
                  <mdb-btn
                    v-if="editbtm"
                    color="mdb-color"
                    @click="editmoldwindow(row.item, row.index, 'edit')"
                    type="button"
                    style="padding:0.1rem"
                    icon="pencil-alt"
                  ></mdb-btn>
                  <!-- 刪除 -->
                  <mdb-btn
                    v-if="deletebtm && row.item.id > 5"
                    color="danger"
                    type="button"
                    @click="deletefunc(row.item, row.index, 'delete')"
                    icon="trash-alt"
                    style="padding:0.1rem"
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
                <template v-slot:cell(numberserial)="row" class="col-sm-3">{{
                  row.index
                }}</template>
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
                <b-col cols="8" style="font-weight: 400;">
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
            </div>
          </b-tab>
          <!-- end角色列表 -->
          <!-- 角色定義 -->
          <b-tab
            :title="this.$t('role_definition')"
            active
            style="padding-top:0"
            @click="clicktab()"
          >
            <div style="padding-top: 0.2rem;">
              <roledef-tab :key="reloadnum"></roledef-tab>
            </div>
          </b-tab>
          <!-- end角色定義 -->
        </b-tabs>
      </mdb-card-body>
    </mdb-card>
    <mdb-modal centered :show="warning" @close="warning = false">
      <mdb-modal-header>
        <mdb-modal-title>{{ $t('warrning_title') }}</mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body>{{ $t('warrning_body') }}</mdb-modal-body>
      <mdb-modal-footer>
        <span style="color:red">{{ errormes }}</span>
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
          <mdb-modal-title>{{ operate }} {{ $t('account_role') }}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <div>
            <mdb-input class="mb-3" required v-model="roleObject.name">
              <span class="input-group-text" slot="prepend">
                <span class="requileclass">*</span>
                {{ $t('account_role') }}
              </span>
            </mdb-input>
          </div>
          <div>
            <mdb-input class="mb-3" required v-model="roleObject.remark">
              <span class="input-group-text" slot="prepend">
                <span class="requileclass">*</span>
                {{ $t('role_explanation') }}
              </span>
            </mdb-input>
          </div>
          <div class="input-group" style="margin-bottom: 1rem">
            <div class="input-group-prepend">
              <label class="input-group-text" for="inputGroupSelect01">{{ $t('role_copy') }}</label>
            </div>
            <b-form-select
              v-model="roleObject.copyRoleId"
              :options="copyRoleIdoption"
              required
            ></b-form-select>
          </div>
          <div class="input-group" style="margin-bottom: 1rem">
            <div class="input-group-prepend">
              <label class="input-group-text" for="inputGroupSelect01">
                <span class="requileclass">*</span>
                {{ $t('actvite') }}
              </label>
            </div>
            <b-form-select v-model="roleObject.isEnable" :options="disableoption"></b-form-select>
          </div>
        </mdb-modal-body>
        <mdb-modal-footer>
          <span style="color:red">{{ errormes }}</span>
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
          <mdb-modal-title>{{ operate }} {{ $t('account_role') }}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <div v-if="roleObject.id <= 5">
            <mdb-input
              class="mb-3"
              required
              v-model="roleObject.name"
              :disabled="roleObject.inputdisable"
              style="background-color:#e9ecef;"
            >
              <span class="input-group-text" slot="prepend">
                <span class="requileclass">*</span>
                {{ $t('account_role') }}
              </span>
            </mdb-input>
          </div>
          <div v-if="roleObject.id > 5">
            <mdb-input class="mb-3" required v-model="roleObject.name">
              <span class="input-group-text" slot="prepend">
                <span class="requileclass">*</span>
                {{ $t('account_role') }}
              </span>
            </mdb-input>
          </div>
          <div>
            <mdb-input class="mb-3" required v-model="roleObject.remark">
              <span class="input-group-text" slot="prepend">
                <span class="requileclass">*</span>
                {{ $t('role_explanation') }}
              </span>
            </mdb-input>
          </div>
          <div class="input-group" style="margin-bottom: 1rem">
            <div class="input-group-prepend">
              <label class="input-group-text" for="inputGroupSelect01">
                <span class="requileclass">*</span>
                {{ $t('actvite') }}
              </label>
            </div>
            <b-form-select
              v-model="roleObject.isEnable"
              :options="disableoption"
              required
            ></b-form-select>
          </div>
        </mdb-modal-body>
        <mdb-modal-footer>
          <span style="color:red">{{ errormes }}</span>
          <mdb-btn color="info" type="submit">{{ $t('submit') }}</mdb-btn>
          <mdb-btn color="0000" @click.native="editmodal = false" type="button">{{
            $t('close')
          }}</mdb-btn>
        </mdb-modal-footer>
      </form>
    </mdb-modal>
    <!--權限資源 -->
    <mdb-modal centered :show="changerightmodal" @close="closemodal($event)">
      <form v-on:submit.prevent="changerightsubmit">
        <mdb-modal-header>
          <mdb-modal-title>{{ $t('role_resources') }}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <!-- {{ selectresource }}
          {{ roleresource }}-->
          <el-tree
            :data="RoleResourceData"
            show-checkbox
            node-key="id"
            ref="selectdata"
            :expand-on-click-node="false"
            :default-expanded-keys="unfold"
            :default-checked-keys="selectresource"
            :props="defaultProps"
          ></el-tree>
          <div>
            <!-- <el-button type="button" @click="test(1)">展開</el-button>
            <el-button type="button" @click="test(2)">收縮</el-button>-->
            <!-- <el-button type="button" @click="getCheckedNodes">test1</el-button>
            <el-button type="button" @click="getCheckedKeys">test2</el-button>-->
          </div>
        </mdb-modal-body>
        <mdb-modal-footer>
          <span style="color:red">{{ errormes }}</span>
          <mdb-btn color="info" type="submit">{{ $t('submit') }}</mdb-btn>
          <mdb-btn color="0000" @click.native="changerightmodal = false" type="button">{{
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

import Roledef from '@/components/system/roledef'
import { RoleAPI, RoleResourceAPI, ResourceAPI } from '@/plugins/systemapis.js'
export default {
  watch: {
    currentPage: function() {
      this.setfooternum() //設定頁數
    },
    perPage: function() {
      this.setfooternum() //設定頁數
    }
  },
  components: {
    'roledef-tab': Roledef
  },
  data() {
    var roleObject = {
      id: 0,
      name: '', //名稱
      remark: '', //說明
      count: 0, //使用者數量
      createdTime: 0, //建立時間
      lastupdateTime: 0, //修改時間
      seq: 0,
      isEnable: true //啟用/停用
    }
    var disableoption = [
      { text: this.$t('disable'), value: false }, //停用
      { text: this.$t('actvite'), value: true } //啟用
    ]

    var roleObjectnull = JSON.parse(JSON.stringify(roleObject))
    return {
      errormes: '', //錯誤訊息
      page_first: 0, //第一條
      page_last: 0, //最後一筆
      page_total: 0, //總共筆數
      isbusy: true,
      copyRoleIdoption: [], //新增複製id選單
      disableoption,
      reloadnum: 0, //加載num
      selectid: 0, //編輯id
      AllResource: [], //全部資源
      unfold: [], //展開收縮
      unfoldAll: [], //展開alldata
      selectresource: [], //選擇的資源
      roleresource: [], //角色權限資源
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
      roleObject,
      RoleOption: [], //角色option
      roleObjectnull,
      operate: '',
      warning: false, //刪除警示
      newmodal: false, //新增
      editmodal: false, //編輯
      changerightmodal: false, //分配角色權限資源視窗
      ifisdefault: false, //是否為預設5個帳號
      tabledata: [],
      fields: [
        {
          key: 'name',
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
          key: 'count',
          label: this.$t('role_used_num'), //'使用者數量',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'remark',
          label: this.$t('role_explanation'), //'說明',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle remarkstyle'
        },
        {
          key: 'isEnable',
          label: this.$t('actvite') + ' / ' + this.$t('disable'), //'啟用/停用',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            if (value) {
              return this.$t('actvite')
            } else {
              return this.$t('disable')
            }
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'createdTime',
          label: this.$t('new_time'), //'建立時間',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            if (value == null || value == 0) {
              return '-'
            }
            return this.timeStampToStringFunc(value, 'yyyy-mm-dd') //timestamp2date
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'lastupdateTime',
          label: this.$t('last_edit_time'), //'修改時間',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            if (value == null || value == 0) {
              return '-'
            }
            return this.timeStampToStringFunc(value, 'yyyy-mm-dd') //timestamp2date
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'actions',
          thStyle: 'width:20%',
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
      },
      RoleResourceData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
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
    this.getAllResource()
    this.getrole()
  },
  methods: {
    getCheckedNodes() {
      console.log(this.$refs.selectdata.getCheckedNodes())
    },
    getCheckedKeys() {
      console.log(this.$refs.selectdata.getCheckedKeys())
    },
    test(num) {
      if (num == 1) {
        this.unfold = this.unfoldAll
      } else {
        this.unfold = []
      }
    },
    //設定權限
    iniright() {
      this.authority.forEach(item => {
        if (item.name == 'system_role') {
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
    //重新加載
    clicktab() {
      this.reloadnum += 1
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
            var temparray = []
            this.copyRoleIdoption = [{ text: '', value: 0 }]
            res.data.forEach(item => {
              if (item.name != 'root' && item.id != 1) {
                temparray.push(item)
                this.copyRoleIdoption.push({ text: item.name, value: item.id })
              }
            })
            temparray.forEach(item => {
              if (item.id != 1) {
                this.RoleOption.push({ value: item.id, text: item.name })
              }
            })
            // this.rolddata = res.data
          }
          this.tabledata = temparray
          this.totalRows = temparray.length

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
    //modal背景點擊不關閉
    closemodal(value) {
      if (value == undefined) {
        this.newmodal = false
        this.warning = false
        this.editmodal = false
        this.changerightmodal = false
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
      this.roleObject = JSON.parse(JSON.stringify(this.roleObjectnull))
      this.operate = this.$t('new')

      this.errormes = ''
      this.newmodal = true
    },
    //變更角色
    rolechange(value) {
      this.roleObject.roleId = value
    },
    //新增送出
    newsubmit() {
      this.callnewAPI()
    },
    //新增送出
    callnewAPI() {
      var access_token_val = this.$cookies.get('access_token')
      RoleAPI.post(JSON.stringify(this.roleObject), {
        headers: {
          access_token: access_token_val,
          roleId: this.roleObject.copyRoleId
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
          console.log(error.response)
          if (error.response.data.response == 'role name duplicate') {
            this.errormes = this.$t('role_existed')
          } else {
            this.errormes = error.response.data.response
          }

          // this.$layer.msg(this.$t('fail') + error.response.data.response)
          // this.editmodal = false
        }
      )
    },
    //編輯
    editmoldwindow(item) {
      if (item.id > 5) {
        item.inputdisable = false
      } else {
        item.inputdisable = true
      }
      this.roleObject = JSON.parse(JSON.stringify(item))
      this.operate = this.$t('edit')
      this.roleObject.roldId = item.roleId
      this.errormes = ''
      this.editmodal = true
    },
    //編輯送出
    editsubmit() {
      var access_token_val = this.$cookies.get('access_token')
      RoleAPI.put(JSON.stringify(this.roleObject), {
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
          if (error.response.data.response == 'role name duplicate') {
            this.errormes = this.$t('role_existed')
          } else {
            this.errormes = error.response.data.response
          }
          // this.$layer.msg(this.$t('fail') + error.response.data.response)
          // this.editmodal = false
        }
      )
    },
    //分配權限
    changeright(item) {
      this.selectid = item.id
      // this.roleObject = JSON.parse(JSON.stringify(item))
      this.getresource(item.id)
    },
    //取得角色資源權限
    getresource(roleid) {
      ResourceAPI
      var access_token_val = this.$cookies.get('access_token')
      RoleResourceAPI.get({
        headers: {
          id: roleid,
          access_token: access_token_val
        }
      }).then(
        res => {
          // console.log(res.data)
          // console.log(this.AllResource)
          this.roleresource = res.data
          this.roleResourceReal(this.roleresource)
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
          this.editmodal = false
        }
      )
    },
    //角色資源關聯
    roleResourceReal(userdata) {
      var temparray = []
      var tempallresource = JSON.parse(JSON.stringify(this.AllResource))

      var leveltointarray = this.stringtointarray(tempallresource) //level to int array ，int array to tree
      var allresourceTree = this.dealdata(leveltointarray) //處理全部資源成樹狀圖結構
      this.selectresource = this.dealuserdatat(leveltointarray, userdata) //處理user已設定資源
      // console.log(this.selectresource)
      temparray = allresourceTree
      this.RoleResourceData = temparray
      this.changerightmodal = true //顯示視窗
    },

    //處理user已設定資源
    dealuserdatat(allresource, userdata) {
      // console.log(userdata)
      if (userdata == null) {
        return null
      }
      var temparray = []
      var exisfalg = false
      userdata.forEach(item => {
        //排除人員管理排程、排班、假日
        if (item.resourceId != 69 && item.resourceId != 70 && item.resourceId != 71) {
          temparray.forEach((resitem, index) => {
            if (item.resourceId == resitem.id) {
              exisfalg = true
              temparray[index].operation.push(item.operation)
            }
          })
          if (!exisfalg) {
            temparray.push({ id: item.resourceId, operation: [item.operation] })
          } else {
            exisfalg = false
          }
        }
      })

      var temparray1 = []
      var allresourcearray = []
      temparray.forEach(item => {
        item.operation = this.clearrepeat(item.operation) //去重複
        var tempflag = false
        allresource.forEach(allresourceitem => {
          allresourcearray[allresourceitem.id] = allresourceitem
          if (allresourceitem.level.indexOf(item.id) != -1 && allresourceitem.level.length > 1) {
            if (
              allresourceitem.level.indexOf(item.id) == 0 &&
              allresourceitem.icon != 'read' &&
              allresourceitem.icon != 'new' &&
              allresourceitem.icon != 'edit' &&
              allresourceitem.icon != 'delete' &&
              allresourceitem.icon != 'cos5' &&
              allresourceitem.icon != 'cos6' &&
              allresourceitem.icon != 'cos7'
            ) {
              tempflag = true
            }
          }
        })

        if (!tempflag) {
          var tempflag1 = false
          item.operation.forEach(operationitem => {
            var tempobject = allresourcearray[item.id + operationitem]
            if (tempobject.level.indexOf(item.id) != -1) {
              temparray1.push(item.id + operationitem)
              tempflag1 = true
            }
          })
          //無操作頁面
          if (!tempflag1) {
            temparray1.push(item.id)
          }
        }
      })
      return temparray1
    },
    //去重複
    clearrepeat(data) {
      var tempoperation = new Set()
      var repeat = new Set()
      data.forEach(item => {
        tempoperation.has(item) ? repeat.add(item) : tempoperation.add(item)
      })

      return Array.from(tempoperation, x => x)
    },

    //處理全部資源成樹狀圖結構
    dealdata(testdata) {
      var temparray = []
      this.unfoldAll = []

      //設置第一層
      testdata.forEach(item => {
        if (item.level.length == 1) {
          // temparray.push({ id: item.id, label: this.$t(item.name) })
          if (item.level[0] != 0) {
            // this.unfoldAll.push(item.id)

            temparray.push({
              id: item.id,
              label: this.$t(item.name),
              children: [],
              level: item.level,
              isoperate: false
            })
          }
        }
      })
      //設置第二層
      testdata.forEach(item => {
        if (item.level.length == 2) {
          for (var i = 0; i < temparray.length; i++) {
            if (item.level[0] == temparray[i].id) {
              if (item.seq == 0) {
                //operate
                temparray[i].children.push({
                  id: item.id,
                  label: this.$t(item.name),
                  level: item.level,
                  children: [],
                  isoperate: true,
                  icon: item.icon
                })
              } else {
                temparray[i].children.push({
                  id: item.id,
                  label: this.$t(item.name),
                  level: item.level,
                  children: [],
                  isoperate: false
                })
              }

              break
            }
          }
        }
      })
      //設置第三層
      testdata.forEach(item => {
        if (item.level.length == 3) {
          for (var i = 0; i < temparray.length; i++) {
            for (var j = 0; j < temparray[i].children.length; j++) {
              if (item.level[1] == temparray[i].children[j].id) {
                if (item.seq == 0) {
                  temparray[i].children[j].children.push({
                    id: item.id,
                    label: this.$t(item.name),
                    level: item.level,
                    isoperate: true,
                    icon: item.icon
                  })
                } else {
                  temparray[i].children[j].children.push({
                    id: item.id,
                    label: this.$t(item.name),
                    level: item.level,
                    isoperate: false
                  })
                }
              }
            }
          }
        }
      })

      return temparray
    },

    //字串轉int array
    stringtointarray(data) {
      data.forEach(item => {
        item.level = item.level.split(',').map(Number)
      })
      return data
    },
    //取得全部資源
    getAllResource() {
      var access_token_val = this.$cookies.get('access_token')
      ResourceAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          this.AllResource = res.data
        },
        error => {
          console.log(error.response)
          // this.$layer.msg(this.$t('fail') + error.response.data.response)
          // this.editmodal = false
        }
      )
    },
    //分配資源送出
    changerightsubmit() {
      var temparray = [] //isoperate
      var submitobject = { resource: [], roleId: this.selectid }
      var selsectObject = this.$refs.selectdata.getCheckedNodes() //取得選擇object
      // console.log(selsectObject)
      //設定頁面資源
      selsectObject.forEach(item => {
        if (!item.isoperate) {
          submitobject.resource.push({ id: item.id, operation: [] })
          if (item.level > 1) {
            for (var i = item.level.length - 2; i >= 0; i--) {
              submitobject.resource.push({ id: item.level[i], operation: [1] })
            }
          }
        } else {
          temparray.push(item)
        }
      })
      //設定操作
      temparray.forEach(item => {
        var parentlayerid = item.level[item.level.length - 2]

        var tempflag = false
        for (var i = 0; i < submitobject.resource.length; i++) {
          if (parentlayerid == submitobject.resource[i].id) {
            submitobject.resource[i].operation.push(this.operationclass(item.icon))
          }
        }
        if (!tempflag) {
          for (var i = 0; i < item.level.length - 2; i++) {
            submitobject.resource.push({
              id: item.level[i],
              operation: [1]
            })
          }
          submitobject.resource.push({
            id: item.level[item.level.length - 2],
            operation: [this.operationclass(item.icon)]
          })
        }
      })

      //未有操作頁面補read
      submitobject.resource.forEach(item => {
        if (item.operation.length == 0) {
          item.operation.push(1)
        } else if (item.operation.length > 1) {
          if (item.operation.includes(1)) {
            item.operation = item.operation.slice(1, item.operation.length)
          }
        }
      })
      //去重複
      var temparray = { resource: [] }
      submitobject.resource.forEach(item => {
        var tempfalg = false
        temparray.resource.forEach(tempitem => {
          if (tempitem.id == item.id) {
            //已存在
            tempfalg = true
          }
        })
        if (!tempfalg) {
          temparray.resource.push(item)
          tempfalg = false
        }
      })
      submitobject.resource = temparray.resource
      this.callroleresourceAPI(submitobject)
    },
    //API送出
    callroleresourceAPI(data) {
      var access_token_val = this.$cookies.get('access_token')
      RoleResourceAPI.put(JSON.stringify(data), {
        headers: {
          access_token: access_token_val
        }
      }).then(
        () => {
          this.changerightmodal = false
          this.$layer.msg(this.$t('scuccess'))
        },
        error => {
          console.log(error.response.data.response)
        }
      )
    },
    //操作類型
    operationclass(value) {
      switch (value) {
        case 'read':
          return 1
        case 'edit':
          return 2
        case 'delete':
          return 3
        case 'new':
          return 4
        case 'cos5':
          return 5
        case 'cos6':
          return 6
        case 'cos7':
          return 7
      }
    },
    //選取刪除選項，顯示確認視窗
    deletefunc(item) {
      this.selected = []
      this.selected.push(item)
      this.errormes = ''
      this.warning = true
    },

    // 刪除
    deletemold() {
      var tempnum = 0
      var access_token_val = this.$cookies.get('access_token')
      this.selected.forEach(item => {
        //預設5個帳號不能刪
        if (item.id > 5) {
          RoleAPI.delete({
            headers: {
              access_token: access_token_val,
              id: item.id
            }
          }).then(
            () => {
              tempnum++
              if (tempnum == this.selected.length) {
                this.modal = false
                this.$layer.msg(this.$t('scuccess'))
                this.isbusy = true
                this.getrole()
              }
            },
            error => {
              console.log(error.response.data.response)
              this.errormes = error.response.data.response
              // this.$layer.msg(this.$t('fail') + error.response.data.response)
              // this.modal = false
            }
          )
        } else {
          tempnum++
        }
      })
    },
    //複選
    onRowSelected(items) {
      this.selected = items
      console.log(items)
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
.rolepctableclass {
  max-height: calc(100vh - 285px) !important;
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
