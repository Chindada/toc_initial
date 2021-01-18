<template>
  <b-container fluid>
    <mdb-card>
      <mdb-card-body>
        <!-- <div class="mx-3">
          <h2>DS管理</h2>
        </div> -->

        <b-col lg="16" class="my-1">
          <mdb-input
            style="width:50%;opacity:0"
            v-model="filter"
            type="search"
            id="filterInput"
            placeholder
            :disabled="true"
          >
            <span class="input-group-text" slot="prepend">{{ $t('search') }}</span>

            <!-- <mdb-btn size="sm" color="primary" :disabled="!filter" @click="filter = ''">清除</mdb-btn> -->
          </mdb-input>
        </b-col>
        <b-table
          class="remotepctableclass"
          no-border-collapse
          sticky-header="590px"
          :busy="isbusy"
          id="pc"
          responsive
          show-empty
          bordered
          :hover="true"
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
          <!-- 看板 -->
          <template v-slot:cell(dashboard)="row">
            <div class="input-group" style="margin:auto">
              <b-form-select
                v-model="optionarray[row.item.index].dashboard"
                @change="dashboardchange($event, row.item.id, row.item.index)"
                size="sm"
                :options="dashboardoption"
              ></b-form-select>
            </div>
          </template>
          <!-- 廠區  -->
          <template v-slot:cell(group)="row">
            <div class="input-group" style="margin:auto">
              <b-form-select
                v-model="optionarray[row.item.index].workshop"
                @change="workshopchange($event, row.item.id, row.item.index)"
                id="perPageSelect"
                size="sm"
                :options="workshopoption"
              ></b-form-select>
            </div>
          </template>
          <!-- 模式  -->
          <template v-slot:cell(mode)="row">
            <div class="input-group" style="margin:auto">
              <b-form-select
                v-model="optionarray[row.item.index].mode"
                @change="modechange($event, row.item.id, row.item.index)"
                id="perPageSelect"
                size="sm"
                :options="modeoption"
              ></b-form-select>
            </div>
          </template>
          <!-- 輪播/頁面  -->
          <template v-slot:cell(page)="row">
            <div class="input-group" style="margin:auto">
              <b-form-select
                v-model="optionarray[row.item.index].page"
                id="perPageSelect"
                size="sm"
                :options="inipagearray[optionarray[row.item.index].workshop]"
              ></b-form-select>
            </div>
          </template>
          <template v-slot:cell(actions)="row">
            <!-- 編輯 -->
            <mdb-btn
              v-if="!optionarray[row.item.index].operate"
              color="mdb-color"
              v-on:click="buttomchange(row.item, optionarray[row.item.index])"
              type="button"
              style="padding:0.1rem"
              icon="pencil-alt"
            ></mdb-btn>
            <mdb-btn
              v-if="optionarray[row.item.index].operate"
              :disabled="selected ? selected != 0 : false"
              color="danger"
              v-on:click="buttomchange(row.item, optionarray[row.item.index])"
              type="button"
              style="padding:0.1rem"
              icon="stop"
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
  </b-container>
</template>

<script>
// import naturalCompare from 'string-natural-compare'
import { mapState } from 'vuex'
import { KanbanModeAPI } from '@/plugins/dashboardapis.js'
import { DSAPI, WorkShopAPI, gmachineSelectAPI } from '@/plugins/basicapis.js'
import naturalCompare from 'string-natural-compare'
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
      workShop: '',
      url: '',
      status: '',
      createTime: 0,
      macAddress: '',
      mode: 0
    }
    var modeoption = [
      { text: this.$t('not_setting'), value: -1, disabled: true },
      { value: 0, text: this.$t('efficiency_mode') }, //'效率指標' },
      { value: 1, text: this.$t('stability_mode') } //'穩定指標' }
    ]
    var DSobjectnull = JSON.parse(JSON.stringify(DSobject))
    return {
      page_first: 0, //第一條
      page_last: 0, //最後一筆
      page_total: 0, //總共筆數
      isbusy: true,
      modeoption, //模式選單
      newbtm: true, //新增
      editbtm: true, //編輯
      deletebtm: true, //刪除
      customize1: true, //自定義一
      customize2: true, //自定義二
      customize3: true, //自定義三
      DSoption: [],
      machineoption: [],
      deletebundisable: true,
      selected: [],
      DSobject,
      DSobjectnull,
      operate: '',
      modal: false,
      tabledata: [],
      fields: [
        {
          key: 'name',
          label: this.$t('ds_name'), //串流裝置名稱
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'dashboard',
          label: this.$t('select_dasboard'), //選擇看板
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value + 'aawwhw'
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'group',
          label: this.$t('to_schedule_workshop'), //'車間/設備'
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'mode',
          label: this.$t('dashboard_mode'), //'看板模式'
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'page',
          label: this.$t('page_mode'), // '選擇輪播/頁面'
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
          label: this.$t('status'),
          sortable: true,
          class: 'text-center',
          formatter: (value, _, data) => {
            if (value == 'OFFLINE') {
              return this.$t('off_line')
            }
            var tempval = data.url.substring(data.url.search('/remote'), data.url.length)
            if (tempval == '/remote/inipage') {
              return this.$t('title_idle')
            } else {
              return this.$t('playing')
            }
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
      test: 0,
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
      workshopoption: [],
      dashboardoption: [
        { text: this.$t('not_setting'), value: -1, disabled: true }

        // { text: '單站看版', value: 2 }
      ],
      pageoption: [{ text: this.$t('not_setting'), value: -1, disabled: true }],
      dashboardselected: 1,
      optionarray: [], //selected array
      inipagearray: [], //預設頁面選項
      cardperpage: 14 //每頁幾張卡片
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
    this.getdashboardmode() //取得看本模式
  },
  methods: {
    //取得看本模式
    getdashboardmode() {
      KanbanModeAPI({
        headers: {}
      }).then(
        res => {
          if (res.data.mode == '2') {
            this.cardperpage = 10 //客製化看板
          } else {
            this.cardperpage = 14 //一般看板
          }
          this.getworkshop()
        },
        error => {
          //失敗設定一般看板
          console.log(error)
          this.getworkshop()
        }
      )
    },
    //設定權限
    iniright() {
      this.authority.forEach(item => {
        if (item.name == 'remote_dashboard_setting') {
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
        switch (item.name) {
          case 'dashboard_workshop':
            this.dashboardoption.push({ text: this.$t('dashboard_workshop'), value: 1 })
            break
          // case 'dashboard_workshop2':
          //   this.dashboardoption.push({ text: this.$t('dashboard_workshop2'), value: 1 })
          //   break
          // case 'dashboard_workshop3':
          //   this.dashboardoption.push({ text: this.$t('dashboard_workshop3'), value: 1 })
          //   break
          // case 'dashboard_station':
          //   this.dashboardoption.push({ text: this.$t('dashboard_station'), value: 1 })
          //   break
        }
      })
    },
    buttomchange(item, value) {
      if (value.operate == true) {
        //取消設定
        // http://10.10.10.100/remote/inipage
        var tempurl = item.url.substring(0, item.url.search('/remote/dashboard'))
        tempurl += '/remote/inipage'
        item.url = tempurl
        this.optionarray[item.index].operate = false
        this.optionarray[item.index].dashboard = -1
        this.optionarray[item.index].workshop = -1
        this.optionarray[item.index].page = -1
        this.optionarray[item.index].mode = -1

        this.subminfunc(item)
      } else {
        //設定
        // http://10.10.10.87:8080/remote/dashboardworkshop?type=1&group=4&page=0&mode=0
        if (value.dashboard != -1 && value.workshop != -1 && value.page != -1) {
          var tempurl = item.url.substring(0, item.url.search('/remote/inipage'))
          tempurl +=
            '/remote/dashboardworkshop?type=' +
            value.dashboard +
            '&group=' +
            value.workshop +
            '&page=' +
            value.page +
            '&mode=' +
            value.mode
          item.url = tempurl
          this.optionarray[item.index].operate = true
          this.subminfunc(item)
        } else {
          this.$layer.msg(this.$t('not_setting'))
        }
      }
    },
    //送出
    subminfunc(item) {
      var access_token_val = this.$cookies.get('access_token')
      DSAPI.put(JSON.stringify(item), {
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
    },
    //模式改變
    modechange(val, id, index) {
      // console.log(val)
      // console.log(id)
      // console.log(index)
      // console.log(this.optionarray)
      // console.log('-----')
      this.optionarray[index].mode = val
    },
    //車間/設備變更
    workshopchange(val, id, index) {
      this.optionarray[index].dashboard = 1 //預設即時看板
      this.optionarray[index].page = 0 //預設輪播
    },
    dashboardchange(val, id, index) {
      this.optionarray[index].workshop = 0 //預設車間
      this.optionarray[index].page = 0 //預設輪播
      this.optionarray[index].mode = 0 //預設效率指標
    },
    //取得workshop
    getworkshop() {
      var access_token_val = this.$cookies.get('access_token')
      WorkShopAPI.get({
        headers: {
          access_token: access_token_val,
          workshop: 'true'
        }
      }).then(
        res => {
          if (res.data != null) {
            res.data.sort((a, b) => naturalCompare(a.number, b.number))
            this.getmachinedata(res.data)
          }
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //計算各廠設備數量
    getmachinedata(workshopdata) {
      var access_token_val = this.$cookies.get('access_token')
      gmachineSelectAPI({
        headers: {
          access_token: access_token_val,
          workshop: 'true'
        }
      }).then(
        res => {
          if (res.data != null) {
            this.workshopoption.push({
              value: -1,
              text: this.$t('not_setting'),
              machinetotal: 0,
              disabled: true
            })
            this.workshopoption.push({
              value: 0,
              text: this.$t('all'),
              machinetotal: res.data.length
            })
            this.setinipagearray({ value: -1, text: this.$t('not_setting'), machinetotal: 1 })
            this.setinipagearray({ value: 0, text: this.$t('all'), machinetotal: res.data.length })
            workshopdata.forEach(item => {
              var temptotal = 0
              for (var i = 0; i < res.data.length; i++) {
                if (res.data[i].workShopId == item.id) {
                  temptotal++
                }
              }
              this.workshopoption.push({ value: item.id, text: item.name, machinetotal: temptotal })
              this.setinipagearray({ value: item.id, text: item.name, machinetotal: temptotal })
            })
          }

          this.getdata() //取得DS
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //初始化預設廠區面
    setinipagearray(item) {
      if (item.value == -1) {
        var temparray = [{ value: -1, text: this.$t('not_setting') }]
      } else {
        var totoalpage = Math.ceil(item.machinetotal / this.cardperpage) //一頁幾個
        var temparray = [{ value: 0, text: this.$t('carousel') }]

        for (var i = 0; i < totoalpage; i++) {
          temparray.push({ value: i + 1, text: i + 1 })
        }
      }
      this.inipagearray[item.value] = temparray
    },
    //取得DS
    getdata() {
      var access_token_val = this.$cookies.get('access_token')
      DSAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          if (res.data != null) {
            res.data.forEach((item, index) => {
              item.index = index
              this.setoptionarray(item.url) //設定選擇選項
            })
            this.totalRows = res.data.length
          } else {
            this.totalRows = 0
          }
          this.tabledata = res.data
          this.isbusy = false
          this.setfooternum() //設定頁數
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

    //設定selected
    setoptionarray(url) {
      var temp = {
        dashboard: 1,
        workshop: 0,
        page: 0,
        mode: 0
      }

      //閒置
      if (url.search('inipage') != -1) {
        temp.dashboard = -1
        temp.workshop = -1
        temp.page = -1
        temp.operate = false
        temp.mode = -1
      } else {
        // http://10.10.10.87:8080/remote/dashboardworkshop?type=1&group=7&page=0&mode=0
        var type = parseInt(url.substring(url.search('type=') + 5, url.search('&group=')))
        var group = parseInt(url.substring(url.search('group=') + 6, url.search('&page=')))
        var page = parseInt(url.substring(url.search('page=') + 5, url.search('&mode=')))
        var mode = parseInt(url.substring(url.search('mode=') + 5, url.length))
        temp.dashboard = type
        temp.workshop = group
        temp.page = page
        temp.operate = true
        temp.mode = mode
      }
      this.optionarray.push(temp)
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
      }

      if (mode == 'edit') {
        this.editwindow(item)
        this.getDS(item)
      }
    },
    //編輯
    editwindow(item) {
      this.DSobject.Id = item.id
      this.DSobject.url = item.url
      this.DSobject.name = item.name
      this.DSobject.workShop = item.workShop
      this.DSobject.status = item.status
      this.DSobject.createTime = this.stringToTimestampFunc(item.createTime)
      this.DSobject.macAddress = item.macAddress
    },
    checkisnull(value) {
      if (value == '') {
        return 0
      } else {
        return parseFloat(value)
      }
    },
    // 送出
    submitfunc() {
      var access_token_val = this.$cookies.get('access_token')
      DSAPI.put(JSON.stringify(this.DSobject), {
        headers: {
          access_token: access_token_val
        }
      }).then(
        () => {
          this.$layer.msg(this.$t('scuccess'))
          this.isbusy = true
          this.getdata()
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    }
    //複選
    // onRowSelected(items) {
    //   this.selected = items
    //   this.deletebundisable = false
    // },
    // // selectAllRows() {
    // //   this.$refs.selectableTable.selectAllRows();
    // // },
    // clearSelected() {
    //   this.$refs.selectableTable.clearSelected()
    // },
    // selectThirdRow() {
    //   // Rows are indexed from 0, so the third row is index 2
    //   this.$refs.selectableTable.selectRow(2)
    // },
    // unselectThirdRow() {
    //   // Rows are indexed from 0, so the third row is index 2
    //   this.$refs.selectableTable.unselectRow(2)
    // }
  }
}
</script>
<style>
.remotepctableclass {
  max-height: calc(100vh - 265px) !important;
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
