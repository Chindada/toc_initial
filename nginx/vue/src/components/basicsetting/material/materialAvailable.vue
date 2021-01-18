<template>
  <div>
    <!-- <div class="mx-3">
      <h2>{{ meterialData }}</h2>
      <h2>{{ authority }}</h2>
    </div>-->

    <b-col lg="16" class="my-1">
      <mdb-input
        style="width:50%"
        v-model="filter"
        type="search"
        id="filterInput"
        :placeholder="
          this.$t('material_number') +
            '、' +
            this.$t('material_name') +
            '、' +
            this.$t('material_abbreviation') +
            '、' +
            this.$t('material_brand')
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
      @click.native="
        warning = true
        deletemode = 1
      "
      icon="trash-alt"
      style="padding:0.5rem"
    ></mdb-btn>
    <!-- 下載範例-->
    <mdb-btn
      v-if="customize1"
      size="sm"
      color="indigo"
      @click="downloadsample()"
      icon="file-excel"
      style="padding:0.5rem"
      >{{ $t('material_example') }}</mdb-btn
    >
    <!-- 匯入 -->
    <input
      id="fileUpload"
      type="file"
      ref="upload"
      accept=".xls, .xlsx"
      class="outputlist_upload"
      hidden
    />
    <mdb-btn
      v-if="customize1"
      size="sm"
      color="indigo"
      icon="file-import"
      @click="importfile()"
      style="padding:0.5rem"
      type="file"
      >{{ $t('material_import') }}</mdb-btn
    >
    <b-table
      class="materialpctableclass"
      no-border-collapse
      sticky-header="590px"
      id="pc"
      :busy="isbusy"
      fixed
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
        <mdb-btn size="sm" @click="moldwindow(row.item, row.index, 'edit')" style="padding:5px"
          >編輯</mdb-btn
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

    <mdb-modal centered :show="importmodal" @close="importmodal = false">
      <mdb-modal-header>
        <mdb-modal-title>{{ $t('import_success') }}</mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body>
        <b-row style="text-align:center;">
          <b-col>{{ $t('import_success_text') }} :</b-col>
          <b-col>{{ importsuccess }}</b-col>
          <b-col></b-col>
        </b-row>
        <b-row style="text-align:center;">
          <b-col>{{ $t('import_error_text') }} :</b-col>
          <b-col>{{ importfail }}</b-col>
          <b-col></b-col>
        </b-row>
        <b-row style="text-align:center;">
          <b-col>{{ $t('import_duplicated') }} :</b-col>
          <b-col>{{ importrepeat }}</b-col>
          <b-col></b-col>
        </b-row>
      </mdb-modal-body>
      <mdb-modal-footer>
        <mdb-btn color="0000" @click.native="importmodal = false">{{ $t('close') }}</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
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
    <mdb-modal :show="modal" @close="closemodal($event)" size="lg">
      <form v-on:submit.prevent="submitfunc">
        <mdb-modal-header>
          <mdb-modal-title>{{ operate }} {{ $t('material') }}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <div>
            <b-row>
              <b-col>
                <mdb-input :show="modal" class="mb-3" required v-model="materialobject.number">
                  <span class="input-group-text" slot="prepend">
                    <span class="requileclass">*</span>
                    {{ $t('material_number') }}
                  </span>
                </mdb-input>
              </b-col>
              <b-col>
                <mdb-input class="mb-3" required v-model="materialobject.name">
                  <span class="input-group-text" slot="prepend">
                    <span class="requileclass">*</span>
                    {{ $t('material_name') }}
                  </span>
                </mdb-input>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <div class="input-group">
                  <mdb-input class="mb-3" required v-model="materialobject.abbreviation">
                    <span class="input-group-text" slot="prepend">
                      <span class="requileclass">*</span>
                      {{ $t('material_abbreviation') }}
                    </span>
                  </mdb-input>
                </div>
              </b-col>
              <b-col>
                <div class="input-group">
                  <mdb-input class="mb-3" required v-model="materialobject.brand">
                    <span class="input-group-text" slot="prepend">
                      <span class="requileclass">*</span>
                      {{ $t('material_brand') }}
                    </span>
                  </mdb-input>
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <label class="input-group-text" for="inputGroupSelect01">
                      {{ $t('material_machine') }}
                    </label>
                  </div>
                  <b-form-select
                    required
                    v-model="materialobject.materialType"
                    :options="materialTypeoption"
                  ></b-form-select>
                </div>
              </b-col>
              <b-col></b-col>
            </b-row>
            <b-row>
              <b-col></b-col>
            </b-row>
            <mdb-btn
              color="mdb-color"
              @click.native="detialdisplay()"
              type="button"
              style="padding:0.35rem"
              :icon="editbtnicon"
            ></mdb-btn>

            <div v-if="deitdetial">
              <b-row>
                <b-col>
                  <mdb-input class="mb-3" v-model="materialobject.specificGravity" type="number">
                    <span class="input-group-text" slot="prepend">
                      {{ $t('material_specific_gravity') }}
                    </span>
                  </mdb-input>
                </b-col>
                <b-col>
                  <mdb-input class="mb-3" v-model="materialobject.specificHeat" type="number">
                    <span class="input-group-text" slot="prepend">
                      {{ $t('material_specific_heat') }}
                    </span>
                  </mdb-input>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <mdb-input
                    class="mb-3"
                    v-model="materialobject.waterAbsorptionRate"
                    type="number"
                  >
                    <span class="input-group-text" slot="prepend">
                      {{ $t('material_water_absorption_rate') }}
                    </span>
                  </mdb-input>
                </b-col>
                <b-col>
                  <mdb-input class="mb-3" v-model="materialobject.shrinkRate" type="number">
                    <span class="input-group-text" slot="prepend">
                      {{ $t('material_shrink_rate') }}
                    </span>
                  </mdb-input>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <mdb-input
                    class="mb-3"
                    v-model="materialobject.heatTransferCoefficient"
                    type="number"
                  >
                    <span class="input-group-text" slot="prepend">
                      {{ $t('material_heat_transfer_coefficient') }}
                    </span>
                  </mdb-input>
                </b-col>
                <b-col>
                  <mdb-input class="mb-3" v-model="materialobject.meltFlowIndex" type="number">
                    <span class="input-group-text" slot="prepend">
                      {{ $t('material_melt_flow_index') }}
                    </span>
                  </mdb-input>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <mdb-input class="mb-3" v-model="materialobject.flowLengthRatio" type="number">
                    <span class="input-group-text" slot="prepend">
                      {{ $t('material_flow_length_ratio') }}
                    </span>
                  </mdb-input>
                </b-col>
                <b-col>
                  <mdb-input class="mb-3" v-model="materialobject.transmittance" type="number">
                    <span class="input-group-text" slot="prepend">
                      {{ $t('material_transmittance') }}
                    </span>
                  </mdb-input>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <mdb-input
                    class="mb-3"
                    v-model="materialobject.heatDeflectionTemperature"
                    type="number"
                  >
                    <span class="input-group-text" slot="prepend">
                      {{ $t('material_heat_deflection_temperature') }}
                    </span>
                  </mdb-input>
                </b-col>
                <b-col>
                  <mdb-input class="mb-3" v-model="materialobject.heatTolerance" type="number">
                    <span class="input-group-text" slot="prepend">
                      {{ $t('material_heat_tolerance') }}
                    </span>
                  </mdb-input>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <mdb-input
                    class="mb-3"
                    v-model="materialobject.glassTransitionTemperature"
                    type="number"
                  >
                    <span class="input-group-text" slot="prepend">
                      {{ $t('material_glass_transition_temperature') }}
                    </span>
                  </mdb-input>
                </b-col>
                <b-col></b-col>
              </b-row>
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
  </div>
</template>

<script>
import { MaterialAPI, MaterialmultideleteAPI } from '@/plugins/basicapis.js'
import naturalCompare from 'string-natural-compare'
import { mapState } from 'vuex'

import XLSX from 'xlsx'
export default {
  props: ['meterialData'],
  watch: {
    meterialData: function(newVal) {
      var temparray = JSON.parse(JSON.stringify(newVal))
      if (newVal != null) {
        this.totalRows = newVal.length
        temparray.sort((a, b) => naturalCompare(a.number, b.number))
        this.tabledata = temparray
      } else {
        this.tabledata = []
        this.totalRows = 0
      }

      this.isbusy = false
      this.setfooternum() //設定頁數
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
    var materialobject = {
      Id: 0,
      name: '',
      number: '',
      abbreviation: '',
      specificGravity: 0,
      specificHeat: 0,
      waterAbsorptionRate: 0,
      shrinkRate: 0,
      heatTransferCoefficient: 0,
      meltFlowIndex: 0,
      flowLengthRatio: 0,
      transmittance: 0,
      heatDeflectionTemperature: 0,
      heatTolerance: 0,
      glassTransitionTemperature: 0,
      materialTypeId: 0,
      meterialtypeselect: 1,
      materialType: 1,
      brand: ''
    }
    var materialobjectnull = JSON.parse(JSON.stringify(materialobject))

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
      importsuccess: 0,
      importfail: 0,
      importrepeat: 0,
      deleteitem: 0,
      deletemode: 0,
      editbtnicon: 'chevron-down',
      materialTypeoption: [
        { text: this.$t('machine_material_type_general'), value: 1 },
        { text: this.$t('machine_material_type_transparent'), value: 2 },
        { text: this.$t('machine_material_type_black'), value: 3 },
        { text: this.$t('machine_material_type_white'), value: 4 },
        { text: this.$t('machine_material_type_fiber'), value: 5 },
        { text: 'PVC', value: 6 },
        { text: 'LSR', value: 7 },
        { text: this.$t('machine_material_type_other'), value: 8 }
      ],
      deitdetial: false,
      testvalue: 0,
      deletebundisable: true,
      selected: [],
      materialobject,
      materialobjectnull,
      operate: '',
      importmodal: false, //匯入訊息
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
          key: 'number',
          label: this.$t('material_number'), //'原料編號',
          sortable: true,
          sortDirection: 'desc',
          class: 'text-center',
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'name',
          label: this.$t('material_name'), //'原料型號',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'abbreviation',
          label: this.$t('material_abbreviation'), //'原料簡稱',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'brand',
          label: this.$t('material_brand'), //'原料品牌',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'materialType',
          label: this.$t('material_machine'), //'綁定設備',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            switch (value) {
              case 0:
                value = '-'
                break
              case 1:
                value = this.$t('machine_material_type_general')
                break
              case 2:
                value = this.$t('machine_material_type_transparent')
                break
              case 3:
                value = this.$t('machine_material_type_black')
                break
              case 4:
                value = this.$t('machine_material_type_white')
                break
              case 5:
                value = this.$t('machine_material_type_fiber')
                break
              case 6:
                value = 'PVC'
                break
              case 7:
                value = 'LSR'
                break
              case 8:
                value = this.$t('machine_material_type_other')
                break
            }
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },

        {
          key: 'actions',
          label: this.$t('operating'),
          class: 'text-center',
          thStyle: 'width: 150px;',
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
      filterOn: ['number', 'name', 'abbreviation', 'brand'],
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
    //綁定監聽表格導入事件
    this.$refs.upload.addEventListener('change', e => {
      this.readExcel(e)
    })
  },
  created() {
    this.iniright()
    // this.getdata()
  },

  methods: {
    //設定權限
    iniright() {
      this.authority.forEach(item => {
        if (item.name == 'basicsetting_material') {
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

    //匯入forloop call API
    callmaterialapi(data) {
      if (data != null) {
        var total = data.length
        this.importsuccess = 0
        this.importfail = 0
        data.forEach(item => {
          var access_token_val = this.$cookies.get('access_token')
          MaterialAPI.post(JSON.stringify(item), {
            headers: {
              access_token: access_token_val
            }
          }).then(
            () => {
              this.importsuccess++
              if (this.importfail + this.importsuccess == total) {
                this.importmodal = true //開啟視窗
                // 重載資料
                this.$emit('callparent', 1) //呼叫父元件
              }
            },
            error => {
              console.log(error.response)
              this.$layer.msg(this.$t('fail') + error.response.data.response)
              this.importfail++
              if (this.importfail + this.importsuccess == total) {
                this.importmodal = true //開啟視窗
                // 重載資料
                this.$emit('callparent', 1) //呼叫父元件
              }
            }
          )
        })
      }
    },
    //檢查undefind
    checkundefind(value, num) {
      if (value == undefined) {
        if (num == 1) {
          return ''
        } else if (num == 2) {
          return 0
        }
      } else {
        return value
      }
    },
    //處理匯入資料
    checkuploaddata(data) {
      var inputarray = []
      var tempobject = JSON.parse(JSON.stringify(this.materialobject))
      if (data != null) {
        data.forEach(item => {
          tempobject = JSON.parse(JSON.stringify(this.materialobject))
          tempobject.number = this.checkundefind(item.number, 1) //原料編號
          tempobject.name = this.checkundefind(item.name, 1) //原料型號(名稱)
          tempobject.abbreviation = this.checkundefind(item.abbreviation, 1) //原料簡稱
          tempobject.brand = this.checkundefind(item.brand, 1) //原料簡稱
          tempobject.materialType = 1 //原料品牌綁定設備
          tempobject.specificGravity = this.checkundefind(item.specificGravity, 2) //比重
          tempobject.specificHeat = this.checkundefind(item.specificHeat, 2) //比熱
          tempobject.waterAbsorptionRate = this.checkundefind(item.waterAbsorptionRate, 2) //吸水率
          tempobject.shrinkRate = this.checkundefind(item.shrinkRate, 2) //收縮率
          tempobject.heatTransferCoefficient = this.checkundefind(
            item.heatTransferCoefficientmeltFlowIndex,
            2
          ) //熱傳導係數
          tempobject.meltFlowIndex = this.checkundefind(item.meltFlowIndex, 2) //熔融指數
          tempobject.flowLengthRatio = this.checkundefind(item.flowLengthRatio, 2) //流長比
          tempobject.transmittance = this.checkundefind(item.transmittance, 2) //穿透率
          tempobject.heatDeflectionTemperature = this.checkundefind(
            item.heatDeflectionTemperature,
            2
          ) //熱變形溫度
          tempobject.heatTolerance = this.checkundefind(item.heatTolerance, 2) //耐熱度
          tempobject.glassTransitionTemperature = this.checkundefind(
            item.glassTransitionTemperature,
            2
          ) //玻璃轉移點
          inputarray.push(tempobject)
        })
      }
      inputarray = inputarray.slice(1, inputarray.length)
      var arr = []
      this.importrepeat = 0
      //去重複number
      for (var i = 0; i < inputarray.length; i++) {
        if (i == 0) arr.push(inputarray[i])
        let b = false
        if (arr.length > 0 && i > 0) {
          for (var j = 0; j < arr.length; j++) {
            if (arr[j].number == inputarray[i].number) {
              this.importrepeat++
              b = true
              //break;
            }
          }
          if (!b) {
            arr.push(inputarray[i])
          }
        }
      }

      this.callmaterialapi(arr)
    },
    readExcel(e) {
      //表格导入
      var that = this
      const files = e.target.files
      if (files.length <= 0) {
        //如果没有文件名
        return false
      } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
        this.$Message.error('上传格式不正确，请上传xls或者xlsx格式')
        return false
      }

      const fileReader = new FileReader()
      fileReader.onload = ev => {
        try {
          const data = ev.target.result
          const workbook = XLSX.read(data, {
            type: 'binary'
          })
          const wsname = workbook.SheetNames[0] //取第一张表
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]) //生成json表格内容
          this.uploadjson = ws
          this.checkuploaddata(this.uploadjson)
          that.outputs = [] //清空接收数据
          //编辑数据
          for (var i = 0; i < ws.length; i++) {
            var sheetData = {
              address: ws[i].addr,
              value: ws[i].value
            }
            that.outputs.push(sheetData)
          }
          this.$refs.upload.value = ''
        } catch (e) {
          return false
        }
      }
      fileReader.readAsBinaryString(files[0])
    },
    //點擊匯入
    importfile() {
      document.getElementById('fileUpload').click()
    },
    //下載範例
    downloadsample() {
      let link = document.createElement('a')
      link.download = 'IoM_Material_Template'
      link.style.display = 'none'
      link.href = '/excelfile/IoM_Material_Template.xls'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    //顯示/隱藏編輯詳細
    detialdisplay() {
      this.deitdetial = !this.deitdetial
      if (this.deitdetial) {
        this.editbtnicon = 'chevron-up'
      } else {
        this.editbtnicon = 'chevron-down'
      }
    },
    //modal背景點擊不關閉
    closemodal(value) {
      if (value == undefined) {
        this.modal = false
      }
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
      } else {
        this.newwindow()
      }
      this.modal = true
    },
    //編輯
    editwindow(item) {
      this.materialobject = JSON.parse(JSON.stringify(item))
    },
    newwindow() {
      this.materialobject = JSON.parse(JSON.stringify(this.materialobjectnull))
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
      this.materialobject.Id = this.checkisnull(this.materialobject.Id)
      ;(this.materialobject.specificGravity = this.checkisnull(
        this.materialobject.specificGravity
      )),
        (this.materialobject.specificHeat = this.checkisnull(this.materialobject.specificHeat)),
        (this.materialobject.waterAbsorptionRate = this.checkisnull(
          this.materialobject.waterAbsorptionRate
        )),
        (this.materialobject.shrinkRate = this.checkisnull(this.materialobject.shrinkRate)),
        (this.materialobject.heatTransferCoefficient = this.checkisnull(
          this.materialobject.heatTransferCoefficient
        )),
        (this.materialobject.meltFlowIndex = this.checkisnull(this.materialobject.meltFlowIndex)),
        (this.materialobject.flowLengthRatio = this.checkisnull(
          this.materialobject.flowLengthRatio
        )),
        (this.materialobject.transmittance = this.checkisnull(this.materialobject.transmittance)),
        (this.materialobject.heatDeflectionTemperature = this.checkisnull(
          this.materialobject.heatDeflectionTemperature
        )),
        (this.materialobject.heatTolerance = this.checkisnull(this.materialobject.heatTolerance)),
        (this.materialobject.glassTransitionTemperature = this.checkisnull(
          this.materialobject.glassTransitionTemperature
        )),
        (this.materialobject.materialTypeId = this.checkisnull(this.materialobject.materialTypeId))
    },
    // 送出
    submitfunc() {
      this.dealdata()
      var access_token_val = this.$cookies.get('access_token')

      if (this.materialobject.Id == '') {
        MaterialAPI.post(JSON.stringify(this.materialobject), {
          headers: {
            access_token: access_token_val
          }
        }).then(
          () => {
            // 重載資料
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
      } else {
        MaterialAPI.put(JSON.stringify(this.materialobject), {
          headers: {
            access_token: access_token_val
          }
        }).then(
          () => {
            // 重載資料
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
    // 刪除
    deletemold() {
      var access_token_val = this.$cookies.get('access_token')
      //多選刪除
      if (this.deletemode == 1) {
        MaterialmultideleteAPI.delete({
          headers: {
            access_token: access_token_val,
            ids: this.selectedArrayToString(this.selected)
          }
        }).then(
          () => {
            // 重載資料
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

        //單選刪除
      } else {
        MaterialAPI.delete({
          headers: {
            access_token: access_token_val,
            id: this.deleteitem
          }
        }).then(
          () => {
            // 重載資料
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
.materialpctableclass {
  max-height: calc(100vh - 346px) !important;
}
.operateclass {
  text-align: center;
  width: 150px;
}
.moldnumberclass {
  max-width: 30px;
  text-align: center;
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
