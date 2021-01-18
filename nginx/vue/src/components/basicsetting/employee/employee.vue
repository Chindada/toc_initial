<template>
  <mdb-container fluid>
    <mdb-card>
      <mdb-card-body>
        <!-- <div class="mx-3">
          <h2>人員管理</h2>
        </div> -->
        <b-tabs
          active-nav-item-class="font-weight-bold text-uppercase "
          active-tab-class="font-weight-bold"
        >
          <b-tab :title="this.$t('employee_schedule_tab')" active>
            <schedule-tab></schedule-tab>
          </b-tab>
          <b-tab :title="this.$t('employee_class_tab')">
            <class-tab></class-tab>
          </b-tab>
          <b-tab :title="this.$t('employee_holiday_tab')">
            <holiday-tab></holiday-tab>
          </b-tab>
        </b-tabs>
      </mdb-card-body>
    </mdb-card>
  </mdb-container>
</template>

<script>
// import $ from "jquery";
import Class from '@/components/basicsetting/employee/class'
import Holiday from '@/components/basicsetting/employee/holiday'
import Schedule from '@/components/basicsetting/employee/schedule'

export default {
  // name: "DatatablePage",
  name: 'MaterialInputGroupsSizes',
  components: {
    'class-tab': Class,
    'holiday-tab': Holiday,
    'schedule-tab': Schedule
  },
  methods: {
    handlePages(value) {
      this.pages = value
    },
    handleFields(value) {
      this.fields = value
    }
  },
  created() {
    // console.log(this.$("#test"));
  },
  mounted() {},
  data() {
    return {
      pages: [],
      fields: []
    }
  }
}
</script>

<style>
.dataTables-scrollBody {
  max-height: 400px;
}
table.table td {
  vertical-align: middle;
  padding-top: 0;
  padding-bottom: 0rem;
}
.tab-content {
  padding-top: 0%;
}
</style>
