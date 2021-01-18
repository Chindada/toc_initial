<template>
  <div class="white-skin" style="z-index:1100">
    <mdb-side-nav
      :OpenedFromOutside.sync="toggle"
      mask="strong"
      sideNavClass
      ref="sideNav"
      fixed
      waves
      darkWaves
      to="/dashboard/dashboardworkshop"
      :isCollapsed="collapsed"
    >
      <li>
        <div class="logo-wrapper waves-dark" style="height:90%">
          <!-- <router-link :to="to" @click.native="logoclick" style="height:90%;"> -->
          <img
            @click="logoclick"
            :src="companylogo"
            class="img-fluid"
            style="padding-top:3%;padding-bottom:3%;cursor: pointer;"
          />
          <!-- </router-link> -->
        </div>
      </li>
      <li>
        <mdb-side-nav-nav>
          <!-- 功能簡介 -->
          <!-- <mdb-side-nav-item
            header
            @click.native="toggle=false"
            icon="fa fa-book"
            to="/home"
          >{{$t('introduction')}}</mdb-side-nav-item>-->
          <!-- 看板管理 -->
          <mdb-side-nav-cat
            v-if="dashboard"
            v-bind:name="$t('dashboard')"
            icon="far fa-fw fa-desktop "
          >
            <!-- 看板管理_客製化看版1 -->
            <!-- <mdb-side-nav-item
              v-if="dashboard_workshop_custom1"
              @click.native="toggle = false"
              icon="far fa-fw fa-tachometer-alt"
              to="/dashboard/dashboardworkshopCustom1"
              :title="this.$t('dashboard_workshop')"
              >{{ $t('dashboard_workshop') }}</mdb-side-nav-item
            > -->
            <!-- 看板管理_即時看版一 -->
            <mdb-side-nav-item
              v-if="dashboard_workshop"
              @click.native="toggle = false"
              icon="far fa-fw fa-tachometer-alt"
              to="/dashboard/dashboardworkshop"
              :title="this.$t('dashboard_workshop')"
              >{{ $t('dashboard_workshop') }}</mdb-side-nav-item
            >
            <!-- 看板管理_即時看版二 -->
            <mdb-side-nav-item
              v-if="dashboard_workshop2"
              @click.native="toggle = false"
              icon="far fa-fw fa-tachometer-alt"
              to="/dashboard/dashboardworkshop2"
              :title="this.$t('dashboard_workshop2')"
              >{{ $t('dashboard_workshop2') }}</mdb-side-nav-item
            >
            <!-- 看板管理_即時看版三 -->
            <mdb-side-nav-item
              v-if="dashboard_workshop3"
              @click.native="toggle = false"
              icon="far fa-fw fa-tachometer-alt"
              to="/dashboard/dashboardworkshop3"
              :title="this.$t('dashboard_workshop3')"
              >{{ $t('dashboard_workshop3') }}</mdb-side-nav-item
            >
            <!-- 看板管理_單站看版 -->
            <mdb-side-nav-item
              v-if="dashboard_station"
              @click.native="toggle = false"
              icon="far fa-fw fa-laptop"
              to="/dashboard/dashboardstation"
              :title="this.$t('dashboard_station')"
              >{{ $t('dashboard_station') }}</mdb-side-nav-item
            >
            <!-- 看板管理_遠端看板 -->
            <mdb-side-nav-item
              v-if="dashboard_remote"
              @click.native="toggle = false"
              icon="far fa-fw fa-donate"
              to="/dashboard/screenprojection"
              :title="this.$t('remote_dashboard_setting')"
              >{{ $t('remote_dashboard_setting') }}</mdb-side-nav-item
            >
            <!-- 看板管理_推播設定 -->
            <mdb-side-nav-item
              v-if="dashboard_broadcast_setting"
              @click.native="toggle = false"
              icon="far fa-fw fa-smile"
              to="/dashboard/broadcastsetting"
              :title="this.$t('remote_dashboard_setting')"
              >{{ $t('broadcast_setting') }}</mdb-side-nav-item
            >
            <!-- 看板管理_推播列表 -->
            <mdb-side-nav-item
              v-if="dashboard_broadcast_list"
              @click.native="toggle = false"
              icon="far fa-fw fa-video"
              to="/dashboard/broadcastlist"
              :title="this.$t('remote_dashboard_setting')"
              >{{ $t('broadcast_list') }}</mdb-side-nav-item
            >
          </mdb-side-nav-cat>
          <!--生產管理 -->
          <mdb-side-nav-cat
            v-if="produce"
            v-bind:name="$t('produce')"
            icon="far fa-fw fa-chalkboard-teacher"
          >
            <!-- 製令管理 -->
            <mdb-side-nav-item
              v-if="produce_manufacturingorder"
              @click.native="toggle = false"
              icon="far fa-fw fa-sticky-note"
              to="/produce/manufacturingorder"
              :title="this.$t('produce_manufacturingorder')"
              >{{ $t('produce_manufacturingorder') }}</mdb-side-nav-item
            >
            <!-- 排程管理 -->
            <mdb-side-nav-item
              v-if="produce_schedule"
              @click.native="toggle = false"
              icon="far fa-fw fa-calendar-alt"
              to="/produce/schedule"
              :title="this.$t('produce_schedule')"
              >{{ $t('produce_schedule') }}</mdb-side-nav-item
            >
            <!-- 任務管理 -->
            <mdb-side-nav-item
              v-if="produce_task"
              @click.native="toggle = false"
              icon="far fa-fw fa-tasks"
              to="/produce/task"
              :title="this.$t('produce_task')"
              >{{ $t('produce_task') }}</mdb-side-nav-item
            >
            <!-- 品檢管理 -->
            <mdb-side-nav-item
              v-if="produce_quality"
              @click.native="toggle = false"
              icon="far fa-fw fa-microscope"
              to="/produce/quality"
              :title="this.$t('produce_quality')"
              >{{ $t('produce_quality') }}</mdb-side-nav-item
            >
            <!-- 入庫管理 -->
            <mdb-side-nav-item
              v-if="produce_storage"
              @click.native="toggle = false"
              icon="far fa-fw fa-warehouse"
              to="/produce/storage"
              :title="this.$t('produce_storage')"
              >{{ $t('produce_storage') }}</mdb-side-nav-item
            >
          </mdb-side-nav-cat>

          <!-- 製品管理 -->
          <mdb-side-nav-item
            v-if="basicsetting_product"
            @click.native="toggle = false"
            icon="far fa-fw fa-archive "
            to="/basicsetting/product"
            :title="this.$t('basicsetting_product')"
            >{{ $t('basicsetting_product') }}</mdb-side-nav-item
          >

          <!-- 模具管理 -->
          <mdb-side-nav-item
            v-if="basicsetting_mold"
            @click.native="toggle = false"
            icon="far fa-fw fa-inbox "
            to="/basicsetting/mold"
            :title="this.$t('basicsetting_mold')"
            >{{ $t('basicsetting_mold') }}</mdb-side-nav-item
          >
          <!-- 原料管理 -->
          <mdb-side-nav-item
            v-if="basicsetting_material"
            @click.native="toggle = false"
            icon="far fa-fw fa-snowplow"
            to="/basicsetting/material"
            :title="this.$t('basicsetting_material')"
            >{{ $t('basicsetting_material') }}</mdb-side-nav-item
          >
          <!-- 設備管理 -->
          <mdb-side-nav-item
            v-if="basicsetting_machine"
            @click.native="toggle = false"
            icon="far fa-fw fa-flask "
            to="/basicsetting/machine"
            :title="this.$t('basicsetting_machine')"
            >{{ $t('basicsetting_machine') }}</mdb-side-nav-item
          >

          <!-- 人員管理 -->
          <mdb-side-nav-item
            v-if="basicsetting_employee"
            @click.native="toggle = false"
            icon="far fa-fw fa-users "
            to="/basicsetting/employee"
            :title="this.$t('basicsetting_employee')"
            >{{ $t('basicsetting_employee') }}</mdb-side-nav-item
          >
          <!-- 廠區管理 -->
          <mdb-side-nav-item
            v-if="basicsetting_workshop"
            @click.native="toggle = false"
            icon="far fa-fw fa-industry "
            to="/basicsetting/workshop"
            :title="this.$t('basicsetting_workshop')"
            >{{ $t('basicsetting_workshop') }}</mdb-side-nav-item
          >
          <!-- 夥伴管理 -->
          <!-- <mdb-side-nav-item
            v-if="basicsetting_company"
            @click.native="toggle = false"
            icon="industry "
            to="/basicsetting/company"
            :title="this.$t('basicsetting_company')"
            >{{ $t('basicsetting_company') }}</mdb-side-nav-item
          > -->

          <!-- 報表 -->
          <!-- 報表_報表設定-->
          <!-- <mdb-side-nav-cat v-if="report" v-bind:name="$t('report')" icon="file-alt ">
          
            <mdb-side-nav-item
              v-if="report_setting"
              @click.native="toggle = false"
              icon="fa fa-cloud"
              to="/report/setting"
              :title="this.$t('report_setting')"
              >{{ $t('report_setting') }}</mdb-side-nav-item
            >
          </mdb-side-nav-cat>-->

          <!-- 分析 -->
          <!-- <mdb-side-nav-cat v-if="analysis" v-bind:name="$t('analysis')" icon="file-alt "> -->
          <!-- 分析_依廠區 far fa-fw fa-industry -->
          <mdb-side-nav-cat
            v-if="analysis_group"
            v-bind:name="$t('analysis_group')"
            icon="far fa-fw fa-cart-plus"
          >
            <!-- 分析_依廠區-稼動分析 -->
            <mdb-side-nav-item
              v-if="analysis_group"
              @click.native="toggle = false"
              to="/analyzefactory/shoot"
              :title="this.$t('analysis_shoot')"
              >{{ $t('analysis_shoot') }}</mdb-side-nav-item
            >
            <!-- 分析_依廠區-歷程分析 -->
            <mdb-side-nav-item
              v-if="analysis_group"
              @click.native="toggle = false"
              to="/analyzefactory/course"
              :title="this.$t('analysis_course')"
              >{{ $t('analysis_course') }}</mdb-side-nav-item
            >
            <!-- 分析_依廠區-總產量分析 -->
            <mdb-side-nav-item
              v-if="analysis_group"
              @click.native="toggle = false"
              to="/analyzefactory/totalyield"
              :title="this.$t('analysis_totalyield')"
              >{{ $t('analysis_totalyield') }}</mdb-side-nav-item
            >
            <!-- 分析_依廠區-工時產量 -->
            <mdb-side-nav-item
              v-if="analysis_group"
              @click.native="toggle = false"
              to="/analyzefactory/workhryield"
              :title="this.$t('analysis_workhryield')"
              >{{ $t('analysis_workhryield') }}</mdb-side-nav-item
            >
          </mdb-side-nav-cat>
          <!-- 分析_依設備 -->
          <mdb-side-nav-cat
            v-bind:name="$t('analysis_machine')"
            v-if="analysis_machine"
            icon="far fa-fw fa-chart-area"
          >
            <!-- 分析_依設備-工時產量分析 -->
            <mdb-side-nav-item
              v-if="analysis_machine"
              @click.native="toggle = false"
              to="/analyzemachine/workhryield"
              :title="this.$t('analysis_workhryield')"
              >{{ $t('analysis_workhryield') }}</mdb-side-nav-item
            >
            <!-- 分析_依設備-稱生產效率分析 -->
            <mdb-side-nav-item
              v-if="analysis_machine"
              @click.native="toggle = false"
              to="/analyzemachine/productivity"
              :title="this.$t('analysis_productivity')"
              >{{ $t('analysis_productivity') }}</mdb-side-nav-item
            >
          </mdb-side-nav-cat>
          <!-- 分析_依製品 -->
          <mdb-side-nav-cat
            v-if="analysis_part"
            v-bind:name="$t('analysis_part')"
            icon="far fa-fw fa-chart-bar"
          >
            <!-- 分析_依製品-工時產量分析 -->
            <mdb-side-nav-item
              v-if="analysis_part"
              @click.native="toggle = false"
              to="/analyzepart/workhryield"
              :title="this.$t('analysis_workhryield')"
              >{{ $t('analysis_workhryield') }}</mdb-side-nav-item
            >
            <!-- 分析_依製品-生產效率分析 -->
            <mdb-side-nav-item
              v-if="analysis_part"
              @click.native="toggle = false"
              to="/analyzepart/productivity"
              :title="this.$t('analysis_productivity')"
              >{{ $t('analysis_productivity') }}</mdb-side-nav-item
            >
            <!-- 分析_依製品-IoM指標 -->
            <mdb-side-nav-item
              v-if="analysis_part"
              @click.native="toggle = false"
              to="/analyzepart/iom"
              :title="this.$t('analysis_iom')"
              >{{ $t('analysis_iom') }}</mdb-side-nav-item
            >
            <!-- 分析_依製品-稼動分析 -->
            <!-- <mdb-side-nav-item
              v-if="analysis_part"
              @click.native="toggle = false"
              to="/analyzepart/shoot"
              :title="this.$t('analysis_shoot')"
              >{{ $t('analysis_shoot') }}</mdb-side-nav-item
            >-->
            <!-- 分析_依製品-產量分析 -->
            <!-- <mdb-side-nav-item
              v-if="analysis_part"
              @click.native="toggle = false"
              to="/analyzepart/yield"
              :title="this.$t('analysis_yield')"
              >{{ $t('analysis_yield') }}</mdb-side-nav-item
            >-->
            <!-- 分析_依製品-週期時間分析 -->
            <mdb-side-nav-item
              v-if="analysis_part"
              @click.native="toggle = false"
              to="/analyzepart/cttime"
              :title="this.$t('analysis_cttime')"
              >{{ $t('analysis_cttime') }}</mdb-side-nav-item
            >
          </mdb-side-nav-cat>

          <!-- ************************ -->
          <!-- 分析_依製令 -->
          <mdb-side-nav-cat
            v-if="analysis_manufacturingorder"
            v-bind:name="$t('analysis_manufacturingorder')"
            icon="far fa-fw fa-chart-line"
          >
            <!-- 分析_依製令-工時產量分析 -->
            <mdb-side-nav-item
              v-if="analysis_manufacturingorder"
              @click.native="toggle = false"
              to="/analyzemanufacturingorder/workhryield"
              :title="this.$t('analysis_workhryield')"
              >{{ $t('analysis_workhryield') }}</mdb-side-nav-item
            >
            <!-- 分析_依製令-週期時間分析 -->
            <mdb-side-nav-item
              v-if="analysis_manufacturingorder"
              @click.native="toggle = false"
              to="/analyzemanufacturingorder/productivity"
              :title="this.$t('analysis_productivity')"
              >{{ $t('analysis_productivity') }}</mdb-side-nav-item
            >
            <!-- </mdb-side-nav-cat> -->
          </mdb-side-nav-cat>

          <!-- ******************* -->

          <!-- 分析_依模具 -->
          <mdb-side-nav-cat
            v-if="analysis_mold"
            v-bind:name="$t('analysis_mold')"
            icon="far fa-fw fa-chart-pie"
          >
            <!-- 分析_依模具-工時產量分析 -->
            <mdb-side-nav-item
              v-if="analysis_mold"
              @click.native="toggle = false"
              to="/analyzemold/workhryield"
              :title="this.$t('analysis_workhryield')"
              >{{ $t('analysis_workhryield') }}</mdb-side-nav-item
            >
            <!-- 分析_依模具-IoM指標 -->
            <mdb-side-nav-item
              v-if="analysis_mold"
              @click.native="toggle = false"
              to="/analyzemold/iom"
              :title="this.$t('analysis_iom')"
              >{{ $t('analysis_iom') }}</mdb-side-nav-item
            >
            <!-- 分析_依模具-週期時間分析 -->
            <mdb-side-nav-item
              v-if="analysis_mold"
              @click.native="toggle = false"
              to="/analyzemold/cttime"
              :title="this.$t('analysis_cttime')"
              >{{ $t('analysis_cttime') }}</mdb-side-nav-item
            >

            <!-- </mdb-side-nav-cat> -->
          </mdb-side-nav-cat>
          <!-- </mdb-side-nav-cat> -->
          <!-- 裝置管理 -->
          <mdb-side-nav-cat
            v-if="basicsetting_device"
            v-bind:name="$t('basicsetting_device')"
            icon="far fa-fw fa-satellite-dish"
          >
            <!-- 裝置管理_dc -->
            <mdb-side-nav-item
              v-if="basicsetting_device_dc"
              @click.native="toggle = false"
              icon="far fa-fw fa-compress-arrows-alt"
              to="/basicsetting/device/dc"
              :title="this.$t('basicsetting_device_dc')"
              >{{ $t('basicsetting_device_dc') }}</mdb-side-nav-item
            >
            <!-- 裝置管理_ds -->
            <mdb-side-nav-item
              v-if="basicsetting_device_ds"
              @click.native="toggle = false"
              icon="far fa-fw fa-rss"
              to="/basicsetting/device/ds"
              >{{ $t('basicsetting_device_ds') }}</mdb-side-nav-item
            >
          </mdb-side-nav-cat>
          <!-- 系統設定 -->
          <!-- <mdb-side-nav-cat v-bind:name="$t('basicsetting_device')" icon="file-alt "> -->
          <mdb-side-nav-cat v-if="system" v-bind:name="$t('system')" icon="far fa-fw fa-cog">
            <!-- 報表_報表設定-->
            <mdb-side-nav-item
              v-if="report_setting"
              @click.native="toggle = false"
              icon="far fa-fw fa-dove"
              to="/report/reportsetting"
              :title="this.$t('report_setting')"
              >{{ $t('report_setting') }}</mdb-side-nav-item
            >
            <!-- 缺陷管理 -->
            <mdb-side-nav-item
              v-if="system_defect"
              @click.native="toggle = false"
              icon="far fa-fw fa-heart"
              to="/system/defect"
              :title="this.$t('system_defect')"
              >{{ $t('system_defect') }}</mdb-side-nav-item
            >
            <!-- 環境設定 -->
            <mdb-side-nav-item
              v-if="system_environment"
              @click.native="toggle = false"
              icon="far fa-fw fa-frown"
              to="/system/environment"
              :title="this.$t('system_environment')"
              >{{ $t('system_environment') }}</mdb-side-nav-item
            >
            <!-- 個人資料 -->
            <!-- <mdb-side-nav-item
              v-if="system_user"
              @click.native="toggle = false"
              icon="user"
              to="/system/user"
              :title="this.$t('system_user')"
              >{{ $t('system_user') }}</mdb-side-nav-item
            >-->
            <!-- 權限設定 -->
            <!-- <mdb-side-nav-item
              v-if="system_permission"
              @click.native="toggle = false"
              icon="fa fa-street-view"
              to="/system/permission"
              :title="this.$t('system_permission')"
              >{{ $t('system_permission') }}</mdb-side-nav-item
            >-->
            <!-- 帳號管理 -->
            <mdb-side-nav-item
              v-if="system_account"
              @click.native="toggle = false"
              icon="far fa-fw fa-globe"
              to="/system/account"
              :title="this.$t('system_account')"
              >{{ $t('system_account') }}</mdb-side-nav-item
            >
            <!-- 角色管理 -->
            <mdb-side-nav-item
              v-if="system_role"
              @click.native="toggle = false"
              icon="far fa-fw fa-meh"
              to="/system/role"
              :title="this.$t('system_role')"
              >{{ $t('system_role') }}</mdb-side-nav-item
            >
            <!-- 資源列表 -->
            <!-- <mdb-side-nav-item
              v-if="system_resource"
              @click.native="toggle = false"
              icon="fa fa-share-alt-square"
              to="/system/resource"
              :title="this.$t('system_resource')"
              >{{ $t('system_resource') }}</mdb-side-nav-item
            > -->
            <!-- 角色設定 -->
            <mdb-side-nav-item
              v-if="system_authority"
              @click.native="toggle = false"
              icon="fa fa-ad"
              to="/system/authority"
              :title="this.$t('system_authority')"
              >{{ $t('system_authority') }}</mdb-side-nav-item
            >
          </mdb-side-nav-cat>
          <!-- <mdb-side-nav-item
            v-if="minwindow"
            icon="angle-double-left"
            open-icon="angle-double-right"
            @toggle="toggleSlim"
            toggler
            :collapsed="collapsed"
            >隱藏菜單</mdb-side-nav-item
          >-->
        </mdb-side-nav-nav>
      </li>
    </mdb-side-nav>
  </div>
</template>

<script>
import { waves } from 'mdbvue'
import { mapState } from 'vuex'
import { SystemSettingAPI } from '@/plugins/basicapis.js'

// import $ from 'jquery'
// import 中文 from "../language/zh-tw";
export default {
  name: 'Dashboardv2',
  props: {
    waves: {
      type: Boolean,
      default: true
    },
    open: {
      type: Boolean
    }
  },
  components: {},
  data() {
    return {
      companylogo: require('../assets/clientlogo.png'),
      minwindow: false,
      collapsed: true,
      toggle: false,
      //基本管理
      introduction: false, // true,
      basicsetting_product: false, //true,
      basicsetting_mold: false, // true,
      basicsetting_machine: false, // true,
      basicsetting_material: false, // true,
      basicsetting_employee: false, // true,
      basicsetting_workshop: false, // true,
      basicsetting_company: false, // false,
      // 裝置管理
      basicsetting_device: false, //true,
      basicsetting_device_dc: false, // true,
      basicsetting_device_ds: false, // true,
      basicsetting_device_rd: false, //true,

      // 生產管理
      produce: false,
      produce_manufacturingorder: false, // true,
      produce_schedule: false, //true,
      produce_task: false, // true,
      produce_quality: false, // true,
      produce_storage: false, // true,
      // 看板管理
      dashboard: false,
      // dashboard_workshop_custom1: true, // true,
      dashboard_workshop: false, // true,
      dashboard_workshop2: false, // true,
      dashboard_workshop3: false, // true,
      dashboard_station: false, // true,
      dashboard_remote: false, // false,
      dashboard_broadcast_setting: false, //false
      dashboard_broadcast_list: false, //false
      // 報表
      report: false, // false,
      report_setting: false, //true,
      // 分析
      analysis: false, // false,
      analysis_group: false, //true,
      analysis_machine: false, // true,
      analysis_part: false, //true,
      analysis_mold: false, //true,
      analysis_manufacturingorder: false, //true,
      // analysis_shoot: false, // true,
      // analysis_course: false, //true,
      // analysis_totalyield: false, // true,
      // analysis_workhryield: false, // true,
      // analysis_productivity: false, // true,
      // analysis_iom: false, // true,
      // analysis_yield: false, // true,
      // analysis_cttime: false, // true,
      //系統
      system: false, // true,
      system_defect: false, // true,
      system_user: true, // false,
      system_environment: false, //true,
      // system_permission: false, // false,
      system_resource: false, // false,
      system_account: false, // false,
      system_role: false,
      system_authority: false, // false,

      // analysis_group_title: this.$t("analysis_group"),
      // analysis_machine_title: this.$t("analysis_machine"),
      // analysis_part_title: this.$t("analysis_part"),
      // analysis_mold_title: this.$t("analysis_mold")
      window: {
        width: 0
      }
    }
  },
  methods: {
    logoclick() {
      let to = '/dashboard/dashboardworkshop'
      if (this.dashboard_workshop) {
        to = '/dashboard/dashboardworkshop'
      } else if (this.dashboard_workshop2) {
        to = '/dashboard/dashboardworkshop2'
      } else if (this.dashboard_workshop3) {
        to = '/dashboard/dashboardworkshop3'
      } else if (this.dashboard_station) {
        to = '/dashboard/dashboardstation'
      }
      // if (this.$route.query.redirect) {
      //   redirect = this.$route.query.redirect
      // }
      this.$router.push(to)
      //  to="/dashboard/dashboardworkshop"
    },
    //取得設定圖片
    getimg() {
      var access_token_val = this.$cookies.get('access_token')
      SystemSettingAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          res.data.forEach(item => {
            if (item.parameter == 'company_logo') {
              this.companylogo = item.value
            }
          })
        },
        error => {
          console.log(error)
        }
      )
    },
    toggleSlim() {
      this.collapsed = !this.collapsed
      if (this.collapsed) {
        this.$('.fixed-sn .double-nav').css('padding-left', '15rem')
        this.$('.fixed-sn footer').css('padding-left', '15rem')
        this.$('.fixed-sn main').css('padding-left', '15rem')
        this.$('.img-fluid').css('display', 'none')
      } else {
        this.$('.fixed-sn .double-nav').css('padding-left', '15rem')
        this.$('.fixed-sn footer').css('padding-left', '15rem')
        this.$('.fixed-sn main').css('padding-left', '15rem')
        this.$('.img-fluid').css('display', 'block')
      }
    },
    afterEnter(el) {
      el.style.maxHeight = '1000px'
    },
    beforeLeave(el) {
      el.style.maxHeight = 0
    },
    getLevel() {
      // var resource = JSON.parse(localStorage.getItem("userresource"));
      // console.log(resource);
      // $('#p').hide()
      // console.log($("#p").text());
    },
    handleResize() {
      this.window.width = window.innerWidth

      if (this.window.width < 1440) {
        this.minwindow = false
        this.$('.fixed-sn .double-nav').css('padding-left', '0rem')
        this.$('.fixed-sn footer').css('padding-left', '0rem')
        this.$('.fixed-sn main').css('padding-left', '0rem')
        this.$('.img-fluid').css('display', 'block')
      } else {
        this.minwindow = true
        this.collapsed = false
        this.$('.fixed-sn .double-nav').css('padding-left', '15rem')
        this.$('.fixed-sn footer').css('padding-left', '15rem')
        this.$('.fixed-sn main').css('padding-left', '15rem')
        this.$('.img-fluid').css('display', 'block')
      }
    },
    iniright() {
      // dashboard_broadcast_setting:false,//false
      // dashboard_broadcast_list:false,//false
      if (this.authority != null) {
        this.authority.forEach(item => {
          switch (item.name) {
            case 'dashboard':
              this.dashboard = true
              break
            case 'dashboard_workshop':
              this.dashboard_workshop = true
              break

            case 'dashboard_workshop2':
              this.dashboard_workshop2 = true
              break

            case 'dashboard_workshop3':
              this.dashboard_workshop3 = true
              break
            case 'dashboard_station':
              this.dashboard_station = true
              break
            case 'remote_dashboard_setting':
              this.dashboard_remote = true
              break

            case 'broadcast_setting':
              this.dashboard_broadcast_setting = true
              break
            case 'broadcast_list':
              this.dashboard_broadcast_list = true
              break
            case 'produce':
              this.produce = true
              break
            case 'produce_manufacturingorder':
              this.produce_manufacturingorder = true
              break
            case 'produce_schedule':
              this.produce_schedule = true
              break
            case 'produce_task':
              this.produce_task = true
              break
            case 'produce_quality':
              this.produce_quality = true
              break
            case 'produce_storage':
              this.produce_storage = true
              break
            case 'basicsetting_product':
              this.basicsetting_product = true
              break
            case 'basicsetting_mold':
              this.basicsetting_mold = true
              break
            case 'basicsetting_machine':
              this.basicsetting_machine = true
              break
            case 'basicsetting_material':
              this.basicsetting_material = true
              break
            case 'basicsetting_employee':
              this.basicsetting_employee = true
              break
            case 'basicsetting_workshop':
              this.basicsetting_workshop = true
              break
            case 'analysis_group':
              this.analysis_group = true
              break
            case 'analysis_machine':
              this.analysis_machine = true
              break
            case 'analysis_part':
              this.analysis_part = true
              break
            case 'analysis_mold':
              this.analysis_mold = true
              break
            case 'analysis_manufacturingorder':
              this.analysis_manufacturingorder = true
              break
            case 'basicsetting_device':
              this.basicsetting_device = true
              break
            case 'basicsetting_device_dc':
              this.basicsetting_device_dc = true
              break
            case 'basicsetting_device_ds':
              this.basicsetting_device_ds = true
              break
            case 'system':
              this.system = true
              break
            case 'report_setting':
              this.report_setting = true
              break
            case 'system_defect':
              this.system_defect = true
              break
            case 'system_environment':
              this.system_environment = true
              break
            case 'system_account': //帳號管理
              this.system_account = true //true
              break
            case 'system_role': //帳號管理
              this.system_role = true //true
              break
            case 'system_user':
              this.system_user = true //true
              break
            // case 'authority':
            //   this.system_authority = true //true
            //   break
            // case 'system_permission':
            //   this.system_permission = false //true
            //   break
          }
        })
      }
    }
  },
  created() {
    this.iniright()
    this.getLevel()
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
    this.getimg()
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize)
  },
  mounted() {},
  watch: {
    // open(newVal) {
    open() {
      // watch it
      this.toggle = true
    }
  },
  computed: {
    ...mapState({
      authority: state => state.Authority
    })
  },
  mixins: [waves]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.grouptitle {
  display: block;
  padding-left: 23px;
  color: #4b646f;
  font-size: 22px;
  font-weight: bolder;
}
.side-nav .collapsible a {
  color: #424242;
}

.collapse-side-nav-item {
  overflow: hidden;
  max-height: 0;
  padding: 0;
  transition: max-height 0.3s;
}
.collapse-side-nav-item a {
  padding-left: 47px;
  line-height: 36px;
  background-color: rgba(0, 0, 0, 0.15);
}
</style>

<style>
.side-nav.wide.slim {
  width: 15rem !important;
}
.side-nav .collapsible a {
  font-size: 1.2rem !important;
}

/* 更換側欄圖示 */
/* 看板管理 */
.fa-desktop::before {
  content: url(../assets/slideimg/dashboard.svg);
}
/* 即時看版 */
.fa-tachometer-alt::before {
  content: url(../assets/slideimg/dashboard_workshop.svg);
}
/* 單站看板 */
.fa-laptop::before {
  content: url(../assets/slideimg/dashboard_station.svg);
}
/* 遠端看板 */
.fa-donate::before {
  content: url(../assets/slideimg/remote_dashboard_setting.svg);
}
/* 推播設定 */
.fa-smile::before {
  content: url(../assets/slideimg/broadcast_setting.svg);
}
/* 推播列表 */
.fa-video::before {
  content: url(../assets/slideimg/broadcast_list.svg);
}
/* 生產管理 */
.fa-chalkboard-teacher::before {
  content: url(../assets/slideimg/produce.svg);
}
/*製令管理*/
.fa-sticky-note::before {
  content: url(../assets/slideimg/produce_manufacturingorder.svg);
}
/*排程管理*/
.fa-calendar-alt::before {
  content: url(../assets/slideimg/produce_schedule.svg);
}
/*任務管理*/
.fa-tasks::before {
  content: url(../assets/slideimg/produce_task.svg);
}
/*品檢管理*/
.fa-microscope::before {
  content: url(../assets/slideimg/produce_quality.svg);
}
/*入庫管理*/
.fa-warehouse::before {
  content: url(../assets/slideimg/produce_storage.svg);
}
/*製品管理*/
.fa-archive::before {
  content: url(../assets/slideimg/basicsetting_product.svg);
}
/*模具管理*/
.fa-inbox::before {
  content: url(../assets/slideimg/basicsetting_mold.svg);
}
/*原料管理*/
.fa-snowplow::before {
  content: url(../assets/slideimg/basicsetting_material.svg);
}
/*設備管理*/
.fa-flask::before {
  content: url(../assets/slideimg/basicsetting_machine.svg);
}
/*人員管理*/
.fa-users::before {
  content: url(../assets/slideimg/basicsetting_employee.svg);
}
/*廠區管理*/
.fa-industry::before {
  content: url(../assets/slideimg/basicsetting_workshop.svg);
}
/*夥伴管理*/
/* .fa-industry::before {
  content: url(../assets/slideimg/basicsetting_workshop.svg);
} */

/*依廠區分析*/
.fa-cart-plus::before {
  content: url(../assets/slideimg/analysis_group.svg);
}
/*依設備分析*/
.fa-chart-area::before {
  content: url(../assets/slideimg/analysis_machine.svg);
}
/*依製品分析*/
.fa-chart-bar::before {
  content: url(../assets/slideimg/analysis_part.svg);
}
/*依製令分析*/
.fa-chart-line::before {
  content: url(../assets/slideimg/analysis_manufacturingorder.svg);
}
/*依模具分析*/
.fa-chart-pie::before {
  content: url(../assets/slideimg/analysis_mold.svg);
}

/* 裝置管理 */
.fa-satellite-dish::before {
  content: url(../assets/slideimg/basicsetting_device.svg);
}
/* 裝置管理-dc */
.fa-compress-arrows-alt::before {
  content: url(../assets/slideimg/basicsetting_device_dc.svg);
}
/* 裝置管理-ds */
.fa-rss::before {
  content: url(../assets/slideimg/basicsetting_device_ds.svg);
}
/* 系統設定 */
.fa-cog::before {
  content: url(../assets/slideimg/system.svg);
}
/* 報表_報表設定 */
.fa-dove::before {
  content: url(../assets/slideimg/report_setting.svg);
}
/* 缺陷管理 */
.fa-heart::before {
  content: url(../assets/slideimg/system_defect.svg);
}
/* 環境設定 */
.fa-frown::before {
  content: url(../assets/slideimg/system_environment.svg);
}
/* 帳號管理 */
.fa-globe::before {
  content: url(../assets/slideimg/system_account.svg);
}
/* 角色設定 */
.fa-meh::before {
  content: url(../assets/slideimg/system_authority.svg);
}
</style>
