<template>
  <div>
    <!-- <div class="mx-3">
      <h2>假日管理</h2>
    </div>-->

    <b-col lg="16" class="my-1">
      <mdb-input
        style="width:50%"
        v-model="filter"
        type="search"
        id="filterInput"
        :placeholder="this.$t('employee_holiday_type') + '、' + this.$t('employee_holiday_remark')"
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
      v-on:click="holidaywindow([], [], 'new')"
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
      class="employeeholidaypctableclass"
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
          @click="holidaywindow(row.item, row.index, 'edit')"
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
        <b-button size="sm" @click="holidaywindow(row.item, row.index, 'edit')">編輯</b-button>
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
        <mdb-btn color="info" v-on:click="deleteholiday()" @click.native="warning = false">{{
          $t('delete')
        }}</mdb-btn>
        <mdb-btn color="0000" @click.native="warning = false">{{ $t('close') }}</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
    <mdb-modal centered :show="modal" @close="closemodal($event)">
      <form v-on:submit.prevent="submitfunc">
        <mdb-modal-header>
          <mdb-modal-title>{{ operate }} {{ $t('employee_holiday') }}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <div>
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01"
                  ><span class="requileclass">*</span>{{ $t('employee_holiday_type') }}</label
                >
              </div>
              <b-form-select
                v-model="holidayobject.type"
                :options="typeOptions"
                required
                @change="onChange()"
              ></b-form-select>
            </div>
            <div class="input-group" style="margin-bottom: 1rem">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">
                  <span class="requileclass">*</span>
                  {{ $t('employee_start_time') }}
                </label>
              </div>
              <input
                type="datetime-local"
                class="form-control"
                v-model="holidayobject.startTime"
                required
              />
            </div>

            <div class="input-group" style="margin-bottom: 1rem">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">
                  <span class="requileclass">*</span>
                  {{ $t('employee_end_time') }}
                </label>
              </div>
              <input
                type="datetime-local"
                class="form-control"
                v-model="holidayobject.endTime"
                required
              />
            </div>

            <div class="input-group mb-3" v-show="weekdaydisplay">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01"
                  ><span class="requileclass">*</span>{{ $t('employee_holiday_week') }}</label
                >
              </div>
              <b-form-select
                v-model="holidayobject.weekday"
                :options="weekday"
                required
              ></b-form-select>
            </div>
            <mdb-input class="mb-3" v-model="holidayobject.remark">
              <span class="input-group-text" slot="prepend">{{
                $t('employee_holiday_remark')
              }}</span>
            </mdb-input>
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
import { mapState } from 'vuex'
import { EmployeeHolidayAPI, EmployeeHolidayDeleteMultiAPI } from '@/plugins/basicapis.js'
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
    var holidayobject = {
      Id: 0,
      remark: '',
      endTime: 0,
      startTime: 0,
      weekday: 0,
      type: 1
    }
    var holidayobjectnull = JSON.parse(JSON.stringify(holidayobject))
    return {
      errormes: '', //錯誤訊息
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
      weekdaydisplay: false,
      weekday: [
        {
          text: this.$t('sun'), //星期日',
          value: 0
        },
        {
          text: this.$t('mon'), //'星期一',
          value: 1
        },
        {
          text: this.$t('tue'), //'星期二',
          value: 2
        },
        {
          text: this.$t('wed'), //'星期三',
          value: 3
        },
        {
          text: this.$t('thu'), //'星期四',
          value: 4
        },
        {
          text: this.$t('fri'), //'星期五',
          value: 5
        },
        {
          text: this.$t('sat'), //'星期六',
          value: 6
        }
      ],
      typeOptions: [
        {
          text: this.$t('employee_holiday_national_holiday'), //'國定假日',
          value: 1
        },
        {
          text: this.$t('employee_holiday_official_holiday'), //'例假日',
          value: 2
        },
        {
          text: this.$t('employee_holiday_vacation_holiday'), //'休假日',
          value: 3
        },
        {
          text: this.$t('employee_holiday_custom_overtime'), //'自定義補班',
          value: 4
        },
        {
          text: this.$t('employee_holiday_custom_rest'), //'自定義休息',
          value: 5
        }
      ],
      deletebundisable: true,
      selected: [],
      holidayobject,
      holidayobjectnull,
      operate: '',
      warning: false,
      modal: false,
      tabledata: [],
      fields: [
        {
          key: 'typeshow',
          label: this.$t('employee_holiday_type'), //'類別',
          sortDirection: 'desc',
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'startTime',
          label: this.$t('employee_start_time'), //'開始時間',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return this.timeStampToStringFunc(value, 'yyyy-mm-dd hh:mm')
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'endTime',
          label: this.$t('employee_end_time'), //'結束時間',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return this.timeStampToStringFunc(value, 'yyyy-mm-dd hh:mm')
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'weekday',
          label: this.$t('employee_holiday_week'), //'星期',
          sortable: true,
          class: 'text-center',
          formatter: (value, row, item) => {
            if (item.type != 2 && item.type != 3) {
              return '-'
            }
            switch (value) {
              case 0:
                return this.$t('sun') //'星期日'
              case 1:
                return this.$t('mon') //'星期一'
              case 2:
                return this.$t('tue') //'星期二'
              case 3:
                return this.$t('wed') //'星期三'
              case 4:
                return this.$t('thu') //'星期四'
              case 5:
                return this.$t('fri') //'星期五'
              case 6:
                return this.$t('sat') //'星期六'
              default:
                return '-'
            }
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'remark',
          label: this.$t('employee_holiday_remark'), //'備註',
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
      filterOn: ['remark', 'typeshow'],
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
    //modal背景點擊不關閉
    closemodal(value) {
      if (value == undefined) {
        this.modal = false
      }
    },
    onChange() {
      if (this.holidayobject.type == 2 || this.holidayobject.type == 3) {
        this.weekdaydisplay = true
      } else {
        this.weekdaydisplay = false
      }
    },
    //處理類別
    dealtype(value) {
      let tempvalue = this.$t('employee_holiday_national_holiday') //'國定假日'
      switch (value) {
        case 1:
          tempvalue = this.$t('employee_holiday_national_holiday') //'國定假日'
          break
        case 2:
          tempvalue = this.$t('employee_holiday_official_holiday') //'例假日'
          break
        case 3:
          tempvalue = this.$t('employee_holiday_vacation_holiday') //'休假日'
          break
        case 4:
          tempvalue = this.$t('employee_holiday_custom_overtime') //'自定義例假日'
          break
        case 5:
          tempvalue = this.$t('employee_holiday_custom_rest') //'自定義休假日'
          break
      }
      return tempvalue
    },

    getdata() {
      var access_token_val = this.$cookies.get('access_token')
      EmployeeHolidayAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          if (res.data != null) {
            let temparray = []
            res.data.forEach(item => {
              item.typeshow = this.dealtype(item.type)
              temparray.push(item)
            })
            this.tabledata = temparray
            this.totalRows = temparray.length
          } else {
            this.tabledata = []
            this.totalRows = 0
          }
          this.setfooternum() //設定頁數
          this.isbusy = false
        },
        error => {
          console.log(error.response)
          this.isbusy = false
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

    resetInfoModal() {
      this.infoModal.title = ''
      this.infoModal.content = ''
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    holidaywindow(item, index, mode) {
      this.errormes = ''
      if (mode == 'edit') {
        this.operate = this.$t('edit')
      } else if (mode == 'new') {
        this.operate = this.$t('new')
      }
      if (mode == 'edit') {
        this.editwindow(item)
      } else {
        this.newwindow()
      }
      this.modal = true
    },
    //編輯
    editwindow(item) {
      if (item.type == 2 || item.type == 3) {
        this.weekdaydisplay = true
      } else {
        this.weekdaydisplay = false
      }
      this.holidayobject = JSON.parse(JSON.stringify(item))
      //設定開始時間
      this.holidayobject.startTime = this.timeStampToStringFunc(
        this.holidayobject.startTime,
        'yyyy-mm-ddThh:mm'
      )
      //設定結束時間
      this.holidayobject.endTime = this.timeStampToStringFunc(
        this.holidayobject.endTime,
        'yyyy-mm-ddThh:mm'
      )
    },
    //新增
    newwindow() {
      this.holidayobject = JSON.parse(JSON.stringify(this.holidayobjectnull))
      var nowtimestamp = this.stringToTimestampFunc(new Date()) //取得現在時間timestamp

      this.holidayobject.startTime = this.timeStampToStringFunc(nowtimestamp, 'yyyy-mm-ddThh:mm') //設定現在時間
      this.holidayobject.endTime = this.timeStampToStringFunc(nowtimestamp, 'yyyy-mm-ddThh:mm') //設定現在時間
    },
    dealdata() {
      this.holidayobject.startTime = this.stringToTimestampFunc(this.holidayobject.startTime)
      this.holidayobject.endTime = this.stringToTimestampFunc(this.holidayobject.endTime)
    },
    // 送出
    submitfunc() {
      this.dealdata()

      if (this.holidayobject.startTime >= this.holidayobject.endTime) {
        this.holidayobject.startTime = this.timeStampToStringFunc(
          this.holidayobject.startTime,
          'yyyy-mm-ddThh:mm'
        )
        this.holidayobject.endTime = this.timeStampToStringFunc(
          this.holidayobject.endTime,
          'yyyy-mm-ddThh:mm'
        )
        this.errormes = this.$t('employed_holiday_time_error')
      } else {
        var access_token_val = this.$cookies.get('access_token')
        if (this.holidayobject.Id == '') {
          EmployeeHolidayAPI.post(JSON.stringify(this.holidayobject), {
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
          EmployeeHolidayAPI.put(JSON.stringify(this.holidayobject), {
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
    deleteholiday() {
      var access_token_val = this.$cookies.get('access_token')

      EmployeeHolidayDeleteMultiAPI.delete({
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
<style>
.employeeholidaypctableclass {
  max-height: calc(100vh - 346px) !important;
}
.holidaynumberclass {
  max-width: 30px;
  text-align: center;
}
#eee.select-wrapper.md-form {
  margin-top: 0%;
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
