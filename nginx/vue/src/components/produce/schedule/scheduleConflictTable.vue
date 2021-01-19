<template>
  <div>
    <mdb-modal
      v-if="scheduleConflict"
      @close="scheduleConflict = false"
      size="lg"
      class="editmodal"
    >
      <form>
        <mdb-modal-header>
          <mdb-modal-title>{{ $t('schedule') }}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body class="errorModal">
          <b-table
            class="table-responsive-error"
            responsive
            bordered
            :items="scheduleConflictArray"
            :fields="scheduleConflictfields"
          >
            <template v-slot:cell(moldConflict)="row">
              <template v-if="row.item.moldConflict.length > 0">
                <div
                  v-for="(item, index) in row.item.moldConflict"
                  :key="index"
                  class="tooltipConflictMain"
                >
                  {{ item.scheduleNumber }}
                  <span style="display: inline-block">
                    <div class="tooltipConflict">
                      ?
                      <div class="tooltipConflictText" style="text-align:left">
                        <div>{{ $t('schedule_start_time') }} : {{ item.startTime }}</div>
                        <div>{{ $t('schedule_end_time') }} : {{ item.endTime }}</div>
                      </div>
                    </div>
                  </span>
                </div>
              </template>
              <template v-else>
                {{ '-' }}
              </template>
            </template>
            <template v-slot:cell(machineConflict)="row">
              <template v-if="row.item.machineConflict.length > 0">
                <div
                  v-for="(item, index) in row.item.machineConflict"
                  :key="index"
                  class="tooltipConflictMain"
                >
                  {{ item.scheduleNumber }}
                  <span style="display: inline-block">
                    <div class="tooltipConflict">
                      ?
                      <div class="tooltipConflictText" style="text-align:left">
                        <div>{{ $t('schedule_start_time') }} : {{ item.startTime }}</div>
                        <div>{{ $t('schedule_end_time') }} : {{ item.endTime }}</div>
                      </div>
                    </div>
                  </span>
                </div>
              </template>
              <template v-else>
                {{ '-' }}
              </template>
            </template>
          </b-table>
        </mdb-modal-body>
        <mdb-modal-footer>
          <mdb-btn color="0000" @click.native="scheduleConflict = false" type="button">
            {{ $t('close') }}
          </mdb-btn>
        </mdb-modal-footer>
      </form>
    </mdb-modal>
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css'
import naturalCompare from 'string-natural-compare'
export default {
  components: {},
  data() {
    return {
      scheduleConflict: false,
      scheduleConflictArray: [],
      scheduleConflictfields: [
        {
          key: 'scheduleNumber',
          label: this.$t('schedule_number'), //'排程編號',
          sortable: true,
          class: 'text-center',
          thStyle: { whiteSpace: 'nowrap' }
        },
        {
          key: 'moldNumber',
          label: this.$t('mold_number'), //'模具編號',
          sortable: true,
          class: 'text-center',
          thStyle: { whiteSpace: 'nowrap' }
        },
        {
          key: 'machineNumber',
          label: this.$t('machine_number'), //'設備編號',
          sortable: true,
          class: 'text-center',
          thStyle: { whiteSpace: 'nowrap' }
        },
        {
          key: 'moldConflict',
          label: this.$t('mold_conflict'), //'模具衝突',
          // sortable: true,
          class: 'text-center',
          thStyle: { whiteSpace: 'nowrap' }
        },
        {
          key: 'machineConflict',
          label: this.$t('machine_conflict'), //'設備衝突',
          // sortable: true,
          class: 'text-center',
          thStyle: { whiteSpace: 'nowrap' }
        }
      ]
    }
  },
  props: {
    errorArray: Array
  },

  watch: {
    errorArray(newVal) {
      this.checkScheduleConflict(newVal)
    }
  },
  created() {},
  methods: {
    checkScheduleConflict(errorArray) {
      this.scheduleConflictArray = []
      errorArray.forEach(item => {
        let checkIndex = this.scheduleConflictArray.findIndex(obj => {
          return obj.scheduleNumber == item.scheduleNumber
        })
        if (checkIndex == -1) {
          if (item.mode == 1) {
            //模具衝突
            this.scheduleConflictArray.push({
              scheduleNumber: item.scheduleNumber,
              moldNumber: item.moldNumber,
              machineNumber: item.machineNumber,
              moldConflict: [],
              machineConflict: []
            })
            item.concliftSchedules.forEach(sub => {
              this.scheduleConflictArray[this.scheduleConflictArray.length - 1].moldConflict.push({
                scheduleNumber: sub.scheduleSerial,
                startTime: this.timeStampToStringFunc(sub.startTime, 'yyyy-mm-dd hh:mm'),
                endTime: this.timeStampToStringFunc(sub.endTime, 'yyyy-mm-dd hh:mm')
              })
            })
          } else if (item.mode == 2) {
            //設備衝突

            this.scheduleConflictArray.push({
              scheduleNumber: item.scheduleNumber,
              moldNumber: item.moldNumber,
              machineNumber: item.machineNumber,
              moldConflict: [],
              machineConflict: []
            })
            item.concliftSchedules.forEach(sub => {
              this.scheduleConflictArray[
                this.scheduleConflictArray.length - 1
              ].machineConflict.push({
                scheduleNumber: sub.scheduleSerial,
                startTime: this.timeStampToStringFunc(sub.startTime, 'yyyy-mm-dd hh:mm'),
                endTime: this.timeStampToStringFunc(sub.endTime, 'yyyy-mm-dd hh:mm')
              })
            })
          }
        } else {
          if (item.mode == 1) {
            //模具衝突
            item.concliftSchedules.forEach(sub => {
              this.scheduleConflictArray[checkIndex].moldConflict.push({
                scheduleNumber: sub.scheduleSerial,
                startTime: this.timeStampToStringFunc(sub.startTime, 'yyyy-mm-dd hh:mm'),
                endTime: this.timeStampToStringFunc(sub.endTime, 'yyyy-mm-dd hh:mm')
              })
            })
          } else if (item.mode == 2) {
            //模具衝突
            item.concliftSchedules.forEach(sub => {
              this.scheduleConflictArray[checkIndex].machineConflict.push({
                scheduleNumber: sub.scheduleSerial,
                startTime: this.timeStampToStringFunc(sub.startTime, 'yyyy-mm-dd hh:mm'),
                endTime: this.timeStampToStringFunc(sub.endTime, 'yyyy-mm-dd hh:mm')
              })
            })
          }
        }
      })
      this.scheduleConflictArray.forEach(item => {
        item.moldConflict.sort((a, b) => naturalCompare(a.scheduleNumber, b.scheduleNumber))
        item.machineConflict.sort((a, b) => naturalCompare(a.scheduleNumber, b.scheduleNumber))
      })
      this.scheduleConflictArray.sort((a, b) => naturalCompare(a.scheduleNumber, b.scheduleNumber))
      this.scheduleConflict = true
    }
  },

  mounted() {},
  beforeDestroy() {}
}
</script>

<style scoped>
.errorModal > .table-responsive-error.table-responsive {
  margin-bottom: 0px;
  padding-bottom: 40px;
}
.inputCenter {
  text-align: center !important;
}
.deitedeletebtm {
  margin: 0;
}
.tooltipConflictMain {
  padding: 0.25rem;
}
.tooltipConflict {
  position: relative;
  background: rgb(61, 145, 188);
  color: white;
  height: 20px !important;
  width: 20px !important;
  font-size: 15px;
  text-align: center;
  border-radius: 50%;
  /* display: inline-block; */
  border-bottom: 1px dotted black;
}

.tooltipConflict .tooltipConflictText {
  visibility: hidden;
  /* visibility: visible; */
  /* width: 190px; */
  background: rgb(61, 145, 188);
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 6px;
  top: 15px;
  right: 105%;
  white-space: nowrap;
  position: absolute;
  z-index: 1;
}

.tooltipConflict:hover .tooltipConflictText {
  visibility: visible;

  box-shadow: -2px 3px 2px 1px #cccccc;
}
</style>
<style>
.schedulepctableclass {
  max-height: calc(100vh - 346px - 30px) !important;
}
.table-responsive > .table-bordered,
.table-responsive-sm > .table-bordered,
.table-responsive-md > .table-bordered,
.table-responsive-lg > .table-bordered,
.table-responsive-xl > .table-bordered {
  border: 1px solid #f4f4f4 !important;
}
.table tr td {
  line-height: 20px;
  padding: 0px;
  margin: 0px;
  padding-top: -10px;
}
.table-b-table-default.text-center.thstyle {
  border: 1px solid #f4f4f4;
  font-size: 14px;
  font-weight: bold;
  height: 39px;
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  font-family: 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
.text-center.tdstyle {
  border: 1px solid #f4f4f4;
  font-size: 14px;
  font-weight: 400;
  height: 39px;
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  font-family: 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
.moldnumberclass {
  max-width: 30px;
  text-align: center;
}
.modal-dialog {
  margin-left: 10%;
  margin-right: 10%;
}
/* .modal-content {
  width: 80vw;
} */
#mobile {
  display: none;
}
.input-group.mb-3 {
  position: relative;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}
table.table td {
  vertical-align: middle;
  padding-top: 0;
  padding-bottom: 0rem;
}
.errorinput {
  background-color: red;
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
