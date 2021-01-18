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
                  <div style="text-align:center">
                    <img alt="AIOM" class="img-center" width="100%" src="../../assets/404-2.png" />
                    <mdb-btn class="loginbtm" v-on:click="back">Back</mdb-btn>
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
export default {
  components: {},
  data() {},
  methods: {
    back() {
      history.go(-1)
    }
  },
  created() {}
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
