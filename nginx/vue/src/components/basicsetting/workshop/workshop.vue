<template>
  <div>
    <!-- <div class="mx-3">
          <h2>廠區管理</h2>
          <h2>{{ authority }}</h2>
        </div>-->

    <div>
      <b-col lg="16" class="my-1">
        <mdb-input
          style="width:50%"
          v-model="filter"
          type="search"
          id="filterInput"
          :placeholder="
            this.$t('workshop_number') +
              '、' +
              this.$t('workshop_name') +
              '、' +
              this.$t('workshop_remark')
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
        class="workshoppctableclass"
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
        <template slot-scope="props">
          <b-table-column
            v-for="(column, index) in fields"
            :key="index"
            :visible="column.visible"
            >{{ props.row[column.field] }}</b-table-column
          >
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
            @click="workshopwindow(row.item, row.index, 'edit')"
            type="button"
            style="padding:0.1rem"
            icon="pencil-alt"
          ></mdb-btn>
          <!-- 刪除 -->
          <mdb-btn
            v-if="deletebtm"
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
              <b-button size="sm" @click="workshopwindow(row.item, row.index, 'edit')"
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
    </div>

    <mdb-modal centered :show="warning" @close="closemodal($event)">
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
      <form v-on:submit.prevent="submitfunc">
        <mdb-modal-header>
          <mdb-modal-title>{{ operate }} {{ $t('workshop') }}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <div>
            <mdb-input :show="modal" class="mb-3" required v-model="workshopobject.number">
              <span class="input-group-text" slot="prepend" style="width:155px">
                <span class="requileclass">*</span>
                {{ $t('workshop_number') }}
              </span>
            </mdb-input>
            <mdb-input class="mb-3" required v-model="workshopobject.name">
              <span class="input-group-text" slot="prepend" style="width:155px">
                <span class="requileclass">*</span>
                {{ $t('workshop_name') }}
              </span>
            </mdb-input>
            <!-- <div class="input-group" style="margin-bottom: 1rem">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01" style="width:97px">
                  <span class="requileclass">*</span>
                  {{ $t('workshoptype') }}
                </label>
              </div>
              <b-form-select
                required
                v-model="workshopobject.classId"
                :options="workshoptypnameobject"
              ></b-form-select>
            </div> -->
            <div class="input-group" style="margin-bottom: 1rem">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01" style="width:155px">{{
                  $t('workshop_type')
                }}</label>
              </div>
              <b-form-select v-model="workshopobject.type" :options="workshoptype"></b-form-select>
            </div>
            <mdb-input class="mb-3" v-model="workshopobject.remark">
              <span class="input-group-text" slot="prepend" style="width:155px">{{
                $t('workshop_remark')
              }}</span>
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
  </div>
</template>

<script>
import { WorkShopAPI, WorkShopmultideleteAPI, WorkShopTypeAPI } from '@/plugins/basicapis.js'
import { mapState } from 'vuex'

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
    var workshopobject = {
      Id: 0,
      name: '',
      number: '',
      type: 1,
      classId: 0, //設備廠區
      remark: ''
    }
    var workshopobjectnull = JSON.parse(JSON.stringify(workshopobject))
    var workshoptypnameobject = [] //設備廠區
    return {
      workshopobjectnull,
      workshoptypnameobject,
      page_first: 0, //第一條
      page_last: 0, //最後一筆
      page_total: 0, //總共筆數
      isbusy: true,
      newbtm: false, //新增
      editbtm: false, //編輯
      deletebtm: false, //刪除
      deleteitem: 0,
      deletemode: 0,
      workshoptype: [
        { text: this.$t('workshop_machine'), value: '1' }, //設備廠區
        { text: this.$t('workshop_mold'), value: '2', disabled: true }, //模具倉
        { text: this.$t('workshop_material'), value: '3', disabled: true }, //原料倉
        { text: this.$t('workshop_product'), value: '4', disabled: true } //製品倉
      ],
      deletebundisable: true,
      selected: [],
      workshopobject,
      operate: '',
      warning: false,
      modal: false,
      tabledata: [],
      fields: [
        // {
        //   key: 'className',
        //   label: this.$t('workshoptype'), //'廠別',
        //   sortable: true,
        //   sortDirection: 'desc',
        //   class: 'text-center',
        //   visible: false,
        //   thClass: 'thstyle',
        //   tdClass: 'tdstyle'
        // },
        {
          key: 'number',
          label: this.$t('workshop_number'), //'廠區編號',
          sortable: true,
          sortDirection: 'desc',
          class: 'text-center',
          visible: false,
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'name',
          label: this.$t('workshop_name'), //'廠區名稱',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          visible: false,
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'count',
          label: this.$t('workshop_machine_num'), //'設備總數',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          visible: true,
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'remark',
          label: this.$t('workshop_remark'), //'備註',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          visible: false,
          thClass: 'thstyle',
          tdClass: 'tdstyle remarkstyle'
        },
        {
          key: 'actions',
          label: this.$t('operating'),
          class: 'text-center',
          thStyle: 'width: 160px;',
          visible: false,
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
      filterOn: ['number', 'name', 'remark'],
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
        if (item.name == 'basicsetting_workshop') {
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
          }
        }
      })
    },
    //modal背景點擊不關閉
    closemodal(value) {
      if (value == undefined) {
        this.warning = false
        this.modal = false
      }
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

    //點擊tab
    tabclickfunc() {},
    getdata() {
      var access_token_val = this.$cookies.get('access_token')
      WorkShopAPI.get({
        headers: {
          // 'Cache-Control': 'no-cache',
          access_token: access_token_val
        }
      }).then(
        res => {
          if (res.data != null) {
            this.totalRows = res.data.length
            res.data.sort((a, b) => naturalCompare(a.number, b.number))
            res.data.forEach(item => {
              if (item.classId == 0) {
                item.className = '-'
              }
            })
            this.tabledata = res.data

            // this.getmachinedata(res.data)
          } else {
            this.tabledata = []
            this.totalRows = 0
          }
          this.isbusy = false
          this.setfooternum()
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
      this.getworkshopclassId() //取得廠別
    },
    //編輯
    editwindow(item) {
      this.workshopobject = JSON.parse(JSON.stringify(item))

      // this.workshopobject.Id = item.id
      // this.workshopobject.name = item.name
      // this.workshopobject.number = item.number
      // this.workshopobject.classId = item.classId
    },
    newwindow() {
      this.workshopobject = JSON.parse(JSON.stringify(this.workshopobjectnull))
      // this.workshopobject.Id = ''
      // this.workshopobject.name = ''
      // this.workshopobject.number = ''
      // this.workshopobject.classId = 0
    },
    //取得廠別
    getworkshopclassId() {
      var access_token_val = this.$cookies.get('access_token')
      WorkShopTypeAPI.get({
        headers: {
          // 'Cache-Control': 'no-cache',
          access_token: access_token_val
        }
      }).then(
        res => {
          let temparray = []
          if (res.data != null) {
            res.data.forEach(item => {
              temparray.push({ text: item.name, value: item.id })
            })
          }
          this.workshoptypnameobject = temparray
          this.modal = true //顯示視窗
        },
        error => {
          console.log(error.response)
          this.modal = true //顯示視窗
          // this.$layer.msg(this.$t('fail') + error.response.data.response)
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
      this.workshopobject.Id = this.checkisnull(this.workshopobject.Id)
      // this.workshopobject.name = this.checkisnull(this.workshopobject.name ),
      // this.workshopobject.number =this.checkisnull(this.workshopobject.number ),
    },
    // 送出
    submitfunc() {
      this.dealdata()
      var access_token_val = this.$cookies.get('access_token')
      //新增POST
      if (this.workshopobject.Id == '') {
        WorkShopAPI.post(JSON.stringify(this.workshopobject), {
          headers: {
            access_token: access_token_val
          }
        }).then(
          () => {
            // this.getdata();
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
        //編輯PUT
      } else {
        WorkShopAPI.put(JSON.stringify(this.workshopobject), {
          headers: {
            access_token: access_token_val
          }
        }).then(
          () => {
            // this.getdata();
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
      if (this.deletemode == 1) {
        WorkShopmultideleteAPI.delete({
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
      } else {
        WorkShopAPI.delete({
          headers: {
            access_token: access_token_val,
            id: this.deleteitem
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
.workshoppctableclass {
  max-height: calc(100vh - 346px) !important;
}
.workshopoperateclass {
  text-align: center;
  width: 160px;
}
.tab-content {
  padding: 0rem !important;
  padding-top: 0rem !important;
}
</style>
<style scoped>
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
