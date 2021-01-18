<template>
  <div>
    <!-- <div class="mx-3">
      <h2>進行中</h2>     
    </div>-->
    <!-- <div
      style="position: fixed;background:white;width:83%;top:130px; "
    >-->
    <b-row style="padding-top: 0.2rem;width:100%">
      <b-col cols="8">
        <mdb-input
          style="width:80%"
          v-model="filter"
          type="search"
          id="filterInput"
          :placeholder="
            this.$t('task_number') +
              '、' +
              this.$t('manufacturingorder_customize_number') +
              '、' +
              this.$t('schedule_number') +
              '、' +
              this.$t('manufacturingorder_number') +
              '、' +
              this.$t('machine') +
              '、' +
              this.$t('mold') +
              '、' +
              this.$t('remark')
          "
        >
          <span class="input-group-text" slot="prepend">{{ $t('search') }}</span>

          <!-- <mdb-btn size="sm" color="primary" :disabled="!filter" @click="filter = ''">清除</mdb-btn> -->
        </mdb-input>
      </b-col>
      <b-col></b-col>
    </b-row>
    <b-row>
      <b-col>
        <!-- 新增 -->
        <mdb-btn
          v-if="runningflag && newbtm"
          :disabled="newdisabled"
          size="sm"
          color="primary"
          v-on:click="taskwindow([], [], 'new')"
          icon="plus"
          style="padding:0.5rem"
        ></mdb-btn>
        <!--刪除 -->
        <mdb-btn
          v-if="deletebtm"
          size="sm"
          color="danger"
          :disabled="selected ? selected == 0 : false"
          @click.native="deletewarning = true"
          icon="trash-alt"
          style="padding:0.5rem"
        ></mdb-btn>
      </b-col>
      <b-col></b-col>
      <b-col></b-col>
    </b-row>
    <!-- </div>
    <div style="z-index:1000;background:white;height:80px"></div>-->
    <b-table
      class="taskpctableclass"
      style="position:sticky;-webkit-backface-visibility: hidden;-webkit-perspective: 1000;"
      no-border-collapse
      sticky-header="550px"
      id="pc"
      bordered
      :busy="isbusy"
      responsive
      show-empty
      :hover="true"
      selectable
      select-mode="multi"
      @row-selected="onRowSelected"
      :items="tabledata"
      :fields="fieldstitle"
      :current-page="currentPage"
      :per-page="perPage"
      :filter="filter"
      :filterIncludedFields="filterOn"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      @filtered="onFiltered"
    >
      <template v-slot:table-busy>
        <div class="text-center my-3">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Loading...</strong>
        </div>
      </template>
      <template v-slot:head(customizeNumbers)="row">
        <div class="text-nowrap" v-if="false">{{ row }}</div>

        <div>
          <mdb-btn
            v-if="manufactureOrderNumbersshowflag"
            size="sm"
            v-on:click="manufactureOrderNumbersshowflagfunc()"
            style="padding:0rem;margin:0px"
            icon="arrow-up"
            color="mdb-color"
          ></mdb-btn>
          <mdb-btn
            v-if="!manufactureOrderNumbersshowflag"
            size="sm"
            v-on:click="manufactureOrderNumbersshowflagfunc()"
            style="padding:0rem;margin:0px"
            icon="arrow-down"
            color="mdb-color"
          ></mdb-btn>
          {{ $t('manufacturingorder_customize_number') }}
        </div>
      </template>
      <template v-slot:cell(customizeNumbers)="row" v-if="manufactureOrderNumbersshowflag">
        <!-- {{ row.item.customizeNumbers }} -->
        <div v-for="(member, index) in row.item.customizeNumbers" :key="index">
          <div v-if="member != ''">{{ member }}</div>
          <div v-if="member == ''">-</div>
        </div>
      </template>
      <template v-slot:cell(numberserial)="row" class="col-sm-3">{{ row.index }}</template>
      <!-- <template v-slot:cell(name)="row">{{ row.value }}</template> -->
      <!-- <template v-slot:cell(checkbox)="row">
        <b-form-checkbox></b-form-checkbox>
      </template>-->
      <!-- 五燈 -->
      <template v-slot:cell(errorflag)="row" class="col-sm-3">
        <!-- 設備 -->
        <mdb-tooltip material trigger="hover" :options="{ placement: 'top' }">
          <span slot="tip">{{ $t('machine') }}</span>
          <mdb-btn
            slot="reference"
            v-if="row.item.iconlight.machine"
            @click="finishallerror(4, row.item)"
            color="danger"
            type="button"
            style="padding:0.1rem;width:35px"
            icon="far fa-fw fa-ambulance"
          ></mdb-btn>
        </mdb-tooltip>
        <mdb-tooltip material trigger="hover" :options="{ placement: 'top' }">
          <span slot="tip">{{ $t('machine') }}</span>
          <mdb-btn
            slot="reference"
            v-if="!row.item.iconlight.machine"
            color="grey"
            type="button"
            style="padding:0.1rem;width:35px"
            icon="far fa-fw fa-ambulance"
          ></mdb-btn>
        </mdb-tooltip>
        <!-- 模具-->
        <mdb-tooltip material trigger="hover" :options="{ placement: 'top' }">
          <span slot="tip">{{ $t('mold') }}</span>
          <mdb-btn
            slot="reference"
            v-if="row.item.iconlight.mold"
            @click="finishallerror(3, row.item)"
            color="danger"
            type="button"
            style="padding:0.1rem;width:35px"
            icon="far fa-fw fa-hospital-symbol"
          ></mdb-btn>
        </mdb-tooltip>
        <mdb-tooltip material trigger="hover" :options="{ placement: 'top' }">
          <span slot="tip">{{ $t('mold') }}</span>
          <mdb-btn
            slot="reference"
            v-if="!row.item.iconlight.mold"
            color="grey"
            type="button"
            style="padding:0.1rem;width:35px"
            icon="far fa-fw fa-hospital-symbol"
          ></mdb-btn>
        </mdb-tooltip>

        <!-- 原料 -->
        <mdb-tooltip material trigger="hover" :options="{ placement: 'top' }">
          <span slot="tip">{{ $t('material') }}</span>
          <mdb-btn
            slot="reference"
            v-if="row.item.iconlight.material"
            @click="finishallerror(5, row.item)"
            color="danger"
            type="button"
            style="padding:0.1rem;width:35px"
            icon="far fa-fw fa-sign-in-alt"
          ></mdb-btn>
        </mdb-tooltip>
        <mdb-tooltip material trigger="hover" :options="{ placement: 'top' }">
          <span slot="tip">{{ $t('material') }}</span>
          <mdb-btn
            slot="reference"
            v-if="!row.item.iconlight.material"
            color="grey"
            type="button"
            style="padding:0.1rem;width:35px"
            icon="far fa-fw fa-sign-in-alt"
          ></mdb-btn>
        </mdb-tooltip>

        <!-- 人員 -->
        <mdb-tooltip material trigger="hover" :options="{ placement: 'top' }">
          <span slot="tip">{{ $t('employee') }}</span>
          <mdb-btn
            slot="reference"
            v-if="row.item.iconlight.employee"
            @click="finishallerror(6, row.item)"
            color="danger"
            type="button"
            style="padding:0.1rem;width:35px"
            icon="far fa-fw fa-user-clock"
          ></mdb-btn>
        </mdb-tooltip>
        <mdb-tooltip material trigger="hover" :options="{ placement: 'top' }">
          <span slot="tip">{{ $t('employee') }}</span>
          <mdb-btn
            slot="reference"
            v-if="!row.item.iconlight.employee"
            color="grey"
            type="button"
            style="padding:0.1rem;width:35px"
            icon="far fa-fw fa-user-clock"
          ></mdb-btn>
        </mdb-tooltip>

        <!-- 其他 -->
        <mdb-tooltip material trigger="hover" :options="{ placement: 'top' }">
          <span slot="tip">{{ $t('machine_material_type_other') }}</span>
          <mdb-btn
            slot="reference"
            v-if="row.item.iconlight.others"
            @click="finishallerror(999, row.item)"
            color="danger"
            type="button"
            style="padding:0.1rem;width:35px"
            icon="bars"
          ></mdb-btn>
        </mdb-tooltip>
        <mdb-tooltip material trigger="hover" :options="{ placement: 'top' }">
          <span slot="tip">{{ $t('machine_material_type_other') }}</span>
          <mdb-btn
            slot="reference"
            v-if="!row.item.iconlight.others"
            color="grey"
            type="button"
            style="padding:0.1rem;width:35px"
            icon="bars"
          ></mdb-btn>
        </mdb-tooltip>
      </template>

      <template v-slot:cell(actions)="row">
        <!-- 任務中編輯 -->
        <mdb-tooltip material trigger="hover" :options="{ placement: 'top' }">
          <span slot="tip">{{ $t('edit') }}</span>
          <mdb-btn
            slot="reference"
            v-if="editbtm && runningflag"
            color="mdb-color"
            @click="taskwindow(row.item, row.index, 'edit')"
            type="button"
            style="padding:0.1rem"
            icon="pencil-alt"
          ></mdb-btn>
        </mdb-tooltip>
        <!-- 已完成編輯 -->
        <mdb-tooltip material trigger="hover" :options="{ placement: 'top' }">
          <span slot="tip">{{ $t('edit') }}</span>
          <mdb-btn
            slot="reference"
            v-if="editbtm && !runningflag"
            color="mdb-color"
            @click="taskwindowfinish(row.item, row.index, 'edit')"
            type="button"
            style="padding:0.1rem"
            icon="pencil-alt"
          ></mdb-btn>
        </mdb-tooltip>
        <!-- 停止 -->
        <mdb-tooltip material trigger="hover" :options="{ placement: 'top' }">
          <span slot="tip">{{ $t('task_end') }}</span>
          <mdb-btn
            slot="reference"
            v-if="runningflag && customize2"
            color="danger"
            @click="taskwindow(row.item, row.index, 'end')"
            type="button"
            style="padding:0.1rem"
            icon="stop"
          ></mdb-btn>
        </mdb-tooltip>
        <!-- 回報 -->
        <mdb-tooltip material trigger="hover" :options="{ placement: 'top' }">
          <span slot="tip">{{ $t('task_error_report') }}</span>
          <mdb-btn
            slot="reference"
            v-if="customize1"
            color="mdb-color"
            @click="errorreportfunc(row.item, row.index)"
            type="button"
            style="padding:0.1rem"
            icon="exclamation-triangle"
          ></mdb-btn>
        </mdb-tooltip>
        <!-- 回報下拉 -->
        <mdb-tooltip
          v-if="!row.detailsShowing"
          material
          trigger="hover"
          :options="{ placement: 'top' }"
        >
          <span slot="tip">{{ $t('task_detail') }}</span>
          <mdb-btn
            slot="reference"
            v-if="!row.detailsShowing"
            color="mdb-color"
            @click="row.toggleDetails(), getdeialdata(row.item, row.index, row)"
            type="button"
            style="padding:0.1rem"
            icon="chevron-down"
          ></mdb-btn>
        </mdb-tooltip>
        <mdb-btn
          v-if="row.detailsShowing"
          color="mdb-color"
          @click="row.toggleDetails"
          type="button"
          style="padding:0.1rem"
          icon="chevron-up"
        ></mdb-btn>

        <mdb-btn
          style="width: 0px;padding: 0.1rem 0px;margin-right:0px;margin-left:0px"
          icon="trash-alt"
        ></mdb-btn>
        <!-- 固定欄高 -->

        <!-- <b-button size="sm" @click="row.toggleDetails">{{ row.detailsShowing ? '隱藏' : '顯示' }} 詳細</b-button> -->
      </template>
      <!--詳細資訊 -->
      <template v-slot:row-details="row">
        <b-table
          show-empty
          bordered
          :hover="true"
          :items="row.item.detial"
          :fields="detialfields"
          :sort-by.sync="sortBy"
          sort-desc.sync="asc"
          :sort-direction="sortDirection"
          label-size="sm"
        >
          <template v-slot:cell(defectType)="row1">
            <!-- {{ defectTypeName(defectType) }} -->
            <b-row>
              <b-col style="padding:0px">
                <!-- 設備 -->
                <div v-if="row1.item.defectType == 3" class="float-right">
                  <mdb-btn
                    disabled
                    color="danger"
                    type="button"
                    style="padding:0.4rem;width:35px"
                    icon="far fa-fw fa-hospital-symbol"
                  ></mdb-btn>
                </div>
                <!-- 模具 -->
                <div v-if="row1.item.defectType == 4" class="float-right">
                  <mdb-btn
                    disabled
                    color="danger"
                    type="button"
                    style="padding:0.4rem;width:35px"
                    icon="far fa-fw fa-ambulance"
                  ></mdb-btn>
                </div>
                <!-- 原料 -->
                <div v-if="row1.item.defectType == 5" class="float-right">
                  <mdb-btn
                    disabled
                    color="danger"
                    type="button"
                    style="padding:0.4rem;width:35px"
                    icon="far fa-fw fa-sign-in-alt"
                  ></mdb-btn>
                </div>
                <!-- 人員 -->
                <div v-if="row1.item.defectType == 6" class="float-right">
                  <mdb-btn
                    disabled
                    color="danger"
                    type="button"
                    style="padding:0.4rem;width:35px"
                    icon="far fa-fw fa-user-clock"
                  ></mdb-btn>
                </div>
                <!-- 其他 -->
                <div v-if="row1.item.defectType == 999" class="float-right">
                  <mdb-btn
                    disabled
                    color="danger"
                    type="button"
                    style="padding:0.4rem;width:35px"
                    icon="bars"
                  ></mdb-btn>
                </div>
              </b-col>
              <b-col style="padding:0px;display: inline-block;" class="text-left">
                <span style="vertical-align: middle;">
                  {{ defectTypeName(row1.item.defectType) }}
                </span>
                <mdb-btn
                  style="width: 0px;padding: 0.4rem 0px;margin-right:0px;margin-left:0px"
                  icon="trash-alt"
                ></mdb-btn>
                <!-- 固定欄高 -->
              </b-col>
            </b-row>
          </template>
          <template v-slot:cell(actions)="row1">
            <!-- 未解除 -->
            <div v-if="!row1.item.isFinish">
              <mdb-btn
                color="danger"
                @click="enderror(row1.item, row.item)"
                type="button"
                style="padding:0.4rem"
                icon="bell-slash"
              ></mdb-btn>
            </div>
            <!-- 已解除 -->
            <div v-if="row1.item.isFinish">
              {{ $t('isfinisherror') }}
              <mdb-btn
                style="width: 0px;padding: 0.4rem 0px;margin-right:0px;margin-left:0px"
                icon="trash-alt"
              ></mdb-btn>
            </div>
          </template>
        </b-table>
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
      <!-- 
      <template v-slot:cell(actions)="row">
        <b-button size="sm" @click="taskwindow(row.item, row.index, 'edit')">結束任務</b-button>
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
    <!-- 新增異常 -->
    <mdb-modal :show="errorreportmodal" @close="closemodal($event)" size="lg">
      <form v-on:submit.prevent="errorreportsubit">
        <mdb-modal-header>
          <mdb-modal-title>{{ operate }} {{ $t('abnormal') }}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <b-row>
            <b-col>
              <mdb-input
                class="mb-3"
                v-model="errortask.number"
                disabled
                style="background-color:#e9ecef;"
              >
                <span class="input-group-text" slot="prepend">{{ $t('task_number') }}</span>
              </mdb-input>
            </b-col>
            <b-col>
              <mdb-input
                class="mb-3"
                v-model="errortask.scheduleSerial"
                disabled
                style="background-color:#e9ecef;"
              >
                <span class="input-group-text" slot="prepend">{{ $t('schedule_number') }}</span>
              </mdb-input>
            </b-col>
            <b-col>
              <mdb-input
                class="mb-3"
                v-model="errortask.machineNumber"
                disabled
                style="background-color:#e9ecef;"
              >
                <span class="input-group-text" slot="prepend">{{ $t('machine_number') }}</span>
              </mdb-input>
            </b-col>
            <b-col>
              <mdb-input
                class="mb-3"
                v-model="errortask.moldNumber"
                disabled
                style="background-color:#e9ecef;"
              >
                <span class="input-group-text" slot="prepend">{{ $t('mold_number') }}</span>
              </mdb-input>
            </b-col>
          </b-row>
          <!-- 設備 -->
          <b-row>
            <b-col>
              <div>
                <div class="input-group" style="margin-bottom: 1rem">
                  <div class="input-group-prepend">
                    <label class="input-group-text" for="inputGroupSelect01">{{
                      $t('machine')
                    }}</label>
                  </div>

                  <el-select
                    required
                    v-model="errorselect.machine.selected"
                    multiple
                    placeholder
                    style="width:80%"
                    v-if="selectshow"
                  >
                    <el-option
                      v-for="item in machineoptions"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
              </div>
            </b-col>
            <b-col>
              <mdb-input class="mb-3" v-model="errorselect.machine.remark">
                <span class="input-group-text" slot="prepend">{{ $t('defect_remark') }}</span>
              </mdb-input>
            </b-col>
          </b-row>
          <!-- 模具 -->
          <b-row>
            <b-col>
              <div>
                <div class="input-group" style="margin-bottom: 1rem">
                  <div class="input-group-prepend">
                    <label class="input-group-text" for="inputGroupSelect01">{{
                      $t('mold')
                    }}</label>
                  </div>

                  <el-select
                    required
                    v-model="errorselect.mold.selected"
                    multiple
                    placeholder
                    style="width:80%"
                    v-if="selectshow"
                  >
                    <el-option
                      v-for="item in moldoptions"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
              </div>
            </b-col>
            <b-col>
              <mdb-input class="mb-3" v-model="errorselect.mold.remark">
                <span class="input-group-text" slot="prepend">{{ $t('defect_remark') }}</span>
              </mdb-input>
            </b-col>
          </b-row>
          <!-- 原料 -->
          <b-row>
            <b-col>
              <div>
                <div class="input-group" style="margin-bottom: 1rem">
                  <div class="input-group-prepend">
                    <label class="input-group-text" for="inputGroupSelect01">{{
                      $t('material')
                    }}</label>
                  </div>

                  <el-select
                    required
                    v-model="errorselect.marerial.selected"
                    multiple
                    placeholder
                    style="width:80%"
                    v-if="selectshow"
                  >
                    <el-option
                      v-for="item in materialoptions"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
              </div>
            </b-col>
            <b-col>
              <mdb-input class="mb-3" v-model="errorselect.marerial.remark">
                <span class="input-group-text" slot="prepend">{{ $t('defect_remark') }}</span>
              </mdb-input>
            </b-col>
          </b-row>
          <!-- 人員 -->
          <b-row>
            <b-col>
              <div>
                <div class="input-group" style="margin-bottom: 1rem">
                  <div class="input-group-prepend">
                    <label class="input-group-text" for="inputGroupSelect01">{{
                      $t('employee')
                    }}</label>
                  </div>

                  <el-select
                    required
                    v-model="errorselect.employee.selected"
                    multiple
                    placeholder
                    style="width:80%"
                    v-if="selectshow"
                  >
                    <el-option
                      v-for="item in employeeoptions"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
              </div>
            </b-col>
            <b-col>
              <mdb-input class="mb-3" v-model="errorselect.employee.remark">
                <span class="input-group-text" slot="prepend">{{ $t('defect_remark') }}</span>
              </mdb-input>
            </b-col>
          </b-row>
          <!-- 其他 -->
          <b-row>
            <b-col>
              <div>
                <div class="input-group" style="margin-bottom: 1rem">
                  <div class="input-group-prepend">
                    <label class="input-group-text" for="inputGroupSelect01">{{
                      $t('machine_material_type_other')
                    }}</label>
                  </div>

                  <el-select
                    required
                    v-model="errorselect.others.selected"
                    multiple
                    placeholder
                    style="width:80%"
                    v-if="selectshow"
                  >
                    <el-option
                      v-for="item in othersoptions"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
              </div>
            </b-col>
            <b-col>
              <mdb-input class="mb-3" v-model="errorselect.others.remark">
                <span class="input-group-text" slot="prepend">{{ $t('defect_remark') }}</span>
              </mdb-input>
            </b-col>
          </b-row>
          <!-- <b-row>
            <b-col>
              {{ errorreportnull }}
            </b-col>
          </b-row>-->
          <!-- 開始時間 -->
          <!-- <mdb-input class="mb-3" v-model="errorreport.startTime" type="datetime-local">
            <span class="input-group-text" slot="prepend">
              <span class="requileclass">*</span>
              {{ $t('task_start_time') }}
            </span>
          </mdb-input>-->
          <!-- ************************* -->
          <div class="input-group" style="margin-bottom: 1rem">
            <div class="input-group-prepend">
              <label class="input-group-text" for="inputGroupSelect01">
                <span class="requileclass">*</span>
                {{ $t('task_start_time') }}
              </label>
            </div>
            <input
              type="datetime-local"
              class="form-control"
              v-model="errorreport.startTime"
              :max="timemax"
              min="2000-01-01T00:00"
              required
            />
          </div>
          <!-- ************************* -->

          <!-- 結束時間 -->
          <!-- <mdb-input class="mb-3" v-model="errorreport.endTime" type="datetime-local">
            <span class="input-group-text" slot="prepend">
              <span class="requileclass">*</span>
              {{ $t('task_end_time') }}
            </span>
          </mdb-input>-->
        </mdb-modal-body>
        <mdb-modal-footer>
          <mdb-btn color="info" type="submit">{{ $t('submit') }}</mdb-btn>
          <mdb-btn color="0000" type="button" @click.native="errorreportmodal = false">
            {{ $t('close') }}
          </mdb-btn>
        </mdb-modal-footer>
      </form>
    </mdb-modal>
    <!-- 設備已存在任務 -->
    <mdb-modal centered :show="machinewarning" @close="machinewarning = false">
      <mdb-modal-header>
        <mdb-modal-title>{{ $t('task_on_machine_title') }}</mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body style="text-align: center;"
        >{{ $t('task_on_machine_body1') }}{{ warning_machine
        }}{{ $t('task_on_machine_body2') }}</mdb-modal-body
      >
      <mdb-modal-footer>
        <mdb-btn color="0000" @click.native="machinewarning = false" type="button">{{
          $t('close')
        }}</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
    <!-- 解除異常 -->
    <mdb-modal centered :show="errorwarning" @close="errorwarning = false">
      <form v-on:submit.prevent="submitrelieveerror">
        <mdb-modal-header>
          <!-- <mdb-modal-title>{{ $t('task_end') }}</mdb-modal-title> -->
          <mdb-modal-title>{{ $t('relieveerror') }}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <b-row>
            <b-col>
              <mdb-input
                class="mb-3"
                v-model="relieveerror.task"
                disabled
                style="background-color:#e9ecef;"
              >
                <span class="input-group-text" slot="prepend">{{ $t('task_number') }}</span>
              </mdb-input>
            </b-col>
            <b-col>
              <mdb-input
                class="mb-3"
                v-model="relieveerror.schedule"
                disabled
                style="background-color:#e9ecef;"
              >
                <span class="input-group-text" slot="prepend">{{ $t('schedule_number') }}</span>
              </mdb-input>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <mdb-input
                class="mb-3"
                v-model="relieveerror.machine"
                disabled
                style="background-color:#e9ecef;"
              >
                <span class="input-group-text" slot="prepend">{{ $t('machine_number') }}</span>
              </mdb-input>
            </b-col>
            <b-col>
              <mdb-input
                class="mb-3"
                v-model="relieveerror.mold"
                disabled
                style="background-color:#e9ecef;"
              >
                <span class="input-group-text" slot="prepend">{{ $t('mold_number') }}</span>
              </mdb-input>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <mdb-input
                class="mb-3"
                v-model="relieveerror.errortype"
                disabled
                style="background-color:#e9ecef;"
              >
                <span class="input-group-text" slot="prepend">{{ $t('errortype') }}</span>
              </mdb-input>
            </b-col>
            <b-col>
              <mdb-input
                class="mb-3"
                v-model="relieveerror.errorName"
                disabled
                style="background-color:#e9ecef;"
              >
                <span class="input-group-text" slot="prepend">{{ $t('errorname') }}</span>
              </mdb-input>
            </b-col>
          </b-row>

          <div class="input-group" style="margin-bottom: 1rem">
            <div class="input-group-prepend">
              <label class="input-group-text" for="inputGroupSelect01">
                <span class="requileclass">*</span>
                {{ $t('task_end_time') }}
              </label>
            </div>
            <input
              type="datetime-local"
              class="form-control"
              v-model="relieveerror.endTime"
              :max="timemax"
              min="2000-01-01T00:00"
              required
            />
          </div>
          <mdb-input class="mb-3" v-model="relieveerror.remark">
            <span class="input-group-text" slot="prepend"> {{ $t('remark') }}</span>
          </mdb-input>
        </mdb-modal-body>
        <mdb-modal-footer>
          <mdb-btn color="info" @click.native="warning = false" type="submit">{{
            $t('submit')
          }}</mdb-btn>
          <mdb-btn color="0000" @click.native="errorwarning = false" type="button">{{
            $t('close')
          }}</mdb-btn>
        </mdb-modal-footer>
      </form>
    </mdb-modal>
    <!-- end解除異常 -->
    <!-- 批量解除異常 -->
    <mdb-modal centered @close="closemodal($event)" :show="allerrorwarning">
      <form v-on:submit.prevent="submitrelieveallerror">
        <mdb-modal-header>
          <mdb-modal-title>{{ $t('relieveallerror') }}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <b-row>
            <b-col>
              <mdb-input
                class="mb-3"
                v-model="relieveallerror.task"
                disabled
                style="background-color:#e9ecef;"
              >
                <span class="input-group-text" slot="prepend">{{ $t('task_number') }}</span>
              </mdb-input>
            </b-col>
            <b-col>
              <mdb-input
                class="mb-3"
                v-model="relieveallerror.schedule"
                disabled
                style="background-color:#e9ecef;"
              >
                <span class="input-group-text" slot="prepend">{{ $t('schedule_number') }}</span>
              </mdb-input>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <mdb-input
                class="mb-3"
                v-model="relieveallerror.machine"
                disabled
                style="background-color:#e9ecef;"
              >
                <span class="input-group-text" slot="prepend">{{ $t('machine_number') }}</span>
              </mdb-input>
            </b-col>
            <b-col>
              <mdb-input
                class="mb-3"
                v-model="relieveallerror.mold"
                disabled
                style="background-color:#e9ecef;"
              >
                <span class="input-group-text" slot="prepend">{{ $t('mold_number') }}</span>
              </mdb-input>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <mdb-input
                class="mb-3"
                v-model="relieveallerror.errortype"
                disabled
                style="background-color:#e9ecef;"
              >
                <span class="input-group-text" slot="prepend">{{ $t('errortype') }}</span>
              </mdb-input>
            </b-col>
            <!-- <b-col>
            <mdb-input
              class="mb-3"
              v-model="relieveallerror.errorName"
              disabled
              style="background-color:#e9ecef;"
            >
              <span class="input-group-text" slot="prepend">{{ $t('errorname') }}</span>
            </mdb-input>
          </b-col>-->
          </b-row>

          <div class="input-group" style="margin-bottom: 1rem">
            <div class="input-group-prepend">
              <label class="input-group-text" for="inputGroupSelect01">
                <span class="requileclass">*</span>
                {{ $t('task_end_time') }}
              </label>
            </div>
            <input
              type="datetime-local"
              class="form-control"
              :max="timemax"
              min="2000-01-01T00:00"
              v-model="relieveallerror.endTime"
              required
            />
          </div>
          <!-- *********************** -->
        </mdb-modal-body>
        <mdb-modal-footer>
          <mdb-btn color="info" type="submit">{{ $t('submit') }}</mdb-btn>
          <mdb-btn color="0000" @click.native="allerrorwarning = false" type="button">{{
            $t('close')
          }}</mdb-btn>
        </mdb-modal-footer>
      </form>
    </mdb-modal>
    <!-- end批量解除異常 -->
    <!-- 結束任務 -->
    <mdb-modal centered :show="warning" @close="warning = false">
      <form v-on:submit.prevent="submitfunc">
        <mdb-modal-header>
          <mdb-modal-title>{{ $t('task_end') }}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <mdb-input
            class="mb-3"
            v-model="taskrocord.number"
            disabled
            style="background-color:#e9ecef;"
          >
            <span class="input-group-text" slot="prepend">{{ $t('task_number') }}</span>
          </mdb-input>
          <mdb-input
            v-show="false"
            class="mb-3"
            v-model="taskrocord.startTime"
            type="datetime-local"
            :max="timemax"
            min="2000-01-01T00:00"
            required
          >
            <span class="input-group-text" slot="prepend">
              {{ $t('task_start_time') }}
            </span>
          </mdb-input>
          <mdb-input
            class="mb-3"
            v-model="taskrocord.endTime"
            type="datetime-local"
            :max="timemax"
            min="2000-01-01T00:00"
            required
          >
            <span class="input-group-text" slot="prepend">
              <span class="requileclass">*</span>
              {{ $t('task_end_time') }}
            </span>
          </mdb-input>
        </mdb-modal-body>
        <mdb-modal-footer>
          <div style="text-align:center;color:red">{{ errormessage }}</div>
          <mdb-btn color="info" type="submit">{{ $t('submit') }}</mdb-btn>
          <mdb-btn color="0000" @click.native="warning = false" type="button">{{
            $t('close')
          }}</mdb-btn>
        </mdb-modal-footer>
      </form>
    </mdb-modal>
    <!-- 確認刪除 -->
    <mdb-modal centered :show="deletewarning" @close="deletewarning = false">
      <mdb-modal-header>
        <mdb-modal-title>{{ $t('warrning_title') }}</mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body>{{ $t('warrning_body') }}</mdb-modal-body>
      <mdb-modal-footer>
        <mdb-btn color="info" v-on:click="deletemold()" @click.native="deletewarning = false">{{
          $t('delete')
        }}</mdb-btn>
        <mdb-btn color="0000" @click.native="deletewarning = false" type="button">{{
          $t('close')
        }}</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
    <!-- 任務中編輯任務 -->
    <mdb-modal centered :show="editmodal" @close="closemodal($event)">
      <form v-on:submit.prevent="submitfunc">
        <mdb-modal-header>
          <mdb-modal-title>{{ $t('task_edit') }}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <mdb-input
            class="mb-3"
            v-model="taskrocord.number"
            disabled
            style="background-color:#e9ecef;"
          >
            <span class="input-group-text" slot="prepend">{{ $t('task_number') }}</span>
          </mdb-input>

          <div class="input-group" style="margin-bottom: 1rem">
            <div class="input-group-prepend">
              <label class="input-group-text" for="inputGroupSelect01">
                <span class="requileclass">*</span>
                {{ $t('task_start_time') }}
              </label>
            </div>
            <input
              type="datetime-local"
              class="form-control"
              v-model="taskrocord.startTime"
              :max="timemax"
              min="2000-01-01T00:00"
              required
            />
          </div>
          <div class="input-group">
            <mdb-input class="mb-3" v-model="taskrocord.remark">
              <span class="input-group-text" slot="prepend">{{ $t('remark') }}</span>
            </mdb-input>
          </div>
        </mdb-modal-body>
        <mdb-modal-footer>
          <div style="text-align:center;color:red">{{ errormessage }}</div>
          <mdb-btn color="info" type="submit">{{ $t('submit') }}</mdb-btn>
          <mdb-btn color="0000" @click.native="editmodal = false" type="button">{{
            $t('close')
          }}</mdb-btn>
        </mdb-modal-footer>
      </form>
    </mdb-modal>
    <!-- 已完成編輯任務 -->
    <mdb-modal centered :show="editmodalfinish" @close="closemodal($event)">
      <form v-on:submit.prevent="submitfunc">
        <mdb-modal-header>
          <mdb-modal-title>{{ $t('task_edit') }}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <mdb-input
            class="mb-3"
            v-model="taskrocord.number"
            disabled
            style="background-color:#e9ecef;"
          >
            <span class="input-group-text" slot="prepend">{{ $t('task_number') }}</span>
          </mdb-input>
          <mdb-input
            class="mb-3"
            v-model="taskrocord.startTime"
            @change="timechang(taskrocord.startTime)"
            :max="timemax"
            min="2000-01-01T00:00"
            type="datetime-local"
          >
            <span class="input-group-text" slot="prepend">
              <span class="requileclass">*</span>
              {{ $t('task_start_time') }}
            </span>
          </mdb-input>
          <mdb-input
            class="mb-3"
            v-model="taskrocord.endTime"
            @change="timechang(taskrocord.endTime)"
            :max="timemax"
            min="2000-01-01T00:00"
            type="datetime-local"
          >
            <span class="input-group-text" slot="prepend">
              <span class="requileclass">*</span>
              {{ $t('task_end_time') }}
            </span>
          </mdb-input>
          <div class="input-group">
            <mdb-input class="mb-3" v-model="taskrocord.remark">
              <span class="input-group-text" slot="prepend">{{ $t('remark') }}</span>
            </mdb-input>
          </div>
          <div style="text-align:center;color:red">{{ errormessage }}</div>
        </mdb-modal-body>
        <mdb-modal-footer>
          <mdb-btn color="info" type="submit">{{ $t('submit') }}</mdb-btn>
          <mdb-btn color="0000" @click.native="editmodalfinish = false" type="button">{{
            $t('close')
          }}</mdb-btn>
        </mdb-modal-footer>
      </form>
    </mdb-modal>
    <!-- 新增 -->
    <mdb-modal :show="modal" @close="closemodal($event)" size="lg">
      <form v-on:submit.prevent="submitfunc">
        <mdb-modal-header>
          <mdb-modal-title>{{ operate }} {{ $t('task') }}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <div>
            <b-row>
              <b-col v-show="!editmode">
                <div class="input-group" style="margin-bottom: 1rem">
                  <div class="input-group-prepend">
                    <label class="input-group-text" for="inputGroupSelect01">{{
                      $t('machine_number')
                    }}</label>
                  </div>
                  <div class="form-control selsect">
                    <model-select v-model="machineselected" :options="machineobject"></model-select>
                  </div>
                </div>
              </b-col>
              <b-col>
                <div class="input-group" style="margin-bottom: 1rem">
                  <div class="input-group-prepend">
                    <label class="input-group-text" for="inputGroupSelect01">{{
                      $t('mold_number')
                    }}</label>
                  </div>
                  <div class="form-control selsect">
                    <model-select v-model="moldselected" :options="moldobject"></model-select>
                  </div>
                </div>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <div class="input-group" style="margin-bottom: 1rem">
                  <div class="input-group-prepend">
                    <label class="input-group-text" for="inputGroupSelect01">
                      <span class="requileclass">*</span>
                      {{ $t('schedule_number') }}
                    </label>
                  </div>
                  <div class="form-control selsect">
                    <model-select
                      v-model="taskrocord.scheduleId"
                      :options="scheduleoption"
                      :isError="no_sschedule_select"
                    ></model-select>
                  </div>
                </div>
              </b-col>
              <b-col>
                <div class="input-group">
                  <mdb-input
                    class="mb-3"
                    v-model="taskrocord.number"
                    disabled
                    style="background-color:#e9ecef;"
                  >
                    <span class="input-group-text" slot="prepend">{{ $t('task_number') }}</span>
                  </mdb-input>
                </div>
              </b-col>
            </b-row>
            <!-- ***************************** -->
            <div class="input-group" style="margin-bottom: 1rem">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">
                  <span class="requileclass">*</span>
                  {{ $t('task_start_time') }}
                </label>
              </div>
              <input
                type="datetime-local"
                class="form-control"
                v-model="taskrocord.startTime"
                :max="timemax"
                min="2000-01-01T00:00"
                required
              />
            </div>
            <div class="md-form input-group input-group-sm mb-3"></div>

            <div class="input-group">
              <mdb-input class="mb-3" v-model="taskrocord.remark">
                <span class="input-group-text" slot="prepend">{{ $t('remark') }}</span>
              </mdb-input>
            </div>
          </div>
        </mdb-modal-body>
        <mdb-modal-footer>
          <div style="text-align:center;color:red">{{ errormessage }}</div>
          <mdb-btn color="info" type="submit">{{ $t('submit') }}</mdb-btn>
          <mdb-btn color="0000" @click.native="modal = false" type="button">{{
            $t('close')
          }}</mdb-btn>
        </mdb-modal-footer>
      </form>
    </mdb-modal>
  </div>
</template>

<script>
import { DefectAPI } from '@/plugins/systemapis.js'
import { ModelSelect } from 'vue-search-select'
import { WorkShopAPI, moldSelectAPI, gmachineSelectAPI } from '@/plugins/basicapis.js'
// import {WorkShopAPI, moldSelectAPI, gmachineSelectAPI, TaskallURL} from '@/plugins/produceapis.js'
import {
  TaskAPI,
  ScheduleAPI,
  taskerrorAPI,
  EndTaskError,
  Errorrecordrelall,
  ScheduleOEEplusallAPI,
  TaskDeleteMultiAPI
} from '@/plugins/produceapis.js'
import naturalCompare from 'string-natural-compare'
import { mapState } from 'vuex'
export default {
  props: ['taskData', 'tabs', 'isbusyflag'],
  watch: {
    modal: function(value) {
      if (!value) {
        this.newdisabled = false
      }
    },
    errorreportmodal: function(value) {
      if (!value) {
        this.selectshow = value
      } else {
        this.sleep(300).then(() => {
          this.selectshow = true
        })
      }
    },
    scheduleid() {
      this.schedulechange(this.taskrocord.scheduleId)
    },
    machineselected: function(newval) {
      this.machinechange(newval)
    },
    moldselected: function(newval) {
      this.moldchange(newval)
    },
    tabs: function(value) {
      this.isbusy = true
      if (value == 2) {
        //已完成
        this.runningflag = false
        this.fieldstitle = this.fields1
      } else {
        //任務中
        this.runningflag = true
        this.fieldstitle = this.fields
      }
      this.tabvalue = value
      this.classification(this.alldata)
    },
    taskData: function(newVal) {
      if (newVal.length == 0) {
        this.isbusy = false
      }
      // else {
      //   this.isbusy = false
      // }
      var temparray = JSON.parse(JSON.stringify(newVal))
      this.alldata = temparray
      this.classification(this.alldata)
    },
    isbusyflag: function(newVal) {
      if (newVal == true) {
        this.isbusy = true
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
    var taskrocord = {
      Id: 0,
      startTime: 0,
      endTime: 0,
      scheduleId: 0,
      status: 0,
      number: '',
      remark: '' //備註
    }
    var errorreport = {
      id: 0,
      tasknum: '',
      startTime: 0,
      endTime: 0,
      remark: ''
    }
    var defectobjects = [
      { id: 3, name: this.$t('mold'), option: [] },
      { id: 4, name: this.$t('machine'), option: [] },
      { id: 5, name: this.$t('material'), option: [] },
      { id: 6, name: this.$t('employee'), option: [] },
      { id: 999, name: this.$t('machine_material_type_other'), option: [] }
    ]
    var errorreportnull = JSON.parse(JSON.stringify(errorreport))
    var taskrocordnull = JSON.parse(JSON.stringify(taskrocord))
    var errorselect = {
      machine: { selected: [], remark: '', defectType: 4 },
      mold: { selected: [], remark: '', defectType: 3 },
      marerial: { selected: [], remark: '', defectType: 5 },
      employee: { selected: [], remark: '', defectType: 6 },
      others: { selected: [], remark: '', defectType: 999 }
    }
    var errorselectnull = JSON.parse(JSON.stringify(errorselect))
    var relieveerror = {
      id: 0,
      endTime: '',
      machine: '',
      mold: '',
      schedule: '',
      task: '',
      errortype: '',
      errorName: ''
    }
    var relieveallerror = {
      taskID: 0,
      endTime: '',
      machine: '',
      mold: '',
      schedule: '',
      task: '',
      errortype: '',
      defectType: 0,
      timestamp: 0
    }
    return {
      manufactureOrderNumbersshowflag: true,
      newdisabled: false, //新增停用
      page_first: 0, //第一條
      page_last: 0, //最後一筆
      page_total: 0, //總共筆數
      relieveerror, //解除異常
      relieveallerror, //解全部除異常
      temperrorparent: '',
      selectshow: false,
      errorselect, //異常選擇
      errorselectnull, //異常選擇初始化
      machineoptions: [], //設備異常選單
      moldoptions: [], //模具異常選單
      materialoptions: [], //原料異常選單
      employeeoptions: [], //人員異常選單
      othersoptions: [], //其他異常選單
      errortask: '', //異常任務資訊
      defectobjects, //異常選單
      errorreport,
      errorreportnull,
      errormessage: '', //編輯錯誤訊息
      isbusy: true,
      newbtm: false, //新增
      editbtm: false, //編輯
      deletebtm: false, //刪除
      customize1: false, //自定義一 //回報
      customize2: false, //自定義二 //任務停止
      customize3: false, //自定義三
      no_sschedule_select: false, //新增未選擇排程
      warning_machine: '', //警告設備
      runningflag: true,
      tabvalue: '', //模式
      alldata1: [],
      alldata: [],
      timemax: '',
      editmode: true,
      workshopobject: [], //廠區搜尋
      scearchworkshop: 0, //廠區搜尋
      machineselected: 0,
      moldselected: 0,
      machineobject: [],
      moldobject: [],
      scheduleobject: [],
      scheduleobjectorg: [],
      selectworkshopid: null,
      deletebundisable: true,
      scheduleoption: [],
      selected: [],
      taskrocord,
      taskrocordnull,
      operate: '',
      errorreportmodal: false, //狀況回報
      editmodal: false, //任務中編輯
      editmodalfinish: false, //已完成編輯
      warning: false,
      errorwarning: false,
      allerrorwarning: false,
      deletewarning: false,
      machinewarning: false,
      modal: false,
      tabledata: [],
      detialfields: [
        {
          key: 'defectType',
          label: this.$t('errortype'), //'異常類別',
          sortable: true,
          class: 'text-center',
          thStyle: { padding: '10px', width: '150px' },
          formatter: value => {
            return value
          }
        },
        {
          key: 'defectName',
          label: this.$t('errorname'), //'異常名稱',
          sortable: true,
          class: 'text-center',
          thStyle: { padding: '10px' },
          formatter: value => {
            return value
          }
        },
        {
          key: 'startTime',
          label: this.$t('schedule_start_time'), //'開始時間',
          sortable: true,
          class: 'text-center',
          thStyle: { padding: '10px' },
          formatter: value => {
            return this.timeStampToStringFunc(value, 'yyyy-mm-dd hh:mm')
          }
        },
        {
          key: 'endTime',
          label: this.$t('schedule_end_time'), //'結束時間',
          sortable: true,
          class: 'text-center',
          thStyle: { padding: '10px' },
          formatter: value => {
            if (value == 0) {
              return '-'
            }
            return this.timeStampToStringFunc(value, 'yyyy-mm-dd hh:mm')
          }
        },
        {
          key: 'remark',
          label: this.$t('defect_remark'), //'備註',
          sortable: true,
          class: 'text-center',
          thStyle: { padding: '10px' },
          formatter: value => {
            return value
          }
        },

        {
          key: 'actions',
          label: this.$t('broadcast_lift'),
          class: 'text-center',
          thStyle: { padding: '10px' },
          tdClass: 'nameOfTheClass'
        }
      ],
      fieldstitle: [],
      fields: [
        {
          key: 'number',
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
          key: 'customizeNumbers',
          label: this.$t('manufacturingorder_customize_number'), //自定義製令編號
          class: 'text-center',
          sortable: true,
          thClass: 'thstyle',
          tdClass: 'tdstyle',
          formatter: value => {
            if (value.length == 1) {
              if (value[0] == '') {
                return '-'
              }
              return value[0]
            } else {
              if (value[0] == undefined || value[0] == '') {
                return '-, ...'
              } else {
                return value[0] + ', ...'
              }
            }
          }
        },
        {
          key: 'scheduleSerial',
          label: this.$t('schedule_number'), //'排程編號',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'startTime',
          label: this.$t('task_start_time'), //'開始時間',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'machineNumber',
          label: this.$t('machine'), //'設備',
          sortable: true,
          class: 'text-center',
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'moldNumber',
          label: this.$t('mold'), //'模具',
          sortable: true,
          class: 'text-center',
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'workShopName',
          label: this.$t('workshop'), //'廠區',
          class: 'text-center',
          sortable: true,
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'expectedCount',
          label: this.$t('plan_molds'), //'計畫生產模次',
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
          label: this.$t('actual_molds'), //'實際生產模次',
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
          label: this.$t('remark'),
          class: 'text-center',
          thClass: 'thstyle',
          tdClass: 'tdstyle remarkstyle'
        }, //備註
        {
          key: 'errorflag',
          label: this.$t('abnormal'), //'異常',
          sortable: true,
          thStyle: 'min-width:260px',
          class: 'text-center',
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'actions',
          label: this.$t('operating'),
          // thStyle: 'min-width:150px',
          class: 'text-center',
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        }
      ],
      fields1: [
        {
          key: 'number',
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
          key: 'customizeNumbers',
          label: this.$t('manufacturingorder_customize_number'), //自定義製令編號
          class: 'text-center',
          sortable: true,
          thClass: 'thstyle',
          tdClass: 'tdstyle',
          formatter: value => {
            if (value.length == 1) {
              return value[0]
            } else {
              if (value[0] == undefined) {
                return '-'
              } else {
                return value[0] + ', ...'
              }
            }
          }
        },
        {
          key: 'scheduleSerial',
          label: this.$t('schedule_number'), //'排程編號',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'startTime',
          label: this.$t('task_start_time'), //'開始時間',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'endTime',
          label: this.$t('task_end_time'), //'結束時間',
          sortable: true,
          class: 'text-center',
          formatter: value => {
            if (value == 0) {
              return '-'
            }
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'machineNumber',
          label: this.$t('machine'), //'設備',
          sortable: true,
          class: 'text-center',
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'moldNumber',
          label: this.$t('mold'), //'模具',
          sortable: true,
          class: 'text-center',
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'workShopName',
          label: this.$t('workshop'), //'廠區',
          class: 'text-center',
          sortable: true,
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'expectedCount',
          label: this.$t('plan_molds'), //'計畫生產模次',
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
          label: this.$t('actual_molds'), //'實際生產模次',
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
          label: this.$t('remark'),
          class: 'text-center',
          thClass: 'thstyle',
          tdClass: 'tdstyle remarkstyle'
        }, //備註
        {
          key: 'errorflag',
          label: this.$t('abnormal'), //'異常',
          sortable: true,
          thStyle: 'min-width:260px',
          class: 'text-center',
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'actions',
          label: this.$t('operating'),
          // thStyle: 'min-width:150px',
          class: 'text-center',
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        }
      ],
      totalRows: 0,
      currentPage: 1,
      perPage: 100,
      pageOptions: [20, 50, 100],
      sortBy: 'startTime',
      sortDesc: true,
      filter: null,
      filterOn: [
        'manufactureOrderNumbers',
        'number',
        'scheduleSerial',
        'machineNumber',
        'moldNumber',
        'remark',
        'customizeNumbers'
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
    scheduleid() {
      return this.taskrocord.scheduleId
    },
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
    this.inidata()
    this.fieldstitle = this.fields
  },
  created() {
    this.getalldefect() //取得所有異常
    this.iniright()
    this.getworkshop()
  },
  methods: {
    //設定權限
    iniright() {
      this.authority.forEach(item => {
        if (item.name == 'produce_task') {
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
    // endTime: '',
    //   machine: '',
    //   mold: '',
    //   schedule: '',
    //   task: '',
    //   errortype: '',
    //   errorName: ''
    //table顯示隱藏製令、自定義製令
    manufactureOrderNumbersshowflagfunc() {
      this.manufactureOrderNumbersshowflag = !this.manufactureOrderNumbersshowflag
    },
    //解除錯誤
    enderror(item, item1) {
      this.temperrorparent = item1
      //無異常資料
      var timestamp = Math.floor(Date.now()) //取得當下timestamp
      this.relieveerror.id = item.id
      this.relieveerror.endTime = this.timeStampToStringFunc(timestamp, 'yyyy-mm-ddThh:mm') //開始時間預設現在

      this.relieveerror.machine = item1.machineNumber
      this.relieveerror.mold = item1.moldNumber
      this.relieveerror.schedule = item1.scheduleSerial
      this.relieveerror.task = item1.number
      this.relieveerror.errortype = this.defectTypeName(item.defectType)
      this.relieveerror.errorName = item.defectName
      this.relieveerror.remark = item.remark
      this.timemax = this.getnowtimestamp()
      this.errorwarning = true
    },
    //解除所有異常
    finishallerror(value, item) {
      var timestamp = Math.floor(Date.now()) //取得當下timestamp
      this.relieveerror.id = item.id
      this.timemax = this.getnowtimestamp()
      this.relieveallerror.taskID = item.id
      this.relieveallerror.endTime = this.timeStampToStringFunc(timestamp, 'yyyy-mm-ddThh:mm') //開始時間預設現在
      this.relieveallerror.machine = item.machineNumber
      this.relieveallerror.mold = item.moldNumber
      this.relieveallerror.schedule = item.scheduleSerial
      this.relieveallerror.task = item.number
      this.relieveallerror.errortype = this.defectTypeName(value)
      this.relieveallerror.defectType = value
      // this.relieveallerror.timestamp = timestamp
      this.allerrorwarning = true
      // relieveallerror
    },
    //取得所有異常
    getalldefect() {
      var access_token_val = this.$cookies.get('access_token')
      DefectAPI.get({
        headers: {
          access_token: access_token_val,
          type: '[3,4,5,6,999]' //3模具、4設備、5原料、6人員、999其他
        }
      }).then(
        res => {
          if (res.data != null) {
            res.data.forEach(item => {
              if (!item.isDelete) {
                switch (item.type) {
                  case 3: //模具
                    this.moldoptions.push({ text: item.name, value: item.id })
                    break
                  case 4: //設備
                    this.machineoptions.push({ text: item.name, value: item.id })
                    break
                  case 5: //原料
                    this.materialoptions.push({ text: item.name, value: item.id })
                    break
                  case 6: //人員
                    this.employeeoptions.push({ text: item.name, value: item.id })
                    break
                  case 999: //其他
                    this.othersoptions.push({ text: item.name, value: item.id })
                    break
                }
              }

              for (var i = 0; i < this.defectobjects.length; i++) {
                if (item.type == this.defectobjects[i].id) {
                  this.defectobjects[i].option.push({ value: item.id, text: item.name })
                  break
                }
              }
            })
          }
        },
        error => {
          console.log(error)
        }
      )
    },
    //篩選廠區
    scearchworkshopchange() {
      // 全選
      if (this.scearchworkshop == 0) {
        this.tabledata = this.alldata1
        this.totalRows = this.alldata1.length
      } else {
        var temparray = []
        this.alldata1.forEach(item => {
          if (item.workShopId == this.scearchworkshop) {
            temparray.push(item)
          }
        })
        this.tabledata = temparray
        this.totalRows = temparray.length
      }
    },
    inidata() {
      // if (this.tabledata.length == 0) {
      //   this.isbusy = false
      // }
    },
    // {
    //         defectId: 0,
    //         endTime: 0,
    //         errorReportId: 0,
    //         id: 0,
    //         isFinish: true,
    //         startTime: 0
    //       }
    dealobject(data) {
      var tempobject = {
        defectType: data.defectType,
        errorRecordRel: [],
        id: 0,
        remark: data.remark,
        taskId: this.errorreport.id
      }
      data.selected.forEach(item => {
        tempobject.errorRecordRel.push({
          defectId: item,
          endTime: 0,
          // errorReportId: 0,
          // id: 0,
          isFinish: false,
          startTime: this.errorreport.startTime
        })
      })

      return tempobject
    },

    //處理資料
    errorreportdealdata() {
      var stbmitarray = []
      //未選擇異常
      if (
        this.errorselect.machine.selected.length == 0 &&
        this.errorselect.mold.selected.length == 0 &&
        this.errorselect.marerial.selected.length == 0 &&
        this.errorselect.employee.selected.length == 0 &&
        this.errorselect.others.selected.length == 0
      ) {
        return []
      } else {
        this.errorreport.startTime = this.stringToTimestampFunc(this.errorreport.startTime)
        //設備
        if (this.errorselect.machine.selected.length != 0) {
          stbmitarray.push(this.dealobject(this.errorselect.machine))
        }
        //模具
        if (this.errorselect.mold.selected.length != 0) {
          stbmitarray.push(this.dealobject(this.errorselect.mold))
        }
        //原料
        if (this.errorselect.marerial.selected.length != 0) {
          stbmitarray.push(this.dealobject(this.errorselect.marerial))
        }
        //人員
        if (this.errorselect.employee.selected.length != 0) {
          stbmitarray.push(this.dealobject(this.errorselect.employee))
        }
        //其他
        if (this.errorselect.others.selected.length != 0) {
          stbmitarray.push(this.dealobject(this.errorselect.others))
        }
        return stbmitarray
      }

      // return this.errorreport
    },
    //狀況回報送出
    errorreportsubit() {
      // this.errorreportdealdata()
      var data = this.errorreportdealdata()

      if (data.length == 0) {
        //無異常資料
        var timestamp = Math.floor(Date.now()) //取得當下timestamp
        this.errorreport.startTime = this.timeStampToStringFunc(timestamp, 'yyyy-mm-ddThh:mm') //開始時間預設現在
        // this.errorreportmodal = false
      } else {
        //無異常資料
        var access_token_val = this.$cookies.get('access_token')
        var tempnum = 0
        data.forEach(item => {
          taskerrorAPI
            .post(JSON.stringify(item), {
              headers: {
                access_token: access_token_val
              }
            })
            .then(
              () => {
                tempnum++
                if (tempnum == data.length) {
                  this.tabledata.forEach(item => {
                    item._showDetails = false
                  })
                  this.errorreportmodal = false
                  this.$layer.msg(this.$t('scuccess'))
                  // 重載資料
                  this.isbusy = true
                  this.$emit('callparent', 1) //呼叫父元件
                }
              },
              error => {
                console.log(error.response)
                this.errorreportmodal = false
                // this.errormessage = error.response.data.response
              }
            )
        })
      }
    },
    //新增異常回報視窗
    errorreportfunc(item) {
      this.operate = this.$t('new')
      this.errorreport = JSON.parse(JSON.stringify(this.errorreportnull))
      this.errorreport.id = item.id
      this.errorreport.number = item.number
      this.errorreport.startTime = item.startTime
      this.errorreport.endTime = item.endTime
      this.errortask = item

      this.errorselect = JSON.parse(JSON.stringify(this.errorselectnull))
      var timestamp = Math.floor(Date.now()) //取得當下timestamp
      this.errorreport.startTime = this.timeStampToStringFunc(timestamp, 'yyyy-mm-ddThh:mm') //開始時間預設現在
      this.timemax = this.getnowtimestamp()
      this.errorreportmodal = true
    },
    sleep(time) {
      return new Promise(resolve => setTimeout(resolve, time))
    },

    expandAdditionalInfo(row) {
      row._showDetails = !row._showDetails
    },
    //取得任務回報資訊
    getdeialdata(item1) {
      var tempindex = 0
      var tempid = 0
      this.tabledata.forEach((item, index) => {
        if (item.id == item1.id) {
          tempindex = index
          tempid = item.id
        }
      })
      this.getdetial(tempid, tempindex)
      // this.tabledata[tempindex]._showDetails = true
    },
    classification(alldata) {
      var temparray = []
      this.alldata1 = []
      if (alldata != null) {
        alldata.forEach(item => {
          temparray.push(item)
        })
      }

      if (temparray != null) {
        temparray.forEach(item => {
          item.iconlight = this.iconlightfunc(item.defectTypes)
        })
        this.alldata1 = temparray
        this.tabledata = temparray
        this.totalRows = temparray.length
      } else {
        this.tabledata = []
        this.totalRows = 0
      }

      this.isbusy = false
      this.setfooternum() //設定頁數
    },
    //五燈
    iconlightfunc(data) {
      if (data == null) {
        var tempobject = {
          machine: false,
          mold: false,
          material: false,
          employee: false,
          others: false
        }
      } else {
        var tempobject = {
          machine: data.includes(4),
          mold: data.includes(3),
          material: data.includes(5),
          employee: data.includes(6),
          others: data.includes(999)
        }
      }

      return tempobject
    },
    timechang() {
      // console.log(value)
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
            value: 0
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
    //根據排程更換任務編號
    schedulechange(num) {
      this.scheduleoption.forEach(item => {
        if (num == item.value) {
          if (item.schedule.includes('SB')) {
            this.taskrocord.number = item.schedule.replace('SB', 'SC')
          } else {
            this.taskrocord.number = item.schedule.replace('A', 'SC')
          }
        }
      })
    },
    pushitem(item) {
      this.scheduleoption.push({
        text:
          item.scheduleSerial +
          '__' +
          this.$t('task_start_time') +
          '  : ' +
          this.timeStampToStringFunc(item.startTime, 'yyyy-mm-dd hh:mm') +
          '__' +
          this.$t('machine_number') +
          '__' +
          '  : ' +
          item.machineNumber +
          '__' +
          this.$t('mold_number') +
          '  : ' +
          item.moldNumber,
        value: item.id,
        machineNumber: item.machineNumber,
        moldNumber: item.moldNumber,
        schedule: item.scheduleSerial
      })
    },
    //設備改變
    machinechange(num) {
      this.taskrocord.scheduleId = 0
      this.taskrocord.number = ''
      if (this.scheduleobject != null) {
        this.scheduleoption = []
        this.scheduleobject.forEach(item => {
          //選設備
          if (num != 0) {
            if (item.status == 3 && item.machineId == num) {
              //有模具
              if (this.moldselected != 0) {
                if (item.moldId == this.moldselected) {
                  this.pushitem(item)
                }
                //無模具
              } else {
                this.pushitem(item)
              }
            }
          } else {
            //無設備
            if (item.status == 3) {
              //有模具
              if (this.moldselected != 0) {
                if (item.moldId == this.moldselected) {
                  this.pushitem(item)
                }
                //無模具
              } else {
                this.pushitem(item)
              }
            }
          }
        })
      }
    },
    //模具改變
    moldchange(num) {
      this.taskrocord.scheduleId = 0
      this.taskrocord.number = ''
      if (this.scheduleobject != null) {
        this.scheduleoption = []
        this.scheduleobject.forEach(item => {
          //選模具
          if (num != 0) {
            if (item.status == 3 && item.moldId == num) {
              //有設備
              if (this.machineselected != 0) {
                if (item.machineId == this.machineselected) {
                  this.pushitem(item)
                }
                //無設備
              } else {
                this.pushitem(item)
              }
            }
          } else {
            //無模具
            if (item.status == 3) {
              //有設備
              if (this.machineselected != 0) {
                if (item.machineId == this.machineselected) {
                  this.pushitem(item)
                }
                //無設備
              } else {
                this.pushitem(item)
              }
            }
          }
        })
      }
    },
    //modal背景點擊不關閉
    closemodal(value) {
      if (value == undefined) {
        this.newdisabled = false
        this.modal = false
        this.editmodal = false
        this.errorreportmodal = false
        this.editmodalfinish = false
        this.allerrorwarning = false
        this.errorwarning = false
      }
    },
    //取得設備
    getmachine() {
      var access_token_val = this.$cookies.get('access_token')
      gmachineSelectAPI({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          this.machineobject = [{ text: this.$t('all'), value: 0 }]
          if (res.data != null) {
            res.data.sort((a, b) => naturalCompare(a.machineNumber, b.machineNumber))
            res.data.forEach(item => {
              this.machineobject.push({
                text: item.machineNumber,
                value: item.id
              })
            })
          }
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //取得模具
    getmold() {
      var access_token_val = this.$cookies.get('access_token')
      moldSelectAPI({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          this.moldobject = [{ value: 0, text: this.$t('all') }]
          if (res.data != null) {
            res.data.sort((a, b) => naturalCompare(a.number, b.number))
            res.data.forEach(item => {
              this.moldobject.push({ text: item.number, value: item.id })
            })
          }
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //選單
    getscheduleoption(mode) {
      var access_token_val = this.$cookies.get('access_token')
      ScheduleOEEplusallAPI.get({
        headers: {
          access_token: access_token_val,
          workShopId: -1,
          timeRange: -1,
          status: 3
        }
      }).then(
        res => {
          if (res.data.schedule != null) {
            this.scheduleoption = []
            res.data.schedule.forEach(item => {
              this.scheduleoption.push({
                text:
                  item.scheduleSerial +
                  ' ' +
                  this.$t('task_start_time') +
                  '  : ' +
                  this.timeStampToStringFunc(item.startTime, 'yyyy-mm-dd hh:mm') +
                  ' ' +
                  this.$t('machine_number') +
                  '  : ' +
                  item.machineNumber +
                  ' ' +
                  this.$t('mold_number') +
                  '  : ' +
                  item.moldNumber +
                  ' ' +
                  this.$t('plan_molds') +
                  '  : ' +
                  this.dealThousands('-', item.qty),
                value: item.id,
                machineNumber: item.machineNumber,
                moldNumber: item.moldNumber,
                schedule: item.scheduleSerial,
                isDisabled: true
              })
            })
            this.modal = true
            this.getschedule('new')
          } else {
            if (mode == 'new') {
              this.scheduleoption = []
              this.modal = true
              this.getschedule('new')
            }
          }
        },
        error => {
          this.scheduleoption = []
          this.modal = true
          this.getschedule('new')
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //取得排程
    getschedule(mode) {
      var access_token_val = this.$cookies.get('access_token')
      ScheduleAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          if (res.data != null) {
            if (mode == 'new') {
              this.scheduleobject = res.data
            } else if (mode == 'getdata') {
              this.scheduleobject = res.data
              // this.getdata2()
            }
          } else {
            if (mode == 'new') {
              this.scheduleobject = res.data
            } else if (mode == 'getdata') {
              this.scheduleobject = res.data
              // this.getdata2()
            }
          }
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },

    //取得任務詳細資訊
    getdetial(id, num) {
      this.tabledata[num]._showDetails = false //先隱藏下拉，等api回應再顯示
      var access_token_val = this.$cookies.get('access_token')
      TaskAPI.get({
        headers: {
          id: id,
          access_token: access_token_val
        }
      }).then(
        res => {
          this.tabledata[num].detial = this.dealdetial(res.data)
          this.tabledata[num]._showDetails = true //顯示下拉
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //處理詳細資料
    dealdetial(data) {
      var errorRecordsarray = []
      var errorRecordsarray1 = []
      if (data.errorRecords != null) {
        data.errorRecords.forEach(item => {
          item.errorRecordRel.forEach(errorRecordRelitem => {
            errorRecordsarray.push({
              defectType: item.defectType,
              defectName: errorRecordRelitem.defectName,
              defectTypeName: this.defectTypeName(item.defectType),
              id: errorRecordRelitem.id,
              defectId: errorRecordRelitem.defectId,
              startTime: errorRecordRelitem.startTime,
              endTime: errorRecordRelitem.endTime,
              errorReportId: errorRecordRelitem.errorReportId,
              isFinish: errorRecordRelitem.isFinish,
              remark: errorRecordRelitem.remark
            })
          })
        })
        //未完成
        errorRecordsarray.forEach(item => {
          if (!item.isFinish) {
            errorRecordsarray1.push(item)
          }
        })
        //已完成
        errorRecordsarray.forEach(item => {
          if (item.isFinish) {
            errorRecordsarray1.push(item)
          }
        })
      }

      return errorRecordsarray1
    },
    defectTypeName(value) {
      if (value == 3) {
        return this.$t('mold')
      } else if (value == 4) {
        return this.$t('machine')
      } else if (value == 5) {
        return this.$t('material')
      } else if (value == 6) {
        return this.$t('employee')
      } else if (value == 999) {
        return this.$t('machine_material_type_other')
      }
    },
    // getdata2() {
    //   var access_token_val = this.$cookies.get('access_token')
    //   TaskAPI.get({
    //     headers: {
    //       access_token: access_token_val
    //     }
    //   }).then(
    //     res => {
    //       if (res.data != null) {
    //         res.data.forEach(item => {
    //           if (this.scheduleobject.length != 0) {
    //             for (var i = 0; i < this.scheduleobject.length; i++) {
    //               if (this.scheduleobject[i].id == item.scheduleId) {
    //                 item.scheduleSerial = this.scheduleobject[i].scheduleSerial
    //                 break
    //               }
    //             }
    //           }
    //           item.startTime = this.timeStampToStringFunc(item.startTime, 'yyyy-mm-dd hh:mm')
    //           item.endTime = this.timeStampToStringFunc(item.endTime, 'yyyy-mm-dd hh:mm')
    //         })

    //         this.totalRows = res.data.length
    //       }

    //       // this.tabledata = res
    //     },
    //     error => {
    //       console.log(error.response)
    //       this.$layer.msg(this.$t('fail') + error.response.data.response)
    //     }
    //   )
    // },

    resetInfoModal() {
      this.infoModal.title = ''
      this.infoModal.content = ''
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    //已完成編輯
    taskwindowfinish(item) {
      this.errormessage = ''
      this.taskrocord = JSON.parse(JSON.stringify(item))
      this.timemax = this.getnowtimestamp()
      this.taskrocord.startTime =
        this.taskrocord.startTime.substring(0, 10) +
        'T' +
        this.taskrocord.startTime.substring(11, 16)
      this.taskrocord.endTime =
        this.taskrocord.endTime.substring(0, 10) + 'T' + this.taskrocord.endTime.substring(11, 16)
      this.editmodalfinish = true
    },

    taskwindow(item, index, mode) {
      this.errormessage = ''
      if (mode == 'end') {
        this.operate = this.$t('task_end')
      } else if (mode == 'new') {
        this.machineselected = '' //清空篩選設備編號
        this.moldselected = '' //清空篩選模具編號
        this.no_sschedule_select = false
        this.operate = this.$t('new')
      }

      if (mode == 'end') {
        this.endwindow(item)
        // this.getschedule()
      } else if (mode == 'new') {
        this.newdisabled = true
        this.editmode = false
        this.newwindow()
        this.getmold()
        this.getmachine()
        this.getscheduleoption('new')
      } else {
        this.editmode = true
        this.editwindow(item)
      }
    },
    //編輯
    editwindow(item) {
      this.taskrocord = JSON.parse(JSON.stringify(item))
      this.timemax = this.getnowtimestamp()
      this.taskrocord.startTime =
        this.taskrocord.startTime.substring(0, 10) +
        'T' +
        this.taskrocord.startTime.substring(11, 16)

      this.editmodal = true
    },
    //結束
    endwindow(item) {
      this.taskrocord = JSON.parse(JSON.stringify(item))
      this.taskrocord.endTime = this.getnowtimestamp()
      this.taskrocord.startTime =
        this.taskrocord.startTime.substring(0, 10) +
        'T' +
        this.taskrocord.startTime.substring(11, 16)
      this.taskrocord.status = 2
      this.timemax = this.getnowtimestamp()
      this.warning = true
    },
    //新增
    newwindow() {
      this.taskrocord = JSON.parse(JSON.stringify(this.taskrocordnull))
      this.timemax = this.getnowtimestamp()
      this.taskrocord.startTime = this.getnowtimestamp()
      this.taskrocord.status = 1
    },
    getnowtimestamp() {
      var now = this.stringToTimestampFunc(new Date())
      now = this.timeStampToStringFunc(now, 'yyyy-mm-ddThh:mm')
      return now
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
      if (this.taskrocord.endTime !== 0) {
        this.taskrocord.endTime = this.stringToTimestampFunc(this.taskrocord.endTime)
      }
      this.taskrocord.startTime = this.stringToTimestampFunc(this.taskrocord.startTime)
    },
    Reversedealdata() {
      this.taskrocord.startTime = this.timeStampToStringFunc(
        this.taskrocord.startTime,
        'yyyy-mm-ddThh:mm'
      )
      this.taskrocord.endTime = this.timeStampToStringFunc(
        this.taskrocord.endTime,
        'yyyy-mm-ddThh:mm'
      )
    },
    // 送出
    submitfunc() {
      // 未選擇排程
      if (this.taskrocord.number == '' && this.taskrocord.scheduleId == 0) {
        this.no_sschedule_select = true
      } else {
        this.dealdata()
        var access_token_val = this.$cookies.get('access_token')
        if (this.taskrocord.Id == '') {
          this.warning_machine = ''
          var temp = ''
          this.scheduleoption.forEach(item => {
            if (this.taskrocord.scheduleId == item.value) {
              temp = item.machineNumber
            }
          })
          var machineontaskflag = false
          this.tabledata.forEach(item => {
            if (item.machineNumber == temp) {
              //設備有任務
              this.warning_machine = temp
              machineontaskflag = true
            }
          })
          if (machineontaskflag != true) {
            //設備無任務﹐送出
            TaskAPI.post(JSON.stringify(this.taskrocord), {
              headers: {
                access_token: access_token_val
              }
            }).then(
              () => {
                // this.getdata();
                this.$layer.msg(this.$t('scuccess'))
                this.newdisabled = false
                this.modal = false

                // 重載資料
                this.isbusy = true
                this.$emit('callparent', 1) //呼叫父元件
              },
              error => {
                this.Reversedealdata()
                if (
                  error.response.data.response.includes(
                    'There have other machines or molds is using in the same time or task conflicts:'
                  )
                ) {
                  this.errormessage = this.$t('to_schedule_error2')
                } else {
                  this.errormessage = error.response.data.response
                }
                console.log(error.response)
                // this.$layer.msg(this.$t('fail') + error.response.data.response)
              }
            )
          } else {
            this.newdisabled = false
            this.warning = false
            this.modal = false
            this.machinewarning = true
          }
        } else {
          if (this.taskrocord.startTime > this.taskrocord.endTime && this.taskrocord.endTime != 0) {
            this.errormessage =
              this.$t('task_end_cannot_earlier_start') +
              this.timeStampToStringFunc(this.taskrocord.startTime, 'yyyy-mm-dd hh:mm') //結束時間不得早於
            this.Reversedealdata()
          } else {
            this.errormessage = ''
            TaskAPI.put(JSON.stringify(this.taskrocord), {
              headers: {
                access_token: access_token_val
              }
            }).then(
              () => {
                this.errormessage = ''
                // this.getdata();
                this.$layer.msg(this.$t('scuccess'))
                this.editmodalfinish = false
                this.editmodal = false
                this.warning = false

                // 重載資料
                this.isbusy = true
                this.$emit('callparent', 1) //呼叫父元件
              },
              error => {
                this.Reversedealdata()
                console.log(error.response)
                if (
                  error.response.data.response.includes(
                    'There have other machines or molds is using in the same time or task conflicts:'
                  )
                ) {
                  this.errormessage = this.$t('task_time_error')
                } else {
                  this.errormessage = error.response.data.response
                }
                // this.$layer.msg(this.$t('fail') + error.response.data.response)
                // this.editmodalfinish = false
                // this.editmodal = false
              }
            )
          }
        }
      }
    },
    //送出批量解除異常
    submitrelieveallerror() {
      this.relieveallerror.timestamp = this.stringToTimestampFunc(this.relieveallerror.endTime)

      var access_token_val = this.$cookies.get('access_token')
      Errorrecordrelall(JSON.stringify(this.relieveallerror), {
        headers: {
          access_token: access_token_val
        }
      }).then(
        () => {
          this.$layer.msg(this.$t('scuccess'))
          // this.getdeialdata(this.temperrorparent)
          this.allerrorwarning = false
          // 重載資料
          this.isbusy = true
          this.$emit('callparent', 1) //呼叫父元件
        },
        error => {
          console.log(error.response)
          // this.$layer.msg(this.$t('fail') + error.response.data.response)
          this.newdisabled = false
          // this.modal = false
        }
      )
    },
    //送出解除異常
    submitrelieveerror() {
      let tempobj = {
        id: this.relieveerror.id,
        remark: this.relieveerror.remark,
        timestamp: this.stringToTimestampFunc(this.relieveerror.endTime)
      }
      var access_token_val = this.$cookies.get('access_token')
      EndTaskError.put(tempobj, {
        headers: {
          access_token: access_token_val
        }
      }).then(
        () => {
          this.$layer.msg(this.$t('scuccess'))
          // this.getdeialdata(this.temperrorparent)
          this.errorwarning = false
          // 重載資料
          this.isbusy = true
          this.$emit('callparent', 1) //呼叫父元件
        },
        error => {
          console.log(error)
          // this.$layer.msg(this.$t('fail') + error.response.data.response)
          this.newdisabled = false
          // this.modal = false
        }
      )
    },
    // 刪除
    deletemold() {
      var access_token_val = this.$cookies.get('access_token')
      TaskDeleteMultiAPI.delete({
        headers: {
          access_token: access_token_val,
          ids: this.selectedArrayToString(this.selected)
        }
      }).then(
        () => {
          this.$layer.msg(this.$t('scuccess'))
          this.newdisabled = false
          this.modal = false
          this.isbusy = true
          // 重載資料
          this.$emit('callparent', 1) //呼叫父元件
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
          this.newdisabled = false
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
<style scoped>
.nameOfTheClass {
  background-color: blue;
}
.ui.selection.dropdown {
  border: 0px !important;
}
.moldnumberclass {
  max-width: 30px;
  text-align: center;
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
<style>
.taskpctableclass {
  max-height: calc(100vh - 346px - 30px) !important;
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

/*設備*/
.fa-ambulance::before {
  /* content: url(../../../assets/slideimg/test111.svg); */
  content: '';
  background-image: url(../../../assets/slideimg/W_basicsetting_machine.svg);
  /* background-image-fill: chocolate; */
  background-size: 100% 100%;
  display: inline-block;
  height: 14px;
  width: 14px;
  position: relative;
  top: 2px;
  right: 2px;
}
/*模具*/
.fa-hospital-symbol::before {
  /* content: url(../../../assets/slideimg/W_basicsetting_mold.svg); */
  content: '';
  background-image: url(../../../assets/slideimg/W_basicsetting_mold.svg);
  background-size: 100% 100%;
  display: inline-block;
  height: 14px;
  width: 14px;
  position: relative;
  top: 2px;
  right: 2px;
}
/*原料*/
.fa-sign-in-alt::before {
  /* content: url(../../../assets/slideimg/W_basicsetting_material.svg); */
  content: '';
  background-image: url(../../../assets/slideimg/W_basicsetting_material.svg);
  background-size: 100% 100%;
  display: inline-block;
  height: 14px;
  width: 14px;
  position: relative;
  top: 2px;
  right: 2px;
}
/*人員*/
.fa-user-clock::before {
  /* content: url(../../../assets/slideimg/W_basicsetting_employee.svg); */
  content: '';
  background-image: url(../../../assets/slideimg/W_basicsetting_employee.svg);
  background-size: 100% 100%;
  display: inline-block;
  height: 14px;
  width: 14px;
  position: relative;
  top: 2px;
  right: 2px;
}
</style>
