<template>
  <b-container fluid>
    <mdb-card>
      <mdb-card-body>
        <!-- <div class="mx-3">
          <h2>排程管理IPS</h2>
        </div> -->

        <b-tabs
          active-nav-item-class="font-weight-bold text-uppercase "
          active-tab-class="font-weight-bold"
        >
          <b-tab
            :title="this.$t('tab_standby_to_task') + '(' + this.standby_total + ')'"
            active
            @click="tabclickfunc(3)"
            style="padding-top:0"
          >
          </b-tab>
          <b-tab
            :title="this.$t('tab_in_task') + '(' + this.task_total + ')'"
            @click="tabclickfunc(2)"
            style="padding-top:0"
          >
          </b-tab>
          <b-tab
            :title="this.$t('tab_finished') + '(' + this.finished_total + ')'"
            @click="tabclickfunc(1)"
            style="padding-top:0"
          >
          </b-tab>
        </b-tabs>
        <div style="padding-top: 0.2rem;">
          <div>
            <b-row>
              <b-col lg="8">
                <mdb-input
                  style="width:80%"
                  v-model="filter"
                  type="search"
                  id="filterInput"
                  :placeholder="
                    this.$t('manufacturingorder_number') +
                      '、' +
                      this.$t('schedule_number') +
                      '、' +
                      this.$t('mold_number') +
                      '、' +
                      this.$t('machine_number') +
                      '、' +
                      this.$t('employee_start_time') +
                      '、' +
                      this.$t('employee_end_time') +
                      '、' +
                      this.$t('mold_qty') +
                      '、' +
                      this.$t('remark')
                  "
                >
                  <span class="input-group-text" slot="prepend">{{ $t('search') }}</span>
                </mdb-input>
              </b-col>

              <b-col lg="4">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <label class="input-group-text" for="inputGroupSelect01">{{
                      $t('workshop_machine')
                    }}</label>
                  </div>
                  <b-form-select
                    v-model="scearchworkshop"
                    :options="workshopobject"
                    @change="scearchworkshopchange()"
                  ></b-form-select></div
              ></b-col>
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
                  style="padding:0.4rem"
                  icon="pencil-alt"
                ></mdb-btn>
                <!-- 刪除 -->
                <mdb-btn
                  v-if="statusshow && deletebtm"
                  size="sm"
                  color="danger"
                  :disabled="selected ? selected == 0 : false"
                  @click.native="warning = true"
                  style="padding:0.4rem"
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
                    <mdb-btn size="sm" color="primary" v-on:click="searchtime()">{{
                      $t('search')
                    }}</mdb-btn>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
            <b-table
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
              sort-desc.sync="asc"
              :sort-direction="sortDirection"
              @filtered="onFiltered"
            >
              <template v-slot:table-busy>
                <div class="text-center my-3">
                  <b-spinner class="align-middle"></b-spinner>
                  <strong> Loading...</strong>
                </div>
              </template>
              <template v-slot:cell(numberserial)="row" class="col-sm-3">{{ row.index }}</template>
              <!-- <template v-slot:cell(name)="row">{{ row.value }}</template> -->
              <!--<template v-slot:cell(checkbox)="row">
            <b-form-checkbox></b-form-checkbox>
          </template>-->

              <template v-slot:cell(actions)="row">
                <!-- <b-button size="sm" @click="moldwindow(row.item, row.index, 'edit')">編輯</b-button> -->

                <mdb-btn
                  v-if="!row.detailsShowing"
                  color="mdb-color"
                  @click="row.toggleDetails"
                  type="button"
                  style="padding:0.4rem"
                  icon="chevron-down"
                ></mdb-btn>
                <mdb-btn
                  v-if="row.detailsShowing"
                  color="mdb-color"
                  @click="row.toggleDetails"
                  type="button"
                  style="padding:0.4rem"
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
                      <!-- {{ value }} -->
                      <!-- <b-col>{{value.id}}</b-col> -->
                      <b-col lg="2"
                        >{{ $t('manufacturingorder_number') }}:
                        {{ value.manufactureOrderNumber }}</b-col
                      >
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
                <b-button size="sm" @click="row.toggleDetails"
                  >{{ row.detailsShowing ? '隱藏' : '顯示' }} 詳細</b-button
                >
              </template> -->
              <!--詳細資訊 -->
              <!-- <template v-slot:row-details="row">
                <b-card>
                  <ul>
                    <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
                  </ul>
                </b-card>
              </template> -->
            </b-table>
            <b-row>
              <b-col lg="6">
                <b-form-group
                  :label="this.$t('show_perpage')"
                  label-cols-sm="6"
                  label-cols-md="4"
                  label-cols-lg="3"
                  label-align-sm="right"
                  label-size="sm"
                  label-for="perPageSelect"
                  class="mb-0"
                >
                  <b-form-select
                    v-model="perPage"
                    id="perPageSelect"
                    size="sm"
                    :options="pageOptions"
                  ></b-form-select>
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

            <class-tab :searchData="data" :getchartdata="ScheduleTtimedata"></class-tab>

            <!-- <b-row>
          <b-col lg="2">
            <mdb-select align="left" v-model="perPage" :options="optionitems" />
          </b-col>
          <b-col>
            <b-pagination
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              align="right"
            ></b-pagination>
          </b-col>
        </b-row>-->
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
        <mdb-btn color="info" v-on:click="deletemold()" @click.native="warning = false">{{
          $t('delete')
        }}</mdb-btn>
        <mdb-btn color="0000" @click.native="warning = false">{{ $t('close') }}</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
    <mdb-modal :show="modal" @close="closemodal($event)" size="lg" class="editmodal">
      <form v-on:submit.prevent="submitfunc">
        <mdb-modal-header>
          <mdb-modal-title>{{ operate }} {{ $t('schedule') }}</mdb-modal-title>
        </mdb-modal-header>

        <mdb-modal-body>
          <b-row align-v="center">
            <b-col cols="1" sm="1" style=" max-width: 20px !important;"></b-col>
            <b-col style="max-width:180px">
              <div class="input-group mb-3">
                <span class="input-group-text" slot="prepend"
                  ><span class="requileclass">*</span>{{ $t('schedule_number') }}</span
                >
              </div>
            </b-col>
            <b-col style="max-width:200px">
              <div class="input-group mb-3">
                <span class="input-group-text" slot="prepend">{{ $t('mold_number') }}</span>
              </div>
            </b-col>
            <b-col style="max-width:150px">
              <div class="input-group mb-3">
                <span class="input-group-text" slot="prepend">{{ $t('mold_cycletime') }}</span>
              </div>
            </b-col>
            <b-col cols="1">
              <div class="input-group mb-3">
                <label class="input-group-text" for="inputGroupSelect01"
                  ><span class="requileclass">*</span>{{ $t('machine') }}</label
                >
              </div>
            </b-col>
            <b-col style="max-width:300px">
              <div class="input-group mb-3">
                <span class="input-group-text" slot="prepend"
                  ><span class="requileclass">*</span>{{ $t('schedule_start_time') }}</span
                >
              </div>
            </b-col>
            <b-col style="max-width:300px">
              <div class="input-group mb-3">
                <span class="input-group-text" slot="prepend">{{ $t('schedule_end_time') }}</span>
              </div>
            </b-col>
            <b-col>
              <div class="input-group mb-3">
                <span class="input-group-text" slot="prepend">{{ $t('remark') }}</span>
              </div>
            </b-col>
            <b-col cols="1" style="flex:0 0 5%"> </b-col>
          </b-row>
          <div v-for="(member, index) in editarray" :key="index">
            <b-row v-bind:class="[member.class]" align-v="center">
              <b-col cols="1" sm="1" style=" max-width: 20px !important;"></b-col>
              <b-col style="max-width:180px">
                <mdb-input :show="modal" v-model="member.scheduleSerial" required> </mdb-input>
              </b-col>
              <b-col style="max-width:200px">
                <mdb-input
                  style="background-color:#e9ecef;"
                  class="disabled"
                  v-model="member.moldNumber"
                  required
                >
                </mdb-input>
              </b-col>
              <b-col style="max-width:150px">
                <mdb-input
                  :show="modal"
                  v-model="member.moldCycleTime"
                  step="0.001"
                  type="number"
                  :min="0"
                  required
                >
                </mdb-input>
              </b-col>
              <b-col cols="1">
                <div class="input-group-prepend"></div>
                <b-form-select
                  v-model="member.machineId"
                  :options="member.machinearray"
                  required
                ></b-form-select>
              </b-col>
              <b-col style="max-width:300px">
                <!-- <mdb-input :show="modal" required v-model="member.startTime" type="datetime-local">
                </mdb-input> -->
                <input type="datetime-local" required :show="modal" v-model="member.startTime" />
              </b-col>
              <b-col style="max-width:300px">
                <!-- <mdb-input
                  :show="modal"
                  required
                  v-model="member.endTime"
                  type="datetime-local"
                  class="disabled"
                >
                </mdb-input> -->
                <input type="datetime-local" required :show="modal" v-model="member.endTime" />
              </b-col>
              <b-col>
                <mdb-input v-model="member.remark"> </mdb-input>
              </b-col>
              <b-col cols="1" style="flex:0 0 5%">
                <mdb-btn
                  size="sm"
                  type="button"
                  color="danger"
                  class="deitedeletebtm"
                  @click="deleteRow(index)"
                  icon="times"
                  style="padding:0.5rem"
                ></mdb-btn>
              </b-col>
            </b-row>
          </div>
        </mdb-modal-body>
        <mdb-modal-footer>
          <mdb-btn color="info" type="submit">{{ $t('submit') }}</mdb-btn>
          <mdb-btn color="0000" @click.native="modal = false" type="button">{{
            $t('close')
          }}</mdb-btn>
        </mdb-modal-footer>
      </form>
    </mdb-modal>
  </b-container>
</template>

<script>
import naturalCompare from 'string-natural-compare'
import { mapState } from 'vuex'
import datePicker from 'vue-bootstrap-datetimepicker'
import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css'
import 'bootstrap/dist/css/bootstrap.css'
import Class from '@/components/produce/schedule/amchart'
import { ScheduleTtimeAPI, ScheduleChange, ScheduleAPI } from '@/plugins/produceapis.js'
import { WorkShopAPI, MoldAPI } from '@/plugins/basicapis.js'

export default {
  components: {
    datePicker,
    'class-tab': Class
  },
  data() {
    var scheduleobject = {
      Id: null,
      name: '',
      number: ''
    }
    return {
      loadingflag: 0, //編輯加載顯示
      ScheduleTtimedata: [], //原始資料
      isbusy: true,
      newbtm: false, //新增
      editbtm: false, //編輯
      deletebtm: false, //刪除
      customize1: false, //自定義一
      customize2: false, //自定義二
      customize3: false, //自定義三
      standby_total: 0,
      task_total: 0,
      finished_total: 0,
      timesearch: false,
      statusshow: true,
      tabvalue: 3, //預設tab值
      workshopobject: [], //搜尋
      scearchworkshop: 0,
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
      compkey: 0,
      options: {
        format: 'YYYY/MM/DD  HH:mm',
        useCurrent: false
      },
      editarray: [], //編輯陣列
      editdeletearray: [], //編輯刪除陣列

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
          sortable: true
        },
        {
          key: 'manufactureOrderNumbers',
          label: this.$t('manufacturingorder_number'), //'製令編號',
          class: 'text-center',
          sortable: true,
          formatter: value => {
            if (value.length == 1) {
              return value[0]
            } else {
              if (value[0] == undefined) {
                return '-'
              } else {
                return value[0] + ', ...'
              }
            }
            // console.log(value)
            // return value
          }
        },
        {
          key: 'moldNumber',
          label: this.$t('mold_number'), //'模具編號',
          sortable: true,
          sortDirection: 'desc',
          class: 'text-center'
        },
        {
          key: 'machineNumber',
          label: this.$t('machine_number'), //'設備編號',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          }
        },
        {
          key: 'startTime',
          label: this.$t('schedule_start_time'), //'開始時間',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          }
        },
        {
          key: 'endTime',
          label: this.$t('schedule_end_time'), //'結束時間',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          }
        },
        {
          key: 'moldCycleTime',
          label: this.$t('mold_cycletime'), //'計畫週期時間',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return this.dealThousands('0', value)
          }
        },
        {
          key: 'qty',
          label: this.$t('mold_qty'), //'沒次',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return this.dealThousands('0', value)
          }
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
          }
        },
        {
          key: 'status',
          label: this.$t('status'), //'狀態',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            switch (value) {
              case 1:
                value = this.$t('tab_finished') //'已完成'
                break
              case 2:
                value = this.$t('tab_in_task') //'任務中'
                break
              case 3:
                value = this.$t('tab_standby_to_task') //'待轉任務'
                break
              // case 4:
              //   value = this.$t('') //'修改中'
              //   break
              // case 5:
              //   value = this.$t('') //'其他'
              //   break
              // case 6:
              //   value = this.$t('') //'排程中止'
              //   break
            }
            return value
          }
        },
        { key: 'actions', label: this.$t('operating'), class: 'text-center' }
      ],
      totalRows: 0,
      currentPage: 1,
      perPage: 100,
      pageOptions: [20, 50, 100],
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [
        'customizeNumbers',
        'manufactureOrderNumbers',
        'scheduleSerial',
        'moldNumber',
        'machineNumber',
        'startTime',
        'endTime',
        'qty',
        'remark'
      ],
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
  created() {
    this.inistartdate.setDate(new Date().getDate())
    this.inienddate.setDate(new Date().getDate() - 180)
    this.iniright()
    this.getworkshop()
    var today = new Date()
    var today1 = new Date()
    today.setHours(0)
    today.setMinutes(0)
    this.data = {
      workshop: 0,
      scarchbtm: 0,
      inputstarttime: today,
      inputendtime: today1
    }
    this.data.inputendtime.setDate(new Date().getDate())
    this.data.inputstarttime.setDate(new Date().getDate() - 180)
    this.data.inputendtime.setDate(new Date().getDate() + 1)
    this.data.inputendtime.setHours(0)
    this.data.inputendtime.setMinutes(0)
  },
  mounted() {
    this.getdata()
  },
  methods: {
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
    //點擊tab
    tabclickfunc(value) {
      switch (value) {
        case 1:
          this.statusshow = false
          this.timesearch = true
          break
        case 2:
          this.statusshow = false
          this.timesearch = false
          break
        case 3:
          this.data.inputendtime = this.inistartdate
          this.data.inputstarttime = this.inienddate

          this.data.inputendtime.setHours(0)
          this.data.inputendtime.setMinutes(0)
          this.statusshow = true
          this.timesearch = false
          break
      }
      this.tabvalue = value
      this.data = {
        tabvalue: this.tabvalue,
        workshop: this.scearchworkshop,
        scarchbtm: this.data.scarchbtm + 1,
        inputstarttime: this.data.inputstarttime,
        inputendtime: this.data.inputendtime,
        timesearch: this.timesearch
      }
      this.getdata()
      this.selectdata(this.tabvalue)
    },
    //依狀態篩選資料
    selectdata(value) {
      var temparray = []
      if (this.tabledata1 != null) {
        this.tabledata1.forEach(item => {
          //選擇狀態
          if (item.status == value) {
            //選擇車間
            if (this.scearchworkshop == 0) {
              temparray.push(item)
            } else {
              if (this.scearchworkshop == item.workShopId) {
                temparray.push(item)
              }
            }
          }
        })
        if (temparray != null) {
          this.totalRows = temparray.length
        }
      }

      this.tabledata = temparray
      this.isbusy = false
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
            value: 0
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
      this.editdeletearray.push(this.editarray[index].id)
      this.editarray.splice(index, 1)
    },
    getdata() {
      this.data = {
        tabvalue: this.tabvalue,
        workshop: this.scearchworkshop,
        scarchbtm: this.data.scarchbtm + 1,
        inputstarttime: this.data.inputstarttime,
        inputendtime: this.data.inputendtime,
        timesearch: this.timesearch
      }
      var access_token_val = this.$cookies.get('access_token')
      ScheduleTtimeAPI.get({
        headers: {
          access_token: access_token_val,
          startTime: this.stringToTimestampFunc(this.data.inputstarttime),
          endTime: this.stringToTimestampFunc(this.data.inputendtime),
          all: !this.timesearch
        }
      }).then(
        res => {
          this.ScheduleTtimedata = JSON.parse(JSON.stringify(res.data))
          this.searchstartTime = this.stringToTimestampFunc(this.inputstarttime)
          this.searchendTime = this.stringToTimestampFunc(this.inputendtime)
          if (res.data != null && res.data.schedule != null) {
            res.data = this.dealrealdata(res.data)

            //  this.totalRows = res.schedule.length
          }
          this.tabledata1 = res.data.schedule
          this.selectdata(this.tabvalue)
        },
        error => {
          this.isbusy = false
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //處理時間、計算tab總數
    dealrealdata(data) {
      this.standby_total = 0
      this.task_total = 0
      this.finished_total = 0
      if (data != data) {
        data.schedule.forEach(item => {
          item.info = this.sortinfo(item.info)
          item.endTime = this.timeStampToStringFunc(item.endTime, 'yyyy-mm-dd hh:mm')
          item.startTime = this.timeStampToStringFunc(item.startTime, 'yyyy-mm-dd hh:mm')
          // if (item.info != null) {
          //   var tempnum = 0
          //   item.info.forEach(infoitem => {
          //     tempnum += infoitem.qty
          //   })
          //   item.qty = tempnum
          // }
          if (item.status == 1) {
            //已完成
            this.finished_total += 1
          } else if (item.status == 2) {
            //任務中
            this.task_total += 1
          } else if (item.status == 3) {
            //待轉任務
            this.standby_total += 1
          }
        })
      }
      data.schedule.forEach(item => {
        item.info = this.sortinfo(item.info)
        item.endTime = this.timeStampToStringFunc(item.endTime, 'yyyy-mm-dd hh:mm')
        item.startTime = this.timeStampToStringFunc(item.startTime, 'yyyy-mm-dd hh:mm')
        // if (item.info != null) {
        //   var tempnum = 0
        //   item.info.forEach(infoitem => {
        //     tempnum += infoitem.qty
        //   })
        //   item.qty = tempnum
        // }
        if (item.status == 1) {
          //已完成
          this.finished_total += 1
        } else if (item.status == 2) {
          //任務中
          this.task_total += 1
        } else if (item.status == 3) {
          //待轉任務
          this.standby_total += 1
        }
      })
      this.standby_total = this.dealThousands('0', this.standby_total)
      this.task_total = this.dealThousands('0', this.task_total)
      this.finished_total = this.dealThousands('0', this.finished_total)
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
      this.editdeletearray = [] //清空
      this.editarray = JSON.parse(JSON.stringify(this.selected))

      this.loadingflag = 0
      this.editarray.forEach((item, index) => {
        this.getmold(item.moldId, index)

        item.startTime = this.timestringtodatetimeloacl(item.startTime)
        item.endTime = this.timestringtodatetimeloacl(item.endTime)
        item.class = { class: 'okinput' }
      })
    },
    getmold(id, index) {
      var access_token_val = this.$cookies.get('access_token')
      MoldAPI.get({
        headers: {
          access_token: access_token_val,
          id: id
        }
      }).then(
        res => {
          if (res.data.machineData != null) {
            res.data.machineData.sort((a, b) => naturalCompare(a.machineNumber, b.machineNumber))
          }
          this.editarray[index].machinearray = []
          if (res.data.machineData != null) {
            res.data.machineData.forEach(item => {
              this.editarray[index].machinearray.push({
                value: item.id,
                text: item.machineNumber
              })
            })
          }

          //等全部加載完才顯示視窗

          this.loadingflag++
          if (this.loadingflag == this.editarray.length) {
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
    // 送出
    submitfunc() {
      var subitarray = {
        schedule: [],
        delete: []
      }
      this.editarray.forEach(item => {
        var tempobject = {
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
          workShopId: item.workShopId
        }
        subitarray.schedule.push(JSON.parse(JSON.stringify(tempobject)))
      })
      subitarray.delete = this.editdeletearray //f取得刪除值
      var access_token_val = this.$cookies.get('access_token')
      ScheduleChange(JSON.stringify(subitarray), {
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
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
          // var errorarray = error.responseJSON.overlappedArr //時間衝突
          // var timeErrArr = error.responseJSON.timeErrArr //開始大於結束時間
          // if (errorarray != null) {
          //   errorarray.forEach(item => {
          //     this.editarray.forEach((object, index) => {
          //       if (item.id == object.id) {
          //         object.class = 'errorinput'
          //         this.$set(this.editarray, index, object)
          //       }
          //     })
          //   })
          // }
          // if (timeErrArr != null) {
          //   timeErrArr.forEach(item => {
          //     this.editarray.forEach((object, index) => {
          //       if (item.id == object.id) {
          //         object.class = 'errorinput'
          //         this.$set(this.editarray, index, object)
          //       }
          //     })
          //   })
          // }
        }
      )
    },
    // 刪除
    deletemold() {
      var access_token_val = this.$cookies.get('access_token')
      this.selected.forEach(item => {
        ScheduleAPI.delete({
          headers: {
            access_token: access_token_val,
            id: item.id
          }
        }).then(
          () => {
            this.$layer.msg(this.$t('scuccess'))
            this.modal = false
            this.getdata()
            this.compkey += 1
          },
          error => {
            console.log(error.response)
            this.$layer.msg(this.$t('fail') + error.response.data.response)
            this.modal = false
          }
        )
      })
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
<style padding>
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
.deitedeletebtm {
  position: relative;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}
table.table td {
  vertical-align: middle;
  padding-top: 0;
  padding-bottom: 0rem;
}
.okinput {
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
