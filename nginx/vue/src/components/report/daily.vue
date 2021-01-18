<template>
  <div>
    <class-tab3 v-if="ver3"></class-tab3>
    <class-tab1 v-if="ver1"></class-tab1>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ClassIPS from '@/components/report/dailyreport'
// import ClassOEEplus from '@/components/produce/scheduleOEEplus/schedule'
import ClassOEE from '@/components/report/dailyreportOEE'

export default {
  components: {
    'class-tab1': ClassIPS,
    'class-tab3': ClassOEE
    // mdbSelect,
  },
  data() {
    return {
      ver1: false,
      ver2: false,
      ver3: false
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
    this.iniright()
  },
  mounted() {},
  methods: {
    //設定權限
    iniright() {
      var Value = localStorage.getItem('version')

      if (Value == '"1"') {
        this.ver3 = true
      }
      if (Value == '"2"' || Value == '"3"') {
        this.ver1 = true
      }
    }
  }
}
</script>
<style padding></style>
