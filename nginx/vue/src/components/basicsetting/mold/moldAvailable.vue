<template>
  <div>
    <!-- <div class="mx-3">
      <h2>一般</h2>
      <h2>{{ authority }}</h2>
    </div>-->

    <b-col lg="16" class="my-1">
      <mdb-input
        style="width:50%"
        v-model="filter"
        type="search"
        id="filterInput"
        :placeholder="
          this.$t('mold_number') +
            '、' +
            this.$t('mold_name') +
            '、' +
            this.$t('mold_product_model') +
            '、' +
            this.$t('clientName') +
            '、' +
            this.$t('remark')
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

    <!-- 下載模具範例-->
    <mdb-btn
      v-if="availbleshow && customize1"
      size="sm"
      color="indigo"
      @click="downloadmoldmachinesample(2)"
      icon="file-excel"
      style="padding:0.5rem"
      >{{ $t('mold_example') }}</mdb-btn
    >
    <!-- 匯入模具 -->
    <!--  <input
      id="fileUpload"
      type="file"
      ref="upload"
      accept=".xls,.xlsx"
      class="outputlist_upload"
      hidden
    />-->
    <mdb-btn
      v-if="availbleshow && customize1"
      size="sm"
      color="indigo"
      icon="file-import"
      @click="importmoldmachinefile()"
      style="padding:0.5rem"
      type="file"
      >{{ $t('mold_import') }}</mdb-btn
    >
    <!-- 下載模具設備範例-->
    <mdb-btn
      v-if="availbleshow && customize1"
      size="sm"
      color="indigo"
      @click="downloadmoldmachinesample(1)"
      icon="file-excel"
      style="padding:0.5rem"
      >{{ $t('mold_rel_example') }}</mdb-btn
    >
    <!-- 匯入模具設備 -->
    <input
      id="fileUpload"
      type="file"
      ref="upload"
      accept=".xls, .xlsx"
      class="outputlist_upload"
      hidden
    />
    <mdb-btn
      v-if="availbleshow && customize1"
      size="sm"
      color="indigo"
      icon="file-import"
      @click="importmoldmachinefile()"
      style="padding:0.5rem"
      type="file"
      >{{ $t('mold_rel_import') }}</mdb-btn
    >
    <b-table
      class="moldpctableclass"
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
      <!--<template v-slot:cell(checkbox)="row">
            <b-form-checkbox></b-form-checkbox>
      </template>-->

      <template v-slot:cell(actions)="row">
        <div class="controlgrid" style="width:141px">
          <!-- 編輯 -->
          <mdb-btn
            v-if="editbtm"
            color="mdb-color"
            @click="moldwindow(row.item, row.index, 'edit')"
            type="button"
            style="padding:0.1rem"
            icon="pencil-alt"
          ></mdb-btn>
          <!-- 複製 -->
          <mdb-btn
            v-if="availbleshow && newbtm"
            color="mdb-color"
            @click.native="copynewitemfunc(row.item)"
            type="button"
            style="padding:0.1rem"
            icon="copy"
          ></mdb-btn>
          <!-- 停用 -->
          <mdb-btn
            v-if="(availbleshow || abnormalshow) && customize3"
            color="mdb-color"
            @click="disableitemfunc(row.item, 1)"
            @click.native="disableitem = true"
            type="button"
            style="padding:0.1rem"
            icon="ban"
          ></mdb-btn>
          <!-- 啟用 -->
          <mdb-btn
            v-if="disableshow && customize3"
            color="mdb-color"
            @click="disableitemfunc(row.item, 3)"
            @click.native="disableitem = true"
            type="button"
            style="padding:0.1rem"
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
            style="padding:0.1rem"
            icon="trash-alt"
          ></mdb-btn>
          <mdb-btn style="width: 0px;padding: 0.1rem 0px;" icon="trash-alt"></mdb-btn>
          <!-- 固定欄高 -->
        </div>
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
    <!-- ------------------------------------------------------------------------- -->
    <mdb-modal centered :show="importmoldmachinemodal" @close="importmoldmachinemodal = false">
      <mdb-modal-header>
        <mdb-modal-title>{{ $t('mold_rel_import') }}{{ $t('fail') }}</mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body>
        <b-row style="text-align:center;">
          <b-col>{{ errmes }}</b-col>
        </b-row>
        <!-- <div :key="index" v-for="(member, index) in importtabledata">
          <b-row style="text-align:center;" :class="member.colorclass">
            <b-col> {{ member.mold }}</b-col>
            <b-col>{{ member.machine }}</b-col>
          </b-row>
        </div>-->
      </mdb-modal-body>
      <mdb-modal-footer>
        <mdb-btn color="0000" @click.native="importmoldmachinemodal = false" type="button">
          {{ $t('close') }}
        </mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>

    <mdb-modal
      centered
      :show="importmoldmachinemodalsuccess"
      @close="importmoldmachinemodalsuccess = false"
    >
      <mdb-modal-header>
        <mdb-modal-title>{{ $t('scuccess') }}</mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body>
        <b-row style="text-align:center;">
          <b-col>{{ $t('scuccess') }} :</b-col>
          <b-col>{{ importsuccess }}</b-col>
          <b-col>筆</b-col>
        </b-row>
        <b-row style="text-align:center;">
          <b-col>{{ $t('fail') }} :</b-col>
          <b-col>{{ importfail }}</b-col>
          <b-col>筆</b-col>
        </b-row>
        <!-- <div :key="index" v-for="(member, index) in importtabledata">
          <b-row style="text-align:center;" :class="member.colorclass">
            <b-col> {{ member.mold }}</b-col>
            <b-col>{{ member.machine }}</b-col>
          </b-row>
        </div>-->
      </mdb-modal-body>
      <mdb-modal-footer>
        <mdb-btn color="0000" @click.native="importmoldmachinemodalsuccess = false" type="button">
          {{ $t('close') }}
        </mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>

    <!-- ------------------------------------------------------------------------- -->

    <mdb-modal centered :show="disableitem" @close="disableitem = false">
      <mdb-modal-header>
        <mdb-modal-title>{{ $t('confirm_title') }}</mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body>
        <div style="text-align:center">
          {{ $t('confirm_text1') }} {{ disabletype }} {{ $t('confirm_text2') }}
        </div>
      </mdb-modal-body>
      <mdb-modal-footer>
        <mdb-btn color="info" v-on:click="submitfunc()" @click.native="disableitem = false">
          {{ disabletype }}
        </mdb-btn>
        <mdb-btn color="0000" @click.native="disableitem = false">{{ $t('close') }}</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
    <mdb-modal centered :show="importmodal" @close="importmodal = false">
      <mdb-modal-header>
        <mdb-modal-title>{{ $t('import_error_text') }}</mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body>
        <div>{{ importmodalerrormes }}</div>
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
        <span style="color:red">{{ errormes }}</span>
        <mdb-btn color="info" v-on:click="deletemold()" @click.native="warning = false">
          {{ $t('delete') }}
        </mdb-btn>
        <mdb-btn color="0000" @click.native="warning = false">{{ $t('close') }}</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
    <mdb-modal :show="neweditmodal" @close="closemodal($event)" size="lg">
      <form v-on:submit.prevent="submitfunc">
        <mdb-modal-header>
          <mdb-modal-title>{{ operate }} {{ $t('mold') }}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <div>
            <b-row>
              <b-col>
                <mdb-input :show="neweditmodal" class="mb-3" required v-model="moldobject.number">
                  <span class="input-group-text" slot="prepend">
                    <span class="requileclass">*</span>
                    {{ $t('mold_number') }}
                  </span>
                </mdb-input>
              </b-col>
              <b-col>
                <mdb-input class="mb-3" required v-model="moldobject.name">
                  <span class="input-group-text" slot="prepend">
                    <span class="requileclass">*</span>
                    {{ $t('mold_name') }}
                  </span>
                </mdb-input>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <!-- <mdb-input
                  class="mb-3"
                  required
                  type="number"
                  :min="1"
                  @input="CTisValidcheck(moldobject.cycleTime)"
                  @focus="focus($event)"
                  v-model="moldobject.cycleTime"
                  oninvalid="wlalalala"
                >
                  <span class="input-group-text" slot="prepend">
                    <span class="requileclass">*</span>
                    {{ $t('mold_cycletime') }}
                  </span>
                </mdb-input>-->
                <div class="input-group" style="margin-bottom: 1rem">
                  <div class="input-group-prepend">
                    <label class="input-group-text" for="inputGroupSelect01">
                      <span class="requileclass">*</span>
                      {{ $t('mold_cycletime') }}
                    </label>
                  </div>
                  <input
                    class="form-control"
                    required
                    type="number"
                    :min="1"
                    :step="0.1"
                    @focus="focus($event)"
                    v-model="moldobject.cycleTime"
                  />
                </div>
              </b-col>
              <b-col>
                <!-- <mdb-input
                  class="mb-3"
                  required
                  type="number"
                  :min="0"
                  v-model="moldobject.cavityNumber"
                >
                  <span class="input-group-text" slot="prepend">
                    <span class="requileclass">*</span>
                    {{ $t('mold_cavity_number') }}
                  </span>
                </mdb-input>-->
                <div class="input-group" style="margin-bottom: 1rem">
                  <div class="input-group-prepend">
                    <label class="input-group-text" for="inputGroupSelect01">
                      <span class="requileclass">*</span>
                      {{ $t('mold_cavity_number') }}
                    </label>
                  </div>
                  <input
                    class="form-control"
                    required
                    type="number"
                    :min="1"
                    @focus="focus($event)"
                    v-model="moldobject.cavityNumber"
                  />
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <mdb-input class="mb-3" v-model="moldobject.productModel">
                  <span class="input-group-text" slot="prepend">
                    {{ $t('mold_product_model') }}
                  </span>
                </mdb-input>
              </b-col>
              <b-col>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <label class="input-group-text" for="inputGroupSelect01">{{
                      $t('mold_machine')
                    }}</label>
                  </div>
                  <div class="form-control selsect">
                    <mdb-select
                      :selectAllPlaceholder="this.$t('select_all')"
                      multiple
                      search
                      selectAll
                      @getValue="onChange"
                      :options="basicmachineOptions"
                    />
                  </div>
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <mdb-input :show="neweditmodal" class="mb-3" v-model="moldobject.remark">
                  <span class="input-group-text" slot="prepend">{{ $t('remark') }}</span>
                </mdb-input>
              </b-col>
              <b-col>
                <mdb-input class="mb-3" v-model="moldobject.clientName">
                  <span class="input-group-text" slot="prepend">{{ $t('clientName') }}</span>
                </mdb-input>
              </b-col>
            </b-row>
            <mdb-btn
              color="mdb-color"
              @click.native="detialdisplay()"
              type="button"
              style="padding:0.35rem"
              :icon="editbtnicon"
            ></mdb-btn>
            <div v-if="deitdetial">
              <!-- ---------------------------------------- -->
              <mdb-input
                :placeholder="this.$t('mold_up_time')"
                type="number"
                :min="0"
                v-model="moldobject.upTime"
              >
                <span class="input-group-text" slot="prepend">
                  {{ $t('mold_updown_time_title') }}
                </span>
                <mdb-input
                  noWrapper
                  :placeholder="this.$t('mold_down_time')"
                  type="number"
                  :min="0"
                  v-model="moldobject.downTime"
                />
              </mdb-input>
              <mdb-input
                :placeholder="this.$t('length')"
                type="number"
                :min="0"
                v-model="moldobject.height"
              >
                <span class="input-group-text" slot="prepend">{{ $t('mold_length_title') }}</span>
                <mdb-input
                  noWrapper
                  :placeholder="this.$t('width')"
                  type="number"
                  :min="0"
                  v-model="moldobject.width"
                />
              </mdb-input>
              <mdb-input
                aria-label="Last name"
                :placeholder="this.$t('mold_fixed_thickness')"
                type="number"
                :min="0"
                v-model="moldobject.fixedMoldThickness"
              >
                <span class="input-group-text" slot="prepend">
                  {{ $t('mold_thickness_title') }}
                </span>
                <mdb-input
                  noWrapper
                  aria-label="First name"
                  :placeholder="this.$t('mold_movable_thickness')"
                  type="number"
                  :min="0"
                  v-model="moldobject.movableMoldThickness"
                />
              </mdb-input>
              <mdb-input class="mb-3" v-model="moldobject.moldStroke">
                <span class="input-group-text" slot="prepend">{{ $t('mold_stroke_title') }}</span>
              </mdb-input>
              <mdb-input
                :placeholder="this.$t('mold_cold_running_weight')"
                type="number"
                :min="0"
                v-model="moldobject.coldRunningWeight"
              >
                <span class="input-group-text" slot="prepend">
                  {{ $t('mold_coldhot_running_title') }}
                </span>
                <mdb-input
                  noWrapper
                  :placeholder="this.$t('mold_hot_running_weight')"
                  type="number"
                  :min="0"
                  v-model="moldobject.hotRunningWeight"
                />
              </mdb-input>
              <mdb-input class="mb-3" v-model="moldobject.coldRunningMaxDiameter">
                <span class="input-group-text" slot="prepend">
                  {{ $t('mold_cold_running_max_diameter') }}
                </span>
              </mdb-input>
              <b-row>
                <b-col>
                  <mdb-input
                    class="mb-3"
                    v-model="moldobject.greenRange"
                    @change="greenRangeChange()"
                    type="number"
                    :step="0.1"
                    :min="0"
                    :max="0.9"
                    required
                  >
                    <span class="input-group-text" slot="prepend">
                      <span class="requileclass">*</span>
                      {{ $t('mold_green_range') }}
                    </span>
                  </mdb-input>
                </b-col>
                <b-col>
                  <mdb-input
                    class="mb-3"
                    @change="yellowRangeChange()"
                    v-model="moldobject.yellowRange"
                    type="number"
                    :step="0.1"
                    :min="moldobject.greenRange"
                    :max="0.9"
                    required
                  >
                    <span class="input-group-text" slot="prepend">
                      <span class="requileclass">*</span>
                      {{ $t('mold_yellow_range') }}
                    </span>
                  </mdb-input>
                </b-col>
              </b-row>
            </div>
            <!-- ----------------------------------- -->
          </div>
        </mdb-modal-body>
        <mdb-modal-footer>
          <span style="color:red">{{ errormes }}</span>
          <mdb-btn color="info" type="submit">{{ $t('submit') }}</mdb-btn>
          <mdb-btn color="0000" @click.native="neweditmodal = false" type="button">
            {{ $t('close') }}
          </mdb-btn>
        </mdb-modal-footer>
      </form>
    </mdb-modal>
  </div>
</template>

<script>
import {
  MoldAPI,
  gmachineSelectAPI,
  MoldImportAPI,
  MoldmultideleteAPI
} from '@/plugins/basicapis.js'
import naturalCompare from 'string-natural-compare'
import { mapState } from 'vuex'
import XLSX from 'xlsx'
export default {
  props: ['moldData', 'tabs'],
  watch: {
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
    moldData: function(newVal) {
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
  components: {},
  data() {
    var moldobject = {
      id: 0,
      name: '',
      number: '',
      manufactureDate: 0,
      height: '',
      width: '',
      movableMoldThickness: '',
      fixedMoldThickness: '',
      cavityNumber: '',
      productType: '',
      coldRunningWeight: '',
      hotRunningWeight: '',
      moldStroke: '',
      coldRunningMaxDiameter: '',
      companyId: 0,
      lastUpdateTime: 0,
      greenRange: 0.1,
      yellowRange: 0.2,
      cycleTime: '60',
      upTime: 60,
      downTime: 30,
      machineData: [],
      status: 0,
      remark: '', //備註
      clientName: '' //'客戶名稱'
    }

    var moldobjectnull = JSON.parse(JSON.stringify(moldobject))
    return {
      page_first: 0, //第一條
      page_last: 0, //最後一筆
      page_total: 0, //總共筆數
      CTisValidflag: true, //週期時間flag
      errormes: '', //錯誤訊息
      importmodalerrormes: '', //匯入錯誤mes
      isbusy: true,
      newbtm: false, //新增
      editbtm: false, //編輯
      deletebtm: false, //刪除
      customize1: false, //自定義一
      customize2: false, //自定義二
      customize3: false, //自定義三
      alldata: [], //模具全部資料
      disabletype: this.$t('disable'), //停用/啟用
      availbleshow: false, //一般顯示
      abnormalshow: false, //待維護顯示
      disableshow: false, //停用顯示
      tabvalue: '', //模式
      submitdata: [],
      importrepeat: 0,
      importsuccess: 0,
      importfail: 0,
      importtotal: 0,
      errmes: '',
      moldmachineiIdarray: [], //模具設備關聯id陣列
      allmold: [], //全部模具
      importmodal: false, //匯入模具匯入成功modal
      importmoldmachinemodalsuccess: false, //匯入關聯成功modal
      importmoldmachinemodal: false, //匯入關聯modal
      disableitem: false,
      deleteitem: 0,
      deletemode: 0,
      editbtnicon: 'chevron-down',
      deitdetialtext: '',
      deitdetial: false,
      machineselected: [],
      basicmachineOptions: [],
      selectmachineid: [null],
      deletebundisable: true,
      selected: [],
      moldobject,
      moldobjectnull,
      operate: '',
      warning: false,
      neweditmodal: false,
      tabledata: [],
      fields: [
        // {
        //   key: "numberserial",
        //   label: "序號",
        //   class: "moldnumberclass"
        // },
        {
          key: 'number',
          label: this.$t('mold_number'), //'模具編號',
          sortable: true,
          sortDirection: 'desc',
          class: 'text-center',
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'name',
          label: this.$t('mold_name'), //'模具名稱',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'productModel',
          label: this.$t('mold_product_model'), //'機種',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'clientName',
          label: this.$t('clientName'), //'客戶名稱',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'cavityNumber',
          label: this.$t('mold_cavity_number'), //'模穴數',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return this.showifzero(value)
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'cycleTime',
          label: this.$t('mold_cycletime'), //'週期時間(s)',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return this.showifzero(value)
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'upTime',
          label: this.$t('mold_updown_time_title'), //'換模時間(上模/下模 ,min)',
          sortable: true,
          class: 'text-center test',
          formatter: (value, index, index1) => {
            return this.showifzero(value) + '/' + this.showifzero(index1.downTime)
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'machineAvailable',
          label: this.$t('machine'), //'設備',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            if (!value) {
              value = this.$t('un_assigned') //'未分配'
            } else {
              value = this.$t('is_assigned') //'已分配'
            }

            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'remark',
          label: this.$t('remark'), //'備註',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle remarkstyle'
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
      filterOn: ['number', 'name', 'remark', 'clientName', 'productModel'],
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
    this.$refs.upload.addEventListener('change', e => {
      //綁定監聽表格導入事件
      this.readExcel(e)
    })
  },
  created() {
    this.iniright()
  },
  methods: {
    //設定權限
    iniright() {
      this.authority.forEach(item => {
        if (item.name == 'basicsetting_mold') {
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
    //檢查週期時間
    CTisValidcheck(data) {
      // if (data <= 0) {
      console.log(data)
      //   this.moldobject.cycleTime = ''
      // }
    },
    classification(alldata, mode) {
      var temparray = []
      switch (mode) {
        case 1:
          this.availbleshow = true //一般顯示
          this.abnormalshow = false //待維護顯示
          this.disableshow = false //停用顯示
          if (alldata != null) {
            alldata.forEach(item => {
              this.allmold.push(item) //取得所有設備
              if (item.machineAvailable) {
                if (item.status == 0) {
                  temparray.push(item)
                }
              }
            })
          }
          break
        case 2:
          this.availbleshow = false //一般顯示
          this.abnormalshow = true //待維護顯示
          this.disableshow = false //停用顯示
          if (alldata != null) {
            alldata.forEach(item => {
              if (!item.machineAvailable) {
                if (item.status != 1) {
                  temparray.push(item)
                }
              }
            })
          }
          break
        case 3:
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

    //送出關聯資料
    callmoldmachineapi(data) {
      this.basicmachineOptions = []
      this.basicmachineOptions.push({
        text: this.$t('select_machine'), //'選擇設備',
        value: null,
        disabled: true
      })
      var access_token_val = this.$cookies.get('access_token')
      MoldImportAPI.put(JSON.stringify(data), {
        headers: {
          access_token: access_token_val
        }
      }).then(
        () => {
          // 重載資料
          this.$emit('callparent', 1) //呼叫父元件
          this.$layer.msg(this.$t('scuccess'))
          this.importfilemodal = false
        },
        error => {
          console.log(error.response)
          this.errmes = error
          this.importmoldmachinemodal = true
        }
      )
    },
    //點選反白
    focus(event) {
      event.currentTarget.select()
    },
    //取得關聯設備
    getallmachine(data) {
      this.basicmachineOptions = []
      this.basicmachineOptions.push({
        text: this.$t('select_machine'), //'選擇設備',
        value: null,
        disabled: true
      })
      var access_token_val = this.$cookies.get('access_token')
      gmachineSelectAPI({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          var success = 0
          var fail = 0
          if (res.data != null) {
            var tempobject = { moldId: 0, machineId: 0 }
            data.forEach(item => {
              tempobject = { moldId: 0, machineId: 0 } //恢復預設

              //關聯模具id
              for (var i = 0; i < this.allmold.length; i++) {
                if (item.moldnumber == this.allmold[i].number) {
                  tempobject.moldId = this.allmold[i].id
                  break
                }
              }
              //關聯設備id
              for (var j = 0; j < res.data.length; j++) {
                if (item.machinenumber == res.data[j].machineNumber) {
                  tempobject.machineId = res.data[j].id
                  break
                }
              }
              //排除未關連到的
              if (tempobject.machineId != 0 && tempobject.moldId != 0) {
                this.moldmachineiIdarray.push(tempobject)
                success++
              } else {
                fail++
              }
            })
            fail -= 1
            this.importsuccess = success
            this.importfail = fail
            this.importmoldmachinemodalsuccess = true

            this.callmoldmachineapi(this.moldmachineiIdarray)
          }
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //檢查undefind
    checkundefind(value, num) {
      if (value == undefined) {
        return num
      } else {
        return value
      }
    },
    //模具匯入
    callmoldapi(data) {
      //  this.importmodal = true
      //   if (error.response.data.resopnse == 'Mold cycletime can not be 0') {
      //     this.importmodalerrormes = this.$t('mold_cycletime_error')
      //   } else if (error.response.data.response.includes('Duplicate entry')) {
      //     this.importmodalerrormes = this.$t('mold_cycletime_error1')
      //   } else {
      //     this.importmodalerrormes = error.response.data.response
      //   }
      if (data != null) {
        // var total = data.length
        let errortype = ''
        let errorflag = false

        data.forEach(item => {
          if (item.cycleTime <= 0) {
            errorflag = true
            errortype = this.$t('mold_import_ct_error') //'週期時間不得小於等於0'
          }
          if (item.yellowRange <= item.greenRange || item.yellowRange > 0.9) {
            errorflag = true
            errortype = this.$t('mold_import_yellowrange_error') //'黃品參數值須大於綠品參數，且小於0.9'
          }
          if (item.cavityNumber <= 0) {
            errorflag = true
            errortype = this.$t('mold_import_cavity_error') //'模穴數不得小於等於0'
          }
          if (item.greenRange <= 0 || item.greenRange > 0.9) {
            errorflag = true
            errortype = this.$t('mold_import_greenrange_error') //'綠品參數值須藉於0至0.9'
          }
        })
        if (errorflag) {
          this.importmodal = true
          this.importmodalerrormes = errortype
        } else {
          this.importsuccess = 0
          this.importtotal = data.length
          this.importfail = 0
          var tempnum = 0
          var temptotal = data.length
          this.submitdata = data

          this.callmultiapi(tempnum, temptotal)
        }
      }
    },
    //綠品onChange
    greenRangeChange() {
      if (this.moldobject.greenRange < 0) {
        this.moldobject.greenRange = 0
      } else if (this.moldobject.greenRange > 0.9) {
        this.moldobject.greenRange = 0.9
      }

      if (parseFloat(this.moldobject.greenRange) >= parseFloat(this.moldobject.yellowRange)) {
        this.moldobject.yellowRange = this.roundDecimal(
          parseFloat(this.moldobject.greenRange) + 0.1,
          1
        )
      }
      if (parseFloat(this.moldobject.greenRange) == 0.9) {
        this.moldobject.yellowRange = 0.9
      }
    },
    //黃品onChange
    yellowRangeChange() {
      if (parseFloat(this.moldobject.greenRange) >= parseFloat(this.moldobject.yellowRange)) {
        if (parseFloat(this.moldobject.greenRange) == 0.9) {
          this.moldobject.greenRange = 0.9
        } else {
          this.moldobject.yellowRange = this.roundDecimal(
            parseFloat(this.moldobject.greenRange) + 0.1,
            1
          )
        }
      } else if (this.moldobject.yellowRange > 0.9) {
        this.moldobject.yellowRange = 0.9
      }
    },
    //四捨五入
    roundDecimal(val, precision) {
      return (
        Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) /
        Math.pow(10, precision || 0)
      )
    },
    callmultiapi() {
      var access_token_val = this.$cookies.get('access_token')
      MoldAPI.post(JSON.stringify(this.submitdata), {
        headers: {
          access_token: access_token_val,
          multi: true
        }
      }).then(
        () => {
          // this.importmodal = true //開啟視窗
          // 重載資料
          this.$emit('callparent', 1) //呼叫父元件
          this.$layer.msg(this.$t('scuccess'))
          this.isbusy = true
        },
        error => {
          this.importmodal = true
          if (error.response.data.resopnse == 'Mold cycletime can not be 0') {
            this.importmodalerrormes = this.$t('mold_cycletime_error')
          } else if (error.response.data.response.includes('Duplicate entry')) {
            this.importmodalerrormes = this.$t('mold_cycletime_error1')
          } else {
            this.importmodalerrormes = error.response.data.response
          }
          // this.$layer.msg(this.$t('fail') + error.response.data.response)
          // 重載資料
          // this.$layer.msg(this.$t('fail') + error.response.data.response)
          // this.$emit('callparent', 1) //呼叫父元件
        }
      )
    },

    //處理模具資料
    dealmolddata(data) {
      var inputarray = []
      var tempobject = JSON.parse(JSON.stringify(this.moldobjectnull))
      if (data != null) {
        data.forEach(item => {
          tempobject = JSON.parse(JSON.stringify(this.moldobjectnull))
          tempobject.number = this.checkNumberToString(this.checkundefind(item.number, '')) //模具編號
          tempobject.name = this.checkNumberToString(this.checkundefind(item.name, '')) //模具名稱
          tempobject.cycleTime = parseFloat(this.checkundefind(item.cycleTime, 60)) //週期時間
          tempobject.cavityNumber = this.checkundefind(item.cavityNumber, 1) //模穴數
          tempobject.productModel = this.checkNumberToString(
            this.checkundefind(item.productModel, '')
          ) //機種
          tempobject.clientName = this.checkNumberToString(this.checkundefind(item.clientName, '')) //客戶名稱
          tempobject.remark = this.checkNumberToString(this.checkundefind(item.remark, '')) //備註
          tempobject.upTime = this.checkundefind(item.upTime, 60) //上模時間
          tempobject.downTime = this.checkundefind(item.downTime, 30) //下模時間
          tempobject.height = this.checkundefind(item.height, 0) //長
          tempobject.width = this.checkundefind(item.width, 0) //寬
          tempobject.fixedMoldThickness = this.checkundefind(item.fixedMoldThickness, 0) //靜模
          tempobject.movableMoldThickness = this.checkundefind(item.movableMoldThickness, 0) //動模
          tempobject.moldStroke = this.checkundefind(item.moldStroke, 0) //開模行程
          tempobject.coldRunningWeight = this.checkundefind(item.coldRunningWeight, 0) //冷流道重
          tempobject.hotRunningWeight = this.checkundefind(item.hotRunningWeight, 0) //熱流道重
          tempobject.coldRunningMaxDiameter = this.checkundefind(item.coldRunningMaxDiameter, 0) //冷流道最大直徑
          tempobject.greenRange = this.checkundefind(item.greenRange, 0.1) //綠品參數
          tempobject.yellowRange = this.checkundefind(item.yellowRange, 0.2) //黃品參數

          inputarray.push(tempobject)
        })

        inputarray = inputarray.slice(1, inputarray.length)
        var arr = []
        this.importrepeat = 0
        // 去重複number
        for (var i = 0; i < inputarray.length; i++) {
          if (i == 0) arr.push(inputarray[i])
          let b = false
          if (arr.length > 0 && i > 0) {
            for (var j = 0; j < arr.length; j++) {
              if (arr[j].number == inputarray[i].number) {
                this.importrepeat++
                b = true
                // break
              }
            }
            if (!b) {
              arr.push(inputarray[i])
            }
          }
        }
        this.callmoldapi(arr)
      }
    },

    //分類
    checkuploaddata(data) {
      if (data != null) {
        if (data[0].cavityNumber == '模穴數') {
          //模具
          this.dealmolddata(data)
        } else if (data[0].cavityNumber == undefined) {
          //關聯
          this.getallmachine(data)
        }
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
    importmoldmachinefile() {
      document.getElementById('fileUpload').click()
    },
    //下載模具關聯設備範例
    downloadmoldmachinesample(mode) {
      let link = document.createElement('a')
      link.style.display = 'none'
      if (mode == 2) {
        link.download = 'IoM_Mold_Template' //'模具範例'
        link.href = '/excelfile/IoM_Mold_Template.xls'
      } else if (mode == 1) {
        link.download = 'IoM_Mold_Machine_Rel_Template' //'模具關聯設備範例'
        link.href = '/excelfile/IoM_Mold_Machine_Rel_Template.xls'
      }

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
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
      }
    },

    onChange(value) {
      this.machineselected = value
    },
    //取得設備
    getmachine(disablevalue, disableoperate) {
      this.basicmachineOptions = []
      this.basicmachineOptions.push({
        text: this.$t('select_machine'), //'選擇設備',
        value: null,
        disabled: true
      })

      var access_token_val = this.$cookies.get('access_token')
      gmachineSelectAPI({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          if (res.data != null) {
            if (res.data != null) {
              res.data.sort((a, b) => naturalCompare(a.machineNumber, b.machineNumber))
            }
            if (this.moldobject.machineData != null) {
              this.machineselected = []
              this.moldobject.machineData.forEach(object => {
                this.machineselected.push(object.id)
              })
              res.data.forEach(item => {
                var valueselected = this.checkifselect(item.id)
                this.basicmachineOptions.push({
                  text: item.machineNumber,
                  value: item.id,
                  selected: valueselected
                })
                if (valueselected) {
                  this.machineselected.push(item.id)
                }
              })
            } else {
              res.data.forEach(item => {
                this.basicmachineOptions.push({
                  text: item.machineNumber,
                  value: item.id
                })
              })
            }
          }

          // if (disablevalue == 0) {
          //新增/編輯
          // this.neweditmodal = true //顯示視窗
          // }
          //複製
          if (disablevalue == 2) {
            this.moldobject.id = 0
            this.moldobject.status = 0
            this.neweditmodal = true //顯示視窗
          } else {
            //新增/編輯
            if (!disableoperate) {
              this.neweditmodal = true //顯示視窗
            }
          }
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },

    checkifselect(value) {
      if (this.operate == this.$t('new')) {
        return true
      }
      var returnval = false
      this.moldobject.machineData.forEach(item => {
        if (item.id == value) {
          returnval = true
        }
      })
      return returnval
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
    },
    getmoldobjectdetial(idvalue, disablevalue, disableoperate) {
      var access_token_val = this.$cookies.get('access_token')
      MoldAPI.get({
        headers: {
          access_token: access_token_val,
          id: idvalue
        }
      }).then(
        res => {
          if (disablevalue == 3) {
            res.data.status = 0 //啟用
          } else {
            res.data.status = disablevalue
          }

          this.moldobject = JSON.parse(JSON.stringify(res.data))
          this.getmachine(disablevalue, disableoperate)
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //停用1///啟用3
    disableitemfunc(item, mode) {
      if (mode == 3) {
        this.disabletype = this.$t('actvite')
      } else {
        this.disabletype = this.$t('disable')
      }

      // this.moldobject = JSON.parse(JSON.stringify(item))

      this.getmoldobjectdetial(item.id, mode, true)
    },
    //複製
    copynewitemfunc(item) {
      this.operate = this.$t('new')
      this.getmoldobjectdetial(item.id, 2, false)
    },
    //編輯
    editwindow(item) {
      this.getmoldobjectdetial(item.id, item.status, false)
    },
    //新增
    newwindow() {
      this.getmachine(0)
      this.moldobject = JSON.parse(JSON.stringify(this.moldobjectnull))
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
      this.moldobject.id = this.checkisnull(this.moldobject.id)
      this.moldobject.manufactureDate = this.checkisnull(this.moldobject.manufactureDate)
      this.moldobject.lastUpdateTime = this.checkisnull(this.moldobject.lastUpdateTime)
      this.moldobject.height = this.checkisnull(this.moldobject.height)
      this.moldobject.width = this.checkisnull(this.moldobject.width)
      this.moldobject.movableMoldThickness = this.checkisnull(this.moldobject.movableMoldThickness)
      this.moldobject.fixedMoldThickness = this.checkisnull(this.moldobject.fixedMoldThickness)
      this.moldobject.cavityNumber = this.checkisnull(this.moldobject.cavityNumber)
      this.moldobject.cycleTime = this.checkisnull(this.moldobject.cycleTime)

      this.moldobject.coldRunningWeight = this.checkisnull(this.moldobject.coldRunningWeight)
      this.moldobject.hotRunningWeight = this.checkisnull(this.moldobject.hotRunningWeight)
      this.moldobject.moldStroke = this.checkisnull(this.moldobject.moldStroke)
      this.moldobject.coldRunningMaxDiameter = this.checkisnull(
        this.moldobject.coldRunningMaxDiameter
      )
      this.moldobject.companyId = this.checkisnull(this.moldobject.companyId)
      this.moldobject.greenRange = this.checkisnull(this.moldobject.greenRange)
      this.moldobject.yellowRange = this.checkisnull(this.moldobject.yellowRange)

      this.moldobject.upTime = this.checkisnull(this.moldobject.upTime)

      this.moldobject.downTime = this.checkisnull(this.moldobject.downTime)

      this.moldobject.machineData = []

      this.machineselected.forEach(item => {
        this.moldobject.machineData.push({
          id: item
        })
      })
      // if (this.moldobject.cycleTime <= 0) {
      //   this.moldobject.cycleTime = 1
      // }
    },
    // 送出
    submitfunc() {
      this.dealdata()
      // if (this.moldobject.cycleTime > 0) {
      var access_token_val = this.$cookies.get('access_token')
      if (this.moldobject.id == '') {
        MoldAPI.post(JSON.stringify(this.moldobject), {
          headers: {
            access_token: access_token_val
          }
        }).then(
          () => {
            // 重載資料
            this.$emit('callparent', 1) //呼叫父元件
            this.$layer.msg(this.$t('scuccess'))
            this.neweditmodal = false
          },
          error => {
            if (error.response.data.response == 'Mold cycletime can not be 0') {
              this.errormes = this.$t('Mold_cycletime_can_not_be_0')
            } else if (error.response.data.response.includes('Duplicate entry')) {
              this.errormes = this.$t('mold_cycletime_error2')
            } else {
              this.errormes = error.response.data.response
            }

            console.log(error.response)
            // this.$layer.msg(this.$t('fail') + error.response.data.response)
            // this.neweditmodal = false
          }
        )
      } else {
        MoldAPI.put(JSON.stringify(this.moldobject), {
          headers: {
            access_token: access_token_val,
            moldCycleTime: false,
            scheduleCycleTime: false
          }
        }).then(
          () => {
            // 重載資料
            this.$emit('callparent', 1) //呼叫父元件
            this.$layer.msg(this.$t('scuccess'))
            this.neweditmodal = false
            this.isbusy = true
          },
          error => {
            console.log(error.response)
            if (error.response.data.response == 'Mold cycletime can not be 0') {
              this.errormes = this.$t('Mold_cycletime_can_not_be_0')
            } else if (error.response.data.response.includes('Duplicate entry')) {
              this.errormes = this.$t('mold_cycletime_error2')
            } else {
              this.errormes = error.response.data.response
            }
          }
        )
      }
      // } else {
      //   this.moldobject.cycleTime = ''
      // }
    },

    // 刪除
    deletemold() {
      var access_token_val = this.$cookies.get('access_token')
      if (this.deletemode == 1) {
        MoldmultideleteAPI.delete({
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
            this.errormes = error.response.data.response
            // this.$layer.msg(this.$t('fail') + error.response.data.response)
            // this.modal = false
          }
        )
      } else {
        MoldAPI.delete({
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
            this.errormes = error.response.data.response
            // this.$layer.msg(this.$t('fail') + error.response.data.response)
            // this.modal = false
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
.operateclass {
  text-align: center;
  width: 150px;
}
</style>
<style scoped>
/* th.text-center.test {
  width: 100px !important;
} */

.controlgrid {
  justify-items: center;
  margin: 0px auto;
  display: grid;
  /* grid-template-columns: 50px 50px 50px 50px; */
  grid-template-columns: 35px 35px 35px 35px 1px;
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
<style>
.moldpctableclass {
  max-height: calc(100vh - 346px) !important;
}
.moldnumberclass {
  max-width: 30px;
  text-align: center;
}
#eee.select-wrapper.md-form {
  margin-top: 0%;
}
.md-form .select-dropdown {
  margin-top: 0%;
  margin-bottom: 0%;
}

.md-form .select-dropdown input {
  padding: 0.375rem 0.75rem;
  margin: 0%;
  width: auto;
}

.select-wrapper.md-form {
  margin-top: 0%;
  margin-bottom: 0%;
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
.btn.btn-primary.btn-sm.btn-save.ripple-parent {
  display: none;
}
</style>
