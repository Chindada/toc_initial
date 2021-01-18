<template>
  <mdb-container fluid>
    <mdb-card>
      <mdb-card-body>
        <div class="mx-3">
          <h2>用戶管理</h2>
          <mdb-datatable
            :data="tabledata"
            bordered
            materialInputs
            @pages="handlePages"
            @fields="handleFields"
          />
          <!-- <mdb-csv-downloader :data="pages" :fields="fields" :color="'primary'" :display="3" /> -->
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
      var data = {
        columns: [
          {
            label: '用戶帳號',
            field: '用戶帳號',
            sort: 'asc'
          },
          {
            label: '名稱',
            field: '名稱',
            sort: 'asc'
          },
          {
            label: 'E-Mail',
            field: 'E-Mail',
            sort: 'asc'
          },
          {
            label: '狀態',
            field: '狀態',
            sort: 'asc'
          },
          {
            label: this.$t('operating'),
            field: '操作',
            sort: 'asc'
          }
        ]
      }
      this.tabledata = data
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
