<template>
  <b-container fluid>
    <mdb-card>
      <mdb-card-body>
        <!-- <div class="mx-3">
          <h2>排程管理OEE+</h2>
          {{ testdata }}
        </div>-->

        <b-row>
          <b-col cols="8">
            <b-tabs
              active-nav-item-class="font-weight-bold text-uppercase "
              active-tab-class="font-weight-bold"
            >
              <b-tab
                :title="this.$t('tab_standby_to_task')"
                active
                @click="searchdata(3)"
                style="padding-top:0"
              ></b-tab>
              <b-tab
                :title="this.$t('tab_in_task')"
                @click="searchdata(2)"
                style="padding-top:0"
              ></b-tab>
              <b-tab
                :title="this.$t('tab_finished')"
                @click="searchdata(1)"
                style="padding-top:0"
              ></b-tab>
            </b-tabs>
          </b-col>
          <b-col cols="4">
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
        <div style="padding-top: 0.2rem;">
          <div>
            <b-row>
              <b-col></b-col>
              <b-col cols="4">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <label class="input-group-text" for="inputGroupSelect01" style="width:160px">
                      {{ $t('produce_time_type') }}
                    </label>
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
            <b-row>
              <b-col lg="8">
                <mdb-input
                  style="width:80%"
                  v-model="filter"
                  type="search"
                  id="filterInput"
                  :placeholder="
                    this.$t('schedule_number') +
                      '、' +
                      this.$t('manufacturingorder_number') +
                      '、' +
                      this.$t('manufacturingorder_customize_number') +
                      '、' +
                      this.$t('mold_number') +
                      '、' +
                      this.$t('machine_number') +
                      '、' +
                      this.$t('employee_start_time') +
                      '、' +
                      this.$t('employee_end_time') +
                      '、' +
                      this.$t('remark') +
                      '、' +
                      this.$t('product_number')
                  "
                >
                  <span class="input-group-text" slot="prepend">{{ $t('search') }}</span>
                </mdb-input>
              </b-col>

              <b-col lg="4"></b-col>
            </b-row>
            <!-- <mdb-btn size="sm" color="primary" v-on:click="moldwindow([],[],'new')">新增</mdb-btn> -->
            <b-row>
              <b-col>
                <!-- 編輯 -->
                <mdb-btn
                  v-if="statusshow && editbtm"
                  size="sm"
                  color="primary"
                  v-on:click="editwindow()"
                  :disabled="selected ? selected == 0 : false"
                  style="padding:0.5rem"
                  icon="pencil-alt"
                ></mdb-btn>
                <!-- 刪除 -->
                <mdb-btn
                  v-if="statusshow && deletebtm"
                  size="sm"
                  color="danger"
                  :disabled="selected ? selected == 0 : false"
                  @click.native="warning = true"
                  style="padding:0.5rem"
                  icon="trash-alt"
                ></mdb-btn>
              </b-col>
              <b-col>
                <b-row v-if="timesearch">
                  <b-col>
                    <date-picker v-model="data.inputstarttime" :config="options"></date-picker>
                  </b-col>
                  <b-col>
                    <date-picker v-model="data.inputendtime" :config="options"></date-picker>
                  </b-col>
                  <b-col>
                    <mdb-btn size="sm" color="primary" v-on:click="searchtime()">
                      {{ $t('search') }}
                    </mdb-btn>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
            <b-table
              class="schedulepctableclass"
              no-border-collapse
              sticky-header="590px"
              id="pc"
              :busy="isbusy"
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
              :sort-desc.sync="sortDesc"
              @filtered="onFiltered"
            >
              <template v-slot:head(manufactureOrderNumbers)="row">
                <div class="text-nowrap" v-if="false">{{ row }}</div>

                <div>
                  <mdb-btn
                    v-if="manufactureOrderNumbersshowflag"
                    size="sm"
                    v-on:click="manufactureOrderNumbersshowflagfunc()"
                    style="padding:0rem;margin:0px"
                    icon="arrow-up"
                    color="mdb-color"
                  ></mdb-btn>
                  <mdb-btn
                    v-if="!manufactureOrderNumbersshowflag"
                    size="sm"
                    v-on:click="manufactureOrderNumbersshowflagfunc()"
                    style="padding:0rem;margin:0px"
                    icon="arrow-down"
                    color="mdb-color"
                  ></mdb-btn>
                  {{ $t('manufacturingorder_number') }}
                </div>
              </template>

              <template v-slot:table-busy>
                <div class="text-center my-3">
                  <b-spinner class="align-middle"></b-spinner>
                  <strong>Loading...</strong>
                </div>
              </template>

              <template
                v-slot:cell(manufactureOrderNumbers)="row"
                v-if="manufactureOrderNumbersshowflag"
              >
                <div v-for="(member, index) in row.item.manufactureOrderNumbers" :key="index">
                  {{ member }}
                </div>
              </template>
              <template v-slot:cell(customizeNumbers)="row" v-if="manufactureOrderNumbersshowflag">
                <!-- {{ row.item.customizeNumbers }} -->
                <div v-for="(member, index) in row.item.customizeNumbers" :key="index">
                  <div v-if="member != ''">{{ member }}</div>
                  <div v-if="member == ''">-</div>
                </div>
              </template>
              <template v-slot:cell(actions)="row">
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
              </template>

              <!--詳細資訊 -->
              <template v-slot:row-details="row">
                <b-card>
                  <!-- <div>WAJAJAJ</div>
                  {{row}}-->
                  <!-- <ul>
                <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
                  </ul>-->
                  <div v-for="(value, key) in row.item.info" :key="key">
                    <b-row>
                      <!-- <b-col>{{value.id}}</b-col> -->
                      <b-col lg="2">
                        {{ $t('manufacturingorder_number') }}:
                        {{ value.manufactureOrderNumber }}
                      </b-col>

                      <b-col lg="2">
                        <div v-if="value.customizeNumbers == ''">
                          {{ $t('manufacturingorder_customize_number') }}: -
                        </div>
                        <div v-else>
                          {{ $t('manufacturingorder_customize_number') }}:{{
                            value.customizeNumbers
                          }}
                        </div>
                      </b-col>
                      <b-col lg="2">{{ $t('product') }}: {{ value.cavityProductNumber }}</b-col>
                      <b-col lg="2">{{ $t('mold_cavity') }}: #{{ value.moldCavityNumber }}</b-col>
                      <b-col lg="2">{{ $t('mold_qty') }}: {{ value.qty }}</b-col>

                      <!-- <b-col>工時: # {{value.workingTime}}</b-col> -->
                    </b-row>
                    <hr />
                  </div>
                  <!-- <ul>
                <li v-for="(value, key) in row.item.info" :key="key">{{ key }}: {{ value }}</li>
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
              @filtered="onFiltered"
            >
              <template v-slot:cell(numberserial)="row" class="col-sm-3">{{ row.index }}</template>
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
            <!-- <div>圖</div> -->

            <amchart-tab
              :searchData="data"
              :getchartdata="tabledata"
              :workshopselect="scearchworkshop"
              :tabvalue="tabvalue"
              v-on:callparent="getdata"
            ></amchart-tab>
            <hr />
          </div>
        </div>
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
    <!-- 編輯排程 -->
    <mdb-modal :show="modal" @close="closemodal($event)" size="lg" class="editmodal">
      <form v-on:submit.prevent="submitfunc">
        <mdb-modal-header>
          <mdb-modal-title>{{ $t('schedule') }}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <b-table responsive bordered :items="editarray" :fields="editFields" ref="editTable">
            <template v-slot:cell(moldCycleTime)="row">
              <b-form-input
                class="inputCenter"
                type="number"
                :show="modal"
                required
                :step="0.1"
                :min="0.1"
                v-model="row.item.moldCycleTime"
              />
            </template>
            <template v-slot:cell(machineNumber)="row">
              <b-form-select
                v-model="row.item.machineId"
                :options="row.item.machinearray"
                required
                class="inputCenter"
              ></b-form-select>
            </template>
            <template v-slot:cell(startTime)="row">
              <b-form-input
                class="inputCenter"
                type="datetime-local"
                :show="modal"
                required
                v-model="row.item.startTime"
                :max="row.item.endTime"
                @change="timeInputChange(row.item)"
              />
            </template>
            <template v-slot:cell(endTime)="row">
              <b-form-input
                class="inputCenter"
                type="datetime-local"
                :show="modal"
                required
                v-model="row.item.endTime"
                :min="row.item.startTime"
                @change="timeInputChange(row.item)"
              />
            </template>
            <template v-slot:cell(remark)="row">
              <b-form-input type="text" v-model="row.item.remark" />
            </template>
            <template v-slot:cell(actions)="row">
              <mdb-btn
                size="sm"
                type="button"
                color="danger"
                class="deitedeletebtm"
                @click="deleteRow(row.index)"
                icon="times"
                style="padding:0.5rem"
              ></mdb-btn>
            </template>
          </b-table>
        </mdb-modal-body>
        <mdb-modal-footer>
          <span style="color:red">{{ errormes }}</span>
          <mdb-btn color="info" type="submit">{{ $t('submit') }}</mdb-btn>
          <mdb-btn color="0000" @click.native="modal = false" type="button">
            {{ $t('close') }}
          </mdb-btn>
        </mdb-modal-footer>
      </form>
    </mdb-modal>
    <!-- 排程衝突 -->
    <error-tab :errorArray="errorArray"> </error-tab>
  </b-container>
</template>

<script>
import naturalCompare from 'string-natural-compare'
import { mapState } from 'vuex'
import datePicker from 'vue-bootstrap-datetimepicker'
import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css'
import 'bootstrap/dist/css/bootstrap.css'
import amchartTab from '@/components/produce/schedule/amchart'
import errorTableTab from '@/components/produce/schedule/scheduleConflictTable'
import {
  // ScheduleTtimeAPI,
  // ScheduleOEEplusAPI,
  ScheduleOEEplusmultieditAPI,
  ScheduleOEEplusallAPI,
  ScheduleMultiAPI,
  ScheduleOEEplusMoldMachineAPI
} from '@/plugins/produceapis.js'
import { WorkShopAPI } from '@/plugins/basicapis.js'

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
    datePicker,
    'amchart-tab': amchartTab,
    'error-tab': errorTableTab
  },
  data() {
    var selectoption = [
      { timetype: 1, workshop: -1 },
      { timetype: 1, workshop: -1 },
      { timetype: 1, workshop: -1 }
    ]
    var timeobject = [
      { text: this.$t('in_one_month_schedule'), value: 1 },
      { text: this.$t('in_three_month_schedule'), value: 3 },
      { text: this.$t('in_six_month_schedule'), value: 6 },
      { text: this.$t('in_twelve_month_schedule'), value: 12 },
      { text: this.$t('all'), value: -1 }
    ]
    var scheduleobject = {
      Id: null,
      name: '',
      number: ''
    }

    return {
      errorArray: [], //錯誤array
      manufactureOrderNumbersshowflag: true,
      errormes: '', //錯誤訊息
      selectoption, //選擇狀態暫存
      page_first: 0, //第一條
      page_last: 0, //最後一筆
      page_total: 0, //總共筆數
      scearchtime: 1, //時間種類範圍
      timeobject,
      scearchworkshop: -1,
      workshopobject: [], //廠區選單
      loadingflag: 0, //編輯加載顯示
      ScheduleTtimedata: [], //原始資料
      isbusy: true,
      newbtm: false, //新增
      editbtm: false, //編輯
      deletebtm: false, //刪除
      customize1: false, //自定義一
      customize2: false, //自定義二
      customize3: false, //自定義三
      timesearch: false,
      statusshow: true,
      tabvalue: 3, //預設tab值
      data: {
        scarchbtm: 0,
        inputstarttime: new Date(),
        inputendtime: new Date(),
        workshop: 0
      },
      inistartdate: new Date(),
      inienddate: new Date(),

      searchstartTime: 0,
      searchendTime: 0,
      searchbtmflag: 0,
      options: {
        format: 'YYYY/MM/DD  HH:mm',
        useCurrent: false
      },
      editarray: [], //編輯陣列
      // editdeletearray: [], //編輯刪除陣列

      selected: [],
      scheduleobject,
      operate: '',
      warning: false,
      modal: false,
      tabledata: [],
      tabledata1: [],
      fields: [
        {
          key: 'scheduleSerial',
          label: this.$t('schedule_number'), //'排程編號',
          class: 'text-center',
          sortable: true,
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'manufactureOrderNumbers',
          label: this.$t('manufacturingorder_number'), //'製令編號',
          class: 'text-center',
          sortable: true,
          formatter: value => {
            // return value
            if (value.length == 1) {
              return value[0]
            } else {
              if (value[0] == undefined) {
                return '-'
              } else {
                return value[0] + ', ...'
              }
            }
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'customizeNumbers',
          label: this.$t('manufacturingorder_customize_number'), //自定義製令編號
          class: 'text-center',
          sortable: true,
          thClass: 'thstyle',
          tdClass: 'tdstyle',
          formatter: value => {
            if (value.length == 1) {
              if (value[0] == '') {
                return '-'
              }
              return value[0]
            } else {
              if (value[0] == undefined || value[0] == '') {
                return '-, ...'
              } else {
                return value[0] + ', ...'
              }
            }
          }
        },
        {
          key: 'moldNumber',
          label: this.$t('mold_number'), //'模具編號',
          sortable: true,
          class: 'text-center',
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'machineNumber',
          label: this.$t('machine_number'), //'設備編號',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'startTime',
          label: this.$t('schedule_start_time'), //'開始時間',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'endTime',
          label: this.$t('schedule_end_time'), //'結束時間',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'moldCycleTime',
          label: this.$t('mold_cycletime'), //'計畫週期時間',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return this.dealThousands('0', value)
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'qty',
          label: this.$t('mold_qty'), //'沒次',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return this.dealThousands('0', value)
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'workShopId',
          label: this.$t('workshop'), //'廠區',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            var temp
            if (this.workshopobject.length != 0) {
              this.workshopobject.forEach(item => {
                if (value == item.value) {
                  temp = item.text
                }
              })
            }
            return temp
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'remark',
          label: this.$t('remark'),
          class: 'text-center',
          thClass: 'thstyle',
          tdClass: 'tdstyle remarkstyle'
        }, //備註
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
      sortBy: 'startTime',
      sortDesc: true,
      filter: null,
      filterOn: [
        'manufactureOrderNumbers',
        'scheduleSerial',
        'moldNumber',
        'machineNumber',
        'startTime',
        'endTime',
        'remark',
        'customizeNumbers',
        'productNumberarray'
      ],
      infoModal: {
        id: 'info-modal',
        title: '',
        content: ''
      },
      editFields: [
        {
          key: 'scheduleSerial',
          label: this.$t('schedule_number'), //'排程編號',
          sortable: true,
          class: 'text-center',
          thStyle: { whiteSpace: 'nowrap' }
        },
        {
          key: 'moldNumber',
          label: this.$t('mold_number'), //'模具編號',
          sortable: true,
          class: 'text-center',
          thStyle: { whiteSpace: 'nowrap' }
        },
        {
          key: 'moldCycleTime',
          label: this.$t('mold_cycletime'), //'計畫週期時間',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return this.dealThousands('0', value)
          },
          thStyle: { whiteSpace: 'nowrap' }
        },
        {
          key: 'machineNumber',
          label: this.$t('machine_number'), //'設備編號',
          sortable: true,
          class: 'text-center',
          thStyle: { whiteSpace: 'nowrap' }
        },
        {
          key: 'startTime',
          label: this.$t('schedule_start_time'), //'開始時間',
          class: 'text-center',
          thStyle: { whiteSpace: 'nowrap' }
        },
        {
          key: 'endTime',
          label: this.$t('schedule_end_time'), //'結束時間',
          class: 'text-center',
          thStyle: { whiteSpace: 'nowrap' }
        },
        {
          key: 'workingTime',
          label: this.$t('working_time'), //'預計生產工時',
          sortable: true,
          class: 'text-center',
          thStyle: { whiteSpace: 'nowrap' }
        },
        {
          key: 'remark',
          label: this.$t('remark'),
          class: 'text-center',
          thStyle: { whiteSpace: 'nowrap' }
        },
        {
          key: 'actions',
          label: this.$t('operating'),
          class: 'text-center',
          thStyle: { whiteSpace: 'nowrap' }
        }
      ]
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
  created() {
    this.inistartdate.setDate(new Date().getDate())
    this.inienddate.setDate(new Date().getDate() - 180)
    this.iniright()
    this.getworkshop()
  },
  mounted() {
    this.searchdata(3)
  },
  methods: {
    //點選反白
    focus(event) {
      event.currentTarget.select()
    },
    //設定權限
    iniright() {
      this.authority.forEach(item => {
        if (item.name == 'produce_schedule') {
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
    //table顯示隱藏製令、自定義製令
    manufactureOrderNumbersshowflagfunc() {
      this.manufactureOrderNumbersshowflag = !this.manufactureOrderNumbersshowflag
    },

    //點擊tab
    searchdata(value) {
      this.isbusy = true
      // this.filter = '' //清空搜尋
      if (value != undefined) {
        //點擊tab更換狀態
        this.tabvalue = value
        this.scearchtime = this.selectoption[value - 1].timetype
        this.scearchworkshop = this.selectoption[value - 1].workshop
      } else {
        //非點擊tab
        this.selectoption[this.tabvalue - 1].timetype = this.scearchtime
        this.selectoption[this.tabvalue - 1].workshop = this.scearchworkshop
      }
      this.getdata()
    },
    // tabclickfunc(value) {
    //   switch (value) {
    //     case 1:
    //       this.statusshow = false
    //       this.timesearch = true
    //       break
    //     case 2:
    //       this.statusshow = false
    //       this.timesearch = false
    //       break
    //     case 3:
    //       this.data.inputendtime = this.inistartdate
    //       this.data.inputstarttime = this.inienddate

    //       this.data.inputendtime.setHours(0)
    //       this.data.inputendtime.setMinutes(0)
    //       this.statusshow = true
    //       this.timesearch = false
    //       break
    //   }
    //   this.tabvalue = value
    //   this.data = {
    //     tabvalue: this.tabvalue,
    //     workshop: this.scearchworkshop,
    //     scarchbtm: this.data.scarchbtm + 1,
    //     inputstarttime: this.data.inputstarttime,
    //     inputendtime: this.data.inputendtime,
    //     timesearch: this.timesearch
    //   }
    //   this.getdata()
    //   this.selectdata(this.tabvalue)
    // },
    //依狀態篩選資料
    selectdata() {
      var temparray = []
      if (this.tabledata1 != null) {
        this.tabledata1.forEach(item => {
          let tempProductNumberarray = []
          if (item.info != null) {
            item.info.forEach(dataitem => {
              tempProductNumberarray.push(dataitem.productNumber)
            })
          }

          item.productNumberarray = tempProductNumberarray
          temparray.push(item)
        })

        if (temparray != null) {
          this.totalRows = temparray.length
        }
      } else {
        this.totalRows = 0
      }
      temparray.forEach(item => {
        item.manufactureOrderNumbers.sort(String.naturalCompare)
      })
      this.tabledata = temparray

      this.setfooternum() //設定頁數
      this.isbusy = false
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
    //選擇廠區重載
    scearchworkshopchange() {
      this.isbusy = true
      this.selectdata(this.tabvalue)
      this.data = {
        tabvalue: this.tabvalue,
        workshop: this.scearchworkshop,
        scarchbtm: this.data.scarchbtm + 1,
        inputstarttime: this.data.inputstarttime,
        inputendtime: this.data.inputendtime,
        timesearch: this.timesearch
      }
    },
    //modal背景點擊不關閉
    closemodal(value) {
      if (value == undefined) {
        this.modal = false
      }
    },
    //排序模穴
    sortinfo(object) {
      if (object != null) {
        if (object.length > 1) {
          object = object.sort(function(a, b) {
            return a.moldCavityNumber > b.moldCavityNumber ? 1 : -1
          })
        }
      }

      return object
    },
    //搜尋時間區間
    searchtime() {
      this.isbusy = true
      this.getdata()
    },
    //編輯內刪除
    deleteRow(index) {
      // this.editdeletearray.push(this.editarray[index].id)
      this.editarray.splice(index, 1)
    },

    getdata() {
      this.page_first = 0
      this.page_last = 0
      this.page_total = 0
      var access_token_val = this.$cookies.get('access_token')
      ScheduleOEEplusallAPI.get({
        headers: {
          workShopId: this.scearchworkshop,
          status: this.tabvalue,
          timeRange: this.scearchtime,
          access_token: access_token_val
        }
      }).then(
        res => {
          this.ScheduleTtimedata = JSON.parse(JSON.stringify(res.data))
          // this.searchstartTime = this.stringToTimestampFunc(this.inputstarttime)
          // this.searchendTime = this.stringToTimestampFunc(this.inputendtime)
          if (res.data != null && res.data.schedule != null) {
            res.data = this.dealrealdata(res.data)

            //  this.totalRows = res.schedule.length
          }

          this.ScheduleTtimedata = JSON.parse(JSON.stringify(res.data))

          this.tabledata1 = res.data.schedule
          this.isbusy = false
          this.selectdata()
        },
        error => {
          this.isbusy = false
          console.log(error)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //處理時間、計算tab總數
    dealrealdata(data) {
      if (data != data) {
        data.schedule.forEach(item => {
          item.info = this.sortinfo(item.info)
          item.endTimechart = JSON.parse(JSON.stringify(item.endTime))
          item.startTimechart = JSON.parse(JSON.stringify(item.startTime))
          item.endTime = this.timeStampToStringFunc(item.endTime, 'yyyy-mm-dd hh:mm')
          item.startTime = this.timeStampToStringFunc(item.startTime, 'yyyy-mm-dd hh:mm')
        })
      }
      data.schedule.forEach(item => {
        item.info = this.sortinfo(item.info)
        item.endTimechart = JSON.parse(JSON.stringify(item.endTime))
        item.startTimechart = JSON.parse(JSON.stringify(item.startTime))
        item.endTime = this.timeStampToStringFunc(item.endTime, 'yyyy-mm-dd hh:mm')
        item.startTime = this.timeStampToStringFunc(item.startTime, 'yyyy-mm-dd hh:mm')
      })
      return data
    },

    resetInfoModal() {
      this.infoModal.title = ''
      this.infoModal.content = ''
    },
    //搜尋更換chart圖
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.ScheduleTtimedata = JSON.parse(JSON.stringify(filteredItems))

      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    timestringtodatetimeloacl(value) {
      value = value.substring(0, 10) + 'T' + value.substring(11, value.length)
      return value
    },
    //編輯初始化
    editwindow() {
      // this.editdeletearray = [] //清空
      this.editarray = JSON.parse(JSON.stringify(this.selected))

      this.loadingflag = 0
      this.editarray.forEach((item, index) => {
        this.getmold(item.moldId, index)
        item.workingTime = this.workingHours(item.startTimechart, item.endTimechart)
        item.startTime = this.timestringtodatetimeloacl(item.startTime)
        item.endTime = this.timestringtodatetimeloacl(item.endTime)
      })
    },
    getmold(id, index) {
      var access_token_val = this.$cookies.get('access_token')
      ScheduleOEEplusMoldMachineAPI.get({
        headers: {
          access_token: access_token_val,
          id: id
        }
      }).then(
        res => {
          if (res.data != null) {
            res.data.sort((a, b) => naturalCompare(a.machineNumber, b.machineNumber))
          }
          this.editarray[index].machinearray = []
          if (res.data != null) {
            res.data.forEach(item => {
              this.editarray[index].machinearray.push({
                value: item.id,
                text: item.machineNumber
              })
            })
          }

          //等全部加載完才顯示視窗

          this.loadingflag++
          if (this.loadingflag == this.editarray.length) {
            this.errormes = ''
            this.modal = true
          }
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },

    checkifzero(value) {
      if (value === 0) {
        // return "";
        return value
      } else {
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
      this.scheduleobject.Id = this.checkisnull(this.scheduleobject.Id)
    },
    timeInputChange(item) {
      let startTime = this.stringToTimestampFunc(item.startTime)
      let endTime = this.stringToTimestampFunc(item.endTime)
      item.workingTime = this.workingHours(startTime, endTime)
      this.$nextTick(() => {
        this.$refs.editTable.refresh()
      })
    },
    workingHours(startTime, endTime) {
      let interval = endTime / 1000 - startTime / 1000
      let day = Math.floor(interval / 86400)
      let hour = Math.floor((interval % 86400) / 3600)
      let minute = Math.floor(((interval % 86400) % 3600) / 60)
      if (day == 0 && hour == 0) {
        return '< 1h'
      }
      return day + 'd ' + hour + 'h ' + minute + 'm'
    },
    // 編輯送出
    submitfunc() {
      // var subitarray = {
      //   schedule: [],
      //   delete: []
      // }
      let subflag = false
      this.editarray.forEach(item => {
        if (parseFloat(item.moldCycleTime) < 0.1) {
          subflag = true
        }
      })
      if (subflag) {
        this.errormes = this.$t('mold_import_ct_error')
      } else {
        this.isbusy = true
        var submitarray = []
        this.editarray.forEach(item => {
          let tempobject = {
            id: item.id,
            scheduleSerial: item.scheduleSerial,
            moldId: item.moldId,
            moldName: item.moldName,
            moldNumber: item.moldNumber,
            materialId: item.materialId,
            materialNumber: item.materialNumber,
            materialName: item.materialName,
            maxDeadline: item.maxDeadline,
            machineId: item.machineId,
            machineNumber: item.machineNumber,
            machineName: item.machineNumber,
            moldCycleTime: parseFloat(item.moldCycleTime),
            startTime: this.stringToTimestampFunc(item.startTime),
            endTime: this.stringToTimestampFunc(item.endTime),
            update: item.update,
            qty: item.qty,
            status: item.status,
            createdTime: item.createdTime,
            moldYellowRange: item.moldYellowRange,
            moldGreenRange: item.moldGreenRange,
            workShopId: item.workShopId,
            remark: item.remark
          }
          submitarray.push(tempobject)
        })

        var access_token_val = this.$cookies.get('access_token')
        ScheduleOEEplusmultieditAPI.put(JSON.stringify(submitarray), {
          headers: {
            access_token: access_token_val
          }
        }).then(
          () => {
            this.$layer.msg(this.$t('scuccess'))
            this.modal = false
            this.getdata()
          },
          error => {
            this.isbusy = false
            this.errorArray = error.response.data.errorArray

            console.log(error.response)
            // this.$layer.msg(this.$t('fail') + error.response.data.response)
          }
        )
      }
    },

    // 刪除
    deletemold() {
      this.isbusy = true
      var access_token_val = this.$cookies.get('access_token')

      ScheduleMultiAPI.delete({
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

          this.isbusy = false
        }
      )
    },
    //複選
    onRowSelected(items) {
      this.selected = items
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

<style scoped>
.errorModal > .table-responsive {
  min-height: 300px;
}
.inputCenter {
  text-align: center !important;
}
.deitedeletebtm {
  margin: 0;
}
.tooltipConflictMain {
  padding: 0.25rem;
}
.tooltipConflict {
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
}

.tooltipConflict .tooltipConflictText {
  visibility: hidden;
  /* visibility: visible; */
  /* width: 190px; */
  background: rgb(61, 145, 188);
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 6px;
  top: 15px;
  right: 105%;
  white-space: nowrap;
  position: absolute;
  z-index: 1;
}

.tooltipConflict:hover .tooltipConflictText {
  visibility: visible;

  box-shadow: -2px 3px 2px 1px #cccccc;
}
</style>
<style>
.schedulepctableclass {
  max-height: calc(100vh - 346px - 30px) !important;
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
.moldnumberclass {
  max-width: 30px;
  text-align: center;
}
.modal-dialog {
  margin-left: 10%;
  margin-right: 10%;
}
/* .modal-content {
  width: 80vw;
} */
#mobile {
  display: none;
}
.input-group.mb-3 {
  position: relative;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}
table.table td {
  vertical-align: middle;
  padding-top: 0;
  padding-bottom: 0rem;
}
.errorinput {
  background-color: red;
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
