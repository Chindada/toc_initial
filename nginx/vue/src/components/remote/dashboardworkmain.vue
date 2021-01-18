<template>
  <div>
    <class-tab1 v-if="dashboardtype == 1"></class-tab1>
    <!-- <class-tab2 v-if="ver2"></class-tab2> -->
    <class-tab2 v-if="dashboardtype == 2"></class-tab2>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { KanbanModeAPI } from '@/plugins/dashboardapis.js'
import original from '@/components/remote/dashboardworkshop'
import cus1 from '@/components/dashboard/dashboardworkshopCustom1'

export default {
  components: {
    'class-tab1': original,
    'class-tab2': cus1
    // mdbSelect,
  },
  data() {
    return {
      // ver1: true, //一般即時看版
      // ver2: false //客製化即時看版
      dashboardtype: 1 //看板種類
    }
  },
  computed: {
    ...mapState({
      authority: state => state.ver
    }),
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key }
        })
    }
  },
  created() {
    this.getdashboardmode()
  },
  mounted() {},
  methods: {
    //設定權限
    iniright(mode) {
      this.dashboardtype = mode
    },
    //取得看本模式
    getdashboardmode() {
      KanbanModeAPI({
        headers: {}
      }).then(
        res => {
          /********************* */
          /********************* */
          /********************* */
          /********************* */
          /********************* */
          res.data.mode = '1'
          /********************* */
          /********************* */
          /********************* */
          /********************* */
          /********************* */
          if (res.data.mode == '2') {
            this.iniright(2) //客製化看板
          } else {
            this.iniright(1) //一般看板
          }
        },
        error => {
          //失敗設定一般看板
          console.log(error)
          this.iniright(1)
        }
      )
    }
  }
}
</script>
<style padding></style>
