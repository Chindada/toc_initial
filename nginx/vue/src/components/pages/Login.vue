<template>
  <div class="classic-form-page">
    <!-- <navbar navStyle="background-color: transparent;" position="top" dark transparent>
      <mdb-navbar-brand href="#"><strong>MDB</strong></mdb-navbar-brand>
      <navbar-collapse>
        <navbar-nav>
          <navbar-item href="#" waves-fixed active>Home</navbar-item>
          <navbar-item href="#" waves-fixed>Features</navbar-item>
          <navbar-item href="#" waves-fixed>Pricing</navbar-item>
        </navbar-nav>
        <form>
          <mdb-input type="text" class="text-white" placeholder="Search" aria-label="Search" label navInput waves waves-fixed/>
        </form>dfa
      </navbar-collapse>
    </navbar>-->

    <view-wrapper>
      <md-mask overlay="stylish-strong" class="d-flex justify-content-center align-items-center">
        <container>
          <row>
            <div class="col-xl-5 col-lg-6 col-md-10 col-sm-12 mx-auto mt-5">
              <mdb-card id="classic-card">
                <mdb-card-body class="login-card">
                  <div>
                    <!-- <h3><i class="fas fa-user mt-2 mb-2"></i> Log in:</h3> -->
                    <img alt="AIOM" class="img-center" width="100%" src="../../assets/AIOM-1.png" />
                  </div>
                  <mdb-input
                    label="Account"
                    labelColor="black"
                    v-model="username"
                    icon="user"
                    @keyup.enter.native="login"
                  />
                  <!-- <mdb-input label="Your email" labelColor="white" icon="envelope"/> -->
                  <mdb-input
                    label="Password"
                    labelColor="black"
                    v-model="password"
                    icon="lock"
                    type="password"
                    @keyup.enter.native="login"
                  />
                  <div class="text-center mt-4 black-text">
                    <h3 id="apptest">{{ infomessage }}</h3>
                    <mdb-btn class="loginbtm" v-on:click="login">Login</mdb-btn>
                    <hr />
                    <!-- <div class="text-center d-flex justify-content-center white-label">
                      <a class="p-2 m-2">
                        <mdb-icon fab icon="twitter" class="white-text"/>
                      </a>
                      <a class="p-2 m-2">
                        <mdb-icon fab icon="linkedin" class="white-text"/>
                      </a>
                      <a class="p-2 m-2">
                        <mdb-icon fab icon="instagram" class="white-text"/>
                      </a>
                    </div>-->
                  </div>
                </mdb-card-body>
              </mdb-card>
            </div>
          </row>
        </container>
      </md-mask>
    </view-wrapper>
  </div>
</template>

<script>
import md5 from 'js-md5'
import { apiLogin } from '@/plugins/basicapis.js'
import { version } from '@/plugins/version.js'
import { mapMutations } from 'vuex'
export default {
  name: 'Login',
  components: {},
  data() {
    return {
      username: '',
      password: '',
      infomessage: '',
      toggle: false
    }
  },
  methods: {
    ...mapMutations([
      'change' // 宣告 this.$store.commit('change', JSON)
    ]),
    pagestart() {
      //清除localstorage
      if (localStorage.getItem('userresource') != '') {
        localStorage.clear()
        this.$cookies.set('access_token', '', 1)
        this.$cookies.set('roles', '', 1)
      }
    },

    login() {
      if (this.username === '' || this.password === '') {
        this.infomessage = 'No Account or Password' // '帳號或密碼未輸入'
      } else {
        apiLogin({
          headers: {
            account: this.username,
            password: md5(this.password)
          }
        })
          .then(
            response => {
              var temp = version.get(response.data) //處理資源
              this.$store.commit('change', temp) //資源存到store
              this.$store.commit('change1', response.data.edition) //資源存到store)
              this.$store.commit('change2', response.data.user) //個人資訊存到store
              this.$store.commit('change3', response.data.checkTask) //看板istask
              const userroles = response.data.user.roleId
              this.infomessage = ''
              const accesstoken = response.data.token
              localStorage.setItem('login', 0)
              //取得accesstoken存cookie
              this.$cookies.set('access_token', accesstoken)
              this.$cookies.set('roles', userroles)
              this.afterlogin(response.data.resource)
            },
            error => {
              // this.infomessage = 'Wrong Account or Password' //'帳號或密碼錯誤'
              if (error.response.status == 502) {
                this.infomessage = 'Error: 502 Bad Gateway'
              } else if (error.response.status == 500) {
                this.infomessage = 'Wrong Account or Password' //'帳號或密碼錯誤'
              } else {
                this.infomessage = 'Error: ' + error.response.status
              }
            }
          )
          .catch(function error(err) {
            console.log(err)
          })
      }
    },
    //登入後導頁
    afterlogin(data) {
      let redirect = '/dashboard/dashboardworkshop'
      if (this.dashboardfor(data, 'dashboardworkshop')) {
        redirect = '/dashboard/dashboardworkshop'
      } else if (this.dashboardfor(data, 'dashboardworkshop2')) {
        redirect = '/dashboard/dashboardworkshop2'
      } else if (this.dashboardfor(data, 'dashboardworkshop3')) {
        redirect = '/dashboard/dashboardworkshop3'
      } else if (this.dashboardfor(data, 'dashboardstation')) {
        redirect = '/dashboard/dashboardstation'
      }

      if (this.$route.query.redirect) {
        redirect = this.$route.query.redirect
      }
      this.$router.push(redirect)
    },
    dashboardfor(data, page) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].icon == page) {
          return true
        }
      }
      return false
    }
  },
  created() {
    this.pagestart()
  }
}
</script>

<style scoped>
.classic-form-page {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10000;
  height: 100vh;
  width: 100%;
}

.classic-form-page .view {
  /* background-image: url("../../assets/AIOM-1.png"); */
  background-color: #eee;
  height: 100vh;
}

.card {
  background-color: rgba(229, 228, 255, 0.2);
}

.classic-form-page h6 {
  line-height: 1.7;
}

.classic-form-page .navbar {
  transition: background 0.5s ease-in-out, padding 0.5s ease-in-out;
}

.classic-form-page .navbar .md-form {
  margin: 0;
}
.loginbtm {
  background-color: #3c8dbc !important;
}

.top-nav-collapse {
  background: #424f95 !important;
}
.login-card {
  background-color: white;
  border-radius: 12px;
}
@media (max-width: 768px) {
  .classic-form-page .navbar:not(.top-nav-collapse) {
    background: #424f95 !important;
  }
}

.classic-form-page label {
  color: #fff !important;
}
</style>
