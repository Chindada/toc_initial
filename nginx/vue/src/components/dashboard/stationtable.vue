<template>
  <!-- <h2>下三個排程</h2> -->
  <!-- 卡片 -->
  <mdb-card class="mb-2">
    <mdb-card-body style="padding:0">
      <div class="table-responsive" style="margin-bottom:0">
        <table
          class="table table-bordered pclass"
          style="width:100%;border:2px ;text-align:center;"
        >
          <thead class="thead">
            <tr :bgcolor="color('next_schedule_title')" style="border:1px  solid;">
              <th scope="col" class="table1 " style="min-width:130px">
                {{ $t('schedule_number') }}
              </th>
              <th scope="col" class="table1 " style="max-width:290px">
                {{ $t('mold_number') }}
              </th>
              <th scope="col" class="table1 " style="min-width:150px">
                {{ $t('start_time') }}
              </th>
              <th scope="col" class="table1 " style="min-width:80px">
                {{ $t('qty') }}
              </th>
            </tr>
            <tr
              :bgcolor="number.color"
              class="shedule0"
              v-for="(number, key) in nextscheduledata"
              :key="key"
            >
              <th scope="col" style="padding-left:0px;padding-right:0px">
                {{ number.scheduleSerial }}
              </th>
              <th scope="col" style="padding:0px;max-width:290px">
                {{ number.moldNumber }}
              </th>
              <th scope="col" style="padding-left:0px;padding-right:0px">
                {{ number.startTime }}
              </th>
              <th scope="col" style="padding:0px">
                {{ number.qty }}
              </th>
            </tr>
          </thead>
        </table>
        <table
          class="table table-bordered phoneclass"
          style="width:100%;border:2px ;text-align:center;"
        >
          <thead class="thead">
            <tr :bgcolor="color('next_schedule_title')" style="border:1px  solid;">
              <th scope="col" class="table1 schedulenumber" style="max-width:20vw">
                {{ $t('schedule_number') }}
              </th>
              <th scope="col" class="table1 moldnumber" style="min-width:30vw;">
                {{ $t('mold_number') }}
              </th>
              <th scope="col" class="table1 starttime" style="max-width:25vw">
                {{ $t('start_time') }}
              </th>
              <th scope="col" class="table1 qty" style="min-width:25vw">
                {{ $t('qty') }}
              </th>
            </tr>
            <tr
              :bgcolor="number.color"
              class="shedule0"
              v-for="(number, key) in nextscheduledata"
              :key="key"
            >
              <th
                scope="col"
                class="schedulenumber"
                style="padding-left:0px;padding-right:0px;max-width:20vw"
              >
                {{ number.scheduleSerial }}
              </th>
              <th scope="col" class="moldnumber" style="padding:0px;max-width:30vw">
                {{ number.moldNumber }}
              </th>

              <th
                scope="col"
                class="starttime"
                style="padding-left:0px;padding-right:0px;max-width:30vw;min-width:94px"
              >
                {{ number.startTime }}
              </th>
              <th scope="col" class="qty" style="padding:0px;max-width:30vw">
                {{ number.qty }}
              </th>
            </tr>
          </thead>
        </table>
      </div>
    </mdb-card-body>
  </mdb-card>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      nextscheduledata: [
        {
          scheduleSerial: '-',
          moldName: '-',
          startTime: '-',
          qty: '-',
          color: this.color('next_schedule_one') //'#D2F1FF'
        },
        { scheduleSerial: '-', moldName: '-', startTime: '-', qty: '-' },
        { scheduleSerial: '-', moldName: '-', startTime: '-', qty: '-' }
      ]
    }
  },
  computed: {},
  mounted() {},
  props: ['nextschedule'],
  watch: {
    nextschedule: function(newval) {
      this.nextscheduledata = newval
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
  .table.table-bordered.pclass {
    display: none;
  }
  .table.table-bordered.phoneclass {
    display: block;
  }
}
/*手機橫式 */
@media only screen and (max-width: 950px) and (max-height: 500px) and (orientation: landscape) {
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
  .table.table-bordered.pclass {
    display: none;
  }
  .table.table-bordered.phoneclass {
    display: block;
  }
  .schedulenumber {
    padding-left: 0px;
    padding-right: 0px;
    max-width: 15vw;
    min-width: 25vw;
  }
  .moldnumber {
    padding: 0px;
    max-width: 30vw;
    min-width: 25vw;
  }
  .starttime {
    padding-left: 0px;
    padding-right: 0px;
    max-width: 15vw;
    min-width: 25vw;
  }
  .qty {
    max-width: 40vw;
    min-width: 25vw;
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
  .table.table-bordered.pclass {
    display: none;
  }
  .table.table-bordered.phoneclass {
    display: block;
  }
  .schedulenumber {
    padding-left: 0px;
    padding-right: 0px;
    max-width: 15vw;
    min-width: 25vw;
  }
  .moldnumber {
    padding: 0px;
    max-width: 30vw;
    min-width: 25vw;
  }
  .starttime {
    padding-left: 0px;
    padding-right: 0px;
    max-width: 15vw;
    min-width: 25vw;
  }
  .qty {
    max-width: 40vw;
    min-width: 25vw;
  }
}
/*平板橫式 */
@media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
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
  .table.table-bordered.pclass {
    display: none;
  }
  .table.table-bordered.phoneclass {
    display: block;
  }
  .schedulenumber {
    padding-left: 0px;
    padding-right: 0px;
    max-width: 15vw;
    min-width: 25vw;
  }
  .moldnumber {
    padding: 0px;
    max-width: 30vw;
    min-width: 25vw;
  }
  .starttime {
    padding-left: 0px;
    padding-right: 0px;
    max-width: 15vw;
    min-width: 25vw;
  }
  .qty {
    max-width: 40vw;
    min-width: 25vw;
  }
}
</style>
