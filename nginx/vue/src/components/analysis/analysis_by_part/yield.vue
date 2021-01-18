<template>
  <mdb-container fluid>
    <mdb-card>
      <mdb-card-body>
        <div class="mx-3">
          <h2>依模具-產量分析</h2>
        </div>
        <hr />
      </mdb-card-body>
    </mdb-card>
  </mdb-container>
</template>

<script>
export default {
  name: 'DatatablePage',
  components: {},
  methods: {
    handlePages(value) {
      this.pages = value
    },
    handleFields(value) {
      this.fields = value
    },
    getdata() {
      // this.tabledata = data;
      // console.log(tabledata);
    }
  },
  created() {
    this.getdata()
  },
  data() {
    return {
      pages: [],
      fields: [],
      tabledata: {}
    }
  }
}
</script>

<style>
.dataTables-scrollBody {
  max-height: 400px;
}
</style>
