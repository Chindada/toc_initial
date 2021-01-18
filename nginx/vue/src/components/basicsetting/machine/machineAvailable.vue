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
          this.$t('machine_number') +
            '、' +
            this.$t('machine_brand') +
            '、' +
            this.$t('machine_model') +
            '、' +
            this.$t('workshop')
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
        deletemode = 1
        deletcheck(1)
      "
      icon="trash-alt"
      style="padding:0.5rem"
    ></mdb-btn>
    <!-- 匯出 -->
    <mdb-btn
      v-if="availbleshow && customize1"
      size="sm"
      color="cyan"
      @click="downExcel()"
      icon="file-export"
      style="padding:0.5rem"
    ></mdb-btn>
    <!-- 下載範例-->

    <!-- <mdb-btn
      size="sm"
      color="indigo"
      @click="downloadsample()"
      icon="file-excel"
      style="padding:0.5rem"
    ></mdb-btn>-->
    <!-- 匯入 -->
    <!-- <input
      id="fileUpload"
      type="file"
      ref="upload"
      accept=".xls,.xlsx"
      class="outputlist_upload"
      hidden
    />
    <mdb-btn
      size="sm"
      color="indigo"
      icon="file-import"
      @click="importfile()"
      style="padding:0.5rem"
      type="file"
    ></mdb-btn>-->

    <!--
    <template>
      <section>
        <input id="fileUpload" type="file" @change="fileonChange" hidden />
        <xlsx-read :file="file">
          <xlsx-json>
            <template #default="{collection}">
              <div>
                {{ collection }}
              </div>
            </template>
          </xlsx-json>
        </xlsx-read>
      </section>
    </template>-->

    <b-table
      class="machinepctableclass"
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
        <!-- <mdb-btn
         v-if="availbleshow"
          color="mdb-color"
          @click.native="detialdisplay()"
          type="button"
          style="padding:0.35rem"
          icon="copy"
        ></mdb-btn>-->

        <!-- 停用 -->
        <mdb-btn
          v-if="(availbleshow || abnormalshow) && customize2"
          color="mdb-color"
          @click="disableitemfunc(row.item, 1)"
          @click.native="disableitem = true"
          type="button"
          style="padding:0.1rem"
          icon="ban"
        ></mdb-btn>
        <!-- 啟用 -->
        <mdb-btn
          v-if="disableshow && customize2"
          color="mdb-color"
          @click="disableitemfunc(row.item, 0)"
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
            deleteitem = row.item
            deletemode = 0
            deletcheck(0, row.item)
          "
          type="button"
          style="padding:0.1rem"
          icon="trash-alt"
        ></mdb-btn>

        <mdb-btn
          style="width: 0px;padding: 0.1rem 0px;margin-right:0px;margin-left:0px"
          icon="trash-alt"
        ></mdb-btn>
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
    <mdb-modal size="lg" :show="importfilemodal" @close="importfilemodal = false">
      <form v-on:submit.prevent="submitimportfunc">
        <mdb-modal-header>
          <mdb-modal-title> {{ $t('new') }} {{ $t('machine') }}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          {{ importtabledata }}
          <!-- <b-table
            responsive
            show-empty
            bordered
            :hover="true"
            :items="importtabledata"
            :fields="importfields"
            @filtered="onFiltered"
          >
           
            <template v-slot:row-details="row">
              <b-card>
                <ul>
                  <li v-for="(value, key) in row.item" :key="key">
                    {{ key }}: {{ value }}
                  </li>
                </ul>
              </b-card>
            </template>
          </b-table>-->
        </mdb-modal-body>
        <mdb-modal-footer>
          <mdb-btn color="info" type="submit">{{ $t('submit') }}</mdb-btn>
          <mdb-btn color="0000" @click.native="importfilemodal = false" type="button">
            {{ $t('close') }}
          </mdb-btn>
        </mdb-modal-footer>
      </form>
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
    <mdb-modal centered :show="warning" @close="warning = false">
      <mdb-modal-header>
        <mdb-modal-title>{{ $t('warrning_title') }}</mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body>{{ deletemes }}</mdb-modal-body>
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
          <mdb-modal-title>{{ operate }} {{ $t('machine') }}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <div>
            <b-row>
              <b-col>
                <!-- 編輯disabled -->
                <div v-if="machineobject.id != 0">
                  <mdb-input
                    :show="modal"
                    class="mb-3"
                    v-model="machineobject.machineNumber"
                    required
                    disabled
                  >
                    <span class="input-group-text" slot="prepend">
                      <span class="requileclass">*</span>
                      {{ $t('machine_number') }}
                    </span>
                  </mdb-input>
                </div>
                <!-- 新增 -->
                <div v-if="machineobject.id == 0">
                  <mdb-input
                    :show="modal"
                    class="mb-3"
                    v-model="machineobject.machineNumber"
                    required
                  >
                    <span class="input-group-text" slot="prepend">
                      <span class="requileclass">*</span>
                      {{ $t('machine_number') }}
                    </span>
                  </mdb-input>
                </div>
              </b-col>
              <b-col>
                <mdb-input class="mb-3" v-model="machineobject.model" required>
                  <span class="input-group-text" slot="prepend">
                    <span class="requileclass">*</span>
                    {{ $t('machine_model') }}
                  </span>
                </mdb-input>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <mdb-input
                  class="mb-3"
                  v-model="machineobject.theoreticalInjectionVolume"
                  type="number"
                >
                  <span class="input-group-text" slot="prepend">
                    {{ $t('machine_theoretical_injection_volume') }}
                  </span>
                </mdb-input>
              </b-col>
              <b-col>
                <mdb-input class="mb-3" v-model="machineobject.brand">
                  <span class="input-group-text" slot="prepend">{{ $t('machine_brand') }}</span>
                </mdb-input>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <mdb-input class="mb-3" v-model="machineobject.clampingPower" type="number">
                  <span class="input-group-text" slot="prepend">
                    {{ $t('machine_clamping_power') }}
                  </span>
                </mdb-input>
              </b-col>

              <b-col>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <label class="input-group-text" for="inputGroupSelect01">
                      <span class="requileclass">*</span>
                      {{ $t('workshop_machine') }}
                    </label>
                  </div>
                  <b-form-select
                    :required="true"
                    v-model="selectworkshopid"
                    :options="workshopOptions"
                  ></b-form-select>
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <div class="input-group">
                  <div class="input-group-prepend">
                    <label class="input-group-text" for="inputGroupSelect01">
                      {{ $t('machine_material_type') }}
                    </label>
                  </div>
                  <b-form-select
                    required
                    v-model="machineobject.materialType"
                    :options="meterialtypeoption"
                  ></b-form-select>
                </div>
              </b-col>
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
                  <mdb-input class="mb-3" v-model="machineobject.machineName">
                    <span class="input-group-text" slot="prepend">{{ $t('machine_name') }}</span>
                  </mdb-input>
                </b-col>
                <b-col>
                  <!-- <mdb-input class="mb-3" v-model="machineobject.machinePower">
                    <span class="input-group-text" slot="prepend">
                      電源功率(kw)
                    </span>
                  </mdb-input>-->
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <mdb-input
                    class="mb-3"
                    v-model="machineobject.height"
                    @focus="focus($event)"
                    type="number"
                    :min="0"
                    :step="0.1"
                  >
                    <span class="input-group-text" slot="prepend">{{ $t('machine_height') }}</span>
                  </mdb-input>
                </b-col>
                <b-col>
                  <mdb-input
                    class="mb-3"
                    v-model="machineobject.width"
                    @focus="focus($event)"
                    type="number"
                    :min="0"
                    :step="0.1"
                  >
                    <span class="input-group-text" slot="prepend">{{ $t('machine_width') }}</span>
                  </mdb-input>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <div class="input-group" style="margin-bottom: 1rem">
                    <div class="input-group-prepend">
                      <label class="input-group-text" for="inputGroupSelect01">{{
                        $t('machine_manufacture_date')
                      }}</label>
                    </div>
                    <input
                      type="date"
                      class="form-control"
                      v-model="machineobject.manufactureDate"
                      :max="manufactureDateMax"
                      @change="manufactureDatechange"
                    />
                  </div>
                </b-col>
                <b-col>
                  <div class="input-group" style="margin-bottom: 1rem">
                    <div class="input-group-prepend">
                      <label class="input-group-text" for="inputGroupSelect01">{{
                        $t('machine_purchas_date')
                      }}</label>
                    </div>
                    <input
                      type="date"
                      class="form-control"
                      :max="manufactureDateMax"
                      :min="purchasDateMix"
                      v-model="machineobject.purchasDate"
                    />
                  </div>
                </b-col>
              </b-row>

              <b-row>
                <b-col>
                  <mdb-input
                    class="mb-3"
                    v-model="machineobject.maxInjectionPressure"
                    type="number"
                  >
                    <span class="input-group-text" slot="prepend">
                      {{ $t('machine_max_injection_pressure') }}
                    </span>
                  </mdb-input>
                </b-col>
                <b-col>
                  <mdb-input class="mb-3" v-model="machineobject.injectionSpeed" type="number">
                    <span class="input-group-text" slot="prepend">
                      {{ $t('machine_injection_speed') }}
                    </span>
                  </mdb-input>
                </b-col>
              </b-row>
              <b-row>
                <b-col>
                  <mdb-input class="mb-3" v-model="machineobject.maxOpenStroke" type="number">
                    <span class="input-group-text" slot="prepend">
                      {{ $t('machine_max_open_stroke') }}
                    </span>
                  </mdb-input>
                </b-col>
                <b-col>
                  <mdb-input class="mb-3" v-model="machineobject.nozzleClosedPower" type="number">
                    <span class="input-group-text" slot="prepend">
                      {{ $t('machine_nozzle_closed_power') }}
                    </span>
                  </mdb-input>
                </b-col>
              </b-row>

              <b-row>
                <b-col>
                  <mdb-input class="mb-3" v-model="machineobject.maxMoldThickness" type="number">
                    <span class="input-group-text" slot="prepend">
                      {{ $t('machine_max_mold_thickness') }}
                    </span>
                  </mdb-input>
                </b-col>
                <b-col>
                  <mdb-input class="mb-3" v-model="machineobject.minMoldThickness" type="number">
                    <span class="input-group-text" slot="prepend">
                      {{ $t('machine_min_mold_thickness') }}
                    </span>
                  </mdb-input>
                </b-col>
              </b-row>

              <b-row>
                <b-col>
                  <mdb-input class="mb-3" v-model="machineobject.screwDiameter" type="number">
                    <span class="input-group-text" slot="prepend">
                      {{ $t('machine_screw_diameter') }}
                    </span>
                  </mdb-input>
                </b-col>
                <b-col>
                  <mdb-input class="mb-3" v-model="machineobject.screwRatio" type="number">
                    <span class="input-group-text" slot="prepend">
                      {{ $t('machine_screw_ratio') }}
                    </span>
                  </mdb-input>
                </b-col>
              </b-row>

              <b-row>
                <b-col>
                  <mdb-input class="mb-3" v-model="machineobject.shootingStroke" type="number">
                    <span class="input-group-text" slot="prepend">
                      {{ $t('machine_shooting_stroke') }}
                    </span>
                  </mdb-input>
                </b-col>
                <b-col>
                  <mdb-input class="mb-3" v-model="machineobject.shotStroke" type="number">
                    <span class="input-group-text" slot="prepend">
                      {{ $t('machine_shot_stroke') }}
                    </span>
                  </mdb-input>
                </b-col>
              </b-row>

              <b-row>
                <b-col>
                  <mdb-input
                    class="mb-3"
                    v-model="machineobject.heatingSegmentNumber"
                    type="number"
                  >
                    <span class="input-group-text" slot="prepend">
                      {{ $t('machine_heating_segment_number') }}
                    </span>
                  </mdb-input>
                </b-col>
                <b-col>
                  <mdb-input class="mb-3" v-model="machineobject.tubeTotalHeat" type="number">
                    <span class="input-group-text" slot="prepend">
                      {{ $t('machine_tube_total_heat') }}
                    </span>
                  </mdb-input>
                </b-col>
              </b-row>
            </div>
          </div>
        </mdb-modal-body>
        <mdb-modal-footer>
          <div style="color:red">{{ errormes }}</div>
          <h2 style="opacity:0">---------------</h2>
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
import XLSX from 'xlsx'
import { MachineAPI, WorkShopAPI, MachineDeleteMultiAPI } from '@/plugins/basicapis.js'
import naturalCompare from 'string-natural-compare'
import { mapState } from 'vuex'
export default {
  props: ['machineData', 'tabs'],
  watch: {
    tabs: function(value) {
      this.isbusy = true
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
    machineData: function(newVal) {
      this.isbusy = true
      var temparray = JSON.parse(JSON.stringify(newVal))
      if (temparray != null) {
        temparray.sort((a, b) => naturalCompare(a.machineNumber, b.machineNumber))
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
    var materialType = [
      '-',
      this.$t('machine_material_type_general'), //一般
      this.$t('machine_material_type_transparent'), //透明
      this.$t('machine_material_type_black'), //黑色
      this.$t('machine_material_type_white'), //白色
      this.$t('machine_material_type_fiber'), //加纖
      'PVC',
      'LSR',
      this.$t('machine_material_type_other') //其他
    ]
    var machineobject = {
      id: 0,
      machineName: '',
      machineNumber: '',
      brand: '',
      model: '',
      manufactureDate: '',
      purchasDate: '',
      lastUpdateTime: '',
      Analyze: true,
      dcId: 0,
      workShopId: 0,
      injectionSpeed: null,
      maxInjectionPressure: null,
      maxOpenStroke: null,
      maxMoldThickness: null,
      minMoldThickness: null,
      nozzleClosedPower: null,
      screwDiameter: null,
      screwRatio: null,
      shootingStroke: null,
      shotStroke: null,
      theoreticalInjectionVolume: null,
      tubeTotalHeat: null,
      clampingPower: null,
      heatingSegmentNumber: null,
      machinePower: null,
      materialType: 1,
      height: 0,
      width: 0
    }
    var machineobjectnull = JSON.parse(JSON.stringify(machineobject))
    return {
      page_first: 0, //第一條
      page_last: 0, //最後一筆
      page_total: 0, //總共筆數
      isbusy: true,
      deletemes: '', //刪除確認訊息
      manufactureDateMax: '', //製造日期Max
      purchasDateMix: '1970-01-01', //購買日期min
      errormes: '', //錯誤訊息
      newbtm: false, //新增
      editbtm: false, //編輯
      deletebtm: false, //刪除
      customize1: false, //自定義一
      customize2: false, //自定義二
      customize3: false, //自定義三
      disabletype: this.$t('disable'), //停用/啟用
      availbleshow: false, //一般顯示
      abnormalshow: false, //待維護顯示
      disableshow: false, //停用顯示
      tabvalue: '', //模式
      materialType, //綁定原料array
      uploadjson: [],
      importtabledata: [],
      outputs: [],
      collection: [],
      excelData: [],
      file: null,
      disableitem: false,
      deleteitem: 0,
      deletemode: 0,
      editbtnicon: 'chevron-down',
      meterialtypeoption: [
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
      selectworkshopid: null,
      deletebundisable: true,
      workshopOptions: [],
      selected: [],
      machineobject,
      machineobjectnull,
      operate: '',
      importfilemodal: false,
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
          key: 'machineNumber',
          label: this.$t('machine_number'), //'設備編號',
          sortDirection: 'desc',
          sortable: true,
          class: 'text-center',
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'brand',
          label: this.$t('machine_brand'), //'設備品牌',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            if (value === 0) {
              return '-'
            }
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'model',
          label: this.$t('machine_model'), //'設備型號',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            if (value === 0) {
              return '-'
            }
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'materialType',
          label: this.$t('machine_material_type'), //'綁定原料',
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
          key: 'workShopName',
          label: this.$t('workshop'), //'廠區',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            if (value == '') {
              value = this.$t('workshop_machine_notset')
            }
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'lastUpdateTime',
          label: this.$t('machine_last_update_time'), //'最後更新時間',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            if (value === 0) {
              return '-'
            }
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'dcId',
          label: this.$t('machine_set_dc'), //'綁定裝置',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            if (value != 0) {
              return this.$t('machine_dc_isset')
            } else {
              return '-'
            }
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'actions',
          label: this.$t('operating'),
          class: 'text-center',
          thStyle: 'width: 160px;',
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
      filterOn: ['machineNumber', 'brand', 'model', 'workShopName'],
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
    // this.$refs.upload.addEventListener('change', e => {
    //   //綁定監聽表格導入事件
    //   this.readExcel(e)
    // })
  },
  created() {
    this.iniright()
  },
  methods: {
    //點選反白
    focus(event) {
      event.currentTarget.select()
    },
    //設定權限
    iniright() {
      this.authority.forEach(item => {
        if (item.name == 'basicsetting_machine') {
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
    classification(alldata, mode) {
      var temparray = []
      var tempobj
      // alldata.forEach(item => {
      //   item.materialType = this.materialType[item.materialType]
      // })
      this.excelData = []
      switch (mode) {
        case 1:
          this.deletebtm = false
          this.availbleshow = true //一般顯示
          this.abnormalshow = false //待維護顯示
          this.disableshow = false //停用顯示
          if (alldata != null) {
            alldata.forEach(item => {
              tempobj = JSON.parse(JSON.stringify(item))
              tempobj.materialType = this.materialType[tempobj.materialType]
              this.excelData.push(tempobj)
              if (item.workShopName != '' && item.materialType != 0) {
                if (item.status != 1) {
                  temparray.push(item)
                }
              }
            })
          }

          break
        case 2:
          this.deletebtm = false
          this.availbleshow = false //一般顯示
          this.abnormalshow = true //待維護顯示
          this.disableshow = false //停用顯示
          if (alldata != null) {
            alldata.forEach(item => {
              if (item.workShopName == '' || item.materialType == 0) {
                if (item.status != 1) {
                  temparray.push(item)
                }
              }
            })
          }
          break
        case 3:
          this.deletebtm = true
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

    checkuploaddata(data) {
      // data = data.replace('"噴嘴封閉力":', '"id":')
      data = JSON.parse(
        JSON.stringify(data)
          .split('"噴嘴封閉力":')
          .join('"id":')
      )
      var idList
      for (var i = 0; i < 22; i++) {
        idList = data.map(item => Object.values(item)[i])
        console.log(idList)
      }

      this.importfilemodal = true
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
      link.download = 'IoM_Machine_Template'
      link.style.display = 'none'
      link.href = '/excelfile/IoM_Machine_Template.xls'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    downExcel() {
      const th = [
        '設備編號',
        '設備型號',
        '最大射出量',
        '設備品牌',
        '鎖模力',
        '廠區名稱',
        '綁定原料',
        '設備別名',
        '製造日期',
        '購買日期',
        '最高射出壓力(mpa)',
        '射出速率(mm/s)',
        '最大開模行程(mm)',
        '噴嘴封閉力',
        '最大模厚(mm)',
        '最小模厚(mm)',
        '螺桿直徑(mm)',
        '螺桿長徑比',
        '射座行程(mm)',
        '射出行程(mm)',
        '電熱段數',
        '料管總加熱量(j/s)'
      ]
      const filterVal = [
        'machineNumber',
        'model',
        'theoreticalInjectionVolume',
        'brand',
        'clampingPower',
        'workShopName',
        'materialType',
        'machineName',
        'manufactureDate',
        'purchasDate',
        'maxInjectionPressure',
        'injectionSpeed',
        'maxOpenStroke',
        'nozzleClosedPower',
        'maxMoldThickness',
        'minMoldThickness',
        'screwDiameter',
        'screwRatio',
        'shootingStroke',
        'shotStroke',
        'heatingSegmentNumber',
        'tubeTotalHeat'
      ]
      var tempanme =
        'IoM_Machine_Export_' +
        this.timeStampToStringFunc(this.stringToTimestampFunc(new Date()), 'yyyymmdd')

      const data = this.excelData.map(v => filterVal.map(k => v[k]))
      const [fileName, fileType, sheetName] = [tempanme, 'xlsx', this.$t('machine')]
      this.$toExcel({ th, data, fileName, fileType, sheetName })
    },
    fileonChange(event) {
      this.file = event.target.files ? event.target.files[0] : null
      console.log(this.file)
      const types = this.file.name.split('.')[1]
      const fileType = ['xlsx', 'xlc', 'xlm', 'xls', 'xlt', 'xlw', 'csv'].some(
        item => item === types
      )
      if (!fileType) {
        alert('格式错误！请重新选择')
        return
      }
    },
    //製造日期改變
    manufactureDatechange() {
      this.purchasDateMix = this.machineobject.manufactureDate //設定購買日期min
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
    //取得廠區
    workshop(item) {
      this.workshopOptions = [] //清空廠區選項

      var access_token_val = this.$cookies.get('access_token')
      WorkShopAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          this.workshopOptions.push({
            text: this.$t('select_workshop'),
            value: null,
            disabled: true,
            selected: true
          })
          this.moldobjectarray = []
          if (res.data != null) {
            res.data.forEach(item => {
              this.workshopOptions.push({
                text: item.name,
                value: item.id
              })

              var moldobject = {}
              moldobject.id = item.id
              moldobject.name = item.name
              moldobject.number = item.number

              this.moldobjectarray.push(moldobject)
            })
          }

          if (item == undefined) {
            //新增
            this.selectmoldid = null //設定廠區v-mold
          } else {
            //編輯
            this.selectmoldid = item.moldId //設定廠區v-mold
          }
          this.modal = true //視窗加載
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
      this.errormes = ''
      this.manufactureDateMax = this.timeStampToStringFunc(
        this.stringToTimestampFunc(new Date()),
        'yyyy-mm-dd'
      ) //設定製造日期Max

      if (mode == 'edit') {
        this.operate = this.$t('edit')
      } else if (mode == 'new') {
        this.operate = this.$t('new')
      }

      if (mode == 'edit') {
        this.editwindow(item)
        this.workshop(item)
      } else {
        this.newwindow()
        this.workshop()
      }
    },
    //停用1///啟用0
    disableitemfunc(item, mode) {
      if (mode == 0) {
        this.disabletype = this.$t('actvite')
      } else {
        this.disabletype = this.$t('disable')
      }

      this.machineobject = JSON.parse(JSON.stringify(item))
      this.selectworkshopid = item.workShopId
      this.machineobject.status = mode
    },
    //編輯
    editwindow(item) {
      this.machineobject = JSON.parse(JSON.stringify(item))
      this.selectworkshopid = item.workShopId
    },
    //新增
    newwindow() {
      this.selectworkshopid = null
      this.machineobject = JSON.parse(JSON.stringify(this.machineobjectnull))
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
    dealdata() {
      // (this.machineobject.id = this.checkisnull(this.machineobject.id)),
      // this.machineobject.machineName = item.machineName),
      // this.machineobject.machineNumber = item.machineNumber),
      // this.machineobject.brand = item.brand),
      // this.machineobject.model = item.model),

      // this.machineobject.Analyze = item.Analyze),
      var tempflag = false
      this.machineobject.dcId = this.checkisnull(this.machineobject.dcId)
      this.machineobject.workShopId = this.checkisnull(this.machineobject.workShopId)
      this.machineobject.injectionRate = this.checkisnull(this.machineobject.injectionRate)
      this.machineobject.injectionSpeed = this.checkisnull(this.machineobject.injectionSpeed)
      this.machineobject.injectionVolume = this.checkisnull(this.machineobject.injectionVolume)
      this.machineobject.maxInjectionPressure = this.checkisnull(
        this.machineobject.maxInjectionPressure
      )
      this.machineobject.maxOpenStroke = this.checkisnull(this.machineobject.maxOpenStroke)
      this.machineobject.maxMoldThickness = this.checkisnull(this.machineobject.maxMoldThickness)
      this.machineobject.minMoldThickness = this.checkisnull(this.machineobject.minMoldThickness)
      this.machineobject.nozzleClosedPower = this.checkisnull(this.machineobject.nozzleClosedPower)
      this.machineobject.screwDiameter = this.checkisnull(this.machineobject.screwDiameter)
      this.machineobject.screwRatio = this.checkisnull(this.machineobject.screwRatio)
      this.machineobject.shootingStroke = this.checkisnull(this.machineobject.shootingStroke)
      this.machineobject.shotStroke = this.checkisnull(this.machineobject.shotStroke)
      this.machineobject.theoreticalInjectionVolume = this.checkisnull(
        this.machineobject.theoreticalInjectionVolume
      )
      this.machineobject.height = this.checkisnull(this.machineobject.height)
      this.machineobject.width = this.checkisnull(this.machineobject.width)
      this.machineobject.tubeTotalHeat = this.checkisnull(this.machineobject.tubeTotalHeat)
      this.machineobject.clampingPower = this.checkisnull(this.machineobject.clampingPower)
      this.machineobject.heatingSegmentNumber = this.checkisnull(
        this.machineobject.heatingSegmentNumber
      )
      this.machineobject.manufactureDate = this.stringToTimestampFunc(
        this.machineobject.manufactureDate
      )
      this.machineobject.purchasDate = this.stringToTimestampFunc(this.machineobject.purchasDate)
      this.machineobject.lastUpdateTime = this.stringToTimestampFunc(
        this.machineobject.lastUpdateTime
      )
      var timestamp = this.stringToTimestampFunc(new Date()) //現在時間

      if (timestamp < this.machineobject.manufactureDate) {
        this.errormes = this.$t('manufacture_date_error') //'製造日期不得晚於今日'
        tempflag = true
        this.machineobject.manufactureDate = this.timeStampToStringFunc(
          this.machineobject.manufactureDate,
          'yyyy-mm-dd'
        )
        this.machineobject.purchasDate = this.timeStampToStringFunc(
          this.machineobject.purchasDate,
          'yyyy-mm-dd'
        )
      } else if (this.machineobject.manufactureDate > this.machineobject.purchasDate) {
        this.errormes = this.$t('purchas_date_error') // '製造日期不得晚於購買日期'
        tempflag = true
        this.machineobject.manufactureDate = this.timeStampToStringFunc(
          this.machineobject.manufactureDate,
          'yyyy-mm-dd'
        )
        this.machineobject.purchasDate = this.timeStampToStringFunc(
          this.machineobject.purchasDate,
          'yyyy-mm-dd'
        )
      }

      this.machineobject.workShopId = this.checkisnull(this.selectworkshopid)
      return tempflag
    },
    // 送出
    submitfunc() {
      if (!this.dealdata()) {
        var access_token_val = this.$cookies.get('access_token')
        if (this.machineobject.id == '') {
          MachineAPI.post(JSON.stringify(this.machineobject), {
            headers: {
              access_token: access_token_val
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
              if (error.response.data.response == 'Machine number duplicate') {
                this.errormes =
                  this.$t('machine_number') +
                  ' ' +
                  this.machineobject.machineNumber +
                  ' ' +
                  this.$t('existed')
              } else {
                console.log(error.response)
                // this.$layer.msg(this.$t('fail') + error.response.data.response)
                this.modal = false
              }
            }
          )
        } else {
          MachineAPI.put(JSON.stringify(this.machineobject), {
            headers: {
              access_token: access_token_val
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
              // this.$layer.msg(this.$t('fail') + error.response.data.response)
              this.modal = false
              // }
            }
          )
        }
      }
    },
    //刪除檢查
    deletcheck(mode, data) {
      this.deletemes = ''
      this.warning = true
      if (mode == 1) {
        //多筆刪除
        let machinenamearray = ''
        let dcIdflag = true //多筆未綁定
        this.selected.forEach(item => {
          if (item.dcId != 0) {
            dcIdflag = false
            machinenamearray += item.machineNumber + '、'
          }
        })
        machinenamearray = machinenamearray.substring(0, machinenamearray.length - 1)
        if (dcIdflag) {
          //未綁定
          this.deletemes = this.$t('warrning_body')
        } else {
          //已綁定
          this.deletemes = machinenamearray + ' ' + this.$t('machine_delete_mes1')
        }
      } else {
        //單筆刪除
        if (data.dcId != 0) {
          //已綁定
          this.deletemes = data.machineNumber + ' ' + this.$t('machine_delete_mes1')
        } else {
          //未綁定
          this.deletemes = this.$t('warrning_body')
        }
      }
    },
    // 刪除
    deletemold() {
      let deletearray = '['
      if (this.deletemode == 1) {
        deletearray = this.selectedArrayToString(this.selected)
      } else {
        deletearray += this.deleteitem.id + ']'
      }
      var access_token_val = this.$cookies.get('access_token')
      MachineDeleteMultiAPI.delete({
        headers: {
          access_token: access_token_val,
          ids: deletearray
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
.machinepctableclass {
  max-height: calc(100vh - 346px) !important;
}
.machineoperateclass {
  text-align: center;
  width: 160px;
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
table.table th {
  font-size: 1.1rem;
  vertical-align: middle !important;
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
