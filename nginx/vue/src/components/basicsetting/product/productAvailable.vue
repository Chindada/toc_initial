<template>
  <div>
    <!-- <div class="mx-3">
      <h2>一般</h2>
    </div>-->

    <b-col lg="16" class="my-1">
      <mdb-input
        style="width:50%"
        v-model="filter"
        type="search"
        id="filterInput"
        :placeholder="
          this.$t('product_number') + '、' + this.$t('product_name') + '、' + this.$t('mold_number')
        "
      >
        <span class="input-group-text" slot="prepend">{{ $t('search') }}</span>

        <!-- <mdb-btn size="sm" color="primary" :disabled="!filter" @click="filter = ''">清除</mdb-btn> -->
      </mdb-input>
    </b-col>
    <!-- 新增 -->
    <mdb-btn
      v-if="availbleshow && newbtm"
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
    <!-- 新增群組 -->
    <!-- <mdb-btn
      v-if="availbleshow"
      size="sm"
      color="cyan"
      @click="setproductgroup()"
      icon="file-export"
      style="padding:0.5rem"
      >新增群組
    </mdb-btn> -->
    <!-- 匯出 -->
    <mdb-btn
      v-if="availbleshow && customize1"
      size="sm"
      color="cyan"
      @click="downExcel()"
      icon="file-export"
      style="padding:0.5rem"
    >
    </mdb-btn>
    <!-- 下載範例-->
    <mdb-btn
      v-if="availbleshow && customize1"
      size="sm"
      color="indigo"
      @click="downloadsample()"
      icon="file-excel"
      style="padding:0.5rem"
      >{{ $t('product_example') }}</mdb-btn
    >
    <!-- 匯入 -->
    <input
      id="fileUpload"
      type="file"
      ref="upload"
      accept=".xls,.xlsx"
      class="outputlist_upload"
      hidden
    />
    <mdb-btn
      v-if="availbleshow && customize1"
      size="sm"
      color="indigo"
      icon="file-import"
      @click="importfile()"
      style="padding:0.5rem"
      type="file"
      >{{ $t('product_import') }}</mdb-btn
    >

    <b-table
      class="productpctableclass"
      no-border-collapse
      sticky-header="590px"
      id="pc"
      :busy="isbusy"
      ref="selectableTable"
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
          <strong> Loading...</strong>
        </div>
      </template>
      <template v-slot:cell(numberserial)="row" class="col-sm-3">{{ row.index }}</template>
      <!-- <template v-slot:cell(name)="row">{{ row.value }}</template> -->
      <!--<template v-slot:cell(checkbox)="row">
            <b-form-checkbox></b-form-checkbox>
      </template>-->

      <template v-slot:cell(actions)="row">
        <!-- <b-button size="sm" @click="moldwindow(row.item, row.index, 'edit')"
          >編輯</b-button
        > -->
        <div class="controlgrid" style="width:141px">
          <!-- 編輯 -->
          <mdb-btn
            v-if="editbtm"
            color="mdb-color"
            @click="moldwindow(row.item, row.index, 'edit')"
            type="button"
            style="padding:0.1rem; "
            icon="pencil-alt"
          ></mdb-btn>

          <!-- 複製 -->
          <mdb-btn
            v-if="availbleshow && newbtm"
            color="mdb-color"
            @click.native="copynewitemfunc(row.item)"
            type="button"
            style="padding:0.1rem; "
            icon="copy"
          ></mdb-btn>

          <!-- 停用 -->
          <mdb-btn
            v-if="(availbleshow || abnormalshow) && customize3"
            color="mdb-color"
            @click="disableitemfunc(row.item, 1)"
            type="button"
            style="padding:0.1rem; "
            icon="ban"
          ></mdb-btn>

          <!-- 啟用 -->
          <mdb-btn
            v-if="disableshow && customize3"
            color="mdb-color"
            @click="disableitemfunc(row.item, 0)"
            type="button"
            style="padding:0.1rem; "
            icon="check"
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
            style="padding:0.1rem; "
            icon="trash-alt"
          ></mdb-btn>
          <mdb-btn style="width: 0px;padding: 0.1rem 0px;" icon="trash-alt"></mdb-btn
          ><!-- 固定欄高 -->
        </div>
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
        <b-button size="sm" @click="row.toggleDetails">{{ row.detailsShowing ? '隱藏' : '顯示' }} 詳細</b-button>
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
    <!-- ------------------------------------------------------------------------- -->
    <mdb-modal size="lg" :show="importfilemodal" @close="closemodal($event)">
      <mdb-modal-header>
        <mdb-modal-title>{{ $t('import_error_text') }}{{ errortotal }}</mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body>
        <b-table
          style="max-height:500px"
          responsive
          show-empty
          bordered
          sticky-header
          :hover="true"
          :items="errortabledata"
          :fields="errorfields"
          :filterIncludedFields="filterOn"
          :sort-by.sync="sortBy"
          sort-desc.sync="asc"
          :sort-direction="sortDirection"
        >
        </b-table>
      </mdb-modal-body>
      <mdb-modal-footer style="justify-content: space-between">
        <span style="width:300px"
          ><div>
            <b-row
              ><b-col>1:{{ $t('product_import_error1') }}</b-col
              ><b-col>2:{{ $t('product_import_error2') }}</b-col></b-row
            >
          </div>
          <div>
            <b-row
              ><b-col>3:{{ $t('product_import_error3') }}</b-col
              ><b-col>4:{{ $t('product_import_error4') }}</b-col></b-row
            >
          </div></span
        >
        <!-- <mdb-btn color="info" @click="stillsubmit()">略過並匯入</mdb-btn> -->
        <mdb-btn
          color="danger"
          @click.native="importfilemodal = false"
          type="button"
          style="float:right"
          >{{ $t('cancel_import') }}</mdb-btn
        >
      </mdb-modal-footer>
    </mdb-modal>
    <!--  <div :key="index" v-for="(member, index) in sameimportdata">
          <b-row style="text-align:center;">
            <b-col cols="2" class="importerrorborder"> {{ member.index + 3 }}</b-col>
            <b-col cols="5" class="importerrorborder">{{ member.number }}</b-col>
            <b-col cols="5" class="importerrorborder"> {{ member.name }}</b-col>
          </b-row>
        </div> -->

    <!-- ------------------------------------------------------------------------- -->
    <mdb-modal centered :show="importmodal" @close="importmodal = false">
      <mdb-modal-header>
        <mdb-modal-title>{{ $t('import_success') }}</mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body>
        <b-row style="text-align:center;">
          <b-col>{{ $t('import_success_text') }} : </b-col>
          <b-col>{{ importsuccess }}</b-col>
          <b-col></b-col>
        </b-row>
      </mdb-modal-body>
      <mdb-modal-footer>
        <mdb-btn color="0000" @click.native="importmodal = false">{{ $t('close') }}</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
    <mdb-modal centered :show="loadingmodal" @close="closemodal($event)">
      <mdb-modal-body><div style="text-align:center">Loading....</div></mdb-modal-body>
    </mdb-modal>
    <mdb-modal centered :show="disableitem" @close="disableitem = false">
      <mdb-modal-header>
        <mdb-modal-title>{{ $t('confirm_title') }}</mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body
        ><div style="text-align:center">
          {{ $t('confirm_text1') }} {{ disabletype }} {{ $t('confirm_text2') }}
        </div></mdb-modal-body
      >
      <mdb-modal-footer>
        <span>{{ errormes }}</span>
        <mdb-btn color="info" v-on:click="submitfunc('activedisable')">{{ disabletype }}</mdb-btn>
        <mdb-btn color="0000" @click.native="disableitem = false">{{ $t('close') }}</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
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
    <mdb-modal :show="neweditmodal" @close="closemodal($event)" size="lg">
      <form v-on:submit.prevent="submitfunc">
        <mdb-modal-header>
          <mdb-modal-title>{{ operate }} {{ $t('product') }}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <div>
            <b-row>
              <b-col>
                <mdb-input
                  :show="neweditmodal"
                  class="mb-3"
                  v-model="productobject.number"
                  required
                >
                  <span class="input-group-text" slot="prepend">
                    <span class="requileclass">*</span>{{ $t('product_number') }}
                  </span>
                </mdb-input>
              </b-col>
              <b-col>
                <mdb-input class="mb-3" required v-model="productobject.name">
                  <span class="input-group-text" slot="prepend">
                    <span class="requileclass">*</span>{{ $t('product_name') }}
                  </span>
                </mdb-input>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <div style="margin-bottom: 1rem" class="input-group">
                  <div class="input-group-prepend">
                    <label class="input-group-text" for="inputGroupSelect01">
                      <span class="requileclass">*</span>{{ $t('mold_number') }}
                    </label>
                  </div>
                  <div class="form-control selsect">
                    <model-select
                      required
                      :isError="selectmolderrorfalg"
                      v-model="selectmoldid"
                      :options="basicOptions"
                      :placeholder="this.$t('product_mold_placeholder')"
                    >
                    </model-select>
                  </div>
                </div>
              </b-col>
              <b-col>
                <div class="input-group ">
                  <div class="input-group-prepend">
                    <label class="input-group-text" for="inputGroupSelect01">
                      <span class="requileclass">*</span>{{ $t('mold_cavity') }}
                    </label>
                  </div>
                  <div class="form-control selsect">
                    <mdb-select
                      required
                      :selectAllPlaceholder="this.$t('select_all')"
                      multiple
                      search
                      selectAll
                      @getValue="cavityonChange"
                      :options="cavityNumbers"
                    />
                  </div>
                </div>
              </b-col>
              <!-- +++++++++++++++++++++++++++++++++++++++++++++++++++ -->
            </b-row>

            <b-row>
              <b-col>
                <div class="input-group" style="margin-bottom: 1rem">
                  <div class="input-group-prepend">
                    <label class="input-group-text" for="inputGroupSelect01">
                      <span class="requileclass">*</span>{{ $t('material') }}
                    </label>
                  </div>
                  <div class="form-control selsect">
                    <model-select
                      :isError="selectmaterialerrorfalg"
                      v-model="productobject.materialId"
                      :options="materialOptions"
                      :placeholder="this.$t('product_material_placeholder')"
                    ></model-select>
                  </div>
                </div>
              </b-col>
              <b-col> </b-col>
            </b-row>
            <!-- -------------------------------------------------------------- -->
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
                  <mdb-input class="mb-3" v-model="productobject.additive">
                    <span class="input-group-text" slot="prepend">{{
                      $t('product_material_remark')
                    }}</span>
                  </mdb-input>
                </b-col>
                <b-col>
                  <mdb-input class="mb-3" type="Text" :min="0" v-model="productobject.remark">
                    <span class="input-group-text" slot="prepend">{{
                      $t('product_mold_remark')
                    }}</span>
                  </mdb-input>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <mdb-input
                    class="mb-3"
                    v-model="productobject.yieldRate"
                    type="number"
                    :min="0"
                    :max="100"
                  >
                    <span class="input-group-text" slot="prepend">{{
                      $t('product_yieldrate')
                    }}</span>
                  </mdb-input>
                </b-col>

                <b-col>
                  <mdb-input class="mb-3" v-model="productobject.weight">
                    <span class="input-group-text" slot="prepend">{{ $t('product_weight') }}</span>
                  </mdb-input>
                </b-col>
              </b-row>
              <mdb-input
                :placeholder="this.$t('length')"
                type="number"
                :min="0"
                v-model="productobject.length"
              >
                <span class="input-group-text" slot="prepend">{{ $t('product_length') }}</span>
                <mdb-input
                  noWrapper
                  :placeholder="this.$t('width')"
                  type="number"
                  :min="0"
                  v-model="productobject.width"
                />
                <mdb-input
                  noWrapper
                  :placeholder="this.$t('height')"
                  type="number"
                  :min="0"
                  v-model="productobject.height"
                />
              </mdb-input>
              <mdb-input
                aria-label="First name"
                :placeholder="this.$t('average_thickness')"
                type="number"
                :min="0.1"
                :max="100"
                step="any"
                v-model="productobject.averageThickness"
              >
                <span class="input-group-text" slot="prepend">{{
                  $t('product_averageThickness')
                }}</span>
                <mdb-input
                  noWrapper
                  aria-label="Last name"
                  :placeholder="this.$t('max_thickness')"
                  type="number"
                  :min="0.1"
                  :max="100"
                  step="any"
                  v-model="productobject.maxThickness"
                />
              </mdb-input>
            </div>
            <!-- -------------------------------------------------------------- -->
          </div>
        </mdb-modal-body>
        <mdb-modal-footer>
          <mdb-btn color="info" type="submit">{{ $t('submit') }}</mdb-btn>
          <mdb-btn color="0000" @click.native="neweditmodal = false" type="button">{{
            $t('close')
          }}</mdb-btn>
        </mdb-modal-footer>
      </form>
    </mdb-modal>
  </div>
</template>

<script>
import {
  ProductAPI,
  // MoldAPI,
  gmaterialSelectAPI,
  Moldisassociated,
  SystemSettingMultiAPI,
  ImportProductAPI,
  ProductmultideleteAPI
} from '@/plugins/basicapis.js'
import { ModelSelect } from 'vue-search-select'
import { mapState } from 'vuex'
import naturalCompare from 'string-natural-compare'
import XLSX from 'xlsx'
export default {
  props: ['productData', 'tabs'],

  watch: {
    selectmoldid: function() {
      this.onChange(this.selectmoldid)
    },
    tabs: function(value) {
      this.tabvalue = value
      switch (value) {
        case 'availble':
          this.classification(this.alldata, 1)
          break
        case 'abnormal':
          this.classification(this.alldata, 2)
          break
        case 'disable':
          this.classification(this.alldata, 3)
          break
      }
    },
    productData: function(newVal) {
      var temparray = JSON.parse(JSON.stringify(newVal))
      if (newVal != null) {
        temparray.sort((a, b) => naturalCompare(a.number, b.number))
      }

      this.alldata = temparray
      switch (this.tabvalue) {
        case '':
          this.classification(this.alldata, 1)
          break
        case 'availble':
          this.classification(this.alldata, 1)
          break
        case 'abnormal':
          this.classification(this.alldata, 2)
          break
        case 'disable':
          this.classification(this.alldata, 3)
          break
      }
    },
    currentPage: function() {
      this.setfooternum() //設定頁數
    },
    perPage: function() {
      this.setfooternum() //設定頁數
    }
  },
  components: {
    ModelSelect
  },
  data() {
    var moldobject = {
      id: 0,
      name: '',
      number: '',
      cavityNumber: 0
    }
    var moldobjectarray = []
    var productobject = {
      id: 0,
      name: '',
      number: '',
      materialId: 0,
      weight: null,
      length: null,
      width: null,
      height: null,
      remark: '',
      additive: '',
      averageThickness: null,
      maxThickness: null,
      moldId: 0,
      moldCavityNumbers: [],
      yieldRate: 100
    }
    var productobjectnull = JSON.parse(JSON.stringify(productobject))

    return {
      errormes: '', //錯誤訊息
      page_first: 0, //第一條
      page_last: 0, //最後一筆
      page_total: 0, //總共筆數
      selectmaterialerrorfalg: false, //新增原料錯誤flag
      selectmolderrorfalg: false, //新增模具錯誤flag
      isbusy: true,
      newbtm: false, //新增
      editbtm: false, //編輯
      deletebtm: false, //刪除
      customize1: false, //自定義一
      customize2: false, //自定義二
      customize3: false, //自定義三
      errortotal: 0, //錯誤筆數
      stillsubmitdata: [], //掠過匯入
      errortabledata: [], //錯誤匯入資料
      postfix_p1: '',
      postfix_p2: '',
      disabletype: this.$t('disable'), //停用/啟用
      availbleshow: false, //一般顯示
      abnormalshow: false, //待維護顯示
      disableshow: false, //停用顯示
      alldata: [], //製品全部資料
      tabvalue: '', //模式
      importsuccess: 0, //成功
      importtotal: 0, //去重複總數
      importfail: 0, //失敗
      importrepeat: 0, //重複數量
      importtabledata: [],
      importmodal: false, //匯入成功
      importfilemodal: false, //匯入失敗modal
      loadingmodal: false, //匯入等待
      excelData: [],
      disableitem: false,
      deleteitem: 0,
      deletemode: 0,
      editbtnicon: 'chevron-down',
      deitdetial: false,
      selectmoldid: 0,
      cavityNumbervalue: null,
      deletebundisable: true,
      moldobject,
      moldobjectarray,
      selected: [],
      productobject,
      productobjectnull,
      operate: '',
      warning: false,
      neweditmodal: false,
      tabledata: [], //table資料
      errorfields: [
        {
          key: 'index',
          label: '列', //'列',
          sortable: true,
          sortDirection: 'desc',
          class: 'text-center'
        },
        {
          key: 'number',
          label: this.$t('product_number'), //'製品編號',
          sortable: true,
          sortDirection: 'desc',
          class: 'text-center'
        },
        {
          key: 'moldNumber',
          label: '模具編號', //'模具編號',
          sortable: true,
          sortDirection: 'desc',
          class: 'text-center'
        },
        {
          key: 'moldCavityNumbers',
          label: '模穴', //'模穴',
          sortDirection: 'desc',
          class: 'text-center',
          formatter: (value, row, index) => {
            if (value == null && index.all == true) {
              return 'all'
            } else if (value == null && index.all == false) {
              return ''
            }
            var tempstring = ''
            value.forEach(item => {
              tempstring += item.cavityNumber + ','
            })
            tempstring = tempstring.substring(0, tempstring.length - 1)
            return tempstring
          }
        },
        {
          key: 'materialNumber',
          label: '原料編號', //'原料編號',
          sortable: true,
          sortDirection: 'desc',
          class: 'text-center'
        },
        {
          key: 'errorMsgs',
          label: '錯誤', //'錯誤',
          sortable: true,
          sortDirection: 'desc',
          class: 'text-center',
          formatter: value => {
            var tempstring = ''
            value.forEach(item => {
              tempstring += item + ','
            })
            tempstring = tempstring.substring(0, tempstring.length - 1)
            return tempstring
          }
        }
      ],
      fields: [
        {
          key: 'number',
          label: this.$t('product_number'), //'製品編號',
          sortable: true,
          sortDirection: 'desc',
          class: 'text-center',
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'name',
          label: this.$t('product_name'), //'製品名稱',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'moldNumber',
          label: this.$t('mold_number'), //'模具編號',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            if (value == '') {
              return '-'
            }
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'weight',
          label: this.$t('product_weight'), //'重量(g)',
          sortable: true,
          class: 'text-center ',
          formatter: value => {
            return this.showifzero(value)
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'length',
          label: this.$t('product_length'), //'尺寸(長/寬/高,mm)',
          sortable: true,
          class: 'text-center',
          formatter: (value, index, index1) => {
            return (
              this.showifzero(value) +
              ' / ' +
              this.showifzero(index1.width) +
              ' / ' +
              this.showifzero(index1.height)
            )
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'averageThickness',
          label: this.$t('product_averageThickness'), //'肉厚(平均/最大,mm)',
          sortable: true,
          class: 'text-center',
          formatter: (value, index, index1) => {
            return this.showifzero(value) + ' / ' + this.showifzero(index1.maxThickness)
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
      filterOn: ['number', 'name', 'moldNumber'],
      infoModal: {
        id: 'info-modal',
        title: '',
        content: ''
      },
      basicOptions: [],
      materialOptions: [],
      cavityNumbers: []
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
    this.$refs.upload.addEventListener('change', e => {
      //綁定監聽表格導入事件
      this.readExcel(e)
    })
  },
  created() {
    this.iniright()
    // this.getdata()
    this.getsystemsetting()
  },
  methods: {
    events(value) {
      console.log(value)
    },

    //設定權限
    iniright() {
      this.authority.forEach(item => {
        if (item.name == 'basicsetting_product') {
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
    //取得系統設定
    getsystemsetting() {
      var access_token_val = this.$cookies.get('access_token')
      SystemSettingMultiAPI.get({
        headers: {
          access_token: access_token_val,
          parameters: '["postfix_p1","postfix_p2"]'
        }
      }).then(
        res => {
          this.postfix_p1 = res.data[0].value
          this.postfix_p2 = res.data[1].value
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    classification(alldata, mode) {
      this.excelData = []
      var temparray = []
      switch (mode) {
        case 1: //一般
          this.availbleshow = true //一般顯示
          this.abnormalshow = false //待維護顯示
          this.disableshow = false //停用顯示
          if (alldata != null) {
            alldata.forEach(item => {
              if (item.materialId != 0 && item.moldId != 0 && item.moldCavityNumbers != null) {
                if (item.status != 1) {
                  temparray.push(item)
                  this.setexcelData(item)
                }
              }
            })
          }
          break
        case 2: //待維護
          this.availbleshow = false //一般顯示
          this.abnormalshow = true //待維護顯示
          this.disableshow = false //停用顯示
          if (alldata != null) {
            alldata.forEach(item => {
              if (
                (item.materialId == 0 || item.moldId == 0 || item.moldCavityNumbers == null) &&
                item.status != 1
              ) {
                temparray.push(item)
              }
            })
          }
          break
        case 3: //停用
          this.availbleshow = false //一般顯示
          this.abnormalshow = false //待維護顯示
          this.disableshow = true //停用顯示
          if (alldata != null) {
            alldata.forEach(item => {
              if (item.status == 1) {
                temparray.push(item)
              }
            })
          }
          break
      }

      if (temparray != null) {
        this.tabledata = temparray
        this.totalRows = temparray.length
      } else {
        this.tabledata = []
        this.totalRows = 0
      }
      this.setfooternum()
      this.isbusy = false
    },
    //設定匯出資料
    setexcelData(item) {
      var teampitem
      teampitem = JSON.parse(JSON.stringify(item))
      if (teampitem.moldCavityNumbers == 0) {
        teampitem.moldCavityNumbers = 'All'
      } else {
        teampitem.moldCavityNumbers = '#' + teampitem.moldCavityNumbers
      }
      this.excelData.push(teampitem)
    },
    //設定製品群
    setproductgroup() {
      this.clearSelected()
    },
    //處理匯入模穴
    dealmoldCavityNumbers(value, porductNum) {
      var temparray = []
      if (value != '') {
        if (typeof value != 'number') {
          value = value.toLowerCase()
          if (value != 'all') {
            //正常轉模穴
            var array = value.split(',')
            var tempset = new Set()
            array.forEach(item => {
              if (
                item != '' && //非空值
                !isNaN(parseInt(item)) && //整數
                Number.isInteger(parseInt(item)) && //數字
                parseInt(item) > 0 //大於0
              ) {
                tempset.add(parseInt(item))
              }
            })
            tempset.forEach(item => {
              var numtemp = porductNum + this.postfix_p1 //製品名稱+postfix1
              if (this.postfix_p2 == 1) {
                numtemp += item //+模穴數
              }
              temparray.push({
                cavityNumber: item,
                id: 0,
                number: numtemp,
                productId: 0
              })
            })
            return temparray
          } else {
            //ALL
            return null
          }
        } else {
          //正常轉模穴
          var numtemp = porductNum + this.postfix_p1 //製品名稱+postfix1
          if (this.postfix_p2 == 1) {
            numtemp += value //+模穴數
          }
          temparray.push({ cavityNumber: value, id: 0, number: numtemp, productId: 0 })
          return temparray
        }
      }
    },
    //處理匯入資料
    checkuploaddata(data) {
      this.importtabledata = []
      var tempimporttabledata = []
      var tempobject = JSON.parse(JSON.stringify(this.productobjectnull))
      if (data != null) {
        data = data.slice(1, data.length)
        data.forEach((item, index) => {
          tempobject = JSON.parse(JSON.stringify(this.productobjectnull))
          tempobject.index = index + 3
          tempobject.color = 'successclass'
          tempobject.name = this.checkifundefine(item.name, '') //製品名稱
          tempobject.number = this.checkifundefine(item.number, '') //製品編號
          tempobject.moldNumber = this.checkNumberToString(
            this.checkifundefine(item.moldNumber, '')
          ) //模具編號
          tempobject.moldCavityNumbers = this.dealmoldCavityNumbers(
            this.checkifundefine(item.moldCavityNumber, ''),
            tempobject.number
          ) //模穴
          if (typeof item.moldCavityNumber != 'number') {
            if (item.moldCavityNumber != undefined) {
              var temp = item.moldCavityNumber.toLowerCase()
              tempobject.all = temp == 'all'
            } else {
              tempobject.all = false
            }
          }
          tempobject.materialNumber = this.checkNumberToString(
            this.checkifundefine(item.materialNumber, '')
          ) //原料編號
          tempobject.additive = this.numberstring(this.checkifundefine(item.additive, '')) //原料備註
          tempobject.remark = this.numberstring(this.checkifundefine(item.remark, '')) //模具備註
          tempobject.yieldRate = this.checkifundefine(item.yieldRate, 100) //良率
          tempobject.weight = this.checkifundefine(item.weight, 0) //重量
          tempobject.length = this.checkifundefine(item.length, 0) //尺寸長度
          tempobject.width = this.checkifundefine(item.width, 0) //尺寸寬度
          tempobject.height = this.checkifundefine(item.height, 0) //尺寸高度
          tempobject.averageThickness = this.checkifundefine(item.averageThickness, 0) //平均肉厚
          tempobject.maxThickness = this.checkifundefine(item.maxThickness, 0) //最大肉厚
          tempobject.status = 0
          tempimporttabledata.push(tempobject)
        })
      }
      this.importtabledata = tempimporttabledata
      if (this.importtabledata != null) {
        // this.importgetmaterial()
        this.submitimputfunc() //送出
      } else {
        this.$layer.msg(this.$t('fail') + '空')
      }
    },
    checkifundefine(value, def) {
      if (value == undefined) {
        return def
      } else {
        return value
      }
    },
    //原料備註模具備註number轉string
    numberstring(value) {
      if (typeof value == 'string') {
        return value
      }
      if (typeof value == 'number') {
        return String(value)
      }
    },

    readExcel(e) {
      //表格导入
      var that = this
      const files = e.target.files
      if (files.length <= 0) {
        //如果没有文件名
        return false
      } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
        this.$Message.error('上傳格式不正確，請上傳xls或者xlsx格式')
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

    //點擊匯入
    importfile() {
      document.getElementById('fileUpload').click()
    },
    //下載範例
    downloadsample() {
      let link = document.createElement('a')
      link.download = 'IoM_Part_Template'
      link.style.display = 'none'
      link.href = '/excelfile/IoM_Part_Template.xls'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    //匯出xlsx
    downExcel() {
      const th = [
        'name',
        'number',
        'moldNumber',
        'moldCavityNumbers',
        'materialNumber',
        'additive',
        'remark',
        'yieldRate',
        'weight',
        'length',
        'width',
        'height',
        'averageThickness',
        'maxThickness'
      ]
      const filterVal = [
        'name',
        'number',
        'moldNumber',
        'moldCavityNumbers',
        'materialNumber',
        'additive',
        'remark',
        'yieldRate',
        'weight',
        'length',
        'width',
        'height',
        'averageThickness',
        'maxThickness'
      ]
      const data = this.excelData.map(v => filterVal.map(k => v[k]))
      const [fileName, fileType, sheetName] = ['製品匯出', 'xlsx', '製品']
      this.$toExcel({ th, data, fileName, fileType, sheetName })
    },
    showifzero(value) {
      return value == 0 ? '-' : value
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
        this.neweditmodal = false
        this.importfilemodal = false
      }
    },
    //取得原料
    getmaterial(item) {
      this.materialOptions = [] //清空模具選項
      var access_token_val = this.$cookies.get('access_token')
      gmaterialSelectAPI({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          if (res.data != null) {
            /*********模具排序***** */
            res.data.sort((a, b) => naturalCompare(a.number, b.number))
            /****************** */
            res.data.forEach(item => {
              this.materialOptions.push({
                text: item.number,
                value: item.id
              })
            })
          }

          if (item != undefined) {
            // this.cavityNumbervalue = item.moldCavityNumbers //設定模穴v-mold
            this.onChange(item.moldId, item)
          }
          this.neweditmodal = true //顯示視窗
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
    moldwindow(item, index, mode) {
      if (mode == 'edit') {
        this.operate = this.$t('edit')
      } else if (mode == 'new') {
        this.operate = this.$t('new')
      }

      if (mode == 'edit') {
        this.editwindow(item) //附值
        this.getmold(item) //取得選擇模具
      } else {
        this.newwindow() //附空值
        this.getmold() //取得模具
      }
    },
    //停用1///啟用0
    disableitemfunc(item, mode) {
      this.errormes = ''
      if (mode == 0) {
        this.disabletype = this.$t('actvite')
      } else {
        this.disabletype = this.$t('disable')
      }
      this.productobject = JSON.parse(JSON.stringify(item))

      this.disableitem = true
    },

    //複製
    copynewitemfunc(item) {
      this.operate = this.$t('new')
      this.getmold(item) //取得選擇模具
      this.productobject = JSON.parse(JSON.stringify(item))
      this.productobject.id = 0
    },
    //編輯
    editwindow(item) {
      this.productobject = JSON.parse(JSON.stringify(item))
    },
    //新增
    newwindow() {
      this.productobject = JSON.parse(JSON.stringify(this.productobjectnull))
    },
    //模穴改變
    cavityonChange(value) {
      this.cavityNumbervalue = value
    },
    //選擇模具改變模穴
    onChange(event, editdata) {
      this.cavityNumbers = []
      this.cavityNumbers.push({
        text: this.$t('product_select_cavity'), //'選擇模穴',
        value: null,
        disabled: true,
        selected: true
      })
      this.cavityNumbervalue = []
      //編輯帶入資料
      if (editdata != undefined) {
        this.moldobjectarray.forEach(item => {
          if (event == item.id) {
            for (var i = 1; i < item.cavityNumber + 1; i++) {
              var valueselected = this.checkifselect(i, editdata.moldCavityNumbers)
              var temp = {}
              temp.text = '#' + i
              temp.value = i
              temp.selected = valueselected
              this.cavityNumbers.push(temp)
              if (valueselected) {
                this.cavityNumbervalue.push(i)
              }
            }
          }
        })
      } else {
        this.moldobjectarray.forEach(item => {
          if (event == item.id) {
            //新增
            for (var i = 1; i < item.cavityNumber + 1; i++) {
              var temp = {}
              temp.text = '#' + i
              temp.value = i
              this.cavityNumbers.push(temp)
            }
          }
        })
      }
    },
    checkifselect(cavnum, cavnumdata) {
      var selected = false
      if (cavnumdata != null) {
        cavnumdata.forEach(item => {
          if (item.cavityNumber == cavnum) {
            selected = true
          }
        })
      }

      return selected
    },
    //取得模具
    getmold(item) {
      this.basicOptions = [] //清空模具選項
      this.cavityNumbers = [
        {
          text: this.$t('product_select_cavity'), //'選擇模穴',
          value: null,
          disabled: true,
          selected: true
        }
      ] //清空模穴選項

      var access_token_val = this.$cookies.get('access_token')
      Moldisassociated({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          // this.basicOptions.push({
          //   text: '選擇模具',
          //   value: null,
          //   disabled: true,
          //   selected: true
          // })
          this.moldobjectarray = []
          if (res.data != null) {
            /*********模具排序***** */
            res.data.sort((a, b) => naturalCompare(a.number, b.number))
            /****************** */
            res.data.forEach(item => {
              this.basicOptions.push({
                text: item.number,
                value: item.id
              })

              var moldobject = {}
              moldobject.id = item.id
              moldobject.name = item.name
              moldobject.number = item.number
              moldobject.cavityNumber = item.cavityNumber

              this.moldobjectarray.push(moldobject)
            })
            if (item == undefined) {
              //新增
              this.selectmoldid = 0 //設定模具v-mold
              this.cavityNumbervalue = null //設定模穴v-mold
              this.getmaterial() //取得原料
            } else {
              //編輯
              this.selectmoldid = item.moldId //設定模具v-mold

              if (item.moldId == 0) {
                this.cavityNumbervalue = null
              }

              this.getmaterial(item) //取得原料
            }
          } else {
            this.getmaterial() //取得原料
          }
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
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
    //checkifnumber
    checkifnumber(value) {
      if (typeof value == 'number') {
        value = value.toString()
      }
      return value
    },
    //處理匯入送出
    submitimputfunc() {
      if (this.importtabledata != null) {
        this.importsuccess = 0
        this.importtotal = this.importtabledata.length
        this.importfail = 0
        this.importtabledata.forEach(item => {
          item.name = this.checkifnumber(item.name)
          item.number = this.checkifnumber(item.number)
        })
        this.callapisubmitfunc(this.importtabledata)
      }
    },
    // 匯入送出
    callapisubmitfunc(data) {
      this.importfilemodal = false
      this.loadingmodal = true
      var access_token_val = this.$cookies.get('access_token')
      ImportProductAPI.post(JSON.stringify(data), {
        headers: {
          access_token: access_token_val,
          multi: 'true'
        }
      }).then(
        () => {
          this.importsuccess = data.length
          this.loadingmodal = false
          this.importmodal = true
          // this.$layer.msg(this.$t('scuccess'))
          // 重載資料
          this.$emit('callparent', 1) //呼叫父元件
        },
        error => {
          this.loadingmodal = false

          this.$layer.msg(this.$t('fail') + error.response.data.response)
          console.log(error.response)
          this.findsamedata(error.response.data.errorData)
          // 重載資料
          // this.$emit('callparent', 1) //呼叫父元件
        }
      )
    },
    //顯示錯誤，排除錯誤array
    findsamedata(data) {
      data.forEach(item => {
        item._cellVariants = {}
        item.errorMsgs.forEach(erritem => {
          switch (erritem) {
            case 1: //模穴不存在
              item._cellVariants.moldCavityNumbers = 'danger'
              break
            case 2: //模具不存在
              item._cellVariants.moldNumber = 'danger'
              break
            case 3: //原料不存在
              item._cellVariants.materialNumber = 'danger'
              break
            case 4: //製品編號已存在
              item._cellVariants.number = 'danger'
              break
          }
        })
      })
      this.errortotal = data.length
      this.errortabledata = data
      this.importfilemodal = true
    },
    sortItem(x, y) {
      return x.index == y.index ? 0 : x.index > y.index ? 1 : -1
    },
    stillsubmit() {
      this.callapisubmitfunc(this.stillsubmitdata)
    },
    dealdata(value) {
      this.productobject.weight = this.checkisnull(this.productobject.weight)
      this.productobject.length = this.checkisnull(this.productobject.length)
      this.productobject.width = this.checkisnull(this.productobject.width)
      this.productobject.height = this.checkisnull(this.productobject.height)
      this.productobject.averageThickness = this.checkisnull(this.productobject.averageThickness)
      this.productobject.maxThickness = this.checkisnull(this.productobject.maxThickness)
      this.productobject.yieldRate = this.checkisnull(this.productobject.yieldRate)

      var temparray = []
      if (this.cavityNumbervalue != null) {
        if (this.cavityNumbervalue[0] != null) {
          this.cavityNumbervalue.forEach(item => {
            var tempnumber = this.productobject.number + this.postfix_p1
            if (this.postfix_p2 == '1') {
              tempnumber += item
            }
            temparray.push({ cavityNumber: item, number: tempnumber })
          })
        }
      }
      var selectflag = false
      //  selectmaterialerrorfalg: false, //新增模具編號錯誤flag
      // selectmolderrorfalg: false, //新增原料錯誤flag

      if (value != 'activedisable') {
        this.productobject.moldId = this.selectmoldid
        this.productobject.materialId = this.checkisnull(this.productobject.materialId)
      }

      if (this.productobject.moldId == 0) {
        //模具未選擇
        this.selectmolderrorfalg = true
        selectflag = true
      } else {
        this.selectmolderrorfalg = false
      }
      if (this.productobject.materialId == 0) {
        //原料未選擇
        this.selectmaterialerrorfalg = true
        selectflag = true
      } else {
        this.selectmaterialerrorfalg = false
      }

      this.productobject.moldCavityNumbers = temparray
      return selectflag
    },
    // 送出
    submitfunc(value) {
      let errorflag = true
      if (value == 'activedisable') {
        //改變狀態
        if (this.productobject.status == 0) {
          this.productobject.status = 1
        } else {
          this.productobject.status = 0
        }
        //啟用停用
        if (this.productobject.status == 0) {
          //啟用檢查
          errorflag = this.dealdata('activedisable')
          if (errorflag) {
            //資料未完善
            this.errormes = this.$t('data_not_complete')
          }
        } else {
          //停用不檢查
          this.disableitem = false
          errorflag = false
        }
      } else {
        errorflag = this.dealdata()
      }
      if (!errorflag) {
        this.disableitem = false
        var access_token_val = this.$cookies.get('access_token')

        //新增
        if (this.productobject.id == 0) {
          this.productobject.moldId = this.checkisnull(this.selectmoldid)
          // this.productobject.moldCavityNumbers = this.checkisnull(this.cavityNumbervalue)
          ProductAPI.post(JSON.stringify(this.productobject), {
            headers: {
              access_token: access_token_val
            }
          }).then(
            () => {
              // 重載資料
              this.$emit('callparent', 1) //呼叫父元件
              this.$layer.msg(this.$t('scuccess'))
              this.neweditmodal = false
              this.disableitem = false
              this.isbusy = true
              this.errormes = ''
            },
            error => {
              console.log(error.response)
              this.$layer.msg(this.$t('fail') + error.response.data.response)
              this.neweditmodal = false
              this.disableitem = false
              this.errormes = ''
            }
          )
          //編輯
        } else {
          ProductAPI.put(JSON.stringify(this.productobject), {
            headers: {
              access_token: access_token_val
            }
          }).then(
            () => {
              // 重載資料
              this.$emit('callparent', 1) //呼叫父元件
              this.$layer.msg(this.$t('scuccess'))
              this.neweditmodal = false
              this.disableitem = false
              this.isbusy = true
            },
            error => {
              console.log(error.response)
              this.disableitem = false
              this.$layer.msg(this.$t('fail') + error.response.data.response)
              this.neweditmodal = false
            }
          )
        }
      }
    },
    // ProductmultideleteAPI
    // 刪除
    deletemold() {
      var access_token_val = this.$cookies.get('access_token')
      if (this.deletemode == 1) {
        ProductmultideleteAPI.delete({
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
            this.isbusy = true
          },
          error => {
            console.log(error.response)
            this.$layer.msg(this.$t('fail') + error.response.data.response)
            this.modal = false
          }
        )
      } else {
        ProductAPI.delete({
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
            this.isbusy = true
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
    selectAllRows() {
      this.$refs.selectableTable.selectAllRows()
    },
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
.productpctableclass {
  max-height: calc(100vh - 346px) !important;
}
</style>
<style scoped>
.controlgrid {
  justify-items: center;
  margin: 0px auto;
  display: grid;
  grid-template-columns: 35px 35px 35px 35px 1px;
}
.ui.selection.dropdown {
  border: 0px !important;
}
.importerrorborder {
  border: 1px black solid;
}
</style>
<style>
.form-control.selsect {
  padding: 0;
}

.errorclass {
  background-color: red;
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
@media (max-width: 1250px) {
  .controlgrid {
    justify-items: center;
    margin: auto !important;
    display: grid !important;
    grid-template-columns: 50px 50px !important;
  }
}
</style>
