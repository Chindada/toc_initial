<template>
  <b-container fluid>
    <mdb-card>
      <mdb-card-body>
        <!-- <div class="mx-3">
          <h2>入庫管理</h2>
        </div>-->

        <b-row>
          <b-col cols="8">
            <mdb-input
              style="width:80%;margin-bottom:0.8rem"
              v-model="filter"
              type="search"
              id="filterInput"
              :placeholder="
                this.$t('storage_sernumber') +
                  '、' +
                  this.$t('schedule_number') +
                  '、' +
                  this.$t('mold') +
                  '、' +
                  this.$t('remark')
              "
            >
              <span class="input-group-text" slot="prepend">{{ $t('search') }}</span>

              <!-- <mdb-btn size="sm" color="primary" :disabled="!filter" @click="filter = ''">清除</mdb-btn> -->
            </mdb-input>
          </b-col>
          <b-col>
            <div class="input-group">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01" style="width:160px">
                  {{ $t('workshop_machine') }}
                </label>
              </div>
              <b-form-select
                v-model="scearchworkshop"
                :options="workshopobject"
                @change="searchdata()"
                :disabled="isbusy"
              ></b-form-select>
            </div>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <!-- 新增 -->
            <mdb-btn
              v-if="newbtm"
              size="sm"
              color="primary"
              v-on:click="storagewindow([], [], 'new')"
              icon="plus"
              style="padding:0.5rem"
            ></mdb-btn>
            <!-- 刪除 -->
            <mdb-btn
              v-if="deletebtm"
              size="sm"
              color="danger"
              :disabled="selected ? selected == 0 : false"
              @click.native="
                warning = true
                deletemode = 1
              "
              icon="trash-alt"
              style="padding:0.5rem"
            ></mdb-btn>
          </b-col>
          <b-col></b-col>
          <b-col cols="4">
            <div class="input-group">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01" style="width:160px">{{
                  $t('produce_time_type')
                }}</label>
              </div>
              <b-form-select
                v-model="scearchtime"
                :options="timeobject"
                @change="searchdata()"
                :disabled="isbusy"
              ></b-form-select>
            </div>
          </b-col>
        </b-row>
        <br />
        <b-table
          class="storagepctableclass"
          no-border-collapse
          sticky-header="650px"
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
          <!-- <template v-slot:cell(name)="row">{{ row.value }}</template> -->
          <!--<template v-slot:cell(checkbox)="row">
            <b-form-checkbox></b-form-checkbox>
          </template>-->

          <template v-slot:cell(actions)="row">
            <!-- 編輯 -->
            <mdb-btn
              v-if="editbtm"
              color="mdb-color"
              @click="storagewindow(row.item, row.index, 'edit')"
              type="button"
              style="padding:0.1rem"
              icon="pencil-alt"
            ></mdb-btn>
            <mdb-btn
              v-if="!row.detailsShowing"
              color="mdb-color"
              @click="row.toggleDetails"
              type="button"
              style="padding:0.1rem"
              icon="chevron-down"
            ></mdb-btn>
            <mdb-btn
              v-if="row.detailsShowing"
              color="mdb-color"
              @click="row.toggleDetails"
              type="button"
              style="padding:0.1rem"
              icon="chevron-up"
            ></mdb-btn>
            <!-- <b-button size="sm" @click="row.toggleDetails"
              >{{ row.detailsShowing ? '隱藏' : '顯示' }} 詳細</b-button
            >-->
          </template>
          <!--詳細資訊 -->
          <template v-slot:row-details="row">
            <b-card>
              <div v-for="(value, key) in row.item.defect" :key="key">
                <b-row>
                  <b-col lg="2">{{ $t('defect_name') }}: {{ value.defectName }}</b-col>
                  <b-col lg="2">{{ $t('number') }}: {{ value.number }}</b-col>
                </b-row>
                <hr />
              </div>
              <!-- <ul>
                <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
              </ul>-->
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
            <b-button size="sm" @click="storagewindow(row.item, row.index, 'edit')">編輯</b-button>
            <b-button size="sm" @click="row.toggleDetails">{{ row.detailsShowing ? '隱藏' : '顯示' }} 詳細</b-button>
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
        <mdb-btn color="info" v-on:click="deletemold()" @click.native="warning = false">
          {{ $t('delete') }}
        </mdb-btn>
        <mdb-btn color="0000" @click.native="warning = false">{{ $t('close') }}</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>

    <mdb-modal :show="modal" @close="closemodal($event)" size="lg">
      <form v-on:submit.prevent="submitcheckfunc">
        <mdb-modal-header>
          <mdb-modal-title>{{ operate }} {{ $t('storage') }}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <div>
            <b-row>
              <b-col>
                <div class="input-group">
                  <mdb-input
                    :disabled="true"
                    :show="modal"
                    class="mb-3"
                    v-model="storageobject.serialNumber"
                  >
                    <span class="input-group-text" required slot="prepend">
                      {{ $t('storage_sernumber') }}
                    </span>
                  </mdb-input>
                </div>
              </b-col>
              <b-col>
                <div class="input-group" style="margin-bottom: 1rem">
                  <div class="input-group-prepend">
                    <label class="input-group-text" for="inputGroupSelect01">
                      <span class="requileclass">*</span>
                      {{ $t('schedule_number') }}
                    </label>
                  </div>
                  <div class="form-control selsect">
                    <model-select
                      :isDisabled="editmode"
                      v-model="storageobject.taskId"
                      :options="scheduleoption"
                      :isError="no_task_select"
                    ></model-select>
                  </div>
                </div>
                <!-- <mdb-input class="mb-3" required v-model="storageobject.machineName">
                  <span class="input-group-text" slot="prepend">排程編號</span>
                </mdb-input>-->
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <mdb-input class="mb-3" v-model="storageobject.normalNumber" type="number" :min="0">
                  <span class="input-group-text" slot="prepend">{{ $t('normal_number') }}</span>
                </mdb-input>
              </b-col>
              <b-col>
                <mdb-input
                  class="mb-3"
                  v-model="storageobject.abnormalNumber"
                  type="number"
                  :min="0"
                >
                  <span class="input-group-text" slot="prepend">{{ $t('abnormal_number') }}</span>
                </mdb-input>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <mdb-input class="mb-3" v-model="storageobject.remark">
                  <span class="input-group-text" slot="prepend">{{ $t('remark') }}</span>
                </mdb-input>
              </b-col>
            </b-row>
            <hr />
            <b-row>
              <b-col>
                <h3>{{ $t('defect_record') }}</h3>
              </b-col>
              <b-col>
                <div>{{ $t('defect_total') }}: {{ total }}</div>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <div :key="index" v-for="(defectOptions, index) in defectOptions" align="center">
                  <mdb-input
                    v-if="index % 2 == 0"
                    class="mb-3"
                    required
                    v-model="defectOptions.number"
                    type="number"
                    :min="0"
                    @change="defectchange()"
                  >
                    <span class="input-group-text" slot="prepend">{{ defectOptions.name }}</span>
                  </mdb-input>
                </div>
              </b-col>
              <b-col>
                <div :key="index" v-for="(defectOptions, index) in defectOptions" align="center">
                  <mdb-input
                    v-if="index % 2 != 0"
                    class="mb-3"
                    required
                    v-model="defectOptions.number"
                    type="number"
                    :min="0"
                    @change="defectchange()"
                  >
                    <span class="input-group-text" slot="prepend">{{ defectOptions.name }}</span>
                  </mdb-input>
                </div>
              </b-col>
            </b-row>

            <b-col></b-col>
            <hr />
            <!-- /********************************************************** */ -->
          </div>
        </mdb-modal-body>
        <mdb-modal-footer>
          <span style="color:red">{{ errormes }}</span>
          <!-- 不再入庫 -->
          <mdb-input
            v-if="!editmode"
            type="checkbox"
            id="checkbox1"
            name="check1"
            v-model="newisLast"
            :label="this.$t('no_more_storageOEE')"
          />
          <mdb-btn color="info" type="submit">{{ $t('submit') }}</mdb-btn>
          <mdb-btn color="0000" @click.native="modal = false" type="button">
            {{ $t('close') }}
          </mdb-btn>
        </mdb-modal-footer>
      </form>
    </mdb-modal>
    <mdb-modal centered :show="storagemes" @close="closemodal($event)">
      <mdb-modal-header>
        <mdb-modal-title>{{ $t('warrning_title') }}</mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body>
        <span style="color:red">{{ confirmmes }}</span></mdb-modal-body
      >
      <mdb-modal-footer>
        <mdb-btn color="info" v-on:click="submitfunc()" @click.native="storagemes = false">
          {{ $t('confirm') }}
        </mdb-btn>
        <mdb-btn color="0000" @click.native="storagemes = false">{{ $t('close') }}</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
  </b-container>
</template>

<script>
import naturalCompare from 'string-natural-compare'

import { WorkShopAPI } from '@/plugins/basicapis.js'
import { ModelSelect } from 'vue-search-select'
import {
  // ScheduleMultiAPI,
  ProductStorageRecordAPI,
  ProductStorageRecordDeleteMultiAPI,
  ProductStorageRecordallAPI,
  OptionSchedule,
  // TaskAPI,
  GetStorageNumAPI,
  ProductrecordInfoAPI
} from '@/plugins/produceapis.js'
import { DefectAPI } from '@/plugins/systemapis.js'
import { mapState } from 'vuex'
export default {
  components: {
    ModelSelect
  },
  data() {
    var storageobject = {
      Id: 0,
      serialNumber: '',
      abnormalNumber: 0,
      defect: 0,
      endTime: 0,
      lastUpdateTime: 0,
      manufactureDate: 0,
      normalNumber: 0,
      productId: 0,
      purchasDate: 0,
      taskId: 0,
      startTime: 0,
      remark: ''
    }
    var timeobject = [
      { text: this.$t('in_one_month'), value: 1 },
      { text: this.$t('in_three_month'), value: 3 },
      { text: this.$t('in_six_month'), value: 6 },
      { text: this.$t('in_twelve_month'), value: 12 },
      { text: this.$t('all'), value: -1 }
    ]
    var storageobjectnull = JSON.parse(JSON.stringify(storageobject))
    return {
      page_first: 0, //第一條
      page_last: 0, //最後一筆
      page_total: 0, //總共筆數
      scearchtime: 1, //時間種類範圍
      timeobject,
      scearchworkshop: -1,
      workshopobject: [], //廠區選單
      confirmmes: '', //確認訊息
      errormes: '', //錯誤訊息
      newisLast: false, //新增不再品檢
      scheduleoption: [], //排程選單
      isbusy: true,
      newbtm: false, //新增
      editbtm: false, //編輯
      deletebtm: false, //刪除
      customize1: false, //自定義一
      customize2: false, //自定義二
      customize3: false, //自定義三
      no_task_select: false, //未選擇任務
      editmode: true,
      optiontaskidArray: '',
      taskobject: [],
      taskoption: [],
      total: 0,
      selectdefectid: null,
      deletebundisable: true,
      defectOptions: [],
      selected: [],
      storageobject,
      storageobjectnull,
      operate: '',
      warning: false,
      storagemes: false,
      modal: false,
      alldata: [], //全部入庫data
      tabledata: [], //入庫table
      fields: [
        // {
        //   key: "numberserial",
        //   label: "序號",
        //   class: "moldnumberclass"
        // },
        {
          key: 'serialNumber',
          label: this.$t('storage_sernumber'), //'入庫編號',
          sortDirection: 'desc',
          sortable: true,
          class: 'text-center',
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'scheduleNumber',
          label: this.$t('schedule_number'), //'排程編號',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'moldNumber',
          label: this.$t('mold'), //'模具',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'expectedCount',
          label: this.$t('plan_number'), //'計畫生產數量',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return this.dealThousands('0', value)
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },

        {
          key: 'actualCount',
          label: this.$t('actual_count'), //'實際生產數量',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return this.dealThousands('0', value)
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'normalNumber',
          label: this.$t('normal_number'), //'良品總數',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return this.dealThousands('0', value)
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'abnormalNumber',
          label: this.$t('abnormal_number'), //'不良品總數',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return this.dealThousands('0', value)
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'degecttotal',
          label: this.$t('defect_total'), //'缺陷總數',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return this.dealThousands('0', value)
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'remark',
          label: this.$t('remark'), //'備註',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle remarkstyle'
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
      filterOn: ['moldNumber', 'serialNumber', 'scheduleNumber', 'remark'],

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
  watch: {
    currentPage: function() {
      this.setfooternum() //設定頁數
    },
    perPage: function() {
      this.setfooternum() //設定頁數
    }
  },
  created() {
    this.iniright()
    this.getdata()
    this.getworkshop()
  },
  methods: {
    //設定權限
    iniright() {
      this.authority.forEach(item => {
        if (item.name == 'produce_storage') {
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
    //選單搜尋資料
    searchdata() {
      this.getdata()
    },
    //取得廠區
    getworkshop() {
      var access_token_val = this.$cookies.get('access_token')
      WorkShopAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          this.workshopobject = []
          this.workshopobject.push({
            text: this.$t('all'),
            value: -1
          })
          if (res.data != null) {
            res.data.forEach(item => {
              this.workshopobject.push({ text: item.name, value: item.id })
            })
          }
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //取得入庫編號
    getstoragenumber() {
      var access_token_val = this.$cookies.get('access_token')
      GetStorageNumAPI({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          if (res.data != null) {
            this.storageobject.serialNumber = res.data.number
            this.getschedule('new') //取得任務排程
          }
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
        this.modal = false
        this.storagemes = false
      }
    },
    //取得排程
    getschedule(type) {
      this.scheduleoption = []
      if (type == 'new') {
        var tempstatus = '2'
      } else {
        var tempstatus = '1'
        let temptext =
          this.storageobject.scheduleNumber +
          this.$t('machine') +
          ' : ' +
          this.storageobject.machineNumber +
          this.$t('mold') +
          ' : ' +
          this.storageobject.moldNumber
        this.scheduleoption.push({ text: temptext, value: this.storageobject.taskId })
      }
      var access_token_val = this.$cookies.get('access_token')
      OptionSchedule({
        headers: {
          access_token: access_token_val,
          status: tempstatus //2未入庫,1已入庫
        }
      }).then(
        res => {
          if (res.data != null) {
            res.data.forEach(item => {
              var temptext =
                item.scheduleSerial +
                this.$t('machine') +
                ' : ' +
                item.machineNumber +
                this.$t('mold') +
                ' : ' +
                item.moldNumber
              this.scheduleoption.push({ text: temptext, value: item.taskId })
            })
          }
          this.defectchange()
          this.modal = true
        },
        error => {
          console.log(error.response)
        }
      )
    },

    //統計缺陷總數
    defectchange() {
      var num = 0

      if (this.defectOptions != undefined) {
        this.defectOptions.forEach(item => {
          if (item.number != undefined) {
            num += parseInt(item.number, 10)
          }
        })
      }

      this.total = num
    },
    //取得缺陷列表
    getdefect(defectdata) {
      var access_token_val = this.$cookies.get('access_token')
      DefectAPI.get({
        headers: {
          access_token: access_token_val,
          type: '[2]'
        }
      }).then(
        res => {
          //編輯
          var temparray = []
          if (defectdata != undefined) {
            res.data.forEach(item => {
              item.number = 0
              item.defectName = item.name
              item.defectId = item.id
              for (var i = 0; i < defectdata.length; i++) {
                if (defectdata[i].defectName == item.name) {
                  item.number = defectdata[i].number
                }
              }
            })
            if (res.data != null) {
              res.data.forEach(item => {
                if (item.isDelete == false) {
                  temparray.push(item)
                } else {
                  if (item.number != 0) {
                    temparray.push(item)
                  }
                }
              })
            }
            // temparray = res
            this.getschedule('edit')
            //新增
          } else {
            if (res.data != null) {
              res.data.forEach(item => {
                item.number = 0
                item.defectName = item.name
                item.defectId = item.id
                if (item.isDelete != true) {
                  temparray.push(item)
                }
              })
            }
            this.getstoragenumber() //取得入庫編號
          }

          this.defectOptions = temparray
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //入庫getall
    getdata() {
      this.isbusy = true
      var access_token_val = this.$cookies.get('access_token')
      ProductStorageRecordallAPI.get({
        headers: {
          workShopId: this.scearchworkshop,
          timeRange: this.scearchtime,
          access_token: access_token_val
        }
      }).then(
        res => {
          this.alldata = []
          if (res.data != null) {
            res.data.forEach(item => {
              var temptotal = 0
              if (item.defect != null) {
                for (var i = 0; i < item.defect.length; i++) {
                  temptotal += item.defect[i].number
                }
              }
              if (this.taskobject.length != 0) {
                for (var j = 0; j < this.taskobject.length; j++) {
                  if (this.taskobject[j].id == item.taskId) {
                    item.taskSerial = this.taskobject[j].taskSerial
                    break
                  }
                }
              }
              //關聯任務編號
              if (this.taskobject != null) {
                for (var k = 0; k < this.taskobject.length; k++) {
                  if (this.taskobject[k].id == item.taskId) {
                    item.taskSerial = this.taskobject[k].number
                  }
                }
              }
              item.degecttotal = temptotal
              item.lastUpdateTime = this.timeStampToStringFunc(item.lastUpdateTime, 'yyyy-mm-dd')
            })
            if (res.data.length != 0) {
              res.data.sort((a, b) => naturalCompare(a.serialNumber, b.serialNumber))
            }
            this.alldata = res.data
            this.tabledata = res.data
            this.totalRows = res.data.length
          } else {
            this.tabledata = []
            this.totalRows = 0
          }
          this.setfooternum()
          this.isbusy = false
        },
        error => {
          console.log(error.response)
          this.setfooternum()
          this.isbusy = false
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //設定顯示第 0 到第 0 條紀錄，總共 0 條紀錄
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
    resetInfoModal() {
      this.infoModal.title = ''
      this.infoModal.content = ''
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    storagewindow(item, index, mode) {
      this.errormes = '' //錯誤訊息初始化
      this.no_task_select = false
      if (mode == 'edit') {
        this.operate = this.$t('edit')
        this.editmode = true
      } else if (mode == 'new') {
        this.operate = this.$t('new')
        this.editmode = false
      }

      if (mode == 'edit') {
        this.editwindow(item)
      } else {
        this.total = 0
        this.newwindow()
        this.getdefect()
      }
    },
    //編輯
    editwindow(item) {
      this.storageobject = JSON.parse(JSON.stringify(item))
      this.newisLast = this.storageobject.recordStatus
      this.getdefect(this.storageobject.defect)
    },
    newwindow() {
      this.storageobject = JSON.parse(JSON.stringify(this.storageobjectnull))
      this.newisLast = false
    },
    checkifzero(value) {
      if (value === 0) {
        // return "";
        if (value === 0) {
          return '-'
        }
        return value
      } else {
        if (value === 0) {
          return '-'
        }
        return value
      }
    },
    checkisnull(value) {
      if (value == '') {
        return 0
      } else {
        return parseFloat(value)
      }
    },

    dealdata() {
      this.storageobject.abnormalNumber = this.checkisnull(this.storageobject.abnormalNumber)
      this.storageobject.normalNumber = this.checkisnull(this.storageobject.normalNumber)
      this.defectOptions.forEach(item => {
        item.number = parseInt(item.number, 10)
      })
      this.storageobject.defect = this.defectOptions
    },
    //送出檢查品檢完成與否
    submitcheckfunc() {
      this.confirmmes = ''
      if (this.newisLast) {
        //最後一筆檢查品檢
        let taskid = this.storageobject.taskId
        ProductrecordInfoAPI({
          headers: {
            id: taskid
          }
        }).then(
          res => {
            if (res.data != null) {
              if (!res.data.inspectorStatus) {
                this.confirmmes = this.$t('storage_is_last_quality_not_end')
                this.storagemes = true //顯示視窗
              } else {
                //已品檢過直接送出
                this.submitfunc()
              }
            }
          },
          error => {
            this.confirmmes = error.response.data.response
            console.log(error)
          }
        )
      } else {
        //不是最後一筆直接送出
        this.submitfunc()
      }
    },
    // 送出
    submitfunc() {
      if (this.storageobject.taskId == 0) {
        this.no_task_select = true
      } else {
        this.dealdata()
        var access_token_val = this.$cookies.get('access_token')
        if (this.storageobject.Id == '') {
          var temparray = []
          temparray.push(this.storageobject)
          ProductStorageRecordAPI.post(JSON.stringify(temparray), {
            headers: {
              access_token: access_token_val,
              isLast: this.newisLast
            }
          }).then(
            () => {
              this.$layer.msg(this.$t('scuccess'))
              this.modal = false
              this.isbusy = true
              this.getdata()
            },
            error => {
              if (error.response.data.response == 'Tasks are still on duty') {
                this.errormes = this.$t('storageOEE_onduty_error')
              } else {
                this.errormes = error.response.data.response
              }
              // console.log(error.response)
              // this.$layer.msg(this.$t('fail') + error.response.data.response)
            }
          )
        } else {
          this.storageobject.lastUpdateTime = 0
          ProductStorageRecordAPI.put(JSON.stringify(this.storageobject), {
            headers: {
              access_token: access_token_val,
              isLast: this.newisLast
            }
          }).then(
            () => {
              this.$layer.msg(this.$t('scuccess'))
              this.modal = false
              this.getdata()
            },
            error => {
              console.log(error.response)
              this.$layer.msg(this.$t('fail') + error.response.data.response)
              this.modal = false
            }
          )
        }
      }
    },
    // 刪除
    deletemold() {
      var access_token_val = this.$cookies.get('access_token')
      ProductStorageRecordDeleteMultiAPI.delete({
        headers: {
          access_token: access_token_val,
          ids: this.selectedArrayToString(this.selected)
        }
      }).then(
        () => {
          this.$layer.msg(this.$t('scuccess'))
          this.modal = false
          this.getdata()
        },
        error => {
          console.log(error.response)
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
.storagepctableclass {
  max-height: calc(100vh - 290px) !important;
}

.table-responsive > .table-bordered,
.table-responsive-sm > .table-bordered,
.table-responsive-md > .table-bordered,
.table-responsive-lg > .table-bordered,
.table-responsive-xl > .table-bordered {
  border: 1px solid #f4f4f4 !important;
}
.table tr td {
  line-height: 20px;
  padding: 0px;
  margin: 0px;
  padding-top: -10px;
}
.table-b-table-default.text-center.thstyle {
  border: 1px solid #f4f4f4;
  font-size: 14px;
  font-weight: bold;
  height: 39px;
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  font-family: 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
.text-center.tdstyle {
  border: 1px solid #f4f4f4;
  font-size: 14px;
  font-weight: 400;
  height: 39px;
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  font-family: 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
</style>
<style scoped>
.ui.selection.dropdown {
  border: 0px !important;
}
</style>
<style>
.moldnumberclass {
  max-width: 30px;
  text-align: center;
}

#mobile {
  display: none;
}
table.table td {
  vertical-align: middle;
  padding-top: 0;
  padding-bottom: 0rem;
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
