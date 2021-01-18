<template>
  <div>
    <b-col lg="16" class="my-1">
      <mdb-input
        style="width:50%"
        v-model="filter"
        type="search"
        id="filterInput"
        :placeholder="this.$t('employee_class')"
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
      v-on:click="classwindow([], [], 'new')"
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
      class="employeeclasspctableclass"
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
      <template v-slot:cell(numberserial)="row" class="col-sm-3">{{ row.index }}</template>
      <!-- <template v-slot:cell(name)="row">{{ row.value }}</template> -->
      <!-- <template v-slot:cell(checkbox)="row">
        <b-form-checkbox></b-form-checkbox>
      </template>-->

      <template v-slot:cell(actions)="row">
        <mdb-btn
          v-if="editbtm"
          color="mdb-color"
          @click="classwindow(row.item, row.index, 'edit')"
          type="button"
          style="padding:0.1rem"
          icon="pencil-alt"
        ></mdb-btn>

        <mdb-btn style="width: 0px;padding: 0.1rem 0px;" icon="trash-alt"></mdb-btn>
        <!-- 固定欄高 -->
      </template>
      <!--詳細資訊 -->
      <template v-slot:row-details="row">
        <b-card>
          <div v-for="(value, key) in row.item.members" :key="key">
            {{ emploteetype(value.leader) }}: {{ value.name }}
          </div>
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
        <b-button size="sm" @click="classwindow(row.item, row.index, 'edit')">編輯</b-button>
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
        <mdb-btn color="info" v-on:click="deleteclass()" @click.native="warning = false">
          {{ $t('delete') }}
        </mdb-btn>
        <mdb-btn color="0000" @click.native="warning = false">{{ $t('close') }}</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
    <mdb-modal centered :show="modal" @close="closemodal($event)">
      <form v-on:submit.prevent="submitfunc">
        <mdb-modal-header>
          <mdb-modal-title>{{ operate }} {{ $t('employee_class') }}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <div>
            <mdb-input
              :show="modal"
              class="mb-3"
              required
              v-model="classobject.name"
              :centered="true"
            >
              <span class="input-group-text" slot="prepend" required>
                <span class="requileclass">*</span>
                {{ $t('employee_class') }}
              </span>
            </mdb-input>
            <!-- <mdb-btn size="sm" color="success" type="button" @click="addRow">新增人員</mdb-btn>
            <div :key="index" v-for="(member, index) in members">
              <b-row>
                <b-col>
                  <div class="md-form input-group">
                    <mdb-input
                      type="checkbox"
                      :id="'#'+index"
                      name="check1"
                      v-model="member.leader"
                      label="班長"
                    />
                  </div>
                </b-col>
                <b-col>
                  <mdb-input :show="modal" required v-model="member.name">
                    <span class="input-group-text" slot="prepend">姓名</span>
                  </mdb-input>
                </b-col>
                <b-col lg="3">
                  <mdb-btn size="sm" type="button" color="danger" @click="deleteRow(index)">刪除</mdb-btn>
                </b-col>
              </b-row>
            </div>-->
          </div>
        </mdb-modal-body>
        <mdb-modal-footer>
          <span style="color:red">{{ errormes }}</span>
          <mdb-btn color="info" type="submit">{{ $t('submit') }}</mdb-btn>
          <mdb-btn color="0000" @click.native="modal = false" type="button">
            {{ $t('close') }}
          </mdb-btn>
        </mdb-modal-footer>
      </form>
    </mdb-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { EmployeeClassAPI, EmployeeClassDeleteMultiAPI } from '@/plugins/basicapis.js'
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
    var classobject = {
      Id: 0,
      name: '',
      members: []
    }
    var classobjectnull = JSON.parse(JSON.stringify(classobject))
    return {
      page_first: 0, //第一條
      page_last: 0, //最後一筆
      page_total: 0, //總共筆數
      isbusy: true,
      errormes: '', //錯誤訊息
      newbtm: false, //新增
      editbtm: false, //編輯
      deletebtm: false, //刪除
      customize1: false, //自定義一
      customize2: false, //自定義二
      customize3: false, //自定義三
      deletebundisable: true,
      baseOptions: [],
      members: [],
      selected: [],
      classobject,
      classobjectnull,
      operate: '',
      warning: false,
      modal: false,
      tabledata: [],
      fields: [
        {
          key: 'name',
          label: this.$t('employee_class'), //'班別',
          sortable: true,
          sortDirection: 'desc',
          class: 'text-center',
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
    addRow() {
      this.members.push({
        leader: false,
        name: ''
      })
    },
    deleteRow(index) {
      this.members.splice(index, 1)
    },
    emploteetype(value) {
      if (value) {
        return '班長'
      } else {
        return '一般'
      }
    },
    getdata() {
      var access_token_val = this.$cookies.get('access_token')
      EmployeeClassAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          this.tabledata = res.data
          if (res.data != null) {
            this.totalRows = res.data.length
          } else {
            this.tabledata = []
            this.totalRows = 0
          }
          this.isbusy = false
          this.setfooternum() //設定頁數
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
          this.isbusy = false
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
    classwindow(item, index, mode) {
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
      this.classobject = JSON.parse(JSON.stringify(item))
      this.members = JSON.parse(JSON.stringify(item.members))
    },
    //新增
    newwindow() {
      this.classobject = JSON.parse(JSON.stringify(this.classobjectnull))
      this.members = []
      this.members.push({
        leader: false,
        name: ''
      })
    },
    dealdata() {
      this.classobject.members = this.members
    },
    // 送出
    submitfunc() {
      this.dealdata()
      var access_token_val = this.$cookies.get('access_token')

      if (this.classobject.Id == '') {
        EmployeeClassAPI.post(JSON.stringify(this.classobject), {
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
            if (
              error.response.data.response == 'Make sure that all your class names are not repeated'
            ) {
              this.errormes = this.$t('employee_class_error')
            } else {
              this.errormes = error.response.data.response
            }
            console.log(error.response)
            // this.$layer.msg(this.$t('fail') + error.response.data.response)
            // this.modal = false
          }
        )
      } else {
        EmployeeClassAPI.put(JSON.stringify(this.classobject), {
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
            if (
              error.response.data.response == 'Make sure that all your class names are not repeated'
            ) {
              this.errormes = this.$t('employee_class_error')
            } else {
              this.errormes = error.response.data.response
            }

            // this.$layer.msg(this.$t('fail') + error.response.data.response)
            // this.modal = false
          }
        )
      }
    },
    // 刪除
    deleteclass() {
      var access_token_val = this.$cookies.get('access_token')
      EmployeeClassDeleteMultiAPI.delete({
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
.employeeclasspctableclass {
  max-height: calc(100vh - 346px) !important;
}
.classnumberclass {
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
.md-form.input-group {
  margin-top: 0px;
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
