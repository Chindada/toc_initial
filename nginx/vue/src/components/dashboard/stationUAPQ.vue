<template>
  <!-- <h2>UAPQ</h2> -->
  <!-- 卡片 -->
  <div class="card mb-2">
    <div class="card-body" style="padding-top:0.5rem;padding-bottom: 0rem;">
      <div class="pcclass">
        <div class="tooltip1" style="right: 0;">
          ?
          <div class="tooltiptext1" style="text-align:left">
            <div>U : {{ $t('dashboardstation_u') }}</div>
            <div>A : {{ $t('dashboardstation_a') }}</div>
            <div>P : {{ $t('dashboardstation_p') }}</div>
            <div>S : {{ $t('dashboardstation_s') }}</div>
            <div>{{ $t('dashboardstation_top') }}</div>
            <div>{{ $t('dashboardstation_bottom') }}</div>
          </div>
        </div>
        <!-- UAPQ -->
        <div>
          <b-row>
            <!-- U -->
            <b-col style=" position:relative">
              <div id="chartdivU" style="height:100px;text-align:center;"></div>
              <h2 class="fulldayUAPQclass" :style="{ color: this.color('red') }">
                {{ fulldayUAPQ.u }}
              </h2>
              <h1 class="fulldayUAPQtitleclass">U</h1>
            </b-col>
            <!-- A -->
            <b-col>
              <div id="chartdivA" style="height:100px;text-align:center;"></div>
              <h2 class="fulldayUAPQclass" :style="{ color: this.color('red') }">
                {{ fulldayUAPQ.a }}
              </h2>
              <h1 class="fulldayUAPQtitleclass">A</h1>
            </b-col>
            <!-- P -->
            <b-col>
              <div id="chartdivP" style="height:100px;text-align:center;"></div>
              <h2 class="fulldayUAPQclass" :style="{ color: this.color('red') }">
                {{ fulldayUAPQ.p }}
              </h2>
              <h1 class="fulldayUAPQtitleclass">P</h1>
            </b-col>
            <!-- Q -->
            <b-col>
              <div id="chartdivQ" style="height:100px;text-align:center;"></div>
              <h2 class="fulldayUAPQclass" :style="{ color: this.color('red') }">
                {{ fulldayUAPQ.q }}
              </h2>
              <h1 class="fulldayUAPQtitleclass">S</h1>
            </b-col>
          </b-row>
        </div>
      </div>
      <div class="phoneclass">
        <div class="tooltip1" style="right: 0;position:absolute ">
          ?
          <div class="tooltiptext1" style="text-align:left">
            <div>U : {{ $t('dashboardstation_u') }}</div>
            <div>A : {{ $t('dashboardstation_a') }}</div>
            <div>P : {{ $t('dashboardstation_p') }}</div>
            <div>S : {{ $t('dashboardstation_s') }}</div>
            <div>{{ $t('dashboardstation_top') }}</div>
            <div>{{ $t('dashboardstation_bottom') }}</div>
          </div>
        </div>
        <b-row>
          <!-- U -->
          <b-col style=" position:relative">
            <div id="chartdiv1U" style="height:100px;text-align:center;"></div>
            <h2 class="fulldayUAPQclass" :style="{ color: this.color('red') }">
              {{ fulldayUAPQ.u }}
            </h2>
            <h1 class="fulldayUAPQtitleclass">U</h1>
          </b-col>
          <!-- A -->
          <b-col>
            <div id="chartdiv1A" style="height:100px;text-align:center;"></div>
            <h2 class="fulldayUAPQclass" :style="{ color: this.color('red') }">
              {{ fulldayUAPQ.a }}
            </h2>
            <h1 class="fulldayUAPQtitleclass">A</h1>
          </b-col>
        </b-row>
        <b-row>
          <!-- P -->
          <b-col>
            <div id="chartdiv1P" style="height:100px;text-align:center;"></div>
            <h2 class="fulldayUAPQclass" :style="{ color: this.color('red') }">
              {{ fulldayUAPQ.p }}
            </h2>
            <h1 class="fulldayUAPQtitleclass">P</h1>
          </b-col>
          <!-- Q -->
          <b-col>
            <div id="chartdiv1Q" style="height:100px;text-align:center;"></div>
            <h2 class="fulldayUAPQclass" :style="{ color: this.color('red') }">
              {{ fulldayUAPQ.q }}
            </h2>
            <h1 class="fulldayUAPQtitleclass">S</h1>
          </b-col>
        </b-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      fulldayUAPQdata: {
        u: 0,
        a: 0,
        p: 0,
        q: 0
      }
    }
  },
  computed: {},
  mounted() {},
  props: ['fulldayUAPQ'],
  watch: {
    fulldayUAPQ: function(newval) {
      this.fulldayUAPQdata = newval //設定頁數
    }
  },
  created() {},
  methods: {}
}
</script>
<style>
.el-progress-bar__outer {
  height: 4px !important;
}
</style>
<!-- Add 'scoped" attribute to limit CSS to this component only -->
<style scoped>
.table1 {
  border: 1px solid;
  color: white;
  padding-left: 0px;
  padding-right: 0px;
  max-height: 60px !important;
  height: 60px !important;
}
.progressline {
  margin-bottom: 1rem;
}
.tooltip1 {
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
.fulldayUAPQtitleclass {
  position: absolute;
  top: -10px;
  left: 1rem;
  margin: 0.2rem;
}
.fulldayUAPQclass {
  /*
  text-align: center;
  vertical-align: top; */
  font-size: 25.5px;
  position: absolute;
  top: -10px;
  right: 1rem;
  margin: 0.2rem;
}
.card-header {
  padding: 0.4rem 0.75rem;
  border-bottom: 0px;
}
.cascading-admin-card {
  margin-top: 0px;
  /* width: 600px; */
}
.headerclass {
  width: 100%;
  color: #fff;
  font-size: 1.1rem;
  position: absolute;
}

.headerclasstext {
  color: #fff;
  font-size: 1.1rem;
}
.rowclass {
  margin-bottom: 5px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(175px, 1fr));
  margin: 5px;
  margin-left: 0px;
}

.alignright {
  float: right;
}
.title-body {
  padding-top: 0px;
  padding-bottom: 0px;
}
.totoal-val {
  font-weight: bolder;
  text-align: center;
  margin-bottom: 0px;
}
.totoal-title {
  border-radius: 0px 0px 5px 5px;
  font-weight: bolder;
  color: #fff;
  text-align: center;
  padding-top: 0px;
  padding-bottom: 0px;
}

.circle {
  text-align: center;
  border: 10px solid green;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  width: 250px;
  height: 250px;

  margin: auto;
}
.md-progress .progress-bar {
  height: 100% !important;
}
.hideclass {
  opacity: 0;
}
.fullscreen-head {
  width: 100%;
  display: -ms-grid;
  display: grid;
  -ms-grid-columns: 145px 250px 1fr 250px 145px;
  grid-template-columns: 145px 250px 1fr 250px 145px;
  grid-row-gap: 10px;
  margin-bottom: 5px;
  /* height: 40px; */
  /* position: relative; */
}
.fullscreen-main-slogan {
  text-align: center;
  color: #000;
  font-size: 59px;
  font-weight: 900;
}
.fullscreen-main-time {
  margin: auto;
  color: #000;
  font-size: 30px;
  margin: auto;
  font-weight: 900;
}
.title-body.card-body {
  padding-right: 5px;
  padding-left: 5px;
}
@-webkit-keyframes fade {
  from {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.blink {
  color: red;
  animation: fade 500ms infinite;
}
.pcclass {
  display: block;
}
.phoneclass {
  display: none;
}
.tworow {
  display: none;
}
/*手機直式 */
@media only screen and (max-width: 500px) and (max-height: 950px) and (orientation: portrait) {
  .pcclass {
    display: none;
  }
  .phoneclass {
    display: block;
  }
  .onerow {
    display: none;
  }
  .tworow {
    display: block;
  }

  .container-fluid {
    padding: 0px;
    width: 100vw;
  }
}
/*手機橫式 */
@media only screen and (max-width: 950px) and (max-height: 500px) and (orientation: landscape) {
  .onerow {
    display: block;
  }
  .tworow {
    display: none;
  }
  .pcclass {
    display: none;
  }
  .phoneclass {
    display: block;
  }
  .container-fluid {
    padding-left: 0px;
    padding-right: 30px;
    /* width: 100vw; */
  }
}

/*平板直式 */
@media screen and (min-width: 768px) and (max-width: 1024px) {
  .pcclass {
    display: none;
  }
  .phoneclass {
    display: block;
  }
  .onerow {
    display: none;
  }
  .tworow {
    display: block;
  }

  .container-fluid {
    padding: 0px;
    width: 100vw;
  }
}
/*平板橫式 */
@media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
  .onerow {
    display: block;
  }
  .tworow {
    display: none;
  }
  .pcclass {
    display: none;
  }
  .phoneclass {
    display: block;
  }
}
</style>
