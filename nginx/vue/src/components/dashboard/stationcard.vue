<template>
  <!-- <h2>單站卡片</h2> -->
  <!-- 卡片 -->
  <mdb-card class="mb-2" style="min-height:500px;">
    <mdb-card-body class="cardbody" style="">
      <span style="margin: 0px auto;">
        <mdb-card class="cascading-admin-card">
          <!-- 閃爍 members.animation    class="blink"  "-->
          <mdb-card-header
            v-bind:style="{
              backgroundColor: machineobjectonboard.color
            }"
            :class="{ headerclass: true, blink: machineobjectonboard.animation }"
          >
            <b-row>
              <b-col>
                <span>
                  <h3 style="opacity: 0;">1</h3>
                </span>
              </b-col>
              <b-col>
                <span class="alignright">
                  <h3 style="opacity: 0;">1</h3>
                </span>
              </b-col>
            </b-row>
          </mdb-card-header>
          <!-- end閃爍 -->
          <!-- title -->
          <mdb-card-header class="headerclass">
            <b-row>
              <b-col>
                <span>
                  <h3>{{ machineobjectonboard.machineNumber }}</h3>
                </span>
              </b-col>
              <b-col>
                <span class="alignright">
                  <h3>{{ machineobjectonboard.machineName }}</h3>
                </span>
              </b-col>
            </b-row>
          </mdb-card-header>
          <!-- end title -->
          <!-- 撐開header -->
          <mdb-card-header class="headerclasstext">
            <b-row>
              <b-col>
                <span>
                  <h3 style="opacity: 0;">1</h3>
                </span>
              </b-col>
              <b-col>
                <span class="alignright">
                  <h3 style="opacity: 0;">1</h3>
                </span>
              </b-col>
            </b-row>
          </mdb-card-header>
          <!-- end 撐開header -->

          <mdb-card-body class="title-body">
            <div>
              <b-row style="padding:1rem;padding-top:2rem;">
                <b-col style="width:50%;padding-right: 0px;">
                  <div class="alignleft">
                    <h3>{{ machineobjectonboard.leftup1 }}</h3>
                  </div>
                  <div class="alignleft">
                    <h3>{{ machineobjectonboard.leftup2 }}</h3>
                  </div>
                </b-col>
                <b-col style="width:50%;">
                  <span class="alignright">
                    <h3>{{ machineobjectonboard.rightup }}</h3>
                  </span>
                </b-col>
              </b-row>
            </div>
            <div>
              <div
                class="circle"
                v-bind:style="{
                  borderColor: machineobjectonboard.citclecolor
                }"
              >
                <span>
                  <h3>{{ machineobjectonboard.middleone }}</h3>
                </span>
                <span>
                  <h3>{{ machineobjectonboard.middletwo }}</h3>
                </span>
                <span>
                  <h3>{{ machineobjectonboard.middlethree }}</h3>
                </span>
                <span>
                  <h3>{{ machineobjectonboard.middlefour }}</h3>
                </span>
              </div>
            </div>
            <div>
              <b-row style="padding:1rem;padding-bottom:1rem;padding-top:0.5rem;">
                <b-col>
                  <span class="alignleft">
                    <h3>{{ machineobjectonboard.leftdown }}</h3>
                  </span>
                </b-col>
                <b-col>
                  <span
                    class="alignright"
                    :class="{
                      hideclass: machineobjectonboard.showqtyandbar
                    }"
                  >
                    <h3>{{ machineobjectonboard.rightdown }}</h3>
                  </span>
                </b-col>
              </b-row>
            </div>
            <el-progress
              class="progressline"
              :class="{ hideclass: machineobjectonboard.showqtyandbar }"
              :percentage="machineobjectonboard.progress"
              :color="machineobjectonboard.progresscolor"
              :show-text="false"
            ></el-progress>
          </mdb-card-body>
        </mdb-card>
      </span>
    </mdb-card-body>
  </mdb-card>
</template>

<script>
export default {
  components: {},
  data() {
    let machineobjectonboard = {
      accmulationQty: '0',
      color: this.color('gray'), //'#808080',
      id: 0,
      machineName: '',
      machineNumber: '',
      progress: 0,
      progresscolor: 'blue',
      leftup1: '',
      leftup2: '',
      leftdown: '',
      rightup: '',
      rightdown: '',
      middleone: '- / -',
      middletwo: '',
      middlethree: '0h 0m',
      middlefour: '0h 0m',
      showqtyandbar: false,
      status: 0,
      citclecolor: this.color('gray') //'#808080'
    }
    return {
      machineobjectonboard
    }
  },
  computed: {},
  mounted() {},
  props: ['machineobjectonboarddata'],
  watch: {
    machineobjectonboarddata: function(newval) {
      this.machineobjectonboard = newval //設定頁數
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
.phoneclass {
  display: none;
}
.tworow {
  display: none;
}
.cardbody {
  padding-top: 10px;
  padding-bottom: 0px;
}
/*手機直式 */
@media only screen and (max-width: 500px) and (max-height: 950px) and (orientation: portrait) {
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
  .cardbody {
    padding-top: 10px;
    padding-bottom: 10px;
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
  .cardbody {
    padding-top: 10px;
    padding-bottom: 10px;
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
