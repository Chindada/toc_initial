<template>
  <mdb-container fluid>
    <!-- <h2>單站看版</h2> -->

    <section class="section">
      <mdb-row>
        <div>
          <h1>{{ text }}</h1>
        </div>
      </mdb-row>
    </section>
    <!-- /.Section: data tables -->
  </mdb-container>
</template>

<script>
import { gettxtversion } from '@/plugins/basicapis.js'
export default {
  name: 'Dashboardv2',
  components: {},

  data() {
    return {
      text: ''
    }
  },
  created() {
    this.inidata()
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    inidata() {
      gettxtversion({
        headers: {}
      }).then(res => {
        this.settext(res.data)
      })
    },
    settext(value) {
      this.text = value
      // this.text = '----------'
    }
  }
}
</script>

<!-- Add 'scoped" attribute to limit CSS to this component only -->
<style scoped>
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
  color: red;
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
</style>
