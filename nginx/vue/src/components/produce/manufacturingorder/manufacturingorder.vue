<template>
  <b-container fluid>
    <mdb-card>
      <mdb-card-body style="padding-bottom:0.5rem">
        <!-- <div class="mx-3">
          <h2>製令管理</h2>
        </div>-->
        <b-row>
          <b-col cols="8">
            <b-tabs
              active-nav-item-class="font-weight-bold text-uppercase "
              active-tab-class="font-weight-bold"
            >
              <b-tab
                :title="this.$t('tab_standby_to_schedule')"
                active
                @click="tabclickfunc('standby')"
              ></b-tab>
              <b-tab :title="this.$t('tab_in_schedule')" @click="tabclickfunc('scheduled')"></b-tab>
              <b-tab :title="this.$t('tab_in_task')" @click="tabclickfunc('tasked')"></b-tab>
              <b-tab :title="this.$t('tab_finished')" @click="tabclickfunc('finish')"></b-tab>
            </b-tabs>
          </b-col>
          <b-col cols="4" class="workshopselectclass">
            <div class="input-group">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01" style="width:160px">
                  {{ $t('workshop_machine') }}
                </label>
              </div>
              <b-form-select
                v-model="scearchworkshop"
                :options="workshopobject"
                @change="searchdata()"
                :disabled="isbusyflag"
              ></b-form-select>
            </div>
          </b-col>
        </b-row>
        <!-- <b-row style="position: absolute;width:100%">
          <b-col cols="4" class="timeselectclass">
            <div class="input-group">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01">{{
                  $t('produce_time_type')
                }}</label>
              </div>
              <b-form-select
                v-model="scearchtime"
                :options="timeobject"
                @change="searchdata()"
              ></b-form-select>
            </div>
          </b-col>
        </b-row>-->
        <b-row>
          <b-col cols="8"></b-col>
          <b-col cols="4">
            <div class="input-group">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01" style="width:160px">
                  {{ $t('produce_time_type') }}
                </label>
              </div>
              <b-form-select
                v-model="scearchtime"
                :options="timeobject"
                @change="searchdata()"
                :disabled="isbusyflag"
              ></b-form-select>
            </div>
          </b-col>
        </b-row>

        <standby-tab
          v-show="tableshow[0]"
          :workShopId="scearchworkshop"
          :scearchTime="scearchtime"
          :manufacturingorderData="tabledata"
          :tabs="tabvalue"
          :isbusyflag="isbusyflag"
          v-on:callparent="translateText"
        ></standby-tab>
        <schedule-tab
          v-show="tableshow[1]"
          :workShopId="scearchworkshop"
          :scearchTime="scearchtime"
          :manufacturingorderData="tabledata"
          :tabs="tabvalue"
          :isbusyflag="isbusyflag"
          v-on:callparent="translateText"
        ></schedule-tab>
        <tasked-tab
          v-show="tableshow[2]"
          :workShopId="scearchworkshop"
          :scearchTime="scearchtime"
          :manufacturingorderData="tabledata"
          :tabs="tabvalue"
          :isbusyflag="isbusyflag"
          v-on:callparent="translateText"
        ></tasked-tab>
        <finish-tab
          v-show="tableshow[3]"
          :workShopId="scearchworkshop"
          :scearchTime="scearchtime"
          :manufacturingorderData="tabledata"
          :tabs="tabvalue"
          :isbusyflag="isbusyflag"
          v-on:callparent="translateText"
        ></finish-tab>
      </mdb-card-body>
    </mdb-card>
  </b-container>
</template>

<script>
import manufacturingorderstandby from '@/components/produce/manufacturingorder/manufacturingorderstandby' //待轉排程
import manufacturingorderinschedule from '@/components/produce/manufacturingorder/manufacturingorderinschedule' //排程中
import manufacturingorderintask from '@/components/produce/manufacturingorder/manufacturingorderintask' //任務中
import manufacturingorderinfinished from '@/components/produce/manufacturingorder/manufacturingorderinfinished' //已完成
import naturalCompare from 'string-natural-compare'
import { ManufacturingorderallAPI } from '@/plugins/produceapis.js'
import { WorkShopAPI } from '@/plugins/basicapis.js'

export default {
  components: {
    'standby-tab': manufacturingorderstandby, //待轉排程
    'schedule-tab': manufacturingorderinschedule, //排程中
    'tasked-tab': manufacturingorderintask, //任務中
    'finish-tab': manufacturingorderinfinished //已完成
  },
  data() {
    var timeobject = [
      { text: this.$t('in_one_month'), value: 1 },
      { text: this.$t('in_three_month'), value: 3 },
      { text: this.$t('in_six_month'), value: 6 },
      { text: this.$t('in_twelve_month'), value: 12 },
      { text: this.$t('all'), value: -1 }
    ]
    var selectoption = {
      standby: { timetype: 1, workshop: -1 },
      scheduled: { timetype: 1, workshop: -1 },
      tasked: { timetype: 1, workshop: -1 },
      finish: { timetype: 1, workshop: -1 }
    }
    return {
      isbusyflag: true,
      selectoption, //選擇狀態暫存
      tableshow: [true, false, false, false],
      scearchtime: 1, //時間種類範圍
      timeobject,
      scearchworkshop: -1,
      workshopobject: [], //廠區選單

      standbytable: true,
      otherstable: false,
      tabvalue: 'standby',
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
    this.getworkshop()
    this.getdata()
  },
  methods: {
    //點擊tab更換模式
    tabclickfunc(value) {
      this.isbusyflag = true
      switch (value) {
        case 'standby':
          this.tableshow = [true, false, false, false]
          this.scearchtime = this.selectoption.standby.timetype
          this.scearchworkshop = this.selectoption.standby.workshop
          break
        case 'scheduled':
          this.tableshow = [false, true, false, false]
          this.scearchtime = this.selectoption.scheduled.timetype
          this.scearchworkshop = this.selectoption.scheduled.workshop
          break
        case 'tasked':
          this.tableshow = [false, false, true, false]
          this.scearchtime = this.selectoption.tasked.timetype
          this.scearchworkshop = this.selectoption.tasked.workshop
          break
        case 'finish':
          this.tableshow = [false, false, false, true]
          this.scearchtime = this.selectoption.finish.timetype
          this.scearchworkshop = this.selectoption.finish.workshop
          break
      }

      this.tabvalue = value
      this.searchdata()
    },
    //子元素新增編輯刪除重載資料
    translateText: function() {
      this.searchdata()
    },
    //搜尋資料
    searchdata() {
      this.isbusyflag = true
      switch (this.tabvalue) {
        case 'standby':
          this.selectoption.standby.workshop = this.scearchworkshop
          this.selectoption.standby.timetype = this.scearchtime
          break
        case 'scheduled':
          this.selectoption.scheduled.workshop = this.scearchworkshop
          this.selectoption.scheduled.timetype = this.scearchtime
          break
        case 'tasked':
          this.selectoption.tasked.workshop = this.scearchworkshop
          this.selectoption.tasked.timetype = this.scearchtime
          break
        case 'finish':
          this.selectoption.finish.workshop = this.scearchworkshop
          this.selectoption.finish.timetype = this.scearchtime
          break
      }
      this.getdata()
    },
    //取得製令資料
    getdata() {
      this.isbusyflag = true
      this.tabledata = []
      this.totalRows = 0
      var access_token_val = this.$cookies.get('access_token')
      let relstatus = 2
      switch (this.tabvalue) {
        case 'standby':
          relstatus = 2
          break
        case 'scheduled':
          relstatus = 1
          break
        case 'tasked':
          relstatus = 4
          break
        case 'finish':
          relstatus = 3
          break
      }

      ManufacturingorderallAPI.get({
        headers: {
          workShopId: this.scearchworkshop,
          status: relstatus,
          timeRange: this.scearchtime,
          access_token: access_token_val
        }
      }).then(
        res => {
          var proorder1 = []
          if (res.data != null) {
            res.data = this.dealdata(res.data)
            res.data.forEach(item => {
              proorder1.push(item)
            })
          }
          var temparray = JSON.parse(JSON.stringify(proorder1))
          temparray.sort((a, b) => naturalCompare(b.createdTimeshow, a.createdTimeshow))

          this.tabledata = temparray
          this.totalRows = proorder1.length

          this.isbusyflag = false
        },
        error => {
          this.isbusyflag = false
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    dealdata(data) {
      if (data != null) {
        data.forEach(item => {
          item.timestamp = item.deadLine
          if (item.createdTime === 0) {
            item.createdTimeshow = '0'
          } else {
            item.createdTimeshow = this.timeStampToStringFunc(item.createdTime, 'yyyy-mm-dd')
          }

          item.deadLine = this.timeStampToStringFunc(item.deadLine, 'yyyy-mm-dd')
          item.expectedTIme = this.timeStampToStringFunc(item.expectedTIme, 'yyyy-mm-dd')
          item.actualTime = this.timeStampToStringFunc(item.actualTime, 'yyyy-mm-dd')
        })
      }

      return data
    },
    //取得廠區
    getworkshop() {
      var access_token_val = this.$cookies.get('access_token')
      WorkShopAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          this.workshopobject = []
          this.workshopobject.push({
            text: this.$t('all'),
            value: -1
          })
          if (res.data != null) {
            res.data.forEach(item => {
              this.workshopobject.push({ text: item.name, value: item.id })
            })
          }
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
.timeselectclass {
  position: absolute;
  left: 910px;
  width: 422px;
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
