<template>
  <mdb-container fluid>
    <div v-show="false">
      <audio controls id="player">
        <source src="../../assets/alarmsound.wav" type="audio/mpeg" />
      </audio>
      <button @click="playAudio()" type="button">Play Audio</button>
      <button @click="pauseAudio()" type="button">Pause Audio</button>
    </div>
    <fullscreen ref="fullscreen" @change="fullscreenChange">
      <div v-if="fullscreen" class="fullscreen">
        <div class="fullscreen-head">
          <img
            id="introduce_img"
            :src="fullscreenimg"
            width="80%"
            alt="User Image"
            style="margin:auto"
          />
          <div class="fullscreen-main-time">{{ pagetitle }}</div>
          <div class="fullscreen-main-slogan">AIoM Dashboard</div>
          <div class="fullscreen-main-time">{{ currentTime }}</div>
          <img
            id="introduce_img"
            src="../../assets/fullscreanAIOM.png"
            width="80%"
            alt="User Image"
            style="margin:auto"
          />
        </div>
        <div id="pageContent">
          <div id="mainButton">
            <b-row>
              <b-col :cols="!factoryMap && !machineMap ? '8' : '8'"> </b-col>
              <b-col v-show="!factoryMap && !machineMap">
                <div class="input-group">
                  <!-- <div class="input-group-prepend">
                    <label class="input-group-text" for="inputGroupSelect01">{{'廠區'}}</label>
                  </div>-->

                  <b-form-select
                    style="margin-right:5px"
                    v-model="cardShowMode"
                    :options="cardShowObject"
                  ></b-form-select>

                  <b-form-select v-model="selectWorkshop" :options="workshopobject"></b-form-select>
                </div>
              </b-col>
            </b-row>
          </div>
        </div>
        <!-- 全螢幕 -->
        <!-- 全螢幕 -->
        <!-- 全螢幕 -->
        <div class="kanbanBorder" v-show="factoryKanban">
          <div id="Kanban">
            <svg width="100%" height="100%">
              <g
                v-for="(item, index) in cardDataTable"
                :key="index"
                :machineId="item.machineId"
                :style="svgShow()"
              >
                <svg
                  v-if="item.machineLocation"
                  :x="item.machineLocation.left"
                  :y="item.machineLocation.top"
                  style="overflow:initial"
                >
                  <g :id="item.machineId" :style="svgStyle(item)">
                    <!-- 模具 穩定度 -->
                    <path
                      :d="item.machineLocation.svgPath[0]"
                      :style="machineCytr(item)"
                      stroke-width="0.5"
                    />
                    <!-- 設備 狀態-->
                    <path
                      :fullsvgtop="item.machineId"
                      :d="item.machineLocation.svgPath[1]"
                      :style="machineStatus(item)"
                    />
                    <path
                      :fullsvgsub="item.machineId"
                      class="machineSvgBase"
                      d="M.25,106.85V179.9H471.41V106.85Z"
                      fill="#F5F5F5"
                      style="strokeWidth:0.5;opacity:0"
                    />
                    <!-- 料管 異常-->
                    <path
                      :d="item.machineLocation.svgPath[3]"
                      :style="machineError(item)"
                      :class="item.animation ? 'blink' : ''"
                    />
                  </g>
                </svg>
              </g>
            </svg>
            <!-- 全螢幕模式卡片 -->
            <div v-show="cardShowMode == 0 || cardShowMode == 1">
              <mdb-card
                class="kanbanCardProgressOnly"
                v-for="(card, index) in cardDataTable"
                :key="index"
                :style="kanbanCardPositionWithIcon(card, index)"
              >
                <div v-if="cardShowMode == 0">
                  <b-row style="text-align:center;font-size: 0.5vw;width:100%;margin:0px">
                    <!-- <b-col style="padding:0px;" cols="1"></b-col> -->
                    <b-col cols="2" :style="colsstyle(card, 1)">{{ card.machineNumber }}</b-col>
                    <b-col calss="qtytaskqty" :style="colsstyle(card, 2)">{{
                      card.taskQTYString + ' / ' + card.qtyString
                    }}</b-col>
                    <b-col cols="2" :style="colsstyle(card, 3)">{{ card.cycleTime }}</b-col>
                  </b-row>
                  <el-progress
                    class="progressline"
                    :percentage="progressValue(card, index)"
                    :color="progressColor(card, index)"
                    :show-text="false"
                  ></el-progress>
                </div>
                <div v-if="cardShowMode == 1" style="font-size:0.5rem">
                  <b-row style="width:100%;margin:0px">
                    <b-col cols="2.5" style="padding:0px;text-align:center;white-space:nowrap;">
                      {{ card.machineNumber }}
                    </b-col>
                    <b-col style="padding:0px;text-align:center;">
                      <div class="progressBar" style="margin-right:5px;margin-left:5px">
                        <div class="valueNumber" style="white-space:nowrap;">
                          {{ card.taskQTYString + ' / ' + card.qtyString }}
                        </div>
                        <div class="valueBar" :style="valueBarColor(card, index)"></div>
                      </div>
                    </b-col>
                    <b-col
                      cols="2.5"
                      style="padding-right:3px;padding-left:0px;text-align:center;white-space:nowrap;"
                      >{{ card.cycleTime }}</b-col
                    >
                  </b-row>
                </div>
              </mdb-card>
            </div>
            <div v-show="cardShowMode == 2">
              <mdb-card
                class="kanbanCard"
                v-for="(card, index) in cardDataTable"
                :key="index"
                :style="kanbanCardPosition(card, index)"
              >
                <div
                  style="line-height:45px;height:45px;text-align:center;"
                  v-if="machineErrorShow(card.status)"
                >
                  {{ errorstatus(card.status) }}
                </div>
                <div v-else>
                  <b-row>
                    <b-col style="padding-right:0px">
                      <!-- 圓圈 -->
                      <div class="circleparent">
                        <div
                          class="circle"
                          v-bind:style="{
                            borderColor: circleColor(card.status)
                          }"
                        ></div>
                      </div>
                      <!-- end圓圈 -->
                      <!-- 圈內內容 -->
                      <div class="circleparent">
                        <div class="circletext">
                          <span class="circlecont">{{ dealCTSCTtime(card.cycleTime) }}</span>
                        </div>
                      </div>
                      <!-- end圈內內容 -->
                    </b-col>

                    <b-col style="font-size:5px;padding-left:0px">
                      <div class="cardTitleLeft">{{ card.machineNumber.substring(0, 8) }}</div>
                      <div class="cardTitleRight">{{ card.machineModel.substring(0, 8) }}</div>
                      <div class="progressBar" style="height:10px">
                        <div class="valueNumber" style="white-space:nowrap;">
                          {{ card.taskQTYString + ' / ' + card.qtyString }}
                        </div>
                        <div class="valueBar" :style="valueBarColor(card, index)"></div>
                      </div>
                    </b-col>
                  </b-row>
                </div>
              </mdb-card>
            </div>
          </div>
        </div>
        <!-- end全螢幕 -->
        <!-- end全螢幕 -->
        <!-- end全螢幕 -->
      </div>
    </fullscreen>
    <div id="pageContent">
      <div id="mainButton">
        <b-row>
          <b-col :cols="!factoryMap && !machineMap ? '8' : '8'">
            <!-- 廠區地圖 -->
            <mdb-btn
              size="sm"
              color="primary"
              style="font-size:1rem;padding:0.4rem"
              icon="plus"
              @click="startCheckSize()"
              >{{ $t('factory_factory_map') }}</mdb-btn
            >
            <!-- 設備地圖 -->
            <mdb-btn
              size="sm"
              color="primary"
              style="font-size:1rem;padding:0.4rem"
              icon="pencil-alt"
              @click="beforeStartMachineMap()"
              >{{ $t('factory_machine_map') }}</mdb-btn
            >
            <!-- 廠區看版 -->
            <!-- <mdb-btn size="sm" color="primary" style="font-size:1rem;padding:0.4rem" icon="fas fa-map-marked-alt" @click="initKanban()">廠區看版</mdb-btn>  -->

            <!-- <mdb-btn size="sm" color="success" style="padding:0.4rem" icon="fas fa-map-marked-alt" @click="qr()">QR Test</mdb-btn>  -->
          </b-col>
          <b-col v-show="!factoryMap && !machineMap">
            <div class="input-group">
              <b-form-select
                style="margin-right:5px"
                v-model="cardShowMode"
                :options="cardShowObject"
              ></b-form-select>
              <b-form-select v-model="selectWorkshop" :options="workshopobject"></b-form-select>

              <mdb-btn
                v-if="!fullscreen"
                type="button"
                @click="toggle"
                icon="arrows-alt"
                size="sm"
                style="font-size:1rem;background-color:#3d91bc!important;padding:0.4rem"
              ></mdb-btn>
            </div>
          </b-col>
          <b-col v-show="factoryMap || machineMap">
            <div class="input-group">
              <div class="input-group-prepend">
                <h4 style="fontFamily:'微軟正黑體'">
                  <mdb-badge color="primary">{{ nowWorkShopName }}</mdb-badge>
                </h4>
              </div>
            </div>
          </b-col>
        </b-row>
      </div>
      <!-- <canvas id="qrCanvas" width="0" height="0"></canvas> -->
      <div v-show="factoryMap || machineMap">
        <canvas id="canvas" width="0" height="0"></canvas>
        <div id="buttonGroup">
          <div @mousedown="selectToolBar($event)">
            <mdb-btn class="mainToolConfig" @click="toolBarConfig()">
              {{ $t('factory_tool') }}</mdb-btn
            >
          </div>
          <!-- 廠區地圖Button -->
          <div id="factoryTools" v-show="toolBarShow && factoryMap">
            <mdb-btn
              class="toolBarBtn"
              color="mdb-color"
              v-show="toolBarShow && factoryMap"
              @click="checkfabricDrawObj(0)"
              :disabled="fabricDrawObj[0]"
              >{{ $t('factory_line') }}</mdb-btn
            >
            <mdb-btn
              class="toolBarBtn"
              color="mdb-color"
              v-show="toolBarShow && factoryMap"
              @click="checkfabricDrawObj(1)"
              :disabled="fabricDrawObj[1]"
              >{{ $t('factory_triangle') }}</mdb-btn
            >
            <mdb-btn
              class="toolBarBtn"
              color="mdb-color"
              v-show="toolBarShow && factoryMap"
              @click="checkfabricDrawObj(2)"
              :disabled="fabricDrawObj[2]"
              >{{ $t('factory_right_triangle') }}</mdb-btn
            >
            <mdb-btn
              class="toolBarBtn"
              color="mdb-color"
              v-show="toolBarShow && factoryMap"
              @click="checkfabricDrawObj(3)"
              :disabled="fabricDrawObj[3]"
              >{{ $t('factory_rectangle') }}</mdb-btn
            >
            <mdb-btn
              class="toolBarBtn"
              color="mdb-color"
              v-show="toolBarShow && factoryMap"
              @click="checkfabricDrawObj(4)"
              :disabled="fabricDrawObj[4]"
              >{{ $t('factory_round') }}</mdb-btn
            >
            <mdb-btn
              class="toolBarBtn"
              color="mdb-color"
              v-show="toolBarShow && factoryMap"
              @click="checkfabricDrawObj(5)"
              :disabled="fabricDrawObj[5]"
              >{{ $t('factory_text') }}</mdb-btn
            >
            <mdb-btn
              class="toolBarBtn"
              color="mdb-color"
              v-show="toolBarShow && factoryMap"
              @click="checkfabricDrawObj(6)"
              :disabled="fabricDrawObj[6]"
              >{{ $t('factory_door') }}</mdb-btn
            >

            <mdb-btn
              class="toolBarBtn"
              color="mdb-color"
              v-show="toolBarShow && factoryMap && isGrid == false"
              @click="drawGrid()"
              >{{ $t('factory_grid') }}</mdb-btn
            >
            <mdb-btn
              class="toolBarBtn"
              color="mdb-color"
              v-show="toolBarShow && factoryMap && isGrid == true"
              @click="deleteGrid()"
              >{{ $t('factory_clear_grid') }}</mdb-btn
            >
            <mdb-btn
              class="toolBarBtn"
              color="mdb-color"
              v-show="toolBarShow && factoryMap"
              @click="unDo()"
              >{{ $t('factory_undo') }}</mdb-btn
            >
            <mdb-btn
              class="toolBarBtn"
              color="mdb-color"
              v-show="toolBarShow && factoryMap"
              @click="reDo()"
              >{{ $t('factory_redo') }}</mdb-btn
            >
            <mdb-btn
              class="toolBarBtn"
              color="mdb-color"
              v-show="toolBarShow && factoryMap"
              @click="clearAll()"
              >{{ $t('factory_clear_all') }}</mdb-btn
            >
            <mdb-btn
              class="toolBarBtn"
              color="mdb-color"
              v-show="toolBarShow && factoryMap"
              @click="saveFactoryMap()"
              >{{ $t('factory_save_file') }}</mdb-btn
            >
            <mdb-btn
              class="toolBarBtn"
              color="mdb-color"
              v-show="toolBarShow && factoryMap"
              @click="loadFactoryMap()"
              >{{ $t('factory_read_file') }}</mdb-btn
            >
            <mdb-btn
              class="toolBarBtn"
              color="mdb-color"
              v-show="toolBarShow && factoryMap"
              @click="saveImg(0)"
              >{{ $t('factory_download_png') }}</mdb-btn
            >
          </div>
          <mdb-btn
            style="backgroundColor: #3c8dbc !important"
            class="toolBarBtn"
            v-show="toolBarShow && factoryMap"
            @click=";(factoryMap = false), initKanban()"
            >{{ $t('factory_complete') }}</mdb-btn
          >
          <!-- 擺放設備 -->
          <mdb-tbl responsive bordered class="deviceTable" v-show="toolBarShow && machineMap">
            <mdb-tbl-head>
              <tr>
                <th>{{ $t('factory_icon') }}</th>
                <th>{{ $t('machine') }}</th>
                <th>{{ $t('factory_brand') }}</th>
                <th>{{ $t('factory_model') }}</th>
              </tr>
            </mdb-tbl-head>

            <mdb-tbl-body>
              <tr
                class="deviceTableTr"
                v-for="(item, index) in machineTableData"
                :key="index"
                :machineId="item.id"
                @click="beforeSetDevice(item, index)"
              >
                <td :style="{ width: '80px', height: '60px' }">
                  <span
                    class="input-group-text"
                    slot="button"
                    :style="deviceTableSvg(item, index)"
                  ></span>
                </td>
                <td>{{ item.machineNumber.substring(0, 10) }}</td>
                <td>{{ item.brand.substring(0, 10) }}</td>
                <td>{{ item.model.substring(0, 10) }}</td>
              </tr>
            </mdb-tbl-body>
          </mdb-tbl>
          <mdb-btn
            class="toolBarBtn"
            color="mdb-color"
            v-show="toolBarShow && machineMap && isGrid == false"
            @click="drawGrid()"
            >{{ $t('factory_grid') }}</mdb-btn
          >
          <mdb-btn
            class="toolBarBtn"
            color="mdb-color"
            v-show="toolBarShow && machineMap && isGrid == true"
            @click="deleteGrid()"
            >{{ $t('factory_clear_grid') }}</mdb-btn
          >
          <mdb-btn
            class="toolBarBtn"
            color="mdb-color"
            v-show="toolBarShow && machineMap"
            @click="restartAll()"
            >{{ $t('factory_clear_all') }}</mdb-btn
          >
          <mdb-btn
            class="toolBarBtn"
            color="mdb-color"
            v-show="toolBarShow && machineMap"
            @click="saveMachineMap()"
            >{{ $t('factory_save_file') }}</mdb-btn
          >
          <mdb-btn
            class="toolBarBtn"
            color="mdb-color"
            v-show="toolBarShow && machineMap"
            @click="loadMachineMap()"
            >{{ $t('factory_read_file') }}</mdb-btn
          >
          <mdb-btn
            class="toolBarBtn"
            color="mdb-color"
            v-show="toolBarShow && machineMap"
            @click="saveImg(1)"
            >{{ $t('factory_download_png') }}</mdb-btn
          >
          <mdb-btn
            style="backgroundColor: #3c8dbc !important"
            class="toolBarBtn"
            v-show="toolBarShow && machineMap"
            @click=";(machineMap = false), initKanban()"
            >{{ $t('factory_complete') }}</mdb-btn
          >
        </div>
      </div>
      <!-- 一般網頁 -->
      <!-- 一般網頁 -->
      <!-- 一般網頁 -->
      <div class="kanbanBorder" v-show="factoryKanban">
        <div id="Kanban">
          <svg width="100%" height="100%">
            <g
              v-for="(item, index) in cardDataTable"
              :key="index"
              :machineId="item.machineId"
              :style="svgShow()"
            >
              <svg
                v-if="item.machineLocation"
                :x="item.machineLocation.left"
                :y="item.machineLocation.top"
                style="overflow:initial"
              >
                <g :style="svgStyle(item)">
                  <!-- 模具 穩定度 -->
                  <path
                    :d="item.machineLocation.svgPath[0]"
                    :style="machineCytr(item)"
                    stroke-width="0.5"
                  />
                  <!-- 設備 狀態-->
                  <path
                    :svgtop="item.machineId"
                    :d="item.machineLocation.svgPath[1]"
                    :style="machineStatus(item)"
                  />
                  <path
                    :svgsub="item.machineId"
                    class="machineSvgBase"
                    d="M.25,106.85V179.9H471.41V106.85Z"
                    fill="#F5F5F5"
                    style="strokeWidth:0.5;opacity:0"
                  />
                  <!-- 料管 異常-->
                  <path
                    :d="item.machineLocation.svgPath[3]"
                    :style="machineError(item)"
                    :class="item.animation ? 'blink' : ''"
                  />
                </g>
              </svg>
            </g>
          </svg>
          <!-- 一般網頁模式 -->

          <div v-show="cardShowMode == 0 || cardShowMode == 1">
            <mdb-card
              :id="card.machineId"
              :cardid="card.machineId"
              class="kanbanCardProgressOnly"
              v-for="(card, index) in cardDataTable"
              :key="index"
              :style="kanbanCardPositionWithIcon(card, index)"
            >
              <div v-if="cardShowMode == 0">
                <b-row style="text-align:center;font-size: 0.5vw;width:100%;margin:0px">
                  <b-col cols="2" :style="colsstyle(card, 1)">{{ card.machineNumber }}</b-col>
                  <b-col calss="qtytaskqty" :style="colsstyle(card, 2)">{{
                    card.taskQTYString + ' / ' + card.qtyString
                  }}</b-col>
                  <b-col cols="2" :style="colsstyle(card, 3)">{{ card.cycleTime }}</b-col>
                </b-row>
                <el-progress
                  class="progressline"
                  :percentage="progressValue(card, index)"
                  :color="progressColor(card, index)"
                  :show-text="false"
                ></el-progress>
              </div>
              <div v-if="cardShowMode == 1" style="font-size:0.5rem">
                <b-row :style="rolstyle(card, 1)">
                  <b-col cols="2.5" :style="colsstyle2(card, 1)">
                    {{ card.machineNumber }}
                  </b-col>
                  <b-col style="padding:0px" :style="colsstyle2(card, 4)">
                    <div class="progressBar" style="margin:2px 5px 0px 5px;height:15px;">
                      <div class="valueNumber" :style="colsstyle2(card, 2)">
                        {{ card.taskQTYString + ' / ' + card.qtyString }}
                      </div>
                      <div class="valueBar" :style="valueBarColor(card, index)"></div>
                    </div>
                  </b-col>
                  <b-col cols="2.5" :style="colsstyle2(card, 3)">{{ card.cycleTime }}</b-col>
                </b-row>
                <div
                  class="progressBar"
                  style="margin:2px 5px 0px 5px;height:15px; position: absolute;padding-top:3px"
                  :style="rolstyle(card, 2)"
                >
                  <div class="valueNumber" :style="colsstyle2(card, 2)">
                    {{ card.taskQTYString + ' / ' + card.qtyString }}
                  </div>
                  <div class="valueBar" :style="valueBarColor(card, index)"></div>
                </div>
                <b-row :style="rolstyle(card, 2)">
                  <b-col style="z-index:10" :style="colsstyle2(card, 1)">
                    {{ card.machineNumber }}
                  </b-col>
                  <b-col style="z-index:10" :style="colsstyle2(card, 3)">{{
                    card.cycleTime
                  }}</b-col>
                </b-row>
              </div>
            </mdb-card>
          </div>
          <div v-show="cardShowMode == 2">
            <mdb-card
              class="kanbanCard"
              v-for="(card, index) in cardDataTable"
              :key="index"
              :style="kanbanCardPosition(card, index)"
            >
              <div
                style="line-height:45px;height:45px;text-align:center;"
                v-if="machineErrorShow(card.status)"
              >
                {{ errorstatus(card.status) }}
              </div>
              <div v-else>
                <b-row>
                  <b-col style="padding-right:0px">
                    <!-- 圓圈 -->
                    <div class="circleparent">
                      <div
                        class="circle"
                        v-bind:style="{
                          borderColor: circleColor(card.status)
                        }"
                      ></div>
                    </div>
                    <!-- end圓圈 -->
                    <!-- 圈內內容 -->
                    <div class="circleparent">
                      <div class="circletext">
                        <span class="circlecont">{{ dealCTSCTtime(card.cycleTime) }}</span>
                      </div>
                    </div>
                    <!-- end圈內內容 -->
                  </b-col>

                  <b-col style="font-size:5px;padding-left:0px">
                    <div class="cardTitleLeft">{{ card.machineNumber.substring(0, 8) }}</div>
                    <div class="cardTitleRight">{{ card.machineModel.substring(0, 8) }}</div>
                    <div class="progressBar" style="height:10px">
                      <div class="valueNumber" style="white-space:nowrap;">
                        {{ card.taskQTYString + ' / ' + card.qtyString }}
                      </div>
                      <div class="valueBar" :style="valueBarColor(card, index)"></div>
                    </div>
                  </b-col>
                </b-row>
              </div>
            </mdb-card>
          </div>
        </div>
      </div>

      <!-- end一般網頁 -->
      <!-- end一般網頁 -->
      <!-- end一般網頁 -->
    </div>
    <mdb-modal :show="checkFactoryMapSize" @close="closemodal($event)" centered>
      <form v-on:submit.prevent="beforeCloseCheckSize">
        <mdb-modal-header>
          <mdb-modal-title v-if="!this.oldFactoryData">{{
            $t('factory_new_factory_map')
          }}</mdb-modal-title>
          <mdb-modal-title v-else-if="this.oldFactoryData">{{
            $t('factory_edit_factory_map')
          }}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body>
          <div>
            <b-row>
              <b-col>
                <mdb-input
                  class="mb-3"
                  v-model="mapWidth"
                  type="number"
                  required
                  :min="3"
                  :max="100"
                  @focus="focus($event)"
                >
                  <span class="input-group-text" slot="prepend" style="min-width:137px">
                    <span class="requileclass">*</span>
                    {{ $t('factory_factory_length') }}
                    <div class="tooltip1" style="right: 0;">
                      ?
                      <div class="tooltiptext1" style="text-align:left">
                        <div>{{ $t('factory_X_axis') }}</div>
                      </div>
                    </div>
                  </span>
                </mdb-input>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <mdb-input
                  class="mb-3"
                  v-model="mapHeight"
                  type="number"
                  required
                  :min="3"
                  :max="100"
                  @focus="focus($event)"
                >
                  <span class="input-group-text" slot="prepend" style="min-width:137px">
                    <span class="requileclass">*</span>
                    {{ $t('factory_factory_width') }}
                    <div class="tooltip1" style="right: 0;">
                      ?
                      <div class="tooltiptext1" style="text-align:left">
                        <div>{{ $t('factory_Y_axis') }}</div>
                      </div>
                    </div>
                  </span>
                </mdb-input>
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <mdb-input class="mb-3" v-model="mapColor" type="color" required>
                  <span class="input-group-text" slot="prepend" style="min-width:137px">
                    <span class="requileclass">*</span>
                    {{ $t('factory_factory_background_color') }}
                  </span>
                </mdb-input>
              </b-col>
            </b-row>
          </div>
        </mdb-modal-body>
        <mdb-modal-footer>
          <span style="color:red">{{ errormes }}</span>
          <mdb-btn color="info" @click.native="beforeCloseCheckSize()" type="submit">{{
            $t('submit')
          }}</mdb-btn>
          <mdb-btn color="0000" @click.native="checkFactoryMapSize = false" type="button">
            {{ $t('close') }}
          </mdb-btn>
        </mdb-modal-footer>
      </form>
    </mdb-modal>
  </mdb-container>
</template>
<script>
import { fabric } from 'fabric'
// import { QRCode } from 'qrcode'
import { MachineAPI } from '@/plugins/basicapis.js'

import {
  TaskkanbanAPI,
  RemoteInfoAPI,
  workshopKanbanAPI,
  workshopKanbanCategoryAPI,
  workshopKanbanCategoriesAPI
} from '@/plugins/dashboardapis.js'
export default {
  name: 'Dashboardv2',
  components: {},
  data() {
    return {
      errormes: '',
      selectWorkshop: null,
      nowWorkShop: null,
      nowWorkShopName: null,
      ///////////////////////////////////////////廠區地圖
      checkFactoryMapSize: false,
      mapHeight: null,
      mapWidth: null,
      mapColor: '#eeeeee',
      factoryMap: false,
      oldFactoryData: [],
      canvas: null,
      ctx: null,
      screenWidth: window.innerWidth, //螢幕寬度
      screenHeight: window.innerHeight, //螢幕高度
      screenTimer: false,
      cornerSize: 24,
      saveFile: null,
      unDoArray: [],
      reDoArray: [],
      state: null,
      isToolBarOnDrag: false,
      toolBarShow: true,
      toolBarBorder: null,
      isGrid: false,
      mousePosition: {
        x: 0,
        y: 0
      },
      StartMousePosition: {
        x: 0,
        y: 0
      },
      clickStartttableime: null,
      clickEndTime: null,
      deleteIcon:
        "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E",
      cloneIcon:
        "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='iso-8859-1'%3F%3E%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 55.699 55.699' width='100px' height='100px' xml:space='preserve'%3E%3Cpath style='fill:%23010002;' d='M51.51,18.001c-0.006-0.085-0.022-0.167-0.05-0.248c-0.012-0.034-0.02-0.067-0.035-0.1 c-0.049-0.106-0.109-0.206-0.194-0.291v-0.001l0,0c0,0-0.001-0.001-0.001-0.002L34.161,0.293c-0.086-0.087-0.188-0.148-0.295-0.197 c-0.027-0.013-0.057-0.02-0.086-0.03c-0.086-0.029-0.174-0.048-0.265-0.053C33.494,0.011,33.475,0,33.453,0H22.177 c-3.678,0-6.669,2.992-6.669,6.67v1.674h-4.663c-3.678,0-6.67,2.992-6.67,6.67V49.03c0,3.678,2.992,6.669,6.67,6.669h22.677 c3.677,0,6.669-2.991,6.669-6.669v-1.675h4.664c3.678,0,6.669-2.991,6.669-6.669V18.069C51.524,18.045,51.512,18.025,51.51,18.001z M34.454,3.414l13.655,13.655h-8.985c-2.575,0-4.67-2.095-4.67-4.67V3.414z M38.191,49.029c0,2.574-2.095,4.669-4.669,4.669H10.845 c-2.575,0-4.67-2.095-4.67-4.669V15.014c0-2.575,2.095-4.67,4.67-4.67h5.663h4.614v10.399c0,3.678,2.991,6.669,6.668,6.669h10.4 v18.942L38.191,49.029L38.191,49.029z M36.777,25.412h-8.986c-2.574,0-4.668-2.094-4.668-4.669v-8.985L36.777,25.412z M44.855,45.355h-4.664V26.412c0-0.023-0.012-0.044-0.014-0.067c-0.006-0.085-0.021-0.167-0.049-0.249 c-0.012-0.033-0.021-0.066-0.036-0.1c-0.048-0.105-0.109-0.205-0.194-0.29l0,0l0,0c0-0.001-0.001-0.002-0.001-0.002L22.829,8.637 c-0.087-0.086-0.188-0.147-0.295-0.196c-0.029-0.013-0.058-0.021-0.088-0.031c-0.086-0.03-0.172-0.048-0.263-0.053 c-0.021-0.002-0.04-0.013-0.062-0.013h-4.614V6.67c0-2.575,2.095-4.67,4.669-4.67h10.277v10.4c0,3.678,2.992,6.67,6.67,6.67h10.399 v21.616C49.524,43.26,47.429,45.355,44.855,45.355z'/%3E%3C/svg%3E%0A",
      flipXIcon:
        'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMzIgMzIiPgogICAgPHBhdGggc3R5bGU9InRleHQtaW5kZW50OjA7dGV4dC1hbGlnbjpzdGFydDtsaW5lLWhlaWdodDpub3JtYWw7dGV4dC10cmFuc2Zvcm06bm9uZTtibG9jay1wcm9ncmVzc2lvbjp0YjstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOkJpdHN0cmVhbSBWZXJhIFNhbnMiIGQ9Ik0gMTUgNC40Njg3NSBMIDEzLjEyNSA3LjkzNzUgTCA0LjEyNSAyNC41MzEyNSBMIDMuMzEyNSAyNiBMIDUgMjYgTCAxNCAyNiBMIDE1IDI2IEwgMTUgMjUgTCAxNSA4LjQwNjI1IEwgMTUgNC40Njg3NSB6IE0gMTcgNC41IEwgMTcgMjYgTCAyOC42ODc1IDI2IEwgMTcgNC41IHogTSAxMyAxMi4zNDM3NSBMIDEzIDI0IEwgNi42NTYyNSAyNCBMIDEzIDEyLjM0Mzc1IHoiIG92ZXJmbG93PSJ2aXNpYmxlIiBmb250LWZhbWlseT0iQml0c3RyZWFtIFZlcmEgU2FucyIvPgo8L3N2Zz4K',
      flipYIcon:
        'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMzIgMzIiPgogICAgPHBhdGggc3R5bGU9InRleHQtaW5kZW50OjA7dGV4dC1hbGlnbjpzdGFydDtsaW5lLWhlaWdodDpub3JtYWw7dGV4dC10cmFuc2Zvcm06bm9uZTtibG9jay1wcm9ncmVzc2lvbjp0YjstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOkJpdHN0cmVhbSBWZXJhIFNhbnMiIGQ9Ik0gMjYgMy4zMTI1IEwgNC41IDE1IEwgMjYgMTUgTCAyNiAzLjMxMjUgeiBNIDQuNDY4NzUgMTcgTCA3LjkzNzUgMTguODc1IEwgMjQuNTMxMjUgMjcuODc1IEwgMjYgMjguNjg3NSBMIDI2IDI3IEwgMjYgMTggTCAyNiAxNyBMIDI1IDE3IEwgOC40MDYyNSAxNyBMIDQuNDY4NzUgMTcgeiBNIDEyLjM0Mzc1IDE5IEwgMjQgMTkgTCAyNCAyNS4zNDM3NSBMIDEyLjM0Mzc1IDE5IHoiIG92ZXJmbG93PSJ2aXNpYmxlIiBmb250LWZhbWlseT0iQml0c3RyZWFtIFZlcmEgU2FucyIvPgo8L3N2Zz4K',
      rotateIcon:
        'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMzIgMzIiPgogICAgPHBhdGggc3R5bGU9InRleHQtaW5kZW50OjA7dGV4dC1hbGlnbjpzdGFydDtsaW5lLWhlaWdodDpub3JtYWw7dGV4dC10cmFuc2Zvcm06bm9uZTtibG9jay1wcm9ncmVzc2lvbjp0YjstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOkJpdHN0cmVhbSBWZXJhIFNhbnMiIGQ9Ik0gMTYgMyBMIDE2IDUgTCAxNyA1IEwgMTcgMyBMIDE2IDMgeiBNIDE5LjE1NjI1IDMuNDM3NSBMIDE4LjU5Mzc1IDUuMzQzNzUgTCAxOS4zNzUgNS41NjI1IEwgMTkuNDM3NSA1LjU5Mzc1IEwgMjAuMTI1IDUuODQzNzUgTCAyMC4xODc1IDUuODc1IEwgMjAuMjE4NzUgNS44NzUgTCAyMS4wNjI1IDQuMDYyNSBMIDIwLjk2ODc1IDQuMDMxMjUgTCAyMC45Mzc1IDQgTCAyMC45MDYyNSA0IEwgMjAuMDYyNSAzLjY4NzUgTCAyMC4wMzEyNSAzLjY4NzUgTCAyMCAzLjY1NjI1IEwgMTkuMTU2MjUgMy40Mzc1IHogTSA0IDQgTCA0IDYgTCA3LjY1NjI1IDYgQyA0Ljc5NTE1NDMgOC4zODU0OTM1IDMgMTEuOTQxMDE5IDMgMTYgQyAzIDIzLjE0NTQ1NSA4Ljg1NDU0NTUgMjkgMTYgMjkgQyAyMy4xNDU0NTUgMjkgMjkgMjMuMTQ1NDU1IDI5IDE2IEwgMjkgMTUgTCAyNyAxNSBMIDI3IDE2IEMgMjcgMjIuMDU0NTQ1IDIyLjA1NDU0NSAyNyAxNiAyNyBDIDkuOTQ1NDU0NSAyNyA1IDIyLjA1NDU0NSA1IDE2IEMgNSAxMi4wNjA1NjQgNi45NzA1MzUyIDguNzYxNDIyMiAxMCA2Ljc4MTI1IEwgMTAgMTIgTCAxMiAxMiBMIDEyIDUgTCAxMiA0IEwgMTEgNCBMIDQgNCB6IE0gMjIuODQzNzUgNSBMIDIxLjc4MTI1IDYuNjg3NSBMIDIyLjI1IDcgTCAyMi4zMTI1IDcuMDMxMjUgTCAyMi44NzUgNy40Njg3NSBMIDIyLjkzNzUgNy41IEwgMjMuMTU2MjUgNy42ODc1IEwgMjQuNDY4NzUgNi4xODc1IEwgMjQuMTg3NSA1LjkzNzUgTCAyNC4xNTYyNSA1LjkzNzUgTCAyNC4xMjUgNS45MDYyNSBMIDIzLjQzNzUgNS4zNzUgTCAyMy40MDYyNSA1LjM3NSBMIDIzLjM3NSA1LjM0Mzc1IEwgMjIuODQzNzUgNSB6IE0gMjUuOTA2MjUgNy41OTM3NSBMIDI0LjM3NSA4LjkwNjI1IEwgMjQuNTkzNzUgOS4xNTYyNSBMIDI0LjYyNSA5LjE4NzUgTCAyNS4wNjI1IDkuNzgxMjUgTCAyNS4xMjUgOS44NDM3NSBMIDI1LjQwNjI1IDEwLjMxMjUgTCAyNy4wOTM3NSA5LjIxODc1IEwgMjYuNzUgOC42ODc1IEwgMjYuNzE4NzUgOC42NTYyNSBMIDI2LjcxODc1IDguNjI1IEwgMjYuMTg3NSA3LjkzNzUgTCAyNi4xNTYyNSA3LjkwNjI1IEwgMjYuMTI1IDcuODc1IEwgMjUuOTA2MjUgNy41OTM3NSB6IE0gMjguMDMxMjUgMTEgTCAyNi4yMTg3NSAxMS44NDM3NSBMIDI2LjIxODc1IDExLjg3NSBMIDI2LjI1IDExLjkzNzUgTCAyNi41IDEyLjYyNSBMIDI2LjUzMTI1IDEyLjY4NzUgTCAyNi43NSAxMy40Njg3NSBMIDI4LjY1NjI1IDEyLjkzNzUgTCAyOC40Mzc1IDEyLjA5Mzc1IEwgMjguNDA2MjUgMTIuMDMxMjUgTCAyOC40MDYyNSAxMiBMIDI4LjA5Mzc1IDExLjE4NzUgTCAyOC4wOTM3NSAxMS4xNTYyNSBMIDI4LjA2MjUgMTEuMTI1IEwgMjguMDMxMjUgMTEgeiIvPgo8L3N2Zz4K',
      fabricDrawObj: [false, false, false, false, false, false, false],
      fabricObjSize: 80,
      /////////////////////////////////////////////////// 設備地圖
      machineMap: false,
      toolBarOverBorder: false,
      workshopobject: [],
      tabledata: [],
      machineLocation: [],
      setDeviceObj: null,
      oldMachineData: null,
      oldMachineDataJSON: null,
      /////////////////////////////////////////////////// 看版
      factoryKanban: false,
      imgMap: null,
      kanbanTable: [],
      dragKanbanCard: false,
      nowDragKanbanCard: null,

      cardShowMode: 0,
      cardShowObject: [
        { value: 0, text: this.$t('factory_mode1') },
        { value: 1, text: this.$t('factory_mode2') },
        { value: 2, text: this.$t('factory_mode3') }
      ],
      getDataFlag: false,
      fistGetData: false,
      kanbanIndex: 0, //效率指標
      ////////////////////////////////////////////////// 遮罩&訊息時間
      layerShade: true,
      layerShadeClose: true,
      layerTime: 5,
      //////////////////////////////////////////////////////////////
      fabricMousedown: false,
      fabricMousemove: false,
      // fabricdbClick: false,
      /////////////////////////////////////////////////////////////
      fullscreen: false,
      fullscreenimg: require('../../assets/client.png'),
      pagetitle: '',
      currentTime: '0',
      timeNum: 0,
      playsoundflag: false
    }
  },
  created() {
    // this.checkremote() //檢查是否為投放模式
  },
  mounted() {
    clearInterval(window.machineDataTimer)
    clearInterval(this.timer)
    this.player = document.getElementById('player')
    this.getsystem(-1) //取得廠區
    // WorkShopAPI.get({}).then(res => {
    //   if (res.data != null) {
    //     res.data.forEach(item => {
    //       this.workshopobject.push({ value: item.number, text: item.name, id: item.id })
    //     })
    //     this.selectWorkshop = this.workshopobject[0].value
    //     this.nowWorkShopName = this.workshopobject[0].text
    //     this.nowWorkShop = this.workshopobject[0]
    //     // this.getMachineData()
    //   }
    // })
    const that = this
    window.onresize = () => {
      return (() => {
        window.screenWidth = window.innerWidth
        that.screenWidth = window.screenWidth
        window.screenHeight = window.innerHeight
        that.screenHeight = window.screenHeight
      })()
    }
    this.canvas = new fabric.Canvas('canvas', {
      isDrawingMode: false, //设置是否可以绘制
      selectable: true, //设置是否可以选中拖动
      selection: true,
      selectionColor: 'rgba(255,0,0,0.3)',
      selectionBorderColor: 'blue',
      selectionLineWidth: '5',
      selectionDashArray: [5, 5]
    })
    // this.checkremote() //檢查是否為投放模式
    this.init()
    this.fabricMouseEvent()
    this.savePath()
    window.onmousemove = evt => {
      this.mousePosition = { x: evt.pageX, y: evt.pageY }
    }
    window.onmouseup = () => {
      // console.log(evt)
      this.clickEndTime = new Date().getTime()
      if (this.isToolBarOnDrag) {
        this.isToolBarOnDrag = false
        if (this.clickEndTime - this.clickStartTime >= 300 && !this.toolBarOverBorder) {
          this.toolBarShow = !this.toolBarShow
        }
      }
      if (this.dragKanbanCard) {
        this.dragKanbanCard = false
      }
    }
    document.addEventListener('keyup', event => {
      if (event.keyCode == '46') {
        if (this.factoryMap && this.canvas.getActiveObjects()) {
          this.canvas.getActiveObjects().forEach(obj => {
            this.canvas.remove(obj)
          })
          this.savePath()
          this.canvas.discardActiveObject().renderAll()
        } else if (this.machineMap && this.canvas.getActiveObjects()) {
          // console.log(this.canvas.getActiveObjects())
          let table = document.getElementsByClassName('deviceTableTr')
          this.canvas.getActiveObjects().forEach(obj => {
            table.forEach(tr => {
              if (tr.getAttribute('machineid') == obj.machineId) {
                tr.style.display = 'table-row'
                this.canvas.remove(obj)
              }
            })
          })
          this.canvas._objects.forEach(obj => {
            if (obj.machineId == undefined && obj.backgroundGrid == undefined) {
              this.canvas.remove(obj)
            }
          })
          this.savePath()
          this.canvas.discardActiveObject().renderAll()
        }
      } else if (event.ctrlKey && event.keyCode == '86') {
        if (this.factoryMap) {
          this.cloneObject()
        }
      }
      this.fabricMousemove = false
      this.fabricMousedown = false
      // this.fabricdbClick = false
    })
  },
  watch: {
    cardShowMode() {
      this.getMachineData()
    },
    selectWorkshop() {
      if (this.selectWorkshop) {
        this.fistGetData = false
        this.workshopobject.map(workshop => {
          if (workshop.value == this.selectWorkshop) {
            this.nowWorkShop = workshop
            this.nowWorkShopName = workshop.text
          }
        })
      }
      if (!this.factoryMap && !this.machineMap) {
        this.factoryKanban = false
        this.initKanban()
      }
    },
    screenWidth() {
      if (!this.screenTimer) {
        this.screenTimer = true
        let that = this
        setTimeout(function() {
          that.init()
          if (that.isGrid) {
            that.deleteGrid()
            that.drawGrid()
          }
          that.screenTimer = false
          that.checkToolBarBorder()
        }, 400)
      }
    },
    screenHeight() {
      if (!this.screenTimer) {
        this.screenTimer = true
        let that = this
        setTimeout(function() {
          that.init()
          if (that.isGrid) {
            that.deleteGrid()
            that.drawGrid()
          }
          that.screenTimer = false
          that.checkToolBarBorder()
        }, 400)
      }
    },
    toolBarBorder(obj) {
      let toolBar = document.getElementById('buttonGroup')
      if (toolBar.offsetTop == 0) {
        toolBar.style.top = obj.startY + 'px'
      }
    },
    mousePosition() {
      if (this.isToolBarOnDrag) {
        let x = this.screenWidth - (this.mousePosition.x + this.StartMousePosition.x)
        let y = this.mousePosition.y - this.StartMousePosition.y
        let width = document.getElementById('buttonGroup').offsetWidth
        let height = document.getElementById('buttonGroup').offsetHeight
        let canvasCoordinates = this.toolBarBorder
        let sideNavWidth = document.getElementById('pageContent').offsetLeft
        if (this.toolBarOverBorder) {
          this.toolBarOverBorder = false
        }
        if (x < 0) {
          //最右邊 endX
          x = 0
          this.toolBarOverBorder = true
        } else if (x + width + sideNavWidth > canvasCoordinates.endX) {
          ///最左邊 startX
          x = canvasCoordinates.endX - width - sideNavWidth
          this.toolBarOverBorder = true
        }
        if (y < canvasCoordinates.startY) {
          //最上邊 startY
          y = canvasCoordinates.startY
          this.toolBarOverBorder = true
        } else if (y + height > canvasCoordinates.endY) {
          //最下邊 endY
          y = canvasCoordinates.endY - height
          this.toolBarOverBorder = true
        }
        document.getElementById('buttonGroup').style.right = x + 'px'
        document.getElementById('buttonGroup').style.top = y + 'px'
      }
      if (this.dragKanbanCard) {
        let x = this.mousePosition.x - this.StartMousePosition.x
        let y = this.mousePosition.y - this.StartMousePosition.y
        let width = this.nowDragKanbanCard.offsetWidth
        let height = this.nowDragKanbanCard.offsetHeight
        let kanbanLeft = document.getElementById('Kanban').offsetLeft
        let kanbanTop = document.getElementById('Kanban').offsetTop
        let kanbanRight =
          document.getElementById('Kanban').offsetLeft +
          document.getElementById('Kanban').offsetWidth
        let kanbanBottom =
          document.getElementById('Kanban').offsetTop +
          document.getElementById('Kanban').offsetHeight
        if (x + width > kanbanRight) {
          x = kanbanRight - width
        }
        if (x < kanbanLeft) {
          x = kanbanLeft
        }
        if (y + height > kanbanBottom) {
          y = kanbanBottom - height
        }
        if (y < kanbanTop) {
          y = kanbanTop
        }
        this.nowDragKanbanCard.style.left = x + 'px'
        this.nowDragKanbanCard.style.top = y + 'px'
      }
    },
    factoryKanban() {
      if (this.factoryKanban) {
        window.machineDataTimer = window.setInterval(() => {
          this.getMachineData()
        }, 5000)
      } else {
        clearInterval(window.machineDataTimer)
      }
    }
  },
  methods: {
    //點選反白
    focus(event) {
      event.currentTarget.select()
    },
    //檢查是否為投放模式
    checkremote() {
      var vars = {}
      window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        vars[key] = value
      })
      if (vars['type'] != undefined) {
        this.fullscreenChange()

        // this.remoteflag = true
        // this.type = vars['type']
        // this.wrokshopid = vars['group']
        // this.pagenum = vars['page']
        // this.mode = vars['mode']
        // this.modeselected = vars['mode']
      } else {
        this.init()
      }
    },
    //系統時間、語言、checkTesk、廠區、系統設定for看版
    getsystem(num) {
      RemoteInfoAPI({}).then(
        res => {
          //初始化頁面
          if (num == -1) {
            if (res.data.workShops != null) {
              res.data.workShops.forEach(item => {
                this.workshopobject.push({ value: item.number, text: item.name, id: item.id })
              })
              this.selectWorkshop = this.workshopobject[0].value
              this.nowWorkShopName = this.workshopobject[0].text
              this.nowWorkShop = this.workshopobject[0]
            } else {
              // this.workshopName = 'AIoM Dashboard'
            }
          }
          //設定時間
          var nowsystime = new Date().getTime()
          this.localSRV = nowsystime - res.data.timestamp
          var currentTime = new Date(res.data.timestamp)
          this.currentTime = this.timestamptotime(currentTime)
        },
        error => {
          console.log(error)
        }
      )
    },
    init() {
      let canvasWidth
      let canvasHeight
      if (this.fullscreen) {
        canvasWidth = this.screenWidth
        canvasHeight =
          this.screenHeight -
          document.getElementById('pageContent').offsetTop -
          document.getElementById('mainButton').offsetHeight
      } else {
        canvasWidth = this.screenWidth - document.getElementById('pageContent').offsetLeft
        canvasHeight =
          this.screenHeight -
          document.getElementById('pageContent').offsetTop -
          document.getElementById('mainButton').offsetHeight -
          document.getElementsByClassName('footerfix')[0].offsetHeight
      }
      this.canvas.setWidth(canvasWidth) //设置画布的宽度
      this.canvas.setHeight(canvasHeight) //设置画布的高度
      this.canvas.setBackgroundColor(this.mapColor)
      this.deleteImg = document.createElement('img')
      this.deleteImg.src = this.deleteIcon
      this.cloneImg = document.createElement('img')
      this.cloneImg.src = this.cloneIcon
      this.flipXImg = document.createElement('img')
      this.flipXImg.src = this.flipXIcon
      this.flipYImg = document.createElement('img')
      this.flipYImg.src = this.flipYIcon
      this.rotateImg = document.createElement('img')
      this.rotateImg.src = this.rotateIcon
      fabric.Object.prototype.transparentCorners = false
      fabric.Object.prototype.cornerColor = 'blue'
      fabric.Object.prototype.cornerStyle = 'circle'
      fabric.Object.prototype.controls.flipX = new fabric.Control({
        x: 0.5,
        y: 0.5,
        offsetY: 16,
        offsetX: 16,
        cursorStyle: 'pointer',
        mouseUpHandler: this.ObjectFlipX,
        render: this.renderIcon(this.flipXImg),
        cornerSize: this.cornerSize
      })
      fabric.Object.prototype.controls.flipY = new fabric.Control({
        x: -0.5,
        y: 0.5,
        offsetY: 16,
        offsetX: -16,
        cursorStyle: 'pointer',
        mouseUpHandler: this.ObjectFlipY,
        render: this.renderIcon(this.flipYImg),
        cornerSize: this.cornerSize
      })
      fabric.Object.prototype.controls.rotate = new fabric.Control({
        x: 0,
        y: 0.5,
        offsetY: 16,
        offsetX: 4,
        cursorStyle: 'pointer',
        mouseUpHandler: this.ObjectRotate,
        render: this.renderIcon(this.rotateImg),
        cornerSize: this.cornerSize
      })
      fabric.Object.prototype.controls.deleteControl = new fabric.Control({
        x: 0.5,
        y: -0.5,
        offsetY: -16,
        offsetX: 16,
        cursorStyle: 'pointer',
        mouseUpHandler: this.deleteObject,
        render: this.renderIcon(this.deleteImg),
        cornerSize: this.cornerSize
      })
      if (this.factoryMap) {
        fabric.Object.prototype.controls.clone = new fabric.Control({
          x: -0.5,
          y: -0.5,
          offsetY: -16,
          offsetX: -16,
          cursorStyle: 'pointer',
          mouseUpHandler: this.cloneObject,
          render: this.renderIcon(this.cloneImg),
          cornerSize: this.cornerSize
        })
        fabric.Object.prototype.setControlsVisibility({
          bl: true,
          br: true,
          mb: true,
          ml: true,
          mr: true,
          mt: true,
          tl: true,
          tr: true,
          mtr: true
        })
      } else if (!this.factoryMap && this.machineMap) {
        delete fabric.Object.prototype.controls.clone //擺設備時不clone
        fabric.Object.prototype.setControlsVisibility({
          bl: false,
          br: false,
          mb: false,
          ml: false,
          mr: false,
          mt: false,
          tl: false,
          tr: false,
          mtr: true
        })
      }
      fabric.backgroundGrid = fabric.util.createClass(fabric.Line, {
        type: 'backgroundGrid'
      })
      fabric.deviceHoverInfo = fabric.util.createClass(fabric.Group, {
        type: 'deviceHoverInfo'
      })
    },
    toolBarConfig() {
      let ogConfigWidth = 150
      if (!this.toolBarShow) {
        this.toolBarShow = true
        if (this.machineMap) {
          this.$nextTick(() => {
            let deviceTableWidth = document.getElementsByClassName('deviceTable')[0].offsetWidth
            document.getElementsByClassName('mainToolConfig')[0].style.minWidth =
              deviceTableWidth + 'px'
            let configWidth = parseInt(
              document.getElementsByClassName('mainToolConfig')[0].style.minWidth
            )
            let toolBarConfigRight = parseInt(document.getElementById('buttonGroup').style.right)
            if (toolBarConfigRight + configWidth >= document.getElementById('canvas').offsetWidth) {
              if (this.toolBarShow) {
                document.getElementById('buttonGroup').style.right =
                  toolBarConfigRight - configWidth + ogConfigWidth + 'px'
              }
            }
          })
        } else {
          this.$nextTick(() => {
            document.getElementsByClassName('mainToolConfig')[0].style.minWidth =
              ogConfigWidth + 'px'
          })
        }
      } else {
        this.toolBarShow = false
        this.$nextTick(() => {
          document.getElementsByClassName('mainToolConfig')[0].style.minWidth = ogConfigWidth + 'px'
        })
      }
    },
    selectToolBar(evt) {
      this.clickStartTime = new Date().getTime()
      this.isToolBarOnDrag = true
      this.StartMousePosition = {
        x: evt.layerX,
        y: evt.layerY
      }
    },
    startCheckSize() {
      this.oldFactoryData = null
      workshopKanbanCategoriesAPI
        .get({
          headers: {
            category: JSON.stringify([1, 2]),
            id: this.nowWorkShop.id
          }
        })
        .then(response => {
          if (response.status == 200) {
            this.oldFactoryData = response.data
            if (this.oldFactoryData) {
              this.oldFactoryData[0].object = JSON.parse(this.oldFactoryData[0].object)
              this.oldFactoryData[1].object = JSON.parse(this.oldFactoryData[1].object)
              this.mapHeight = this.oldFactoryData[0].object.mapSize.height
              this.mapWidth = this.oldFactoryData[0].object.mapSize.width
              this.mapColor = this.oldFactoryData[0].object.mapSize.color
            } else {
              this.mapHeight = 0
              this.mapWidth = 0
              this.mapColor = '#eeeeee'
            }
            this.errormes = ''
            this.checkFactoryMapSize = true
            this.$nextTick(() => {
              document.getElementsByTagName('input').forEach(item => {
                if (item.type == 'color') {
                  item.style.cursor = 'pointer'
                }
              })
            })
          }
        })
        .catch(err => {
          this.$layer.msg(err, {
            shade: this.layerShade,
            shadeClose: this.layerShadeClose,
            time: this.layerTime
          })
        })
    },
    beforeCloseCheckSize() {
      if (this.mapHeight < 3 || this.mapHeight > 100) {
        this.errormes = this.$t('factory_factory_height_error')
        // this.$layer.msg(this.$t('factory_factory_height_error'), {
        //   shade: this.layerShade,
        //   shadeClose: this.layerShadeClose,
        //   time: this.layerTime
        // })
        return
      } else if (this.mapWidth < 3 || this.mapWidth > 100) {
        this.errormes = this.$t('factory_factory_width_error')
        // this.$layer.msg(this.$t('factory_factory_width_error'), {
        //   shade: this.layerShade,
        //   shadeClose: this.layerShadeClose,
        //   time: this.layerTime
        // })
        return
      } else {
        this.mapWidth = parseFloat(this.mapWidth)
        this.mapHeight = parseFloat(this.mapHeight)
        this.checkFactoryMapSize = false
        this.unDoArray.length = 0
        this.reDoArray.length = 0
        this.startFactoryMap()
      }
    },
    startFactoryMap() {
      this.factoryMap = true
      this.machineMap = false
      this.fistGetData = false
      this.factoryKanban = false
      this.checkFactoryMapSize = false
      this.fabricDrawObj.fill(false)
      this.isGrid = false
      this.canvas.clear()
      this.init()

      this.$nextTick(() => {
        this.checkToolBarBorder()
        this.toolBarShow = true
        this.toolBarConfig()
        if (this.oldFactoryData) {
          this.loadFactoryMap()
        }
      })
    },
    checkToolBarBorder() {
      let canvasCoordinate = document.getElementsByClassName('canvas-container')[0]
      let startX = canvasCoordinate.offsetLeft
      let startY = canvasCoordinate.offsetTop
      let endX = canvasCoordinate.offsetWidth + startX
      let endY = canvasCoordinate.offsetHeight + startY
      this.toolBarBorder = {
        startX: startX,
        endX: endX,
        startY: startY,
        endY: endY
      }
    },
    //點選新增設備
    beforeSetDevice(item, index) {
      if (item.width == 0 || item.height == 0) {
        this.$layer.msg(
          this.$t('factory_please_maintain') + item.machineNumber + this.$t('factory_base_data'),
          {
            shade: this.layerShade,
            shadeClose: this.layerShadeClose,
            time: this.layerTime
          }
        )
      } else {
        document.getElementsByClassName('deviceTableTr').forEach(tr => {
          tr.style.backgroundColor = 'white'
        })
        document.getElementsByClassName('deviceTableTr')[index].style.backgroundColor = 'darkgrey'
        this.setDeviceObj = {
          item: item,
          index: index
        }
      }
    },
    //新增設備
    setDevice(item, index, x, y, angle, flipX, flipY) {
      this.canvas.isDrawingMode = false
      let that = this
      fabric.loadSVGFromURL('../../../../img/svg/machine.svg', function(objects, options) {
        let maplonger = that.mapWidth //that.mapWidth >= that.mapHeight ? that.mapWidth : that.mapHeight //瀏覽器長
        let mapShorter = that.mapHeight //that.mapWidth <= that.mapHeight ? that.mapWidth : that.mapHeight //瀏覽器寬
        let canvasLonger = that.canvas.width
        // that.canvas.width >= that.canvas.height ? that.canvas.width : that.canvas.height //廠區長
        let canvasShorter = that.canvas.height
        // that.canvas.width <= that.canvas.height ? that.canvas.width : that.canvas.height //廠區寬
        let distanceLonger = canvasLonger / maplonger
        let distanceShorter = canvasShorter / mapShorter

        let svgObjects = fabric.util.groupSVGElements(objects, options)
        let ogWidth = options.width
        let ogHeight = options.height
        // let temp = (1 / ogWidth) * distanceLonger //(1 / ogHeight) * distanceShorter //(1 / ogWidth) * distanceLonger

        let ScaleSvgX = (1 / ogWidth) * distanceLonger * item.width
        let ScaleSvgY = (1 / ogHeight) * distanceShorter * item.height

        x = that.checkPutBorder(x, y, ogWidth * ScaleSvgX, ogHeight * ScaleSvgY)[0]
        y = that.checkPutBorder(x, y, ogWidth * ScaleSvgX, ogHeight * ScaleSvgY)[1]
        svgObjects.set({
          scaleX: ScaleSvgX,
          scaleY: ScaleSvgY, //ScaleSvgX,//縮放比例!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
          fill: '#000000',
          angle: angle,
          flipX: flipX,
          flipY: flipY,
          id: index,
          machineId: item.id,
          machineNumber: item.machineNumber,
          left: x,
          top: y,
          padding: 0,
          strokeWidth: 0
        })
        that.newFabricItem(svgObjects)
      })
      document.getElementsByClassName('deviceTableTr')[index].style.backgroundColor = 'white'
      document.getElementsByClassName('deviceTableTr')[index].style.display = 'none'
      this.setDeviceObj = null
    },
    checkfabricDrawObj(index) {
      for (let i = 0; i < this.fabricDrawObj.length; i++) {
        if (i == index) {
          this.$set(this.fabricDrawObj, i, true)
        } else {
          this.$set(this.fabricDrawObj, i, false)
        }
      }
    },
    drawLine(x, y) {
      this.canvas.isDrawingMode = false
      x = this.checkPutBorder(x, y, this.fabricObjSize, 5)[0]
      y = this.checkPutBorder(x, y, this.fabricObjSize, 5)[1]
      let line = new fabric.Line([50, 100, 210, 100], {
        stroke: 'gray',
        strokeWidth: 5,
        left: x,
        top: y,
        padding: 0
      })
      this.newFabricItem(line)
      this.fabricLine = false
    },
    drawRightTriangle(x, y) {
      this.canvas.isDrawingMode = false
      let path = 'M0 0 H -80 V -80 Z'
      x = this.checkPutBorder(x, y, this.fabricObjSize, this.fabricObjSize)[0]
      y = this.checkPutBorder(x, y, this.fabricObjSize, this.fabricObjSize)[1]
      let rightTriangle = new fabric.Path(path, {
        left: x,
        top: y,
        fill: 'gray',
        padding: 0,
        strokeWidth: 0
      })
      this.newFabricItem(rightTriangle)
      this.fabricRightTriangle = false
    },
    drawTriangle(x, y) {
      this.canvas.isDrawingMode = false
      x = this.checkPutBorder(x, y, this.fabricObjSize, this.fabricObjSize)[0]
      y = this.checkPutBorder(x, y, this.fabricObjSize, this.fabricObjSize)[1]
      let triangle = new fabric.Triangle({
        width: this.fabricObjSize,
        height: this.fabricObjSize,
        top: y,
        left: x,
        fill: 'gray',
        padding: 0,
        strokeWidth: 0
      })
      this.newFabricItem(triangle)
      this.fabricTriangle = false
    },
    drawRect(x, y) {
      this.canvas.isDrawingMode = false
      x = this.checkPutBorder(x, y, this.fabricObjSize, this.fabricObjSize)[0]
      y = this.checkPutBorder(x, y, this.fabricObjSize, this.fabricObjSize)[1]
      let rect = new fabric.Rect({
        left: x,
        top: y,
        fill: 'gray',
        width: this.fabricObjSize,
        height: this.fabricObjSize,
        padding: 0,
        strokeWidth: 0
      })
      this.newFabricItem(rect)
      this.fabricRect = false
    },
    drawCircle(x, y) {
      this.canvas.isDrawingMode = false
      x = this.checkPutBorder(x, y, this.fabricObjSize, this.fabricObjSize)[0]
      y = this.checkPutBorder(x, y, this.fabricObjSize, this.fabricObjSize)[1]
      let circle = new fabric.Circle({
        radius: this.fabricObjSize / 2,
        fill: 'gray',
        top: y,
        left: x,
        padding: 0,
        strokeWidth: 0
      })
      this.newFabricItem(circle)
      this.fabricCircle = false
    },
    editText(x, y) {
      this.canvas.isDrawingMode = false
      x = this.checkPutBorder(x, y, this.fabricObjSize * 2, this.fabricObjSize / 2)[0]
      y = this.checkPutBorder(x, y, this.fabricObjSize * 2, this.fabricObjSize / 2)[1]
      let iText = new fabric.IText(this.$t('text_box'), {
        fontFamily: '微軟正黑體',
        left: x,
        top: y,
        padding: 0,
        strokeWidth: 0
      })
      this.newFabricItem(iText)
      this.fabricText = false
    },
    setDoor(x, y) {
      this.canvas.isDrawingMode = false
      x = this.checkPutBorder(x, y, this.fabricObjSize, this.fabricObjSize)[0]
      y = this.checkPutBorder(x, y, this.fabricObjSize, this.fabricObjSize)[1]
      let that = this
      fabric.loadSVGFromURL('../../../../img/svg/' + 'door' + '.svg', function(objects, options) {
        let svgObjects = fabric.util.groupSVGElements(objects, options)
        // console.log(options)
        let ogWidth = options.width
        let ogHeight = options.height
        let scaleSvgX = that.fabricObjSize / ogWidth
        let ScaleSvgY = that.fabricObjSize / ogHeight
        svgObjects.set({
          scaleX: scaleSvgX,
          scaleY: ScaleSvgY,
          fill: '#343a40',
          left: x,
          top: y,
          padding: 0,
          strokeWidth: 0
        })
        that.newFabricItem(svgObjects)
        that.fabricDoor = false
      })
    },
    drawGrid() {
      if (!this.isGrid) {
        let maplonger = this.mapWidth >= this.mapHeight ? this.mapWidth : this.mapHeight
        let mapShorter = this.mapWidth <= this.mapHeight ? this.mapWidth : this.mapHeight
        let canvasLonger =
          this.canvas.width >= this.canvas.height ? this.canvas.width : this.canvas.height
        let canvasShorter =
          this.canvas.width <= this.canvas.height ? this.canvas.width : this.canvas.height
        let distanceLonger = canvasLonger / maplonger
        let distanceShorter = canvasShorter / mapShorter
        let vLine
        let hLine
        let lineDef = {
          fill: 'black',
          stroke: 'rgba(0, 0, 0, 0.1)',
          strokeWidth: 1,
          selectable: false,
          padding: 0,
          backgroundGrid: true
        }
        for (let i = 1; i * distanceLonger < canvasLonger; i++) {
          vLine = new fabric.backgroundGrid(
            [i * distanceLonger, 0, i * distanceLonger, canvasLonger],
            lineDef
          )
          if (i % 5 === 0) {
            vLine.stroke = 'rgba(0, 0, 0, 0.5)'
          }
          this.canvas.add(vLine)
          this.canvas.sendToBack(vLine)
        }
        for (let i = 1; i * distanceShorter < canvasShorter; i++) {
          hLine = new fabric.backgroundGrid(
            [0, i * distanceShorter, canvasLonger, i * distanceShorter],
            lineDef
          )
          if (i % 5 === 0) {
            hLine.stroke = 'rgba(0, 0, 0, 0.5)'
          }
          this.canvas.add(hLine)
          this.canvas.sendToBack(hLine)
        }
        this.isGrid = true
      }
    },
    //清除網格
    deleteGrid() {
      if (this.isGrid && !this.machineMap) {
        let nowCanvas = JSON.parse(JSON.stringify(this.canvas))
        nowCanvas.objects = nowCanvas.objects.filter(item => {
          if (item.type != 'backgroundGrid') {
            return item
          }
        })
        this.canvas.loadFromJSON(nowCanvas)
        this.isGrid = false
      } else if (this.isGrid && this.machineMap) {
        let nowCanvas = this.canvas.toJSON(['machineId', 'machineNumber', 'd', 'id']) //toJSON自己添加的屬性儲存
        nowCanvas.objects = nowCanvas.objects.filter(item => {
          if (item.type != 'backgroundGrid') {
            return item
          }
        })

        this.canvas.loadFromJSON(nowCanvas)

        this.isGrid = false
      }
    },
    clearAll() {
      let checkLength = JSON.parse(this.state)
      if (checkLength.objects.length == 0) {
        this.$layer.msg(this.$t('no_objects_to_clear'), {
          shade: this.layerShade,
          shadeClose: this.layerShadeClose,
          time: this.layerTime
        })
        return
      } else {
        this.canvas.clear()
        this.savePath()
      }
    },
    newFabricItem(obj) {
      this.canvas.add(obj)
      this.canvas.setActiveObject(obj)
      this.savePath()
    },
    deleteObject(eventData, target) {
      let obj = target.canvas
      if (obj && target && target.type == 'activeSelection') {
        target._objects.forEach(item => {
          obj.remove(item)
        })
      } else if (obj != undefined && target) {
        obj.remove(target)
      }
      if (this.machineMap) {
        // console.log(target)
        if (target._objects) {
          //群組
          let table = document.getElementsByClassName('deviceTableTr')
          target._objects.forEach(obj => {
            if (obj.machineId == undefined) {
              //單筆設備
              table.forEach(tr => {
                if (tr.getAttribute('machineid') == target.machineId) {
                  tr.style.display = 'table-row'
                }
              })
            } else {
              table.forEach(tr => {
                if (tr.getAttribute('machineid') == obj.machineId) {
                  tr.style.display = 'table-row'
                }
              })
            }
          })
        } else {
          let table = document.getElementsByClassName('deviceTableTr')
          table.forEach(tr => {
            if (tr.getAttribute('machineid') == target.machineId) {
              tr.style.display = 'table-row'
            }
          })
        }
      }
      this.savePath()
      this.fabricMousemove = false
      this.fabricMousedown = false
      // this.fabricdbClick = false
      this.canvas.discardActiveObject().renderAll()
    },
    cloneObject() {
      let activeObjects = this.canvas.getActiveObjects()
      if (activeObjects) {
        if (activeObjects.length > 1) {
          let clonedArray = []
          activeObjects.forEach(obj => {
            obj.clone(cloned => {
              if (cloned != undefined) {
                if (obj.group.angle > 0) {
                  this.cloneGroupAngle = obj.group.angle
                }
                // let setLeft = obj.group.left + cloned.left + obj.group.width / 2 + 10
                // let setTop = obj.group.top + cloned.top + obj.group.height / 2 + 10

                this.canvas.add(
                  cloned.set({
                    left: obj.group.left + cloned.left + obj.group.width / 2 + 10,
                    top: obj.group.top + cloned.top + obj.group.height / 2 + 10,
                    angle: cloned.angle
                  })
                )
                clonedArray.push(cloned)
              }
            })
          })
          let selection = new fabric.ActiveSelection(clonedArray, {
            canvas: this.canvas
          })
          selection.angle = this.cloneGroupAngle
          this.canvas.setActiveObject(selection)
          this.cloneGroupAngle = null
        } else {
          if (activeObjects == undefined || !activeObjects || activeObjects.length == 0) {
            return
          }
          activeObjects[0].clone(cloned => {
            if (cloned != undefined) {
              this.canvas.add(
                cloned.set({
                  left: cloned.left + 10,
                  top: cloned.top + 10
                })
              )
              this.canvas.setActiveObject(cloned)
            }
          })
        }
      }
      this.savePath()
      this.canvas.renderAll()
    },
    ObjectFlipX(eventData, target) {
      let activeObjects = this.canvas.getActiveObjects()
      if (activeObjects) {
        target.flipX = !target.flipX
      }
      this.savePath()
      this.canvas.renderAll()
    },
    ObjectFlipY(eventData, target) {
      let activeObjects = this.canvas.getActiveObjects()
      if (activeObjects) {
        target.flipY = !target.flipY
      }
      this.savePath()
      this.canvas.renderAll()
    },
    ObjectRotate(eventData, target) {
      let activeObjects = this.canvas.getActiveObjects()
      if (activeObjects) {
        if (target.angle == undefined) {
          target.rotate(45)
        } else {
          target.rotate(target.angle + 45)
          if (target.angle >= 360) {
            target.angle = target.angle % 360
          }
        }
      }
      this.savePath()
      this.canvas.renderAll()
    },
    renderIcon(icon) {
      return function renderIcon(ctx, left, top, styleOverride, fabricObject) {
        let size = this.cornerSize
        ctx.save()
        ctx.translate(left, top)
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle))
        ctx.drawImage(icon, -size / 2, -size / 2, size, size)
        ctx.restore()
      }
    },
    fabricMouseEvent() {
      // this.canvas.on('mouse:dblclick', (e)=>{
      //   if (e.target && !this.fabricMousemove && this.fabricdbClick){
      //     if (e.target.angle == undefined){
      //       e.target.rotate(45);
      //     }
      //     else {
      //       e.target.rotate(e.target.angle + 45);
      //       if (e.target.angle >= 360){
      //         e.target.angle =  (e.target.angle)%360
      //       }
      //     }
      //     this.canvas.renderAll();
      //     this.checkBorder(e)
      //     this.canvas.renderAll();
      //     this.savePath()
      //     this.fabricdbClick = false
      //   }
      // })
      this.canvas.on('mouse:down', e => {
        if (e.target) {
          // if (this.fabricMousedown && !this.fabricdbClick){
          //   this.fabricdbClick = true
          //   this.fabricMousedown = false
          // }
          // else {
          this.fabricMousedown = true
          // }
        }
      })
      this.canvas.on('mouse:move', () => {
        // console.log(e)
        if (this.fabricMousedown) {
          this.fabricMousemove = true
        }
      })
      this.canvas.on('mouse:up', e => {
        if (this.fabricMousedown && this.fabricMousemove) {
          if (e.target) {
            this.checkBorder(e) //判斷是否超出邊界
            this.savePath()
          }
          this.fabricMousedown = false
          this.fabricMousemove = false
        } else {
          if (this.factoryMap) {
            //擺底圖
            if (this.fabricDrawObj) {
              let index = this.fabricDrawObj.findIndex(index => index == true)
              switch (index) {
                case 0:
                  this.drawLine(e.pointer.x, e.pointer.y)
                  this.$set(this.fabricDrawObj, index, false)
                  break
                case 1:
                  this.drawTriangle(e.pointer.x, e.pointer.y)
                  this.$set(this.fabricDrawObj, index, false)
                  break
                case 2:
                  this.drawRightTriangle(e.pointer.x, e.pointer.y)
                  this.$set(this.fabricDrawObj, index, false)
                  break
                case 3:
                  this.drawRect(e.pointer.x, e.pointer.y)
                  this.$set(this.fabricDrawObj, index, false)
                  break
                case 4:
                  this.drawCircle(e.pointer.x, e.pointer.y)
                  this.$set(this.fabricDrawObj, index, false)
                  break
                case 5:
                  this.editText(e.pointer.x, e.pointer.y)
                  this.$set(this.fabricDrawObj, index, false)
                  break
                case 6:
                  this.setDoor(e.pointer.x, e.pointer.y)
                  this.$set(this.fabricDrawObj, index, false)
                  break
                default:
                  break
              }
            }
          } else if (this.machineMap && this.setDeviceObj) {
            //擺設備
            this.setDevice(
              this.setDeviceObj.item,
              this.setDeviceObj.index,
              e.pointer.x,
              e.pointer.y,
              0,
              false,
              false
            )
          }
        }
      })
      this.canvas.on('mouse:over', e => {
        //擺放設備(hoverIn)
        if (e.target && e.target.machineNumber && this.machineMap) {
          let text = new fabric.Text(' ' + e.target.machineNumber + ' ', {
            fontSize: 24,
            originX: 'left',
            originY: 'top',
            width: 100,
            fixedWidth: 100,
            fill: 'white',
            padding: 10,
            fontFamily: '微軟正黑體',
            textBackgroundColor: 'rgb(60,141,188)',
            fontWeight: 800
          })
          let groupTop
          let groupLeft
          let svgHeight = e.target.height * e.target.scaleY
          let svgWidth = e.target.width * e.target.scaleX
          let pointLeft = e.target.left - Math.sin((e.target.angle * Math.PI) / 180) * svgHeight
          let pointRight = e.target.left + Math.cos((e.target.angle * Math.PI) / 180) * svgWidth
          let pointTop = e.target.top + Math.cos((e.target.angle * Math.PI) / 180) * svgHeight
          let pointBottom = e.target.top + Math.sin((e.target.angle * Math.PI) / 180) * svgWidth
          groupLeft = (pointLeft + pointRight) / 2 - 12
          groupTop = (pointTop + pointBottom) / 2 - 12
          let group = new fabric.deviceHoverInfo([text], {
            left: groupLeft,
            top: groupTop,
            selectable: false
          })
          this.canvas.add(group)
          this.canvas.renderAll()
        }
      })
      this.canvas.on('mouse:move', () => {
        // console.log(e)
        if (this.fabricMousedown && this.machineMap) {
          this.canvas._objects.forEach(obj => {
            if (obj.machineId == undefined && obj.backgroundGrid == undefined) {
              this.canvas.remove(obj)
            }
          })
          this.canvas.renderAll()
        }
      })
      this.canvas.on('mouse:out', () => {
        // console.log(e)
        //擺放設備(hoverOut)
        if (this.canvas._objects && this.machineMap) {
          this.canvas._objects.forEach(obj => {
            if (obj.machineId == undefined && obj.backgroundGrid == undefined) {
              this.canvas.remove(obj)
            }
          })
          this.canvas.renderAll()
        }
      })
    },
    checkBorder(e) {
      let angle = e.target.angle
      let border = e.target.lineCoords
      if (angle >= 0 && angle < 90) {
        if (border.bl.x < 0) {
          e.target.left = e.target.left - border.bl.x
        }
        if (border.tr.x > this.canvas.width) {
          e.target.left = e.target.left - (border.tr.x - this.canvas.width)
        }
        if (border.tl.y < 0) {
          e.target.top = e.target.top - border.tl.y
        }
        if (border.br.y > this.canvas.height) {
          e.target.top = e.target.top - (border.br.y - this.canvas.height)
        }
      } else if (angle >= 90 && angle < 180) {
        if (border.br.x < 0) {
          e.target.left = e.target.left - border.br.x
        }
        if (border.tl.x > this.canvas.width) {
          e.target.left = e.target.left - (border.tl.x - this.canvas.width)
        }
        if (border.bl.y < 0) {
          e.target.top = e.target.top - border.bl.y
        }
        if (border.tr.y > this.canvas.height) {
          e.target.top = e.target.top - (border.tr.y - this.canvas.height)
        }
      } else if (angle >= 180 && angle < 270) {
        if (border.tr.x < 0) {
          e.target.left = e.target.left - border.tr.x
        }
        if (border.bl.x > this.canvas.width) {
          e.target.left = e.target.left - (border.bl.x - this.canvas.width)
        }
        if (border.br.y < 0) {
          e.target.top = e.target.top - border.br.y
        }
        if (border.tl.y > this.canvas.height) {
          e.target.top = e.target.top - (border.tl.y - this.canvas.height)
        }
      } else if (angle >= 270 && angle < 360) {
        if (border.tl.x < 0) {
          e.target.left = e.target.left - border.tl.x
        }
        if (border.br.x > this.canvas.width) {
          e.target.left = e.target.left - (border.br.x - this.canvas.width)
        }
        if (border.tr.y < 0) {
          e.target.top = e.target.top - border.tr.y
        }
        if (border.bl.y > this.canvas.height) {
          e.target.top = e.target.top - (border.bl.y - this.canvas.height)
        }
      }
    },
    checkPutBorder(x, y, w, h) {
      if (this.canvas.width - x < w) {
        x = this.canvas.width - w
      }
      if (this.canvas.height - y < h) {
        y = this.canvas.height - h
      }
      return [x, y]
    },
    savePath() {
      this.state = JSON.stringify(this.canvas)
      this.unDoArray.push(this.state)
      this.reDoArray.length = 0
    },
    unDo() {
      if (this.unDoArray.length == 1) {
        // this.$layer.msg(this.$t('no_previous_step_to_recover'), {
        //   shade: this.layerShade,
        //   shadeClose: this.layerShadeClose,
        //   time: this.layerTime
        // })
        return
      } else {
        let lastJSON = this.unDoArray.pop()
        this.reDoArray.push(lastJSON)
        this.state = this.unDoArray[this.unDoArray.length - 1]
        this.canvas.loadFromJSON(this.state)
        this.canvas.renderAll()
      }
    },
    reDo() {
      if (!this.reDoArray.length) {
        // this.$layer.msg(this.$t('no_next_step_to_recover'), {
        //   shade: this.layerShade,
        //   shadeClose: this.layerShadeClose,
        //   time: this.layerTime
        // })
        return
      } else {
        this.state = this.reDoArray[this.reDoArray.length - 1]
        let lastJSON = this.reDoArray.pop()
        this.unDoArray.push(lastJSON)
        this.canvas.loadFromJSON(this.state)
        this.canvas.renderAll()
      }
    },
    saveFactoryMap() {
      this.deleteGrid()
      this.canvas.discardActiveObject().renderAll()
      let saveFile = JSON.parse(JSON.stringify(this.canvas))
      saveFile['mapSizeResolution'] = {
        width: this.canvas.width,
        height: this.canvas.height
      }
      saveFile['mapSize'] = {
        width: this.mapWidth,
        height: this.mapHeight,
        color: this.mapColor
      }
      saveFile = JSON.stringify(saveFile)
      if (this.oldFactoryData) {
        this.$confirm(this.$t('factory_confirm_cover_map'), this.$t('factory_map_exist'), {
          type: 'warning'
        })
          .then(ok => {
            console.log(ok)
            let data1 = {
              category: 1,
              object: saveFile,
              workShopID: this.nowWorkShop.id,
              id: this.oldFactoryData[0].id
            }
            workshopKanbanAPI
              .put(data1)
              .then(response => {
                if (response.status == 200) {
                  let canvas = document.getElementById('canvas')
                  let url = canvas.toDataURL('image/png')
                  let saveFactoryMapImg = {
                    img: url,
                    mapSize: {
                      width: this.mapWidth,
                      height: this.mapHeight,
                      color: this.mapColor
                    },
                    mapSizeResolution: {
                      width: this.canvas.width,
                      height: this.canvas.height
                    }
                  }
                  let data2 = {
                    category: 2,
                    object: JSON.stringify(saveFactoryMapImg),
                    workShopID: this.nowWorkShop.id,
                    id: this.oldFactoryData[1].id
                  }
                  workshopKanbanAPI
                    .put(data2)
                    .then(response => {
                      if (response.status == 200) {
                        let url = this.canvas.toDataURL('image/png')
                        workshopKanbanCategoryAPI
                          .get({
                            headers: {
                              category: 3,
                              id: this.nowWorkShop.id
                            }
                          })
                          .then(response => {
                            if (response.status == 200) {
                              if (response.data) {
                                let category3Obj = JSON.parse(response.data.object)
                                category3Obj.backgroundImage.src = url
                                let newcategory3id = response.data.id
                                ;(category3Obj['mapSize'] = {
                                  width: this.mapWidth,
                                  height: this.mapHeight,
                                  color: this.mapColor
                                }),
                                  (category3Obj['mapSizeResolution'] = {
                                    width: this.canvas.width,
                                    height: this.canvas.height
                                  })
                                let newcategory3Obj = JSON.stringify(category3Obj)
                                let data3 = {
                                  category: 3,
                                  object: newcategory3Obj,
                                  workShopID: this.nowWorkShop.id,
                                  id: newcategory3id
                                }
                                workshopKanbanAPI
                                  .put(data3)
                                  .then(response => {
                                    if (response.status == 200) {
                                      this.$layer.msg(this.$t('factory_map_save_success'), {
                                        shade: this.layerShade,
                                        shadeClose: this.layerShadeClose,
                                        time: this.layerTime
                                      })
                                    }
                                  })
                                  .catch(err => {
                                    console.log(err)
                                    this.$layer.msg(this.$t('factory_map_save_fail'), {
                                      shade: this.layerShade,
                                      shadeClose: this.layerShadeClose,
                                      time: this.layerTime
                                    })
                                  })
                              } else {
                                return
                              }
                            }
                          })
                          .catch(err => {
                            if (!JSON.stringify(err.data).includes('no row found')) {
                              this.$layer.msg(this.$t('factory_map_save_fail'), {
                                shade: this.layerShade,
                                shadeClose: this.layerShadeClose,
                                time: this.layerTime
                              })
                            } else {
                              this.$layer.msg(this.$t('factory_map_save_success'), {
                                shade: this.layerShade,
                                shadeClose: this.layerShadeClose,
                                time: this.layerTime
                              })
                            }
                          })
                      }
                    })
                    .catch(err => {
                      console.log(err)
                      this.$layer.msg(this.$t('factory_map_save_fail'), {
                        shade: this.layerShade,
                        shadeClose: this.layerShadeClose,
                        time: this.layerTime
                      })
                    })
                }
              })
              .catch(err => {
                console.log(err)
                this.$layer.msg(this.$t('factory_map_save_fail'), {
                  shade: this.layerShade,
                  shadeClose: this.layerShadeClose,
                  time: this.layerTime
                })
              })
          })
          .catch(err => {
            if (err != 'cancel') {
              this.$layer.msg('Error:' + err, {
                shade: this.layerShade,
                shadeClose: this.layerShadeClose,
                time: this.layerTime
              })
            }
          })
      } else {
        let data = {
          category: 1,
          object: saveFile,
          workShopID: this.nowWorkShop.id
        }
        workshopKanbanAPI
          .post(data)
          .then(response => {
            if (response.status == 200) {
              let canvas = document.getElementById('canvas')
              let url = canvas.toDataURL('image/png')
              let saveFactoryMapImg = {
                img: url,
                mapSize: {
                  width: this.mapWidth,
                  height: this.mapHeight
                },
                mapSizeResolution: {
                  width: this.canvas.width,
                  height: this.canvas.height
                }
              }
              let data = {
                category: 2,
                object: JSON.stringify(saveFactoryMapImg),
                workShopID: this.nowWorkShop.id
              }
              workshopKanbanAPI
                .post(data)
                .then(response => {
                  if (response.status == 200) {
                    this.$layer.msg(this.$t('factory_map_save_success'), {
                      shade: this.layerShade,
                      shadeClose: this.layerShadeClose,
                      time: this.layerTime
                    })
                  }
                })
                .catch(err => {
                  console.log(err)
                  this.$layer.msg(this.$t('factory_map_new_fail'), {
                    shade: this.layerShade,
                    shadeClose: this.layerShadeClose,
                    time: this.layerTime
                  })
                })
            }
          })
          .catch(err => {
            console.log(err)
            this.$layer.msg(this.$t('factory_map_new_fail'), {
              shade: this.layerShade,
              shadeClose: this.layerShadeClose,
              time: this.layerTime
            })
          })
      }
    },
    loadFactoryMap() {
      this.clearAll()
      this.init()
      this.isGrid = false
      let oldData = JSON.parse(JSON.stringify(this.oldFactoryData[0].object))
      let size = oldData.mapSizeResolution
      let scaleX = this.canvas.width / size.width
      let scaleY = this.canvas.height / size.height
      let scaleRatio = scaleX > scaleY ? scaleY : scaleX
      if (scaleX < 1 && scaleY < 1) {
        oldData.objects = oldData.objects.map(item => {
          if (item.type == 'line') {
            item.strokeWidth = item.strokeWidth * scaleRatio
          }
          item.left = item.left * scaleRatio
          item.top = item.top * scaleRatio
          item.scaleX = item.scaleX * scaleRatio
          item.scaleY = item.scaleY * scaleRatio
          return item
        })
        let rightMax = []
        let bottomMax = []
        oldData.objects.forEach(item => {
          // if (item.type == 'line'){
          //   rightMax.push(item.left+item.width*item.scaleX)
          //   bottomMax.push(item.top+item.strokeWidth*item.scaleY)
          // }
          // else {
          //   rightMax.push(item.left+item.width*item.scaleX)
          //   bottomMax.push(item.top+item.height*item.scaleY)
          // }
          // if (item.angle > 0){
          let pointLeft =
            item.left - Math.sin((item.angle * Math.PI) / 180) * item.height * item.scaleY
          let pointRight =
            item.left + Math.cos((item.angle * Math.PI) / 180) * item.width * item.scaleX
          let pointTop =
            item.top + Math.cos((item.angle * Math.PI) / 180) * item.height * item.scaleY
          let pointBottom =
            item.top + Math.sin((item.angle * Math.PI) / 180) * item.width * item.scaleX
          rightMax.push(pointLeft)
          rightMax.push(pointRight)
          bottomMax.push(pointTop)
          bottomMax.push(pointBottom)
          // }
        })
        this.canvas.setWidth(Math.max(...rightMax))
        this.canvas.setHeight(Math.max(...bottomMax))
        this.checkToolBarBorder()
      } else {
        oldData.objects = oldData.objects.map(item => {
          item.left = item.left * scaleX
          item.top = item.top * scaleY
          item.scaleX = item.scaleX * scaleX
          item.scaleY = item.scaleY * scaleY
          return item
        })
      }
      this.canvas.loadFromJSON(oldData)
      this.canvas.setBackgroundColor(this.mapColor)
      this.canvas.renderAll()
      this.savePath()
      this.$layer.msg(this.$t('factory_map_read_success'), {
        shade: this.layerShade,
        shadeClose: this.layerShadeClose,
        time: this.layerTime
      })
    },
    saveImg(index) {
      let canvas = document.getElementById('canvas')
      let url = canvas.toDataURL('image/png')
      if (index == 0) {
        let a = document.createElement('a')
        let event = new MouseEvent('click')
        a.download = this.$t('factory_factory_map') //'廠區地圖'
        a.href = url
        a.dispatchEvent(event)
      } else if (index == 1) {
        let a = document.createElement('a')
        let event = new MouseEvent('click')
        a.download = this.$t('factory_machine_map') //'設備地圖'
        a.href = url
        a.dispatchEvent(event)
      }
    },
    //取得設備
    getAllMachinedata() {
      var access_token_val = this.$cookies.get('access_token')
      MachineAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          this.tabledata = res.data
        },
        error => {
          console.log(error.response)
          // this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    beforeStartMachineMap() {
      this.oldMachineData = null
      this.oldMachineDataJSON = null
      this.getAllMachinedata()
      workshopKanbanCategoriesAPI
        .get({
          headers: {
            category: JSON.stringify([1, 3, 4]),
            id: this.nowWorkShop.id
          }
        })
        .then(response => {
          if (response.status == 200) {
            if (response.data) {
              if (response.data[0]) {
                this.oldMachineDataJSON = response.data
                this.startMachineMap()
                if (response.data[1] && response.data[2]) {
                  this.oldMachineMap = response.data[1]
                  this.machineLocation = response.data[2]

                  setTimeout(() => {
                    this.loadMachineMap()
                  }, 1000)
                }
              }
            } else {
              this.$layer.msg(
                this.$t('workshop') +
                  ': ' +
                  this.nowWorkShop.text +
                  this.$t('factory_map_not_setup_yet'),
                {
                  shade: this.layerShade,
                  shadeClose: this.layerShadeClose,
                  time: this.layerTime
                }
              )
            }
          }
        })
        .catch(err => {
          this.$layer.msg(err, {
            shade: this.layerShade,
            shadeClose: this.layerShadeClose,
            time: this.layerTime
          })
        })
    },
    //modal背景點擊不關閉
    closemodal(value) {
      if (value == undefined) {
        this.checkFactoryMapSize = false
      }
    },
    startMachineMap() {
      this.oldMachineData = null
      this.factoryMap = false
      this.machineMap = true
      this.fistGetData = false
      this.factoryKanban = false
      this.isGrid = false
      this.canvas.clear()
      this.init()

      this.getAllMachinedata()
      ///
      let oldData = JSON.parse(this.oldMachineDataJSON[0].object)
      let size = oldData.mapSizeResolution
      let scaleX = this.canvas.width / size.width
      let scaleY = this.canvas.height / size.height
      let scaleRatio = scaleX > scaleY ? scaleY : scaleX
      if (scaleX < 1 && scaleY < 1) {
        oldData.objects = oldData.objects.map(item => {
          item.left = item.left * scaleRatio
          item.top = item.top * scaleRatio
          item.scaleX = item.scaleX * scaleRatio
          item.scaleY = item.scaleY * scaleRatio
          return item
        })
        let rightMax = []
        let bottomMax = []
        oldData.objects.forEach(item => {
          if (item.type == 'line') {
            rightMax.push(item.left + item.width * item.scaleX)
            bottomMax.push(item.top + item.strokeWidth * item.scaleY)
          } else {
            rightMax.push(item.left + item.width * item.scaleX)
            bottomMax.push(item.top + item.height * item.scaleY)
          }
        })
        this.canvas.setWidth(Math.max(...rightMax))
        this.canvas.setHeight(Math.max(...bottomMax))
        this.checkToolBarBorder()
      } else {
        oldData.objects = oldData.objects.map(item => {
          item.left = item.left * scaleX
          item.top = item.top * scaleY
          item.scaleX = item.scaleX * scaleX
          item.scaleY = item.scaleY * scaleY
          return item
        })
      }
      this.oldMachineData = this.canvas.loadFromJSON(oldData)
      // let mapSizeResolution = this.oldMachineData.mapSizeResolution
      this.mapHeight = this.oldMachineData.mapSize.height
      this.mapWidth = this.oldMachineData.mapSize.width
      let url = this.oldMachineData.toDataURL('image/png')
      let that = this
      fabric.Image.fromURL(url, function(img) {
        that.canvas.setBackgroundImage(img, that.canvas.renderAll.bind(that.canvas), {
          // width: mapSizeResolution.width,
          // height: mapSizeResolution.height,
          width: that.canvas.width,
          height: that.canvas.height,
          repeat: 'no-repeat',
          originX: 'left',
          originY: 'top'
          // left: 0,
          // top: 0,
          // scaleX: that.canvas.width/mapSizeResolution.width,
          // scaleY: that.canvas.height/mapSizeResolution.height,
        })
      })

      this.canvas.clear()
      this.canvas.renderAll()
      // this.init()
      this.machineMap = true
      this.machineLocation = []
      this.$nextTick(() => {
        this.checkToolBarBorder()
        this.toolBarShow = true
        this.toolBarConfig()
        let table = document.getElementsByClassName('deviceTableTr')
        table.forEach(tr => {
          tr.style.display = 'table-row'
        })
      })
    },
    restartAll() {
      this.startMachineMap()
    },
    saveMachineMap() {
      // this.deleteGrid()
      this.isGrid = false //關閉網格顯示
      this.canvas.discardActiveObject().renderAll()
      let nowCanvas = this.canvas.toJSON(['machineId', 'machineNumber', 'd', 'id']) //toJSON自己添加的屬性儲存

      nowCanvas.objects = nowCanvas.objects.filter(item => {
        if (item.type != 'backgroundGrid') {
          return item
        }
      })
      ;(nowCanvas['mapSize'] = {
        width: this.mapWidth,
        height: this.mapHeight
      }),
        (nowCanvas['mapSizeResolution'] = {
          width: this.canvas.width,
          height: this.canvas.height
        })
      let saveFile = JSON.stringify(nowCanvas)
      if (this.canvas._objects) {
        this.machineLocation = []
        this.canvas._objects.forEach(item => {
          if (item.machineId) {
            if (!item.angle) {
              item.angle = 0
            }
            let svgPath = []
            item._objects.forEach(obj => {
              svgPath.push(obj.d)
            })
            this.machineLocation.push({
              id: item.id,
              machineId: item.machineId,
              machineNumber: item.machineNumber,
              left: item.left,
              top: item.top,
              width: item.width * item.scaleX,
              height: item.height * item.scaleY,
              pointX: (item.lineCoords.br.x + item.lineCoords.bl.x) / 2,
              pointY: (item.lineCoords.br.y + item.lineCoords.tr.y) / 2,
              svgPath: svgPath,
              scaleX: item.scaleX,
              scaleY: item.scaleY,
              angle: item.angle,
              flipX: item.flipX,
              flipY: item.flipY
            })
          }
        })
      }
      this.canvas.loadFromJSON(nowCanvas)
      this.isGrid = false
      if (this.oldMachineMap) {
        this.$confirm(this.$t('factory_confirm_cover_map'), this.$t('factory_machine_map_exist'), {
          type: 'warning'
        })
          .then(ok => {
            console.log(ok)
            let data3 = {
              category: 3,
              object: saveFile,
              workShopID: this.oldMachineDataJSON[1].workShopId,
              id: this.oldMachineDataJSON[1].id
            }
            workshopKanbanAPI
              .put(data3)
              .then(response => {
                if (response.status == 200) {
                  let LoactionData = {
                    machineLocation: this.machineLocation,
                    mapSizeResolution: {
                      width: this.canvas.width,
                      height: this.canvas.height
                    }
                  }
                  let data4 = {
                    category: 4,
                    object: JSON.stringify(LoactionData),
                    workShopID: this.oldMachineDataJSON[2].id,
                    id: this.oldMachineDataJSON[2].id
                  }
                  workshopKanbanAPI
                    .put(data4)
                    .then(response => {
                      if (response.status == 200) {
                        this.$layer.msg(this.$t('factory_machine_map_save_success'), {
                          shade: this.layerShade,
                          shadeClose: this.layerShadeClose,
                          time: this.layerTime
                        })
                      }
                    })
                    .catch(err => {
                      console.log(err)
                      this.$layer.msg(this.$t('factory_machine_map_save_fail'), {
                        shade: this.layerShade,
                        shadeClose: this.layerShadeClose,
                        time: this.layerTime
                      })
                    })
                }
              })
              .catch(err => {
                console.log(err)
                this.$layer.msg(this.$t('factory_machine_map_save_fail'), {
                  shade: this.layerShade,
                  shadeClose: this.layerShadeClose,
                  time: this.layerTime
                })
              })
          })
          .catch(err => {
            if (err != 'cancel') {
              this.$layer.msg('Error:' + err, {
                shade: this.layerShade,
                shadeClose: this.layerShadeClose,
                time: this.layerTime
              })
            }
          })
      } else {
        let data3 = {
          category: 3,
          object: saveFile,
          workShopID: this.nowWorkShop.id
        }

        workshopKanbanAPI
          .post(data3)
          .then(response => {
            if (response.status == 200) {
              let LoactionData = {
                machineLocation: this.machineLocation,
                mapSizeResolution: {
                  width: this.canvas.width,
                  height: this.canvas.height
                }
              }
              let data4 = {
                category: 4,
                object: JSON.stringify(LoactionData),
                workShopID: this.nowWorkShop.id
              }
              workshopKanbanAPI
                .post(data4)
                .then(response => {
                  if (response.status == 200) {
                    this.$layer.msg(this.$t('factory_machine_map_save_success'), {
                      shade: this.layerShade,
                      shadeClose: this.layerShadeClose,
                      time: this.layerTime
                    })
                  }
                })
                .catch(err => {
                  console.log(err)
                  this.$layer.msg(this.$t('factory_machine_map_new_fail'), {
                    shade: this.layerShade,
                    shadeClose: this.layerShadeClose,
                    time: this.layerTime
                  })
                })
            }
          })
          .catch(err => {
            console.log(err)
            this.$layer.msg(this.$t('factory_machine_map_new_fail'), {
              shade: this.layerShade,
              shadeClose: this.layerShadeClose,
              time: this.layerTime
            })
          })
      }
    },
    loadMachineMap() {
      this.isGrid = false
      this.startMachineMap()
      let table = document.getElementsByClassName('deviceTableTr')
      table.forEach(tr => {
        tr.style.display = 'table-row'
      })
      let svgObject = JSON.parse(this.oldMachineDataJSON[1].object)
      this.machineLocation = []
      let category4 = JSON.parse(this.oldMachineDataJSON[2].object)
      this.machineLocation = category4.machineLocation
      this.mapHeight = svgObject.mapSize.height
      this.mapWidth = svgObject.mapSize.width
      let svgScaleX = this.canvas.width / category4.mapSizeResolution.width
      let svgScaleY = this.canvas.height / category4.mapSizeResolution.height
      svgObject.objects.forEach(svg => {
        let index = 0
        this.machineTableData.forEach(machine => {
          if (svg.machineNumber == machine.machineNumber) {
            this.setDevice(
              machine,
              index,
              svg.left * svgScaleX,
              svg.top * svgScaleY,
              svg.angle,
              svg.flipX,
              svg.flipY
            )
            this.canvas.discardActiveObject().renderAll()
          } else {
            index++
          }
        })
      })
      this.state = JSON.stringify(this.canvas)
      this.$nextTick(() => {
        this.machineLocation.forEach(obj => {
          if (obj.machineId) {
            table.forEach(tr => {
              if (tr.getAttribute('machineid') == obj.machineId) {
                tr.style.display = 'none'
              }
            })
          }
        })
        setTimeout(() => {
          this.canvas.discardActiveObject().requestRenderAll()
        }, 300)
        setTimeout(() => {
          this.canvas.discardActiveObject().requestRenderAll()
        }, 600)
        // this.checkToolBarBorder()
        this.$layer.msg(this.$t('factory_machine_map_read_success'), {
          shade: this.layerShade,
          shadeClose: this.layerShadeClose,
          time: this.layerTime
        })
        // this.$notify({title: '設備地圖', message: '讀取成功', type: 'success' , duration:5000,offset: 50})
      })
    },
    initKanban() {
      if (!this.factoryKanban) {
        this.imgMap = null
        this.machineLocation = []
        workshopKanbanCategoriesAPI
          .get({
            headers: {
              category: JSON.stringify([2, 4]),
              id: this.nowWorkShop.id
            }
          })
          .then(response => {
            if (response.status == 200) {
              if (response.data && response.data.length == 2) {
                //底圖
                this.init()
                this.getMachineData()
                this.factoryMap = false
                this.machineMap = false
                this.factoryKanban = true
                this.$nextTick(() => {
                  let category2 = JSON.parse(response.data[0].object)
                  this.imgMap = category2.img
                  // let size = category2.mapSizeResolution
                  // this.canvas.width = document.getElementsByClassName('kanbanBorder')[0].offsetWidth - this.screenWidth * 0.02
                  // this.canvas.height = this.canvas.height - this.screenHeight *0.05
                  this.canvas.width =
                    document.getElementsByClassName('kanbanBorder')[0].offsetWidth * 0.98
                  this.canvas.height = this.canvas.height * 0.95
                  // let scaleX = this.canvas.width / size.width
                  // let scaleY = this.canvas.height / size.height
                  document.getElementById('Kanban').style.backgroundImage =
                    'url(' + this.imgMap + ')'
                  document.getElementById('Kanban').style.backgroundSize = '100% 100%'
                  document.getElementById('Kanban').style.width = this.canvas.width + 'px'
                  document.getElementById('Kanban').style.height = this.canvas.height + 'px'
                  //插入SVG
                  let category4 = JSON.parse(response.data[1].object)
                  let svgScaleX = this.canvas.width / category4.mapSizeResolution.width
                  let svgScaleY = this.canvas.height / category4.mapSizeResolution.height
                  this.machineLocation = category4.machineLocation.map(item => {
                    item.left = item.left * svgScaleX
                    item.top = item.top * svgScaleY
                    item.scaleX = item.scaleX * svgScaleX
                    item.scaleY = item.scaleY * svgScaleY
                    item.width = item.width * svgScaleX
                    item.height = item.height * svgScaleY
                    return item
                  })
                })
              } else {
                this.$layer.msg(
                  this.$t('workshop') +
                    ': ' +
                    this.nowWorkShop.text +
                    this.$t('factory_machine_map_not_setup_yet'),
                  {
                    shade: this.layerShade,
                    shadeClose: this.layerShadeClose,
                    time: this.layerTime
                  }
                )
              }
            }
          })
          .catch(err => {
            this.$layer.msg(err, {
              shade: this.layerShade,
              shadeClose: this.layerShadeClose,
              time: this.layerTime
            })
          })
      } else {
        this.factoryKanban = false
      }
    },

    cavitNumberRandom() {
      return Math.floor(Math.random() * Math.floor(10))
    },
    RandomcycleTime() {
      return 584.01111111
      // let ct = Math.random() * Math.floor(550)
      // if (ct >= 100) {
      //   return Math.round(ct)
      // } else {
      //   return Math.round(ct * 10) / 10
      // }
    },
    Randomqty() {
      return Math.floor(Math.random() * Math.floor(100000))
    },
    Randomstatus() {
      let num = Math.random() * Math.floor(100)
      if (num < 80) {
        return 5
      } else if (num >= 80 && num < 90) {
        return 2
      } else if (num >= 90 && num < 98) {
        return 3
      } else {
        return 4
      }
    },

    //處理生產數量
    dealKNum(num) {
      if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k'
      } else if (num >= 10000) {
        return parseInt(num / 1000) + 'k'
      } else if (num >= 1000000) {
        return parseInt(num / 1000000) + 'm'
      } else if (num >= 1000000000) {
        return parseInt(num / 1000000000) + 'b'
      } else {
        return num
      }
    },
    //處理週期時間
    dealCycleTime(num) {
      if (num >= 100) {
        return Math.round(num)
      } else {
        return Math.round(num * 10) / 10
      }
    },
    //取得資料
    getMachineData() {
      if (!this.getDataFlag) {
        this.getDataFlag = true
        TaskkanbanAPI({
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            workShopNumber: this.nowWorkShop.value
          }
        }).then(res => {
          if (res.data != null) {
            res.data.forEach(item => {
              /***** 
              item.cavityNumber = this.cavitNumberRandom()
              item.machineNumber = 'Decice01'
              item.moldGreenRange = 0.1
              item.moldYellowRange = 0.2
              item.moldNumber = 'mold01'
              item.moldName = 'Mname011-svg-test'
              item.productNumbers = 'product-Numbers-test'
              item.cycleTime = this.RandomcycleTime()
              item.planCycleTime = this.RandomcycleTime()
              item.sct = this.RandomcycleTime()
              item.status = this.Randomstatus()
              item.taskQTY = this.Randomqty() //this.Randomqty()
              item.qty = this.Randomqty() //this.Randomqty()

              /***** */
              item.planCycleTime = this.dealCycleTime(item.planCycleTime)
              item.cycleTime = this.dealCycleTime(item.cycleTime)
              item.machineNumber = this.dealnameoverfloat(item.machineNumber, 9)
              item.taskQTYString = this.dealKNum(item.taskQTY) //this.Randomqty()
              item.qtyString = this.dealKNum(item.qty) //this.Randomqty()
            })
          }
          this.kanbanTable = res.data
          this.playsoundflag = false //初始化聲音撥放flag
          if (this.kanbanTable != null) {
            this.kanbanTable.forEach(item => {
              //異常訊號，更改狀態為4，設定動畫
              if (item.errorFlag) {
                item.animation = true
              } else {
                item.animation = false
              }
              //其中一個需要撥放警報聲
              if (item.alarmType == 2) {
                this.playsoundflag = true
              }
              if (!this.checkTask) {
                item.scheduled = true
                item.tasked = true
              }

              //檢查任務啟用
              //閒置狀態下無排程且無任務顯示停機
              if (item.status == 3 && !item.scheduled && !item.tasked) {
                item.status = 2
              }
            })
          }
          if (this.playsoundflag) {
            this.playAudio() //播放警報聲
          } else {
            this.pauseAudio() //停止播放警報聲
          }
          this.getDataFlag = false
          if (!this.fistGetData) {
            this.fistGetData = true
            this.$nextTick(() => {
              this.getMachineData()
              // this.factoryKanban = !this.factoryKanban
              // this.factoryKanban = !this.factoryKanban
            })
          }
        })
      }
    },
    svgShow() {
      if (this.cardShowMode != 2) {
        return 'opacity:1'
      } else {
        return 'opacity:0'
      }
    },

    svgStyle(item) {
      let svg = item.machineLocation
      let obj
      if (svg.flipX) {
        if (svg.flipY) {
          obj =
            'transform : rotate(' +
            svg.angle +
            'deg)' +
            'translate(' +
            svg.width +
            'px' +
            ',' +
            svg.height +
            'px' +
            ')' +
            'scale(' +
            -svg.scaleX +
            ',' +
            -svg.scaleY +
            ')'
        } else {
          obj =
            'transform : rotate(' +
            svg.angle +
            'deg)' +
            'translate(' +
            svg.width +
            'px' +
            ',' +
            0 +
            'px' +
            ')' +
            'scale(' +
            -svg.scaleX +
            ',' +
            svg.scaleY +
            ')'
        }
      } else {
        if (svg.flipY) {
          obj =
            'transform : rotate(' +
            svg.angle +
            'deg)' +
            'translate(' +
            0 +
            'px' +
            ',' +
            svg.height +
            'px' +
            ')' +
            'scale(' +
            svg.scaleX +
            ',' +
            -svg.scaleY +
            ')'
        } else {
          obj =
            'transform : rotate(' +
            svg.angle +
            'deg)' +
            'scale(' +
            svg.scaleX +
            ',' +
            svg.scaleY +
            ')'
        }
      }

      return obj
    },
    machineStatus(item) {
      let obj = 'fill: #999999; stroke-width: 0.5;stroke:black '
      if (item) {
        switch (item.status) {
          case 0: // 預設(視為停機)
            obj = 'fill:' + this.color('gray') + '; stroke-width: 0.5;stroke:black '
            break
          case 2: // 停機
            obj = 'fill: ' + this.color('gray') + '; stroke-width: 0.5;stroke:black '
            break
          case 3: //閒置 ,若無排程 顯示停機.??????
            obj = 'fill: ' + this.color('orange') + '; stroke-width: 0.5;stroke:black '
            break
          case 4: //異常
            obj = 'fill: ' + this.color('red') + '; stroke-width: 0.5;stroke:black '
            break
          case 5: //運轉
            obj = 'fill:' + this.color('green') + '; stroke-width: 0.5;stroke:black '
            break

          default:
            break
        }
      } else {
        obj = null
      }
      return obj
    },
    machineCytr(item) {
      // console.log(item)
      let obj
      if (item) {
        let cycletime = item.cycleTime
        let sct = item.sct
        let tr = item.planCycleTime
        let greenrange = item.moldGreenRange
        let yellowrange = item.moldYellowRange
        if (item.tasked) {
          if (greenrange == 0) {
            greenrange = 0.1
          }
          if (yellowrange == 0) {
            yellowrange = 0.2
          }
          if (sct == 0) {
            obj = 'fill:' + this.color('gray') + '; stroke-width: 0.5;stroke:black ' //灰色
          }
          if (cycletime == 0 && tr == 0) {
            obj = 'fill: ' + this.color('gray') + '; stroke-width: 0.5;stroke:black ' //灰色
          } else {
            if (this.kanbanIndex == 0) {
              //效率指標
              if (tr == 0) {
                obj = 'fill: ' + this.color('gray') + '; stroke-width: 0.5;stroke:black ' //灰色
              }
              var num = (tr / cycletime) * 100
            } else if (tthis.kanbanIndex == 1) {
              //穩定指標
              var num = (cycletime / sct) * 100
            }
            if (num == 0) {
              obj = 'fill: ' + this.color('gray') + '; stroke-width: 0.5;stroke:black ' //灰色
            }
            if (num <= 100 * (greenrange + 1) && num >= 100 * (1 - greenrange)) {
              obj = 'fill: ' + this.color('green') + '; stroke-width: 0.5;stroke:black ' //綠色
            } else if (num > 100 * (yellowrange + 1) || num < 100 * (1 - yellowrange)) {
              obj = 'fill: ' + this.color('red') + '; stroke-width: 0.5;stroke:black ' //紅色
            } else {
              obj = 'fill: ' + this.color('yellow') + '; stroke-width: 0.5;stroke:black ' //黃色
            }
          }
        } else {
          obj = 'fill: ' + this.color('gray') + '; stroke-width: 0.5;stroke:black ' //灰色
        }
      } else {
        obj = null
      }
      return obj
    },
    machineError(item) {
      let obj
      if (item) {
        if (item.errorFlag) {
          obj = 'fill: ' + this.color('red') + '; stroke-width: 0.5;stroke:black ' //red
        } else {
          obj = 'fill: ' + this.color('green') + '; stroke-width: 0.5;stroke:black ' //green
        }
      } else {
        obj = null
      }
      return obj
    },

    //跟圖示一起顯示
    kanbanCardPositionWithIcon(card, index) {
      let Cardleft
      let CardTop
      let tmpItem
      let deg = 0
      let cardwidth = 0
      let cardheight = 0
      if (card.machineLocation) {
        let item = card.machineLocation
        cardwidth = item.width
        tmpItem = item
        Cardleft = item.left + document.getElementById('Kanban').offsetLeft
        CardTop = item.top + document.getElementById('Kanban').offsetTop
        deg = item.angle
        if (card.machineLocation.flipY) {
          deg = (deg + 180) % 360
        }
        // }
      }
      // 左下
      let bl = { x: 0, y: 0 }
      // 右上
      let tr = { x: 0, y: 0 }
      // 右下
      let br = { x: 0, y: 0 }

      if (tmpItem != undefined) {
        bl.x = Cardleft - (Math.sin((tmpItem.angle * Math.PI) / 180) * tmpItem.height) / 2
        bl.y = CardTop + (Math.cos((tmpItem.angle * Math.PI) / 180) * tmpItem.height) / 2
        tr.x = Cardleft + Math.cos((tmpItem.angle * Math.PI) / 180) * tmpItem.width
        tr.y = CardTop + Math.sin((tmpItem.angle * Math.PI) / 180) * tmpItem.width
      } else {
        bl.x = Cardleft
        bl.y = CardTop
        tr.x = Cardleft
        tr.y = CardTop
      }

      br.x = bl.x + tr.x - Cardleft
      br.y = ((bl.y + tr.y) / 2 - CardTop) * 2 + CardTop

      let centerX = (bl.x + tr.x) / 2

      document.getElementsByClassName('kanbanCardProgressOnly').forEach(item => {
        if (item.getAttribute('cardid') == card.machineId) {
          cardheight = item.offsetHeight
        }
      })

      let max = Math.max(bl.y, tr.y, br.y, CardTop)

      let kanbanCard = document.getElementsByClassName('kanbanCard')[index]
      let obj
      if (kanbanCard) {
        let kanbanCardWidth = 0
        document.getElementsByClassName('kanbanCardProgressOnly')[index].style.width =
          cardwidth + 'px'
        kanbanCardWidth = cardwidth
        let cardCenterX = centerX - kanbanCardWidth / 2
        let cardCenterY = max

        obj = {
          left: cardCenterX + 'px', // kanbanCardWidth/2為卡片一半的寬度
          top: cardCenterY + 'px', // 為偏移距離
          transform: 'rotate(' + deg + 'deg)',
          width: cardwidth + 'px' //卡片寬度
        }

        let topobj
        let subobj
        let coordinate = { x: 0, y: 0 }
        if (!this.fullscreen) {
          //一般網頁模式
          document.getElementsByTagName('path').forEach(item => {
            if (item.getAttribute('svgtop') == card.machineId) {
              topobj = item
            }
            if (item.getAttribute('svgsub') == card.machineId) {
              subobj = item
            }
          })
        } else {
          //全螢幕模式
          document.getElementsByTagName('path').forEach(item => {
            if (item.getAttribute('fullsvgtop') == card.machineId) {
              topobj = item
            }
            if (item.getAttribute('fullsvgsub') == card.machineId) {
              subobj = item
            }
          })
        }

        if (topobj != undefined) {
          coordinate = this.getXY(
            topobj.getBoundingClientRect(),
            subobj.getBoundingClientRect(),
            deg
          )
        }
        let tempscale = 1
        let tempwidth = 0
        let tempheight = 0
        if (deg > 90 && deg < 270) {
          tempscale = -1
          tempwidth = cardwidth
          tempheight = cardheight
        }

        if (!tmpItem) {
          obj = {
            left: coordinate.x + 'px',
            top: coordinate.y + 'px',
            display: 'none',

            transformOrigin: 'top left'
          }
        } else {
          obj = {
            left: coordinate.x + 'px',
            top: coordinate.y + 'px',
            transform:
              'rotate(' +
              deg +
              'deg)' +
              'scale(' +
              tempscale +
              ',' +
              tempscale +
              ')' +
              ' translate(-' +
              tempwidth +
              'px, -' +
              tempheight +
              'px)',
            width: cardwidth + 'px', //卡片寬度
            transformOrigin: 'top left'
          }
        }
      } else {
        obj = null
      }
      return obj
    },
    getXY(itemtop, itemsub, angle) {
      let coordinate = { x: 0, y: 0 }
      if (angle > 0 && angle < 90) {
        coordinate.x = itemtop.left
        coordinate.y = itemsub.top
      } else if (angle > 90 && angle < 180) {
        coordinate.x = itemsub.right
        coordinate.y = itemtop.top
      } else if (angle > 180 && angle < 270) {
        coordinate.x = itemtop.right
        coordinate.y = itemsub.bottom
      } else if (angle > 270 && angle < 360) {
        coordinate.x = itemsub.left
        coordinate.y = itemtop.bottom
      }
      if (angle == 0 || angle == 360) {
        coordinate.x = itemtop.left
        coordinate.y = itemtop.bottom
      }
      if (angle == 90) {
        coordinate.x = itemtop.left
        coordinate.y = itemtop.top
      }
      if (angle == 180) {
        coordinate.x = itemtop.right
        coordinate.y = itemtop.top
      }
      if (angle == 270) {
        coordinate.x = itemtop.right
        coordinate.y = itemtop.bottom
      }

      return coordinate
    },

    //純卡片
    kanbanCardPosition(card, index) {
      let Cardleft
      let CardTop
      let tmpItem
      let deg = 0
      if (card.machineLocation) {
        let item = card.machineLocation
        tmpItem = item
        Cardleft = item.left + document.getElementById('Kanban').offsetLeft //item.left + document.getElementById('Kanban').offsetLeft
        CardTop = item.top + document.getElementById('Kanban').offsetTop //item.top + document.getElementById('Kanban').offsetTop
        if (item.angle > 90 && item.angle < 270) {
          deg = item.angle + 180
        } else {
          deg = item.angle
        }
      }
      // 左下
      let bl = { x: 0, y: 0 }
      // 右上
      let tr = { x: 0, y: 0 }
      // 右下
      let br = { x: 0, y: 0 }
      if (tmpItem != undefined) {
        bl.x = Cardleft - (Math.sin((tmpItem.angle * Math.PI) / 180) * tmpItem.height) / 2
        bl.y = CardTop + (Math.cos((tmpItem.angle * Math.PI) / 180) * tmpItem.height) / 2
        tr.x = Cardleft + Math.cos((tmpItem.angle * Math.PI) / 180) * tmpItem.width
        tr.y = CardTop + Math.sin((tmpItem.angle * Math.PI) / 180) * tmpItem.width
      } else {
        bl.x = Cardleft
        bl.y = CardTop
        tr.x = Cardleft
        tr.y = CardTop
      }

      br.x = bl.x + tr.x - Cardleft
      br.y = ((bl.y + tr.y) / 2 - CardTop) * 2 + CardTop
      let centerX = (bl.x + tr.x) / 2
      // let centerY = (bl.y + tr.y) / 2
      let min = Math.min(bl.y, tr.y, br.y, CardTop)
      let borderLeft = document.getElementById('Kanban').offsetLeft
      let borderRight = borderLeft + parseInt(document.getElementById('Kanban').style.width)
      let borderTop = document.getElementById('Kanban').offsetTop
      let borderBottom = borderTop + parseInt(document.getElementById('Kanban').style.height)
      let kanbanCard = document.getElementsByClassName('kanbanCard')[index]

      let obj
      if (kanbanCard) {
        let kanbanCardWidth = 0

        let kanbanCardHeight = document.getElementsByClassName('kanbanCard')[index].offsetHeight

        obj = {
          left: centerX - kanbanCardWidth / 2 + 'px', // kanbanCardWidth/2為卡片一半的寬度
          top: min + 'px', // 10為偏移距離
          transform: 'rotate(' + deg + 'deg)'
        }
        let objLeft = parseInt(obj.left)
        let objRight = objLeft + kanbanCardWidth
        let objTop = parseInt(obj.top)
        let objBottom = objTop + kanbanCardHeight
        if (objLeft < borderLeft) {
          objLeft = borderLeft
        }
        if (objRight > borderRight) {
          objLeft = borderRight - kanbanCardWidth
        }
        if (objTop < borderTop) {
          objTop = borderTop
        }
        if (objBottom > borderBottom) {
          objTop = borderBottom - kanbanCardHeight
        }

        if (!tmpItem) {
          obj = {
            left: objLeft + 'px',
            top: objTop + 'px',
            display: 'none'
          }
        } else {
          obj = {
            left: objLeft + 'px',
            top: objTop + 'px',
            transform: 'rotate(' + deg + 'deg)'
          }
        }
      } else {
        obj = null
      }

      return obj
    },
    //進度條值
    progressValue(card) {
      let value = 0
      if (card.taskQTY == 0 || card.qty == 0) {
        return value
      } else {
        value = (card.taskQTY / card.qty) * 100
        if (value > 100) {
          value = 100
        }
        return value
      }
    },
    // //模式一進度顏色
    progressColor(card) {
      let barColor = this.color('blue') //'blue'
      let percentage = (card.taskQTY / card.qty) * 100
      if (card.taskQTY == 0 || card.qty == 0) {
        barColor = this.color('blue') //'blue'
      } else {
        if (percentage < 100) {
          barColor = this.color('blue') //'blue'
        } else if (percentage < 104 && percentage >= 100) {
          barColor = this.color('green') //'green'
        } else {
          barColor = this.color('red') //red
        }
      }
      document.getElementsByClassName('progressline').forEach(item => {
        if (item.getAttribute('progressid') == card.machineId) {
          item.children[0].style.backgroundColor = barColor
        }
      })

      return ''
    },

    machineErrorShow(val) {
      if (val >= 9 && val <= 15) {
        return true
      } else {
        return false
      }
    },

    //圓圈顏色
    circleColor(item) {
      let obj = this.color('gray') //預設灰色
      if (item) {
        obj = this.cardcolor(item)
      }
      return obj
    },

    valueBarColor(card) {
      let barWidth
      let barColor
      let percentage = (card.taskQTY / card.qty) * 100
      if (card.taskQTY == 0 || card.qty == 0) {
        barWidth = 0
        barColor = 'blue'
      } else {
        if (percentage < 100) {
          barWidth = (card.taskQTY / card.qty) * 100
          barColor = 'blue'
        } else if (percentage < 104 && percentage >= 100) {
          barWidth = (card.taskQTY / card.qty) * 100
          barColor = 'green'
        } else {
          barWidth = (card.taskQTY / card.qty) * 100
          barColor = 'red'
        }
      }
      let obj = {
        width: barWidth + '%',
        backgroundColor: this.color(barColor)
      }
      return obj
    },
    dragCard(evt, index) {
      this.dragKanbanCard = true
      this.nowDragKanbanCard = document.getElementsByClassName('kanbanCard')[index]
      this.StartMousePosition = {
        x: evt.layerX,
        y: evt.layerY
      }
    },
    //svg顏色
    deviceTableSvg(item) {
      let color = this.color('white')
      let borderstyle = ''
      if (item.width == 0 || item.height == 0) {
        color = this.color('red')
        borderstyle = 'none'
      }
      let obj = {
        backgroundImage: 'url(' + '../../../../img/svg/machine.svg' + ')',
        backgroundSize: 'auto',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        'box-shadow': '2px 2px 2px 1px rgba(0, 0, 0, 0.2)',
        height: '80%',
        width: '100%',
        backgroundColor: color,
        border: borderstyle
      }
      return obj
    },
    //顯示模式改變

    //顯示模式
    kanbanCardShow() {
      //0圖示+設備編號+CT+progress(同一排)
      //1圖示+設備編號+CT+progress(兩排)
      //2卡片(設備編號、模具編號、progress)
      switch (this.cardShowMode) {
        case 0: //0>>1
          this.cardShowMode = 1
          break

        case 1: //1>>2
          this.cardShowMode = 2
          break

        case 2: //2>>0
          this.cardShowMode = 0
          break
      }
    },

    toggle() {
      this.$refs['fullscreen'].toggle()
      this.timeNum = 0
      this.setcurrentTime()
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.setcurrentTime()
      }, 1000)
    },
    //全螢幕
    fullscreenChange() {
      this.fullscreen = !this.fullscreen
      if (!this.fullscreen) {
        clearInterval(this.timer)
      }
      this.factoryKanban = false
      setTimeout(() => {
        this.initKanban()
      }, 500)
    },
    setcurrentTime() {
      //10分鐘對時
      if (this.timeNum % 600 == 0) {
        this.getsystem(1)
        //一般時間顯示
      } else {
        var nowsystime = new Date().getTime() - this.localSRV
        this.currentTime = this.timestamptotime(nowsystime)
      }
      this.timeNum++
      if (this.timeNum >= 1000) {
        this.timeNum = 0
      }
    },
    timestamptotime(value) {
      return this.timeStampToStringFunc(value, 'hh:mm:ss')
    },
    // zeroPrefixer(num) {
    //   return (num < 10 ? '0' : '') + num
    // },
    //警報聲撥放
    playAudio() {
      this.player.loop = true
      this.player.play()
    },
    //警報聲停止
    pauseAudio() {
      this.player.pause()
    },
    //卡片資訊顯示
    colsstyle(card, style) {
      let obj
      if (style == 1) {
        obj = {
          padding: '0px',
          textAlign: 'center',
          whiteSpace: 'nowrap'
        }
      } else if (style == 2) {
        obj = {
          padding: '0px',
          textAlign: 'center',
          whiteSpace: 'nowrap',
          maxHeight: '22px'
        }
      } else if (style == 3) {
        obj = {
          paddingLeft: '0px',
          paddingRight: '8px',
          textAlign: 'right',
          whiteSpace: 'nowrap'
        }
      }
      if (card.machineLocation) {
        if (card.machineLocation.width > 125) {
        } else if (card.machineLocation.width <= 125 && card.machineLocation.width > 50) {
          switch (style) {
            case 1:
              obj.maxWidth = '50%'
              obj.flex = '0 0 50%'
              break
            case 2:
              obj.display = 'none'
              break
            case 3:
              obj.maxWidth = '50%'
              obj.flex = '0 0 50%'
              obj.textAlign = 'center'
              break
          }
        } else if (card.machineLocation.width < 50) {
          switch (style) {
            case 1:
              obj.maxWidth = '100%'
              obj.flex = '0 0 100%'
              break
            case 2:
              obj.display = 'none'
              break
            case 3:
              obj.display = 'none'
              break
          }
        }
      }

      return obj
    },
    rolstyle(card, style) {
      let obj = {
        width: '100%',
        margin: '0px'
      }
      if (card.machineLocation) {
        if (card.machineLocation.width <= 80 && card.machineLocation.width > 50) {
          if (style == 1) {
            obj.display = 'none'
          } else {
            // return 'true'
          }
        } else if (card.machineLocation.width < 50) {
          if (style == 1) {
            obj.display = 'none'
          } else {
            // return 'true'
          }
        } else {
          if (style == 1) {
            // return 'true'
          } else {
            obj.display = 'none'
          }
        }
      }
      return obj
    },
    //卡片資訊顯示2
    colsstyle2(card, style) {
      let obj
      if (style == 1) {
        obj = {
          padding: '0px',
          textAlign: 'center',
          whiteSpace: 'nowrap'
        }
      } else if (style == 2) {
        obj = {
          padding: '0px',
          textAlign: 'center'
        }
      } else if (style == 3) {
        obj = {
          paddingLeft: '0px',
          paddingRight: '8px',
          textAlign: 'right',
          whiteSpace: 'nowrap'
        }
      }
      if (card.machineLocation) {
        if (card.machineLocation.width > 125) {
        } else if (card.machineLocation.width <= 125 && card.machineLocation.width > 80) {
          switch (style) {
            case 1:
              obj.maxWidth = '20%'
              obj.flex = '0 0 20%'
              break
            case 2:
              obj.display = 'none'
              break
            case 3:
              obj.maxWidth = '20%'
              obj.flex = '0 0 20%'
              obj.textAlign = 'center'
              break
          }
        } else if (card.machineLocation.width <= 80 && card.machineLocation.width > 50) {
          switch (style) {
            case 1:
              obj.maxWidth = '50%'
              obj.flex = '0 0 50%'
              break
            case 2:
              obj.display = 'none'
              break
            case 3:
              obj.maxWidth = '50%'
              obj.flex = '0 0 50%'
              obj.textAlign = 'center'
              break
          }
        } else if (card.machineLocation.width < 50) {
          switch (style) {
            case 1:
              obj.maxWidth = '100%'
              obj.flex = '0 0 100%'
              break
            case 2:
              obj.display = 'none'
              break
            case 3:
              obj.display = 'none'
              break
          }
        }
      }

      return obj
    }
    // qr() {
    //   let url = 'http://192.168.10.195:8080/test1'
    //   let QRCode = require('qrcode')
    //   let qrCanvas = document.getElementById('qrCanvas')
    //   QRCode.toCanvas(qrCanvas, url, error => {
    //     if (error) {
    //       this.$layer.msg('QR Code產生失敗', {
    //         shade: this.layerShade,
    //         shadeClose: this.layerShadeClose,
    //         time: this.layerTime
    //       })
    //     }
    //   })
    // }
  },
  computed: {
    machineTableData() {
      if (this.tabledata && this.tabledata.length > 0) {
        return this.tabledata.filter(obj => {
          return obj.workShopId == this.nowWorkShop.id
        })
      } else {
        return null
      }
    },
    cardDataTable() {
      if (this.kanbanTable && this.machineLocation && this.factoryKanban) {
        this.kanbanTable.forEach(item => {
          this.machineLocation.forEach(machine => {
            if (item.machineId == machine.machineId) {
              item['machineLocation'] = machine
            }
          })
        })
        return this.kanbanTable
      } else {
        return null
      }
    }
  }
}
</script>
<style>
.el-progress-bar__outer {
  height: 4px !important;
}
</style>
<style scoped>
.tooltip1 {
  position: relative;
  background: rgb(61, 145, 188);
  color: white;
  height: 15px !important;
  width: 15px !important;
  font-size: 10px;
  text-align: center;
  border-radius: 50%;
  /* display: inline-block; */
  /* border-bottom: 1px dotted black; */
  float: left;
}

.tooltip1 .tooltiptext1 {
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

  position: absolute;
  z-index: 1;
}

.tooltip1:hover .tooltiptext1 {
  visibility: visible;

  /* box-shadow: -2px 3px 2px 1px #cccccc; */
}
.progressline {
  width: 95%;
  margin-bottom: 0.5rem;
  margin-right: 2px;
  margin-left: 2px;
  /* padding: 2px; */
  height: 100%;
}
.md-progress .progress-bar {
  height: 100% !important;
}
html,
body {
  margin: 0 !important;
  padding: 0 !important;
  background-color: blue;
}

#mainButton {
  /* border: solid 1px; */
  /* padding-left: 1rem; */
  padding: 0.4rem 0.5rem !important;
  font-size: 1rem !important;
  font-family: 微軟正黑體 !important;
}

canvas {
  border: 1px dashed black;
}

#buttonGroup {
  display: inline-grid;
  position: fixed;
  top: 0;
  right: 0;
  cursor: pointer;
  /* min-width: 150px; */
}

#factoryTools {
  width: 150px;
  height: 200px;
  overflow-y: scroll;
  overflow-x: hidden;
  background-color: white;
}

.toolBarBtn {
  margin: 0.1rem !important;
  padding: 0.4rem 0.5rem !important;
  font-size: 1rem !important;
  font-family: 微軟正黑體 !important;
  width: 100%;
}
.mainToolConfig {
  min-width: 150px;
  background-color: #3c8dbc !important;
  margin: 0.1rem !important;
}

.fixed-sn {
  padding-left: 0 !important;
}

.deviceTable {
  margin-top: 0.1rem;
  margin-bottom: 0.1rem;
  height: 200px;
  overflow: scroll;
  background-color: white;
  width: 250px;
  white-space: nowrap;
}

* ::-webkit-scrollbar {
  width: 10px;
  background-color: #f5f5f5;
}
* ::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  background-color: #f5f5f5;
  border-radius: 10px;
}
* ::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #3c8dbc;
}

.kanbanBorder {
  border: solid 1px;
  padding: 1vh 1vw;
  margin: 0.5vh 1vw 0.5vh 1vw;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
}

#Kanban {
  /* border: dashed 1px; */
  box-sizing: border-box;
}
.kanbanCardProgressOnly {
  background-color: #f5f5f5;
  border-radius: 0px;
  font-family: 微軟正黑體;
  position: absolute;
  padding: 0px;
  opacity: 1;
  /* transition: 0.3s; */
  left: 0px;
  top: 0px;
}
.kanbanCard {
  width: 150px;
  font-family: 微軟正黑體;
  position: absolute;
  /* padding: 5px; */
  padding: 5px;
  opacity: 1;
  /* transition: 0.3s; */
  left: 0px;
  top: 0px;
}
.kanbanCard:hover {
  opacity: 1;
  cursor: pointer;
  z-index: 999;
}
.cardTitle {
  width: 100%;
  display: flex;
  justify-content: space-between;
  user-select: none;
}

.progressBar {
  height: 20px;
  background-color: #e0e0db;
  border-radius: 5px;
  position: relative;
  overflow: hidden;
  margin: 0px; /*5px 0px 5px 0px;*/
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progressBar .valueNumber {
  font-weight: bold;
  white-space: nowrap;
  position: absolute;
  color: white;
}
.progressBar .valueBar {
  background-color: black;
  height: 100%;
  width: 0px;
  border-radius: 5px 0px 0px 5px;
  transition: 0.3s;
  margin-right: auto;
}

.input-group-text {
  background-color: none;
  /* border: none; */
}

.fullscreen {
  overflow-x: hidden;
  background-color: #eeeeee;
}

.fullscreen-head {
  width: 100%;
  display: -ms-grid;
  display: grid;
  -ms-grid-columns: 145px 250px 1fr 250px 145px;
  grid-template-columns: 145px 250px 1fr 250px 145px;
  grid-row-gap: 10px;
  margin-bottom: 5px;
  /* height: 40px; */
  /* position: relative; */
}
.fullscreen-main-slogan {
  text-align: center;
  color: #000;
  font-size: 59px;
  font-weight: 900;
}
.fullscreen-main-time {
  margin: auto;
  color: #000;
  font-size: 30px;
  margin: auto;
  font-weight: 900;
}

@keyframes fade {
  from {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.blink {
  animation: fade 500ms infinite;
}
.circleparent {
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  position: absolute;
}
.circleparent > .blink {
  color: red;
  animation: fade 500ms infinite;
}

.circle {
  text-align: center;
  border: 5px solid green;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  width: 45px;
  height: 45px;

  margin: auto;
}
.circletext {
  text-align: center;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  width: 45px;
  height: 45px;

  margin: auto;
}
</style>
