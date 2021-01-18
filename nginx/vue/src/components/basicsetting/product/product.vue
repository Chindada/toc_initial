<template>
  <b-container fluid>
    <mdb-card>
      <mdb-card-body>
        <!-- <div class="mx-3">
          <h2>製品管理</h2>
        </div> -->
        <b-tabs
          active-nav-item-class="font-weight-bold text-uppercase "
          active-tab-class="font-weight-bold"
        >
          <b-tab :title="this.$t('tab_normal')" active @click="tabclickfunc('availble')"> </b-tab>
          <b-tab :title="this.$t('tab_maintain')" @click="tabclickfunc('abnormal')"> </b-tab>
          <b-tab :title="this.$t('tab_disable')" @click="tabclickfunc('disable')"> </b-tab>
        </b-tabs>
        <available-tab
          :productData="tabledata"
          :tabs="tabvalue"
          v-on:callparent="translateText"
        ></available-tab>
      </mdb-card-body>
    </mdb-card>
  </b-container>
</template>

<script>
import Available from '@/components/basicsetting/product/productAvailable' //一般
import { ProductAPI } from '@/plugins/basicapis.js'
export default {
  components: {
    'available-tab': Available
  },

  data() {
    return {
      tabledata: [],
      tabvalue: 'availble'
    }
  },
  computed: {},
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
    tabclickfunc(value) {
      this.tabvalue = value
    },
    getdata() {
      var access_token_val = this.$cookies.get('access_token')
      ProductAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          if (res != null) {
            // res.data = this.dealdata(res.data)
            this.tabledata = res.data
          }
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    resetInfoModal() {
      this.infoModal.title = ''
      this.infoModal.content = ''
    },
    onFiltered(filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    }
  }
}
</script>
<style>
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
