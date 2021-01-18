<template>
  <b-container fluid>
    <mdb-card>
      <mdb-card-body>
        <!-- <div class="mx-3">
          <h2>模具管理</h2>
          <button id="btn" @click="btn_export()">匯出</button>
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
          :moldData="tabledata"
          :tabs="tabvalue"
          v-on:callparent="translateText"
        ></available-tab>
      </mdb-card-body>
    </mdb-card>
  </b-container>
</template>

<script>
import Available from '@/components/basicsetting/mold/moldAvailable' //一般
import { MoldAPI } from '@/plugins/basicapis.js'

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
      MoldAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
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
.moldnumberclass {
  max-width: 30px;
  text-align: center;
}
#eee.select-wrapper.md-form {
  margin-top: 0%;
}
.md-form .select-dropdown {
  margin-top: 0%;
  margin-bottom: 0%;
}
.select-wrapper.md-form {
  margin-top: 0%;
  margin-bottom: 0%;
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
