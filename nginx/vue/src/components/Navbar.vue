<template>
  <mdb-navbar class="flexible-navbar" position="top" double scrolling>
    <!-- <mdb-row class="w-100"> -->
    <mdb-navbar-brand @click.native="toggleSideNav" class="button-collapse">
      <mdb-icon icon="bars" />
    </mdb-navbar-brand>

    <mdb-col class="breadcrumbsclass">
      <span class="breadcrumbs" style="color:white;">
        <!-- <span style="padding-left: 10px">
          <router-link to="/home">{{ $t('introduction') }} </router-link>
        </span>-->
        <span>{{ crumbs }}</span>
        <span style="opacity:0;">{{ computedPage.activePage }}</span>
      </span>
    </mdb-col>
    <mdb-col class="textclass" style="color:white;text-align:center">
      <span style="font-size:1.5em">AIoM Solution</span>
    </mdb-col>
    <mdb-col class="userclass">
      <mdb-dropdown class="nav-item" tag="li" style="float:right ">
        <mdb-dropdown-toggle slot="toggle" tag="li" outline="none" class="btn-transparent">
          <mdb-icon icon="user" />
        </mdb-dropdown-toggle>
        <mdb-dropdown-menu right>
          <mdb-dropdown-item @click="logout">{{ $t('log_out') }}</mdb-dropdown-item>
          <mdb-dropdown-item v-if="userpageflag" to="/system/user">
            {{ $t('personal_page') }}
          </mdb-dropdown-item>
          <!-- <mdb-dropdown-item> -->

          <!-- </mdb-dropdown-item> -->
        </mdb-dropdown-menu>
      </mdb-dropdown>
    </mdb-col>
    <!-- </mdb-row> -->
  </mdb-navbar>
</template>

<script>
// import i18n from "i18n ";
import VueCookies from 'vue-cookies'
import { store } from './../store/index.js'
import { apiLogout } from '@/plugins/basicapis.js'
import { crumbsfunc } from '@/plugins/crumbsjs.js'
export default {
  watch: {
    computedPage: function(value) {
      var temp = crumbsfunc.get(value)
      this.crumbs = temp
    }
  },
  name: 'Navbar',
  props: {
    page: {
      type: String
    }
  },
  components: {},
  data() {
    return {
      activePage: this.page,
      toggle: false,
      crumbs: '',
      userpageflag: false
    }
  },
  created() {
    this.iniright()
  },

  methods: {
    //設定權限
    iniright() {
      this.userpageflag = false
      store.state.Authority.forEach(item => {
        if (item.name == 'system_user') {
          this.userpageflag = true
        }
      })
    },
    toggleSideNav() {
      this.toggle = !this.toggle
      this.$parent.$emit('toggle', this.toggle)
    },
    logout() {
      apiLogout({
        headers: {}
      }).then(
        () => {
          VueCookies.remove('access_token')
          localStorage.clear()
          this.$router.push('/')
        },
        error => {
          console.log(error)
        }
      )
    },
    changelanguage() {
      // i18n.local = "en";
    }
  },
  computed: {
    computedPage() {
      return {
        activePage: this.page
      }
    }
  }
}
</script>
<style>
.navbar-toggler {
  display: none !important;
}
</style>

<style scoped>
#maintitle {
  padding: 0px;
}
#main-index-slogan {
  position: absolute;
  top: 50%;
  /* left: 50vw; */
  text-align: center;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, 0%);
}
.flexible-navbar {
  background-color: #3d91bc;
}
.navbar .nav-item {
  line-height: 24px;
  font-size: 16px;
}
.navbar .dropdown-toggle {
  padding: 0 10px;
  font-size: 16px;
}

.navbar ul {
  padding: 5px 0;
}

.navbar .btn {
  font-weight: 300;
}

.navbar-collapse {
  order: 0 !important;
}

.navbar .notifications-nav .dropdown-menu {
  width: 23rem;
}

.navbar-expand-lg .navbar-nav {
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  flex-direction: row;
}

.btn-transparent {
  background-color: transparent !important;
  color: #000;
  text-transform: none;
  box-shadow: none !important;
}

.btn-transparent:hover,
.btn-transparent:active {
  box-shadow: none !important;
}

@media (max-width: 1024px) {
  .breadcrumbs {
    display: none;
  }
}
/*手機直式 */
@media only screen and (max-width: 500px) and (max-height: 950px) {
  .navbar-toggler {
    display: none !important;
  }
  .textclass {
    min-width: 40vw;
    font-size: 0.8rem;
  }
  .breadcrumbsclass {
    display: none;
  }
  .userclass {
    max-width: 50px;
    padding: 0px;
  }
  /* .button-collapse {
    display: none !important;
  } */
}
</style>
