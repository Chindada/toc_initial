<template>
  <div style="marginTop: 1vh">
    <mdb-card>
      <div v-show="chartshowflag" style="margin: 10px">
        <b-container fluid>
          <b-row v-if="ganttEdit" class="align-items-center">
            <b-col cols="12" sm="12" lg="6" xl="3">
              <mdb-btn
                class="mr-4"
                v-show="backupAllmachine == null && !onMouseDownFirst"
                size="lg"
                color="primary"
                v-on:click="yAxisSort()"
                icon=""
                style="padding:0.5rem"
                :disabled="onMouseDownFirst || backupAllmachine != null"
                >{{ $t('machine') }}
                <i
                  v-if="categoryAxis && categoryAxis.renderer.inversed"
                  class="fas fa-sort-amount-up-alt"
                ></i>
                <i
                  v-else-if="categoryAxis && !categoryAxis.renderer.inversed"
                  class="fas fa-sort-amount-down"
                ></i>
              </mdb-btn>
              <mdb-btn
                class="mr-4"
                v-show="backupAllmachine != null && !onMouseDownFirst"
                size="lg"
                color="red"
                v-on:click="setBackupAllMachine()"
                icon=""
                style="padding:0.5rem"
                >{{ $t('machine') }}
                <i class="fas fa-random"></i>
              </mdb-btn>
              <mdb-btn
                size="lg"
                color="mdb-color"
                v-on:click="editGantt(1)"
                icon=""
                style="padding:0.5rem"
              >
                {{ $t('refresh') }}</mdb-btn
              >
              <mdb-btn
                size="lg"
                color="white"
                v-on:click="editGantt(2)"
                icon=""
                style="padding:0.5rem"
                :disabled="!dragObj"
                v-if="tabType == 3 && dragObj != null"
                >{{ $t('cancel') }}</mdb-btn
              >
              <mdb-btn
                size="lg"
                color="primary"
                v-on:click="beforeModal()"
                icon=""
                style="padding:0.5rem"
                :disabled="dragObjArray.length < 1"
                v-if="tabType == 3"
                >{{ $t('submit') }}</mdb-btn
              >
            </b-col>
            <b-col cols="12" sm="12" lg="6" xl="2" offset-xl="1">
              <div class="input-group">
                <div class="input-group-prepend">
                  <label class="input-group-text" for="inputGroupSelect01">
                    {{ $t('time_unit') }}
                  </label>
                </div>
                <b-form-select v-model="scrollTimeUnit" :options="timeOptions"> </b-form-select>
              </div>
            </b-col>
            <b-col cols="12" sm="12" lg="6" xl="3">
              <div class="input-group">
                <div class="input-group-prepend">
                  <label class="input-group-text" for="inputGroupSelect01">
                    {{ $t('gantt_sttime') }}
                  </label>
                </div>
                <b-form-input type="datetime-local" required v-model="scrollMinZoomed" />
              </div>
            </b-col>
            <b-col cols="12" sm="12" lg="6" xl="3">
              <div class="input-group">
                <div class="input-group-prepend">
                  <label class="input-group-text" for="inputGroupSelect01">
                    {{ $t('gantt_endtime') }}
                  </label>
                </div>
                <b-form-input
                  type="datetime-local"
                  required
                  v-model="scrollMaxZoomed"
                  :disabled="true"
                />
              </div>
            </b-col>
          </b-row>
        </b-container>
        <div
          class="ganttChart"
          ref="chartdiv"
          @mousedown="mouseDown($event)"
          @mousemove="mouseMove($event)"
          @mouseup="mouseUp($event)"
        ></div>
        <!-- 編輯排程 -->
        <mdb-modal v-if="modal" @close="modal = false" size="lg" class="editmodal">
          <form v-on:submit.prevent="saveModal">
            <mdb-modal-header>
              <mdb-modal-title>{{ $t('schedule') }}</mdb-modal-title>
            </mdb-modal-header>
            <mdb-modal-body>
              <b-table responsive bordered :items="dragObjArray" :fields="fields" ref="editTable">
                <template v-slot:cell(moldCycleTime)="row">
                  <b-form-input
                    class="inputCenter"
                    type="number"
                    :show="modal"
                    required
                    :step="0.1"
                    :min="0.1"
                    v-model="row.item.moldCycleTime"
                  />
                </template>
                <template v-slot:cell(machineNumber)="row">
                  <b-form-select
                    v-model="row.item.machineId"
                    :options="row.item.machinearray"
                    required
                    class="inputCenter"
                  ></b-form-select>
                </template>
                <template v-slot:cell(startTime)="row">
                  <b-form-input
                    class="inputCenter"
                    type="datetime-local"
                    :show="modal"
                    required
                    v-model="row.item.startTime"
                    :max="row.item.endTime"
                    @change="timeInputChange(row.item)"
                  />
                </template>
                <template v-slot:cell(endTime)="row">
                  <b-form-input
                    class="inputCenter"
                    type="datetime-local"
                    :show="modal"
                    required
                    v-model="row.item.endTime"
                    :min="row.item.startTime"
                    @change="timeInputChange(row.item)"
                  />
                </template>
                <template v-slot:cell(remark)="row">
                  <b-form-input type="text" v-model="row.item.remark" />
                </template>
                <template v-slot:cell(actions)="row">
                  <mdb-btn
                    size="sm"
                    type="button"
                    color="danger"
                    class="deitedeletebtm"
                    @click="deleteRow(row.index)"
                    icon="times"
                    style="padding:0.5rem"
                  ></mdb-btn>
                </template>
              </b-table>
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
        <!-- 排程衝突 -->
        <mdb-modal
          v-if="scheduleConflict"
          @close="scheduleConflict = false"
          size="lg"
          class="editmodal"
        >
          <form>
            <mdb-modal-header>
              <mdb-modal-title>{{ $t('schedule') }}</mdb-modal-title>
            </mdb-modal-header>
            <mdb-modal-body>
              <b-table
                responsive
                bordered
                :items="scheduleConflictArray"
                :fields="scheduleConflictfields"
              >
                <template v-slot:cell(moldConflict)="row">
                  <template v-if="row.item.moldConflict.length > 0">
                    <div
                      v-for="(item, index) in row.item.moldConflict"
                      :key="index"
                      class="tooltipConflictMain"
                    >
                      {{ item.scheduleNumber }}
                      <span style="display: inline-block">
                        <div class="tooltipConflict">
                          ?
                          <div class="tooltipConflictText" style="text-align:left">
                            <div>{{ $t('schedule_start_time') }} : {{ item.startTime }}</div>
                            <div>{{ $t('schedule_end_time') }} : {{ item.endTime }}</div>
                          </div>
                        </div>
                      </span>
                    </div>
                  </template>
                  <template v-else>
                    {{ '-' }}
                  </template>
                </template>
                <template v-slot:cell(machineConflict)="row">
                  <template v-if="row.item.machineConflict.length > 0">
                    <div
                      v-for="(item, index) in row.item.machineConflict"
                      :key="index"
                      class="tooltipConflictMain"
                    >
                      {{ item.scheduleNumber }}
                      <span style="display: inline-block">
                        <div class="tooltipConflict">
                          ?
                          <div class="tooltipConflictText" style="text-align:left">
                            <div>{{ $t('schedule_start_time') }} : {{ item.startTime }}</div>
                            <div>{{ $t('schedule_end_time') }} : {{ item.endTime }}</div>
                          </div>
                        </div>
                      </span>
                    </div>
                  </template>
                  <template v-else>
                    {{ '-' }}
                  </template>
                </template>
              </b-table>
            </mdb-modal-body>
            <mdb-modal-footer>
              <mdb-btn color="0000" @click.native="scheduleConflict = false" type="button">
                {{ $t('close') }}
              </mdb-btn>
            </mdb-modal-footer>
          </form>
        </mdb-modal>
      </div>
    </mdb-card>
    <div class="image-container" v-show="!chartshowflag">
      <img
        alt="AIOM"
        class="img-center"
        width="100px"
        height="100px"
        src="../../../assets/loading-1.gif"
      />
    </div>
    <!-- 排程衝突 -->
    <error-tab :errorArray="errorArray"> </error-tab>
  </div>
</template>

<script>
import * as am4core from '@amcharts/amcharts4/core'
import * as am4charts from '@amcharts/amcharts4/charts'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'
import naturalCompare from 'string-natural-compare'
import { gmachineSelectAPI } from '@/plugins/basicapis.js'
import errorTableTab from '@/components/produce/schedule/scheduleConflictTable'

import {
  ScheduleOEEplusmultieditAPI,
  ScheduleOEEplusMoldMachineAPI
} from '@/plugins/produceapis.js'

import 'bootstrap/dist/css/bootstrap.css'

am4core.useTheme(am4themes_animated)

export default {
  components: {
    'error-tab': errorTableTab
  },
  data() {
    var scheduleobject = []
    return {
      errorArray: [], //錯誤array
      tabType: 3,
      chartshowflag: false,
      chart: null,
      dragObj: null,
      categoryAxis: null,
      ganttEdit: true,
      onMouseDownFirst: false,
      onMouseDownSecond: false,
      onMouseDirection: null,
      scrollMaxZoomed: null,
      scrollMinZoomed: null,
      scrollMaxZoomedStamp: 0,
      scrollMinZoomedStamp: 0,
      scrollTimeUnit: 1,
      timeOptions: [
        { value: 1, text: this.$t('one_hour') },
        { value: 2, text: this.$t('two_hour') },
        { value: 12, text: this.$t('tweleve_hour') },
        { value: 24, text: this.$t('one_day') }
      ],
      modal: false,
      editDragSchedule: null,
      workingTime: null,
      setMachineList: [],
      timeConflict: false,
      logicArr: [],
      svgMoveY: [],
      svgMoveYGap: null,
      moveYOffset: null,
      tooltipOgY: null,
      errormes: '',
      scheduleType: null,
      timeBasePointX: null,
      onMouseMoveTimeBase: false,
      timeInterval: null,
      moveMachineNumber: null,
      onMouseMoveMachine: false,
      baseMinGridDistance: null,
      backupAllmachine: null,
      dragObjArray: [],
      beforeModalFlag: 0,
      svgMoveToRightPlus: false,
      svgMoveToRight: false,
      svgMoveToLeftPlus: false,
      svgMoveToLeft: false,
      svgEnoughlength: false,
      firstEnoughlength: false,
      svgLengthOutOfRange: false,
      svgNotBothOutOfRange: false,
      svgLeftOutOfRange: false,
      svgRightOutOfRange: false,
      svgSetStrokeWidth: 1,
      fields: [
        {
          key: 'scheduleSerial',
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
          key: 'moldCycleTime',
          label: this.$t('mold_cycletime'), //'計畫週期時間',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return this.dealThousands('0', value)
          },
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
          key: 'startTime',
          label: this.$t('schedule_start_time'), //'開始時間',
          class: 'text-center',
          thStyle: { whiteSpace: 'nowrap' }
        },
        {
          key: 'endTime',
          label: this.$t('schedule_end_time'), //'結束時間',
          class: 'text-center',
          thStyle: { whiteSpace: 'nowrap' }
        },
        {
          key: 'workingTime',
          label: this.$t('working_time'), //'預計生產工時',
          sortable: true,
          class: 'text-center',
          thStyle: { whiteSpace: 'nowrap' }
        },
        {
          key: 'remark',
          label: this.$t('remark'),
          class: 'text-center',
          thStyle: { whiteSpace: 'nowrap' }
        },
        {
          key: 'actions',
          label: this.$t('operating'),
          class: 'text-center',
          thStyle: { whiteSpace: 'nowrap' }
        }
      ],
      ////////////////////////////////////////////////// 遮罩&訊息時間
      layerShade: true,
      layerShadeClose: true,
      layerTime: 5,
      ////////////////////////////////////////////////
      scheduledata: [],
      timesearch: false,
      allmachine: [],
      workshop: -1,
      scheduleobject,
      minTimeStamp: 9999999999999,
      maxTimeStamp: 0,
      minTime: 0,
      maxTime: 0,
      dateAxis: {},
      temp: 0,
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
  props: {
    searchData: Object,
    getchartdata: Array,
    testdata: Object,
    workshopselect: Number,
    tabvalue: Number
  },

  watch: {
    tabvalue(newVal) {
      this.tabType = newVal
      if (newVal == 3 && this.chart) {
        this.chart.series.values[0].cursorOverStyle = am4core.MouseCursorStyle.pointer
      } else {
        this.chart.series.values[0].cursorOverStyle = am4core.MouseCursorStyle.default
      }
    },
    getchartdata(newVal) {
      this.dragObjArray.length = 0
      this.scheduledata = JSON.parse(JSON.stringify(newVal))
      this.getmachine()
      this.resetGantt()
    },
    workshopselect(newVal) {
      this.dragObjArray.length = 0
      this.backupAllmachine = null
      this.workshop = newVal
    },
    scrollMinZoomed(newVal) {
      if (newVal != null) {
        this.scrollMinZoomedStamp = this.stringtotimestamp(this.scrollMinZoomed)
        if (this.scrollMinZoomedStamp + this.timeInterval != this.scrollMaxZoomedStamp) {
          this.scrollMaxZoomedStamp = this.scrollMinZoomedStamp + this.timeInterval
          this.scrollMaxZoomed = this.timeStamp2String(this.scrollMaxZoomedStamp)
        }
        if (this.scrollMinZoomedStamp < this.minTimeStamp) {
          this.minTimeStamp = this.scrollMinZoomedStamp
          this.minTime = this.scrollMinZoomed
          this.dateAxis.min = this.scrollMinZoomedStamp - this.baseMinGridDistance * 86397500
        } else if (this.scrollMinZoomedStamp >= this.maxTimeStamp) {
          this.maxTimeStamp = this.scrollMinZoomedStamp + this.baseMinGridDistance * 86397500
          this.maxTime = this.timeStamp2String(this.maxTimeStamp)
          this.dateAxis.max = this.maxTimeStamp
        }
        setTimeout(() => {
          this.dateAxis.zoomToDates(this.scrollMinZoomed, this.scrollMaxZoomed)
        }, 50)
      }
    },
    scrollTimeUnit(newVal) {
      switch (newVal) {
        case 1:
          this.timeInterval = this.baseMinGridDistance * 3597500
          this.scrollMaxZoomedStamp = this.scrollMinZoomedStamp + this.timeInterval
          this.scrollMaxZoomed = this.timeStamp2String(this.scrollMaxZoomedStamp)
          this.dateAxis.zoomToDates(this.scrollMinZoomed, this.scrollMaxZoomed)
          break
        case 2:
          this.timeInterval = this.baseMinGridDistance * 7197500
          this.scrollMaxZoomedStamp = this.scrollMinZoomedStamp + this.timeInterval
          this.scrollMaxZoomed = this.timeStamp2String(this.scrollMaxZoomedStamp)
          this.dateAxis.zoomToDates(this.scrollMinZoomed, this.scrollMaxZoomed)
          break
        case 12:
          this.timeInterval = this.baseMinGridDistance * 43197500
          this.scrollMaxZoomedStamp = this.scrollMinZoomedStamp + this.timeInterval
          this.scrollMaxZoomed = this.timeStamp2String(this.scrollMaxZoomedStamp)
          this.dateAxis.zoomToDates(this.scrollMinZoomed, this.scrollMaxZoomed)
          break
        case 24:
          this.timeInterval = this.baseMinGridDistance * 86397500
          this.scrollMaxZoomedStamp = this.scrollMinZoomedStamp + this.timeInterval
          this.scrollMaxZoomed = this.timeStamp2String(this.scrollMaxZoomedStamp)
          this.dateAxis.zoomToDates(this.scrollMinZoomed, this.scrollMaxZoomed)
          break
        default:
          break
      }
    }
  },
  created() {},
  methods: {
    //編輯甘特圖
    editGantt(type) {
      if (type == 1) {
        //重整
        this.chartshowflag = false
        this.setDefaultTime()
        this.dragObjArray.length = 0
        this.$emit('callparent')
        this.$nextTick(() => {
          this.resetGantt()
        })
      } else {
        //取消
        this.setDefaultTime()
        this.resetGantt()
        this.chart.validateData()
        setTimeout(() => {
          this.dateAxis.zoomToDates(this.scrollMinZoomed, this.scrollMaxZoomed)
        }, 50)
      }
    },
    editingCompleted() {
      this.dragObj.startTime = this.dragObj.startTime.replace(' ', 'T')
      this.dragObj.endTime = this.dragObj.endTime.replace(' ', 'T')
      this.dragObj.startTimestamp =
        parseInt(this.stringtotimestamp(this.dragObj.startTime) / 10000) * 10000
      this.dragObj.endTimestamp =
        parseInt(this.stringtotimestamp(this.dragObj.endTime) / 10000) * 10000
      this.dragObj.scheduleobject.workingTime = this.workingHours(
        this.dragObj.startTimestamp,
        this.dragObj.endTimestamp
      )
      this.dragObj.scheduleobject.moldCycleTime = parseFloat(
        this.dragObj.scheduleobject.moldCycleTime
      )
      if (this.dragObjArray.length == 0) {
        this.dragObjArray.push(this.dragObj.scheduleobject)
      } else {
        let check = false
        this.dragObjArray.forEach(obj => {
          if (obj.scheduleSerial == this.dragObj.scheduleobject.scheduleSerial) {
            obj = this.dragObj.scheduleobject
            check = true
          }
        })
        if (!check) {
          this.dragObjArray.push(this.dragObj.scheduleobject)
        }
      }
      this.scheduleobject.some(obj => {
        if (obj.scheduleSerial && obj.scheduleSerial == this.dragObj.scheduleSerial) {
          obj.startTimechart = this.dragObj.startTimestamp
          obj.endTimechart = this.dragObj.endTimestamp
          obj.startTime = this.dragObj.startTime
          obj.endTime = this.dragObj.endTime
          obj.machineNumber = this.dragObj.scheduleobject.machineNumber
          obj.machineId = this.dragObj.scheduleobject.machineId
          return true
        }
      })
      if (this.backupAllmachine) {
        this.backupAllmachine.forEach(machine => {
          this.scheduleobject.sort((a, b) => {
            if (b.machineNumber == machine.machineNumber && this.categoryAxis.renderer.inversed) {
              return -1
            } else if (
              a.machineNumber == machine.machineNumber &&
              !this.categoryAxis.renderer.inversed
            ) {
              return -1
            } else {
              return 0
            }
          })
        })
      } else {
        this.scheduleobject.sort((a, b) => naturalCompare(a.machineNumber, b.machineNumber))
      }
      this.resetGantt()
      this.chart.validateData()
      setTimeout(() => {
        this.dateAxis.zoomToDates(this.scrollMinZoomed, this.scrollMaxZoomed, false, true, false)
      }, 50)
    },
    setDefaultTime() {
      switch (this.scrollTimeUnit) {
        case 1:
          this.timeInterval = this.baseMinGridDistance * 3597500
          break
        case 2:
          this.timeInterval = this.baseMinGridDistance * 7197500
          break
        case 12:
          this.timeInterval = this.baseMinGridDistance * 43197500
          break
        case 24:
          this.timeInterval = this.baseMinGridDistance * 86397500
          break
        default:
          break
      }
    },
    resetGantt() {
      this.timeConflict = false
      if (this.dragObj && this.dragObj.target) {
        this.tooltipShow(this.dragObj.target.getAttribute('id'), false)
      }
      this.logicArr = []
      this.svgMoveY = []
      this.svgMoveYGap = null
      this.moveYOffset = null
      this.tooltipOgY = null
      this.onMouseDownFirst = false
      this.onMouseDownSecond = false
      this.dragObj = null
      let html = document.getElementsByTagName('rect')[3].parentNode
      html.children.forEach(child => {
        if (child.tagName == 'defs') {
          html.removeChild(child)
        }
      })
    },
    machineIdChange(machineId) {
      this.setMachineList.forEach(list => {
        if (list.value == machineId) {
          this.dragObj.scheduleobject.machineNumber = list.text
        }
      })
    },
    timeChange() {
      this.dragObj.startTimestamp = this.stringtotimestamp(this.dragObj.startTime)
      this.dragObj.endTimestamp = this.stringtotimestamp(this.dragObj.endTime)
      this.workingTime = this.workingHours(this.dragObj.startTimestamp, this.dragObj.endTimestamp)
    },
    mouseDown(event) {
      if (
        this.ganttEdit &&
        event.path[3].getAttribute('id') &&
        !this.onMouseDownFirst &&
        this.tabType == 3
      ) {
        this.onMouseDownFirst = true
        let target = event.path[3].getAttribute('id')
        //  將選取的物件圖層至於最頂層
        let targetNumber = 0
        let targetNumberFlag = false
        event.path[3].parentNode.children.forEach(child => {
          if (child.getAttribute('id') && child.getAttribute('id') == target) {
            targetNumberFlag = true
          }
          if (!targetNumberFlag) {
            targetNumber += 1
          }
        })
        let parentNode = event.path[3].parentNode
        parentNode.removeChild(event.path[3].parentNode.children[targetNumber])
        parentNode.appendChild(event.path[3])

        let transform = event.path[3].getAttribute('transform')
        let columnTemplate = this.chart.series.values[0].children.values[0].children.values[0]
          .children.values
        columnTemplate.forEach(column => {
          if (column.uid == target) {
            let bulletLeft = column.createChild(am4charts.CircleBullet)
            bulletLeft.circle.radius = 6
            bulletLeft.circle.fill = this.color('white')
            bulletLeft.circle.strokeWidth = 3
            bulletLeft.valign = 'middle'
            bulletLeft.align = 'left'
            bulletLeft.dx = -10
            bulletLeft.horizontalCenter = 'middle'
            bulletLeft.isMeasured = true
            bulletLeft.interactionsEnabled = false
            bulletLeft.interactionsEnabled = false

            let bulletRight = column.createChild(am4charts.CircleBullet)
            bulletRight.circle.radius = 6
            bulletRight.circle.fill = this.color('white')
            bulletRight.circle.strokeWidth = 3
            bulletRight.valign = 'middle'
            bulletRight.align = 'right'
            bulletRight.dx = 10
            bulletRight.horizontalCenter = 'middle'
            bulletRight.isMeasured = true
            bulletRight.interactionsEnabled = false
            bulletRight.interactionsEnabled = false
          }
        })
        this.dragObj = {}
        this.dragObj['target'] = event.path[3]
        this.dragObj['event'] = event
        this.dragObj['transform'] = transform
        this.tooltipShow(this.dragObj.target.getAttribute('id'), true)
        let tooltip = document.getElementsByTagName('g')
        tooltip.forEach(item => {
          if (item.getAttribute('aria-describedby')) {
            let tooltipTarget = item.getAttribute('aria-describedby')
            if (target == tooltipTarget) {
              let findText = item.children[1].children[0].children[0]
              for (let i = 0; i < 3; i++) {
                if (i == 0) {
                  this.dragObj['scheduleSerial'] = findText.children[
                    i
                  ].children[0].innerHTML.replace(/:/g, '')
                } else if (i == 1) {
                  this.dragObj['startTime'] = findText.children[i].children[1].innerHTML
                  this.dragObj['endTime'] = findText.children[i].children[3].innerHTML
                } else {
                  this.dragObj['moldNumber'] = findText.children[i].children[0].innerHTML.replace(
                    / /g,
                    ''
                  )
                }
              }
            }
          }
        })
        this.scheduleobject.forEach(item => {
          if (item.scheduleSerial && item.scheduleSerial == this.dragObj.scheduleSerial) {
            this.dragObj['scheduleobject'] = item
            this.getMoldMachine(item.moldId, true)
          }
        })
        this.dragObj.startTimestamp = this.stringtotimestamp(this.dragObj.startTime)
        this.dragObj.endTimestamp = this.stringtotimestamp(this.dragObj.endTime)
        this.dragObj.startTimestampTMP = this.stringtotimestamp(this.dragObj.startTime)
        this.dragObj.endTimestampTMP = this.stringtotimestamp(this.dragObj.endTime)
        this.$nextTick(() => {
          let circle = document.getElementsByTagName('circle')
          if (circle) {
            circle[0].setAttribute('customDirection', 'left')
            circle[1].setAttribute('customDirection', 'right')
            circle[0].parentNode.parentNode.parentNode.setAttribute('customDirection', 'left')
            circle[1].parentNode.parentNode.parentNode.setAttribute('customDirection', 'right')
            circle[0].parentNode.parentNode.parentNode.style.pointerEvents = 'fill'
            circle[1].parentNode.parentNode.parentNode.style.pointerEvents = 'fill'
          }
        })
      } else if (
        (this.ganttEdit &&
          event.path[0].tagName == 'rect' &&
          !this.onMouseDownFirst &&
          !this.onMouseMoveTimeBase) ||
        (this.ganttEdit &&
          event.path[1].tagName == 'g' &&
          event.path[1].getAttribute('rectBaseGrid') &&
          !this.onMouseDownFirst &&
          !this.onMouseMoveTimeBase)
      ) {
        this.timeBasePointX = event.screenX
        this.onMouseMoveTimeBase = true
      } else if (
        this.ganttEdit &&
        event.path[0].tagName == 'tspan' &&
        !this.onMouseDownFirst &&
        !this.onMouseMoveMachine
      ) {
        let checkDragMachineNumber = this.allmachine.some(item => {
          return item.machineNumber == event.path[0].innerHTML
        })
        if (checkDragMachineNumber) {
          this.moveMachineNumber = event.path[0].innerHTML
          let divTag = document.createElement('div')
          let ganttChart = document.getElementsByClassName('ganttChart')[0]
          divTag.setAttribute('moveMachineTag', 'true')
          divTag.textContent = this.moveMachineNumber
          divTag.style.position = 'absolute'
          divTag.style.left = ganttChart.offsetLeft + 'px'
          divTag.style.top = ganttChart.offsetTop + event.offsetY + 'px'
          divTag.style.transform = 'translate(0%,-50%)'
          divTag.style.cursor = 'none'
          ganttChart.appendChild(divTag)
          this.onMouseMoveMachine = true
        }
      } else if (
        this.ganttEdit &&
        event.path[3].getAttribute('id') &&
        this.onMouseDownFirst &&
        this.tabType == 3
      ) {
        this.onMouseDownSecond = true
        this.onMouseDirection = false
        this.svgMoveToRightPlus = false
        this.svgMoveToRight = false
        this.svgMoveToLeftPlus = false
        this.svgMoveToLeft = false
        this.svgEnoughlength = false
        this.svgLengthOutOfRange = false
        this.svgNotBothOutOfRange = false
        this.svgLeftOutOfRange = false
        this.svgRightOutOfRange = false
        let transform = event.path[3].getAttribute('transform')
        this.dragObj['event'] = event
        this.dragObj['transform'] = transform
        this.dragObj['path'] = event.path[3].children[0].children[0].children[0].getAttribute('d')
        this.dragObj['circleLeft'] = event.path[3].children[0].children[1]
        this.dragObj['circleLeftTransform'] = event.path[3].children[0].children[1].getAttribute(
          'transform'
        )
        this.dragObj['circleRight'] = event.path[3].children[0].children[2]
        this.dragObj['circleRightTransform'] = event.path[3].children[0].children[2].getAttribute(
          'transform'
        )
        this.dragObj.startTimestamp = this.stringtotimestamp(this.dragObj.startTime)
        this.dragObj.endTimestamp = this.stringtotimestamp(this.dragObj.endTime)
        this.dragObj.startTimestampTMP = this.stringtotimestamp(this.dragObj.startTime)
        this.dragObj.endTimestampTMP = this.stringtotimestamp(this.dragObj.endTime)
        this.tooltipShow(this.dragObj.target.getAttribute('id'), true)
      }
      if (this.onMouseDownFirst && event.path[0].tagName == 'circle' && this.tabType == 3) {
        this.onMouseDownSecond = true
        this.onMouseDirection = event.path[0].getAttribute('customDirection')
        this.dragObj.circleEvent = event
        this.tooltipShow(this.dragObj.target.getAttribute('id'), true)
        this.dragObj['circleLeft'] = event.path[5].children[0].children[1]
        this.dragObj['circleLeftTransform'] = event.path[5].children[0].children[1].getAttribute(
          'transform'
        )
        this.dragObj['circleRight'] = event.path[5].children[0].children[2]
        this.dragObj['circleRightTransform'] = event.path[5].children[0].children[2].getAttribute(
          'transform'
        )
        this.dragObj[
          'path'
        ] = event.path[0].parentNode.parentNode.parentNode.parentNode.children[0].children[0].getAttribute(
          'd'
        )
        this.dragObj.startTimestamp = this.stringtotimestamp(this.dragObj.startTime)
        this.dragObj.endTimestamp = this.stringtotimestamp(this.dragObj.endTime)
        this.dragObj.startTimestampTMP = this.stringtotimestamp(this.dragObj.startTime)
        this.dragObj.endTimestampTMP = this.stringtotimestamp(this.dragObj.endTime)
      }
    },
    //拖曳事件
    mouseMove(event) {
      if (this.onMouseDownSecond && !this.onMouseDirection) {
        let og = this.dragObj.transform.substring(10, this.dragObj.transform.length - 1).split(',')
        let offsetX = event.screenX - this.dragObj.event.screenX
        let offsetY = event.screenY - this.dragObj.event.screenY
        let dragX = offsetX + parseFloat(og[0])
        let dragY = offsetY + parseFloat(og[1])
        let rectHeight = document.getElementsByTagName('rect')[3].getBBox().height
        if (this.svgMoveY.length > 1) {
          let moveYFlag = false
          if (dragY < 0) {
            dragY = 0 + this.svgMoveYGap
          }
          if (dragY > rectHeight) {
            dragY = rectHeight - this.svgMoveYGap * 3
          }
          this.svgMoveY.forEach(item => {
            if (
              dragY >= item.yAxis - this.svgMoveYGap &&
              dragY <= item.yAxis + this.svgMoveYGap * 3
            ) {
              dragY = item.yAxis
              this.dragObj.scheduleobject.machineNumber = item.machineNumber
              this.dragObj.scheduleobject.machineId = item.id
              moveYFlag = true
            }
          })
          if (!moveYFlag) {
            let minimum = rectHeight
            let newDragY
            let newMachineNumber
            let newMachineId
            this.svgMoveY.forEach(item => {
              if (Math.abs(dragY - item.yAxis) < minimum) {
                minimum = Math.abs(dragY - item.yAxis)
                newDragY = item.yAxis
                newMachineNumber = item.machineNumber
                newMachineId = item.id
              }
            })
            dragY = newDragY
            this.dragObj.scheduleobject.machineNumber = newMachineNumber
            this.dragObj.scheduleobject.machineId = newMachineId
          }
          this.moveYOffset = parseFloat((parseFloat(og[1]) - dragY).toFixed(2))
        } else {
          dragY = parseFloat(og[1])
        }
        let rectWidth = document.getElementsByTagName('rect')[3].getBBox().width
        let offsetTime = Math.round(offsetX * (this.timeInterval / rectWidth))
        let newStartTime = this.dragObj.startTimestampTMP + offsetTime
        let newEndTime = this.dragObj.endTimestampTMP + offsetTime
        this.checkSVGborder(newStartTime, newEndTime, event, dragX)
        if (this.svgEnoughlength) {
          if (!this.firstEnoughlength) {
            this.dragObj.target.setAttribute('transform', 'translate(' + dragX + ',' + dragY + ')')
          } else {
            dragX = parseFloat(og[0])
            this.dragObj.target.setAttribute(
              'transform',
              'translate(' + parseFloat(og[0]) + ',' + dragY + ')'
            )
            this.dragObj.transform = this.dragObj.target.getAttribute('transform')
            this.tooltipOgY = null
            this.moveYOffset = null
            this.firstEnoughlength = false
          }
        } else {
          if (!this.svgLeftOutOfRange && this.firstEnoughlength) {
            this.dragObj.target.setAttribute(
              'transform',
              'translate(' + parseFloat(og[0]) + ',' + dragY + ')'
            )
            this.dragObj.transform = this.dragObj.target.getAttribute('transform')
            this.tooltipOgY = null
            this.moveYOffset = null
            this.firstEnoughlength = false
          } else {
            let svg = this.dragObj.target.children[0].children[0].children[0]
            let path = this.dragObj.path
            let regL = /L\d*.\d*\,/g
            let regL_Array = path.match(regL)
            let rightTop = parseFloat(regL_Array[0].slice(1, regL_Array[0].length - 1))
            let rightBottom = parseFloat(regL_Array[1].slice(1, regL_Array[1].length - 1))
            if (this.svgMoveToRightPlus || this.svgMoveToLeft) {
              if (
                (this.svgMoveToRightPlus && dragX <= parseFloat(og[0])) ||
                (this.svgMoveToLeft && dragX <= parseFloat(og[0]))
              ) {
                this.dragObj.target.setAttribute(
                  'transform',
                  'translate(' + dragX + ',' + dragY + ')'
                )
              } else {
                dragX = 0
                rightTop += parseFloat(offsetX)
                rightBottom += parseFloat(offsetX)
                let circleRightX = rightBottom + 10
                let circleRightOg = this.dragObj.circleRightTransform
                  .substring(10, this.dragObj.circleRightTransform.length - 1)
                  .split(',')
                this.dragObj.circleRight.setAttribute(
                  'transform',
                  'translate(' + circleRightX + ',' + parseFloat(circleRightOg[1]) + ')'
                )
                rightTop = 'L' + rightTop + ','
                rightBottom = 'L' + rightBottom + ','
                let newPath = path
                  .replace(regL_Array[0], rightTop)
                  .replace(regL_Array[1], rightBottom)
                svg.setAttribute('d', newPath)
                this.dragObj.target.setAttribute(
                  'transform',
                  'translate(' + dragX + ',' + dragY + ')'
                )
              }
            }
            if (this.svgMoveToLeftPlus || this.svgMoveToRight) {
              if ((this.svgMoveToLeftPlus && dragX >= parseFloat(og[0])) || this.svgMoveToRight) {
                this.dragObj.target.setAttribute(
                  'transform',
                  'translate(' + dragX + ',' + dragY + ')'
                )
              } else {
                rightTop += Math.abs(parseFloat(offsetX))
                rightBottom += Math.abs(parseFloat(offsetX))
                let circleRightX = rightBottom + 10
                let circleRightOg = this.dragObj.circleRightTransform
                  .substring(10, this.dragObj.circleRightTransform.length - 1)
                  .split(',')
                this.dragObj.circleRight.setAttribute(
                  'transform',
                  'translate(' + circleRightX + ',' + parseFloat(circleRightOg[1]) + ')'
                )
                rightTop = 'L' + rightTop + ','
                rightBottom = 'L' + rightBottom + ','
                let newPath = path
                  .replace(regL_Array[0], rightTop)
                  .replace(regL_Array[1], rightBottom)
                svg.setAttribute('d', newPath)
                this.dragObj.target.setAttribute(
                  'transform',
                  'translate(' + dragX + ',' + dragY + ')'
                )
              }
            }
          }
        }
        let sameLineSVGRange = this.setTooltipCheckRange(
          this.dragObj.target.getAttribute('id'),
          parseFloat(dragY),
          event.offsetX,
          newStartTime,
          newEndTime
        )
        let svgWidth = parseFloat(this.dragObj.target.children[0].children[0].getBBox().width)
        let targetRange = this.checkTargetRange(
          parseFloat(dragX.toFixed(1)),
          parseFloat((parseFloat(dragX.toFixed(1)) + svgWidth).toFixed(1))
        )
        let overlapRange = targetRange.filter(e => {
          return sameLineSVGRange.indexOf(e) > -1
        })
        let scheduleCheckFlag = this.scheduleTimeOverlapRange(newStartTime, newEndTime)
        if (overlapRange.length > 0 && scheduleCheckFlag) {
          this.transformChartColor(true, svgWidth, dragX, overlapRange)
        } else {
          this.transformChartColor(false, null, null, null)
        }
        if (scheduleCheckFlag) {
          this.timeConflict = true
        } else {
          this.timeConflict = false
        }
        this.dragObj.startTimestamp = newStartTime
        this.dragObj.endTimestamp = newEndTime
      } else if (this.onMouseDownSecond && this.onMouseDirection) {
        this.moveYOffset = null
        let offsetX = event.screenX - this.dragObj.circleEvent.screenX
        let svg = this.dragObj.target.children[0].children[0].children[0]
        let path = this.dragObj.path
        let regL = /L\d*.\d*\,/g
        let regL_Array = path.match(regL)
        let rectWidth = document.getElementsByTagName('rect')[3].getBBox().width
        let offsetTime = Math.round(offsetX * (this.timeInterval / rectWidth))

        if (this.onMouseDirection == 'left') {
          let leftTop = parseFloat(regL_Array[0].slice(1, regL_Array[0].length - 1))
          let leftBottom = parseFloat(regL_Array[1].slice(1, regL_Array[1].length - 1))
          leftTop -= parseFloat(offsetX)
          leftBottom -= parseFloat(offsetX)
          let circleRightX = leftBottom + 10
          let targetOg = this.dragObj.transform
            .substring(10, this.dragObj.transform.length - 1)
            .split(',')
          let targetX = offsetX + parseFloat(targetOg[0])
          let circleRightOg = this.dragObj.circleRightTransform
            .substring(10, this.dragObj.circleRightTransform.length - 1)
            .split(',')
          let newStartTime = this.dragObj.startTimestampTMP + offsetTime
          if ((leftTop <= 0 && leftBottom <= 0) || newStartTime >= this.dragObj.endTimestampTMP) {
            this.dragMouseUpProcess()
            this.$layer.msg(
              this.$t('schedule_number') +
                ': ' +
                this.dragObj.scheduleSerial +
                ' ' +
                this.$t('gantt_mes2'), //開始時間不得大於或等於結束時間
              { shade: this.layerShade, shadeClose: this.layerShadeClose, time: this.layerTime }
            )
          } else {
            this.dragObj.circleRight.setAttribute(
              'transform',
              'translate(' + circleRightX + ',' + parseFloat(circleRightOg[1]) + ')'
            )
            this.dragObj.target.setAttribute(
              'transform',
              'translate(' + targetX + ',' + parseFloat(targetOg[1]) + ')'
            )
            leftTop = 'L' + leftTop + ','
            leftBottom = 'L' + leftBottom + ','
            let newPath = path.replace(regL_Array[0], leftTop).replace(regL_Array[1], leftBottom)
            svg.setAttribute('d', newPath)
            let og = this.dragObj.transform
              .substring(10, this.dragObj.transform.length - 1)
              .split(',')
            let sameLineSVGRange = this.setTooltipCheckRange(
              this.dragObj.target.getAttribute('id'),
              parseFloat(og[1]),
              event.offsetX,
              newStartTime,
              this.dragObj.endTimestamp
            )
            let svgWidth = parseFloat(this.dragObj.target.children[0].children[0].getBBox().width)
            let targetRange = this.checkTargetRange(
              parseFloat(targetX.toFixed(1)),
              parseFloat((parseFloat(targetX.toFixed(1)) + svgWidth).toFixed(1))
            )
            let overlapRange = targetRange.filter(e => {
              return sameLineSVGRange.indexOf(e) > -1
            })
            let scheduleCheckFlag = this.scheduleTimeOverlapRange(
              newStartTime,
              this.dragObj.endTimestampTMP
            )
            if (overlapRange.length > 0 && scheduleCheckFlag) {
              this.transformChartColor(true, svgWidth, targetX, overlapRange)
            } else {
              this.transformChartColor(false, null, null, null)
            }
            if (scheduleCheckFlag) {
              this.timeConflict = true
            } else {
              this.timeConflict = false
            }
            this.dragObj.startTimestamp = newStartTime
          }
        } else if (this.onMouseDirection == 'right') {
          let circleRight = this.dragObj.circleRight
          let circleRightOg = this.dragObj.circleRightTransform
            .substring(10, this.dragObj.circleRightTransform.length - 1)
            .split(',')
          let dragCircleX = offsetX + parseFloat(circleRightOg[0])
          let rightTop = parseFloat(regL_Array[0].slice(1, regL_Array[0].length - 1))
          let rightBottom = parseFloat(regL_Array[1].slice(1, regL_Array[1].length - 1))
          rightTop += parseFloat(offsetX)
          rightBottom += parseFloat(offsetX)
          let newEndTime = this.dragObj.endTimestampTMP + offsetTime
          if ((rightTop <= 0 && rightBottom <= 0) || newEndTime <= this.dragObj.startTimestampTMP) {
            this.dragMouseUpProcess()
            this.$layer.msg(
              this.$t('schedule_number') +
                ': ' +
                this.dragObj.scheduleSerial +
                ' ' +
                this.$t('gantt_mes3'), //結束時間不得小於或等於開始時間
              { shade: this.layerShade, shadeClose: this.layerShadeClose, time: this.layerTime }
            )
          } else {
            circleRight.setAttribute(
              'transform',
              'translate(' + dragCircleX + ',' + parseFloat(circleRightOg[1]) + ')'
            )
            rightTop = 'L' + rightTop + ','
            rightBottom = 'L' + rightBottom + ','
            let newPath = path.replace(regL_Array[0], rightTop).replace(regL_Array[1], rightBottom)
            svg.setAttribute('d', newPath)
            let og = this.dragObj.transform
              .substring(10, this.dragObj.transform.length - 1)
              .split(',')
            let sameLineSVGRange = this.setTooltipCheckRange(
              this.dragObj.target.getAttribute('id'),
              parseFloat(og[1]),
              event.offsetX,
              this.dragObj.startTimestamp,
              newEndTime
            )
            let svgWidth = parseFloat(this.dragObj.target.children[0].children[0].getBBox().width)
            let targetRange = this.checkTargetRange(
              parseFloat(parseFloat(og[0]).toFixed(1)),
              parseFloat((parseFloat(parseFloat(og[0]).toFixed(1)) + svgWidth).toFixed(1))
            )
            let overlapRange = targetRange.filter(e => {
              return sameLineSVGRange.indexOf(e) > -1
            })
            let scheduleCheckFlag = this.scheduleTimeOverlapRange(
              this.dragObj.startTimestampTMP,
              newEndTime
            )
            if (overlapRange.length > 0 && scheduleCheckFlag) {
              this.transformChartColor(true, svgWidth, parseFloat(og[0]), overlapRange)
            } else {
              this.transformChartColor(false, null, null, null)
            }
            if (scheduleCheckFlag) {
              this.timeConflict = true
            } else {
              this.timeConflict = false
            }
            this.dragObj.endTimestamp = newEndTime
          }
        }
      } else if (this.onMouseMoveMachine) {
        document.getElementsByTagName('tspan').forEach(item => {
          item.style.stroke = 'none'
        })
        let ganttChart = document.getElementsByClassName('ganttChart')[0]
        let divTag = document.getElementsByClassName('ganttChart')[0].children[1]
        if (event.path[0].tagName == 'rect') {
          divTag.style.left = parseInt(ganttChart.offsetLeft) - 5 + 'px'
          divTag.style.top = parseInt(ganttChart.offsetTop) + parseInt(event.offsetY) + 'px'
        } else if (
          event.path[0].tagName == 'tspan' &&
          event.path[0].innerHTML != this.moveMachineNumber
        ) {
          let checkFlag = this.allmachine.some(item => {
            return item.machineNumber == event.path[0].innerHTML
          })
          if (checkFlag) {
            event.path[0].style.stroke = this.color('red')
            divTag.style.left = parseInt(ganttChart.offsetLeft) - 5 + 'px'
            divTag.style.top = parseInt(ganttChart.offsetTop) + parseInt(event.offsetY) + 'px'
          }
        }
      }
    },
    setTooltipCheckRange(target, dragY, tooltipX, newStartTime, newEndTime) {
      let sameLineSVGRange = []
      let tooltip = document.getElementsByTagName('g')
      tooltip.forEach(item => {
        if (
          (item.getAttribute('role') == 'listitem' &&
            item.getAttribute('transform') &&
            !item.getAttribute('display')) ||
          (item.getAttribute('role') == 'menuitem' &&
            item.getAttribute('transform') &&
            !item.getAttribute('display'))
        ) {
          //確認重疊
          let itemTransform = item
            .getAttribute('transform')
            .substring(10, item.getAttribute('transform').length - 1)
            .split(',')
          if (
            (parseInt(itemTransform[1]) == parseInt(dragY) &&
              item.getAttribute('id') != this.dragObj.target.getAttribute('id')) ||
            (parseInt(itemTransform[1]) == parseInt(dragY) + 1 &&
              item.getAttribute('id') != this.dragObj.target.getAttribute('id')) ||
            (parseInt(itemTransform[1]) == parseInt(dragY) - 1 &&
              item.getAttribute('id') != this.dragObj.target.getAttribute('id'))
          ) {
            let length = parseFloat(
              (parseFloat(itemTransform[0]) + parseFloat(item.getBBox().width)).toFixed(1)
            )
            for (let i = parseFloat(parseFloat(itemTransform[0]).toFixed(1)); i <= length; i++) {
              if (i % 1 != 0) {
                for (let j = i * 10; j < (Math.floor(i) + 1) * 10; j++) {
                  sameLineSVGRange.push(j / 10)
                }
                i = Math.ceil(i)
              }
              if (i == Math.ceil(length) - 1 && length % 1 != 0) {
                for (let k = i * 10; k <= length * 10; k++) {
                  sameLineSVGRange.push(k / 10)
                }
                break
              } else {
                sameLineSVGRange.push(i)
              }
            }
          }
        }
        if (item.getAttribute('aria-describedby')) {
          //tooltip位置
          let tooltipTarget = item.getAttribute('aria-describedby')
          if (target == tooltipTarget) {
            let tooltipOg = item
              .getAttribute('transform')
              .substring(10, item.getAttribute('transform').length - 1)
              .split(',')
            let tooltipY = parseFloat(tooltipOg[1])
            if (!this.tooltipOgY) {
              this.tooltipOgY = parseFloat(tooltipOg[1])
            }
            if (this.moveYOffset) {
              tooltipY = parseFloat(
                (parseFloat(this.tooltipOgY) - parseFloat(this.moveYOffset)).toFixed(2)
              )
            } else {
              tooltipY = parseFloat(this.tooltipOgY)
            }
            item.setAttribute('transform', 'translate(' + tooltipX + ',' + tooltipY + ')')
            item.children[1].children[0].children[0].children[1].children[1].innerHTML = this.timeStamp2String(
              newStartTime
            ).replace('T', ' ')
            item.children[1].children[0].children[0].children[1].children[3].innerHTML = this.timeStamp2String(
              newEndTime
            ).replace('T', ' ')
          }
        }
      })
      return sameLineSVGRange
    },
    checkTargetRange(targetRangeMin, targetRangeMax) {
      let targetRange = []
      for (let i = targetRangeMin; i <= targetRangeMax; i++) {
        if (i % 1 != 0) {
          for (let j = i * 10; j < (Math.floor(i) + 1) * 10; j++) {
            targetRange.push(j / 10)
          }
          i = Math.ceil(i)
        }
        if (i == Math.ceil(targetRangeMax) - 1 && targetRangeMax % 1 != 0) {
          for (let k = i * 10; k <= targetRangeMax * 10; k++) {
            targetRange.push(k / 10)
          }
          break
        } else {
          targetRange.push(i)
        }
      }
      return targetRange
    },
    scheduleTimeOverlapRange(newStartTime, newEndTime) {
      let check = false
      this.scheduleobject.forEach(item => {
        if (
          item.color &&
          item.machineNumber == this.dragObj.scheduleobject.machineNumber &&
          item.scheduleSerial != this.dragObj.scheduleSerial
        ) {
          if (
            (newStartTime > item.startTimechart && newEndTime < item.endTimechart) ||
            (newStartTime > item.startTimechart &&
              newStartTime < item.endTimechart &&
              newEndTime > item.startTimechart &&
              newEndTime > item.endTimechart) ||
            (newEndTime > item.startTimechart &&
              newEndTime < item.endTimechart &&
              newStartTime < item.startTimechart &&
              newStartTime < item.endTimechart) ||
            (newStartTime < item.startTimechart && newEndTime > item.endTimechart)
          ) {
            check = true
          }
        }
      })
      return check
    },
    transformChartColor(type, svgWidth, dragX, overlapRange) {
      let transColor
      if (this.dragObj.scheduleobject.status == 3) {
        transColor = this.color('blue')
      } else if (this.dragObj.scheduleobject.status == 2) {
        transColor = this.color('green')
      } else {
        transColor = this.color('darkgray')
      }
      if (type) {
        let html = this.dragObj.target.children[0].children[0]
        html.children.forEach(child => {
          if (child.tagName == 'defs') {
            html.removeChild(child)
          }
        })
        let svgns = 'http://www.w3.org/2000/svg'
        let defs = document.createElementNS(svgns, 'defs')
        let linearGradient = document.createElementNS(svgns, 'linearGradient')
        linearGradient.setAttribute('id', 'overlappingColors')
        linearGradient.setAttribute('x1', '0%')
        linearGradient.setAttribute('y1', '0%')
        linearGradient.setAttribute('x2', '100%')
        linearGradient.setAttribute('y2', '0%')
        let percentageLength = svgWidth / 100
        let redStart = Math.min(...overlapRange)
        let redEnd = Math.max(...overlapRange)
        redStart = Math.abs((redStart - dragX) / percentageLength)
        redEnd = Math.abs((redEnd - dragX) / percentageLength)
        if (redStart > 100) {
          redStart = 100
        }
        if (redEnd > 100) {
          redEnd = 100
        }

        if (Math.abs(parseFloat(redEnd) - parseFloat(redStart)) < 1) {
          if (redStart >= 99) {
            redStart = 99
            redEnd = 100
          } else {
            redEnd = redStart + 1
          }
        }

        let base = (this.svgSetStrokeWidth + 0.5) / percentageLength
        if (
          percentageLength <= this.svgSetStrokeWidth + 0.5 &&
          Math.abs(parseFloat(redEnd) - parseFloat(redStart)) < base
        ) {
          redEnd = redStart + base
          if (redEnd > 100) {
            redEnd = 100
            redStart = redEnd - base
          }
        }

        if (redStart > 0 && redEnd < 100) {
          let colorStartLeft = 0
          let colorEndLeft = redStart
          linearGradient = this.gradationProcessing(
            svgns,
            linearGradient,
            transColor,
            colorStartLeft,
            colorEndLeft
          ) // 左邊顏色
          linearGradient = this.gradationProcessing(
            svgns,
            linearGradient,
            this.color('red'),
            redStart,
            redEnd
          ) // 中間紅色
          let colorStartRight = redEnd
          let colorEndRight = 100
          linearGradient = this.gradationProcessing(
            svgns,
            linearGradient,
            transColor,
            colorStartRight,
            colorEndRight
          ) // 右邊顏色
        } else if (redStart == 0 && redEnd < 100 && redEnd > 0) {
          linearGradient = this.gradationProcessing(
            svgns,
            linearGradient,
            this.color('red'),
            redStart,
            redEnd
          ) //左邊紅色
          let colorStartRight = redEnd
          let colorEndRight = 100
          linearGradient = this.gradationProcessing(
            svgns,
            linearGradient,
            transColor,
            colorStartRight,
            colorEndRight
          ) //右邊顏色
        } else if (redStart > 0 && redEnd == 100) {
          let colorStartLeft = 0
          let colorEndLeft = redStart
          linearGradient = this.gradationProcessing(
            svgns,
            linearGradient,
            transColor,
            colorStartLeft,
            colorEndLeft
          ) //左邊顏色
          linearGradient = this.gradationProcessing(
            svgns,
            linearGradient,
            this.color('red'),
            redStart,
            redEnd
          ) //右邊紅色
        } else if (redStart == 0 && redEnd == 100) {
          linearGradient = this.gradationProcessing(
            svgns,
            linearGradient,
            this.color('red'),
            redStart,
            redEnd
          ) //紅色
        }
        defs.appendChild(linearGradient)
        html.appendChild(defs)
        this.dragObj.target.children[0].children[0].firstChild.style.fill =
          'url(#overlappingColors)'
      } else {
        let html = this.dragObj.target.children[0].children[0]
        html.children.forEach(child => {
          if (child.tagName == 'defs') {
            html.removeChild(child)
          }
        })
        this.dragObj.target.children[0].children[0].children[0].style.fill = transColor
      }
    },
    checkSVGborder(newStartTime, newEndTime, event, dragX) {
      if (!this.svgEnoughlength) {
        if (
          this.dragObj.startTimestampTMP >= this.scrollMinZoomedStamp &&
          this.dragObj.endTimestampTMP <= this.scrollMaxZoomedStamp
        ) {
          this.svgEnoughlength = true
        }
        if (
          newStartTime < this.scrollMinZoomedStamp &&
          newEndTime < this.scrollMaxZoomedStamp &&
          newEndTime > this.scrollMinZoomedStamp &&
          !this.svgEnoughlength &&
          !this.svgLengthOutOfRange
        ) {
          //小於顯示之開始時間
          this.svgNotBothOutOfRange = true
          if (newStartTime > this.dragObj.startTimestamp && !this.svgEnoughlength) {
            //向右移動 需增加SVG長度
            this.svgLeftOutOfRange = true
            this.svgMoveDirection(false, false, true, false)
          } else if (newStartTime < this.dragObj.startTimestamp && !this.svgEnoughlength) {
            //向左移動
            if (this.svgRightOutOfRange) {
              this.svgEnoughlength = true
            }
            this.svgMoveDirection(false, true, false, false)
          }
        } else if (
          newEndTime > this.scrollMaxZoomedStamp &&
          newStartTime > this.scrollMinZoomedStamp &&
          newStartTime < this.scrollMaxZoomedStamp &&
          !this.svgEnoughlength &&
          !this.svgLengthOutOfRange
        ) {
          //大於顯示之結束時間
          this.svgNotBothOutOfRange = true
          if (newEndTime <= this.dragObj.endTimestamp && !this.svgEnoughlength) {
            //向左移動 需增加SVG長度
            this.svgRightOutOfRange = true
            this.svgMoveDirection(true, false, false, false)
          } else if (newEndTime > this.dragObj.endTimestamp && !this.svgEnoughlength) {
            // 向右移動
            if (this.svgMoveToRightPlus) {
              this.dragObj.event = event
              let timeGap = this.dragObj.endTimestampTMP - this.dragObj.startTimestampTMP
              this.dragObj.startTimestampTMP = this.scrollMinZoomedStamp
              this.dragObj.endTimestampTMP = this.scrollMinZoomedStamp + timeGap
              this.firstEnoughlength = true
              this.svgMoveToRightPlus = false
              this.svgLeftOutOfRange = false
              this.svgMoveDirection(true, false, false, false)
            } else {
              if (this.svgMoveToLeftPlus) {
                this.svgEnoughlength = true
              }
              this.svgMoveDirection(false, false, false, true)
            }
          }
        } else if (
          newStartTime >= this.scrollMinZoomedStamp &&
          newEndTime <= this.scrollMaxZoomedStamp &&
          !this.svgEnoughlength &&
          !this.svgLengthOutOfRange
        ) {
          // 長度已經足夠
          this.svgEnoughlength = true
          if (this.svgMoveToRightPlus) {
            this.dragObj.event = event
            let timeGap = this.dragObj.endTimestampTMP - this.dragObj.startTimestampTMP
            this.dragObj.startTimestampTMP = this.scrollMinZoomedStamp
            this.dragObj.endTimestampTMP = this.scrollMinZoomedStamp + timeGap
            this.firstEnoughlength = true
          }
        } else if (
          newStartTime <= this.scrollMinZoomedStamp &&
          newEndTime >= this.scrollMaxZoomedStamp &&
          !this.svgEnoughlength &&
          !this.svgNotBothOutOfRange
        ) {
          // 初始長度超出範圍
          this.svgLengthOutOfRange = true
          this.svgLeftOutOfRange = true
          this.svgRightOutOfRange = true
          if (
            newStartTime > this.dragObj.startTimestamp &&
            newEndTime > this.dragObj.endTimestamp &&
            !this.svgEnoughlength
          ) {
            //向右移動 需增加SVG長度
            this.svgMoveDirection(false, false, true, false)
          } else if (
            newStartTime < this.dragObj.startTimestamp &&
            newEndTime < this.dragObj.endTimestamp &&
            !this.svgEnoughlength
          ) {
            //向左移動 需增加SVG長度
            if (this.svgLengthOutOfRange && this.svgLeftOutOfRange && this.svgRightOutOfRange) {
              if (dragX >= 0) {
                this.svgMoveDirection(false, false, true, false)
              } else {
                this.svgMoveDirection(true, false, false, false)
              }
            } else {
              if (this.svgMoveToRightPlus) {
                this.svgEnoughlength = true
              }
            }
          }
        } else if (
          newStartTime > this.scrollMinZoomedStamp &&
          newEndTime > this.scrollMaxZoomedStamp &&
          !this.svgEnoughlength &&
          this.svgLengthOutOfRange &&
          !this.svgNotBothOutOfRange
        ) {
          //初始長度超出範圍 & 開始時間>=開始時間範圍
          if (this.svgMoveToRightPlus) {
            this.dragObj.event = event
            let timeGap = this.dragObj.endTimestampTMP - this.dragObj.startTimestampTMP
            this.dragObj.startTimestampTMP = this.scrollMinZoomedStamp
            this.dragObj.endTimestampTMP = this.scrollMinZoomedStamp + timeGap
            this.firstEnoughlength = true
            this.svgMoveToRightPlus = false
            this.svgLeftOutOfRange = false
          }
          if (!this.svgRightOutOfRange && !this.svgLeftOutOfRange && !this.svgEnoughlength) {
            //如果開始時間 & 結束時間皆已進入範圍內過 則代表長度已經足夠
            this.svgEnoughlength = true
          } else {
            this.svgMoveDirection(false, false, false, true)
          }
        } else if (
          newEndTime < this.scrollMaxZoomedStamp &&
          newStartTime < this.scrollMinZoomedStamp &&
          !this.svgEnoughlength &&
          this.svgLengthOutOfRange &&
          !this.svgNotBothOutOfRange
        ) {
          //初始長度超出範圍 & 結束時間<=結束時間範圍
          if (this.svgMoveToLeftPlus) {
            this.svgMoveToLeftPlus = false
            this.svgRightOutOfRange = false
          }
          if (!this.svgRightOutOfRange && !this.svgLeftOutOfRange && !this.svgEnoughlength) {
            //如果開始時間 & 結束時間皆已進入範圍內過 則代表長度已經足夠
            this.svgEnoughlength = true
          } else {
            this.svgMoveDirection(false, true, false, false)
          }
        }
      }
    },
    svgMoveDirection(leftPlus, left, rightPlus, right) {
      this.svgMoveToLeftPlus = leftPlus
      this.svgMoveToLeft = left
      this.svgMoveToRightPlus = rightPlus
      this.svgMoveToRight = right
    },
    mouseUp(event) {
      if (this.onMouseDownSecond) {
        if (this.moveYOffset && this.tooltipOgY) {
          this.tooltipOgY -= this.moveYOffset
        }
        this.dragMouseUpProcess()
        if (this.timeConflict) {
          this.$layer.msg(
            this.$t('schedule_number') +
              ': ' +
              this.dragObj.scheduleSerial +
              ' ' +
              this.$t('gantt_mes4'),
            {
              //排程時間衝突
              shade: this.layerShade,
              shadeClose: this.layerShadeClose,
              time: this.layerTime
            }
          )
        } else {
          let circles = []
          document.getElementsByTagName('g').forEach(item => {
            if (item.getAttribute('customDirection')) {
              circles.push(item)
            }
          })
          circles.forEach(circle => {
            circle.remove()
          })
          this.editingCompleted()
        }
      } else if (this.onMouseMoveTimeBase) {
        this.onMouseMoveTimeBase = false
        let offsetX = this.timeBasePointX - event.screenX
        let rectWidth = document.getElementsByTagName('rect')[3].getBBox().width
        let offsetTime = Math.round(offsetX * (this.timeInterval / rectWidth))
        this.scrollMinZoomedStamp += offsetTime
        this.scrollMinZoomed = this.timeStamp2String(this.scrollMinZoomedStamp)
      } else if (this.onMouseMoveMachine) {
        let ganttChart = document.getElementsByClassName('ganttChart')[0]
        ganttChart.children.forEach(item => {
          if (item.getAttribute('moveMachineTag')) {
            ganttChart.removeChild(item)
          }
        })
        if (event.path[0].tagName == 'tspan') {
          let nowMachineNumber = event.path[0].innerHTML
          let checkFlag = this.allmachine.some(item => {
            return item.machineNumber == nowMachineNumber
          })
          if (nowMachineNumber != this.moveMachineNumber && checkFlag) {
            let start = this.allmachine.findIndex(
              index => index.machineNumber == this.moveMachineNumber
            )
            let end = this.allmachine.findIndex(index => index.machineNumber == nowMachineNumber)
            let startObj = Object.assign(this.allmachine[start], {})
            let endObj = Object.assign(this.allmachine[end], {})
            this.allmachine.splice(start, 1, endObj)
            this.allmachine.splice(end, 1, startObj)
            this.allmachine.forEach(machine => {
              this.chart.data.sort((a, b) => {
                if (
                  b.machineNumber == machine.machineNumber &&
                  this.categoryAxis.renderer.inversed
                ) {
                  return -1
                } else if (
                  a.machineNumber == machine.machineNumber &&
                  !this.categoryAxis.renderer.inversed
                ) {
                  return -1
                } else {
                  return 0
                }
              })
            })
            this.backupAllmachine = Object.assign(this.allmachine, [])
            this.chart.validateData()
            setTimeout(() => {
              this.dateAxis.zoomToDates(
                this.scrollMinZoomed,
                this.scrollMaxZoomed,
                false,
                true,
                false
              )
            }, 50)
          } else {
            this.onMouseMoveMachine = false
            this.moveMachineNumber = null
            this.chart.validateData()
            setTimeout(() => {
              this.dateAxis.zoomToDates(
                this.scrollMinZoomed,
                this.scrollMaxZoomed,
                false,
                true,
                false
              )
            }, 50)
          }
        }
        this.onMouseMoveMachine = false
        this.moveMachineNumber = null
      }
    },
    dragMouseUpProcess() {
      this.tooltipShow(this.dragObj.target.getAttribute('id'), false)
      this.dragObj.startTime = this.timeStamp2String(this.dragObj.startTimestamp)
      this.dragObj.endTime = this.timeStamp2String(this.dragObj.endTimestamp)
      this.dragObj.transform = this.dragObj.target.getAttribute('transform')
      this.onMouseDownSecond = false
      this.onMouseDirection = false
    },
    deleteRow(index) {
      this.dragObjArray.splice(index, 1)
    },
    beforeModal() {
      this.beforeModalFlag = 0
      this.dragObjArray.forEach((obj, index) => {
        this.modalGetMoldMachine(obj.moldId, index)
      })
    },
    modalGetMoldMachine(id, index) {
      var access_token_val = this.$cookies.get('access_token')
      ScheduleOEEplusMoldMachineAPI.get({
        headers: {
          access_token: access_token_val,
          id: id
        }
      }).then(
        res => {
          if (res.data != null) {
            res.data.sort((a, b) => naturalCompare(a.machineNumber, b.machineNumber))
          }
          this.dragObjArray[index].machinearray = []
          if (res.data != null) {
            res.data.forEach(item => {
              this.dragObjArray[index].machinearray.push({
                value: item.id,
                text: item.machineNumber
              })
            })
          }
          //等全部加載完才顯示視窗
          this.beforeModalFlag++
          if (this.beforeModalFlag == this.dragObjArray.length) {
            this.errormes = ''
            this.modal = true
          }
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    getMoldMachine(id, type) {
      this.setMachineList = []
      let access_token_val = this.$cookies.get('access_token')
      ScheduleOEEplusMoldMachineAPI.get({
        headers: {
          access_token: access_token_val,
          id: id
        }
      }).then(res => {
        if (res.data != null) {
          if (!this.backupAllmachine) {
            if (this.categoryAxis.renderer.inversed) {
              res.data.sort((a, b) => naturalCompare(a.machineNumber, b.machineNumber))
            } else {
              res.data.sort((a, b) => naturalCompare(b.machineNumber, a.machineNumber))
            }
          }
          res.data.forEach(item => {
            this.setMachineList.push({
              value: item.id,
              text: item.machineNumber
            })
          })
          if (type) {
            this.rectMachineMask()
          }
        }
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      })
    },
    rectMachineMask() {
      let html = document.getElementsByTagName('rect')[3].parentNode
      html.children.forEach(child => {
        if (child.tagName == 'defs') {
          html.removeChild(child)
        }
      })
      let findIndexArr = []
      this.setMachineList.forEach(list => {
        let result = this.allmachine.findIndex(index => index.machineNumber == list.text)
        if (result != -1) {
          findIndexArr.push(result)
        }
      })
      this.logicArr = []
      let logicFlag = false
      this.svgMoveY = []
      let rectHeight = document.getElementsByTagName('rect')[3].getBBox().height
      this.svgMoveYGap = parseFloat((rectHeight / this.allmachine.length) * 0.25)
      for (let i = 0; i < this.allmachine.length; i++) {
        logicFlag = false
        for (let j = 0; j < findIndexArr.length; j++) {
          if (i == findIndexArr[j]) {
            logicFlag = true
          }
          if (logicFlag && j == findIndexArr.length - 1) {
            this.logicArr.push(1)
            let target = Object.assign({}, this.allmachine[i])
            target['yAxis'] = parseFloat(
              (
                (rectHeight / this.allmachine.length) * 0.25 +
                (rectHeight / this.allmachine.length) * i
              ).toFixed(1)
            )
            this.svgMoveY.push(target)
          } else if (!logicFlag && j == findIndexArr.length - 1) {
            this.logicArr.push(0)
          }
        }
      }
      let svgns = 'http://www.w3.org/2000/svg'
      let defs = document.createElementNS(svgns, 'defs')
      let linearGradient = document.createElementNS(svgns, 'linearGradient')
      linearGradient.setAttribute('id', 'rectMask')
      linearGradient.setAttribute('x1', '0%')
      linearGradient.setAttribute('y1', '0%')
      linearGradient.setAttribute('x2', '0%')
      linearGradient.setAttribute('y2', '100%')
      let nowFlag
      let nowPercent = 0
      let whiteStart
      let whiteEnd
      let grayStart
      let grayEnd
      if (this.logicArr.length == 0 && this.svgMoveY.length == 0) {
        linearGradient = this.gradationProcessing(svgns, linearGradient, this.color('gray'), 0, 100)
      } else {
        for (let i = 0; i < this.logicArr.length; i++) {
          // 1可以擺(白色) 0不能擺(灰色)
          if (i == 0 && this.logicArr[i] == 0) {
            grayStart = i
            nowFlag = 0
          } else if (i == 0 && this.logicArr[i] == 1) {
            whiteStart = i
            nowFlag = 1
          }

          if (
            i != 0 &&
            i != this.logicArr.length - 1 &&
            this.logicArr[i] != nowFlag &&
            nowFlag == 0
          ) {
            grayEnd = ((i - grayStart) / this.logicArr.length) * 100 + nowPercent
            linearGradient = this.gradationProcessing(
              svgns,
              linearGradient,
              this.color('gray'),
              nowPercent,
              grayEnd
            )
            nowPercent = grayEnd
            whiteStart = i
            nowFlag = this.logicArr[i]
          } else if (
            i != 0 &&
            i != this.logicArr.length - 1 &&
            this.logicArr[i] != nowFlag &&
            nowFlag == 1
          ) {
            whiteEnd = ((i - whiteStart) / this.logicArr.length) * 100 + nowPercent
            linearGradient = this.gradationProcessing(
              svgns,
              linearGradient,
              this.color('white'),
              nowPercent,
              whiteEnd
            )
            nowPercent = whiteEnd
            grayStart = i
            nowFlag = this.logicArr[i]
          }

          if (i == this.logicArr.length - 1) {
            if (this.logicArr[i] == nowFlag) {
              if (this.logicArr[i] == 0) {
                linearGradient = this.gradationProcessing(
                  svgns,
                  linearGradient,
                  this.color('gray'),
                  nowPercent,
                  100
                )
              } else if (this.logicArr[i] == 1) {
                linearGradient = this.gradationProcessing(
                  svgns,
                  linearGradient,
                  this.color('white'),
                  nowPercent,
                  100
                )
              }
            } else {
              if (nowFlag == 0) {
                grayEnd = (i / this.logicArr.length) * 100
                linearGradient = this.gradationProcessing(
                  svgns,
                  linearGradient,
                  this.color('gray'),
                  nowPercent,
                  grayEnd
                )
                linearGradient = this.gradationProcessing(
                  svgns,
                  linearGradient,
                  this.color('white'),
                  grayEnd,
                  100
                )
              } else if (nowFlag == 1) {
                whiteEnd = (i / this.logicArr.length) * 100
                linearGradient = this.gradationProcessing(
                  svgns,
                  linearGradient,
                  this.color('white'),
                  nowPercent,
                  whiteEnd
                )
                linearGradient = this.gradationProcessing(
                  svgns,
                  linearGradient,
                  this.color('gray'),
                  whiteEnd,
                  100
                )
              }
            }
          }
        }
      }
      defs.appendChild(linearGradient)
      html.setAttribute('fill-opacity', 1)
      html.appendChild(defs)
      html.style.fill = 'url(#rectMask)'
    },
    timeInputChange(item) {
      let startTime = this.stringtotimestamp(item.startTime)
      let endTime = this.stringtotimestamp(item.endTime)
      item.workingTime = this.workingHours(startTime, endTime)
      this.$nextTick(() => {
        this.$refs.editTable.refresh()
      })
    },
    saveModal() {
      let checkMoldCycleTimeFlag = false
      this.dragObjArray.forEach(obj => {
        if (parseFloat(obj.moldCycleTime) < 0.1) {
          checkMoldCycleTimeFlag = true
        }
      })
      if (checkMoldCycleTimeFlag) {
        this.errormes = this.$t('mold_import_ct_error')
      } else {
        let submitarray = []
        this.dragObjArray.forEach(item => {
          let tempobject = {
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
            workShopId: item.workShopId,
            remark: item.remark
          }
          submitarray.push(tempobject)
        })
        let access_token_val = this.$cookies.get('access_token')
        ScheduleOEEplusmultieditAPI.put(JSON.stringify(submitarray), {
          headers: {
            access_token: access_token_val
          }
        }).then(
          () => {
            this.$layer.msg(this.$t('scuccess'))
            this.dragObjArray.length = 0
            this.chartshowflag = false
            this.$emit('callparent')
            this.$nextTick(() => {
              this.resetGantt()
              this.modal = false
            })
          },
          error => {
            this.errorArray = error.response.data.errorArray
          }
        )
      }
    },

    gradationProcessing(svgns, linearGradient, color, start, end) {
      let stopStartTag = document.createElementNS(svgns, 'stop')
      let stopEndTag = document.createElementNS(svgns, 'stop')
      stopStartTag.style.stopColor = color
      stopEndTag.style.stopColor = color
      stopStartTag.setAttribute('offset', start + '%')
      stopEndTag.setAttribute('offset', end + '%')
      linearGradient.appendChild(stopStartTag)
      linearGradient.appendChild(stopEndTag)
      return linearGradient
    },
    tooltipShow(target, show) {
      let columns = this.chart.series.values[0].columns.values
      columns.forEach(column => {
        if (show && target == column.uid) {
          column.alwaysShowTooltip = true //tooltip alwaysshow
        } else if (!show) {
          column.showTooltipOn = 'hover' //tooltip alwaysshowClose
          column.alwaysShowTooltip = false
        }
      })
      let tooltip = document.getElementsByTagName('g')
      tooltip.forEach(item => {
        if (item.getAttribute('aria-describedby') && item.getAttribute('role') == 'tooltip') {
          let tooltipTarget = item.getAttribute('aria-describedby')
          if (show && target == tooltipTarget) {
            item.setAttribute('opacity', 1)
          } else if (!show) {
            item.setAttribute('opacity', 0)
          }
        }
      })
    },
    stringtotimestamp(value) {
      //日期轉時間搓
      let timestamp = Date.parse(value)
      return timestamp
    },
    timeStamp2String(time, num) {
      //時間搓轉換日期
      if (time === 0) {
        return 0
      }
      let datetime = new Date()
      datetime.setTime(time)
      let year = datetime.getFullYear()
      let month = this.pushzero(datetime.getMonth() + 1)
      let date = this.pushzero(datetime.getDate())
      let hour = this.pushzero(datetime.getHours())
      let minute = this.pushzero(datetime.getMinutes())
      if (num == 2) {
        return year + '-' + month + '-' + date + ' ' + hour + ':' + minute
      }

      return year + '-' + month + '-' + date + 'T' + hour + ':' + minute
    },
    workingHours(startTime, endTime) {
      let interval = endTime / 1000 - startTime / 1000
      let day = Math.floor(interval / 86400)
      let hour = Math.floor((interval % 86400) / 3600)
      let minute = Math.floor(((interval % 86400) % 3600) / 60)
      if (day == 0 && hour == 0) {
        return '< 1h'
      }
      return day + 'd ' + hour + 'h ' + minute + 'm'
    },
    pushzero(value) {
      if (value < 10) {
        value = '0' + value
      }
      return value
    },
    yAxisSort() {
      this.backupAllmachine = null
      this.categoryAxis.renderer.inversed = !this.categoryAxis.renderer.inversed
      this.allmachine = this.allmachine.reverse()
      if (this.dragObj) {
        this.getMoldMachine(this.dragObj.scheduleobject.moldId, true)
      }
      this.chart.validateData()
      setTimeout(() => {
        this.dateAxis.zoomToDates(this.scrollMinZoomed, this.scrollMaxZoomed)
      }, 50)
    },
    setBackupAllMachine() {
      this.backupAllmachine = null
      if (this.categoryAxis.renderer.inversed) {
        this.allmachine.sort((a, b) => naturalCompare(a.machineNumber, b.machineNumber))
      } else {
        this.allmachine.sort((a, b) => naturalCompare(b.machineNumber, a.machineNumber))
      }
      this.allmachine.forEach(machine => {
        this.scheduleobject.sort((a, b) => {
          if (b.machineNumber == machine.machineNumber && this.categoryAxis.renderer.inversed) {
            return -1
          } else if (
            a.machineNumber == machine.machineNumber &&
            !this.categoryAxis.renderer.inversed
          ) {
            return -1
          } else {
            return 0
          }
        })
      })
      this.chart.data = this.scheduleobject
      this.setDefaultTime()
      this.resetGantt()
      this.chart.validateData()
      setTimeout(() => {
        this.dateAxis.zoomToDates(this.scrollMinZoomed, this.scrollMaxZoomed)
      }, 50)
    },
    //取得設備
    getmachine() {
      let access_token_val = this.$cookies.get('access_token')
      gmachineSelectAPI({
        headers: {
          access_token: access_token_val,
          workshop: 'true'
        }
      }).then(
        res => {
          if (res.data != null) {
            let tempamchinearray = []
            res.data.forEach(item => {
              if (this.workshop == -1) {
                tempamchinearray.push(item)
              } else {
                if (item.workShopId == this.workshop) {
                  tempamchinearray.push(item)
                }
              }
            })
            this.allmachine = tempamchinearray
            if (this.categoryAxis.renderer.inversed) {
              this.allmachine.sort((a, b) => naturalCompare(a.machineNumber, b.machineNumber))
            } else {
              this.allmachine.sort((a, b) => naturalCompare(b.machineNumber, a.machineNumber))
            }
            this.getdata()
          }
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //選擇廠區
    selectworkshop(object) {
      let temparray = []
      if (object != null) {
        object.forEach(item => {
          //選擇廠區
          if (this.workshop == -1) {
            temparray.push(JSON.parse(JSON.stringify(item)))
          } else {
            if (item.workShopId == this.workshop) {
              temparray.push(JSON.parse(JSON.stringify(item)))
            }
          }
        })
      }

      return temparray
    },
    getdata() {
      this.scrollMinZoomedStamp = 0
      this.scrollMinZoomed = null
      this.scrollMaxZoomedStamp = 0
      this.scrollMaxZoomed = null
      this.scheduleobject = this.selectworkshop(this.scheduledata)
      let checkscheduleobject = false
      if (this.scheduleobject != null) {
        this.minTimeStamp = 9999999999999
        this.maxTimeStamp = 0
        this.scheduleobject.forEach(item => {
          checkscheduleobject = true
          if (item.startTimechart < this.minTimeStamp) {
            this.minTimeStamp = item.startTimechart
          }
          if (item.endTimechart > this.maxTimeStamp) {
            this.maxTimeStamp = item.endTimechart
          }

          if (item.status == 2) {
            //任務中
            item.color = this.color('green')
            this.scheduleType = 2
          } else if (item.status == 1) {
            //已完成
            item.color = this.color('darkgray')
            this.scheduleType = 1
          } else {
            //待轉任務
            item.color = this.color('blue')
            this.scheduleType = 3
          }
          item.strokeColor = this.color('black')
          item.strokeWidth = this.svgSetStrokeWidth
        })
      }
      //設定頭尾時間
      this.maxTime = this.timeStamp2String(this.maxTimeStamp)
      this.minTime = this.timeStamp2String(this.minTimeStamp)
      this.maxTimeStamp = this.stringtotimestamp(this.maxTime)
      this.minTimeStamp = this.stringtotimestamp(this.minTime)
      //設定chart圖高度
      if (this.allmachine.length != 0) {
        let totalpx = this.allmachine.length * 35 + 100
        this.chart.svgContainer.htmlElement.style.height = totalpx + 'px'
      }

      if (this.scheduleobject != null) {
        this.scheduleobject.length * 20 + this.categoryAxis.pixelHeight + 'px'
      }
      if (this.backupAllmachine) {
        this.allmachine = Object.assign(this.backupAllmachine, [])
      }
      //塞整廠設備
      if (this.allmachine != null) {
        this.allmachine.forEach(item => {
          this.scheduleobject.push(item)
        })
      }
      //排序
      if (this.backupAllmachine) {
        this.backupAllmachine.forEach(machine => {
          this.scheduleobject.sort((a, b) => {
            if (b.machineNumber == machine.machineNumber && this.categoryAxis.renderer.inversed) {
              return -1
            } else if (
              a.machineNumber == machine.machineNumber &&
              !this.categoryAxis.renderer.inversed
            ) {
              return -1
            } else {
              return 0
            }
          })
        })
      } else {
        this.scheduleobject.sort((a, b) => naturalCompare(a.machineNumber, b.machineNumber))
      }
      this.chart.data = this.scheduleobject
      this.dateAxis.max = this.maxTime
      this.dateAxis.min = this.minTime
      this.chartshowflag = true
      setTimeout(() => {
        let rectWidth = document.getElementsByTagName('rect')[3].getBBox().width
        this.baseMinGridDistance = parseInt(
          Math.floor(rectWidth / this.dateAxis.renderer.minGridDistance)
        )
        this.chartshowflag = false
        if (this.baseMinGridDistance >= 24) {
          this.baseMinGridDistance = 24
        }
        this.setDefaultTime()
        if (checkscheduleobject) {
          this.scrollMinZoomedStamp = this.minTimeStamp
          this.scrollMinZoomed = this.minTime
          this.scrollMaxZoomedStamp = this.minTimeStamp + this.timeInterval
          this.scrollMaxZoomed = this.timeStamp2String(this.scrollMaxZoomedStamp)
        }
        this.dateAxis.max = this.maxTime
        this.dateAxis.min = this.scrollMinZoomedStamp - this.baseMinGridDistance * 86397500
        this.chartshowflag = true
        setTimeout(() => {
          document.getElementsByTagName('g').forEach(item => {
            if (
              item.getAttribute('stroke-opacity') == 0.15 &&
              item.getAttribute('fill') == 'none'
            ) {
              item.setAttribute('rectBaseGrid', true)
            }
          })
        }, 50)
      }, 500)
    }
  },

  mounted() {
    let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart)
    chart.hiddenState.properties.opacity = 0 // this creates initial fade-in
    chart.language.locale = 'zh_Hant'
    chart.paddingRight = 30
    chart.dateFormatter.inputDateFormat = 'yyyy-MM-dd HH:mm'
    chart.paddingTop = 60
    let colorSet = new am4core.ColorSet()
    colorSet.saturation = 0.4
    chart.data = []
    chart.dateFormatter.dateFormat = 'yyyy-MM-dd HH:mm'
    chart.dateFormatter.inputDateFormat = 'yyyy-MM-dd HH:mm'
    this.categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis())
    this.categoryAxis.dataFields.category = 'machineNumber'
    this.categoryAxis.renderer.grid.template.location = 0
    this.categoryAxis.renderer.inversed = true
    this.categoryAxis.renderer.minGridDistance = 2
    this.dateAxis = chart.xAxes.push(new am4charts.DateAxis())
    this.dateAxis.renderer.minGridDistance = 50
    this.dateAxis.baseInterval = { count: 1, timeUnit: 'minute' }
    this.dateAxis.dateFormats.setKey('day', 'MM/dd')
    this.dateAxis.periodChangeDateFormats.setKey('day', 'MM/dd')
    this.dateAxis.periodChangeDateFormats.setKey('hour', 'MM/dd')
    this.dateAxis.showOnInit = false
    this.dateAxis.keepSelection = true
    this.dateAxis.gridIntervals.setAll([
      { timeUnit: 'hour', count: 1 },
      { timeUnit: 'hour', count: 2 },
      { timeUnit: 'hour', count: 12 },
      { timeUnit: 'day', count: 1 }
    ])

    this.dateAxis.strictMinMax = true
    this.dateAxis.renderer.tooltipLocation = 0

    let series1 = chart.series.push(new am4charts.ColumnSeries())
    series1.columns.template.height = am4core.percent(70)
    series1.columns.template.tooltipText = `{scheduleSerial}:
      [bold]{openDateX}[/] - [bold]{dateX}[/]
      {moldNumber}
      `

    series1.tooltip.pointerOrientation = 'down'
    series1.tooltip.dy = -10
    series1.dataFields.openDateX = 'startTimechart'
    series1.dataFields.dateX = 'endTimechart'
    series1.dataFields.categoryY = 'machineNumber'
    series1.columns.template.propertyFields.fill = 'color' // get color from data
    series1.columns.template.propertyFields.stroke = 'strokeColor'
    series1.columns.template.propertyFields.strokeWidth = 'strokeWidth'
    series1.columns.template.strokeOpacity = 1

    let columnTemplate = series1.columns.template
    columnTemplate.height = am4core.percent(50)

    this.chart = chart
    this.chart.zoomOutButton.disabled = true
    this.chart.series.values[0].cursorOverStyle = am4core.MouseCursorStyle.pointer
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ganttChart {
  width: 100%;
  height: 500px;
}

.image-container {
  width: 100%;
  height: 655px;
  display: flex;
  justify-content: center;
}
img {
  display: block;
  margin: auto;
}

.md-form {
  margin-bottom: 0 !important;
}

.inputCenter {
  text-align: center !important;
}

.deitedeletebtm {
  margin: 0;
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

@media (min-width: 992px) and (max-width: 1110px) {
  .col-lg-6 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}

@media (min-width: 1200px) and (max-width: 1715px) {
  .col-xl-2 {
    flex: 0 0 50%;
    max-width: 50%;
  }
  .col-xl-3 {
    flex: 0 0 50%;
    max-width: 50%;
  }
  .offset-xl-1 {
    margin-left: 0;
  }
}

@media (min-width: 1715px) and (max-width: 1855px) {
  .col-xl-3 {
    flex: 0 0 27.5%;
    max-width: 27.5%;
  }
  .offset-xl-1 {
    margin-left: 0;
  }
}
</style>
