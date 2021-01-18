<template>
  <b-container fluid>
    <mdb-card>
      <mdb-card-body>
        <!-- <div class="mx-3">
          <h2>原料管理</h2>
        </div> -->
        <b-tabs
          active-nav-item-class="font-weight-bold text-uppercase "
          active-tab-class="font-weight-bold"
        >
          <b-tab :title="this.$t('tab_normal')" active>
            <available-tab
              :meterialData="tabledata"
              v-on:callparent="translateText"
            ></available-tab>
          </b-tab>
        </b-tabs>
      </mdb-card-body>
    </mdb-card>
  </b-container>
</template>

<script>
import { MaterialAPI } from '@/plugins/basicapis.js'
import Available from '@/components/basicsetting/material/materialAvailable' //一般

export default {
  components: {
    'available-tab': Available
  },
  data() {
    return {
      tabledata: []
    }
  },
  computed: {
    sortOptions() {
      // Create an options list from our fields
      return this.fields
        .filter(f => f.sortable)
        .map(f => {
          return { text: f.label, value: f.key }
        })
    }
  },
  mounted() {
    // Set the initial number of items
    // this.totalRows = this.items.length;
  },
  created() {
    this.getdata()
  },
  methods: {
    //子元素新增編輯刪除重載資料
    translateText: function() {
      this.getdata()
    },
    //modal背景點擊不關閉
    closemodal(value) {
      if (value == undefined) {
        this.modal = false
      }
    },
    getdata() {
      var access_token_val = this.$cookies.get('access_token')
      MaterialAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          this.availble_total = 0
          this.tabledata = res.data
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    }
  }
}
</script>

<style>
.tab-content {
  padding: 0rem !important;
  padding-top: 0rem !important;
}
.moldnumberclass {
  max-width: 30px;
  text-align: center;
}

#mobile {
  display: none;
}
table.table td {
  vertical-align: middle;
  padding-top: 0;
  padding-bottom: 0rem;
}
@media (max-width: 768px) {
  #pc {
    display: none;
  }
  #mobile {
    display: block;
  }
}
</style>
