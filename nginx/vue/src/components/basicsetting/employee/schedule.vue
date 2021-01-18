<template>
  <div>
    <!-- <div class="mx-3">
      <h2>排班管理</h2>
    </div>-->
    <b-col lg="16" class="my-1">
      <mdb-input
        style="width:50%"
        v-model="filter"
        type="search"
        id="filterInput"
        :placeholder="
          this.$t('workshop') +
            '、' +
            this.$t('employee_class') +
            '、' +
            this.$t('employee_type') +
            '、' +
            this.$t('employee_mode')
        "
      >
        <span class="input-group-text" slot="prepend">{{ $t('search') }}</span>
        <!-- <mdb-btn size="sm" color="primary" :disabled="!filter" @click="filter = ''">清除</mdb-btn> -->
      </mdb-input>
    </b-col>
    <!-- 新增 -->
    <mdb-btn
      :disabled="newbtndisabled"
      v-if="newbtm"
      size="sm"
      color="primary"
      v-on:click="classschedulewindow([], [], 'new')"
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

    <b-table
      class="employeeschedulepctableclass"
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
      <template v-slot:cell(numberserial)="row" class="col-sm-3">
        {{ row.index }}
      </template>
      <!-- <template v-slot:cell(name)="row">{{ row.value }}</template> -->
      <!-- <template v-slot:cell(checkbox)="row">
        <b-form-checkbox></b-form-checkbox>
      </template>-->

      <template v-slot:cell(actions)="row">
        <mdb-btn
          v-if="editbtm"
          color="mdb-color"
          @click="classschedulewindow(row.item, row.index, 'edit')"
          type="button"
          style="padding:0.1rem"
          icon="pencil-alt"
        ></mdb-btn>

        <mdb-btn style="width: 0px;padding: 0.1rem 0px;" icon="trash-alt"></mdb-btn
        ><!-- 固定欄高 -->
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
      <template v-slot:cell(numberserial)="row" class="col-sm-3">
        {{ row.index }}
      </template>
      <!-- <template v-slot:cell(name)="row">{{ row.value }}</template> -->
      <!-- <template v-slot:cell(checkbox)="row">
        <b-form-checkbox></b-form-checkbox>
      </template>-->

      <!-- <template v-slot:cell(actions)="row">
        <b-button size="sm" @click="classschedulewindow(row.item, row.index, 'edit')"
          >編輯</b-button
        >
        <b-button size="sm" @click="row.toggleDetails">{{ row.detailsShowing ? '隱藏' : '顯示' }} 詳細</b-button>
      </template> -->
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
        <b-form-group label-align-sm="right" label-size="sm" label-for="perPageSelect" class="mb-0">
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

    <mdb-modal centered :show="warning" @close="warning = false">
      <mdb-modal-header>
        <mdb-modal-title>{{ $t('warrning_title') }}</mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body>{{ $t('warrning_body') }}</mdb-modal-body>
      <mdb-modal-footer>
        <mdb-btn color="info" v-on:click="deleteclassschedule()" @click.native="warning = false">{{
          $t('delete')
        }}</mdb-btn>
        <mdb-btn color="0000" @click.native="warning = false">{{ $t('close') }}</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
    <mdb-modal :show="modal" @close="closemodal($event)" size="lg">
      <form v-on:submit.prevent="submitfunc">
        <mdb-modal-header>
          <mdb-modal-title>{{ operate }} {{ $t('employee_schedule_schedule') }}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <div>
            <b-row>
              <b-col>
                <div class="input-group" style="margin-bottom: 1rem">
                  <div class="input-group-prepend">
                    <label class="input-group-text" for="inputGroupSelect01"
                      ><span class="requileclass">*</span>{{ $t('workshop') }}</label
                    >
                  </div>
                  <b-form-select
                    v-model="classscheduleobject.workShopId"
                    :options="workshopobject"
                  ></b-form-select>
                </div>
              </b-col>
              <b-col>
                <div class="input-group" style="margin-bottom: 1rem">
                  <div class="input-group-prepend">
                    <label class="input-group-text" for="inputGroupSelect01"
                      ><span class="requileclass">*</span>{{ $t('employee_class') }}</label
                    >
                  </div>
                  <div class="form-control selsect">
                    <model-select
                      v-model="classscheduleobject.classId"
                      :options="classobject"
                      required
                    >
                    </model-select>
                  </div>
                  <!-- <b-form-select
                    v-model="classscheduleobject.classId"
                    :options="classobject"
                    required
                  ></b-form-select> -->
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <div class="input-group" style="margin-bottom: 1rem">
                  <div class="input-group-prepend">
                    <label class="input-group-text" for="inputGroupSelect01"
                      ><span class="requileclass">*</span>{{ $t('employee_type') }}</label
                    >
                  </div>
                  <b-form-select
                    v-model="classscheduleobject.type"
                    :options="typeobject"
                    required
                    @change="typeobjectonChange($event)"
                  ></b-form-select>
                </div>
              </b-col>
              <b-col>
                <div class="input-group" style="margin-bottom: 1rem">
                  <div class="input-group-prepend">
                    <label class="input-group-text" for="inputGroupSelect01"
                      ><span class="requileclass">*</span>{{ $t('employee_mode') }}</label
                    >
                  </div>
                  <b-form-select
                    v-model="classscheduleobject.workType"
                    :options="workTypeobject"
                    required
                    :disabled="typedisable"
                  ></b-form-select>
                </div>
              </b-col>
            </b-row>

            <b-row>
              <b-col>
                <mdb-input
                  class="mb-3"
                  v-model="classscheduleobject.startTime"
                  type="time"
                  step="60"
                >
                  <span class="input-group-text" slot="prepend"
                    ><span class="requileclass">*</span>{{ $t('employee_start_time') }}</span
                  >
                </mdb-input>
              </b-col>
              <b-col>
                <mdb-input class="mb-3" v-model="classscheduleobject.endTime" type="time" step="60">
                  <span class="input-group-text" slot="prepend"
                    ><span class="requileclass">*</span>{{ $t('employee_end_time') }}</span
                  >
                </mdb-input>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <div class="input-group" style="margin-bottom: 1rem">
                  <div class="input-group-prepend">
                    <label class="input-group-text" for="inputGroupSelect01">
                      <span class="requileclass">*</span>
                      {{ $t('employee_start_date') }}
                    </label>
                  </div>
                  <input type="date" class="form-control" v-model="startdate" required />
                </div>
              </b-col>
              <b-col>
                <div class="input-group" style="margin-bottom: 1rem">
                  <div class="input-group-prepend">
                    <label class="input-group-text" for="inputGroupSelect01">
                      <span class="requileclass">*</span>
                      {{ $t('employee_end_date') }}
                    </label>
                  </div>
                  <input type="date" class="form-control" v-model="enddate" required />
                </div>
              </b-col>
            </b-row>
          </div>
        </mdb-modal-body>
        <mdb-modal-footer>
          <div style="color:red">{{ errormes }}</div>
          <mdb-btn color="info" type="submit">{{ $t('submit') }}</mdb-btn>
          <mdb-btn color="0000" @click.native="modal = false" type="button">{{
            $t('close')
          }}</mdb-btn>
        </mdb-modal-footer>
      </form>
    </mdb-modal>
  </div>
</template>

<script>
import {
  EmployeeScheduleAPI,
  EmployeeClassAPI,
  WorkShopAPI,
  EmployeeScheduleDeleteMultAPI
} from '@/plugins/basicapis.js'
import { ModelSelect } from 'vue-search-select'
import { mapState } from 'vuex'
export default {
  watch: {
    modal: function(value) {
      if (!value) {
        this.newbtndisabled = false
      }
    },
    currentPage: function() {
      this.setfooternum() //設定頁數
    },
    perPage: function() {
      this.setfooternum() //設定頁數
    }
  },
  components: {
    ModelSelect
  },
  data() {
    var classscheduleobject = {
      Id: 0,
      // name: "",
      // address: "",
      // mailAddress: "",
      // taxId: ""
      classId: 1,
      endDate: 1581706690,
      endHour: 0,
      endMinute: 0,
      id: 1,
      startDate: 1571706690000,
      startHour: 23,
      startMinute: 6,
      type: 1,
      workShopId: 1,
      workType: 3
    }
    var classscheduleobjectnull = JSON.parse(JSON.stringify(classscheduleobject))
    return {
      errormes: '', //錯誤訊息
      newbtndisabled: false, //新增按鈕停用
      page_first: 0, //第一條
      page_last: 0, //最後一筆
      page_total: 0, //總共筆數
      isbusy: true,
      newbtm: false, //新增
      editbtm: false, //編輯
      deletebtm: false, //刪除
      customize1: false, //自定義一
      customize2: false, //自定義二
      customize3: false, //自定義三
      startdate: '',
      enddate: '',
      typedisable: false,
      workshopobject: [],
      classobject: [],
      workshopobjectselected: 0,
      classobjectselected: 0,
      typeobject: [
        { text: this.$t('employee_normal'), value: 1 }, //一般
        { text: this.$t('employee_overtime'), value: 2 } //加班
      ],
      workTypeobject: [
        { text: this.$t('employee_everyday'), value: 3 },
        { text: this.$t('employee_odd_day'), value: 1 },
        { text: this.$t('employee_even_day'), value: 2 },
        { text: this.$t('employee_odd_week'), value: 4 },
        { text: this.$t('employee_even_week'), value: 5 },
        { text: '-', value: 0, disabled: true }
      ],
      deletebundisable: true,
      selected: [],
      classscheduleobject,
      classscheduleobjectnull,
      operate: '',
      warning: false,
      modal: false,
      tabledata: [],
      fields: [
        {
          key: 'workShopName',
          label: this.$t('workshop'), //'廠區',
          sortDirection: 'desc',
          class: 'text-center',
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'className',
          label: this.$t('employee_class'), //'班別',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'typeshow',
          label: this.$t('employee_type'), //'類型',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'workTypeshow',
          label: this.$t('employee_mode'), //'模式',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'time',
          label: this.$t('employee_time'), //'時間',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'date',
          label: this.$t('employee_date'), //'日期',
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
      filterOn: ['workShopName', 'className', 'typeshow', 'workTypeshow'],
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
    this.getdata()
  },
  methods: {
    //設定權限
    iniright() {
      this.authority.forEach(item => {
        if (item.name == 'basicsetting_employee') {
          console.log(item)
          if (!(!item.operation.includes(1) && item.operation.length == 1)) {
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
        this.modal = false
      }
    },
    typeobjectonChange(value) {
      if (value == 1) {
        this.typedisable = false
        this.classscheduleobject.workType = 1
      } else {
        this.typedisable = true
        this.classscheduleobject.workType = 0
      }
    },
    //處理類型顯示
    dealtype(value) {
      let tempvalue = this.$t('employee_normal')
      switch (value) {
        case 1:
          tempvalue = this.$t('employee_normal')
          break
        case 2:
          tempvalue = this.$t('employee_overtime')
          break
      }
      return tempvalue
    },
    //處理模式顯示
    dealworkType(value) {
      let tempvalue = '-'
      switch (value) {
        case 0:
          tempvalue = '-'
          break
        case 1:
          tempvalue = this.$t('employee_odd_day') //'單數日'
          break
        case 2:
          tempvalue = this.$t('employee_even_day') //'雙數日'
          break
        case 3:
          tempvalue = this.$t('employee_everyday') //'每日'
          break
        case 4:
          tempvalue = this.$t('employee_odd_week') //'每周一三五'
          break
        case 5:
          tempvalue = this.$t('employee_even_week') //'每周二四六'
          break
      }
      return tempvalue
    },
    dealorgdata(data) {
      data.forEach(item => {
        item.typeshow = this.dealtype(item.type) //處理類型顯示
        item.workTypeshow = this.dealworkType(item.workType) //處理模式顯示
        //結合開始小時分
        item.startTime =
          this.pushZeroFunc(item.startHour) + ':' + this.pushZeroFunc(item.startMinute)
        //結合結束小時分
        item.endTime = this.pushZeroFunc(item.endHour) + ':' + this.pushZeroFunc(item.endMinute)
        //結合開始結束時間
        item.time = item.startTime + ' - ' + item.endTime
        //結合開始結束日期
        item.date =
          this.timeStampToStringFunc(item.startDate, 'yyyy/mm/dd') +
          ' - ' +
          this.timeStampToStringFunc(item.endDate, 'yyyy/mm/dd')
      })
      return data
    },
    getdata() {
      var access_token_val = this.$cookies.get('access_token')
      EmployeeScheduleAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          if (res.data != null) {
            res.data = this.dealorgdata(res.data)
            this.totalRows = res.data.length
          } else {
            res.data = []
            this.totalRows = 0
          }
          this.tabledata = res.data
          this.isbusy = false
          this.setfooternum()
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
          this.isbusy = false
        }
      )
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
          if (res.data != null) {
            res.data.forEach(item => {
              this.workshopobject.push({ text: item.name, value: item.id })
            })
          }
          this.getclass() //取得班別
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },

    //取得班別
    getclass() {
      var access_token_val = this.$cookies.get('access_token')
      EmployeeClassAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          this.classobject = []

          if (res.data == null) {
            this.$layer.msg(this.$t('employee_class_notset'))
          } else {
            res.data.forEach(item => {
              this.classobject.push({ text: item.name, value: item.id })
            })
            this.modal = true
          }
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
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
    //新增編輯視窗
    classschedulewindow(item, index, mode) {
      this.newbtndisabled = true
      this.errormes = ''
      if (mode == 'edit') {
        this.operate = this.$t('edit')
      } else if (mode == 'new') {
        this.typeobjectonChange(1)
        this.operate = this.$t('new')
      }

      this.getworkshop() //取得廠區

      if (mode == 'edit') {
        this.editwindow(item)
      } else {
        this.newwindow()
      }
    },
    //編輯
    editwindow(item) {
      this.classscheduleobject = JSON.parse(JSON.stringify(item))
      this.startdate = this.timeStampToStringFunc(item.startDate, 'yyyy-mm-dd')
      this.enddate = this.timeStampToStringFunc(item.endDate, 'yyyy-mm-dd')
    },
    //新增
    newwindow() {
      this.classscheduleobject = JSON.parse(JSON.stringify(this.classscheduleobjectnull))
      this.classscheduleobject.startTime = '00:00'
      this.classscheduleobject.endTime = '00:00'
      var timestamp = Math.floor(Date.now()) //取得當下timestamp
      this.startdate = this.timeStampToStringFunc(timestamp, 'yyyy-mm-dd') //開始日期預設今天
      this.enddate = this.timeStampToStringFunc(timestamp, 'yyyy-mm-dd') //結束日期預設今天
    },
    dealdata() {
      this.classscheduleobject.startDate = this.stringToTimestampFunc(this.startdate)
      this.classscheduleobject.endDate = this.stringToTimestampFunc(this.enddate)
      //處理starHour
      this.classscheduleobject.startHour = parseInt(
        this.classscheduleobject.startTime.substring(0, 2)
      )
      //處理startMinute
      this.classscheduleobject.startMinute = parseInt(
        this.classscheduleobject.startTime.substring(3, 5)
      )
      //處理endHour
      this.classscheduleobject.endHour = parseInt(this.classscheduleobject.endTime.substring(0, 2))
      //處理endMinute
      this.classscheduleobject.endMinute = parseInt(
        this.classscheduleobject.endTime.substring(3, 5)
      )
    },
    // 送出
    submitfunc() {
      this.dealdata()

      if (this.classscheduleobject.startDate > this.classscheduleobject.endDate) {
        this.classscheduleobject.startDate = this.timeStampToStringFunc(
          this.classscheduleobject.startDate,
          'yyyy-mm-ddThh:mm'
        )
        this.classscheduleobject.endDate = this.timeStampToStringFunc(
          this.classscheduleobject.endDate,
          'yyyy-mm-ddThh:mm'
        )
        this.errormes = this.$t('employed_schedule_time_error')
      } else {
        var access_token_val = this.$cookies.get('access_token')
        if (this.classscheduleobject.Id == '') {
          EmployeeScheduleAPI.post(JSON.stringify(this.classscheduleobject), {
            headers: {
              access_token: access_token_val
            }
          }).then(
            () => {
              this.getdata()
              this.$layer.msg(this.$t('scuccess'))
              this.modal = false
              this.isbusy = true
            },
            error => {
              console.log(error.response)
              this.$layer.msg(this.$t('fail') + error.response.data.response)
              this.modal = false
            }
          )
        } else {
          EmployeeScheduleAPI.put(JSON.stringify(this.classscheduleobject), {
            headers: {
              access_token: access_token_val
            }
          }).then(
            () => {
              this.getdata()
              this.$layer.msg(this.$t('scuccess'))
              this.modal = false
              this.isbusy = true
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
    deleteclassschedule() {
      var access_token_val = this.$cookies.get('access_token')

      EmployeeScheduleDeleteMultAPI.delete({
        headers: {
          access_token: access_token_val,
          ids: this.selectedArrayToString(this.selected)
        }
      }).then(
        () => {
          this.getdata()
          this.$layer.msg(this.$t('scuccess'))
          this.modal = false
          this.isbusy = true
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
<style scoped>
.ui.selection.dropdown {
  border: 0px !important;
}
</style>
<style>
.employeeschedulepctableclass {
  max-height: calc(100vh - 346px) !important;
}
.classschedulenumberclass {
  max-width: 30px;
  text-align: center;
}
#eee.select-wrapper.md-form {
  margin-top: 0%;
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
