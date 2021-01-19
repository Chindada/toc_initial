<template>
  <b-container fluid>
    <mdb-card>
      <mdb-card-body>
        <!-- <div class="mx-3">
          <h2>排程管理OEE</h2>
        </div>-->

        <div style="padding-top: 0.2rem;">
          <div>
            <b-row>
              <b-col lg="8">
                <mdb-input
                  style="width:80%;margin-bottom:0.8rem"
                  v-model="filter"
                  type="search"
                  id="filterInput"
                  :placeholder="
                    this.$t('schedule_number') +
                      '、' +
                      this.$t('mold_number') +
                      '、' +
                      this.$t('machine_number') +
                      '、' +
                      this.$t('employee_start_time') +
                      '、' +
                      this.$t('employee_end_time') +
                      '、' +
                      this.$t('remark')
                  "
                >
                  <!-- this.$t('employee_start_time') +
                      '、' +
                      this.$t('employee_end_time') +
                  '、' +-->
                  <span class="input-group-text" slot="prepend">{{ $t('search') }}</span>
                </mdb-input>
              </b-col>
              <b-col>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <label class="input-group-text" for="inputGroupSelect01">
                      {{ $t('workshop_machine') }}
                    </label>
                  </div>
                  <b-form-select
                    v-model="scearchworkshop"
                    :options="workshopobject"
                    @change="searchdata()"
                    :disabled="isbusy"
                  ></b-form-select>
                </div>
              </b-col>
            </b-row>
            <!-- <mdb-btn size="sm" color="primary" v-on:click="moldwindow([],[],'new')">新增</mdb-btn> -->
            <b-row>
              <b-col>
                <!-- 新增 -->
                <mdb-btn
                  v-if="newbtm"
                  size="sm"
                  color="primary"
                  v-on:click="newwindow()"
                  icon="plus"
                  style="padding:0.5rem"
                ></mdb-btn>
                <!-- 編輯 -->
                <!-- <mdb-btn
                  v-if="statusshow && editbtm"
                  size="sm"
                  v-on:click="editwindow()"
                  :disabled="selected ? selected == 0 : false"
                  color="mdb-color"
                  type="button"
                  style="padding:0.4rem"
                  icon="pencil-alt"
                ></mdb-btn>-->
                <!-- 刪除 -->
                <mdb-btn
                  v-if="statusshow && deletebtm"
                  size="sm"
                  color="danger"
                  :disabled="selected ? selected == 0 : false"
                  @click.native="warning = true"
                  style="padding:0.5rem"
                  icon="trash-alt"
                ></mdb-btn>
              </b-col>
              <b-col></b-col>
              <b-col cols="4">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <label class="input-group-text" for="inputGroupSelect01">
                      {{ $t('produce_time_type') }}
                    </label>
                  </div>
                  <b-form-select
                    v-model="scearchtime"
                    :options="timeobject"
                    @change="searchdata()"
                    :disabled="isbusy"
                  ></b-form-select>
                </div>
              </b-col>
            </b-row>
            <br />
            <b-table
              class="schedulepctableclass"
              no-border-collapse
              sticky-header="650px"
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
                <!-- 編輯 -->
                <mdb-btn
                  color="mdb-color"
                  @click="editwindow(row.item, row.index, 'edit')"
                  type="button"
                  style="padding:0.1rem"
                  icon="pencil-alt"
                ></mdb-btn>

                <!-- <b-button size="sm" @click="row.toggleDetails">{{ row.detailsShowing ? '隱藏' : '顯示' }} 詳細</b-button> -->
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
                <b-button size="sm" @click="row.toggleDetails"
                  >{{ row.detailsShowing ? '隱藏' : '顯示' }} 詳細</b-button
                >
              </template>-->
              <!--詳細資訊 -->
              <!-- <template v-slot:row-details="row">
                <b-card>
                  <ul>
                    <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
                  </ul>
                </b-card>
              </template>-->
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
            <!-- <div>圖</div> -->

            <!-- <class-tab :searchData="data" :getchartdata="ScheduleTtimedata"></class-tab> -->

            <!-- :getchartdata="passchartdata" -->
            <class-tab
              :searchData="data"
              :getchartdata="tabledata"
              :workshopselect="scearchworkshop"
              v-on:callparent="getdata"
            ></class-tab>
          </div>
        </div>
      </mdb-card-body>
    </mdb-card>
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
    <!-- 編輯 -->
    <mdb-modal :show="modaledit" @close="closemodal($event)">
      <form v-on:submit.prevent="editsubmit">
        <mdb-modal-header>
          <mdb-modal-title>{{ $t('edit') }}{{ $t('schedule') }}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <div>
            <mdb-input
              disabled
              :show="modal"
              class="mb-3"
              v-model="putscheduleobject.scheduleSerial"
            >
              <span class="input-group-text" slot="prepend">{{ $t('schedule_number') }}</span>
            </mdb-input>
            <!-- 模具 -->
            <div class="input-group" style="margin-bottom: 1rem">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">
                  <span class="requileclass">*</span>
                  {{ $t('mold_number') }}
                </label>
              </div>
              <div class="form-control selsect">
                <model-select
                  v-model="putscheduleobject.moldId"
                  :options="moldobject"
                ></model-select>
              </div>
            </div>
            <!-- 計畫週期時間 -->
            <mdb-input
              class="mb-3"
              v-model="putscheduleobject.moldCycleTime"
              :step="0.1"
              type="number"
              :min="0.1"
            >
              <span class="input-group-text" slot="prepend">
                <span class="requileclass">*</span>
                {{ $t('mold_cycletime') }}
              </span>
            </mdb-input>
            <!-- 設備 -->
            <div class="input-group" style="margin-bottom: 1rem">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">
                  <span class="requileclass">*</span>
                  {{ $t('machine_number') }}
                </label>
              </div>
              <div class="form-control selsect">
                <model-select
                  v-model="putscheduleobject.machineId"
                  :options="editmachineobject"
                ></model-select>
              </div>
            </div>

            <!-- 模次 -->
            <mdb-input class="mb-3" type="number" :min="1" v-model="putscheduleobject.qty">
              <span class="input-group-text" slot="prepend">
                <span class="requileclass">*</span>
                {{ $t('to_schedule_qty') }}
              </span>
            </mdb-input>
            <!-- 開始時間 -->
            <div class="input-group" style="margin-bottom: 1rem">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">
                  <span class="requileclass">*</span>
                  {{ $t('schedule_start_time') }}
                </label>
              </div>
              <input
                type="datetime-local"
                class="form-control"
                v-model="putscheduleobject.startTime"
                required
              />
            </div>
            <!--結束時間 -->
            <div class="input-group" style="margin-bottom: 1rem">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">
                  <span class="requileclass">*</span>
                  {{ $t('schedule_end_time') }}
                </label>
              </div>
              <input
                type="datetime-local"
                class="form-control"
                v-model="putscheduleobject.endTime"
                required
              />
            </div>
            <mdb-input class="mb-3" v-model="putscheduleobject.remark">
              <span class="input-group-text" slot="prepend">{{ $t('remark') }}</span>
            </mdb-input>
          </div>
        </mdb-modal-body>
        <mdb-modal-footer>
          <span style="color:red">{{ errormes }}</span>
          <mdb-btn color="info" type="submit">{{ $t('submit') }}</mdb-btn>
          <mdb-btn color="0000" @click.native="modaledit = false" type="button">
            {{ $t('close') }}
          </mdb-btn>
        </mdb-modal-footer>
      </form>
    </mdb-modal>
    <!-- end編輯 -->
    <!-- 新增-->
    <mdb-modal :show="newmodal" @close="closemodal($event)" size="lg">
      <form v-on:submit.prevent="submitnew">
        <mdb-modal-header>
          <mdb-modal-title>{{ operate }} {{ $t('schedule') }}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <mdb-btn
            :disabled="addRowflag"
            color="primary"
            type="button"
            rounded
            style="padding-top:0.2rem;padding-bottom:0.2rem"
            @click="addRow"
            >{{ $t('new_one') }}</mdb-btn
          >
          <b-row>
            <b-col cols="1" sm="1" style=" max-width: 20px !important;padding-right:0px"></b-col>
            <b-col cols="1" style="max-width:180px;padding-right:0px">
              <label class="input-group-text" for="inputGroupSelect01">{{
                $t('schedule_number')
              }}</label>
            </b-col>
            <b-col cols="2" style="padding-right:0px">
              <label class="input-group-text" for="inputGroupSelect01">
                <span class="requileclass">*</span>
                {{ $t('mold_number') }}
              </label>
            </b-col>
            <b-col cols="1" style="padding-right:0px">
              <label class="input-group-text" for="inputGroupSelect01">
                <span class="requileclass">*</span>
                {{ $t('machine_number') }}
              </label>
            </b-col>
            <b-col cols="1" style="padding-right:0px">
              <span class="input-group-text" slot="prepend">
                <span class="requileclass">*</span>
                {{ $t('mold_qty') }}
              </span>
            </b-col>
            <b-col cols="2" style="padding-right:0px;">
              <span class="input-group-text" slot="prepend">
                <span class="requileclass">*</span>
                {{ $t('schedule_start_time') }}
              </span>
            </b-col>
            <b-col cols="2" style="padding-right:0px;">
              <span class="input-group-text" slot="prepend">
                <span class="requileclass">*</span>
                {{ $t('schedule_end_time') }}
              </span>
            </b-col>
            <b-col cols="1" sm="1" style=" max-width: 10px !important"></b-col>
            <b-col cols="1" style="padding-right:0px">
              <span class="input-group-text" slot="prepend">{{ $t('remark') }}</span>
            </b-col>
          </b-row>
          <hr />
          <div :key="index" v-for="(member, index) in insertnewscheduleobject">
            <div>
              <b-row>
                <b-col
                  cols="1"
                  sm="1"
                  style=" max-width: 20px !important;padding-right:0px"
                ></b-col>
                <b-col
                  v-bind:class="member.classtype"
                  cols="1"
                  style="border-radius: 5px 0px 0px 5px;max-width:180px;padding-right:0px"
                >
                  <!-- 排程編號 -->
                  <mdb-input
                    required
                    class="mb-3"
                    v-model="member.scheduleSerial"
                    disabled
                  ></mdb-input>
                </b-col>
                <b-col cols="2" v-bind:class="member.classtype" style="padding-right:0px;">
                  <div class="input-group test" style="padding-top:10px">
                    <!-- 模具編號 -->
                    <model-select
                      :options="moldobject"
                      v-model="member.moldId"
                      :customAtt="moldonchanged(member, index)"
                    ></model-select>
                  </div>
                  <div class="tooltip1">
                    ?
                    <div class="tooltiptext1" style="text-align:left">
                      <div v-if="member.moldId == 0">{{ $t('no_mold_selected') }}</div>
                      <div v-else>
                        <div>{{ $t('mold_cavity_number') }} : {{ member.moldcavitynum }}</div>
                        <div>{{ $t('mold_cycletime_select') }} : {{ member.moldcycletime }}s</div>
                      </div>
                    </div>
                  </div>
                </b-col>

                <b-col cols="1" v-bind:class="member.classtype" style="padding-right:0px">
                  <div class="input-group test" style="padding-top:10px;border-radius: 25px;">
                    <!-- 設備編號 -->
                    <model-select
                      :options="member.machineobject"
                      v-model="member.machineId"
                    ></model-select>
                  </div>
                </b-col>
                <b-col cols="1" v-bind:class="member.classtype">
                  <!-- 模次 -->
                  <mdb-input
                    @focus="focus($event)"
                    class="mb-3"
                    required
                    v-model="member.qty"
                    type="number"
                    :min="1"
                  ></mdb-input>
                </b-col>
                <b-col cols="2" style="min-width:100px" v-bind:class="member.classtype">
                  <!-- 開始時間 -->
                  <input
                    type="datetime-local"
                    required
                    v-model="member.startTime"
                    style="position: absolute;top: 15%;z-index:1;left: 5%;width:100%"
                  />
                </b-col>
                <b-col cols="2" v-bind:class="member.classtype" style="min-width:100px">
                  <!-- 結束時間 -->
                  <input
                    type="datetime-local"
                    required
                    v-model="member.endTime"
                    style="position: absolute;top: 15%;left: 5%;width:100%;z-index:1"
                  />
                </b-col>
                <b-col
                  v-bind:class="member.classtype"
                  cols="1"
                  sm="1"
                  style=" max-width: 10px !important;"
                ></b-col>
                <b-col
                  v-bind:class="member.classtype"
                  cols="1"
                  style="border-radius: 0px 5px 5px 0px;"
                >
                  <!-- 備註 -->
                  <mdb-input
                    @focus="focus($event)"
                    class="mb-3"
                    v-model="member.remark"
                  ></mdb-input>
                </b-col>
                <b-col cols="1">
                  <mdb-btn
                    size="sm"
                    type="button"
                    color="danger"
                    @click="deleteRow(index)"
                    icon="trash-alt"
                    style="padding:0.5rem;margin-top: 0.5rem; margin-left:25px;"
                  ></mdb-btn>
                </b-col>
              </b-row>
            </div>
          </div>
        </mdb-modal-body>
        <mdb-modal-footer>
          <div style="color:red">{{ errormes }}</div>
          <h2 style="opacity:0">---------------</h2>
          <mdb-btn color="info" type="submit">{{ $t('submit') }}</mdb-btn>
          <mdb-btn color="0000" @click.native="newmodal = false" type="button">
            {{ $t('close') }}
          </mdb-btn>
        </mdb-modal-footer>
      </form>
    </mdb-modal>
    <!-- end新增 -->
    <!-- OEE新增排程DB衝突 -->
    <mdb-modal :show="newscheduleOEEerror" @close="newscheduleOEEerror = false" size="lg">
      <mdb-modal-header>
        <mdb-modal-title>{{ $t('toschedule_oee_dberror') }}</mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body>
        <b-table
          ref="selectableTable"
          show-empty
          bordered
          :hover="true"
          :items="newscheduletabledataOEEErrordata"
          :fields="newschedulefieldsOEEError"
          :filterIncludedFields="filterOn"
          :sort-by.sync="sortBy"
          sort-desc.sync="asc"
          :sort-direction="sortDirection"
          @filtered="onFiltered"
        >
          <template v-slot:cell(workShopNumber)="row">
            {{ row.item.workShopNumber }}
            <mdb-btn style="width: 0px;padding: 0.4rem 0px;" icon="trash-alt"></mdb-btn>
            <!-- 固定欄高 -->
          </template>
        </b-table>
      </mdb-modal-body>
      <mdb-modal-footer>
        <mdb-btn color="0000" type="button" @click.native="newscheduleOEEerror = false">
          {{ $t('close') }}
        </mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>

    <!--end OEE新增排程DB衝突 -->
    <!-- 排程衝突 -->
    <error-tab :errorArray="errorArray"> </error-tab>
  </b-container>
</template>

<script>
import naturalCompare from 'string-natural-compare'
import { mapState } from 'vuex'
import { ModelSelect } from 'vue-search-select'
import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css'
import 'bootstrap/dist/css/bootstrap.css'
import Class from '@/components/produce/scheduleOEE/amchart'
import errorTableTab from '@/components/produce/schedule/scheduleConflictTable'

import {
  // ScheduleOEEAPI,
  ScheduleChange,
  // ScheduleAPI,
  GetOEEScheduleSerialAPI,
  ScheduleOEEnewmultiAPI,
  ScheduleOEEallAPI,
  ScheduleMultiAPI,
  ScheduleOEEplusMoldMachineAPI,
  ScheduleOEEmultieditAPI
} from '@/plugins/produceapis.js'
// import { MoldAPI } from '@/plugins/basicapis.js'
import {
  moldSelectOEEAPI,
  gmachineSelectAPI,
  moldmachineSelectAPI,
  WorkShopAPI
} from '@/plugins/basicapis.js'
export default {
  components: {
    'class-tab': Class,
    'error-tab': errorTableTab,
    ModelSelect
  },
  data() {
    var scheduleobject = {
      Id: null,
      name: '',
      number: ''
    }
    var newscheduleobject = {
      Id: 0, //排程id
      scheduleSerial: '', //排程編號
      moldId: 0, //模具id
      moldCycleTime: 0, //模具週期時間
      machineId: 0, //設備id
      qty: 0, //模次
      startTime: '', //開始時間
      endTime: '', //結束時間
      status: 2,
      update: false,
      moldYellowRange: 0, //黃品參數
      moldGreenRange: 0, //綠參數
      delayTime: 0, //???
      lastmoldId: 0, //上一個模具id
      machineobject: [], //設備選單
      classtype: 'newtype',
      moldcavitynum: 0,
      moldcycletime: 0
    }
    var timeobject = [
      { text: this.$t('in_one_month_schedule'), value: 1 },
      { text: this.$t('in_three_month_schedule'), value: 3 },
      { text: this.$t('in_six_month_schedule'), value: 6 },
      { text: this.$t('in_twelve_month_schedule'), value: 12 },
      { text: this.$t('all'), value: -1 }
    ]
    var newscheduleobjectnull = JSON.parse(JSON.stringify(newscheduleobject))

    return {
      errorArray: [], //錯誤array
      page_first: 0, //第一條
      page_last: 0, //最後一筆
      page_total: 0, //總共筆數
      scearchtime: 1, //時間種類範圍
      timeobject,
      scearchworkshop: -1,
      workshopobject: [], //廠區選單
      addnewfalg: false,
      passchartdata: [], //chart圖資訊
      errormes: '', //錯誤訊息
      firstedit: false, //按下編輯
      modaledit: false, //編輯視窗
      moldobject: [], //模具
      machineobject: [], //設備
      editmachineobject: [], //編輯設備選單
      addRowflag: false, //新增一筆
      newscheduleobject,
      insertnewscheduleobject: [], //新增array
      putscheduleobject: '', //編輯
      newscheduleobjectnull,
      newmodal: false, //新增視窗
      newscheduleOEEerror: false, //新增DB衝突錯誤視窗
      ScheduleTtimedata: [], //原始資料
      newscheduletabledataOEEErrordata: [],
      isbusy: true,
      newbtm: false, //新增
      editbtm: false, //編輯
      deletebtm: false, //刪除
      customize1: false, //自定義一
      customize2: false, //自定義二
      customize3: false, //自定義三
      standby_total: 0,
      task_total: 0,
      finished_total: 0,
      timesearch: false,
      statusshow: true,
      tabvalue: 3, //預設tab值
      data: {
        scarchbtm: 0,
        inputstarttime: new Date(),
        inputendtime: new Date(),
        workshop: 0
      },
      inistartdate: new Date(),
      inienddate: new Date(),

      searchstartTime: 0,
      searchendTime: 0,
      searchbtmflag: 0,
      compkey: 0,
      options: {
        format: 'YYYY/MM/DD  HH:mm',
        useCurrent: false
      },
      editarray: [], //編輯陣列
      editdeletearray: [], //編輯刪除陣列

      selected: [],
      scheduleobject,
      operate: '',
      warning: false,
      modal: false,
      tabledata: [],
      tabledata1: [],
      fields: [
        {
          key: 'scheduleSerial',
          label: this.$t('schedule_number'), //'排程編號',
          class: 'text-center',
          sortable: true,
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'moldNumber',
          label: this.$t('mold_number'), //'模具編號',
          sortable: true,
          sortDirection: 'desc',
          class: 'text-center',
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'machineNumber',
          label: this.$t('machine_number'), //'設備編號',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'startTimetable',
          label: this.$t('schedule_start_time'), //'開始時間',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'endTimetable',
          label: this.$t('schedule_end_time'), //'結束時間',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'moldCycleTime',
          label: this.$t('mold_cycletime'), //'計畫週期時間',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return this.dealThousands('0', value)
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'qty',
          label: this.$t('mold_qty'), //'模次',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return this.dealThousands('0', value)
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
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        }
      ],
      newschedulefieldsOEEError: [
        {
          key: 'scheduleNumber',
          label: this.$t('schedule_number'), //排程編號
          class: 'text-center',
          thStyle: 'height:45px',
          formatter: value => {
            return value
          }
        },
        {
          key: 'moldNumber',
          label: this.$t('mold_number'), //模具編號
          class: 'text-center',
          thStyle: 'height:45px',
          formatter: value => {
            return value
          }
        },
        {
          key: 'workShopNumber',
          label: this.$t('workshop_number'), //廠區編號
          class: 'text-center',
          thStyle: 'height:45px',
          formatter: value => {
            return value
          }
        },
        {
          key: 'machineNumber',
          label: this.$t('machine_number'), //設備編號
          class: 'text-center',
          thStyle: 'height:45px',
          formatter: value => {
            return value
          }
        },
        {
          key: 'startTime',
          label: this.$t('schedule_start_time'), //開始時間
          class: 'text-center',
          thStyle: 'height:45px',
          formatter: value => {
            return this.timeStampToStringFunc(value, 'yyyy-mm-dd hh:mm')
          }
        },
        {
          key: 'endTime',
          label: this.$t('schedule_end_time'), //結束時間
          class: 'text-center',
          thStyle: 'height:45px',
          formatter: value => {
            return this.timeStampToStringFunc(value, 'yyyy-mm-dd hh:mm')
          }
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
      filterOn: [
        'scheduleSerial',
        'moldNumber',
        'machineNumber',
        'startTimetable',
        'endTimetable',
        'remark'
      ],
      infoModal: {
        id: 'info-modal',
        title: '',
        content: ''
      },
      //////////////////////////////////////////////////// 排程衝突
      scheduleConflict: false,
      scheduleConflictArray: [],
      scheduleConflictfields: [
        {
          key: 'scheduleNumber',
          label: this.$t('schedule_number'), //'排程編號',
          sortable: true,
          class: 'text-center',
          thStyle: { whiteSpace: 'nowrap' }
        },
        {
          key: 'moldNumber',
          label: this.$t('mold_number'), //'模具編號',
          sortable: true,
          class: 'text-center',
          thStyle: { whiteSpace: 'nowrap' }
        },
        {
          key: 'machineNumber',
          label: this.$t('machine_number'), //'設備編號',
          sortable: true,
          class: 'text-center',
          thStyle: { whiteSpace: 'nowrap' }
        },
        {
          key: 'moldConflict',
          label: this.$t('mold_conflict'), //'模具衝突',
          // sortable: true,
          class: 'text-center',
          thStyle: { whiteSpace: 'nowrap' }
        },
        {
          key: 'machineConflict',
          label: this.$t('machine_conflict'), //'設備衝突',
          // sortable: true,
          class: 'text-center',
          thStyle: { whiteSpace: 'nowrap' }
        }
      ]
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
  watch: {
    'putscheduleobject.moldId': function(newVal) {
      if (!this.firstedit) {
        //選擇更換模具
        if (this.moldobject != null) {
          var tempobject
          for (var i = 0; i < this.moldobject.length; i++) {
            if (newVal == this.moldobject[i].value) {
              tempobject = this.moldobject[i]
              break
            }
          }
        }
        this.putscheduleobject.moldCycleTime = tempobject.cycleTime
        this.putscheduleobject.moldYellowRange = tempobject.yellowRange
        this.putscheduleobject.moldGreenRange = tempobject.greenRange
        this.putscheduleobject.machineId = 0

        this.editmoldchange()
      } else {
      }
      this.firstedit = false
    },
    currentPage: function() {
      this.setfooternum() //設定頁數
    },
    perPage: function() {
      this.setfooternum() //設定頁數
    }
  },

  created() {
    this.getmold() //初始化模具、設備
    this.iniright()
    this.getworkshop()
  },
  mounted() {
    this.getdata()
  },
  methods: {
    //點選反白
    focus(event) {
      event.currentTarget.select()
    },
    //設定權限
    iniright() {
      this.authority.forEach(item => {
        if (item.name == 'produce_schedule') {
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
    //選單搜尋資料
    searchdata() {
      this.getdata()
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
          this.workshopobject.push({
            text: this.$t('all'),
            value: -1
          })
          if (res.data != null) {
            res.data.forEach(item => {
              this.workshopobject.push({ text: item.name, value: item.id })
            })
          }
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //模具選擇改變
    moldonchanged(data, index) {
      if (data.moldId != data.lastmoldId) {
        this.getmachinebymold(data.moldId, data)
        data.lastmoldId = data.moldId
        this.moldobject.forEach(item => {
          if (item.value == data.moldId) {
            this.insertnewscheduleobject[index].moldcavitynum = item.cavityNumber
            this.insertnewscheduleobject[index].moldcycletime = item.cycleTime
          }
        })
      }
    },
    //根據模具取得設備選單
    getmachinebymold(moldid, item) {
      let access_token_val = this.$cookies.get('access_token')
      moldmachineSelectAPI({
        headers: {
          access_token: access_token_val,
          id: moldid
        }
      }).then(
        res => {
          if (res.data != null) {
            this.clearmachineselect(res.data, item) //設定設備選單
          } else {
            this.clearmachineselect([], item) //清空設備選單
          }
        },
        error => {
          console.log(error.response)
          this.clearmachineselect([], item) //清空設備選單
          // this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //設定設備選單
    clearmachineselect(data, item) {
      if (data.length == 0) {
        item.machineobject = []
      } else {
        let temparray = []
        data.forEach(machineitem => {
          temparray.push({ value: machineitem.id, text: machineitem.machineNumber })
        })
        item.machineobject = temparray
        item.machineId = 0
      }
    },

    //取得模具
    getmold() {
      var access_token_val = this.$cookies.get('access_token')
      moldSelectOEEAPI({
        headers: {
          access_token: access_token_val,
          workshop: 'true'
        }
      }).then(
        res => {
          if (res.data != null) {
            res.data.sort((a, b) => naturalCompare(a.number, b.number))
            res.data.forEach(item => {
              this.moldobject.push({
                value: item.id,
                text: item.number,
                cavityNumber: item.cavityNumber,
                cycleTime: item.cycleTime,
                greenRange: item.greenRange,
                yellowRange: item.yellowRange
              })
            })
          }
          this.getmachine()
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //取得設備
    getmachine() {
      var access_token_val = this.$cookies.get('access_token')
      gmachineSelectAPI({
        headers: {
          access_token: access_token_val,
          workshop: 'true'
        }
      }).then(
        res => {
          if (res.data != null) {
            res.data.sort((a, b) => naturalCompare(a.machineNumber, b.machineNumber)) //排序設備編號
            res.data.forEach(item => {
              this.machineobject.push({ value: item.id, text: item.machineNumber })
            })
          }
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    submitnew() {
      if (this.insertnewscheduleobject.length == 0) {
        this.newmodal = false
      } else {
        var checkflag = 0
        //檢查模具設備選擇
        this.insertnewscheduleobject.forEach((item, index) => {
          this.insertnewscheduleobject[index].classtype = 'newtype'
          // console.log(item)
          if (item.moldId == 0 || item.machineId == 0) {
            if (item.moldId == 0) {
              this.insertnewscheduleobject[index].classtype = 'newerrortype'
            }
            if (item.machineId == 0) {
              this.insertnewscheduleobject[index].classtype = 'newerrortype'
            }
          }
          if (item.qty < 1) {
            this.insertnewscheduleobject[index].classtype = 'newerrortype'
            checkflag++
          }
        })
        if (checkflag == 0) {
          // newscheduleobject))
          this.callPostAPI(JSON.parse(JSON.stringify(this.insertnewscheduleobject)))
        }
      }
    },

    //新增送出
    callPostAPI(data) {
      var access_token_val = this.$cookies.get('access_token')
      var timeerror = false
      data.forEach((item, index) => {
        item.qty = parseInt(item.qty)
        item.startTime = this.stringToTimestampFunc(new Date(item.startTime))
        item.endTime = this.stringToTimestampFunc(new Date(item.endTime))
        if (this.checktime(item.startTime, item.endTime)) {
          timeerror = true
          this.insertnewscheduleobject[index].classtype = 'newerrortype'
          this.errormes = this.$t('to_schedule_error3') //時間輸入錯誤
        }

        var moldarray = this.moldchange(item.moldId)

        item.moldCycleTime = moldarray[0]
        item.moldGreenRange = moldarray[1]
        item.moldYellowRange = moldarray[2]
      })
      if (!timeerror) {
        ScheduleOEEnewmultiAPI.post(JSON.stringify(data), {
          headers: {
            access_token: access_token_val
          }
        }).then(
          () => {
            this.errormes = ''
            this.newmodal = false
            this.$layer.msg(this.$t('scuccess'))
            this.getdata()
          },
          error => {
            this.errorArray = error.response.data.errorArray
          }
        )
      }
    },

    checktime(sttime, endtime) {
      if (endtime <= sttime) {
        return true
      } else {
        return false
      }
    },
    //新增
    newwindow() {
      this.errormes = ''
      this.insertnewscheduleobject = []
      this.addRow()
    },
    //新增新增
    addRow() {
      this.addRowflag = true //停用"新增一筆"按鈕
      var access_token_val = this.$cookies.get('access_token')
      //取得製排排程編號
      GetOEEScheduleSerialAPI({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          var tempobject = JSON.parse(JSON.stringify(this.newscheduleobjectnull))
          tempobject.scheduleSerial = res.data.serial
          tempobject.startTime = this.settime() //'2016-03-17T08:00'
          tempobject.endTime = this.settime('endtime') //'2016-03-17T08:00'
          tempobject.qty = 1
          tempobject.machineobject = JSON.parse(JSON.stringify(this.machineobject))
          this.insertnewscheduleobject.push(tempobject)
          this.addRowflag = false //啟用"新增一筆"按鈕
          this.newmodal = true
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
          this.addRowflag = false
        }
      )
    },
    settime(value) {
      var temptime = this.stringToTimestampFunc(new Date(new Date()))
      if (value == 'endtime') {
        temptime += 86400000
      }
      return this.timeStampToStringFunc(temptime, 'yyyy-mm-ddThh:mm')
    },
    // 新增刪除
    deleteRow(index) {
      this.insertnewscheduleobject.splice(index, 1)
    },

    //modal背景點擊不關閉
    closemodal(value) {
      if (value == undefined) {
        this.modal = false
        this.newmodal = false
        this.modaledit = false
        this.newscheduleOEEerror = false
      }
    },

    //搜尋時間區間
    searchtime() {
      this.isbusy = true
      var temparray = []
      if (this.data.inputstarttime > this.data.inputendtime) {
        //日期錯誤
      } else {
        if (this.ScheduleTtimedata != null) {
          this.ScheduleTtimedata.forEach(item => {
            // if (
            //   item.startTime >= this.stringToTimestampFunc(this.data.inputstarttime) &&
            //   item.endTime <= this.stringToTimestampFunc(this.data.inputendtime)
            // ) {
            temparray.push(item)
            // }
          })
        }

        this.totalRows = temparray.length
        this.standby_total = this.dealThousands('0', temparray.length)
        this.tabledata = this.dealtabletim(JSON.parse(JSON.stringify(temparray)))
        this.passchartdata = temparray
      }

      this.isbusy = false
    },
    //編輯內刪除
    // deleteRow(index) {
    //   this.editdeletearray.push(this.editarray[index].id)
    //   this.editarray.splice(index, 1)
    // },

    //取得資料
    getdata() {
      this.isbusy = true
      var access_token_val = this.$cookies.get('access_token')
      ScheduleOEEallAPI.get({
        headers: {
          workShopId: this.scearchworkshop,
          timeRange: this.scearchtime,
          access_token: access_token_val
        }
      }).then(
        res => {
          this.ScheduleTtimedata = JSON.parse(JSON.stringify(res.data)) //原始資料
          var temparray = []
          if (res.data != null) {
            res.data.forEach(item => {
              temparray.push(item)
            })
            this.standby_total = this.dealThousands('0', temparray.length)
          }

          this.totalRows = temparray.length
          this.tabledata = this.dealtabletim(JSON.parse(JSON.stringify(temparray)))

          this.passchartdata = temparray
          this.setfooternum()
          this.isbusy = false
        },
        error => {
          this.totalRows = 0
          this.setfooternum()
          this.isbusy = false
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //設定顯示第 0 到第 0 條紀錄，總共 0 條紀錄
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
    //處理table time
    dealtabletim(data) {
      if (data.length != 0) {
        data.forEach(item => {
          item.endTimechart = JSON.parse(JSON.stringify(item.endTime))
          item.startTimechart = JSON.parse(JSON.stringify(item.startTime))
          item.startTimetable = this.timeStampToStringFunc(item.startTime, 'yyyy-mm-dd hh:mm')
          item.endTimetable = this.timeStampToStringFunc(item.endTime, 'yyyy-mm-dd hh:mm')
        })
      }

      return data
    },

    resetInfoModal() {
      this.infoModal.title = ''
      this.infoModal.content = ''
    },
    //搜尋更換chart圖
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering

      this.passchartdata = JSON.parse(JSON.stringify(filteredItems))
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    timestringtodatetimeloacl(value) {
      value = value.substring(0, 10) + 'T' + value.substring(11, value.length)
      return value
    },
    //編輯初始化
    editwindow(data) {
      this.firstedit = true //設定falg避免CT被刷成mold的

      this.putscheduleobject = JSON.parse(JSON.stringify(data))
      this.putscheduleobject.startTime = this.timeStampToStringFunc(
        this.putscheduleobject.startTime,
        'yyyy-mm-ddThh:mm'
      )
      this.putscheduleobject.endTime = this.timeStampToStringFunc(
        this.putscheduleobject.endTime,
        'yyyy-mm-ddThh:mm'
      )
      this.getmoldmachine(data)
    },
    //編輯模具改變
    editmoldchange() {
      this.getmoldmachine(this.putscheduleobject)
    },
    //取得模具關聯設備
    getmoldmachine(data) {
      data.moldId
      var access_token_val = this.$cookies.get('access_token')
      ScheduleOEEplusMoldMachineAPI.get({
        headers: {
          access_token: access_token_val,
          id: data.moldId
        }
      }).then(
        res => {
          let temparray = []
          if (res.data != null) {
            res.data.forEach(item => {
              temparray.push({ value: item.id, text: item.machineNumber })
            })
          }
          this.editmachineobject = temparray
          this.putscheduleobject.update = false
          this.errormes = ''
          this.modaledit = true //顯示編輯視窗
        },
        error => {
          console.log(error)
          this.editmachineobject = []
          this.putscheduleobject.update = false
          this.errormes = ''
          this.modaledit = true //顯示編輯視窗
        }
      )
    },
    //編輯送出
    editsubmit() {
      let editsubmitflag = true
      if (parseFloat(this.putscheduleobject.moldCycleTime) < 0.1) {
        this.errormes = this.$t('mold_import_ct_error')
        editsubmitflag = false
      }
      if (parseFloat(this.putscheduleobject.qty) < 1) {
        this.errormes = this.$t('schedule_qty_error')
        editsubmitflag = false
      }
      if (editsubmitflag) {
        let temparray = []
        temparray.push(JSON.parse(JSON.stringify(this.putscheduleobject)))

        temparray[0].moldCycleTime = parseFloat(this.putscheduleobject.moldCycleTime)
        temparray[0].qty = parseInt(this.putscheduleobject.qty)
        temparray[0].startTime = this.stringToTimestampFunc(
          new Date(this.putscheduleobject.startTime)
        )
        temparray[0].endTime = this.stringToTimestampFunc(new Date(this.putscheduleobject.endTime))
        var moldarray = this.moldchange(this.putscheduleobject.moldId)

        temparray[0].moldGreenRange = moldarray[1]
        temparray[0].moldYellowRange = moldarray[2]
        this.editsubmitcallAPI(temparray)
      }
    },
    //編輯送出api
    editsubmitcallAPI(data) {
      let access_token_val = this.$cookies.get('access_token')
      ScheduleOEEmultieditAPI.put(JSON.stringify(data), {
        headers: {
          access_token: access_token_val
        }
      }).then(
        () => {
          this.errormes = ''
          this.modaledit = false
          this.$layer.msg(this.$t('scuccess'))
          this.getdata()
        },
        error => {
          this.errorArray = error.response.data.errorArray
        }
      )
    },

    moldchange(moldId) {
      var num = this.moldobject.length
      var temparray = [0, 0, 0]
      for (var i = 0; i < num; i++) {
        if (this.moldobject[i].value == moldId) {
          temparray[0] = this.moldobject[i].cycleTime
          temparray[1] = this.moldobject[i].greenRange
          temparray[2] = this.moldobject[i].yellowRange

          break
        }
      }
      return temparray
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
      this.scheduleobject.Id = this.checkisnull(this.scheduleobject.Id)
    },
    // 送出
    submitfunc() {
      var subitarray = {
        schedule: [],
        delete: []
      }
      this.editarray.forEach(item => {
        var tempobject = {
          id: item.id,
          scheduleSerial: item.scheduleSerial,
          moldId: item.moldId,
          moldName: item.moldName,
          moldNumber: item.moldNumber,
          materialId: item.materialId,
          materialNumber: item.materialNumber,
          materialName: item.materialName,
          maxDeadline: item.maxDeadline,
          machineId: item.machineId,
          machineNumber: item.machineNumber,
          machineName: item.machineNumber,
          moldCycleTime: parseFloat(item.moldCycleTime),
          startTime: this.stringToTimestampFunc(item.startTime),
          endTime: this.stringToTimestampFunc(item.endTime),
          update: item.update,
          qty: item.qty,
          status: item.status,
          createdTime: item.createdTime,
          moldYellowRange: item.moldYellowRange,
          moldGreenRange: item.moldGreenRange,
          workShopId: item.workShopId
        }
        subitarray.schedule.push(JSON.parse(JSON.stringify(tempobject)))
      })
      subitarray.delete = this.editdeletearray //f取得刪除值
      var access_token_val = this.$cookies.get('access_token')
      ScheduleChange(JSON.stringify(subitarray), {
        headers: {
          access_token: access_token_val
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
        }
      )
    },
    // 刪除
    deletemold() {
      var access_token_val = this.$cookies.get('access_token')

      ScheduleMultiAPI.delete({
        headers: {
          access_token: access_token_val,
          ids: this.selectedArrayToString(this.selected)
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
    },
    //複選
    onRowSelected(items) {
      this.selected = items
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
g > g > g > g > g > g > g > g > g > g > g > g > g > g > g > g > g > g > g > g > g > path {
  /* stroke-width: 0px; */
  /* outline: 1px solid black !important;
  outline-color: black !important;
  outline-style: solid !important;
  outline-width: 1px !important; */
}
.schedulepctableclass {
  max-height: calc(100vh - 270px) !important;
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
.text-center.tdstyle {
  border: 1px solid #f4f4f4;
  font-size: 14px;
  font-weight: 400;
  height: 39px;
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  font-family: 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
</style>
<style scoped>
.ui.selection.dropdown {
  min-height: 2.71428571em;
}

.tooltipConflictMain {
  padding: 0.25rem;
}
.tooltipConflict {
  position: relative;
  background: rgb(61, 145, 188);
  color: white;
  height: 20px !important;
  width: 20px !important;
  font-size: 15px;
  text-align: center;
  border-radius: 50%;
  /* display: inline-block; */
  border-bottom: 1px dotted black;
}

.tooltipConflict .tooltipConflictText {
  visibility: hidden;
  /* visibility: visible; */
  /* width: 190px; */
  background: rgb(61, 145, 188);
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 6px;
  top: 15px;
  right: 105%;
  white-space: nowrap;
  position: absolute;
  z-index: 1;
}

.tooltipConflict:hover .tooltipConflictText {
  visibility: visible;

  box-shadow: -2px 3px 2px 1px #cccccc;
}

.tooltip1 {
  /* z-index: 100; */
  top: -45px;
  right: -10px;
  position: relative;
  background: rgb(61, 145, 188);
  color: white;
  height: 20px !important;
  width: 20px !important;
  font-size: 15px;
  text-align: center;
  border-radius: 50%;
  /* display: inline-block; */
  border-bottom: 1px dotted black;
  float: right;
}

.tooltip1 .tooltiptext1 {
  visibility: hidden;
  /* visibility: visible; */
  width: 190px;
  background: rgb(61, 145, 188);
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 6px;
  top: 15px;
  right: 105%;

  position: absolute;
  z-index: 1;
}

.tooltip1:hover .tooltiptext1 {
  visibility: visible;

  box-shadow: -2px 3px 2px 1px #cccccc;
}
.headerspace.col {
  max-width: 20px !important;
  padding: 0px !important;
}
.newtype {
}
.newerrortype {
  background-color: #ffcccc;
}
.md-form {
  margin-top: 0px !important;
}
.btn.btn-sm {
  margin-top: 0px;
}
.moldnumberclass {
  max-width: 30px;
  text-align: center;
}
.modal-dialog {
  margin-left: 10%;
  margin-right: 10%;
}
/* .modal-content {
  width: 80vw;
} */
#mobile {
  display: none;
}
.input-group.mb-3 {
  position: relative;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}
.deitedeletebtm {
  position: relative;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
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
