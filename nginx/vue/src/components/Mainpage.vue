<template>
  <div>
    <!--SideNav-->
    <side-nav
      :open="toggle"
      v-if="
        [
          'DailyReport',
          'remotedashboardworkshop',
          'remotedashboardstation',
          'remotefactorydashboard'
        ].indexOf($route.name) == -1
      "
    />
    <!--/SideNav-->
    <router-view
      v-if="
        [
          'DailyReport',
          'remotedashboardworkshop',
          'remotedashboardstation',
          'remotefactorydashboard'
        ].indexOf($route.name) > -1
      "
    ></router-view>

    <div class="flexible-content">
      <!--Navbar-->
      <navbar
        :page="activePage"
        v-if="
          [
            'DailyReport',
            'remotedashboardworkshop',
            'remotedashboardstation',
            'remotefactorydashboard'
          ].indexOf($route.name) == -1
        "
      />
      <!--/Navbar-->

      <!--MainContent-->
      <main
        class="mainclass"
        v-if="
          [
            'DailyReport',
            'remotedashboardworkshop',
            'remotedashboardstation',
            'remotefactorydashboard'
          ].indexOf($route.name) == -1
        "
      >
        <!-- <div class="pt-1"> -->
        <router-view></router-view>
        <!-- </div> -->
      </main>
      <!--/MainContent-->

      <!--Footer-->
      <div
        style="z-index:100"
        class="footerfix"
        v-if="['DailyReport', 'remotedashboardworkshop'].indexOf($route.name) == -1"
      >
        <copyrights />
      </div>
      <!--/Footer-->
    </div>
  </div>
</template>

<script>
import SideNav from './SideNav'
import Navbar from './Navbar'
import Copyrights from './Footer'

export default {
  name: 'App',
  components: {
    SideNav,
    Navbar,
    Copyrights
  },
  data() {
    return {
      activePage: 'Register Page',
      toggle: false
    }
  },
  //  watch: {
  //  this.$route.name:{
  //    console.log('ahah')
  //  }
  // },
  mounted() {
    // console.log('--------')
    // // if(['login', 'register', '報表設定'].indexOf(this.$route.name) > -1)
    // console.log([' 報表設定'].indexOf(this.$route.name))
    // console.log(this.$route)
    // console.log('--------')
    this.activePage = this.$route.name

    this.$on('toggle', function(value) {
      this.toggle = value
    })
  },
  created() {},
  updated() {
    this.activePage = this.$route.name
  }
}
</script>

<style>
.flexible-navbar.navbar.navbar-expand-lg.fixed-top.scrolling-navbar.double-nav {
  padding-left: 16rem !important;
}
.fixed-sn .double-nav,
.fixed-sn main,
.fixed-sn {
  padding-left: 1rem;
}
.side-nav.wide.fixed {
  width: 257px;
}
.pt-4.page-footer.mt-4 {
  margin-top: 0px !important;
  padding-top: 0px !important;
}
.footer-copyright.mb-0.py-3.text-center {
  padding-top: 0.5rem !important;
  padding-bottom: 0.5rem !important;
}
.footerfix {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}
.fixed-sn main {
  margin-right: 0% !important;
  margin-left: 0rem !important;
  padding-top: 4rem !important;
  height: 100% !important;
}
html {
  font-size: 16px;
  width: 100%;
  height: 100%;
}

body {
  font-weight: 300;
  background-color: #eee;
}

main {
  min-height: 90vh;
}

.side-nav .logo-sn {
  padding-bottom: 1rem;
  padding-top: 1rem;
  border-bottom: 1px solid rgba(153, 153, 153, 0.3);
}

.navbar .btn,
.navbar .nav-item,
.navbar .nav-link {
  padding: 0;
}

.select-wrapper input.select-dropdown {
  font-size: 14px;
}

/* .form-control {
  font-size: 14px;
  height: calc(2rem + 1px);
  padding: 0.375rem 0.75rem;
} */

.cascading-admin-card {
  margin-top: 20px;
}
.cascading-admin-card .admin-up {
  margin-left: 4%;
  margin-right: 4%;
  margin-top: -20px;
}
.cascading-admin-card .admin-up .fas,
.cascading-admin-card .admin-up .far,
.cascading-admin-card .admin-up .fab {
  padding: 1.7rem;
  font-size: 2rem;
  color: #fff;
  text-align: left;
  -webkit-border-radius: 3px;
  border-radius: 3px;
}
.cascading-admin-card .admin-up .data {
  float: right;
  margin-top: 2rem;
  text-align: right;
}
.cascading-admin-card .admin-up .data p {
  color: #999999;
  font-size: 12px;
}

.classic-admin-card .card-body {
  color: #fff;
  margin-bottom: 0;
  padding: 0.9rem;
}
.classic-admin-card .card-body p {
  font-size: 13px;
  opacity: 0.7;
  margin-bottom: 0;
}
.classic-admin-card .card-body h4 {
  margin-top: 10px;
}
.classic-admin-card .card-body .float-right .fas,
.classic-admin-card .card-body .float-right .far,
.classic-admin-card .card-body .float-right .fab {
  font-size: 3rem;
  opacity: 0.5;
}

.table-ui {
  border: 1px solid #e0e0e9;
}

.fullscreen {
  background: #fff;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 100000;
  min-height: 100vh;
}

.fullscreen-view {
  height: 100vh;
}

.list-group .ml-auto {
  float: right;
  flex: none !important;
}

.datepicker-overlay {
  z-index: 9999 !important;
}

@media only screen and (max-width: 1440px) {
  .flexible-navbar.navbar.navbar-expand-lg.fixed-top.scrolling-navbar.double-nav {
    padding-left: 0rem !important;
  }
  .side-nav.fixed {
    transform: translateX(0) !important;
  }
}

.navbar-brand {
  cursor: pointer;
}
@media only screen and (max-width: 2000px) {
  .mainclass {
    width: 100%;
    padding-left: 15.5rem !important;
  }
}
@media only screen and (max-width: 1400px) {
  .mainclass {
    width: 100%;
    padding-left: 0rem !important;
  }
}
@media only screen and (max-width: 800px) {
  .mainclass {
    width: 100%;
    padding-left: 0rem !important;
  }
}
@media only screen and (max-width: 950px) and (max-height: 500px) {
  .mainclass {
    width: 100%;
    padding-left: 0rem !important;
  }
}
</style>
