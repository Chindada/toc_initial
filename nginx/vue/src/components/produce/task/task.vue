<template>
  <b-container fluid>
    <mdb-card>
      <mdb-card-body style="padding-bottom:0.5rem">
        <!-- <div class="mx-3">
          <h2>任務管理</h2>
        </div> -->
        <b-row>
          <b-col>
            <b-tabs
              active-nav-item-class="font-weight-bold text-uppercase "
              active-tab-class="font-weight-bold"
            >
              <b-tab :title="this.$t('tab_in_task')" @click="tabclickfunc(1)"> </b-tab>
              <b-tab :title="this.$t('tab_finished')" @click="tabclickfunc(2)">
                <!-- <finish-tab
              :taskData="tabledata"
              v-on:callparent="translateText"
            ></finish-tab> -->
              </b-tab>
            </b-tabs>
          </b-col>
          <b-col cols="4" class="workshopselectclass">
            <div class="input-group">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01" style="width:160px">{{
                  $t('workshop_machine')
                }}</label>
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
        <b-row>
          <b-col cols="8"></b-col>
          <b-col cols="4">
            <div class="input-group">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01" style="width:160px">{{
                  $t('produce_time_type')
                }}</label>
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
        <running-tab
          :tabs="tabvalue"
          :isbusyflag="isbusyflag"
          :taskData="tabledata"
          v-on:callparent="translateText"
        ></running-tab>
      </mdb-card-body>
    </mdb-card>
  </b-container>
</template>

<script>
// import taskfinish from '@/components/produce/task/taskfinish'
import taskrunning from '@/components/produce/task/taskrunning'
import { WorkShopAPI } from '@/plugins/basicapis.js'
// import url from '@/router/index.js' //取得router裡SRV url
import { ScheduleMultiAPI, TaskallAPI } from '@/plugins/produceapis.js'
export default {
  components: {
    // 'finish-tab': taskfinish,
    'running-tab': taskrunning
  },
  data() {
    var timeobject = [
      { text: this.$t('in_one_month'), value: 1 },
      { text: this.$t('in_three_month'), value: 3 },
      { text: this.$t('in_six_month'), value: 6 },
      { text: this.$t('in_twelve_month'), value: 12 },
      { text: this.$t('all'), value: -1 }
    ]
    var selectoption = [
      { timetype: -1, workshop: -1 },
      { timetype: 1, workshop: -1 }
    ]
    return {
      selectoption, //選擇狀態暫存
      isbusyflag: true,
      scearchtime: -1, //時間種類範圍
      timeobject,
      scearchworkshop: -1,
      workshopobject: [], //廠區選單

      tabvalue: 1,
      scheduleidstring: '',
      scheduleobject: [],
      scheduleoption: [],
      tabledata: [],
      task_total: 0,
      finished_total: 0
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
    this.getworkshop()
    this.getdata()
  },
  methods: {
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
    },
    //點擊tab
    tabclickfunc(value) {
      this.scearchtime = this.selectoption[value - 1].timetype
      this.scearchworkshop = this.selectoption[value - 1].workshop
      this.tabvalue = value
      this.searchdata()
    },
    //搜尋資料
    searchdata() {
      this.isbusyflag = true
      this.selectoption[this.tabvalue - 1].timetype = this.scearchtime
      this.selectoption[this.tabvalue - 1].workshop = this.scearchworkshop

      this.getdata()
    },
    //子元素新增編輯刪除重載資料
    translateText: function() {
      this.getdata()
    },
    getschedulebyids(taskdata) {
      var access_token_val = this.$cookies.get('access_token')
      ScheduleMultiAPI.get({
        headers: {
          access_token: access_token_val,
          ids: this.scheduleidstring
        }
      }).then(
        res => {
          res.data.forEach(item => {
            for (var i = 0; i < taskdata.length; i++) {
              if (taskdata[i].scheduleId == item.id) {
                taskdata[i].scheduleSerial = item.scheduleSerial
                taskdata[i].scheduleobject = item
              }
            }
          })
          this.tabledata = taskdata
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //取得資料
    getdata() {
      var access_token_val = this.$cookies.get('access_token')

      TaskallAPI.get({
        headers: {
          workShopId: this.scearchworkshop,
          status: this.tabvalue,
          timeRange: this.scearchtime,
          access_token: access_token_val
        }
      }).then(
        res => {
          if (res.data != null) {
            res.data = this.dealdata(res.data)
            res.data.forEach(item => {
              this.scheduleidstring += item.scheduleId + ','
              item.startTime = this.timeStampToStringFunc(item.startTime, 'yyyy-mm-dd hh:mm')
              item.endTime = this.timeStampToStringFunc(item.endTime, 'yyyy-mm-dd hh:mm')
            })
            let temparray = []
            res.data.forEach(item => {
              temparray.push(item)
            })
            this.totalRows = temparray.length

            this.scheduleidstring =
              this.scheduleidstring.substring(0, this.scheduleidstring.length - 1) + ']'
            this.tabledata = temparray
          } else {
            this.tabledata = []
          }

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
      this.task_total = 0
      this.finished_total = 0
      if (data != null) {
        data.forEach(item => {
          if (item.status == 1) {
            //任務中
            this.task_total += 1
          } else if (item.status == 2) {
            //已完成
            this.finished_total += 1
          }
        })
      }

      this.task_total = this.dealThousands('0', this.task_total)
      this.finished_total = this.dealThousands('0', this.finished_total)
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
@media (max-width: 768px) {
  #pc {
    display: none;
  }
  #mobile {
    display: block;
  }
}
</style>
