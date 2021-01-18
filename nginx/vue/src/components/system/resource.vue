<template>
  <mdb-container fluid>
    <mdb-card>
      <mdb-card-body>
        <div class="mx-3">
          <h2>資源列表</h2>
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
            label: '設備編號',
            field: '設備編號',
            sort: 'asc'
          },
          {
            label: '名稱',
            field: '名稱',
            sort: 'asc'
          },
          {
            label: '品牌',
            field: '品牌',
            sort: 'asc'
          },
          {
            label: '型號',
            field: '型號',
            sort: 'asc'
          },
          {
            label: '射出量(g)',
            field: '射出量(g)',
            sort: 'asc'
          },
          {
            label: '最大射壓(bar)',
            field: '最大射壓(bar)',
            sort: 'asc'
          },
          {
            label: '鎖模力(ton)',
            field: '鎖模力(ton)',
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
