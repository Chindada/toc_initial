import Vue from 'vue'
import Router from 'vue-router'

// import VueI18n from "vue-i18n";
import Homepage from '@/components/pages/Home'
import Mainpage from '@/components/Mainpage'
import Login from '@/components/pages/Login'
import Notfound from '@/components/pages/notfound'
import Version from '@/components/pages/test'
//看板管理
import Dashboardv2 from '@/components/dashboard/dashboardstation'
import DashboardRemote from '@/components/dashboard/remote'
import BroadcastSetting from '@/components/dashboard/broadcastsetting'
import BroadcastList from '@/components/dashboard/broadcastlist'
// import FactoryDashboard from '@/components/dashboard/factorydashboard.vue'
import Nullpage from '@/components/dashboard/nullpage'

//即時、客製化看板
import Dashboard from '@/components/dashboard/dashboardworkshop'
import Dashboard2 from '@/components/dashboard/dashboardworkshopCustom1'
import FactoryDashboard from '@/components/dashboard/factorydashboardmain'
// import Dashboardv1 from '@/components/dashboard/dashboardworkshop'
// import DashboardCustom1 from '@/components/dashboard/dashboardworkshopCustom1'

//生產管理

import Manufacturingorder from '@/components/produce/manufacturingorder/manufacturingorder'
import Schedule from '@/components/produce/schedule/schedule'
import Task from '@/components/produce/task/task'
import Quality from '@/components/produce/quality/quality'
import Storage from '@/components/produce/storage/storage'
//數據分析-整廠
import Analysis_by_group_course from '@/components/analysis/analysis_by_group/course'
import Analysis_by_group_shoot from '@/components/analysis/analysis_by_group/shoot'
import Analysis_by_group_totalyield from '@/components/analysis/analysis_by_group/totalyield'
import Analysis_by_group_workhryield from '@/components/analysis/analysis_by_group/workhryield'
//數據分析-依設備
import Analysis_by_machine_productivity from '@/components/analysis/analysis_by_machine/productivity'
import Analysis_by_machine_workhryield from '@/components/analysis/analysis_by_machine/workhryield'
//數據分析-依製品
import Analysis_by_part_cttime from '@/components/analysis/analysis_by_part/cttime'
import Analysis_by_part_iom from '@/components/analysis/analysis_by_part/iom'
import Analysis_by_part_productivity from '@/components/analysis/analysis_by_part/productivity'
import Analysis_by_part_shoot from '@/components/analysis/analysis_by_part/shoot'
import Analysis_by_part_workhryield from '@/components/analysis/analysis_by_part/workhryield'
import Analysis_by_part_yield from '@/components/analysis/analysis_by_part/yield'
//數據分析-依製令
import Analysis_by_manufacturingorder_workhryield from '@/components/analysis/analysis_by_manufacturingorder/workhryield'
import Analysis_by_manufacturingorder_productivity from '@/components/analysis/analysis_by_manufacturingorder/productivity'
//數據分析-依模具
import Analysis_by_mold_cttime from '@/components/analysis/analysis_by_mold/cttime'
import Analysis_by_mold_iom from '@/components/analysis/analysis_by_mold/iom'
import Analysis_by_mold_workhryield from '@/components/analysis/analysis_by_mold/workhryield'
//基本設定
import Basicsetting_product from '@/components/basicsetting/product/product'
import Basicsetting_mold from '@/components/basicsetting/mold/mold'
import Basicsetting_machine from '@/components/basicsetting/machine/machine'
import Basicsetting_material from '@/components/basicsetting/material/material'
import Basicsetting_employee from '@/components/basicsetting/employee/employee'
import Basicsetting_workshop from '@/components/basicsetting/workshop/workshopmain'
import Basicsetting_company from '@/components/basicsetting/company'
// import Basicsetting_device from "@/components/basicsetting/device";
import Basicsetting_device_dc from '@/components/basicsetting/device/dc'
import Basicsetting_device_ds from '@/components/basicsetting/device/ds'
import Basicsetting_device_rd from '@/components/basicsetting/device/rd'
//報表
import Report_setting from '@/components/report/setting'
import Report_daily from '@/components/report/dailyreport'
import Report_dailyOEE from '@/components/report/dailyreportOEE'
// import Report_dailytest from '@/components/report/daily'

//系統設定
import System_defect from '@/components/system/defect'
import System_user from '@/components/system/user'
import System_role from '@/components/system/role'
import System_environment from '@/components/system/environment'
import System_permission from '@/components/system/permission'
import System_resource from '@/components/system/resource'
import System_account from '@/components/system/account'
import System_authority from '@/components/system/authority'
// import i18n from 'vue-i18n'
//遠端看版
import Remote_ini from '@/components/remote/inipage'
// import Remote_dashboardworkshop from '@/components/remote/dashboardworkshop'
import Remote_dashboardworkshop_main from '@/components/remote/dashboardworkmain'
import Remote_factorydashboard_main from '@/components/remote/factorydashboardmain'
import Remote_dashboardstation from '@/components/remote/dashboardstation'

import VueCookies from 'vue-cookies'

// Vue.use(VueI18n);
Vue.use(Router)
Vue.use(VueCookies)

export default new Router({
  mode: 'history',
  SRVurl: {
    system: process.env.VUE_APP_system,
    data: process.env.VUE_APP_data
  },
  routes: [
    {
      path: '/remote/inipage',
      name: 'remoteini',
      component: Remote_ini
    },
    {
      path: '/iomc5system/function/system/version',
      name: 'iomc5systemFunctionSystemVersion',
      component: Version,
      alwaysShow: true
    },
    {
      path: '/',
      name: 'Login Page',
      component: Login,
      alwaysShow: true
      // meta: {
      //   title: "permission",
      //   roles: ["root", "admin", "pmc", "user", "pid"]
      // }
    },
    {
      path: '/404',
      name: '404 Not Found',
      component: Notfound,
      alwaysShow: true
    },
    // {
    //   path: '/test',
    //   name: '404 Not Found',
    //   component: test,
    //   alwaysShow: true
    // },
    {
      path: '/dashboard/dashboardworkshop',
      name: '看板管理 / 即時看版',
      component: Mainpage,
      children: [
        {
          path: '/home',
          name: '',
          component: Homepage
        },
        // {
        //   path: '/dashboard/factorydashboard',
        //   name: ' 看板管理 / 廠區看板',
        //   component: FactoryDashboard
        // },
        {
          path: '/dashboard/dashboardworkshop',
          // name: i18n.t('dashboard') + '/' + i18n.t('dashboard_workshop'), //' / 看板管理 / 即時看版',
          name: ' 看板管理 / 即時看版一',
          component: Dashboard
        },

        {
          path: '/dashboard/dashboardworkshop2',
          name: ' 看板管理 / 即時看版二',
          component: Dashboard2
        },

        {
          path: '/dashboard/dashboardworkshop3',
          name: ' 看板管理 / 即時看版三',
          component: FactoryDashboard
        },
        {
          path: '/null',
          name: 'nullpage',
          component: Nullpage
        },
        {
          // mport BroadcastSetting from '@/components/dashboard/Broadcastsetting'
          // import BroadcastList
          path: '/dashboard/dashboardstation',
          name: ' 看板管理 / 單站看版',
          component: Dashboardv2
        },
        {
          path: '/dashboard/screenprojection',
          name: ' 看板管理 / 遠端看版',
          component: DashboardRemote
        },
        {
          path: '/dashboard/broadcastsetting',
          name: ' 看板管理 / 推播設定',
          component: BroadcastSetting
        },
        {
          path: '/dashboard/broadcastlist',
          name: ' 看板管理 / 推播列表',
          component: BroadcastList
        },
        {
          path: '/produce/manufacturingorder',
          name: ' 生產管理 / 製令管理',
          component: Manufacturingorder
        },
        {
          path: '/produce/schedule',
          name: ' 生產管理 / 排程管理',
          component: Schedule
        },
        {
          path: '/produce/task',
          name: ' 生產管理 / 任務管理',
          component: Task
        },
        {
          path: '/produce/quality',
          name: ' 生產管理 / 品檢管理',
          component: Quality
        },
        {
          path: '/produce/storage',
          name: ' 生產管理 / 入庫管理',
          component: Storage
        },
        {
          path: '/analyzefactory/shoot',
          name: ' 依廠區分析-稼動分析',
          component: Analysis_by_group_shoot
        },
        {
          path: '/analyzefactory/course',
          name: ' 依廠區分析-歷程分析',
          component: Analysis_by_group_course
        },
        {
          path: '/analyzefactory/totalyield',
          name: ' 依廠區分析-總產量分析',
          component: Analysis_by_group_totalyield
        },
        {
          path: '/analyzefactory/workhryield',
          name: ' 依廠區分析-工時產量分析',
          component: Analysis_by_group_workhryield
        },
        {
          path: '/analyzemachine/productivity',
          name: ' 依設備-生產效率分析',
          component: Analysis_by_machine_productivity
        },
        {
          path: '/analyzemachine/workhryield',
          name: ' 依設備-工時產量分析',
          component: Analysis_by_machine_workhryield
        },
        {
          path: '/analyzepart/productivity',
          name: ' 依製品-生產效率分析',
          component: Analysis_by_part_productivity
        },
        {
          path: '/analyzepart/workhryield',
          name: ' 依製品-工時產量分析',
          component: Analysis_by_part_workhryield
        },
        {
          path: '/analyzepart/iom',
          name: ' 依製品-IoM指標',
          component: Analysis_by_part_iom
        },
        {
          path: '/analyzepart/shoot',
          name: ' 依製品-稼動分析',
          component: Analysis_by_part_shoot
        },
        {
          path: '/analyzepart/yield',
          name: ' 依製品-產量分析',
          component: Analysis_by_part_yield
        },
        {
          path: '/analyzepart/cttime',
          name: ' 依製品-週期時間分析',
          component: Analysis_by_part_cttime
        },
        {
          path: '/analyzemanufacturingorder/workhryield',
          name: ' 依製令-工時產量分析',
          component: Analysis_by_manufacturingorder_workhryield
        },
        {
          path: '/analyzemanufacturingorder/productivity',
          name: ' 依製令-生產效率分析',
          component: Analysis_by_manufacturingorder_productivity
        },
        {
          path: '/analyzemold/workhryield',
          name: ' 依模具-工時產量分析',
          component: Analysis_by_mold_workhryield
        },
        {
          path: '/analyzemold/cttime',
          name: ' 依模具-週期時間分析',
          component: Analysis_by_mold_cttime
        },
        {
          path: '/analyzemold/iom',
          name: ' 依模具-IoM指標',
          component: Analysis_by_mold_iom
        },
        {
          path: '/basicsetting/product',
          name: ' 製品管理',
          component: Basicsetting_product
        },
        {
          path: '/basicsetting/mold',
          name: ' 模具管理',
          component: Basicsetting_mold
        },
        {
          path: '/basicsetting/machine',
          name: ' 設備管理',
          component: Basicsetting_machine
        },
        {
          path: '/basicsetting/material',
          name: ' 原料管理',
          component: Basicsetting_material
        },
        {
          path: '/basicsetting/employee',
          name: ' 人員管理',
          component: Basicsetting_employee
        },
        {
          path: '/basicsetting/workshop',
          name: ' 廠區管理',
          component: Basicsetting_workshop
        },
        {
          path: '/basicsetting/company',
          name: ' 夥伴管理',
          component: Basicsetting_company
        },
        {
          path: '/basicsetting/device/dc',
          name: ' 裝置管理 / 採集裝置',
          component: Basicsetting_device_dc
        },
        {
          path: '/basicsetting/device/ds',
          name: ' 裝置管理 / 串流裝置',
          component: Basicsetting_device_ds
        },
        {
          path: '/basicsetting/device/rd',
          name: ' 裝置管理 / RD',
          component: Basicsetting_device_rd
        },
        {
          path: '/report/reportsetting',
          name: ' 報表設定',
          component: Report_setting
        },
        {
          path: '/report/daily',
          name: 'DailyReport',
          type: 'report',
          component: Report_daily
        },
        {
          path: '/report/dailyOEE',
          name: 'DailyReport',
          type: 'report',
          component: Report_dailyOEE
        },
        // {
        //   path: '/report/dailytest',
        //   name: 'DailyReport1',
        //   type: 'report',
        //   component: Report_dailytest
        // },
        {
          path: '/system/defect',
          name: ' 系統設定 / 缺陷設定',
          component: System_defect
        },
        {
          path: '/system/user',
          name: ' 用戶管理',
          component: System_user
        },
        {
          path: '/system/role',
          name: ' 角色管理',
          component: System_role
        },
        {
          path: '/system/environment',
          name: ' 環境設定',
          component: System_environment
        },
        {
          path: '/system/permission',
          name: ' 權限設定',
          component: System_permission
        },
        {
          path: '/system/resource',
          name: ' 角色管理',
          component: System_resource
        },
        {
          path: '/system/account',
          name: ' 帳號管理',
          component: System_account
        },
        {
          path: '/system/authority',
          name: ' 權限認證',
          component: System_authority
        },
        {
          path: '/remote/dashboardworkshop',
          name: 'remotedashboardworkshop',
          component: Remote_dashboardworkshop_main
        },
        {
          path: '/remote/factorydashboard',
          name: 'remotefactorydashboard',
          component: Remote_factorydashboard_main
        },
        //
        // {
        //   path: '/remote/dashboardworkshop',
        //   name: 'remotedashboardworkshop',
        //   component: Remote_dashboardworkshop
        // },
        {
          path: '/remote/dashboardstation',
          name: 'remotedashboardstation',
          component: Remote_dashboardstation
        }
        //
      ]
    },
    {
      path: '*',
      props: { page: 5 },
      redirect: '/404'
    }
  ]
})

// import Remote_dashboardworkshop from '@/components/remote/dashboardworkshop'
// import Remote_dashboardstation from '@/components/remote/dashboardstation'
