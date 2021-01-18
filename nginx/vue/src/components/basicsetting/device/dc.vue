<template>
  <b-container fluid>
    <mdb-card>
      <mdb-card-body>
        <!-- <div class="mx-3">
          <h2>DC管理</h2>
        </div> -->

        <b-col lg="16" class="my-1">
          <mdb-input
            style="width:50%"
            v-model="filter"
            type="search"
            id="filterInput"
            :placeholder="
              this.$t('machine_number') +
                '、' +
                this.$t('dc_idle_time') +
                '、' +
                this.$t('dc_put_time_interval') +
                '、' +
                'Mac Address' +
                '、' +
                this.$t('dc_create_time')
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
          class="dcpctableclass"
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
          <!-- <template v-slot:cell(name)="row">{{ row.value }}</template> -->
          <!--<template v-slot:cell(checkbox)="row">
            <b-form-checkbox></b-form-checkbox>
          </template>-->

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
          <template v-slot:table-busy>
            <div class="text-center my-3">
              <b-spinner class="align-middle"></b-spinner>
              <strong> Loading...</strong>
            </div>
          </template>
          <template v-slot:cell(numberserial)="row" class="col-sm-3">{{ row.index }}</template>

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
      <form v-on:submit.prevent="submitfunc">
        <mdb-modal-header>
          <mdb-modal-title>{{ operate }} DC</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <div>
            <div class="input-group" style="margin-bottom: 1rem">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">DC</label>
              </div>
              <b-form-select
                v-model="DCobject.macAddress"
                :options="DCoption"
                @change="DCchange($event)"
                required
              ></b-form-select>
            </div>
            <div class="input-group" style="margin-bottom: 1rem">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">{{ $t('machine') }}</label>
              </div>
              <b-form-select
                v-model="DCobject.machineId"
                :options="machineoption"
                required
              ></b-form-select>
            </div>
            <mdb-input class="mb-3" v-model="DCobject.workShop" style="display:none">
              <span class="input-group-text" slot="prepend">shop</span>
            </mdb-input>
            <!-- <mdb-input :show="modal" class="mb-3" v-model="DCobject.macAddress">
              <span class="input-group-text" required slot="prepend">macAddress</span>
            </mdb-input>-->
            <mdb-input class="mb-3" required v-model="DCobject.idleTime" type="number">
              <span class="input-group-text" slot="prepend">{{ $t('dc_idle_time') }}</span>
            </mdb-input>
            <mdb-input class="mb-3" required v-model="DCobject.putTimeInterval" type="number">
              <span class="input-group-text" slot="prepend">{{ $t('dc_put_time_interval') }}</span>
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
import naturalCompare from 'string-natural-compare'
import { mapState } from 'vuex'
import { DCAPI, MachineAPI, UnregisteredDevice, DCDeleteMultiAPI } from '@/plugins/basicapis.js'
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
      fields: [
        {
          key: 'machineNumber',
          label: this.$t('machine_number'), //'設備編號',
          sortable: true,
          thStyle: 'width:15%',
          class: 'text-center',
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'idleTime',
          label: this.$t('dc_idle_time'), //'閒置時間(s)',
          sortable: true,
          class: 'text-center',
          thStyle: 'width:15%',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'putTimeInterval',
          label: this.$t('dc_put_time_interval'), //'資料擷取最大區間(s)',
          sortable: true,
          class: 'text-center',
          thStyle: 'width:15%',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },

        {
          key: 'macAddress',
          label: 'Mac Address',
          sortDirection: 'desc',
          class: 'text-center',
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'createTimeshow',
          label: this.$t('dc_create_time'), //'紀錄時間',
          sortable: true,
          class: 'text-center',
          thStyle: 'width:10%',
          formatter: value => {
            return value
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
      let userrole = this.$cookies.get('roles')
      if (userrole == 1) {
        this.deletebtm = true
      }
      // this.$cookies.set('roles', userroles)
      this.authority.forEach(item => {
        if (item.name == 'basicsetting_device_dc') {
          if (!item.operation.includes(1)) {
            if (item.operation.includes(4)) {
              this.newbtm = true
            } //新增
            if (item.operation.includes(2)) {
              this.editbtm = true
            } //編輯
            // if (item.operation.includes(3)) {
            //   this.deletebtm = true
            // } //刪除
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
    DCchange(val) {
      this.DCoption.forEach(item => {
        var temp = JSON.parse(JSON.stringify(item))
        if (val == temp.value) {
          this.DCobject.workShop = temp.workshop
        }
      })
    },
    //modal背景點擊不關閉
    closemodal(value) {
      if (value == undefined) {
        this.modal = false
      }
    },
    //取得設備
    getmachine(object) {
      var access_token_val = this.$cookies.get('access_token')
      MachineAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          this.machineoption = []
          //編輯
          if (object != undefined) {
            if (res.data != null) {
              res.data.sort((a, b) => naturalCompare(a.machineNumber, b.machineNumber))
              res.data.forEach(item => {
                if (item.dcId == 0) {
                  this.machineoption.push({
                    text: item.machineNumber,
                    value: item.id
                  })
                }
                if (item.id == object.machineId) {
                  this.machineoption.push({
                    text: item.machineNumber,
                    value: item.id
                  })
                }
                // if(object.)
              })
            }
            //新增
          } else {
            if (res.data != null) {
              res.data.sort((a, b) => naturalCompare(a.machineNumber, b.machineNumber))
              res.data.forEach(item => {
                if (item.dcId == 0) {
                  this.machineoption.push({
                    text: item.machineNumber,
                    value: item.id
                  })
                }
              })
            }
          }

          this.modal = true //顯示視窗
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //取得未登入DC
    getDC(object) {
      var access_token_val = this.$cookies.get('access_token')
      UnregisteredDevice({
        headers: {
          access_token: access_token_val,
          type: 'DC'
        }
      }).then(
        res => {
          this.DCoption = []
          if (object != undefined) {
            this.DCoption.push({
              text: object.macAddress,
              value: object.macAddress,
              workshop: object.group
            })
          }
          if (res.data != null) {
            res.data.forEach(item => {
              this.DCoption.push({
                text: item.macAddress,
                value: item.macAddress,
                workshop: item.group
              })
            })
          }

          this.getmachine(object) //取得設備
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    getdata() {
      var access_token_val = this.$cookies.get('access_token')
      DCAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          if (res.data != null) {
            res.data.sort((a, b) => naturalCompare(a.machineNumber, b.machineNumber))
            if (res.data != null) {
              res.data.forEach(item => {
                item.createTimeshow = this.timeStampToStringFunc(item.createTime, 'yyyy-mm-dd')
              })
            }
            this.totalRows = res.data.length
            this.tabledata = res.data
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
      this.page_first = this.dealThousands('num', this.page_first)
      this.page_last = this.dealThousands('num', this.page_last)
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
        this.getDC(item)
      } else {
        this.newwindow()
        this.getDC()
      }
    },
    //編輯
    editwindow(item) {
      this.DCobject = JSON.parse(JSON.stringify(item))
    },
    newwindow() {
      this.DCobject = JSON.parse(JSON.stringify(this.DCobjectnull))
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
      // this.DCobject.Id = this.checkisnull(this.DCobject.Id);
      this.DCobject.idleTime = this.checkisnull(this.DCobject.idleTime)
      this.DCobject.putTimeInterval = this.checkisnull(this.DCobject.putTimeInterval)
      // this.DCobject.name = this.checkisnull(this.DCobject.name ),
      // this.DCobject.number =this.checkisnull(this.DCobject.number ),
    },
    // 送出
    submitfunc() {
      var access_token_val = this.$cookies.get('access_token')
      this.dealdata()

      if (this.DCobject.id == undefined) {
        DCAPI.post(JSON.stringify(this.DCobject), {
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
        DCAPI.put(JSON.stringify(this.DCobject), {
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
      DCDeleteMultiAPI.delete({
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
.dcpctableclass {
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
