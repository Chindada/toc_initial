<template>
  <div style="padding-top: 0.2rem;width:100%">
    <!-- <div style="position: fixed;background:white;width:83%;top:130px;z-index:1"> -->
    <b-row>
      <b-col lg="8">
        <mdb-input
          style="width:80%"
          v-model="filter"
          type="search"
          id="filterInput"
          :placeholder="
            this.$t('manufacturingorder_number') +
              '、' +
              this.$t('manufacturingorder_customize_number') +
              '、' +
              this.$t('product_number') +
              '、' +
              this.$t('manufacturingorder_deadline') +
              '、' +
              this.$t('manufacturingorder_order') +
              '、' +
              this.$t('remark')
          "
        >
          <span class="input-group-text" slot="prepend">{{ $t('search') }}</span>

          <!-- <mdb-btn size="sm" color="primary" :disabled="!filter" @click="filter = ''">清除</mdb-btn> -->
        </mdb-input>
      </b-col>
      <b-col lg="4" style="z-index:0!important">
        <!-- <div class="input-group">
          <div class="input-group-prepend">
            <label class="input-group-text" for="inputGroupSelect01">
              {{ $t('workshop_machine') }}
            </label>
          </div>
          <b-form-select
            v-model="scearchworkshop"
            :options="workshopobject1"
            @change="scearchworkshopchange()"
          ></b-form-select>
        </div>-->
        <!-- <b-form-select
          v-model="scearchworkshop"
          :options="workshopobject"
        ></b-form-select
        >-->
      </b-col>
    </b-row>

    <!-- 新增 -->
    <mdb-btn
      v-if="newbtm"
      size="sm"
      color="primary"
      v-on:click="manufacturingorderwindow([], [], 'new')"
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

    <!-- 轉排程 -->
    <mdb-btn
      v-if="customize2"
      v-on:click="checkver()"
      size="sm"
      color="danger"
      :disabled="selected ? selected == 0 : false"
      href="/basicsetting/machine"
      >{{ $t('to_schedule') }}</mdb-btn
    >

    <!-- 下載範例-->
    <mdb-btn
      size="sm"
      color="indigo"
      @click="downloadsample()"
      icon="file-excel"
      style="padding:0.5rem"
      >{{ $t('manufacturing_order_example') }}</mdb-btn
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
      size="sm"
      color="indigo"
      icon="file-import"
      @click="importfile()"
      style="padding:0.5rem"
      type="file"
      >{{ $t('manufacturing_order_import') }}</mdb-btn
    >
    <!-- 匯出 -->
    <mdb-btn
      :disabled="btndisable"
      size="sm"
      color="cyan"
      @click="exportfile()"
      icon="file-export"
      style="padding:0.5rem"
    ></mdb-btn>

    <b-table
      class="manufacturingorderpctableclass"
      no-border-collapse
      sticky-header="590px"
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
      :fields="fields"
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
      <template v-slot:cell(numberserial)="row" class="col-sm-3">{{ row.index }}</template>
      <!-- <template v-slot:cell(name)="row">{{ row.value }}</template> -->

      <template v-slot:cell(actions)="row">
        <!-- 編輯 -->
        <mdb-btn
          v-if="editbtm"
          color="mdb-color"
          @click="manufacturingorderwindow(row.item, row.index, 'edit')"
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
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
      @filtered="onFiltered"
    >
      <template v-slot:cell(numberserial)="row" class="col-sm-3">{{ row.index }}</template>
      <!-- <template v-slot:cell(name)="row">{{ row.value }}</template> -->
      <!-- <template v-slot:cell(checkbox)="row">
        <b-form-checkbox></b-form-checkbox>
      </template>-->

      <!-- <template v-slot:cell(actions)="row">
        <b-button size="sm" @click="manufacturingorderwindow(row.item, row.index, 'edit')"
          >編輯</b-button
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
        ></b-pagination>
      </b-col>
    </b-row>

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
    <!-- 新增-->
    <mdb-modal :show="modal" @close="closemodal($event)" size="lg">
      <form v-on:submit.prevent="submitfunc1">
        <mdb-modal-header>
          <mdb-modal-title>{{ operate }} {{ $t('manufacturingorder') }}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <mdb-btn
            :disabled="addRowflag"
            color="primary"
            type="button"
            rounded
            style="padding-top:0.2rem;padding-bottom:0.2rem;margin-bottom:10px"
            @click="addRow"
            >{{ $t('new_one') }}</mdb-btn
          >
          <b-row>
            <b-col cols="1" sm="1" style=" max-width: 20px !important;"></b-col>
            <b-col style="max-width:180px">
              <div class="input-group-text new" slot="prepend">
                {{ $t('manufacturingorder_number') }}
              </div>

              <div v-bind:class="{ tooltip1: true, showclass: toolboxshow }">
                ?
                <div class="tooltiptext1" style="text-align:left">
                  <div>{{ $t('manufacturingorder_number') }}</div>
                </div>
              </div>
            </b-col>
            <b-col>
              <div class="input-group-text new" slot="prepend">
                {{ $t('manufacturingorder_customize_number') }}
              </div>
              <div v-bind:class="{ tooltip1: true, showclass: toolboxshow }">
                ?
                <div class="tooltiptext1" style="text-align:left">
                  <div>{{ $t('manufacturingorder_customize_number') }}</div>
                </div>
              </div>
            </b-col>
            <b-col>
              <label class="input-group-text " for="inputGroupSelect01">
                <span class="requileclass">*</span>
                {{ $t('product_number') }}
              </label>
            </b-col>
            <b-col cols="1">
              <div class="input-group-text " slot="prepend">
                <span class="requileclass">*</span>
                {{ $t('number') }}
              </div>
            </b-col>
            <b-col>
              <div class="input-group-text" slot="prepend">
                {{ $t('manufacturingorder_order') }}
              </div>
            </b-col>
            <b-col>
              <div class="input-group-text" slot="prepend">
                <span class="requileclass">*</span>
                {{ $t('manufacturingorder_deadline') }}
              </div>
            </b-col>
            <b-col>
              <label class="input-group-text" for="inputGroupSelect01">
                <span class="requileclass">*</span>
                {{ $t('workshop_machine') }}
              </label>
            </b-col>
            <b-col>
              <label class="input-group-text" for="inputGroupSelect01">{{ $t('remark') }}</label>
            </b-col>
            <b-col cols="1" style="flex:0 0 5%"></b-col>
          </b-row>
          <hr style="opacity:0" />
          <div :key="index" v-for="(member, index) in newmanufacturingorderobject">
            <b-row>
              <b-col cols="1" sm="1" style=" max-width: 20px !important;"></b-col>
              <b-col style="max-width:180px">
                <!-- 製令編號 -->
                <mdb-input
                  :show="modal"
                  required
                  class="mb-3"
                  v-model="member.number"
                  disabled
                ></mdb-input>
              </b-col>
              <b-col>
                <!-- 自定義製令 -->
                <mdb-input :show="modal" class="mb-3" v-model="member.customizeNumber"></mdb-input>
              </b-col>
              <b-col v-bind:class="member.classtype">
                <div class="input-group test">
                  <!-- 製品編號 -->
                  <model-select
                    :options="productobject"
                    v-model="member.productId"
                    placeholder="select item"
                  ></model-select>
                </div>
              </b-col>
              <b-col cols="1">
                <!-- 數量 -->
                <mdb-input
                  @focus="focus($event)"
                  class="mb-3"
                  required
                  v-model="member.count"
                  type="number"
                  :min="1"
                ></mdb-input>
              </b-col>
              <b-col>
                <!-- 訂單編號 -->
                <mdb-input class="mb-3" v-model="member.orderNumber" placeholder="選填"></mdb-input>
              </b-col>
              <b-col>
                <!-- 完工日期 -->
                <!-- <mdb-input class="mb-3" v-model="member.deadLine" type="date" required></mdb-input> -->
                <div class="md-form input-group input-group-sm mb-3">
                  <input type="date" class="form-control" v-model="member.deadLine" required />
                </div>
              </b-col>
              <b-col>
                <div class="input-group">
                  <!-- 廠區 -->
                  <b-form-select
                    v-model="member.workShopId"
                    :options="workshopobject"
                    required
                  ></b-form-select>
                </div>
              </b-col>
              <b-col>
                <!-- 備註 -->
                <mdb-input class="mb-3" v-model="member.remark"></mdb-input>
              </b-col>
              <b-col cols="1" style="flex:0 0 5%">
                <mdb-btn
                  size="sm"
                  type="button"
                  color="danger"
                  @click="deleteRow(index)"
                  icon="trash-alt"
                  style="padding:0.5rem;margin-top: 0.5rem;"
                ></mdb-btn>
              </b-col>
            </b-row>
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
    <!-- end新增 -->
    <!-- 編輯 -->
    <mdb-modal :show="modal1" @close="closemodal($event)">
      <form v-on:submit.prevent="submitfunc">
        <mdb-modal-header>
          <mdb-modal-title>{{ operate }} {{ $t('manufacturingorder') }}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <div>
            <mdb-input
              disabled
              :show="modal"
              class="mb-3"
              v-model="manufacturingorderobject.number"
            >
              <span
                class="input-group-text"
                slot="prepend"
                style="width:165px; word-wrap: break-word!important;text-align:left"
              >
                {{ $t('manufacturingorder_number') }}
              </span>
            </mdb-input>
            <mdb-input
              :show="modal"
              class="mb-3"
              v-model="manufacturingorderobject.customizeNumber"
            >
              <span
                class="input-group-text"
                slot="prepend"
                style="width:165px; word-wrap: break-word!important;text-align:left"
              >
                {{ $t('manufacturingorder_customize_number') }}
              </span>
            </mdb-input>
            <div class="input-group" style="margin-bottom: 1rem">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01" style="width:165px">
                  <span class="requileclass">*</span>
                  {{ $t('product_number') }}
                </label>
              </div>
              <div class="form-control selsect">
                <model-select
                  :options="productobject"
                  v-model="manufacturingorderobject.productId"
                  placeholder="select item"
                ></model-select>
              </div>
            </div>
            <mdb-input
              class="mb-3"
              required
              v-model="manufacturingorderobject.count"
              type="number"
              :min="1"
            >
              <span class="input-group-text" slot="prepend" style="width:165px">
                <span class="requileclass">*</span>
                {{ $t('number') }}
              </span>
            </mdb-input>
            <mdb-input class="mb-3" v-model="manufacturingorderobject.orderNumber">
              <span class="input-group-text" slot="prepend" style="width:165px">{{
                $t('manufacturingorder_order')
              }}</span>
            </mdb-input>
            <div class="input-group" style="margin-bottom: 1rem">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01" style="width:165px">
                  <span class="requileclass">*</span>
                  {{ $t('manufacturingorder_deadline') }}
                </label>
              </div>
              <input
                type="date"
                class="form-control"
                v-model="manufacturingorderobject.deadLine"
                required
              />
            </div>
            <div class="input-group" style="margin-bottom: 1rem">
              <div class="input-group-prepend">
                <label
                  class="input-group-text"
                  for="inputGroupSelect01"
                  style="width:165px;white-space:nowrap!important;"
                >
                  <span class="requileclass">*</span>
                  {{ $t('workshop_machine') }}
                </label>
              </div>
              <b-form-select
                v-model="manufacturingorderobject.workShopId"
                :options="workshopobject"
                required
              ></b-form-select>
            </div>
            <mdb-input class="mb-3" v-model="manufacturingorderobject.remark">
              <span class="input-group-text" slot="prepend" style="width:165px">{{
                $t('remark')
              }}</span>
            </mdb-input>
          </div>
        </mdb-modal-body>
        <mdb-modal-footer>
          <mdb-btn color="info" type="submit">{{ $t('submit') }}</mdb-btn>
          <mdb-btn color="0000" @click.native="modal1 = false" type="button">{{
            $t('close')
          }}</mdb-btn>
        </mdb-modal-footer>
      </form>
    </mdb-modal>
    <!-- end編輯 -->
    <!-- 轉排程IPS -->
    <mdb-modal :show="toschedulemodal" @close="toschedulemodal = false" size="lg">
      <form v-on:submit.prevent="moldtoschedulefunc">
        <mdb-modal-header>
          <mdb-modal-title>{{ $t('manufacturingorder_confirm') }}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <b-table
            ref="selectableTable"
            responsive
            show-empty
            bordered
            :hover="true"
            selectable
            select-mode="multi"
            @row-selected="moldonRowSelected"
            :items="toscheduletabledata"
            :fields="toschedulefields"
            :current-page="currentPage1"
            :per-page="perPage"
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

            <template v-slot:cell(actions)="row">
              <!-- <b-button size="sm" @click="manufacturingorderwindow(row.item, row.index, 'edit')">編輯</b-button> -->
              <!-- <b-button size="sm" @click="row.toggleDetails"
                >{{ row.detailsShowing ? '隱藏' : '顯示' }} 詳細</b-button
              >-->
              <mdb-btn
                v-if="!row.detailsShowing"
                color="mdb-color"
                @click="row.toggleDetails"
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
              <b-card>
                <div v-for="(value, key) in row.item.info" :key="key">
                  <b-row>
                    <!-- <b-col>{{value.id}}</b-col> -->
                    <b-col lg="2">{{ $t('product') }}: {{ value.productName }}</b-col>
                    <b-col lg="2">{{ $t('mold_cavity') }}: #{{ value.moldCavityNumber }}</b-col>
                    <b-col lg="2">{{ $t('mold_qty') }}: {{ value.qty }}</b-col>

                    <!-- <b-col>工時: # {{value.workingTime}}</b-col> -->
                  </b-row>
                  <hr />
                </div>
              </b-card>
            </template>
          </b-table>
          <b-col class="text-center">
            <h2 style="color:red">{{ errormes }}</h2>
          </b-col>
          <!-- <div :key="index" v-for="(item, index) in moldselected">
            <b-row>
              <b-col>{{item}}</b-col>
            </b-row>
          </div>-->
        </mdb-modal-body>
        <mdb-modal-footer>
          <b-button size="sm" @click="selectAllRows">{{
            $t('to_schedule_selectall_btm')
          }}</b-button>
          <b-button size="sm" @click="clearSelected">{{ $t('to_schedule_clearall_btm') }}</b-button>
          <mdb-btn color="info" type="submit">{{ $t('to_schedule_submit') }}</mdb-btn>
          <mdb-btn color="0000" type="button" @click.native="toschedulemodal = false">{{
            $t('close')
          }}</mdb-btn>
        </mdb-modal-footer>
      </form>
    </mdb-modal>
    <!-- end轉排程IPS -->
    <!-- 轉排程OEEplus -->
    <mdb-modal :show="toschedulemodalOEEplus" @close="toschedulemodalOEEplus = false" size="lg">
      <form v-on:submit.prevent="moldtoscheduleOEEplusfunc">
        <mdb-modal-header>
          <mdb-modal-title>{{ $t('manufacturingorder_confirm') }}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <b-table
            ref="selectableTable"
            show-empty
            bordered
            :hover="true"
            :items="toscheduletabledataOEEplus"
            :fields="toschedulefieldsOEEplus"
            :current-page="currentPage1"
            :per-page="perPage"
            :filterIncludedFields="filterOn"
            :sort-by.sync="sortBy"
            sort-desc.sync="asc"
            :sort-direction="sortDirection"
            @filtered="onFiltered"
          >
            <template v-slot:cell(numberserial)="row" class="col-sm-3">{{ row.index }}</template>
            <template v-slot:cell(actions)="row">
              <mdb-btn
                v-if="!row.detailsShowing"
                color="mdb-color"
                @click="row.toggleDetails"
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
              <mdb-btn
                size="sm"
                type="button"
                color="danger"
                @click="deleteToScheduleRow(row.item)"
                icon="trash-alt"
                style="padding:0.5rem;margin-top: 0.5rem;"
              ></mdb-btn>
            </template>

            <!-- 設備編號 -->
            <template v-slot:cell(machine)="row" class="newerrortype">
              <!-- {{ row.item.classtype }} -->
              <div
                v-bind:class="row.item.classtype"
                style="padding:10px 10px 10px 10px;min-width:50px"
              >
                <model-select
                  v-model="row.item.machineId"
                  :options="row.item.machineoption"
                ></model-select>
              </div>
            </template>

            <!-- end設備編號 -->
            <!-- 開始時間 -->
            <template v-slot:cell(startTime)="row">
              <input
                type="datetime-local"
                class="form-control"
                v-model="row.item.startTime"
                required
              />
            </template>

            <!-- 開始時間 -->
            <!-- 結束時間 -->
            <template v-slot:cell(endTime)="row">
              <input
                type="datetime-local"
                class="form-control"
                v-model="row.item.endTime"
                required
              />
            </template>

            <!-- 結束時間 -->
            <!-- 備註 -->
            <template v-slot:cell(remark)="row">
              <input class="form-control" v-model="row.item.remark" />
            </template>
            <!-- 備註 -->

            <template v-slot:row-details="row">
              <b-card>
                <div v-for="(value, key) in row.item.info" :key="key">
                  <b-row>
                    <b-col lg="2">{{ $t('product') }}: {{ value.productName }}</b-col>
                    <b-col lg="2">{{ $t('mold_cavity') }}: #{{ value.moldCavityNumber }}</b-col>
                    <b-col lg="2">{{ $t('mold_qty') }}: {{ value.qty }}</b-col>
                  </b-row>
                  <hr />
                </div>
              </b-card>
            </template>
          </b-table>
          <!-- <b-col class="text-center">
            <h2 style="color:red">{{ errormes }}</h2>
          </b-col>-->
          <hr />
          <!-- <div style=""></div> -->
        </mdb-modal-body>
        <mdb-modal-footer>
          <div style="color:red">{{ errormes }}</div>
          <h2 style="opacity:0">---------------</h2>
          <mdb-btn color="info" type="submit">{{ $t('to_schedule_submit') }}</mdb-btn>

          <mdb-btn color="0000" type="button" @click.native="toschedulemodalOEEplus = false">{{
            $t('close')
          }}</mdb-btn>
        </mdb-modal-footer>
      </form>
    </mdb-modal>
    <!-- 轉排程OEEplus -->
    <!-- OEE+轉排程DB衝突 -->
    <mdb-modal
      :show="toschedulemodalOEEpluserror"
      @close="toschedulemodalOEEpluserror = false"
      size="lg"
    >
      <mdb-modal-header>
        <mdb-modal-title>{{ $t('toschedule_oee_dberror') }}</mdb-modal-title>
      </mdb-modal-header>
      <mdb-modal-body>
        <b-table
          ref="selectableTable"
          show-empty
          bordered
          :hover="true"
          :items="toscheduletabledataOEEplusErrordata"
          :fields="toschedulefieldsOEEplusError"
          :filterIncludedFields="filterOn"
          :sort-by.sync="sortBy"
          sort-desc.sync="asc"
          :sort-direction="sortDirection"
          @filtered="onFiltered"
        >
          <template v-slot:cell(endTime)="row">
            {{ row.item.endTime }}
            <mdb-btn style="width: 0px;padding: 0.4rem 0px;" icon="trash-alt"></mdb-btn>
            <!-- 固定欄高 -->
          </template>
        </b-table>
      </mdb-modal-body>
      <mdb-modal-footer>
        <mdb-btn color="0000" type="button" @click.native="toschedulemodalOEEpluserror = false">{{
          $t('close')
        }}</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
    <!--end OEE+轉排程DB衝突 -->
    <!-- 製令匯入 -->
    <mdb-modal :show="importerror" @close="importerror = false">
      <mdb-modal-header>
        <mdb-modal-title
          >{{ $t('manufacturing_order_import') }}{{ $t('import_error_text') }}</mdb-modal-title
        >
      </mdb-modal-header>
      <mdb-modal-body>
        {{ importerrormes }}
        <b-table
          v-if="errortabledata.length != 0"
          responsive
          show-empty
          bordered
          :hover="true"
          :items="errortabledata"
          :fields="importerrortablefields"
        >
          <!-- <template v-slot:cell(endTime)="row">
            {{ row.item.endTime }}
            <mdb-btn style="width: 0px;padding: 0.4rem 0px;" icon="trash-alt"></mdb-btn>
            
          </template> -->
        </b-table>
      </mdb-modal-body>
      <mdb-modal-footer>
        <mdb-btn color="0000" type="button" @click.native="importerror = false">{{
          $t('close')
        }}</mdb-btn>
      </mdb-modal-footer>
    </mdb-modal>
    <!--end 製令匯入 -->
  </div>
</template>

<script>
// import XLSX from 'xlsx'
import {
  ManufacturingorderImportAPI,
  ManufacturingordermultideleteAPI,
  ManufacturingorderAPI,
  ManufacturetoToMold,
  ManufactureToSchedule,
  manufactureorderReportDonloadExcelAPI,
  GetMoldMachineOEEplusAPI
} from '@/plugins/produceapis.js'
import { mapState } from 'vuex'
import { ModelSelect } from 'vue-search-select'
import naturalCompare from 'string-natural-compare'
import { productSelectAPI, WorkShopAPI, gmachineSelectAPI } from '@/plugins/basicapis.js'
import { GetManufactureNumAPI, ScheduleOEEplusAPI } from '@/plugins/produceapis.js'

export default {
  props: ['manufacturingorderData', 'tabs', 'isbusyflag', 'workShopId', 'scearchTime'],
  watch: {
    workShopId: function(value) {
      this.workShopIdvalue = value
    },
    scearchTime: function(value) {
      this.scearchTimevalue = value
    },
    tabs: function(value) {
      this.tabvalue = value
      this.classification(this.alldata, this.tabvalue)
    },
    manufacturingorderData: function(newVal) {
      var temparray = JSON.parse(JSON.stringify(newVal))
      this.alldata = temparray
      this.classification(this.alldata, this.tabvalue)
    },
    isbusyflag: function(newVal) {
      this.isbusy = newVal
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
      Id: 0,
      name: '',
      number: '',
      cavityNumber: 0
    }
    var newmanufacturingorderobject = [] //新增用
    var moldobjectarray = []
    var manufacturingorderobject = {
      Id: 0, //製令id
      number: '', //製令編號
      customizeNumber: '', //自定義製令編號
      count: 1, //數量
      expectedTIme: 0, //預期時間完成
      actualTime: 0, //實際完成
      orderId: 0, //訂單
      orderNumber: '', //訂單編號
      orderSubId: 0, //訂單子項目
      status: 2, //狀態
      productId: null, //製品id
      priority: 0, //優先度(大優先)
      deadLine: 0, //完工期限
      classtype: 'newtype',
      remark: '' //備註
    }
    var manufacturingorderobjectnull = JSON.parse(JSON.stringify(manufacturingorderobject))

    return {
      toolboxshow: true, //toolbox顯示
      btndisable: false, //停用按鈕
      scearchTimevalue: 1, //時間範圍
      workShopIdvalue: -1, //廠區id
      errortabledata: [], //錯誤table
      importerrormes: '', //匯入錯誤訊息
      importerror: false, //匯入錯誤視窗
      page_first: 0, //第一條
      page_last: 0, //最後一筆
      page_total: 0, //總共筆數
      toscheduletabledataOEEplusErrordata: [], //OEE+轉排程DB衝突data
      errormes: '', //錯誤訊息
      MachineWorkshopIdArray: [], //設備廠區關聯
      toschedulemodalOEEplus: false, //OEEplus轉排程視窗
      toschedulemodalOEEpluserror: false, //OEEplus轉排程錯誤視窗
      version: '"OEE+"', //版本
      isbusy: true,
      newbtm: false, //新增
      editbtm: false, //編輯
      deletebtm: false, //刪除
      customize1: false, //自定義一
      customize2: false, //自定義二
      customize3: false, //自定義三
      addRowflag: false, //新增取得製令編號
      excelData: [], //匯出資料
      alldata: [], //排程全部資料
      tabvalue: '', //模式
      deleteitem: 0,
      deletemode: 0,
      scearchworkshop: 0,
      // errormes: '',
      checkcount: false,
      checkorderNumber: false,
      checkdeadLine: false,
      checkworkShopId: false,
      newmanufacturingorderobject,
      newsubmitnum: 0,
      workshopobject: [],
      workshopobject1: [], //搜尋
      selectmoldid: null,
      cavityNumbervalue: null,
      deletebundisable: true,
      moldobject,
      moldobjectarray,
      selected: [],
      moldselected: [],
      manufacturingorderobject,
      manufacturingorderobjectnull,
      operate: '',
      warning: false,
      modal: false,
      modal1: false,
      toschedulemodal: false,
      tabledata: [],
      toscheduletabledata: [],
      toscheduletabledataOEEplus: [],
      importerrortablefields: [
        {
          key: 'errortype',
          label: this.$t('import_error_data_type'), //錯誤類別
          sortDirection: 'desc',
          class: 'text-center',
          thClass: 'thstyle',
          tdClass: 'tdstyle',
          thStyle: 'min-width: 150px;width: 150px;'
        },
        {
          key: 'errorfield',
          label: this.$t('import_error_field'), //欄位
          sortDirection: 'desc',
          class: 'text-center',
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        }
      ],
      fields: [
        // {
        //   key: "numberserial",
        //   label: "序號",
        //   class: "moldnumberclass"
        // },
        {
          key: 'number',
          label: this.$t('manufacturingorder_number'), //製令編號
          sortable: true,
          sortDirection: 'desc',
          class: 'text-center',
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'customizeNumber',
          label: this.$t('manufacturingorder_customize_number'), //自定義製令編號
          sortable: true,
          sortDirection: 'desc',
          class: 'text-center',
          thClass: 'thstyle',
          tdClass: 'tdstyle',
          formatter: value => {
            if (value == '') {
              return '-'
            }
            return value
          }
        },
        {
          key: 'productNumber',
          label: this.$t('product_number'), //製品編號
          sortable: true,
          sortDirection: 'desc',
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'count',
          label: this.$t('number'), //數量
          sortable: true,
          sortDirection: 'desc',
          class: 'text-center',
          formatter: value => {
            if (value == 0) {
              return '-'
            }
            var c =
              value.toString().indexOf('.') !== -1
                ? value.toLocaleString()
                : value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
            return c
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },

        {
          key: 'deadLine',
          label: this.$t('manufacturingorder_deadline'), //完工期限
          sortable: true,
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'orderNumber',
          label: this.$t('manufacturingorder_order'), //訂單編號
          sortable: true,
          sortDirection: 'desc',
          class: 'text-center',
          thClass: 'thstyle',
          tdClass: 'tdstyle',
          formatter: value => {
            if (value == '') {
              return '-'
            }
            return value
          }
        },
        {
          key: 'workShopId',
          label: this.$t('workshop_machine'), //廠區
          sortable: true,
          sortDirection: 'desc',
          class: 'text-center',
          formatter: value => {
            var temp
            if (this.workshopobject.length != 0) {
              this.workshopobject.forEach(item => {
                if (value == item.value) {
                  temp = item.text
                }
              })
            }
            return temp
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'createdTimeshow',
          label: this.$t('created_time'), //創建時間
          sortable: true,
          sortDirection: 'desc',
          class: 'text-center',
          formatter: value => {
            return value
          },
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        },
        {
          key: 'remark',
          label: this.$t('remark'),
          sortDirection: 'desc',
          class: 'text-center',
          thClass: 'thstyle',
          tdClass: 'tdstyle remarkstyle'
        }, //備註
        {
          key: 'actions',
          label: this.$t('operating'),
          class: 'text-center',
          sortDirection: 'desc',
          thClass: 'thstyle',
          tdClass: 'tdstyle'
        } //操作
      ],
      toschedulefields: [
        {
          key: 'moldNumber',
          label: this.$t('to_schedule_mold'), //模具
          class: 'text-center',
          sortDirection: 'desc',
          formatter: value => {
            return value
          }
        },
        {
          key: 'qty',
          label: this.$t('to_schedule_qty'), //模次
          class: 'text-center',
          sortDirection: 'desc',
          formatter: value => {
            return value
          }
        },
        {
          key: 'materialName',
          label: this.$t('to_schedule_material'), //原料
          class: 'text-center',
          sortDirection: 'desc',
          formatter: value => {
            return value
          }
        },
        {
          key: 'workShopId',
          label: this.$t('to_schedule_workshop'), //廠區
          class: 'text-center',
          sortDirection: 'desc',
          formatter: value => {
            var temp
            if (this.workshopobject.length != 0) {
              this.workshopobject.forEach(item => {
                if (value == item.value) {
                  temp = item.text
                }
              })
            }
            return temp
          }
        },

        { key: 'actions', label: this.$t('operating'), class: 'text-center' } //操作
      ],
      toschedulefieldsOEEplus: [
        {
          key: 'moldNumber',
          label: this.$t('to_schedule_mold'), //模具
          class: 'text-center',
          sortDirection: 'desc',
          formatter: value => {
            return value
          }
        },
        {
          key: 'qty',
          label: this.$t('to_schedule_qty'), //模次
          class: 'text-center',
          sortDirection: 'desc',
          formatter: value => {
            return value
          }
        },
        {
          key: 'materialName',
          label: this.$t('to_schedule_material'), //原料
          class: 'text-center',
          sortDirection: 'desc',
          formatter: value => {
            return value
          }
        },
        {
          key: 'workShopId',
          label: this.$t('to_schedule_workshop'), //廠區
          class: 'text-center',
          thStyle: 'width:150px',
          sortDirection: 'desc',
          formatter: value => {
            var temp
            if (this.workshopobject.length != 0) {
              this.workshopobject.forEach(item => {
                if (value == item.value) {
                  temp = item.text
                }
              })
            }
            return temp
          }
        },
        {
          key: 'machine',
          label: this.$t('machine_number'), //設備
          class: 'text-center', //'selectclass',
          thStyle: 'min-width:150px',
          sortDirection: 'desc',
          formatter: value => {
            return value
          }
        },
        {
          key: 'startTime',
          label: this.$t('schedule_start_time'), //開始時間
          class: 'text-center',
          thStyle: 'width:150px',
          sortDirection: 'desc',
          formatter: value => {
            return value
          }
        },
        {
          key: 'endTime',
          label: this.$t('schedule_end_time'), //結束時間
          class: 'text-center',
          sortDirection: 'desc',
          formatter: value => {
            return value
          }
        },
        {
          key: 'remark',
          label: this.$t('remark'), //備註
          class: 'text-center',
          sortDirection: 'desc',
          thStyle: 'width:300px',
          formatter: value => {
            return value
          }
        },

        { key: 'actions', label: this.$t('operating'), class: 'text-center' } //操作
      ],
      toschedulefieldsOEEplusError: [
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
            return value
          }
        },
        {
          key: 'endTime',
          label: this.$t('schedule_end_time'), //結束時間
          class: 'text-center',
          thStyle: 'height:45px',
          formatter: value => {
            return value
          }
        }
      ],
      totalRows: 0,
      currentPage: 1,
      currentPage1: 1,
      perPage: 100,
      pageOptions: [20, 50, 100],
      sortBy: 'createdTimeshow', //'createdTimeshow',
      sortDesc: true,
      filter: null,
      filterOn: ['number', 'customizeNumber', 'productNumber', 'deadLine', 'orderNumber', 'remark'],

      infoModal: {
        id: 'info-modal',
        title: '',
        content: ''
      },
      priorityobject: [
        { text: '高', value: 2 },
        { text: '中', value: 1 },
        { text: '低', value: 0 }
      ],
      orderobject: [
        { text: '訂單三', value: 2 },
        { text: '訂單二', value: 1 },
        { text: '訂單一', value: 0 }
      ],
      productobject: [
        {
          text: this.$t('product_unselect'),
          value: null,
          disabled: true,
          selected: true
        }
      ],
      formdata: new FormData()
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
    //綁定監聽表格導入事件
    this.$refs.upload.addEventListener('change', e => {
      let formData = new FormData()
      formData.append('file', e.target.files[0])
      this.uploaddata(formData)
      this.$refs.upload.value = null
    })
  },

  created() {
    let language = localStorage.getItem('locale')
    if (language == 'English') {
      this.toolboxshow = false
    }
    this.iniright()
    this.getworkshop()
    this.getmachine()
  },
  methods: {
    //點選反白
    focus(event) {
      event.currentTarget.select()
    },
    //設定權限
    iniright() {
      this.version = localStorage.getItem('version')

      this.authority.forEach(item => {
        if (item.name == 'produce_manufacturingorder') {
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
    //匯出xlsx
    downExcel() {
      const th = [
        '製令編號', //'number',
        '製品編號', //'productNumber',
        '數量', //'count',
        '完工期限', //'deadLine',
        '訂單編號', //'orderNumber',
        '設備編號', //'machineNumber',
        '狀態' //'status'
      ]
      const filterVal = [
        'number',
        'productNumber',
        'count',
        'deadLine',
        'orderNumber',
        'machineNumber',
        'status'
      ]
      var tempanme =
        'IoM_Part_Export_' +
        this.timeStampToStringFunc(this.stringToTimestampFunc(new Date()), 'yyyymmdd')

      const data = this.excelData.map(v => filterVal.map(k => v[k]))
      const [fileName, fileType, sheetName] = [tempanme, 'xlsx', this.$t('manufacturingorder')]
      this.$toExcel({ th, data, fileName, fileType, sheetName })
    },

    classification(alldata) {
      this.excelData = []
      var temparray = []
      alldata.forEach(item => {
        this.setexcelData(item)
        temparray.push(item)
      })
      this.tabledata = temparray
      this.totalRows = temparray.length

      this.setfooternum() //設定頁數
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

    //設定匯出資料
    setexcelData(item) {
      var teampitem
      teampitem = JSON.parse(JSON.stringify(item))
      switch (teampitem.status) {
        case 1:
          teampitem.status = '已排程'
          break
        case 2:
          teampitem.status = '未排程'
          break
        case 3:
          teampitem.status = '已完成'
          break
        case 4:
          teampitem.status = '任務中'
          break
        case 5:
          teampitem.status = '已完成'
          break
        case 6:
          teampitem.status = '其他'
          break
      }
      this.excelData.push(teampitem)
    },
    // readExcel(e) {
    //   //表格导入
    //   var that = this
    //   const files = e.target.files
    //   if (files.length <= 0) {
    //     //如果没有文件名
    //     return false
    //   } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
    //     this.$Message.error('上传格式不正确，请上传xls或者xlsx格式')
    //     return false
    //   }

    //   const fileReader = new FileReader()
    //   fileReader.onload = ev => {
    //     try {
    //       const data = ev.target.result
    //       const workbook = XLSX.read(data, {
    //         type: 'binary'
    //       })
    //       console.log(typeof workbook)
    //       console.log(workbook)
    //       const wsname = workbook.SheetNames[0] //取第一张表
    //       const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]) //生成json表格内容
    //       this.uploadjson = ws
    //       this.uploaddatatobinary(this.uploadjson)
    //       that.outputs = [] //清空接收数据
    //       //编辑数据
    //       for (var i = 0; i < ws.length; i++) {
    //         var sheetData = {
    //           address: ws[i].addr,
    //           value: ws[i].value
    //         }
    //         that.outputs.push(sheetData)
    //       }
    //       this.$refs.upload.value = ''
    //     } catch (e) {
    //       return false
    //     }
    //   }
    //   fileReader.readAsBinaryString(files[0])
    // },
    // uploaddatatobinary(data) {
    //   console.log(data)
    // },
    //上傳檔案
    uploaddata(data) {
      ManufacturingorderImportAPI.post(data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(
        () => {
          this.$layer.msg(this.$t('scuccess'))
          this.toschedulemodalOEEplus = false
          // this.toschedulemodal = false
          // // 重載資料
          this.isbusy = true
          this.$emit('callparent', 1) //呼叫父元件
        },
        error => {
          this.dealerror(error.response.data)
          console.log(error.response)
        }
      )
    },
    //處理錯誤
    dealerror(data) {
      data.requiredErr = this.rowaddone(data.requiredErr)
      data.formatErr = this.rowaddone(data.formatErr)
      data.noMatchErr = this.rowaddone(data.noMatchErr)
      if (
        data.requiredErr.length != 0 ||
        data.formatErr.length != 0 ||
        data.noMatchErr.length != 0
      ) {
        this.importerrormes = '' //'輸入錯誤'
        let temperrortabledata = []

        if (data.requiredErr.length != 0) {
          temperrortabledata.push({
            errortype: this.$t('import_requiredErr'), //'必填錯誤',
            errorfield: this.errortotable(data.requiredErr)
          })
        }
        if (data.formatErr.length != 0) {
          temperrortabledata.push({
            errortype: this.$t('import_formatErr'), //'格式錯誤',
            errorfield: this.errortotable(data.formatErr)
          })
        }
        if (data.noMatchErr.length != 0) {
          temperrortabledata.push({
            errortype: this.$t('import_noMatchErr'), //'配對錯誤',
            errorfield: this.errortotable(data.noMatchErr)
          })
        }
        this.errortabledata = temperrortabledata
      } else {
        //其他錯誤
        this.errortabledata = []
        this.importerrormes = this.$t('import_error_type') + ' : ' + data.response
      }
      this.importerror = true //錯誤視窗
      console.log(data)
    },
    //錯誤處理成tabledata
    errortotable(data) {
      let temparray = ''
      temparray = data[0]
      data.forEach((item, index) => {
        if (index != 0) {
          temparray += ',' + item
        }
      })
      return temparray
    },
    //錯誤處理 row+1
    rowaddone(array) {
      let temparray = []
      if (array) {
        array.forEach(item => {
          temparray.push(item.substring(0, 1) + (parseInt(item.substring(1, item.length)) + 1))
        })
      }

      return temparray
    },
    //點擊匯入
    importfile() {
      document.getElementById('fileUpload').click()
    },
    //匯出
    exportfile() {
      //workShopId//廠區id
      //status//狀態 1已排程，2未排程3 已完成 4任務中 5已完成(中止) 6其他 7暫停
      //timeRange//時間範圍
      //condition//篩選條件
      let tempfilter = ''
      if (this.filter != null) {
        tempfilter = this.filter
      }
      this.btndisable = true
      manufactureorderReportDonloadExcelAPI({
        headers: {
          workShopId: this.workShopIdvalue, //廠區id
          status: 2, //狀態
          timeRange: this.scearchTimevalue, //時間範圍
          keyWord: encodeURIComponent(tempfilter) //篩選條件
        },
        responseType: 'blob' //設定格式為blob
      }).then(
        res => {
          const url = URL.createObjectURL(
            new Blob([res.data], {
              type: 'application/vnd.ms-excel'
            })
          )
          const link = document.createElement('a')

          let filename = res.headers['content-disposition'].split('filename=')[1]

          link.href = url
          link.download = filename
          document.body.appendChild(link)
          link.click()
          this.btndisable = false
        },
        error => {
          console.log(error)
          this.$layer.msg(this.$t('report_error'))
          this.btndisable = false
        }
      )
    },
    //下載範例
    downloadsample() {
      let link = document.createElement('a')
      link.download = 'IoM_Manufacturing_Order_Template' //製令範例
      link.style.display = 'none'
      link.href = '/excelfile/IoM_Manufacturing_Order_Template.xlsx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    //選擇廠區重載
    scearchworkshopchange() {
      // 重載資料
      this.isbusy = true
      this.$emit('callparent', 1) //呼叫父元件
    },
    // setcheck(value) {
    //   if (this.newmanufacturingorderobject.length != 0) {
    //     console.log(value)
    //     // switch (value) {
    //     //   case 'count':
    //     //     for (i = 1; i < this.newmanufacturingorderobject.length; i++) {
    //     //       this.newmanufacturingorderobject[i].count = this.newmanufacturingorderobject[0].count
    //     //     }
    //     //     break
    //     //   case 'orderNumber':
    //     //     for (i = 1; i < this.newmanufacturingorderobject.length; i++) {
    //     //       this.newmanufacturingorderobject[i].orderNumber = this.newmanufacturingorderobject[0].orderNumber
    //     //     }
    //     //     break
    //     //   case 'deadLine':
    //     //     for (i = 1; i < this.newmanufacturingorderobject.length; i++) {
    //     //       this.newmanufacturingorderobject[i].deadLine = this.newmanufacturingorderobject[0].deadLine
    //     //     }
    //     //     break
    //     //   case 'workShopId':
    //     //     for (i = 1; i < this.newmanufacturingorderobject.length; i++) {
    //     //       this.newmanufacturingorderobject[i].workShopId = this.newmanufacturingorderobject[0].workShopId
    //     //     }
    //     //     break
    //     // }
    //   }

    //   console.log(value)
    //   console.log('********')
    // },
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
            res.data.forEach(item => {
              this.MachineWorkshopIdArray[item.machineNumber] = { workShopId: item.workShopId }
            })
          }
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //取得廠區
    getworkshop(num) {
      var access_token_val = this.$cookies.get('access_token')
      WorkShopAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          this.workshopobject = []
          this.workshopobject1 = []
          this.workshopobject1.push({
            text: this.$t('all'),
            value: 0
          })
          if (res.data != null) {
            res.data.forEach(item => {
              this.workshopobject.push({ text: item.name, value: item.id })
              this.workshopobject1.push({ text: item.name, value: item.id })
            })
          }
          //新增
          if (num == 0) {
            this.modal = true //顯示視窗
          } else if (num == 1) {
            //編輯
            this.modal1 = true //顯示視窗
          }
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //modal背景點擊不關閉
    closemodal(value) {
      if (value == undefined) {
        this.modal = false
        this.modal1 = false
        this.toschedulemodalOEEplus = false
        this.toschedulemodal = false
        this.toschedulemodalOEEpluserror = false
      }
    },
    //排序模穴
    sortinfo(object) {
      if (object.length > 1) {
        object = object.sort(function(a, b) {
          return a.moldCavityNumber > b.moldCavityNumber ? 1 : -1
        })
      }
      return object
    },
    //檢查版本
    checkver() {
      if (this.version == '"3"') {
        this.toscheduleIPS()
      } else {
        this.toscheduleOEEplus()
      }
    },
    //OEE+轉排程
    toscheduleOEEplus() {
      this.errormes = ''
      var idsarray = []
      this.selected.forEach(item => {
        idsarray.push(item.id)
      }) //取得ids
      idsarray = '[' + idsarray.toString() + ']'
      var access_token_val = this.$cookies.get('access_token')
      ManufacturetoToMold({
        headers: {
          access_token: access_token_val,
          ids: idsarray
        }
      }).then(
        res => {
          if (res.data != null) {
            var moldIdArraystring = '['
            var moldIdArray = []
            res.data.forEach(item => {
              item.info = this.sortinfo(item.info)
              moldIdArraystring += item.moldId + ','
              moldIdArray.push({
                moldNumber: item.moldNumber,
                moldId: item.moldId,
                workShopId: item.workShopId,
                option: []
              })
            })
            moldIdArraystring = moldIdArraystring.substring(0, moldIdArraystring.length - 1) + ']'
            this.getmoldmachine(moldIdArraystring, moldIdArray, res.data) //根據moldId取得模具關聯設備山選by廠區
          }
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //根據moldId取得模具關聯設備
    getmoldmachine(moldisArraystring, moldIdArray, data) {
      var access_token_val = this.$cookies.get('access_token')
      GetMoldMachineOEEplusAPI({
        headers: {
          access_token: access_token_val,
          ids: moldisArraystring
        }
      }).then(
        res => {
          if (res.data != null) {
            res.data.forEach(item => {
              for (var i = 0; i < moldIdArray.length; i++) {
                if (item.moldNumber == moldIdArray[i].moldNumber) {
                  if (
                    this.MachineWorkshopIdArray[item.machineNumber].workShopId ==
                    moldIdArray[i].workShopId //  符合廠區在塞
                  ) {
                    moldIdArray[i].option.push({
                      value: item.machineId,
                      text: item.machineNumber
                    })
                  }
                  // break
                }
              }
            })
          }
          for (var i = 0; i < moldIdArray.length; i++) {
            if (moldIdArray[i].option != null || moldIdArray[i].option != []) {
              moldIdArray[i].option.sort((a, b) => naturalCompare(a.text, b.text))
            }
          }

          for (var i = 0; i < data.length; i++) {
            data[i].machineoption = moldIdArray[i].option
            data[i].machineId = 0
            data[i].index = i
            data[i].startTime = this.settime()
            data[i].endTime = this.settime('endtime')
          }
          this.toscheduletabledataOEEplus = JSON.parse(JSON.stringify(data))
          if (this.toscheduletabledataOEEplus != null) {
            this.toscheduletabledataOEEplus.forEach((item, index) => {
              item.classtype = 'newtype'
              item.serialNumber = String(index)
              item._rowVariant = '' //改變整列底色
            })
          }

          this.toschedulemodalOEEplus = true
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
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

    //IPS轉排程合併模具
    toscheduleIPS() {
      this.errormes = ''
      var idsarray = []
      this.selected.forEach(item => {
        idsarray.push(item.id)
      }) //取得ids
      idsarray = '[' + idsarray.toString() + ']'
      var access_token_val = this.$cookies.get('access_token')
      ManufacturetoToMold({
        headers: {
          access_token: access_token_val,
          ids: idsarray
        }
      }).then(
        res => {
          res.data.forEach(item => {
            item.info = this.sortinfo(item.info)
          })

          this.toscheduletabledata = JSON.parse(JSON.stringify(res.data))
          this.toschedulemodal = true
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
    manufacturingorderwindow(item, index, mode) {
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

    //編輯
    editwindow(item) {
      this.manufacturingorderobject = JSON.parse(JSON.stringify(item))
      this.manufacturingorderobject.deadLine = item.deadLine
      this.getproduct(item)
    },
    //新增
    newwindow() {
      this.checkcount = false
      this.checkorderNumber = false
      this.checkdeadLine = false
      this.checkworkShopId = false
      this.newmanufacturingorderobject = []
      var access_token_val = this.$cookies.get('access_token')
      //取得製品編號
      GetManufactureNumAPI({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          var tempobject = JSON.parse(JSON.stringify(this.manufacturingorderobjectnull))
          tempobject.number = res.data.number
          this.newmanufacturingorderobject.push(tempobject)
          this.getproduct()
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )

      // this.newmanufacturingorderobject.push(
      //   JSON.parse(JSON.stringify(this.manufacturingorderobjectnull))
      // )
      /*
         this.addRowflag = true //停用"新增一筆"按鈕
      var access_token_val = this.$cookies.get('access_token')
      //取得製品編號
      GetManufactureNumAPI({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          var tempobject = JSON.parse(JSON.stringify(this.manufacturingorderobjectnull))
          tempobject.number = res.data.number
          this.newmanufacturingorderobject.push(tempobject)
          this.addRowflag = false //啟用"新增一筆"按鈕
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
          this.addRowflag = false
        }
      )
      */
    },
    //新增新增
    addRow() {
      this.addRowflag = true //停用"新增一筆"按鈕
      var access_token_val = this.$cookies.get('access_token')
      //取得製品編號
      GetManufactureNumAPI({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          var tempobject = JSON.parse(JSON.stringify(this.manufacturingorderobjectnull))
          tempobject.number = res.data.number
          this.newmanufacturingorderobject.push(tempobject)
          this.addRowflag = false //啟用"新增一筆"按鈕
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
          this.addRowflag = false
        }
      )
      // this.newmanufacturingorderobject.push(
      //   JSON.parse(JSON.stringify(this.manufacturingorderobjectnull))
      // )
    },
    // 新增刪除
    deleteRow(index) {
      // console.log(index)
      // console.log(this.newmanufacturingorderobject[index])

      // this.newmanufacturingorderobject[index] = this.cleardata(this.newmanufacturingorderobject[index])
      // // this.newmanufacturingorderobject[index] = JSON.parse(JSON.stringify(this.manufacturingorderobjectnull))
      this.newmanufacturingorderobject.splice(index, 1)
    },
    // 刪除製令確認
    deleteToScheduleRow(data) {
      if (this.toscheduletabledataOEEplus != null) {
        this.toscheduletabledataOEEplus.forEach((item, index) => {
          if (data == item) {
            this.toscheduletabledataOEEplus.splice(index, 1)
          }
        })
      }
    },
    // cleardata(data) {
    //   data.Id = 0 //製令id
    //   data.number = '' //製令編號
    //   data.count = 0 //數量
    //   data.expectedTIme = 0 //預期時間完成
    //   data.actualTime = 0 //實際完成
    //   data.orderId = 0 //訂單
    //   data.orderNumber = '' //訂單編號
    //   data.orderSubId = 0 //訂單子項目
    //   data.status = 2 //狀態
    //   data.productId = null //製品id
    //   data.priority = 0 //優先度(大優先)
    //   data.deadLine = 0 //完工期限
    //   data.workShopId = null

    //   return data
    // },
    //取得製品
    getproduct(item) {
      this.productobject = [] //清空製品選項
      this.productobject = [
        {
          text: this.$t('product_unselect'), //'未選擇製品',
          value: null,
          disabled: true,
          selected: true
        }
      ]
      var access_token_val = this.$cookies.get('access_token')
      productSelectAPI({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          if (res.data != null) {
            res.data.sort((a, b) => naturalCompare(a.number, b.number))
          }
          res.data.forEach(item => {
            this.productobject.push({
              text: item.number,
              value: item.id
            })
          })
          if (item == undefined) {
            //新增
            this.selectmoldid = null //設定模具v-mold
            this.getworkshop(0)
          } else {
            //編輯
            this.productId = item.id //設定模具v-mold
            this.getworkshop(1)
          }
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    checkisnull(value) {
      if (value == '') {
        return 0
      } else {
        return parseFloat(value)
      }
    },
    datetotimestamp(value) {
      if (value != 0) {
        return new Date(value).getTime()
      } else {
        return 0
      }
    },
    dealdata(item) {
      item.Id = this.checkisnull(item.Id)
      item.workShopId = this.checkisnull(item.workShopId)
      item.count = this.checkisnull(item.count)
      item.orderId = this.checkisnull(item.orderId)
      item.orderSubId = this.checkisnull(item.orderSubId)
      item.productId = this.checkisnull(item.productId)
      item.deadLine = this.datetotimestamp(item.deadLine)
      // item.actualTime = this.datetotimestamp(item.actualTime)
      // this.manufacturingorderobject.expectedTIme = this.checkisnull(
      //   this.manufacturingorderobject.expectedTIme
      // );
      return item
    },
    //OEE++送出確認轉排程模具
    moldtoscheduleOEEplusfunc() {
      if (this.toscheduletabledataOEEplus.length == 0) {
        this.errormes = this.$t('no_mold_selected') //'未選擇模具'
      } else {
        var flag = 0
        this.toscheduletabledataOEEplus.forEach(item => {
          if (item.machineId == 0) {
            item.classtype = 'newerrortype'
            flag++
          } else {
            item.classtype = 'newtype'
          }
          // item.startTime = this.stringToTimestampFunc(new Date(item.startTime))
          // item.endTime = this.stringToTimestampFunc(new Date(item.endTime))
        })
        if (flag != 0) {
          var temparray = JSON.parse(JSON.stringify(this.toscheduletabledataOEEplus))
          this.toscheduletabledataOEEplus = []
          this.toscheduletabledataOEEplus = JSON.parse(JSON.stringify(temparray))
        } else {
          var timeflag = false
          this.toscheduletabledataOEEplus.forEach(item => {
            item.startTime = this.stringToTimestampFunc(new Date(item.startTime))
            item.endTime = this.stringToTimestampFunc(new Date(item.endTime))
            if (item.startTime > item.endTime) {
              //檢查開始時間不得大於結束時間
              timeflag = true
            }
          })
          if (timeflag) {
            //開始時間大於結束時間
            this.dealbacktime()
            this.errormes = this.$t('task_time_error')
          } else {
            //時間無誤，送出
            var access_token_val = this.$cookies.get('access_token')
            ScheduleOEEplusAPI.post(JSON.stringify(this.toscheduletabledataOEEplus), {
              headers: {
                access_token: access_token_val
              }
            }).then(
              () => {
                this.$layer.msg(this.$t('scuccess'))
                this.toschedulemodalOEEplus = false
                // this.toschedulemodal = false
                // // 重載資料
                this.isbusy = true
                this.$emit('callparent', 1) //呼叫父元件
              },
              error => {
                this.dealbacktime()
                this.oeeplusToScheduleError(error.response.data)
                console.log(error.response)
                // if (
                //   error.response.data.response ==
                //   'Base on the time range, mold or machine is overlapping in DB'
                // ) {
                //   this.errormes = this.$t('to_schedule_error1') //'與現有排程時間衝突'
                // } else if (
                //   error.response.data.response ==
                //   'Base on the time range, mold or machine is overlapping'
                // ) {
                //   this.errormes = this.$t('to_schedule_error2') //'設備或模具時間衝突'
                // }
              }
            )
          }
        }
      }
    },
    oeeplusToScheduleError(errordata) {
      if (errordata.selfConflicts != null) {
        //自身衝突改變底色
        errordata.selfConflicts.forEach(item => {
          this.toscheduletabledataOEEplus[Number(item)]._rowVariant = 'danger'
        })
        //跟DB衝突顯示視窗
        if (errordata.errorArray != null) {
          errordata.errorArray.forEach(item => {
            item.startTime = this.timeStampToStringFunc(item.startTime, 'yyyy-mm-dd hh:mm')
            item.endTime = this.timeStampToStringFunc(item.endTime, 'yyyy-mm-dd hh:mm')
          })
          this.toscheduletabledataOEEplusErrordata = errordata.errorArray
          this.toschedulemodalOEEpluserror = true
        }
      }
      //非自身衝突 or DB衝突，直接顯示錯誤
      if (errordata.selfConflicts == null && errordata.errorArray == null) {
        this.errormes = errordata.response
      }
    },
    //時間格式處理回input
    dealbacktime() {
      this.toscheduletabledataOEEplus.forEach(item => {
        item.startTime = this.timeStampToStringFunc(item.startTime, 'yyyy-mm-ddThh:mm')
        item.endTime = this.timeStampToStringFunc(item.endTime, 'yyyy-mm-ddThh:mm') // this.stringToTimestampFunc(new Date(item.endTime))
      })
    },
    //送出確認轉排程模具
    moldtoschedulefunc() {
      if (this.moldselected.length == 0) {
        this.errormes = this.$t('no_mold_selected') //'未選擇模具'
      } else {
        var access_token_val = this.$cookies.get('access_token')
        ManufactureToSchedule(JSON.stringify(this.moldselected), {
          headers: {
            access_token: access_token_val
          }
        }).then(
          () => {
            this.$layer.msg(this.$t('scuccess'))
            this.toschedulemodal = false
            // 重載資料
            this.isbusy = true
            this.$emit('callparent', 1) //呼叫父元件
          },
          error => {
            console.log(error.response)
            this.$layer.msg(this.$t('fail') + error.response.data.response)
            if (error.response.data.response == 'machine no work shop') {
              this.errormes = this.$t('machine_no_workshop') //'設備無廠區'
            } else if (error.response.data.response == 'can not schedule') {
              this.errormes = this.$t('can_not_schedule') //'無法排程(無人員排班)'
            } else {
              this.errormes = this.$t('mold_no_machine') //'模具無可用設備'
            }
            // this.modal = false;
          }
        )
      }
    },
    //送出新增
    submitfunc1() {
      var tempfalg = 0
      this.newmanufacturingorderobject.forEach((item, index) => {
        this.newmanufacturingorderobject[index].classtype = 'newtype'
        if (item.productId == null) {
          this.newmanufacturingorderobject[index].classtype = 'newerrortype'
          tempfalg++
        }
      })
      if (tempfalg == 0) {
        //製品編號都有輸入
        if (this.newmanufacturingorderobject.length != 0) {
          this.newsubmitnum = this.newmanufacturingorderobject.length
          this.newmanufacturingorderobject.forEach(item => {
            this.submitnewfunc(item)
          })
        } else {
          this.modal = false
        }
      }
    },
    //新增送出ajax
    submitnewfunc(item) {
      item = this.dealdata(item)
      var access_token_val = this.$cookies.get('access_token')
      ManufacturingorderAPI.post(JSON.stringify(item), {
        headers: {
          access_token: access_token_val
        }
      }).then(
        () => {
          // this.$layer.msg(this.$t('scuccess'))
          this.newsubmitnum--
          if (this.newsubmitnum == 0) {
            this.modal = false
            // 重載資料
            this.isbusy = true
            this.$emit('callparent', 1) //呼叫父元件
          }
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
          this.newsubmitnum--
          // this.modal1 = false
        }
      )
    },
    // 送出編輯製令
    submitfunc() {
      this.manufacturingorderobject = this.dealdata(this.manufacturingorderobject)
      var access_token_val = this.$cookies.get('access_token')
      ManufacturingorderAPI.put(JSON.stringify(this.manufacturingorderobject), {
        headers: {
          access_token: access_token_val
        }
      }).then(
        () => {
          this.$layer.msg(this.$t('scuccess'))
          this.modal1 = false
          // 重載資料
          this.isbusy = true
          this.$emit('callparent', 1) //呼叫父元件
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
          this.modal1 = false
        }
      )
    },
    // ManufacturingordermultideleteAPI
    // 刪除
    deletemold() {
      var access_token_val = this.$cookies.get('access_token')
      if (this.deletemode == 1) {
        ManufacturingordermultideleteAPI.delete({
          headers: {
            access_token: 'access_token_val',
            ids: this.selectedArrayToString(this.selected)
          }
        }).then(
          () => {
            this.$layer.msg(this.$t('scuccess'))
            this.modal = false
            // 重載資料
            this.isbusy = true
            this.$emit('callparent', 1) //呼叫父元件
          },
          error => {
            console.log(error.response)
            this.$layer.msg(this.$t('fail') + error.response.data.response)
            this.modal = false
          }
        )
      } else {
        ManufacturingorderAPI.delete({
          headers: {
            access_token: access_token_val,
            id: this.deleteitem
          }
        }).then(
          () => {
            // 重載資料
            this.isbusy = true
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
    //製令複選
    onRowSelected(items) {
      this.selected = items
      this.deletebundisable = false
    },
    //模具複選
    moldonRowSelected(items) {
      this.moldselected = items
      this.deletebundisable = false
    },
    selectAllRows() {
      this.$refs.selectableTable.selectAllRows()
    },
    clearSelected() {
      this.$refs.selectableTable.clearSelected()
    }
  }
}
</script>
<style>
.ui.selection.dropdown > .text {
  display: block;
}
.manufacturingorderpctableclass {
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
  border-color: #f4f4f4;
  font-size: 14px;
  font-weight: bold;
  height: 39px;
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  font-family: 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
/* .thstyle {
  font-size: 14px;
  font-weight: bold;
  height: 39px;
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  font-family: 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;
} */
.text-center.tdstyle {
  border: 1px solid #f4f4f4;
  font-size: 14px;
  font-weight: 400;
  height: 39px;
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  font-family: 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
/* .tdstyle {
  font-size: 14px;
  font-weight: 400;
  height: 39px;
  font-family: 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;
} */

.selectclass {
  padding: 0px !important;
}
.newerrortype {
  background-color: #ffcccc;
}
/* .menu.visible {
  position: absolute !important;

}
.menu.hidden {
  position: absolute !important;
  z-index: 99999 !important;
} */
.othersdisplayfalse {
  display: none;
}
</style>
<style scoped>
.showclass {
  display: none;
}
.input-group-text.new {
  text-overflow: ellipsis !important;
  white-space: nowrap;
  overflow: hidden;
  width: 100% !important;
  display: block;
}

/* .input-group-text.new ::after .tooltip1 {
  display: none;
} */
.tooltip1 {
  top: -45px;
  right: -15px;
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

.input-group-text {
  word-wrap: break-word !important;
  white-space: normal;
}
.newbackground {
  background-color: white;
}
.errorbackground {
  background-color: chartreuse;
}
.ui.selection.dropdown {
  min-height: 2.71428571em;
  border: 0px;
}
.input-group.test {
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
}
.mb-3.md-form {
  margin-top: 0;
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
  padding-top: 0 !important;
  padding-bottom: 0rem !important;
}
.tab-content {
  padding-top: 0;
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
