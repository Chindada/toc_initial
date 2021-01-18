<template>
  <b-container fluid>
    <mdb-card>
      <mdb-card-body>
        <!-- <div class="mx-3">
          <h2>DS管理</h2>
        </div> -->

        <b-col lg="16" class="my-1">
          <mdb-input
            style="width:50%"
            v-model="filter"
            type="search"
            id="filterInput"
            :placeholder="'Mac Address' + '、' + this.$t('ds_name')"
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
          v-on:click="moldwindow([], [], 'new')"
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
          class="dspctableclass"
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
              @click="moldwindow(row.item, row.index, 'edit')"
              type="button"
              style="padding:0.1rem"
              icon="pencil-alt"
            ></mdb-btn>

            <mdb-btn style="width: 0px;padding: 0.1rem 0px;" icon="trash-alt"></mdb-btn
            ><!-- 固定欄高 -->
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
    <mdb-modal centered :show="modal" @close="closemodal($event)">
      <form v-on:submit.prevent="dealdata">
        <mdb-modal-header>
          <mdb-modal-title>{{ operate }} DS</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <div>
            <div class="input-group" style="margin-bottom: 1rem">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">DS</label>
              </div>
              <b-form-select
                v-model="DSobject.macAddress"
                :options="DSoption"
                @change="DSchange($event)"
                required
              ></b-form-select>
            </div>
            <mdb-input class="mb-3" required v-model="DSobject.displayName">
              <span class="input-group-text" slot="prepend">{{ $t('ds_name') }}</span>
            </mdb-input>
            <mdb-input class="mb-3" required v-model="DSobject.workShop" style="display:none">
              <span class="input-group-text" slot="prepend">{{ $t('workshop') }}</span>
            </mdb-input>
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
// import naturalCompare from 'string-natural-compare'
import { mapState } from 'vuex'
import {
  DSAPI,
  DsDeleteMultiAPI,
  UnregisteredDevice,
  SystemSettingAPI
} from '@/plugins/basicapis.js'
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
    var DSobject = {
      Id: 0,
      name: '',
      displayName: '',
      workShop: '',
      url: '',
      status: '',
      createTime: 0,
      macAddress: ''
    }
    var DSobjectnull = JSON.parse(JSON.stringify(DSobject))
    return {
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
      DSoption: [],
      machineoption: [],
      deletebundisable: true,
      selected: [],
      DSobject,
      DSobjectnull,
      operate: '',
      warning: false,
      modal: false,
      tabledata: [],
      fields: [
        // {
        //   key: "numberserial",
        //   label: "序號",
        //   class: "moldnumberclass"
        // },
        {
          key: 'macAddress',
          label: 'Mac Address',
          sortDirection: 'desc',
          class: 'text-center',
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'displayName',
          label: this.$t('ds_name'), //''串流裝置名稱',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'status',
          label: this.$t('status'), //'狀態',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'createTime',
          label: this.$t('machine_last_update_time'), //'最後更新時間',
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
      filterOn: ['macAddress', 'displayName'],
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
        if (item.name == 'basicsetting_device_ds') {
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
    //取得系統設定ip組成url
    geturl() {
      var access_token_val = this.$cookies.get('access_token')
      SystemSettingAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          var tempstring = 'http://10.10.10.100/remote/inipage'
          if (res.data != null) {
            res.data.forEach(item => {
              if (item.parameter == 'web_url') {
                if (item.value != '') {
                  tempstring = 'http://' + item.value + '/remote/inipage'
                }
              }
            })
          }
          this.submitfunc(tempstring)
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    DSchange(val) {
      this.DSoption.forEach(item => {
        var temp = JSON.parse(JSON.stringify(item))
        if (val == temp.value) {
          this.DSobject.name = temp.text
          this.DSobject.workShop = temp.workShop
        }
      })
    },
    //modal背景點擊不關閉
    closemodal(value) {
      if (value == undefined) {
        this.modal = false
      }
    },
    //取得未登入DS
    getDS(object) {
      var access_token_val = this.$cookies.get('access_token')
      UnregisteredDevice({
        headers: {
          access_token: access_token_val,
          type: 'DS'
        }
      }).then(
        res => {
          this.DSoption = []
          if (object != undefined) {
            this.DSoption.push({
              text: object.name,
              displayName: object.displayName,
              value: object.macAddress,
              workShop: object.group
            })
          }
          if (res.data != null) {
            res.data.forEach(item => {
              this.DSoption.push({
                text: item.name,
                displayName: '',
                value: item.macAddress,
                workShop: item.group
              })
            })
          }
          this.modal = true //顯示視窗
          // this.getmachine(object) //取得設備
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    getdata() {
      var access_token_val = this.$cookies.get('access_token')
      DSAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          if (res.data != null) {
            res.data.forEach(item => {
              item.createTime = this.timeStampToStringFunc(item.createTime, 'yyyy-mm-dd')
            })
            this.tabledata = res.data
            this.totalRows = res.data.length
          } else {
            this.totalRows = 0
            this.tabledata = []
          }
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
      this.page_first = this.dealThousands('num', this.page_first, 'num')
      this.page_last = this.dealThousands('num', this.page_last, 'num')
    },

    resetInfoModal() {
      this.infoModal.title = ''
      this.infoModal.content = ''
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    moldwindow(item, index, mode) {
      if (mode == 'edit') {
        this.operate = this.$t('edit')
      } else if (mode == 'new') {
        this.operate = this.$t('new')
      }

      if (mode == 'edit') {
        this.editwindow(item)
        this.getDS(item)
      } else {
        this.newwindow()
        this.getDS()
      }
    },
    //編輯
    editwindow(item) {
      this.DSobject.Id = item.id
      this.DSobject.url = item.url
      this.DSobject.name = item.name
      this.DSobject.displayName = item.displayName
      this.DSobject.workShop = item.workShop
      this.DSobject.status = item.status
      this.DSobject.createTime = this.stringToTimestampFunc(item.createTime)
      this.DSobject.macAddress = item.macAddress
    },
    newwindow() {
      this.DSobject.Id = 0
      this.DSobject.url = '預設投放頁面'
      this.DSobject.name = ''
      this.DSobject.displayName = ''
      this.DSobject.workShop = ''
      this.DSobject.status = '閒置'
      this.DSobject.macAddress = ''
    },
    checkisnull(value) {
      if (value == '') {
        return 0
      } else {
        return parseFloat(value)
      }
    },

    dealdata() {
      this.geturl()
    },
    // 送出
    submitfunc(url) {
      this.DSobject.url = url
      var access_token_val = this.$cookies.get('access_token')

      if (this.DSobject.Id == 0) {
        DSAPI.post(JSON.stringify(this.DSobject), {
          headers: {
            access_token: access_token_val
          }
        }).then(
          () => {
            this.$layer.msg(this.$t('scuccess'))
            this.modal = false
            this.isbusy = true
            this.getdata()
          },
          error => {
            this.$layer.msg(this.$t('fail') + error.response.data.response)
            this.modal = false
          }
        )
      } else {
        DSAPI.put(JSON.stringify(this.DSobject), {
          headers: {
            access_token: access_token_val
          }
        }).then(
          () => {
            this.$layer.msg(this.$t('scuccess'))
            this.modal = false
            this.isbusy = true
            this.getdata()
          },
          error => {
            console.log(error.response)
            this.$layer.msg(this.$t('fail') + error.response.data.response)
            this.modal = false
          }
        )
      }
    },
    // 刪除
    deletemold() {
      var access_token_val = this.$cookies.get('access_token')
      DsDeleteMultiAPI.delete({
        headers: {
          access_token: access_token_val,
          ids: this.selectedArrayToString(this.selected)
        }
      }).then(
        () => {
          this.$layer.msg(this.$t('scuccess'))
          this.modal = false
          this.isbusy = true
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
.dspctableclass {
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
