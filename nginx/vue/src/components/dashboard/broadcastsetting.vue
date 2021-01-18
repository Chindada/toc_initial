<template>
  <b-container fluid>
    <mdb-card>
      <mdb-card-body>
        <!-- <div class="mx-3">
          <h2>推播設定</h2>
        </div>-->
        <b-col lg="16" class="my-1">
          <mdb-input
            style="width:50%"
            v-model="filter"
            type="search"
            id="filterInput"
            :placeholder="
              this.$t('broadcast_name') +
                '、' +
                this.$t('broadcast_monitor_item') +
                '、' +
                this.$t('broadcast_data_type') +
                '、' +
                this.$t('broadcast_trigger_condition2') +
                '、' +
                this.$t('broadcast_continued_time') +
                '、' +
                this.$t('actvite') +
                '/' +
                this.$t('disable')
            "
          >
            <span class="input-group-text" slot="prepend">{{ $t('search') }}</span>

            <!-- <mdb-btn size="sm" color="primary" :disabled="!filter" @click="filter = ''">清除</mdb-btn> -->
          </mdb-input>
        </b-col>
        <!-- 新增1 -->
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

        <!-- <mdb-btn size="sm" color="danger" :disabled="selected ? selected == 0 : false" @click.native="warning = true">刪除</mdb-btn> -->
        <b-table
          class="broadcastsettingpctableclass"
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
    <!-- 刪除確認 -->
    <mdb-modal centered :show="warning" @close="warning = false">
      <mdb-modal-header>
        <mdb-modal-title>{{ $t('warrning_title') }}</mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body>{{ $t('warrning_body') }}</mdb-modal-body>
      <mdb-modal-footer>
        <mdb-btn color="info" v-on:click="deletemold()" @close="closemodal($event)">{{
          $t('delete')
        }}</mdb-btn>
        <mdb-btn color="0000" @click.native="warning = false">{{ $t('close') }}</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
    <!-- end 刪除確認 -->
    <!-- 新增編輯推播設定 -->
    <mdb-modal centered :show="neweditmodal" @close="closemodal($event)">
      <form v-on:submit.prevent="submitfunc">
        <mdb-modal-header>
          <mdb-modal-title>{{ operate }} {{ $t('broadcast_setting') }}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <!-- 推播名稱 -->
          <mdb-input class="mb-3" v-model="broadcastobject.name" required>
            <span class="input-group-text" slot="prepend">
              <span class="requileclass">*</span>
              {{ $t('broadcast_name') }}
            </span>
          </mdb-input>

          <!-- 監控目標-->
          <div>
            <div class="input-group" style="margin-bottom: 1rem">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">
                  <span class="requileclass">*</span>
                  {{ $t('broadcast_monitor_item') }}
                </label>
              </div>
              <b-form-select
                v-model="broadcastobject.monitorType"
                :options="monitorTypeocject"
                required
              ></b-form-select>
            </div>
          </div>

          <b-row class="mb-3">
            <b-col>
              <div class="input-group">
                <div class="input-group-prepend">
                  <label class="input-group-text" for="inputGroupSelect01">
                    <span class="requileclass">*</span>
                    {{ $t('broadcast_monitor_item') }}
                  </label>
                </div>
                <div class="form-control selsect">
                  <mdb-select
                    :selectAllPlaceholder="this.$t('select_all')"
                    multiple
                    search
                    selectAll
                    :options="monitorsoprions"
                  />
                </div>
              </div>
            </b-col>
          </b-row>
          <!-- <div>
            <div class="input-group" style="margin-bottom: 1rem">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">
                  <span class="requileclass">*</span>
                  {{ $t('broadcast_monitor_item') }}
                </label>
              </div>
              <el-select
                required
                v-model="broadcastobject.monitorsarray"
                multiple
                placeholder
                style="flex: 9999;"
                v-if="test1"
              >
                <el-option
                  v-for="item in monitorsoprions"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>-->
          <!-- 數據類型-->
          <div>
            <div class="input-group" style="margin-bottom: 1rem">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">
                  <span class="requileclass">*</span>
                  {{ $t('broadcast_data_type') }}
                </label>
              </div>
              <b-form-select
                v-model="broadcastobject.mode"
                :options="modeocject"
                required
              ></b-form-select>
            </div>
          </div>
          <!-- 數據類型UAPS 條件-->
          <div v-if="UAPSrange">
            <mdb-input
              class="mb-3"
              v-model="broadcastobject.timeRange"
              required
              :min="5"
              :max="288"
              :step="1"
              type="number"
              @focus="focus($event)"
            >
              <span class="input-group-text" slot="prepend">
                <span class="requileclass">*</span>
                {{ $t('broadcast_uaps_range') }}(min)
              </span>
            </mdb-input>
          </div>
          <!-- 條件(大於小於)-->
          <div>
            <div class="input-group" style="margin-bottom: 1rem">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">
                  <span class="requileclass">*</span>
                  {{ $t('broadcast_trigger_condition1') }}
                </label>
              </div>
              <b-form-select
                v-model="broadcastobject.operator"
                :options="operatorobject"
                required
                :disabled="broadcastobject.operatorflag"
              ></b-form-select>
            </div>
          </div>
          <!-- UAPS -->
          <mdb-input
            v-if="broadcastobject.mode <= 4 && broadcastobject.mode != 3"
            class="mb-3"
            v-model="broadcastobject.settingValue"
            required
            min="0"
            max="100"
            step="0.1"
            type="number"
            @focus="focus($event)"
          >
            <span class="input-group-text" slot="prepend">
              <span class="requileclass">*</span>
              <span style="opacity:0">-</span>
              <span>% / min </span>
            </span>
          </mdb-input>
          <!-- P -->
          <mdb-input
            v-if="broadcastobject.mode == 3"
            class="mb-3"
            v-model="broadcastobject.settingValue"
            required
            min="0"
            max="200"
            step="0.1"
            type="number"
            @focus="focus($event)"
          >
            <span class="input-group-text" slot="prepend">
              <span class="requileclass">*</span>
              <span style="opacity:0">-</span>
              <span>% / min </span>
            </span>
          </mdb-input>
          <!-- 其他 -->
          <mdb-input
            v-if="broadcastobject.mode > 4"
            class="mb-3"
            v-model="broadcastobject.settingValue"
            required
            min="5"
            max="270"
            step="5"
            type="number"
            @focus="focus($event)"
          >
            <span class="input-group-text" slot="prepend">
              <span class="requileclass">*</span>
              <span style="opacity:0">-</span>
              <span>% / min </span>
            </span>
          </mdb-input>
          <!-- 持續時間 -->
          <mdb-input
            class="mb-3"
            v-model="broadcastobject.duration"
            required
            :min="5"
            :max="60"
            :step="5"
            type="number"
            @focus="focus($event)"
          >
            <span class="input-group-text" slot="prepend">
              <span class="requileclass">*</span>
              {{ $t('broadcast_continued_time') }}
            </span>
          </mdb-input>
          <!-- 有效時間 -->

          <div>
            <div class="input-group" style="margin-bottom: 1rem">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">
                  <span class="requileclass">*</span>
                  {{ $t('broadcast_forever') }}
                </label>
              </div>
              <mdb-input
                type="checkbox"
                id="checkbox1"
                name="check1"
                v-model="broadcastobject.effecttimeflag"
              />
            </div>
          </div>

          <div>
            <!-- 有效開始時間 -->

            <div>
              <div class="input-group" style="margin-bottom: 1rem;width: 100%;">
                <div class="input-group-prepend" style=" float: left;">
                  <label class="input-group-text" for="inputGroupSelect01">
                    <span class="requileclass">*</span>
                    {{ $t('broadcast_effective_starttime') }}
                  </label>
                </div>
                <input
                  :disabled="broadcastobject.effecttimeflag"
                  type="datetime-local"
                  style="float: right;border: 1px solid #ced4da;border-top-right-radius:5px;border-bottom-right-radius:5px; flex: 9999;"
                  v-model="broadcastobject.startTime"
                />
              </div>
            </div>

            <!-- 有效結束時間 -->

            <div>
              <div class="input-group" style="margin-bottom: 1rem;width: 100%;">
                <div class="input-group-prepend" style=" float: left;">
                  <label class="input-group-text" for="inputGroupSelect01">
                    <span class="requileclass">*</span>
                    {{ $t('broadcast_effective_endtime') }}
                  </label>
                </div>
                <input
                  :disabled="broadcastobject.effecttimeflag"
                  type="datetime-local"
                  style="float: right;border: 1px solid #ced4da;border-top-right-radius:5px;border-bottom-right-radius:5px; flex: 9999;"
                  v-model="broadcastobject.endTime"
                />
              </div>
            </div>
          </div>
          <!-- 提示類型-->
          <div>
            <div class="input-group" style="margin-bottom: 1rem">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">
                  <span class="requileclass">*</span>
                  {{ $t('broadcast_prompt_type') }}
                </label>
              </div>
              <b-form-select
                v-model="broadcastobject.alarmType"
                :options="alarmTypeopbject"
                required
                :disabled="monitorTypedisable"
              ></b-form-select>
            </div>
          </div>
          <!-- 發送對象-->
          <div>
            <div class="input-group" style="margin-bottom: 1rem">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">
                  <span class="requileclass">*</span>
                  {{ $t('broadcast_send_object') }}
                </label>
              </div>
              <b-form-select
                v-model="broadcastobject.receiver"
                :options="receiverobject"
                required
                :disabled="monitorTypedisable"
              ></b-form-select>
            </div>
          </div>
          <!-- 啟用 -->
          <div class="input-group" style="margin-bottom: 1rem">
            <div class="input-group-prepend">
              <label class="input-group-text" for="inputGroupSelect01">
                <span class="requileclass">*</span>
                {{ $t('actvite') }}
              </label>
            </div>
            <b-form-select
              v-model="broadcastobject.isEnable"
              :options="isEnableoption"
              required
            ></b-form-select>
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

    <!--end 新增編輯推播設定 -->
  </b-container>
</template>

<script>
import { WorkShopAPI, gmachineSelectAPI } from '@/plugins/basicapis.js'
import naturalCompare from 'string-natural-compare'
import { NotifyAPI, NotifyDeleteMultiAPI } from '@/plugins/dashboardapis.js'
import { mapState } from 'vuex'
export default {
  components: {},
  data() {
    var defectobject = {
      Id: 0,
      name: '',
      case: '',
      type: 1,
      isDelete: false
    }

    var type = [
      { text: this.$t('quality'), value: 1 }, //品檢
      { text: this.$t('storage'), value: 2 }, //入庫
      { text: this.$t('mold'), value: 3 }, //模具
      { text: this.$t('machine'), value: 4 }, //設備
      { text: this.$t('material'), value: 5 }, //原料
      { text: this.$t('employee'), value: 6 }, //人員
      { text: this.$t('machine_material_type_other'), value: 999 } //其他
    ]
    var defectobjectnull = JSON.parse(JSON.stringify(defectobject))
    var broadcastobject = {
      id: 0,
      name: '', //推播名稱
      monitorType: 1, //監控目標類型(1廠區、2設備)
      monitors: '', //監控目標"[1,2,3]"
      monitorsarray: [], //監控目標"[1,2,3] array"
      mode: 1, //數據類型 (1U、2A、3P、4S、5閒置、6異常、7停機)
      operator: 1, //觸發條件(1小於、2大於)
      operatorflag: false, //觸發條件disable flag
      settingValue: 0, //觸發條件(if UAPS float) (if 時間 millionsec)
      duration: 5, //持續時間，millionsec
      effecttimeflag: true, //有效時間falg
      startTime: '', //有效時間，millionsec，-1為永久endTime為0，
      endTime: '', //有效時間，millionsec
      alarmType: 1, //提示類型(1閃爍，2閃爍+聲音)
      receiver: 1, //發送對象(1全場看板，2單站看板)
      timeRange: 5, //UAPU間隔時間(5~288min) millionsec(300000~1036800000)
      isEnable: false //啟用停用
    }
    var isEnableoption = [
      { text: this.$t('disable'), value: false }, //停用
      { text: this.$t('actvite'), value: true } //啟用
    ]
    var monitorTypeocject = [
      { value: 1, text: this.$t('workshop') }, //廠區
      { value: 2, text: this.$t('machine') } //設備
    ]
    var modeocject = [
      { value: 1, text: 'U' },
      { value: 2, text: 'A' },
      { value: 3, text: 'P' },
      { value: 4, text: 'S' }
    ]
    var modeocjectmachine = [
      { value: 1, text: 'U' },
      { value: 2, text: 'A' },
      { value: 3, text: 'P' },
      { value: 4, text: 'S' },
      { value: 5, text: this.$t('title_idle') }, //閒置
      { value: 6, text: this.$t('title_error') }, //異常
      { value: 7, text: this.$t('title_shutdown') } //停機
    ]
    var modeocjectgroup = [
      { value: 1, text: 'U' },
      { value: 2, text: 'A' },
      { value: 3, text: 'P' },
      { value: 4, text: 'S' }
    ]
    var operatorobject = [
      { text: this.$t('less_than'), value: 1 }, //小於
      { text: this.$t('more_than'), value: 2 } //大於
    ]
    var alarmTypeopbject = [
      { text: this.$t('alerttype1'), value: 1 }, //閃爍
      { text: this.$t('alerttype2'), value: 2 } //閃爍+聲音
    ]
    var receiverobject = [
      { text: this.$t('receiverworkshop'), value: 1 },
      { text: this.$t('dashboard_station'), value: 2 }
    ]
    var broadcastobjectnull = JSON.parse(JSON.stringify(broadcastobject))
    var settingValue = {
      min: 0,
      max: 100,
      step: 0.1
    }

    return {
      page_first: 0, //第一條
      page_last: 0, //最後一筆
      page_total: 0, //總共筆數
      isbusy: true,
      isEnableoption,
      editfirstflag: false, //第一次編輯
      monitorTypedisable: true, //監控目標廠區關閉提示類型、發送對象
      modeocjectmachine, //設備模式選單
      modeocjectgroup, //廠區模式選單
      test1: false,
      UAPSrange: true, //UAPS範圍顯示
      editiniflag: false, //編輯初始化
      receiverobject, //發送對象選單
      alarmTypeopbject, //提示類型選單
      settingValue, //觸發條件參數
      operatorobject, //觸發條件大於小於
      modeocject, //數據類型選單
      monitorTypeocject, //監控目標選單
      test: [],
      workshopoption: [], //廠區選項
      machineoption: [], //設備選項
      broadcastobjectnull,
      broadcastobject,
      newbtm: false, //新增
      editbtm: false, //編輯
      deletebtm: false, //刪除
      customize1: false, //自定義一
      customize2: false, //自定義二
      customize3: false, //自定義三
      type,
      deletebundisable: true,
      selected: [],
      defectobject,
      defectobjectnull,
      operate: '',
      warning: false,
      neweditmodal: false,
      tabledata: [],
      fields: [
        {
          key: 'name',
          label: this.$t('broadcast_name'), //'推播名稱',
          sortDirection: 'desc',
          class: 'text-center',
          formatter: value => {
            return value
          },
          sortable: true,
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'monitorTypeshow',
          label: this.$t('broadcast_monitor_item'), //'監控目標',
          sortDirection: 'desc',
          class: 'text-center',
          sortable: true,
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'modeshow',
          label: this.$t('broadcast_data_type'), //'數據類型',
          sortable: true,
          class: 'text-center',
          sortable: true,
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'operatorshow',
          label: this.$t('broadcast_trigger_condition2'), //'觸發條件',
          sortDirection: 'desc',
          class: 'text-center',
          sortable: true,
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'durationshow',
          label: this.$t('broadcast_continued_time'), //'持續時間',
          sortDirection: 'desc',
          class: 'text-center',
          sortable: true,
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'startTimeshow',
          label: this.$t('broadcast_effective_time'), //'有效時間',
          sortDirection: 'desc',
          class: 'text-center',
          sortable: true,
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'alarmTypeshow',
          label: this.$t('broadcast_prompt_type'), //'提示類型',
          sortDirection: 'desc',
          class: 'text-center',
          sortable: true,
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'receivershow',
          label: this.$t('broadcast_send_object'), //'發送對象',
          sortDirection: 'desc',
          class: 'text-center',
          sortable: true,
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'isEnableshow',
          label: this.$t('actvite') + '/' + this.$t('disable'), //'啟用/停用',
          sortDirection: 'desc',
          class: 'text-center',
          sortable: true,
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
      filterOn: [
        'name',
        'monitorTypeshow',
        'modeshow',
        'operatorshow',
        'durationshow',
        'isEnableshow'
      ],
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
  watch: {
    currentPage: function() {
      this.setfooternum() //設定頁數
    },
    perPage: function() {
      this.setfooternum() //設定頁數
    },
    neweditmodal: function(value) {
      if (!value) {
        this.test1 = value
      }
    },
    //監控目標改變
    'broadcastobject.monitorType': function(value) {
      if (!this.editiniflag) {
        this.broadcastobject.monitorsarray = null //監控目標清空
      }
      if (value == 1) {
        //廠區
        this.monitorTypedisable = true
        this.modeocject = JSON.parse(JSON.stringify(this.modeocjectgroup))
        this.monitorsoprions = JSON.parse(JSON.stringify(this.workshopoption))
      } else if (value == 2) {
        //設備

        this.monitorTypedisable = false
        this.modeocject = JSON.parse(JSON.stringify(this.modeocjectmachine))
        this.monitorsoprions = JSON.parse(JSON.stringify(this.machineoption))
      }
      if (this.editfirstflag) {
        this.setselectedvalue() //設定預設值
      } else {
        this.iniselsect() //恢復預設
      }
      this.editfirstflag = false
    },

    //數據類型改變
    'broadcastobject.mode': function(value) {
      if (!this.editiniflag) {
        if (value <= 4) {
          this.UAPSrange = true
          this.broadcastobject.settingValue = 0
          this.settingValue.min = '0'
          if (value == 3) {
            this.settingValue.max = '200'
          } else {
            this.settingValue.max = '100'
          }
          this.settingValue.step = 0.1
          this.broadcastobject.operatorflag = false
          this.broadcastobject.operator = 1
        } else {
          this.UAPSrange = false
          this.broadcastobject.operatorflag = true
          this.broadcastobject.operator = 2
          this.broadcastobject.settingValue = 5
          this.settingValue.min = '5' //最小5min
          this.settingValue.max = '720' //最大12hr
          this.settingValue.step = 5 //每5分鐘一單位
        }
      }
    },
    'broadcastobject.effecttimeflag': function(value) {
      if (value) {
        //永久
        this.broadcastobject.startTime = -1
        this.broadcastobject.endTime = 0
      } else {
        this.broadcastobject.startTime = this.timeStampToStringFunc(
          Math.floor(new Date()),
          'yyyy-mm-ddThh:mm'
        )
        this.broadcastobject.endTime = this.timeStampToStringFunc(
          Math.floor(new Date()) + 86400000,
          'yyyy-mm-ddThh:mm'
        )
      }
    },
    'broadcastobject.id': function() {
      if (this.editiniflag) {
        this.editiniflag = false
      }
    }
  },
  mounted() {
    // Set the initial number of items
    // this.totalRows = this.items.length;
  },
  created() {
    this.getworkshop()
    this.getmachine()
    this.iniright()
    this.getdata()
  },
  methods: {
    //設定權限
    iniright() {
      this.authority.forEach(item => {
        if (item.name == 'broadcast_setting') {
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
    //多選恢復預設
    iniselsect() {
      if (this.monitorsoprions != []) {
        this.monitorsoprions.forEach(item => {
          item.selected = false
        })
      }
    },
    //取得多選的值
    getvalue() {
      var tempval = []
      if (this.monitorsoprions.length != 0) {
        this.monitorsoprions.forEach(item => {
          if (item.selected) {
            tempval.push(item.value)
          }
        })
      }

      this.broadcastobject.monitorsarray = tempval
    },

    //點選反白
    focus(event) {
      event.currentTarget.select()
    },
    //取得廠區
    getworkshop() {
      var access_token_val = this.$cookies.get('access_token')
      WorkShopAPI.get({
        headers: {
          // 'Cache-Control': 'no-cache',
          access_token: access_token_val
        }
      }).then(
        res => {
          if (res.data != null) {
            res.data.forEach(item => {
              this.workshopoption.push({ text: item.name, value: item.id, selected: false })
            })
          }
          this.monitorsoprions = this.workshopoption //預設監控目標選項為廠區
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
            res.data.sort((a, b) => naturalCompare(a.machineNumber, b.machineNumber))

            res.data.forEach(item => {
              this.machineoption.push({ text: item.machineNumber, value: item.id, selected: false })
            })
          }
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //取得推播設定
    getdata() {
      var access_token_val = this.$cookies.get('access_token')
      NotifyAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          if (res.data != null) {
            let temparray = this.dealorgdata(res.data)
            this.tabledata = temparray
            this.totalRows = temparray.length
          } else {
            this.tabledata = []
            this.totalRows = 0
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
    //處理原始資料
    dealorgdata(data) {
      let temparray = []
      data.forEach(item => {
        //啟用停用
        if (!item.isEnable) {
          item.isEnableshow = this.$t('disable')
        } else {
          item.isEnableshow = this.$t('actvite')
        }
        if (item.startTime == -1) {
          item.startTimeshow = this.$t('broadcast_forever')
        } else {
          //時間範圍
          item.startTimeshow =
            this.timeStampToStringFunc(item.startTime, 'yyyy-mm-dd hh:mm') +
            ' - ' +
            this.timeStampToStringFunc(item.endTime, 'yyyy-mm-dd hh:mm')
        }
        //監控目標
        this.monitorTypeocject.forEach(item1 => {
          if (item.monitorType == item1.value) {
            item.monitorTypeshow = item1.text
          }
        })
        //數據類型
        this.modeocjectmachine.forEach(item1 => {
          if (item.mode == item1.value) {
            item.modeshow = item1.text
          }
        })
        //觸發條件
        let tempval = ''
        this.operatorobject.forEach(item1 => {
          if (item.operator == item1.value) {
            tempval = item1.text
          }
        })
        if (item.mode < 5) {
          tempval += ' ' + item.settingValue + ' %'
        } else {
          tempval += ' ' + this.timestampmintime(item.settingValue)
        }
        item.operatorshow = tempval
        //持續時間
        item.durationshow = this.timestampmintime(item.duration)
        //提示類型
        this.alarmTypeopbject.forEach(item1 => {
          if (item.alarmType == item1.value) {
            item.alarmTypeshow = item1.text
          }
        })
        //發送對象
        this.receiverobject.forEach(item1 => {
          if (item.receiver == item1.value) {
            item.receivershow = item1.text
          }
        })

        temparray.push(item)
      })
      return temparray
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

    //timestamp 轉 min
    timestampmintime(value) {
      value /= 1000
      var timeint = parseInt(value)
      var min = Math.floor(timeint / 60)
      var timeString = ''
      timeString = min + ' min'
      return timeString
    },

    //modal背景點擊不關閉
    closemodal(value) {
      if (value == undefined) {
        this.warning = false
        this.neweditmodal = false
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
        this.editfirstflag = true
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
    //設定多選
    setselectedvalue() {
      if (this.monitorsoprions != []) {
        this.monitorsoprions.forEach(item => {
          if (this.broadcastobject.monitorsarray.includes(item.value)) {
            item.selected = true
          } else {
            item.selected = false
          }

          // if(item.val)
        })
      }
    },
    //編輯
    editwindow(item) {
      this.editiniflag = true
      var tempitem = JSON.parse(JSON.stringify(item))
      this.broadcastobject = JSON.parse(JSON.stringify(this.broadcastobjectnull))
      this.broadcastobject.name = tempitem.name //推播名稱
      this.broadcastobject.monitorType = tempitem.monitorType //監控目標類型
      var temparray = tempitem.monitors.substring(1, tempitem.monitors.length - 1).split(',')
      this.broadcastobject.monitorsarray = temparray.map(el => parseInt(el)) //選擇目標
      this.broadcastobject.monitors = '' //tempitem.monitors
      this.broadcastobject.mode = tempitem.mode //數據類型
      this.broadcastobject.timeRange = tempitem.timeRange / 60000 //UAPS範圍
      this.broadcastobject.operator = tempitem.operator //觸發條件 大於小於
      if (this.broadcastobject.mode <= 4) {
        this.broadcastobject.settingValue = tempitem.settingValue
        this.settingValue.min = 0
        this.settingValue.max = 100
        this.settingValue.step = 0.1
        this.broadcastobject.operatorflag = false
      } else {
        this.broadcastobject.settingValue = tempitem.settingValue / 60000
        this.settingValue.min = 5 //最小5min
        this.settingValue.max = 720 //最大12hr
        this.settingValue.step = 5 //每5分鐘一單位
        this.broadcastobject.operatorflag = true
      }
      this.broadcastobject.duration = tempitem.duration / 60000
      if (tempitem.startTime == -1) {
        this.broadcastobject.effecttimeflag = true

        // this.broadcastobject.startTime = tempitem.startTime //開始時間初始化
        // this.broadcastobject.endTime = tempitem.endTime//結束時間初始化
      } else {
        this.broadcastobject.effecttimeflag = false
        this.broadcastobject.startTime = this.timeStampToStringFunc(
          tempitem.startTime,
          'yyyy-mm-ddThh:mm'
        )
        this.broadcastobject.endTime = this.timeStampToStringFunc(
          tempitem.endTime,
          'yyyy-mm-ddThh:mm'
        )
      }
      this.broadcastobject.alarmType = tempitem.alarmType
      this.broadcastobject.receiver = tempitem.receiver
      this.broadcastobject.isEnable = tempitem.isEnable

      // console.log(this.broadcastobject.monitorsarray)
      // console.log(this.monitorsoprions)

      this.broadcastobject.id = tempitem.id //id
      if (this.broadcastobject.mode >= 5) {
        this.UAPSrange = false
      }

      this.neweditmodal = true //顯示視窗
      this.sleep(300).then(() => {
        this.test1 = true
      })
    },

    newwindow() {
      this.broadcastobject = JSON.parse(JSON.stringify(this.broadcastobjectnull))
      this.neweditmodal = true //顯示視窗
      this.sleep(300).then(() => {
        this.test1 = true
      })
    },
    sleep(time) {
      return new Promise(resolve => setTimeout(resolve, time))
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
    //處理資料
    dealdata(data) {
      var tempdata = JSON.parse(JSON.stringify(data))
      //處理監控目標
      tempdata.monitors = '['
      tempdata.monitorsarray.forEach(item => {
        tempdata.monitors += item + ','
      })
      tempdata.monitors = tempdata.monitors.substring(0, tempdata.monitors.length - 1) + ']'
      //觸發條件轉num
      tempdata.settingValue = Number(tempdata.settingValue)
      if (tempdata.mode >= 5) {
        tempdata.settingValue = tempdata.settingValue * 60000
      }
      //持續時間轉num
      tempdata.duration = Number(tempdata.duration)
      if (tempdata.duration < 5) {
        tempdata.duration = 5
      } else if (tempdata.duration > 60) {
        tempdata.duration = 60
      }
      tempdata.duration = tempdata.duration * 60000
      //有效時間
      if (tempdata.effecttimeflag) {
        //永久
        tempdata.startTime = -1
        tempdata.endTime = 0
      } else {
        tempdata.startTime = this.stringToTimestampFunc(tempdata.startTime)
        tempdata.endTime = this.stringToTimestampFunc(tempdata.endTime)
      }
      tempdata.timeRange = tempdata.timeRange * 60000 //UAPS範圍k
      return tempdata
    },

    // 送出
    submitfunc() {
      this.getvalue() //取得監控目標選單
      if (this.broadcastobject.monitorsarray.length != 0) {
        var submititem = this.dealdata(this.broadcastobject)
        if (this.broadcastobject.id == 0) {
          //新增
          this.newapi(submititem)
        } else {
          //編輯
          this.editapi(submititem)
        }
      }
    },
    //新增
    newapi(data) {
      var access_token_val = this.$cookies.get('access_token')
      NotifyAPI.post(JSON.stringify(data), {
        headers: {
          access_token: access_token_val
        }
      }).then(
        () => {
          this.$layer.msg(this.$t('scuccess'))
          this.neweditmodal = false
          // 重載資料
          this.isbusy = true
          this.getdata()
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
          this.neweditmodal = false
        }
      )
    },
    //編輯
    editapi(data) {
      var access_token_val = this.$cookies.get('access_token')
      NotifyAPI.put(JSON.stringify(data), {
        headers: {
          access_token: access_token_val
        }
      }).then(
        () => {
          this.$layer.msg(this.$t('scuccess'))
          this.neweditmodal = false
          // 重載資料
          this.isbusy = true
          this.getdata()
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
          this.neweditmodal = false
        }
      )
    },
    // 刪除
    deletemold() {
      if (this.selected != null) {
        var access_token_val = this.$cookies.get('access_token')

        NotifyDeleteMultiAPI.delete({
          headers: {
            access_token: access_token_val,
            ids: this.selectedArrayToString(this.selected)
          }
        }).then(
          () => {
            this.$layer.msg(this.$t('scuccess'))
            this.modal = false
            this.warning = false
            this.isbusy = true
            this.getdata()
          },
          error => {
            console.log(error.response)
            this.$layer.msg(this.$t('fail') + error.response.data.response)
            this.modal = false
            this.warning = false
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
.broadcastsettingpctableclass {
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
