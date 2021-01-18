<template>
  <div style="padding-top: 0.2rem;">
    <!-- <div class="mx-3">
      <h2>{{ downloadingtext }}</h2>
    </div> -->
    <!-- <button @click="downloadExl(jsonoMultiplePage)">匯出</button> -->
    <!-- <div
      style="position: fixed;background:white;width:83%;top:130px; "
    > -->
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
              this.$t('manufacturingorder_customize_number') +
              '、' +
              this.$t('product_number') +
              '、' +
              this.$t('manufacturingorder_order') +
              '、' +
              this.$t('machine') +
              '、' +
              this.$t('remark')
          "
        >
          <span class="input-group-text" slot="prepend">{{ $t('search') }}</span>

          <!-- <mdb-btn size="sm" color="primary" :disabled="!filter" @click="filter = ''">清除</mdb-btn> -->
        </mdb-input>
      </b-col>

      <b-col lg="4"> </b-col>
    </b-row>
    <!-- 新增 -->
    <!-- <mdb-btn
      size="sm"
      color="primary"
      v-on:click="manufacturingorderwindow([], [], 'new')"
      icon="plus"
      style="padding:0.5rem"
    ></mdb-btn>-->
    <b-row>
      <b-col>
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
        <!-- 全選 -->
        <b-button size="sm" @click="selectAllRows()">
          {{ $t('to_schedule_selectall_btm') }}
        </b-button>
        <!-- 匯出 -->
        <mdb-btn
          :disabled="btndisable"
          size="sm"
          color="cyan"
          @click="exportfile()"
          icon="file-export"
          style="padding:0.5rem"
        ></mdb-btn>
      </b-col>
    </b-row>
    <!-- </div>
    <div style="z-index:1000;background:white;height:80px"></div> -->
    <b-table
      class="manufacturingorderpctableclass"
      no-border-collapse
      sticky-header="590px"
      id="pc"
      ref="selectableTable"
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
      <template v-slot:table-busy>
        <div class="text-center my-3">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>
      <template v-slot:cell(numberserial)="row" class="col-sm-3">{{ row.index }}</template>
      <!-- <template v-slot:cell(name)="row">{{ row.value }}</template> -->
      <!-- <template v-slot:cell(checkbox)="row">
        <b-form-checkbox></b-form-checkbox>
      </template>-->

      <template v-slot:cell(actions)="row">
        <!-- <b-button
          size="sm"
          @click="manufacturingorderwindow(row.item, row.index, 'edit')"
          >編輯</b-button
        >-->
        <!-- 編輯 -->
        <!-- <mdb-btn
          :disabled="true"
          color="mdb-color"
          @click="manufacturingorderwindow(row.item, row.index, 'edit')"
          type="button"
          style="padding:0.4rem"
          icon="pencil-alt"
        ></mdb-btn>-->
        <!-- test1 -->
        <!-- 刪除 -->
        <mdb-btn
          v-if="deletebtmfunc"
          :disabled="selected ? selected != 0 : false"
          color="danger"
          @click.native="
            warning = true
            deletemode = 0
            deleteitem = row.item.id
          "
          type="button"
          style="padding:0.1rem"
          icon="trash-alt"
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
      <!-- <template v-slot:cell(checkbox)="row">
        <b-form-checkbox></b-form-checkbox>
      </template>-->

      <!-- <template v-slot:cell(actions)="row">
        <b-button
          :disabled="true"
          size="sm"
          @click="manufacturingorderwindow(row.item, row.index, 'edit')"
          >編輯</b-button
        >
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
  </div>
</template>

<script>
// import url from '@/router/index.js' //取得router裡SRV url
import { WorkShopAPI } from '@/plugins/basicapis.js'
import { mapState } from 'vuex'
// import datePicker from 'vue-bootstrap-datetimepicker'
// import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css'
// import 'bootstrap/dist/css/bootstrap.css'
import { SystemSettingAPI } from '@/plugins/basicapis.js'
import {
  ManufacturingorderAPI,
  ExportManufacturingorder,
  manufactureorderReportDonloadExcelAPI,
  ManufacturingordermultideleteAPI
} from '@/plugins/produceapis.js'
import XLSX from 'xlsx'
export default {
  props: ['manufacturingorderData', 'tabs', 'isbusyflag', 'workShopId', 'scearchTime'],
  watch: {
    workShopId: function(value) {
      this.workShopIdvalue = value
    },
    scearchTime: function(value) {
      this.scearchTimevalue = value
    },
    exportexcelflag: function(value) {
      //關閉匯出視窗，匯出flag回復初始化
      if (!value) {
        this.exportscuccess = false
        this.startexport = false
      }
    },
    tabs: function(value) {
      if (value == 'finish') {
        this.timesearch = true
        this.inidate()
      } else {
        this.timesearch = false
      }
      this.tabvalue = value
      this.classification(this.alldata, this.tabvalue)
    },
    manufacturingorderData: function(newVal) {
      var temparray = JSON.parse(JSON.stringify(newVal))
      this.alldata = temparray
      this.classification(this.alldata, this.tabvalue)
    },
    isbusyflag: function(newVal) {
      this.isbusy = newVal
    },
    currentPage: function() {
      this.setfooternum() //設定頁數
    },
    perPage: function() {
      this.setfooternum() //設定頁數
    }
  },
  components: {},
  data() {
    var moldobject = {
      Id: 0,
      name: '',
      number: '',
      cavityNumber: 0
    }
    var moldobjectarray = []
    var manufacturingorderobject = {
      Id: 0, //製令id
      number: '', //製令編號
      count: 0, //數量
      expectedTIme: 0, //預期時間完成
      actualTime: 0, //實際完成
      orderId: 0, //訂單
      orderNumber: '', //訂單編號
      orderSubId: 0, //訂單子項目
      status: 2, //狀態
      productId: null, //製品id
      priority: 0, //優先度(大優先)
      deadLine: 0 //完工期限
    }
    var manufacturingorderobjectnull = JSON.parse(JSON.stringify(manufacturingorderobject))

    return {
      btndisable: false, //停用按鈕
      scearchTimevalue: 1, //時間範圍
      workShopIdvalue: -1, //廠區id
      page_first: 0, //第一條
      page_last: 0, //最後一筆
      page_total: 0, //總共筆數
      timesearch: false,
      options: {
        format: 'YYYY/MM/DD',
        useCurrent: false
      },
      exportscuccess: false, //匯出成功
      startexport: false, //開始匯出
      exportexcelflag: false, //確認匯出
      inistartdate: new Date(),
      inienddate: new Date(),
      inputstarttime: new Date(),
      inputendtime: new Date(),
      downloading: false, //匯出視窗
      downloadingtext: '', //匯出文字
      outputtype: 1, //匯出型態(1分頁籤2合併)
      exportbtm: false, //匯出按鈕
      isbusy: true,
      newbtm: false, //新增
      editbtm: false, //編輯
      deletebtm: false, //刪除
      customize1: false, //自定義一
      customize2: false, //自定義二
      customize3: false, //自定義三
      taskorfinish: true,
      deleteitem: 0,
      deletemode: 0,
      scearchworkshop: 0,
      workshopobject: [],
      workshopobject1: [], //搜尋
      selectmoldid: null,
      cavityNumbervalue: null,
      deletebundisable: true,
      moldobject,
      moldobjectarray,
      selected: [],
      moldselected: [],
      manufacturingorderobject,
      manufacturingorderobjectnull,
      operate: '',
      warning: false,
      tabledata: [],
      fields: [
        // {
        //   key: "numberserial",
        //   label: "序號",
        //   class: "moldnumberclass"
        // },
        {
          key: 'number',
          label: this.$t('manufacturingorder_number'), //製令編號
          sortDirection: 'desc',
          class: 'text-center',
          sortable: true,
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'customizeNumber',
          label: this.$t('manufacturingorder_customize_number'), //自定義製令編號
          sortable: true,
          sortDirection: 'desc',
          class: 'text-center',
          thClass: 'thstyle',
          tdClass: 'tdstyle',
          formatter: value => {
            if (value == '') {
              return '-'
            }
            return value
          }
        },
        {
          key: 'productNumber',
          label: this.$t('product_number'), //製品編號
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
          label: this.$t('number'), //數量
          sortable: true,
          class: 'text-center',
          formatter: value => {
            if (value == 0) {
              return '-'
            }
            var c =
              value.toString().indexOf('.') !== -1
                ? value.toLocaleString()
                : value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
            return c
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
            return this.dealThousands('-', value)
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'postProductCount',
          label: this.$t('storage_number'), //'入庫量',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return this.dealThousands('-', value)
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        // {
        //   key: 'priority',
        //   label: '優先度',
        //   sortable: true,
        //   class: 'text-center',
        //   formatter: value => {
        //     switch (value) {
        //       case 0:
        //         value = '低'
        //         break
        //       case 1:
        //         value = '中'
        //         break
        //       case 2:
        //         value = '高'
        //         break
        //     }
        //     return value
        //   }
        // },
        {
          key: 'deadLine',
          label: this.$t('manufacturingorder_deadline'), //完工期限
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'orderNumber',
          label: this.$t('manufacturingorder_order'), //訂單編號
          sortable: true,
          class: 'text-center',
          thClass: 'thstyle',
          tdClass: 'tdstyle',
          formatter: value => {
            if (value == '') {
              return '-'
            }
            return value
          }
        },
        {
          key: 'workShopId',
          label: this.$t('workshop_machine'), //廠區
          class: 'text-center',
          sortable: true,
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
          key: 'machineNumber',
          label: this.$t('to_schedule_machine'), //設備
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'createdTimeshow',
          label: this.$t('created_time'), //創建時間
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
        } //操作
      ],
      toschedulefields: [
        // {
        //   key: "selected1",
        //   label: "選擇",
        //   class: "text-center"
        // },
        {
          key: 'moldName',
          label: this.$t('to_schedule_mold'), //模具
          class: 'text-center',
          formatter: value => {
            return value
          }
        },
        {
          key: 'qty',
          label: this.$t('to_schedule_qty'), //模次
          class: 'text-center',
          formatter: value => {
            return value
          }
        },
        {
          key: 'materialName',
          label: this.$t('to_schedule_material'), //原料
          class: 'text-center',
          formatter: value => {
            return value
          }
        },
        { key: 'remark', label: this.$t('remark'), class: 'text-center' }, //備註
        { key: 'actions', label: this.$t('operating'), class: 'text-center' } //操作
      ],
      totalRows: 0,
      currentPage: 1,
      currentPage1: 1,
      perPage: 100,
      pageOptions: [20, 50, 100],
      sortBy: 'createdTimeshow',
      sortDesc: true,
      filter: null,
      filterOn: [
        'number',
        'customizeNumber',
        'productNumber',
        'orderNumber',
        'remark',
        'deadLine',
        'machineNumber'
      ],
      infoModal: {
        id: 'info-modal',
        title: '',
        content: ''
      },
      invoce_data: {},
      wopts: { bookType: 'xlsx', bookSST: true, type: 'binary', cellStyles: true },
      jsonoSinglePage: {
        A1: { v: '製令編號' },
        B1: { v: '製品名稱' },
        C1: { v: '製品編號' },
        D1: { v: '設備廠區' },
        E1: { v: '設備編號' },
        F1: { v: '製品原料' },
        G1: { v: '模具編號' },
        H1: { v: '模穴數' },
        I1: { v: '模穴號' },
        J1: { v: '計畫週期時間' },
        K1: { v: '計畫生產數量' },
        L1: { v: '實際生產數量' },
        M1: { v: '任務開始時間' },
        N1: { v: '任務結束時間' },
        O1: { v: '模次' },
        P1: { v: '設備狀態' },
        Q1: { v: '週期' },
        R1: { v: '週期開始時間' },
        S1: { v: '週期結束時間' }
      },
      jsonoMultiplePage: {
        A1: { v: '1' },
        B1: { v: '製令單號' },
        C1: { v: '' },
        D1: { v: '' },
        E1: { v: '' },
        F1: { v: '' },
        A2: { v: '2' },
        B2: { v: '製品名稱' },
        C2: { v: '' },
        D2: { v: '' },
        E2: { v: '' },
        F2: { v: '' },
        A3: { v: '3' },
        B3: { v: '製品編號' },
        C3: { v: '' },
        D3: { v: '' },
        E3: { v: '' },
        F3: { v: '' },
        A4: { v: '4' },
        B4: { v: '設備廠區' },
        C4: { v: '' },
        D4: { v: '' },
        E4: { v: '' },
        F4: { v: '' },
        A5: { v: '5' },
        B5: { v: '設備編號' },
        C5: { v: '' },
        D5: { v: '' },
        E5: { v: '' },
        F5: { v: '' },
        A6: { v: '6' },
        B6: { v: '製品原料' },
        C6: { v: '' },
        D6: { v: '' },
        E6: { v: '' },
        F6: { v: '' },
        A7: { v: '7' },
        B7: { v: '模具編號' },
        C7: { v: '' },
        D7: { v: '' },
        E7: { v: '' },
        F7: { v: '' },
        A8: { v: '8' },
        B8: { v: '模穴數' },
        C8: { v: '' },
        D8: { v: '' },
        E8: { v: '' },
        F8: { v: '' },
        A9: { v: '9' },
        B9: { v: '模穴號' },
        C9: { v: '' },
        D9: { v: '' },
        E9: { v: '' },
        F9: { v: '' },
        A10: { v: '10' },
        B10: { v: '計畫週期時間' },
        C10: { v: '' },
        D10: { v: '' },
        E10: { v: '' },
        F10: { v: '' },
        A11: { v: '11' },
        B11: { v: '計畫生產數量' },
        C11: { v: '' },
        D11: { v: '' },
        E11: { v: '' },
        F11: { v: '' },
        A12: { v: '12' },
        B12: { v: '實際生產數量' },
        C12: { v: '' },
        D12: { v: '' },
        E12: { v: '' },
        F12: { v: '' },
        A13: { v: '13' },
        B13: { v: '任務開始時間' },
        C13: { v: '' },
        D13: { v: '' },
        E13: { v: '' },
        F13: { v: '' },
        A14: { v: '14' },
        B14: { v: '任務結束時間' },
        C14: { v: '' },
        D14: { v: '' },
        E14: { v: '' },
        F14: { v: '' },
        A15: { v: '15' },
        B15: { v: '輸出檔案時間' },
        C15: { v: '' },
        D15: { v: '' },
        E15: { v: '' },
        F15: { v: '' },
        A16: { v: '16' },
        B16: { v: '系統版本' },
        C16: { v: '' },
        D16: { v: '' },
        E16: { v: '' },
        F16: { v: '' },
        A17: { v: '' },
        B17: { v: '' },
        C17: { v: '' },
        D17: { v: '' },
        E17: { v: '' },
        F17: { v: '' },
        A18: { v: '編號' },
        B18: { v: '模次' },
        C18: { v: '設備狀態' },
        D18: { v: '週期' },
        E18: { v: '週期開始時間' },
        F18: { v: '週期結束時間' }
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
    this.getworkshop()
    this.getsysini()
    this.inistartdate.setDate(new Date().getDate())
    this.inienddate.setDate(new Date().getDate() - 180)
  },
  methods: {
    //初始化時間
    inidate() {
      this.inputendtime = this.inistartdate
      this.inputstarttime = this.inienddate
    },

    searchtime() {
      //    this.tabledata = temparray
      // this.totalRows = temparray.length
      var temparray = []
      var strtime = this.stringToTimestampFunc(this.inputstarttime)
      var endtime = this.stringToTimestampFunc(this.inputendtime)
      if (this.tabledata != null) {
        this.tabledata.forEach(item => {
          if (item.timestamp >= strtime && item.timestamp <= endtime) temparray.push(item)
        })
      }
      this.tabledata = temparray
    },
    //取得匯出模式
    getsysini() {
      var access_token_val = this.$cookies.get('access_token')
      SystemSettingAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          if (res.data != null) {
            res.data.forEach(item => {
              if (item.parameter == 'output_manufacturingorder_type') {
                this.outputtype = item.value
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
    //匯出
    exportfile() {
      //workShopId//廠區id
      //status//狀態 1已排程，2未排程  3已完成 4任務中 5已完成(中止) 6其他 7暫停
      //timeRange//時間範圍
      //condition//篩選條件
      let tempfilter = ''

      if (this.filter != null) {
        tempfilter = this.filter
      }
      this.btndisable = true
      manufactureorderReportDonloadExcelAPI({
        headers: {
          workShopId: this.workShopIdvalue, //廠區id
          status: 4, //狀態
          timeRange: this.scearchTimevalue, //時間範圍
          keyWord: encodeURIComponent(tempfilter) //篩選條件
        },
        responseType: 'blob' //設定格式為blob
      }).then(
        res => {
          const url = URL.createObjectURL(
            new Blob([res.data], {
              type: 'application/vnd.ms-excel'
            })
          )
          const link = document.createElement('a')

          let filename = res.headers['content-disposition'].split('filename=')[1]

          link.href = url
          link.download = filename
          document.body.appendChild(link)
          link.click()
          this.btndisable = false
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('report_error'))
          this.btndisable = false
        }
      )
    },
    //根據id取ct
    getexceldata(idss) {
      var access_token_val = this.$cookies.get('access_token')
      ExportManufacturingorder({
        headers: {
          access_token: access_token_val,
          ids: idss
        }
      }).then(
        res => {
          if (res.data != null) {
            if (this.outputtype == 1) {
              //分頁
              this.dealexportdataMultiple(res.data)
            } else if (this.outputtype == 2) {
              //合併一頁
              this.dealexportdataSingle(res.data)
            }
          }
        },
        error => {
          this.exportexcelflag = false
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
          this.addRowflag = false
        }
      )
    },
    //合併一頁處理資料
    dealexportdataSingle(data) {
      var tempdataobject = JSON.parse(JSON.stringify(this.jsonoSinglePage))
      var index = 2
      data.forEach((item, index1) => {
        console.log(index1)
        var totalrunstatus = 0
        if (item.statusData != null) {
          //總計模次總數
          item.statusData.forEach(ctitem => {
            if (ctitem.status == 5) {
              totalrunstatus += 1
            }
          })
        }
        var orderNumber = this.dealname(item.orderNumber, item.customizeNumber) //製令單號
        var productName = item.productName //製品名稱
        var productNumber = item.productNumber //製品編號
        var workShopName = item.workShopName //設備廠區
        var machineNumber = item.machineNumber //設備編號
        var productMaterialNumber = item.productMaterialNumber //製品原料
        var moldNumber = item.moldNumber //模具編號
        var moldCavityNumbers = this.dealThousands('-', this.countcavitynum(item.moldCavityNumbers)) //模穴數
        var moldCavityNames = this.cavityname(item.moldCavityNumbers) //模穴名稱
        var planCycleTime = this.dealThousands('-', item.planCycleTime) //計畫週期時間
        var planmolds = this.dealThousands('-', item.count) //計畫生產數量
        var moldsnumtotal = this.dealThousands('-', totalrunstatus) //實際生產總數量
        var moldsnum = 0 //實際生產數量
        var taskStartTime = this.timeStampToStringFunc(item.taskStartTime, 'yyyy-mm-dd hh:mm') //任務開始時間
        var taskEndTime = this.timeStampToStringFunc(item.taskEndTime, 'yyyy-mm-dd hh:mm') //任務結束時間
        if (item.statusData != null) {
          var molds = '-'
          var status = '-'
          var cytime = '-'
          var starttime = '-'
          var endtime = '-'
          item.statusData.forEach(ctitem => {
            switch (ctitem.status) {
              case 2: //停機
                molds = '-'
                status = '停機'
                cytime = ctitem.Period
                starttime = this.timeStampToStringFunc(ctitem.startTime, 'yyyy-mm-dd hh:mm:ss')
                endtime = this.timeStampToStringFunc(ctitem.endTime, 'yyyy-mm-dd hh:mm:ss')
                break
              case 3: //閒置
                molds = '-'
                status = '閒置'
                cytime = ctitem.Period
                starttime = this.timeStampToStringFunc(ctitem.startTime, 'yyyy-mm-dd hh:mm:ss')
                endtime = this.timeStampToStringFunc(ctitem.endTime, 'yyyy-mm-dd hh:mm:ss')
                break
              case 4: //異常
                molds = '-'
                status = '異常'
                cytime = ctitem.Period
                starttime = this.timeStampToStringFunc(ctitem.startTime, 'yyyy-mm-dd hh:mm:ss')
                endtime = this.timeStampToStringFunc(ctitem.endTime, 'yyyy-mm-dd hh:mm:ss')
                break
              case 5: //運行
                moldsnum++
                molds = moldsnum
                status = '運行'
                cytime = ctitem.Period
                starttime = this.timeStampToStringFunc(ctitem.startTime, 'yyyy-mm-dd hh:mm:ss')
                endtime = this.timeStampToStringFunc(ctitem.endTime, 'yyyy-mm-dd hh:mm:ss')
                break
            }
            tempdataobject['A' + index] = { v: orderNumber }
            tempdataobject['B' + index] = { v: productName }
            tempdataobject['C' + index] = { v: productNumber }
            tempdataobject['D' + index] = { v: workShopName }
            tempdataobject['E' + index] = { v: machineNumber }
            tempdataobject['F' + index] = { v: productMaterialNumber }
            tempdataobject['G' + index] = { v: moldNumber }
            tempdataobject['H' + index] = { v: moldCavityNumbers }
            tempdataobject['I' + index] = { v: moldCavityNames }
            tempdataobject['J' + index] = { v: planCycleTime }
            tempdataobject['K' + index] = { v: planmolds }
            tempdataobject['L' + index] = { v: moldsnumtotal }
            tempdataobject['M' + index] = { v: taskStartTime }
            tempdataobject['N' + index] = { v: taskEndTime }
            tempdataobject['O' + index] = { v: molds }
            tempdataobject['P' + index] = { v: status }
            tempdataobject['Q' + index] = { v: cytime }
            tempdataobject['R' + index] = { v: starttime }
            tempdataobject['S' + index] = { v: endtime }
            index++
          })
        }
      })

      var temparray = []
      var sheetname = [] //頁籤名稱
      temparray = tempdataobject
      var systime = Math.floor(new Date())
      this.timeStampToStringFunc(systime, 'yyyy-mm-dd hh:mm') //檔案輸出時間

      // var fileNametemp =
      //   'IoM_ManufacturerOrder_Export_' + this.timeStampToStringFunc(systime, 'yyyymmdd')
      // console.log(this.timeStampToStringFunc(systime, 'yyyymmddhhmm'))
      var fileNametemp = this.timeStampToStringFunc(systime, 'yyyymmddhhmm')
      // 'IoM_ManufacturerOrder_Export_' + this.timeStampToStringFunc(systime, 'yyyymmdd')

      sheetname.push(fileNametemp)

      this.downloadExl1(temparray, '', sheetname)
    },
    //分頁處理資料
    dealexportdataMultiple(data) {
      var tempdataobject = JSON.parse(JSON.stringify(this.jsonoMultiplePage))
      var temparray = []
      var sheetname = [] //頁籤名稱
      var systime = Math.floor(new Date())
      data.forEach(item => {
        tempdataobject = JSON.parse(JSON.stringify(this.jsonoMultiplePage))
        var moldsnum = 0
        if (item.statusData != null) {
          var molds = '-'
          var status = '-'
          var cytime = '-'
          var starttime = '-'
          var endtime = '-'
          var xslindex = 19
          item.statusData.forEach((statusitem, index) => {
            switch (statusitem.status) {
              case 2: //停機
                molds = '-'
                status = '停機'
                cytime = statusitem.Period
                starttime = this.timeStampToStringFunc(statusitem.startTime, 'yyyy-mm-dd hh:mm:ss')
                endtime = this.timeStampToStringFunc(statusitem.endTime, 'yyyy-mm-dd hh:mm:ss')
                break
              case 3: //閒置
                molds = '-'
                status = '閒置'
                cytime = statusitem.Period
                starttime = this.timeStampToStringFunc(statusitem.startTime, 'yyyy-mm-dd hh:mm:ss')
                endtime = this.timeStampToStringFunc(statusitem.endTime, 'yyyy-mm-dd hh:mm:ss')
                break
              case 4: //異常
                molds = '-'
                status = '異常'
                cytime = statusitem.Period
                starttime = this.timeStampToStringFunc(statusitem.startTime, 'yyyy-mm-dd hh:mm:ss')
                endtime = this.timeStampToStringFunc(statusitem.endTime, 'yyyy-mm-dd hh:mm:ss')
                break
              case 5: //運行
                moldsnum++
                molds = moldsnum
                status = '運行'
                cytime = statusitem.Period
                starttime = this.timeStampToStringFunc(statusitem.startTime, 'yyyy-mm-dd hh:mm:ss')
                endtime = this.timeStampToStringFunc(statusitem.endTime, 'yyyy-mm-dd hh:mm:ss')
                break
            }
            tempdataobject['A' + xslindex] = { v: index + 1 }
            tempdataobject['B' + xslindex] = { v: molds }
            tempdataobject['C' + xslindex] = { v: status }
            tempdataobject['D' + xslindex] = { v: cytime }
            tempdataobject['E' + xslindex] = { v: starttime }
            tempdataobject['F' + xslindex] = { v: endtime }
            xslindex++
          })
        }
        tempdataobject['C1'] = { v: this.dealname(item.orderNumber, item.customizeNumber) } //製令編號(系統_自定義)
        tempdataobject['C2'] = { v: item.productName } //製品名稱
        tempdataobject['C3'] = { v: item.productNumber } //製品編號
        tempdataobject['C4'] = { v: item.workShopName } //設備廠區
        tempdataobject['C5'] = { v: item.machineNumber } //設備編號
        tempdataobject['C6'] = { v: item.productMaterialNumber } //原料名稱
        tempdataobject['C7'] = { v: item.moldNumber } //模具編號
        tempdataobject['C8'] = {
          v: this.dealThousands('-', this.countcavitynum(item.moldCavityNumbers))
        } //模穴數
        tempdataobject['C9'] = { v: this.cavityname(item.moldCavityNumbers) } //模穴名稱
        tempdataobject['C10'] = { v: this.dealThousands('-', item.planCycleTime) } //計畫週期時間
        tempdataobject['C11'] = { v: this.dealThousands('-', item.count) } //計畫生產數量
        tempdataobject['C12'] = { v: this.dealThousands('-', moldsnum) } //實際生產數量
        tempdataobject['C13'] = {
          v: this.timeStampToStringFunc(item.taskStartTime, 'yyyy-mm-dd hh:mm')
        } //任務開始時間
        tempdataobject['C14'] = {
          v: this.timeStampToStringFunc(item.taskEndTime, 'yyyy-mm-dd hh:mm')
        } //任務結束時間
        tempdataobject['C15'] = { v: this.timeStampToStringFunc(systime, 'yyyy-mm-dd hh:mm') } //檔案輸出時間
        tempdataobject['C16'] = { v: 'IoM R5.0.12' } //系統版本
        temparray.push(tempdataobject)
        sheetname.push(item.orderNumber)
      })
      console.log('deal data')
      this.downloadExl(temparray, '', sheetname)
    },
    //系統編號+自定義編號
    dealname(sysname, cosname) {
      if (cosname == '') {
        return sysname
      } else {
        return sysname + '_' + cosname
      }
    },

    //計算模穴數
    countcavitynum(data) {
      if (data != null) {
        return data.length
      } else {
        return 0
      }
    },
    //模穴名稱
    cavityname(data) {
      if (data != null) {
        var tempstring = ''
        data.forEach(item => {
          tempstring += '#' + item + ', '
        })
        tempstring = tempstring.slice(0, -2) //去除結尾逗點
        return tempstring
      } else {
        return ''
      }
    },
    saveAs(obj, fileName) {
      var systime = Math.floor(new Date())
      this.timeStampToStringFunc(systime, 'yyyy-mm-dd hh:mm') //檔案輸出時間

      fileName =
        'IoM_ManufacturerOrder_Export_' + this.timeStampToStringFunc(systime, 'yyyymmdd') + '.xlsx' //檔案輸出時間
      var tmpa = document.createElement('a')
      tmpa.download = fileName || '下载'
      tmpa.href = URL.createObjectURL(obj)
      tmpa.click()
      setTimeout(function() {
        URL.revokeObjectURL(obj)
      }, 100)
    },
    //合併轉excel
    downloadExl1(json, type, sheetarray) {
      console.log('downloadExl1!!!!!')
      type = undefined
      var tmpdataarray = []
      var tmpdata = json //用来保存转换好的json
      tmpdataarray.push(tmpdata)
      var tmpWB = {
        SheetNames: sheetarray //各頁籤名稱
      }
      tmpWB.Sheets = {}
      sheetarray.forEach((item, index) => {
        var outputPos = Object.keys(tmpdataarray[index]) //設置區域

        tmpdataarray[index]['!cols'] = [
          //欄寬
          { wpx: 150 }, //1
          { wpx: 150 }, //2
          { wpx: 150 }, //3
          { wpx: 100 }, //4
          { wpx: 50 }, //5
          { wpx: 150 }, //6
          { wpx: 150 }, //7
          { wpx: 50 }, //8
          { wpx: 50 }, //9
          { wpx: 50 }, //10
          { wpx: 50 }, //11
          { wpx: 50 }, //12
          { wpx: 100 }, //13
          { wpx: 100 }, //14
          { wpx: 50 }, //15
          { wpx: 50 }, //16
          { wpx: 50 }, //17
          { wpx: 120 }, //18
          { wpx: 120 } //19
        ]
        tmpWB.Sheets[item] = Object.assign(
          {},
          tmpdataarray[index], //内容
          {
            '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] //设置填充区域
          }
        )
      })
      //xlsx匯出
      // console.log(tmpWB.Sheets)

      // console.log('匯出!!!!!!!')

      // console.log('1111111111111')
      var temp1 = XLSX.write(
        tmpWB,
        // { bookType: type == undefined ? 'xlsx' : type, bookSST: false, type: 'binary' } //这里的数据是用来定义导出的格式类型
        { bookType: 'xlsx', bookSST: false, type: 'binary' } //这里的数据是用来定义导出的格式类型
      )

      // console.log('2222222222')
      var temp2 = this.s2ab(temp1)

      // console.log('temp2')
      // console.log(temp2)
      // console.log('33333333333')
      var tmpDown = new Blob([temp2], {
        type: ''
      })

      // console.log('4444444')
      this.exportscuccess = !this.exportscuccess

      // console.log('555555555555')
      this.saveAs(
        tmpDown,
        this.invoce_data.project_name +
          '.' +
          (this.wopts.bookType == 'biff2' ? 'xls' : this.wopts.bookType)
      )

      // console.log('66666666666666666')
      // console.log('')
    },
    //分頁轉excel
    downloadExl(json, type, sheetarray) {
      type = undefined
      var tmpdataarray = []
      json.forEach(item => {
        var tmpdata = item //用来保存转换好的json
        tmpdataarray.push(tmpdata)
      })
      var tmpWB = {
        SheetNames: sheetarray //各頁籤名稱
      }
      tmpWB.Sheets = {}
      sheetarray.forEach((item, index) => {
        var outputPos = Object.keys(tmpdataarray[index]) //設置區域
        tmpdataarray[index]['!merges'] = [
          //表格合併
          {
            s: { c: 2, r: 0 }, //開始 A1
            e: { c: 9, r: 0 } //结束F1
          },
          {
            s: { c: 2, r: 1 },
            e: { c: 9, r: 1 }
          },
          {
            s: { c: 2, r: 2 },
            e: { c: 9, r: 2 }
          },
          {
            s: { c: 2, r: 3 },
            e: { c: 9, r: 3 }
          },
          {
            s: { c: 2, r: 4 },
            e: { c: 9, r: 4 }
          },
          {
            s: { c: 2, r: 5 },
            e: { c: 9, r: 5 }
          },
          {
            s: { c: 2, r: 6 },
            e: { c: 9, r: 6 }
          },
          {
            s: { c: 2, r: 7 },
            e: { c: 9, r: 7 }
          },
          {
            s: { c: 2, r: 8 },
            e: { c: 9, r: 8 }
          },
          {
            s: { c: 2, r: 9 },
            e: { c: 9, r: 9 }
          },
          {
            s: { c: 2, r: 10 },
            e: { c: 9, r: 10 }
          },
          {
            s: { c: 2, r: 11 },
            e: { c: 9, r: 11 }
          },
          {
            s: { c: 2, r: 12 },
            e: { c: 9, r: 12 }
          },
          {
            s: { c: 2, r: 13 },
            e: { c: 9, r: 13 }
          },
          {
            s: { c: 2, r: 14 },
            e: { c: 9, r: 14 }
          },
          {
            s: { c: 2, r: 15 },
            e: { c: 9, r: 15 }
          },
          {
            s: { c: 2, r: 16 },
            e: { c: 9, r: 16 }
          }
        ]
        tmpdataarray[index]['!cols'] = [
          //欄寬
          { wpx: 50 }, //1
          { wpx: 100 }, //2
          { wpx: 100 }, //3
          { wpx: 100 }, //4
          { wpx: 150 }, //5
          { wpx: 150 } //6
        ]
        tmpWB.Sheets[item] = Object.assign(
          {},
          tmpdataarray[index], //内容
          {
            '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] //设置填充区域
          }
        )
      })
      //xlsx匯出
      var tmpDown = new Blob(
        [
          this.s2ab(
            XLSX.write(
              tmpWB,
              { bookType: type == undefined ? 'xlsx' : type, bookSST: false, type: 'binary' } //这里的数据是用来定义导出的格式类型
            )
          )
        ],
        {
          type: ''
        }
      )

      this.saveAs(
        tmpDown,
        this.invoce_data.project_name +
          '.' +
          (this.wopts.bookType == 'biff2' ? 'xls' : this.wopts.bookType)
      )

      this.exportscuccess = !this.exportscuccess
    },
    //json轉excle原生
    getCharCol(n) {
      ;(s = ''), (m = 0)
      while (n > 0) {
        m = (n % 26) + 1
        s = String.fromCharCode(m + 64) + s
        n = (n - m) / 26
      }
      return s
    },
    //json轉excle原生
    s2ab(s) {
      if (typeof ArrayBuffer !== 'undefined') {
        var buf = new ArrayBuffer(s.length)
        var view = new Uint8Array(buf)
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
        return buf
      } else {
        var buf = new Array(s.length)
        for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xff
        return buf
      }
    },

    //設定權限
    iniright() {
      this.authority.forEach(item => {
        if (item.name == 'produce_manufacturingorder') {
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
    deletebtmfunc(mode, selected) {
      var selecttemp
      if (mode == 1) {
        selecttemp = selected ? selected == 0 : true
      } else {
        selecttemp = selected ? selected != 0 : true
      }

      selecttemp = selecttemp || this.taskorfinish
      console.log(selecttemp)
      return selecttemp
    },
    classification(alldata) {
      var temparray = []

      this.exportbtm = true
      this.taskorfinish = true
      if (alldata != null) {
        alldata.forEach(item => {
          temparray.push(item)
        })
      }

      this.tabledata = []
      if (temparray != null) {
        this.tabledata = temparray
        this.totalRows = temparray.length
      }
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
          this.workshopobject1 = []
          this.workshopobject1.push({
            text: this.$t('all'),
            value: 0
          })
          if (res.data != null) {
            res.data.forEach(item => {
              this.workshopobject.push({ text: item.name, value: item.id })
              this.workshopobject1.push({ text: item.name, value: item.id })
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
      // 重載資料
      this.isbusy = true
      this.$emit('callparent', 1) //呼叫父元件
    },

    //modal背景點擊不關閉
    closemodal(value) {
      if (value == undefined) {
        this.modal = false
        this.exportexcelflag = false
      }
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

    deletemold() {
      var access_token_val = this.$cookies.get('access_token')
      if (this.deletemode == 1) {
        ManufacturingordermultideleteAPI.delete({
          headers: {
            access_token: 'access_token_val',
            ids: this.selectedArrayToString(this.selected)
          }
        }).then(
          () => {
            this.$layer.msg(this.$t('scuccess'))
            this.modal = false
            // 重載資料
            this.isbusy = true
            this.$emit('callparent', 1) //呼叫父元件
          },
          error => {
            console.log(error.response)
            this.$layer.msg(this.$t('fail') + error.response.data.response)
            this.modal = false
          }
        )
      } else {
        ManufacturingorderAPI.delete({
          headers: {
            access_token: access_token_val,
            id: this.deleteitem
          }
        }).then(
          () => {
            // 重載資料
            this.isbusy = true
            this.$emit('callparent', 1) //呼叫父元件
            this.$layer.msg(this.$t('scuccess'))
            this.modal = false
          },
          error => {
            console.log(error.response)
            this.$layer.msg(this.$t('fail') + error.response.data.response)
            this.modal = false
          }
        )
      }
    },
    //製令複選
    onRowSelected(items) {
      this.selected = items
      this.deletebundisable = false
    },
    //模具複選
    moldonRowSelected(items) {
      this.moldselected = items
      this.deletebundisable = false
    },
    selectAllRows() {
      this.$refs.selectableTable.selectAllRows()
    },
    clearSelected() {
      this.$refs.selectableTable.clearSelected()
    }
  }
}
</script>
<style>
.manufacturingorderpctableclass {
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
/* .thstyle {
  font-size: 14px;
  font-weight: bold;
  height: 39px;
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  font-family: 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;
} */
.text-center.tdstyle {
  border: 1px solid #f4f4f4;
  font-size: 14px;
  font-weight: 400;
  height: 39px;
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  font-family: 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
/* .tdstyle {
  font-size: 14px;
  font-weight: 400;
  height: 39px;
  font-family: 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;
} */
.moldnumberclass {
  max-width: 30px;
  text-align: center;
}

#mobile {
  display: none;
}

table.table td {
  vertical-align: middle;
  padding-top: 0 !important;
  padding-bottom: 0rem !important;
}
.tab-content {
  padding-top: 0;
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
