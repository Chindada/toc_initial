<template>
  <mdb-container fluid>
    <section class="section">
      <div class="row">
        <div class="col-lg-16">
          <!-- <div class="border border-light rounded"> -->
          <div
            class="well well-sm"
            name="aiom_introduce_cont"
            id="aiom_introduce_cont"
            style=" font-size:1vw;padding:1vw;background-color: white"
          >
            <h3
              id="aiom_introduce_title"
              style="padding-left: 10px;font-size:2vw;font-weight:bold "
            >
              {{ $t('title_one') }}
            </h3>
            <div style="padding-left:2rem;padding-right:2rem">
              <p id="aiom_introduce_cont__text1;">
                {{ $t('paragraph_one') }}
              </p>
              <p id="aiom_introduce_cont__text1">
                {{ $t('paragraph_two') }}
              </p>
            </div>
            <h3 style="padding-left: 10px;font-size:2vw;font-weight:bold" id="aiom_system_title">
              {{ $t('title_two') }}
            </h3>
            <div class="well well-sm" id="introduce">
              <img
                id="introduce_img"
                src="../../assets/introduce_1.jpg"
                width="100%"
                alt="User Image"
              />
              <img
                id="introduce_img"
                src="../../assets/introduce_2.jpg"
                width="100%"
                alt="User Image"
              />
            </div>
            <div class="well well-sm" id="introduce2">
              <img
                id="introduce_img"
                src="../../assets/introduce_3.jpg"
                width="100%"
                alt="User Image"
              />
              <img
                id="introduce_img"
                src="../../assets/introduce_4.jpg"
                width="100%"
                alt="User Image"
              />
            </div>
          </div>
          <!-- </div> -->
        </div>
      </div>
    </section>
  </mdb-container>
</template>

<script>
export default {
  name: 'Chat',
  components: {},
  data() {
    return {}
  },
  methods: {
    getLevel() {
      // console.log("AJAJJAJA");
    }
  },
  created() {
    this.getLevel()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#aiom_introduce_cont {
  font-size: 1.2rem !important;
  max-width: 100%;
}
.avatar-sm {
  width: 56px;
  border-radius: 50%;
}
.chat-message-type {
  -webkit-box-flex: 1 !important;
  -webkit-flex: 1 0 auto !important;
  -ms-flex: 1 0 auto !important;
  flex: 1 0 auto !important;
}
#introduce {
  width: 100%;
  display: -ms-grid;
  display: grid;
  -ms-grid-columns: 1fr 1fr;
  grid-template-columns: 1fr 1fr;
  grid-row-gap: 10px;
}
#introduce2 {
  width: 100%;
  display: -ms-grid;
  display: grid;
  -ms-grid-columns: 1fr 1fr;
  grid-template-columns: 1fr 1fr;
  grid-row-gap: 10px;
}
@media (max-width: 768px), (max-height: 768px) {
  #aiom_introduce_title {
    font-size: 3vw !important;
  }
  #aiom_system_title {
    font-size: 3vw !important;
  }
  #aiom_introduce_cont__text1 {
    font-size: 2.3vw;
  }
  #aiom_introduce_title_mobel {
    display: none;
  }
  #aiom_introduce_cont {
    font-size: 2.3vw !important;
  }

  #introduce_img {
    max-width: 100%;
    height: auto;
  }
  #introduce {
    width: 100%;
    display: -ms-grid;
    display: grid;
    -ms-grid-columns: 1fr 1fr;
    grid-template-columns: 1fr;
    grid-row-gap: 10px;
  }
  #introduce2 {
    width: 100%;
    display: -ms-grid;
    display: grid;
    -ms-grid-columns: 1fr 1fr;
    grid-template-columns: 1fr;
    grid-row-gap: 10px;
  }
}
@media (max-width: 425px) {
  #aiom_system_title {
    display: none;
    font-size: 5vw !important;
  }
  #aiom_introduce_title {
    display: block;
    font-size: 5vw !important;
  }
  #col-md-11 {
    width: 100%;
  }
  #aiom_introduce_cont__text1 {
    font-size: 4vw;
  }
  #aiom_introduce_cont {
    font-size: 4vw !important;
    max-width: 100%;
  }
  #introduce_title {
    display: none;
  }
  #introduce {
    display: none;
  }
  #introduce2 {
    display: none;
  }
  #introduce_img {
    max-width: 100%;
    height: auto;
  }
}
</style>
