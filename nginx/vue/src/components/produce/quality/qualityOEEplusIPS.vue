<template>
  <b-container fluid>
    <mdb-card>
      <mdb-card-body>
        <!-- <div class="mx-3">
          <h2>品檢管理</h2>
        </div>-->
        <b-row>
          <b-col cols="8">
            <mdb-input
              style="width:80%;margin-bottom:0.8rem"
              v-model="filter"
              type="search"
              id="filterInput"
              :placeholder="
                this.$t('quality_number') +
                  '、' +
                  this.$t('manufacturingorder_number') +
                  '、' +
                  this.$t('manufacturingorder_customize_number') +
                  '、' +
                  this.$t('task_number') +
                  '、' +
                  this.$t('mold') +
                  '、' +
                  this.$t('remark') +
                  '、' +
                  this.$t('product_number')
              "
            >
              <span class="input-group-text" slot="prepend">{{ $t('search') }}</span>

              <!-- <mdb-btn size="sm" color="primary" :disabled="!filter" @click="filter = ''">清除</mdb-btn> -->
            </mdb-input>
          </b-col>
          <b-col>
            <div class="input-group">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01" style="width:160px">{{
                  $t('workshop_machine')
                }}</label>
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
        <b-row>
          <b-col>
            <!-- 新增 -->
            <mdb-btn
              v-if="newbtm"
              size="sm"
              color="primary"
              v-on:click="storagewindow([], [], 'new')"
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
          </b-col>
          <b-col></b-col>
          <b-col cols="4">
            <div class="input-group">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01" style="width:160px">{{
                  $t('produce_time_type')
                }}</label>
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
        <!-- <mdb-btn
          size="sm"
          color="primary"
          v-on:click="storagewindow([], [], 'new')"
          >新增</mdb-btn
        >

        <mdb-btn
          size="sm"
          color="danger"
          :disabled="selected ? selected == 0 : false"
          @click.native="warning = true"
        >{{ $t('close') }}</mdb-btn>-->
        <b-table
          class="qualitypctableclass"
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
          <!-- <template v-slot:cell(serialNumber)="row" class="col-sm-3">{{ row.item }}</template> -->
          <!-- <template v-slot:cell(name)="row">{{ row.value }}</template> -->
          <!--<template v-slot:cell(checkbox)="row">
            <b-form-checkbox></b-form-checkbox>
          </template>-->

          <template v-slot:cell(actions)="row">
            <!-- 編輯 -->
            <mdb-btn
              v-if="editbtm"
              color="mdb-color"
              @click="storagewindow(row.item, row.index, 'edit')"
              type="button"
              style="padding:0.1rem"
              icon="pencil-alt"
            ></mdb-btn>
            <mdb-btn
              v-if="!row.detailsShowing"
              color="mdb-color"
              @click="row.toggleDetails"
              type="button"
              style="padding:0.1rem"
              icon="chevron-down"
            ></mdb-btn>
            <mdb-btn
              v-if="row.detailsShowing"
              color="mdb-color"
              @click="row.toggleDetails"
              type="button"
              style="padding:0.1rem"
              icon="chevron-up"
            ></mdb-btn>
            <!-- <b-button size="sm" @click="row.toggleDetails"
              >{{ row.detailsShowing ? '隱藏' : '顯示' }} 詳細</b-button
            >-->
          </template>
          <!--詳細資訊 -->
          <template v-slot:row-details="row">
            <b-card>
              <div v-for="(value, key) in row.item.defect" :key="key">
                <b-row>
                  <b-col lg="2">{{ $t('defect_name') }}: {{ value.defectName }}</b-col>
                  <b-col lg="2">{{ $t('number') }}: {{ value.number }}</b-col>
                </b-row>
                <hr />
              </div>
              <!-- <ul>
                <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
              </ul>-->
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
            <b-button size="sm" @click="storagewindow(row.item, row.index, 'edit')">編輯</b-button>
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
    <!-- 新增 -->
    <mdb-modal :show="newmodal" @close="closemodal($event)" size="lg">
      <form v-on:submit.prevent="confirmsubmit">
        <mdb-modal-header>
          <mdb-modal-title>{{ operate }} {{ $t('quality') }}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <div>
            <b-row>
              <b-col>
                <!-- "製品編號、模具編號、設備編號" -->
                <input
                  v-model="newinputsearch"
                  class="form-control"
                  type="text"
                  :placeholder="
                    this.$t('product_number') +
                      '、' +
                      this.$t('mold_number') +
                      '、' +
                      this.$t('machine_number')
                  "
                  aria-label="Search"
                />
              </b-col>
              <b-col>
                <mdb-btn @click="searchbtm()" type="button" style="margin:0px;padding:10px">
                  {{ $t('search') }}
                </mdb-btn>
              </b-col>
              <b-col></b-col>
            </b-row>
            <hr />
            <!-- <div v-if="taskobject.length != 0">
              <mdb-btn
                v-if="cardhide"
                color="mdb-color"
                @click="cardhidefunc()"
                type="button"
                style="padding:0.4rem"
                icon="chevron-down"
              ></mdb-btn>
              <mdb-btn
                v-if="!cardhide"
                color="mdb-color"
                @click="cardhidefunc()"
                type="button"
                style="padding:0.4rem"
                icon="chevron-up"
              ></mdb-btn>
            </div>-->
            <b-row v-if="searchtableshow">
              <b-table
                responsive
                show-empty
                bordered
                :hover="true"
                :items="taskobject"
                :fields="taskobjectfields"
                :filter="filter"
                :filterIncludedFields="filterOn"
                :sort-by.sync="sortBy"
                sort-desc.sync="asc"
                :sort-direction="sortDirection"
                @filtered="onFiltered"
              >
                <template v-slot:cell(actions)="row">
                  <mdb-btn
                    v-if="!row.detailsShowing"
                    color="mdb-color"
                    @click="showDetails(row.item, row.index, row)"
                    type="button"
                    style="padding:0.4rem"
                    icon="chevron-down"
                  ></mdb-btn>
                  <mdb-btn
                    v-if="row.detailsShowing"
                    color="mdb-color"
                    @click="row.toggleDetails"
                    type="button"
                    style="padding:0.4rem"
                    icon="chevron-up"
                  ></mdb-btn>
                </template>
                <!--詳細資訊 -->
                <template v-slot:row-details="row">
                  <mdb-btn type="button" style="width:90%;border:0px" outline="black" disabled>
                    <!--  -->
                    <b-row>
                      <b-col cols="3" style="text-align:center">{{ $t('product_number') }}</b-col>
                      <b-col cols="3" style="text-align:center">{{
                        $t('manufacturingorder_number')
                      }}</b-col>
                      <b-col cols="3" style="text-align:center">{{
                        $t('manufacturingorder_customize_number')
                      }}</b-col>
                    </b-row>
                  </mdb-btn>
                  <div :key="index" v-for="(taskOptions, index) in row.item.tempnewobject1">
                    <mdb-btn
                      @click="selectManufacturingOrderObject(taskOptions)"
                      type="button"
                      style="width:90%"
                      :color="taskOptions.color"
                    >
                      <!-- :color="taskOptions.color" -->
                      <b-row>
                        <b-col cols="3" style="text-align:center">{{
                          taskOptions.productNumber
                        }}</b-col>
                        <b-col cols="3" style="text-align:center">{{
                          taskOptions.manufactureOrderNumber
                        }}</b-col>
                        <b-col cols="3" style="text-align:center">{{
                          taskOptions.manufactureOrderCusomizeNumber
                        }}</b-col>
                      </b-row>
                    </mdb-btn>
                  </div>
                </template>
              </b-table>
              {{ taskOptions }}
            </b-row>
            <hr />
            <div style="opacity:0">1</div>
            <div :key="index1" v-for="(newobjects, index1) in newobject" align="center">
              <mdb-card>
                <mdb-card-body>
                  <b-row>
                    <b-col>
                      <div class="input-group">
                        <mdb-input
                          class="mb-3"
                          v-model="newobjects.serialNumber"
                          :disabled="true"
                          :show="modal"
                          style="background-color:#e9ecef;"
                        >
                          <span class="input-group-text" required slot="prepend">{{
                            $t('quality_number')
                          }}</span>
                        </mdb-input>
                      </div>
                    </b-col>
                    <b-col>
                      <div class="input-group">
                        <mdb-input
                          class="mb-3"
                          v-model="newobjects.productNumber"
                          :disabled="true"
                          :show="modal"
                          style="background-color:#e9ecef;"
                        >
                          <span class="input-group-text" required slot="prepend">{{
                            $t('product_number')
                          }}</span>
                        </mdb-input>
                      </div>
                    </b-col>
                    <b-col></b-col>
                  </b-row>
                  <b-row>
                    <b-col>
                      <div class="input-group">
                        <mdb-input
                          :min="0"
                          type="number"
                          @focus="focus($event)"
                          class="mb-3"
                          v-model="newobjects.normalNumber"
                        >
                          <span class="input-group-text" required slot="prepend">{{
                            $t('normal_number')
                          }}</span>
                        </mdb-input>
                      </div>
                    </b-col>
                    <b-col>
                      <div class="input-group">
                        <mdb-input
                          :min="0"
                          type="number"
                          @focus="focus($event)"
                          class="mb-3"
                          v-model="newobjects.abnormalNumber"
                        >
                          <span class="input-group-text" required slot="prepend">{{
                            $t('abnormal_number')
                          }}</span>
                        </mdb-input>
                      </div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col>
                      <div class="input-group">
                        <mdb-input class="mb-3" v-model="newobjects.remark">
                          <span class="input-group-text" required slot="prepend">{{
                            $t('remark')
                          }}</span>
                        </mdb-input>
                      </div>
                    </b-col>
                  </b-row>
                  <b-row>
                    <b-col align="left">
                      <h5>{{ $t('defect_record') }}</h5>
                    </b-col>
                    <b-col></b-col>
                  </b-row>
                  <b-row>
                    <b-col sm="3" :key="index2" v-for="(defectobject, index2) in newobjects.defect">
                      <div class="input-group">
                        <mdb-input
                          :min="0"
                          type="number"
                          @focus="focus($event)"
                          class="mb-3"
                          v-model="defectobject.number"
                        >
                          <span class="input-group-text" required slot="prepend">{{
                            defectobject.defectName
                          }}</span>
                        </mdb-input>
                      </div>
                    </b-col>
                  </b-row>
                </mdb-card-body>
              </mdb-card>
            </div>
          </div>
        </mdb-modal-body>
        <mdb-modal-footer>
          <span style="color:red">{{ errormes }}</span>

          <!-- 不再品檢 -->
          <mdb-input
            type="checkbox"
            id="checkbox1"
            name="check1"
            v-model="newisLast"
            :label="this.$t('no_more_quality')"
          />
          <mdb-btn color="info" type="submit" :disabled="newsubmitbtm">{{ $t('submit') }}</mdb-btn>
          <mdb-btn color="0000" @click.native="newmodal = false" type="button">{{
            $t('close')
          }}</mdb-btn>
        </mdb-modal-footer>
      </form>
    </mdb-modal>
    <!-- 編輯 -->
    <mdb-modal :show="modal" @close="closemodal($event)" size="lg">
      <form v-on:submit.prevent="submitfunc">
        <mdb-modal-header>
          <mdb-modal-title>{{ operate }} {{ $t('quality') }}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <div>
            <b-row>
              <b-col>
                <div class="input-group">
                  <mdb-input
                    :disabled="true"
                    :show="modal"
                    class="mb-3"
                    v-model="qualityobject.serialNumber"
                  >
                    <span class="input-group-text" required slot="prepend">{{
                      $t('quality_number')
                    }}</span>
                  </mdb-input>
                </div>
              </b-col>
              <b-col>
                <div class="input-group">
                  <mdb-input
                    :disabled="true"
                    :show="modal"
                    class="mb-3"
                    v-model="qualityobject.taskNumber"
                  >
                    <span class="input-group-text" required slot="prepend">{{
                      $t('task_number')
                    }}</span>
                  </mdb-input>
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <mdb-input
                  class="mb-3"
                  v-model="qualityobject.normalNumber"
                  type="number"
                  :min="0"
                  @focus="focus($event)"
                >
                  <span class="input-group-text" slot="prepend">{{ $t('normal_number') }}</span>
                </mdb-input>
              </b-col>
              <b-col>
                <mdb-input
                  class="mb-3"
                  v-model="qualityobject.abnormalNumber"
                  type="number"
                  :min="0"
                  @focus="focus($event)"
                >
                  <span class="input-group-text" slot="prepend">{{ $t('abnormal_number') }}</span>
                </mdb-input>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <div class="input-group">
                  <mdb-input class="mb-3" v-model="qualityobject.remark">
                    <span class="input-group-text" required slot="prepend">{{ $t('remark') }}</span>
                  </mdb-input>
                </div>
              </b-col>
            </b-row>
            <hr />
            <b-row>
              <b-col>
                <h3>{{ $t('defect_record') }}</h3>
              </b-col>
              <b-col>
                <!-- <div>{{ $t('defect_total') }}: {{ qualityobject.total }}</div> -->
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <div
                  :key="index"
                  v-for="(defectOptions, index) in qualityobject.defect"
                  align="center"
                >
                  <mdb-input
                    v-if="index % 2 == 0"
                    class="mb-3"
                    required
                    v-model="defectOptions.number"
                    type="number"
                    :min="0"
                    @focus="focus($event)"
                    @change="defectchange()"
                  >
                    <span class="input-group-text" slot="prepend">{{
                      defectOptions.defectName
                    }}</span>
                  </mdb-input>
                </div>
              </b-col>
              <b-col>
                <div
                  :key="index"
                  v-for="(defectOptions, index) in qualityobject.defect"
                  align="center"
                >
                  <mdb-input
                    v-if="index % 2 != 0"
                    class="mb-3"
                    required
                    v-model="defectOptions.number"
                    type="number"
                    :min="0"
                    @focus="focus($event)"
                    @change="defectchange()"
                  >
                    <span class="input-group-text" slot="prepend">{{
                      defectOptions.defectName
                    }}</span>
                  </mdb-input>
                </div>
              </b-col>
            </b-row>

            <b-col></b-col>
            <hr />
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
    <!-- islast確認視窗 -->
    <mdb-modal :show="islastconfirm" @close="islastconfirm = false" size="lg">
      <mdb-modal-header>
        <mdb-modal-title>{{ $t('confirm_title') }}</mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body>
        <div>
          <b-tabs
            active-nav-item-class="font-weight-bold text-uppercase "
            active-tab-class="font-weight-bold"
          >
            <b-tab
              :title="this.$t('quality')"
              :active="confirmtype"
              @click="changeconfirmdata(true)"
            ></b-tab>
            <b-tab
              :title="this.$t('storage')"
              :active="!confirmtype"
              @click="changeconfirmdata(false)"
            ></b-tab>
          </b-tabs>
          <b-table
            :busy="isbusy"
            show-empty
            bordered
            :items="confirmtable"
            :fields="confirmfields"
            :sort-by.sync="sortBy"
            sort-desc.sync="asc"
            :sort-direction="sortDirection"
          >
            <template v-slot:cell(defectNumber)="row">
              {{ dealThousands('-', row.item.defectNumber) }}
              <mdb-btn style="width: 0px;padding: 0.4rem 0px;" icon="trash-alt"></mdb-btn>
              <!-- 固定欄高 -->
            </template>
          </b-table>
        </div>
      </mdb-modal-body>
      <mdb-modal-footer>
        <mdb-btn color="info" v-on:click="newsubmitfunc()" @click.native="islastconfirm = false">{{
          $t('confirm')
        }}</mdb-btn>
        <mdb-btn color="0000" @click.native="islastconfirm = false">{{ $t('cancel') }}</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
  </b-container>
</template>

<script>
// import { ModelSelect } from 'vue-search-select'
import naturalCompare from 'string-natural-compare'

import {
  ProductInspectorRecordAPI,
  GetInspectorNumAPI,
  InspectorSearch,
  ProductrecordInfoAPI,
  ProductInspectorRecordallAPI,
  ProductInspectorRecordDeleteMultiAPI
} from '@/plugins/produceapis.js'
import { WorkShopAPI } from '@/plugins/basicapis.js'
import { mapState } from 'vuex'
import { DefectAPI } from '@/plugins/systemapis.js'

export default {
  components: {},
  data() {
    var qualityobject = {
      Id: 0,
      serialNumber: '',
      defect: 0,
      endTime: 0,
      lastUpdateTime: 0,
      manufactureDate: 0,
      productId: 0,
      purchasDate: 0,
      taskId: 0,
      startTime: 0,
      inspecturStatus: [],
      total: 0,
      isLast: false,
      remark: ''
    }
    var timeobject = [
      { text: this.$t('in_one_month'), value: 1 },
      { text: this.$t('in_three_month'), value: 3 },
      { text: this.$t('in_six_month'), value: 6 },
      { text: this.$t('in_twelve_month'), value: 12 },
      { text: this.$t('all'), value: -1 }
    ]
    var qualityobjectnull = JSON.parse(JSON.stringify(qualityobject))
    return {
      page_first: 0, //第一條
      page_last: 0, //最後一筆
      page_total: 0, //總共筆數
      scearchtime: 1, //時間種類範圍
      timeobject,
      scearchworkshop: -1,
      workshopobject: [], //廠區選單
      confirmtype: true, //
      confirmdata: '', //新增islast確認data
      confirmtable: [], //新增islast確認data
      islastconfirm: false, //新增islast確認視窗
      errormes: '', //新增錯誤訊息
      searchtableshow: false, //新增搜尋顯示table
      cardhide: false, //新增製品卡片隱藏
      ManufacturingOrderArray: [], //製令按鈕
      newisLast: false, //新增不再品檢
      newsubmitbtm: true, //新增送出
      newobject: [], //新增Array
      newinputsearch: '', //新增搜尋
      editobject: {}, //編輯物件
      isLast: false, //不再品檢
      ManufacturingOrderButtonFalg: true, //新增製令按鈕
      ManufacturingOrderoption: [], //製令選單
      ManufacturingOrderobject: [], //排程下製品
      isbusy: true,
      newbtm: false, //新增
      editbtm: false, //編輯
      deletebtm: false, //刪除
      customize1: false, //自定義一
      customize2: false, //自定義二
      customize3: false, //自定義三
      no_task_select: false, //未選擇任務
      editmode: true,
      optiontaskidArray: '',
      taskobject: [],
      taskoption: [], //未完成品檢之任務
      total: 0,
      selectdefectId: null,
      deletebundisable: true,
      defectOptions: [], //缺陷選單
      defectStruct: [], //缺陷結構
      selected: [],
      qualityobject,
      qualityobjectnull,
      operate: '',
      warning: false,
      modal: false,
      newmodal: false, //新增
      alldata: [], //全部品檢data
      tabledata: [],
      confirmfields: [
        {
          key: 'manufactureOrderNumber',
          label: this.$t('report_manufacture_number'), //'製令編號',
          sortDirection: 'desc',
          class: 'text-center'
        },
        {
          key: 'productNumber',
          label: this.$t('product_number'), //'製品編號',
          sortDirection: 'desc',
          class: 'text-center'
        },
        {
          key: 'normalNumber',
          label: this.$t('normal_number'), //'良品',
          sortDirection: 'desc',
          class: 'text-center',
          formatter: value => {
            return this.dealThousands('-', value)
          }
        },
        {
          key: 'abnormalNumber',
          label: this.$t('abnormal_number'), //'不良品',
          sortDirection: 'desc',
          class: 'text-center',
          formatter: value => {
            return this.dealThousands('-', value)
          }
        },
        {
          key: 'defectNumber',
          label: this.$t('defect_total'), //'缺陷數',
          sortDirection: 'desc',
          class: 'text-center'
        }
      ],
      taskobjectfields: [
        {
          key: 'taskNumber',
          label: this.$t('task_number'), //'任務編號',
          sortDirection: 'desc',
          class: 'text-center'
        },
        {
          key: 'machineNumber',
          label: this.$t('machine_number'), //'設備編號',
          sortDirection: 'desc',
          class: 'text-center'
        },
        {
          key: 'moldNumber',
          label: this.$t('mold_number'), //'模具編號',
          sortDirection: 'desc',
          class: 'text-center'
        },
        {
          key: 'materialName',
          label: this.$t('material_name'), //'原料',
          sortDirection: 'desc',
          class: 'text-center'
        },
        {
          key: 'taskStartTime',
          label: this.$t('task_start_time'), //'開始時間',
          sortDirection: 'desc',
          class: 'text-center',
          formatter: value => {
            if (value == 0) {
              return '-'
            }
            return this.timeStampToStringFunc(value, 'yyyy-mm-dd hh:mm')
          }
        },
        {
          key: 'taskEndTime',
          label: this.$t('task_end_time'), //'結束時間',
          sortDirection: 'desc',
          class: 'text-center',
          formatter: value => {
            if (value == 0) {
              return '-'
            }
            return this.timeStampToStringFunc(value, 'yyyy-mm-dd hh:mm')
          }
        },
        { key: 'actions', label: this.$t('operating'), class: 'text-center' }
      ],
      fields: [
        // {
        //   key: "numberserial",
        //   label: "序號",
        //   class: "moldnumberclass"
        // },
        {
          key: 'serialNumber',
          label: this.$t('quality_number'), //'品檢編號',
          sortable: true,
          sortDirection: 'desc',
          class: 'text-center',
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'customizeNumbers',
          label: this.$t('manufacturingorder_customize_number'), //自定義製令編號
          class: 'text-center',
          sortable: true,
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'taskNumber',
          label: this.$t('task_number'), //'任務編號',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'taskStartTime',
          label: this.$t('task_start_time'), //'任務開始時間',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            if (value == 0) {
              return '-'
            }
            return this.timeStampToStringFunc(value, 'yyyy-mm-dd hh:mm')
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'taskEndTime',
          label: this.$t('task_end_time'), //'任務結束時間',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            if (value == 0) {
              return '-'
            }
            return this.timeStampToStringFunc(value, 'yyyy-mm-dd hh:mm')
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'moldNumber',
          label: this.$t('mold'), //'模具',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },

        {
          key: 'expectedCount',
          label: this.$t('plan_number'), //'計畫生產數量',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return this.dealThousands('-', value)
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },

        {
          key: 'actualCount',
          label: this.$t('actual_count'), //'實際生產數量',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return this.dealThousands('-', value)
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'normalNumber',
          label: this.$t('normal_number'), //'良品總數',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return this.dealThousands('-', value)
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'abnormalNumber',
          label: this.$t('abnormal_number'), //'不良品總數',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return this.dealThousands('-', value)
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'degecttotal',
          label: this.$t('defect_total'), //'缺陷總數',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return this.dealThousands('-', value)
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
      totalRows: 0,
      currentPage: 1,
      perPage: 100,
      pageOptions: [20, 50, 100],
      sortBy: '',
      sortDesc: false,
      sortDirection: 'asc',
      filter: null,
      filterOn: [
        'manufactureOrderNumbers',
        'serialNumber',
        'moldNumber',
        'remark',
        'taskNumber',
        'customizeNumbers',
        'productRecordNumber'
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
  mounted() {
    // Set the initial number of items
    // this.totalRows = this.items.length;
  },
  watch: {
    'qualityobject.taskId': function(value) {
      if (value != 0) {
      }
    },
    currentPage: function() {
      this.setfooternum() //設定頁數
    },
    perPage: function() {
      this.setfooternum() //設定頁數
    }
  },
  created() {
    this.getalldefect() //取得所有缺陷
    this.iniright()
    this.getdata()
    this.getworkshop()
  },
  methods: {
    //設定權限
    iniright() {
      this.authority.forEach(item => {
        if (item.name == 'produce_quality') {
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
    cardhidefunc() {
      this.cardhide = !this.cardhide
    },
    //點選反白
    focus(event) {
      event.currentTarget.select()
    },
    //顯示下拉
    showDetails(row) {
      console.log(row)
      console.log(row)
      console.log(row)

      if (this.taskobject != null) {
        var tempindex = 0
        this.taskobject.forEach((item, index) => {
          if (item.taskId == row.taskId) {
            tempindex = index
          }
          this.taskobject[index]._showDetails = false //全部下拉隱藏
        })
        this.taskobject[tempindex]._showDetails = true //所選擇下拉顯示
        this.newobject = []
        this.newsubmitbtm = true
      }
      // row._showDetails = true
    },
    //取得品檢編號
    getstoragenumber(data) {
      // var count = 0
      var access_token_val = this.$cookies.get('access_token')
      // data.forEach(item => {
      GetInspectorNumAPI({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          if (res.data != null) {
            data.serialNumber = res.data.number
            this.newobject.push(data) //= data
            // count++
            // if (data.length == count) {
            //   this.ManufacturingOrderArray = data
            // }
          }
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
      // })
    },
    //modal背景點擊不關閉
    closemodal(value) {
      if (value == undefined) {
        this.modal = false
        this.newmodal = false
      }
    },

    //取得所有缺陷
    getalldefect() {
      var access_token_val = this.$cookies.get('access_token')
      DefectAPI.get({
        headers: {
          access_token: access_token_val,
          type: '[1]' //品檢
        }
      }).then(
        res => {
          if (res.data != null) {
            res.data.forEach(item => {
              this.defectStruct.push({
                defectId: item.id, //缺陷id
                defectName: item.name, //缺陷名稱
                number: 0, //缺陷數量
                recordId: 0, //品檢id
                isDelete: item.isDelete
              })
            })
          }
        },
        error => {
          console.log(error)
        }
      )
    },
    //統計缺陷總數
    defectchange() {
      var temptotal = 0
      if (this.qualityobject.defect.length != 0) {
        this.qualityobject.defect.forEach(item => {
          temptotal += parseInt(item.number)
        })
      }
      this.qualityobject.total = temptotal
    },

    //製品顯示卡片
    selectManufacturingOrderObject(data) {
      this.ManufacturingOrderArray.forEach(item => {
        if (item.manufactureOrderId == data.manufactureOrderId) {
          if (item.color == 'indigo') {
            //已選擇
            item.color = 'light-blue'
            if (this.newobject != null) {
              var tempindex = 0
              this.newobject.forEach((item1, index) => {
                if (item1.manufactureOrderId == data.manufactureOrderId) {
                  tempindex = index
                }
              })
              // this.newobject.push(data)
              this.newobject.splice(tempindex, 1)
            }
          } else {
            //未選擇
            item.color = 'indigo'
            this.getstoragenumber(data)
            // this.newobject.push(data) //= data
          }
        }
      })
      this.newsubmitbtm = false
    },
    // //選擇任務顯示製品
    // setroductcard(data) {
    //   this.newsubmitbtm = false
    //   //變更按鈕顏色
    //   this.taskobject.forEach(item => {
    //     if (item.taskId == data.taskId) {
    //       item.color = 'indigo'
    //     } else {
    //       item.color = 'light-blue'
    //     }
    //   })
    //   this.newobject = []
    //   var tempnewobject = []

    //   data.productInfo.forEach(item => {
    //     tempnewobject.push({
    //       productName: item.name, //製品名稱
    //       productNumber: item.number, //製品編號
    //       normalNumber: 0, //良品數
    //       abnormalNumber: 0, //不良品數
    //       serialNumber: '', //品檢編號
    //       manufactureOrderId: item.id, //製品id
    //       manufactureOrderNumber: item.manufactureOrderNumber, //製令單號
    //       manufactureOrderCusomizeNumber: item.manufactureOrderCusomizeNumber, //自定義製令
    //       taskId: data.taskId, //任務id
    //       remark: '', //備註
    //       color: 'light-blue',
    //       defect: JSON.parse(JSON.stringify(this.defectStruct))
    //     })
    //   })
    //   this.getstoragenumber(tempnewobject) //取得品檢編號
    // },

    //處理新增缺陷
    dealnewdefect(data) {
      var temparray = []
      if (data.length != 0) {
        data.forEach(item => {
          if (!item.isDelete) {
            temparray.push(item)
          }
        })
        return temparray
      } else {
        return []
      }
    },
    //新增搜尋
    searchbtm() {
      var tempdefectobject = this.dealnewdefect(this.defectStruct)
      var access_token_val = this.$cookies.get('access_token')
      InspectorSearch({
        headers: {
          access_token: access_token_val,
          moldNumber: this.newinputsearch,
          machineNumber: this.newinputsearch,
          productNumber: this.newinputsearch
        }
      }).then(
        res => {
          if (res.data != null) {
            var tempnewobject = []
            res.data.forEach(item => {
              item._showDetails = false
              item.color = 'light-blue'
              item.tempnewobject1 = []
              //預設顏色
              if (item.productInfo != null) {
                if (item.productInfo.length != 0) {
                  // item.productInfo.forEach(productInfoitem => {
                  //   productInfoitem.color = 'light-blue'
                  // })
                  /************ */
                  item.productInfo.forEach(productInfoitem => {
                    var tempobject = {
                      productName: productInfoitem.name, //製品名稱
                      productNumber: productInfoitem.number, //製品編號
                      normalNumber: 0, //良品數
                      abnormalNumber: 0, //不良品數
                      serialNumber: '', //品檢編號
                      manufactureOrderId: productInfoitem.id, //製品id
                      manufactureOrderNumber: productInfoitem.manufactureOrderNumber, //製令單號
                      manufactureOrderCusomizeNumber:
                        productInfoitem.manufactureOrderCusomizeNumber, //自定義製令
                      materialName: productInfoitem.materialName, //原料
                      taskId: item.taskId, //任務id
                      remark: '', //備註
                      color: 'light-blue',
                      defect: JSON.parse(JSON.stringify(tempdefectobject))
                    }
                    tempnewobject.push(tempobject)
                    item.tempnewobject1.push(tempobject)
                  })
                  this.ManufacturingOrderArray = tempnewobject
                  // this.getstoragenumber(tempnewobject) //取得品檢編號
                  // console.log(tempnewobject)
                  /************ */
                }
              }
            })
          } else {
            //搜尋無資料
            this.newsubmitbtm = true
            this.newobject = []
          }
          this.searchtableshow = true //顯示table
          this.taskobject = res.data
          ////只有一個任務，直接顯示
          // if (res.data.length == 1) {
          //   this.setroductcard(this.taskobject[0])
          // }
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //初始化編輯
    iniedit(data) {
      var tempdefect = data.defect
      this.qualityobject = JSON.parse(JSON.stringify(data))
      var tempdefectarray = JSON.parse(JSON.stringify(this.defectStruct))
      var temptotal = 0
      //設定缺陷各個數量
      tempdefectarray.forEach(item => {
        item.recordId = data.id
        if (tempdefect != null) {
          for (var i = 0; i < tempdefect.length; i++) {
            if (item.defectId == tempdefect[i].defectId) {
              temptotal += tempdefect[i].number
              item.number = tempdefect[i].number
              break
            }
          }
        }
      })
      var tempdefectarray1 = []
      if (tempdefectarray.length != 0) {
        tempdefectarray.forEach(item => {
          if (item.isDelete && item.number == 0) {
          } else {
            tempdefectarray1.push(item)
          }
        })

        this.qualityobject.defect = tempdefectarray1
      } else {
        this.qualityobject.defect = []
      }
      this.qualityobject.total = temptotal
      this.qualityobject.isLast = data.inspectorStatus //不再品檢
      this.modal = true
    },
    //品檢getall
    getdata() {
      this.isbusy = true
      var access_token_val = this.$cookies.get('access_token')
      ProductInspectorRecordallAPI.get({
        headers: {
          workShopId: this.scearchworkshop,
          timeRange: this.scearchtime,
          access_token: access_token_val
        }
      }).then(
        res => {
          this.alldata = []
          let temparray = []
          if (res.data != null) {
            res.data.forEach(item => {
              var temptotal = 0
              if (item.defect != null) {
                for (var i = 0; i < item.defect.length; i++) {
                  temptotal += item.defect[i].number
                }
              }
              item.degecttotal = temptotal
              item.lastUpdateTime = this.timeStampToStringFunc(item.lastUpdateTime, 'yyyy-mm-dd')
              temparray.push(item)
            })
            if (temparray.length != 0) {
              temparray.sort((a, b) => naturalCompare(a.serialNumber, b.serialNumber))
            }
            this.alldata = temparray
            this.tabledata = temparray
            this.totalRows = temparray.length
          } else {
            this.tabledata = []
            this.totalRows = 0
          }
          this.setfooternum()
          this.isbusy = false
        },
        error => {
          this.totalRows = 0
          this.setfooternum()
          console.log(error.response)
          this.isbusy = false
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

    //品檢
    getdata2(mode, id) {
      var tempid = ''
      if (mode == 'edit') {
        tempid = id
      } else {
        tempid = ''
      }
      var access_token_val = this.$cookies.get('access_token')
      ProductInspectorRecordAPI.get({
        headers: {
          access_token: access_token_val,
          id: tempid
        }
      }).then(
        res => {
          this.alldata = []
          let temparray = []
          if (res.data != null) {
            //編輯
            if (mode == 'edit') {
              this.iniedit(res.data) //初始化編輯
              //getALL
            } else {
              res.data.forEach(item => {
                var temptotal = 0
                if (item.defect != null) {
                  for (var i = 0; i < item.defect.length; i++) {
                    temptotal += item.defect[i].number
                  }
                }
                item.degecttotal = temptotal
                item.lastUpdateTime = this.timeStampToStringFunc(item.lastUpdateTime, 'yyyy-mm-dd')
                temparray.push(item)
              })
              if (temparray.length != 0) {
                temparray.sort((a, b) => naturalCompare(a.serialNumber, b.serialNumber))
              }
              this.alldata = temparray
              this.tabledata = temparray
              this.totalRows = temparray.length
            }
          } else {
            this.tabledata = []
            this.totalRows = 0
          }
          this.isbusy = false
        },
        error => {
          console.log(error.response)
          this.isbusy = false
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
    storagewindow(item, index, mode) {
      this.errormes = '' //清空錯誤訊息
      this.ManufacturingOrderArray = []
      this.no_task_select = false
      if (mode == 'edit') {
        this.operate = this.$t('edit')
        this.editmode = true
      } else if (mode == 'new') {
        this.operate = this.$t('new')
        this.editmode = false
      }

      if (mode == 'edit') {
        this.editwindow(item)
      } else {
        this.total = 0
        this.newwindow()
      }
    },
    //編輯
    editwindow(item) {
      this.getdata2('edit', item.id) //get by id
    },
    //新增品檢
    newwindow() {
      this.searchtableshow = false //顯示table
      this.taskobject = []
      this.newobject = []
      this.newisLast = false
      this.newsubmitbtm = true
      this.newmodal = true //新增視窗
    },
    checkifzero(value) {
      if (value === 0) {
        // return "";
        if (value === 0) {
          return '-'
        }
        return value
      } else {
        if (value === 0) {
          return '-'
        }
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
    //處理送出資料
    dealdata(data) {
      data.abnormalNumber = this.checkisnull(data.abnormalNumber)
      data.normalNumber = this.checkisnull(data.normalNumber)
      var tempdefectarray = [] //去除缺陷為0的
      data.defect.forEach(item => {
        if (item.number != 0) {
          item.number = parseInt(item.number, 10)
          tempdefectarray.push(item)
        }
      })
      data.defect = tempdefectarray
      return data
    },
    //新增送出
    newsubmitfunc() {
      this.islastconfirm = false
      var tempsubarray = []
      this.newobject.forEach(item => {
        var temp = this.dealdata(JSON.parse(JSON.stringify(item)))
        // //排除良品、不良品、缺陷皆為零
        // if (temp.abnormalNumber == 0 && temp.normalNumber == 0 && temp.defect.length == 0) {
        //   //do nothing
        // } else {
        tempsubarray.push(temp)
        // }
      })
      var access_token_val = this.$cookies.get('access_token')
      ProductInspectorRecordAPI.post(JSON.stringify(tempsubarray), {
        headers: {
          access_token: access_token_val,
          isLast: this.newisLast
        }
      }).then(
        () => {
          this.$layer.msg(this.$t('scuccess'))
          this.modal = false
          this.newmodal = false
          this.getdata()
        },
        error => {
          this.$layer.msg(this.$t('fail') + error.response.data.response)
          if (error.response.data.response == 'Tasks are still on duty') {
            this.errormes = this.$t('quality_onduty_error')
          } else {
            this.errormes = error.response.data.response
          }

          // this.modal = false
          // this.newmodal = false
        }
      )
    },
    //確認送出
    confirmsubmit() {
      //是最後一筆，call API確認
      if (this.newisLast) {
        this.getislastAPI()
      } else {
        //非最後一筆直接送出
        this.newsubmitfunc()
      }
    },
    //call islastAPI
    getislastAPI() {
      this.confirmdata = ''
      let taskid = this.newobject[0].taskId
      // ProductrecordInfoAPI
      ProductrecordInfoAPI({
        headers: {
          id: taskid
        }
      }).then(
        res => {
          this.confirmtype = true
          this.confirmdata = res.data
          this.changeconfirmdata(true)
          this.islastconfirm = true //顯示視窗
        },
        error => {
          console.log(error)
        }
      )
    },
    //變更tab
    changeconfirmdata(type) {
      this.confirmtable = []
      if (type) {
        //品檢
        this.confirmtable = this.confirmdata.inspectorRecord
      } else {
        // 入庫
        this.confirmtable = this.confirmdata.productRecord
      }
    },
    //送出 call API
    newsubmitapi(data) {
      var access_token_val = this.$cookies.get('access_token')
      ProductInspectorRecordAPI.post(JSON.stringify(data), {
        headers: {
          access_token: access_token_val,
          isLast: this.isLast
        }
      }).then(
        () => {
          // this.getdata();
          this.$layer.msg(this.$t('scuccess'))
          this.modal = false
          this.newmodal = false
          this.isbusy = true
          this.getdata()
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
          // this.newmodal = false
        }
      )
    },
    // 編輯送出
    submitfunc() {
      this.qualityobject = this.dealdata(this.qualityobject) //string to int
      var access_token_val = this.$cookies.get('access_token')
      ProductInspectorRecordAPI.put(JSON.stringify(this.qualityobject), {
        headers: {
          access_token: access_token_val,
          isLast: this.qualityobject.isLast
        }
      }).then(
        () => {
          // this.getdata();
          this.$layer.msg(this.$t('scuccess'))
          this.modal = false
          this.newmodal = false
          this.getdata()
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
          this.modal = false
          this.newmodal = false
        }
      )
    },
    // 刪除
    deletemold() {
      var access_token_val = this.$cookies.get('access_token')
      ProductInspectorRecordDeleteMultiAPI.delete({
        headers: {
          access_token: access_token_val,
          ids: this.selectedArrayToString(this.selected)
        }
      }).then(
        () => {
          this.$layer.msg(this.$t('scuccess'))
          this.modal = false
          this.newmodal = false
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
.qualitypctableclass {
  max-height: calc(100vh - 290px) !important;
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
  border: 0px !important;
}
.btn-outline-black {
  border: 0px !important;
}
</style>
<style>
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
