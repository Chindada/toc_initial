<template>
  <b-container fluid>
    <mdb-card>
      <mdb-card-body>
        <!-- <div class="mx-3">
          <h2>廠區管理</h2>
        </div>-->
        <b-tabs
          active-nav-item-class="font-weight-bold text-uppercase "
          active-tab-class="font-weight-bold"
        >
          <b-tab :title="this.$t('workshop_machine')" active @click="tabclickfunc(0)"></b-tab>
          <!-- <b-tab :title="this.$t('basicsetting_workshoptype')" @click="tabclickfunc(1)"> </b-tab> -->
        </b-tabs>
        <workshop-tab
          v-if="this.tabvalue == 0"
          :tabs="tabvalue"
          v-on:callparent="translateText"
        ></workshop-tab>
        <!-- <workshopType-tab
          v-if="this.tabvalue == 1"
          :tabs="tabvalue"
          v-on:callparent="translateText"
        ></workshopType-tab>-->
      </mdb-card-body>
    </mdb-card>
  </b-container>
</template>

<script>
import Workshop from '@/components/basicsetting/workshop/workshop' //廠區管理
// import WorkshopType from '@/components/basicsetting/workshop/workshoptype' //廠別管理
export default {
  components: {
    'workshop-tab': Workshop
    // 'workshopType-tab': WorkshopType,
  },

  data() {
    return {
      // tabledata: [],
      tabvalue: 0
    }
  },
  computed: {},
  mounted() {
    // Set the initial number of items
    // this.totalRows = this.items.length;
  },
  created() {
    // this.getdata()
  },
  methods: {
    //子元素新增編輯刪除重載資料
    translateText: function() {
      // this.getdata()
    },
    tabclickfunc(value) {
      this.tabvalue = value
    },
    // getdata() {
    //   var access_token_val = this.$cookies.get('access_token')
    //   ProductAPI.get({
    //     headers: {
    //       access_token: access_token_val
    //     }
    //   }).then(
    //     res => {
    //       if (res != null) {
    //         // res.data = this.dealdata(res.data)
    //         this.tabledata = res.data
    //       }
    //     },
    //     error => {
    //       console.log(error.response)
    //       this.$layer.msg(this.$t('fail') + error.response.data.response)
    //     }
    //   )
    // },
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
