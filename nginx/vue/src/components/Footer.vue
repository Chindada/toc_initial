<template>
  <mdb-footer class="pt-4">
    <p class="footer-copyright mb-0 py-3 text-center" style="color:white;background-color: #3d91bc">
      <!-- <b-row> -->
      <span class="copyRight">
        &copy; 2018 Copyright: Molding Innovation Technology Co., Ltd. All Rights Reserved
      </span>
      <span class="copyRightMobile" style="display:none">
        &copy; 2018 Copyright: minnotec.com
      </span>
      <span class="version">IoM R5.0.12 Edition: {{ version }}</span>
      <span class="copyRight" style="opacity:0">----------</span>
      <span class="languageSelect">
        <b-form-select
          v-model="$i18n.locale"
          @change="onChange($event)"
          style="width:100px;height:25px;padding-top:0px;padding-bottom:0px"
        >
          <option v-for="(lang, i) in langs" :key="`Lang${i}`" :value="lang">{{ lang }}</option>
        </b-form-select>
      </span>
    </p>
  </mdb-footer>
</template>

<script>
import { SystemSettingAPI } from '@/plugins/basicapis.js'

export default {
  name: 'Footer',
  components: {},
  created() {
    this.version = this.setfooterver(localStorage.getItem('version'))
    this.version = this.version.substring(1, this.version.length - 1)
    if (localStorage.getItem('login') == 0) {
      this.dblang()
    }
  },
  data() {
    var language
    return {
      version: '',
      language,
      langs: ['中文', 'English']
    }
  },

  methods: {
    setfooterver(value) {
      if (value == '"1"') {
        return '"OEE"'
      } else if (value == '"2"') {
        return '"OEE+"'
      } else if (value == '"3"') {
        return '"IPS"'
      }
    },
    onChange(value) {
      localStorage.setItem('locale', value)
      location.reload()
    },
    dblang() {
      var access_token_val = this.$cookies.get('access_token')
      SystemSettingAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          if (res.data != null) {
            res.data.forEach(item => {
              if (item.parameter == 'language') {
                this.language = item.value
                this.$i18n.locale = item.value
                localStorage.setItem('locale', item.value)
                localStorage.setItem('login', 1)
              }
            })
          }
        },
        error => {
          console.log(error.response)
          this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    }
  },
  mounted() {
    this.language = localStorage.getItem('locale')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.version {
  float: right;
  padding-right: 1vw;
}
/*手機直式 */
@media only screen and (max-width: 500px) and (max-height: 950px) {
  .version {
    display: none;
  }
  .languageSelect {
    display: none;
  }
  .copyRight {
    display: none;
  }
  .copyRightMobile {
    display: block !important;
  }
}

/*手機橫式 */
@media only screen and (max-width: 950px) and (max-height: 500px) {
  .version {
    display: none;
  }
  .languageSelect {
    display: none;
  }
  .copyRight {
    display: none;
  }
  .copyRightMobile {
    display: block !important;
  }
}
/*平板直式 */
@media only screen and (max-width: 1100px) and (max-height: 1400px) {
  .version {
    display: none;
  }
  .languageSelect {
    display: none;
  }
  .copyRight {
    display: none;
  }
  .copyRightMobile {
    display: block !important;
  }
}
/*平板橫式 */
@media only screen and (max-width: 1400px) and (max-height: 1100px) {
  .version {
    display: none;
  }
  .languageSelect {
    display: none;
  }
  .copyRight {
    display: none;
  }
  .copyRightMobile {
    display: block !important;
  }
}
</style>
