<template>
  <b-container fluid>
    <mdb-card>
      <mdb-card-body>
        <!-- <div class="mx-3">
          <h2>缺陷管理</h2>
        </div>-->
        <b-tabs
          active-nav-item-class="font-weight-bold text-uppercase "
          active-tab-class="font-weight-bold"
        >
          <!-- 品檢 -->
          <b-tab
            :title="this.$t('produce_quality')"
            active
            style="padding-top:0"
            @click="tabclickfunc(1)"
          ></b-tab>
          <!-- 入庫 -->
          <b-tab
            :title="this.$t('produce_storage')"
            style="padding-top:0"
            @click="tabclickfunc(2)"
          ></b-tab>
          <!-- 模具 -->
          <b-tab
            v-if="!verOEEsiontab"
            :title="this.$t('mold')"
            style="padding-top:0"
            @click="tabclickfunc(3)"
          ></b-tab>
          <!-- 設備 -->
          <b-tab
            v-if="!verOEEsiontab"
            :title="this.$t('machine')"
            style="padding-top:0"
            @click="tabclickfunc(4)"
          ></b-tab>
          <!-- 原料 -->
          <b-tab
            v-if="!verOEEsiontab"
            :title="this.$t('material')"
            style="padding-top:0"
            @click="tabclickfunc(5)"
          ></b-tab>
          <!-- 人員 -->
          <b-tab
            v-if="!verOEEsiontab"
            :title="this.$t('employee')"
            style="padding-top:0"
            @click="tabclickfunc(6)"
          ></b-tab>
          <!-- 其他 -->
          <b-tab
            v-if="!verOEEsiontab"
            :title="this.$t('machine_material_type_other')"
            style="padding-top:0"
            @click="tabclickfunc(999)"
          ></b-tab>
        </b-tabs>

        <b-col lg="16" class="my-1">
          <mdb-input
            style="width:50%"
            v-model="filter"
            type="search"
            id="filterInput"
            :placeholder="
              this.$t('defect_name') + '、' + this.$t('defect_remark') + '、' + this.$t('status')
            "
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
          v-on:click="workshopwindow([], [], 'new')"
          icon="plus"
          style="padding:0.5rem"
        ></mdb-btn>

        <!-- <mdb-btn size="sm" color="danger" :disabled="selected ? selected == 0 : false" @click.native="warning = true">刪除</mdb-btn> -->
        <b-table
          class="defectpctableclass"
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
              @click="workshopwindow(row.item, row.index, 'edit')"
              type="button"
              style="padding:0.1rem"
              icon="pencil-alt"
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
          <!--<template v-slot:cell(checkbox)="row">
            <b-form-checkbox></b-form-checkbox>
          </template>-->

          <!-- <template v-slot:cell(actions)="row">
            <b-button size="sm" @click="workshopwindow(row.item, row.index, 'edit')">編輯</b-button>
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
    <mdb-modal centered :show="warning" @close="closemodal($event)">
      <mdb-modal-header>
        <mdb-modal-title>{{ $t('warrning_title') }}</mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body>{{ $t('warrning_body') }}</mdb-modal-body>
      <mdb-modal-footer>
        <mdb-btn color="info" v-on:click="deletemold()" @close="closemodal($event)">
          {{ $t('delete') }}
        </mdb-btn>
        <mdb-btn color="0000" @click.native="warning = false">{{ $t('close') }}</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
    <mdb-modal centered :show="modal" @close="closemodal($event)">
      <form v-on:submit.prevent="submitfunc">
        <mdb-modal-header>
          <mdb-modal-title>{{ operate }} {{ $t('defect') }}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <div>
            <div class="input-group" style="margin-bottom: 1rem">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">
                  <span class="requileclass">*</span>
                  {{ $t('defect_type') }}
                </label>
              </div>
              <b-form-select v-model="defectobject.type" :options="type" required></b-form-select>
            </div>
            <mdb-input :show="modal" class="mb-3" required v-model="defectobject.name">
              <span class="input-group-text" slot="prepend">
                <span class="requileclass">*</span>
                {{ $t('defect_name') }}
              </span>
            </mdb-input>
            <mdb-input :show="modal" class="mb-3" v-model="defectobject.remark">
              <span class="input-group-text" slot="prepend">{{ $t('defect_remark') }}</span>
            </mdb-input>
            <!-- <mdb-input class="mb-3" v-model="defectobject.type">
              <span class="input-group-text" slot="prepend">type</span>
            </mdb-input>-->

            <div class="input-group" style="margin-bottom: 1rem">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">
                  <span class="requileclass">*</span>
                  {{ $t('actvite') }}/{{ $t('disable') }}
                </label>
              </div>
              <b-form-select
                v-model="defectobject.isDelete"
                :options="disableoption"
                required
              ></b-form-select>
            </div>
          </div>
        </mdb-modal-body>
        <mdb-modal-footer>
          <mdb-btn color="info" type="submit">{{ $t('submit') }}</mdb-btn>
          <mdb-btn color="0000" @click.native="modal = false" type="button">
            {{ $t('close') }}
          </mdb-btn>
        </mdb-modal-footer>
      </form>
    </mdb-modal>
  </b-container>
</template>

<script>
import { mapState } from 'vuex'
import { DefectAPI } from '@/plugins/systemapis.js'
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
    var defectobject = {
      Id: 0,
      name: '',
      remark: '',
      type: 1,
      isDelete: false
    }
    var disableoption = [
      { text: this.$t('disable'), value: true }, //停用
      { text: this.$t('actvite'), value: false } //啟用
    ]
    // var type = [
    //   { text: this.$t('quality'), value: 1 }, //品檢
    //   { text: this.$t('storage'), value: 2 }, //入庫
    //   { text: this.$t('mold'), value: 3 }, //模具
    //   { text: this.$t('machine'), value: 4 }, //設備
    //   { text: this.$t('material'), value: 5 }, //原料
    //   { text: this.$t('employee'), value: 6 }, //人員
    //   { text: this.$t('machine_material_type_other'), value: 999 } //其他
    // ]

    var defectobjectnull = JSON.parse(JSON.stringify(defectobject))
    return {
      page_first: 0, //第一條
      page_last: 0, //最後一筆
      page_total: 0, //總共筆數
      isbusy: true,
      verOEEsiontab: true, //OEE版本顯示tab
      num: [0, 0, 0, 0, 0, 0, 0], //各tab數量
      tabvalue: 1, //頁籤數值
      alldata: [], //全部資料
      newbtm: false, //新增
      editbtm: false, //編輯
      deletebtm: false, //刪除
      customize1: false, //自定義一
      customize2: false, //自定義二
      customize3: false, //自定義三
      type: [], //缺陷選單
      disableoption,
      deletebundisable: true,
      selected: [],
      defectobject,
      defectobjectnull,
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
          key: 'type',
          label: this.$t('defect_type'), //'類別',
          sortDirection: 'desc',
          class: 'text-center',
          formatter: value => {
            switch (value) {
              case 1:
                return this.$t('quality')
              case 2:
                return this.$t('storage')
              case 3:
                return this.$t('mold')
              case 4:
                return this.$t('machine')
              case 5:
                return this.$t('material')
              case 6:
                return this.$t('employee')
              case 999:
                return this.$t('machine_material_type_other')
            }
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'name',
          label: this.$t('defect_name'), //'缺陷名稱',
          sortDirection: 'desc',
          class: 'text-center',
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'remark',
          label: this.$t('defect_remark'), //'備註',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle remarkstyle'
        },
        {
          key: 'status',
          label: this.$t('status'), //'狀態',
          sortDirection: 'desc',
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
      filterOn: ['name', 'remark', 'status'],
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
      if (localStorage.getItem('version') == '"1"') {
        //OEE
        this.verOEEsiontab = true
        this.type = [
          { text: this.$t('quality'), value: 1 }, //品檢
          { text: this.$t('storage'), value: 2 } //入庫
          // { text: this.$t('mold'), value: 3 }, //模具
          // { text: this.$t('machine'), value: 4 }, //設備
          // { text: this.$t('material'), value: 5 }, //原料
          // { text: this.$t('employee'), value: 6 }, //人員
          // { text: this.$t('machine_material_type_other'), value: 999 } //其他
        ]
      } else {
        this.verOEEsiontab = false
        this.type = [
          { text: this.$t('quality'), value: 1 }, //品檢
          { text: this.$t('storage'), value: 2 }, //入庫
          { text: this.$t('mold'), value: 3 }, //模具
          { text: this.$t('machine'), value: 4 }, //設備
          { text: this.$t('material'), value: 5 }, //原料
          { text: this.$t('employee'), value: 6 }, //人員
          { text: this.$t('machine_material_type_other'), value: 999 } //其他
        ]
        //OEE+、IPS
      }

      this.authority.forEach(item => {
        if (item.name == 'system_defect') {
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
    getdata() {
      var access_token_val = this.$cookies.get('access_token')
      DefectAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          this.alldata = res.data
          // this.num = [0, 0, 0, 0, 0, 0, 0] //各tab數量
          if (res.data != null) {
            res.data.forEach(item => {
              if (!item.isDelete) {
                item.status = this.$t('actvite')
              } else {
                item.status = this.$t('disable')
              }
              // switch (item.type) {
              //   case 1: //品檢
              //     this.num[0]++
              //     break
              //   case 2: //入庫
              //     this.num[1]++
              //     break
              //   case 3: //模具
              //     this.num[2]++
              //     break
              //   case 4: //設備
              //     this.num[3]++
              //     break
              //   case 5: //原料
              //     this.num[4]++
              //     break
              //   case 6: //人員
              //     this.num[5]++
              //     break
              //   case 999: //其他
              //     this.num[6]++
              //     break
              // }
            })
          }
          this.tabclickfunc(this.tabvalue)
          // this.tabledata = res.data
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //點擊tab更換
    tabclickfunc(value) {
      this.tabvalue = value
      var temparray = []
      if (this.alldata != null) {
        this.alldata.forEach(item => {
          if (item.type == value) {
            temparray.push(item)
          }
        })
      }
      this.totalRows = temparray.length
      this.tabledata = temparray
      this.isbusy = false
      this.setfooternum() //設定頁數
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
        this.modal = false
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
    workshopwindow(item, index, mode) {
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
      this.modal = true //顯示視窗
    },
    //編輯
    editwindow(item) {
      this.defectobject = JSON.parse(JSON.stringify(item))
    },
    newwindow() {
      this.defectobject = JSON.parse(JSON.stringify(this.defectobjectnull))
      this.defectobject.type = this.tabvalue
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
      this.defectobject.Id = this.checkisnull(this.defectobject.Id)
      // this.defectobject.name = this.checkisnull(this.defectobject.name ),
      // this.defectobject.number =this.checkisnull(this.defectobject.number ),
    },
    // 送出
    submitfunc() {
      this.dealdata()

      var access_token_val = this.$cookies.get('access_token')
      if (this.defectobject.Id == '') {
        DefectAPI.post(JSON.stringify(this.defectobject), {
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
      } else {
        DefectAPI.put(JSON.stringify(this.defectobject), {
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
      // let defecturl = url.options.SRVurl.system + '/ioms5system/crud/basic/defect'
      this.selected.forEach(item => {
        DefectAPI.delete({
          headers: {
            access_token: access_token_val,
            id: item.id
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
      })
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
.defectpctableclass {
  max-height: calc(100vh - 346px) !important;
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
