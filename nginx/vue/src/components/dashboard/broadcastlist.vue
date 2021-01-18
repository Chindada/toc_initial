<template>
  <b-container fluid>
    <mdb-card>
      <mdb-card-body>
        <!-- <div class="mx-3">
          <h2>推播列表</h2>
        
        </div> -->
        <b-tabs
          active-nav-item-class="font-weight-bold text-uppercase "
          active-tab-class="font-weight-bold"
        >
          <b-tab
            :title="this.$t('broadcast_realtime')"
            active
            @click="tabclickfunc(1)"
            style="padding-top:0"
          ></b-tab>
          <b-tab
            :title="this.$t('broadcast_overtime')"
            @click="tabclickfunc(2)"
            style="padding-top:0"
          ></b-tab>
          <b-tab
            :title="this.$t('broadcast_history')"
            @click="tabclickfunc(3)"
            style="padding-top:0"
          ></b-tab>
        </b-tabs>
        <b-col lg="16" class="my-1">
          <div style="opacity:0">wal</div>
          <!-- <mdb-input style="width:50%" v-model="filter" type="search" id="filterInput" placeholder>
            <span class="input-group-text" slot="prepend">{{ $t('search') }}</span>

          </mdb-input>-->
        </b-col>
        <b-table
          class="broadcastlistpctableclass"
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
          <template v-slot:cell(machineId)="row" class="col-sm-3">{{ row.item }}</template>
          <template v-slot:cell(name)="row" class="col-sm-3">
            {{ row.item.name }}
            <mdb-btn style="width: 0px;padding: 0.4rem 0px;" icon="trash-alt"></mdb-btn>
            <!-- 固定欄高 -->
          </template>
          <!-- <template v-slot:cell(name)="row">{{ row.value }}</template> -->
          <!--<template v-slot:cell(checkbox)="row">
            <b-form-checkbox></b-form-checkbox>
          </template>-->

          <template v-slot:cell(actions)="row">
            <!-- 停止 -->
            <mdb-btn
              color="danger"
              @click="relieveerror(row.item, row.index, 'end')"
              type="button"
              style="padding:0.1rem;margin:auto"
              icon="bell-slash"
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
        <mdb-modal-title>{{ $t('broadcast_lift_title') }}</mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body>{{ $t('broadcast_lift_body') }}</mdb-modal-body>
      <mdb-modal-footer>
        <mdb-btn color="info" v-on:click="deletemold()">{{ $t('broadcast_lift') }}</mdb-btn>
        <mdb-btn color="0000" @click.native="warning = false">{{ $t('close') }}</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
  </b-container>
</template>

<script>
import { mapState } from 'vuex'
import { NotificationrecordAPI } from '@/plugins/dashboardapis.js'
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
    var DCobject = {
      Id: 0,
      dcAuthorization: 'Basic cm9vdDptaXRyb290',
      putTimeInterval: 10800,
      idleTime: 300,
      macAddress: '',
      createTime: 0,
      workShop: ''
    }
    var DCobjectnull = JSON.parse(JSON.stringify(DCobject))
    var errorobject = {
      id: 0,
      name: '', //名稱
      mode: 0, //模式
      machineId: 0, //設備id
      occurTime: 0, //發生時間
      finishTime: 0, //解除時間
      isFinish: true, //已解除
      accountId: 0, //??
      operator: 0, //??
      receiver: 0, //??
      settingValue: 0 //??
    }
    var errorobjectnull = JSON.parse(JSON.stringify(errorobject))

    return {
      page_first: 0, //第一條
      page_last: 0, //最後一筆
      page_total: 0, //總共筆數
      isbusy: true,
      liftobject: 0, //解除object
      tabvalue: 0, //Tab值
      alldata: {}, //全部資料
      tabflag: 1, //tabflag
      errorobject,
      errorobjectnull,
      realtime_total: 0, //即時總數
      overtime_total: 0, //逾時總數
      history_total: 0, // 歷史總數
      newbtm: false, //新增
      editbtm: false, //編輯
      deletebtm: false, //刪除
      customize1: false, //自定義一
      customize2: false, //自定義二
      customize3: false, //自定義三
      DCoption: [],
      machineoption: [],
      deletebundisable: true,
      selected: [],
      DCobject,
      DCobjectnull,
      operate: '',
      warning: false,
      modal: false,
      tabledata: [],
      fields: [],
      fields12: [
        {
          key: 'name',
          label: this.$t('broadcast_name'), //推播名稱
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'monitorName', //'monitorRecognition',
          label: this.$t('broadcast_monitor_item'), //監控目標
          // sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
            // if (value == 1) {
            //   return this.$t('workshop') //'廠區'
            // } else if (value == 2) {
            //   return this.$t('machine') //'設備'
            // }
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'mode',
          label: this.$t('broadcast_data_type'), //數據類型
          // sortable: true,
          class: 'text-center',
          formatter: (value, index, index1) => {
            var tempstring = ''
            tempstring +=
              this.modetype(index1.mode) +
              ' ' +
              this.operatortype(index1.operator) +
              ' ' +
              this.dealsettingvalue(index1.settingValue, index1.mode) +
              ' ' +
              this.modeunit(index1.mode)
            return tempstring
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'occurTime',
          label: this.$t('occurTime'), //發生時間
          // sortable: true,
          class: 'text-center',
          formatter: value => {
            return this.timeStamp2String(value)
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'duration',
          label: this.$t('continuedTime'), //持續時間
          // sortable: true,
          class: 'text-center',
          formatter: value => {
            return this.timestampdatetime(value / 1000)
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'actions',
          label: this.$t('operating'),
          thStyle: 'width:83px',
          class: 'text-center',
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        }
      ],
      fields3: [
        {
          key: 'name',
          label: this.$t('broadcast_name'), //推播名稱
          // sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'monitorName', //'monitorRecognition',
          label: this.$t('broadcast_monitor_item'), //監控目標
          // sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
            // if (value == 1) {
            //   return this.$t('workshop') //'廠區'
            // } else if (value == 2) {
            //   return this.$t('machine') //'設備'
            // }
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'mode',
          label: this.$t('broadcast_data_type'), //數據類型
          // sortable: true,
          class: 'text-center',
          formatter: (value, index, index1) => {
            var tempstring = ''
            tempstring +=
              this.modetype(index1.mode) +
              ' ' +
              this.operatortype(index1.operator) +
              ' ' +
              this.dealsettingvalue(index1.settingValue, index1.mode) +
              ' ' +
              this.modeunit(index1.mode)
            return tempstring
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },

        {
          key: 'occurTime',
          label: this.$t('occurTime'), //發生時間
          // sortable: true,
          class: 'text-center',
          formatter: value => {
            return this.timeStamp2String(value)
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'duration',
          label: this.$t('continuedTime'), //持續時間
          // sortable: true,
          class: 'text-center',
          formatter: value => {
            return this.timestampdatetime(value / 1000)
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'finishTime',
          label: this.$t('finishTime'), //解除時間
          // sortable: true,
          class: 'text-center',
          formatter: value => {
            // return value
            return this.timeStamp2String(value)
          },
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
    this.getdata()
  },
  methods: {
    //設定權限
    iniright() {
      this.authority.forEach(item => {
        if (item.name == 'basicsetting_device_dc') {
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
    //處理settingvalue
    dealsettingvalue(value, mode) {
      if (mode >= 5) {
        return Math.floor(value / 60000)
      } else {
        return value
      }
    },
    //單位
    modeunit(value) {
      if (value >= 5) {
        return 'min'
      } else {
        return '%'
      }
    },
    //模式
    modetype(value) {
      var tempvalue = ''
      switch (value) {
        case 1:
          tempvalue = 'U'
          break
        case 2:
          tempvalue = 'A'
          break
        case 3:
          tempvalue = 'P'
          break
        case 4:
          tempvalue = 'S'
          break
        case 5:
          tempvalue = this.$t('title_idle')
          break
        case 6:
          tempvalue = this.$t('title_error')
          break
        case 7:
          tempvalue = this.$t('title_shutdown')
          break
      }
      return tempvalue
    },
    //大於小於
    operatortype(value) {
      if (value == 1) {
        return this.$t('less_than')
      } else {
        return this.$t('more_than')
      }
    },
    //modal背景點擊不關閉
    closemodal(value) {
      if (value == undefined) {
        this.modal = false
      }
    },

    //取得推播列表
    getdata() {
      var access_token_val = this.$cookies.get('access_token')
      NotificationrecordAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          this.realtime_total = 0
          this.overtime_total = 0
          this.history_total = 0
          if (res.data.immediateRecords != null) {
            this.realtime_total = this.dealThousands('-', res.data.immediateRecords.length) //即時總數
          } else {
            res.data.immediateRecords = []
          }
          if (res.data.overTimeRecords != null) {
            this.overtime_total = this.dealThousands('-', res.data.overTimeRecords.length) //逾時總數
          } else {
            res.data.overTimeRecords = []
          }
          if (res.data.allRecords != null) {
            this.history_total = this.dealThousands('-', res.data.allRecords.length) // 歷史總數
          } else {
            res.data.allRecords = []
          }

          this.alldata = res.data
          if (this.tabvalue == 0) {
            this.tabvalue = 1
          }
          this.tabclickfunc(this.tabvalue)
        },
        error => {
          this.isbusy = false
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
          this.modal = false
        }
      )
    },
    //點選Tab解除
    tabclickfunc(value) {
      this.tabvalue = value //暫存頁籤
      let temparray = []
      //即時
      if (value == 1) {
        this.fields = this.fields12
        temparray = this.alldata.immediateRecords
      } else if (value == 2) {
        //逾時
        this.fields = this.fields12
        temparray = this.alldata.overTimeRecords
      } else {
        //歷史
        this.fields = this.fields3
        temparray = this.alldata.allRecords
      }

      this.tabledata = temparray
      this.totalRows = temparray.length
      this.setfooternum() //設定頁數
      this.isbusy = false
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

    relieveerror(item) {
      this.warning = true
      this.liftobject = item
    },
    resetInfoModal() {
      this.infoModal.title = ''
      this.infoModal.content = ''
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },

    timeStamp2String(time) {
      if (time === 0) {
        return '-'
      }
      return this.timeStampToStringFunc(time, 'yyyy-mm-dd hh:mm')
    },

    // 解除警報
    deletemold() {
      var tempobject = [
        {
          id: this.liftobject.id,
          machineId: this.liftobject.machineId,
          mode: this.liftobject.mode,
          name: this.liftobject.name,
          operator: this.liftobject.operator,
          receiver: this.liftobject.receiver,
          settingValue: this.liftobject.settingValue,
          timeRange: this.liftobject.timeRange,
          monitorType: this.liftobject.monitorType,
          monitor: this.liftobject.monitor
        }
      ]

      var access_token_val = this.$cookies.get('access_token')
      NotificationrecordAPI.put(JSON.stringify(tempobject), {
        headers: {
          access_token: access_token_val
        }
      }).then(
        () => {
          this.$layer.msg(this.$t('scuccess'))
          this.warning = false
          this.isbusy = true
          this.getdata()
        },
        error => {
          console.log(error.response)
          this.warning = false
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
.broadcastlistpctableclass {
  max-height: calc(100vh - 275px) !important;
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
