<template>
  <b-container fluid>
    <mdb-card>
      <mdb-card-body>
        <!-- <div class="mx-3">
          <h2>設備管理</h2>
        </div> -->
        <b-tabs
          active-nav-item-class="font-weight-bold text-uppercase "
          active-tab-class="font-weight-bold"
        >
          <b-tab :title="this.$t('tab_normal')" active @click="tabclickfunc('availble')"> </b-tab>
          <b-tab :title="this.$t('tab_maintain')" @click="tabclickfunc('abnormal')">
            <!-- <available-tab
              :tabs="tabvalue"
              :machineData="tabledata"
              v-on:callparent="translateText"
            ></available-tab> -->
          </b-tab>
          <b-tab :title="this.$t('tab_disable')" @click="tabclickfunc('disable')">
            <!-- <available-tab
              :tabs="tabvalue"
              :machineData="tabledata"
              v-on:callparent="translateText"
            ></available-tab> -->
          </b-tab>
        </b-tabs>
        <available-tab
          :tabs="tabvalue"
          :machineData="tabledata"
          v-on:callparent="translateText"
        ></available-tab>
      </mdb-card-body>
    </mdb-card>
  </b-container>
</template>

<script>
import Available from '@/components/basicsetting/machine/machineAvailable' //一般
import { MachineAPI } from '@/plugins/basicapis.js'
export default {
  components: {
    'available-tab': Available
  },
  data() {
    return {
      tabvalue: 'availble',
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
    //點擊tab
    tabclickfunc(value) {
      this.tabvalue = value
    },
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
      MachineAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          if (res.data != null) {
            res.data = this.dealdata(res.data)
          }
          this.tabledata = res.data
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //處理時間
    dealdata(data) {
      if (data != null) {
        data.forEach(item => {
          item.purchasDate = this.timeStampToStringFunc(item.purchasDate, 'yyyy-mm-dd')
          item.manufactureDate = this.timeStampToStringFunc(item.manufactureDate, 'yyyy-mm-dd')
          item.lastUpdateTime = this.timeStampToStringFunc(item.lastUpdateTime, 'yyyy-mm-dd')
        })
      }

      return data
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
table.table th {
  font-size: 1.1rem;
  vertical-align: middle !important;
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
