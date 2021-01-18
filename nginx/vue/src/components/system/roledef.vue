<template>
  <div>
    <!-- {{ roleselected }} -->

    <mdb-btn
      v-if="!editmode && editbtm"
      color="mdb-color"
      type="button"
      v-on:click="editfunc()"
      style="padding:0.4rem"
      icon="pencil-alt"
    ></mdb-btn>
    <mdb-btn v-if="editmode" color="info" type="button" v-on:click="submitfunc()">{{
      $t('submit')
    }}</mdb-btn>
    <mdb-btn v-if="editmode" color="info" type="button" v-on:click="canceledit()">
      {{ $t('cancel') }}
    </mdb-btn>
    <span style="float:right;opacity:0">--------------------</span>
    <span style="float:right">
      <span style="color:red">X</span>
      {{ $t('role_X') }}
    </span>
    <span style="float:right;opacity:0">----</span>
    <span style="float:right">
      <span style="color:blue">//</span>
      {{ $t('role_D') }}
    </span>
    <span style="float:right;opacity:0">----</span>
    <span style="float:right">
      <span style="color:orange">△</span>
      {{ $t('role_W') }}
    </span>
    <span style="float:right;opacity:0">----</span>
    <span style="float:right">
      <span style="color:green">O</span>
      {{ $t('role_R') }}
    </span>

    <div>
      <el-table
        id="show"
        :show-header="false"
        :data="tabledata"
        class="eltableclass"
        row-key="id"
        border
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="resource1"></el-table-column>
        <el-table-column prop="resource2"></el-table-column>
        <el-table-column prop="role1">
          <template slot-scope="scope">
            <!-- 顯示 -->
            <div v-if="!editmode">
              <!-- 無角色資料 -->
              <div v-if="roleselected[0] == null" class="tabletext">-</div>
              <!-- end無角色資料 -->
              <div v-if="roleselected[0] != null">
                <el-select v-model="roleselected[0]" v-if="scope.row.id == 0">
                  <el-option
                    v-for="item in roleselectobject[0]"
                    v-bind:style="{ color: item.textcolor, 'font-weight': 'bold' }"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <div
                  v-if="scope.row.id != 0"
                  class="tabletext"
                  v-bind:style="{
                    color: textcolor(scope.row.role1),
                    'font-weight': 'bold',
                    'font-size': 'large'
                  }"
                >
                  {{ setRightLogo(scope.row.role1) }}
                </div>
              </div>
            </div>
            <!-- 編輯 -->
            <div v-if="editmode">
              <!-- 無角色資料 -->
              <div v-if="roleselected[0] == null" class="tabletext">-</div>
              <!-- end無角色資料 -->
              <div v-if="roleselected[0] != null" class="tabletext">
                <div
                  v-if="scope.row.id == 0"
                  class="tabletext"
                  style=" display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 40px;
                  width: 100%;"
                >
                  <span style="vertical-align: middle;">
                    {{ roletitle(roleselected[0], roleselectobject[0]) }}
                  </span>
                </div>
                <!-- 預設5個角色不能編輯 -->
                <div
                  v-if="
                    scope.row.id != 0 &&
                      !scope.row.ifoperation &&
                      scope.row.role1Id <= 5 &&
                      userId != 1
                  "
                  class="tabletext"
                  v-bind:style="{
                    color: textcolor(scope.row.role1),
                    'font-weight': 'bold',
                    'font-size': 'large'
                  }"
                >
                  {{ setRightLogo(scope.row.role1) }}
                </div>
                <!-- end預設5個角色不能編輯 -->
                <!-- 資源 -->

                <div
                  v-if="
                    scope.row.id != 0 &&
                      !scope.row.ifoperation &&
                      (scope.row.role1Id > 5 || userId == 1)
                  "
                  class="tabletext"
                >
                  <!-- 只有讀取 -->
                  <div v-if="scope.row.readonly">
                    <el-select v-model="scope.row.role1">
                      <el-option
                        v-for="item in operateoptionreadonly"
                        v-bind:style="{ color: item.textcolor, 'font-weight': 'bold' }"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                  <!-- RWD -->
                  <div v-if="!scope.row.readonly">
                    <el-select v-model="scope.row.role1">
                      <el-option
                        v-for="item in operateoption"
                        v-bind:style="{
                          color: item.textcolor,
                          'font-weight': 'bold'
                        }"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                </div>

                <!-- end資源 -->
                <!-- 操作 -->
                <!-- 預設5個角色操作不能編輯 -->
                <div
                  v-if="
                    scope.row.id != 0 &&
                      scope.row.ifoperation &&
                      scope.row.role1Id <= 5 &&
                      userId != 1
                  "
                  class="tabletext"
                  v-bind:style="{
                    color: textcolor(scope.row.role1),
                    'font-weight': 'bold',
                    'font-size': 'large'
                  }"
                >
                  {{ setRightLogo(scope.row.role1) }}
                </div>
                <!-- end預設5個角色操作不能編輯 -->
                <div
                  v-if="
                    scope.row.id != 0 &&
                      scope.row.ifoperation &&
                      (scope.row.role1Id > 5 || userId == 1)
                  "
                  class="tabletext"
                >
                  <el-select v-model="scope.row.role1">
                    <el-option
                      v-for="item in operateoperateoption"
                      v-bind:style="{ color: item.textcolor, 'font-weight': 'bold' }"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
                <!-- end操作 -->
              </div>
            </div>

            <!-- end編輯 -->
          </template>
        </el-table-column>
        <el-table-column prop="role2">
          <template slot-scope="scope">
            <!-- 顯示 -->
            <div v-if="!editmode">
              <!-- 無角色資料 -->
              <div v-if="roleselected[1] == null" class="tabletext">-</div>
              <!-- end無角色資料 -->
              <div v-if="roleselected[1] != null">
                <el-select v-model="roleselected[1]" v-if="scope.row.id == 0">
                  <el-option
                    v-for="item in roleselectobject[1]"
                    v-bind:style="{ color: item.textcolor, 'font-weight': 'bold' }"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <div
                  v-if="scope.row.id != 0"
                  v-bind:style="{
                    color: textcolor(scope.row.role2),
                    'font-weight': 'bold',
                    'font-size': 'large'
                  }"
                  class="tabletext"
                >
                  {{ setRightLogo(scope.row.role2) }}
                </div>
              </div>
            </div>
            <!-- 編輯 -->
            <div v-if="editmode">
              <!-- 無角色資料 -->
              <div v-if="roleselected[1] == null" class="tabletext">-</div>
              <!-- end無角色資料 -->
              <div v-if="roleselected[1] != null" class="tabletext">
                <div v-if="scope.row.id == 0" class="tabletext">
                  {{ roletitle(roleselected[1], roleselectobject[1]) }}
                </div>
                <!-- 預設5個角色不能編輯 -->
                <div
                  v-if="
                    scope.row.id != 0 &&
                      !scope.row.ifoperation &&
                      scope.row.role2Id <= 5 &&
                      userId != 1
                  "
                  class="tabletext"
                  v-bind:style="{
                    color: textcolor(scope.row.role2),
                    'font-weight': 'bold',
                    'font-size': 'large'
                  }"
                >
                  {{ setRightLogo(scope.row.role2) }}
                </div>
                <!-- end預設5個角色不能編輯 -->
                <!-- 資源 -->
                <div
                  v-if="
                    scope.row.id != 0 &&
                      !scope.row.ifoperation &&
                      (scope.row.role2Id > 5 || userId == 1)
                  "
                  class="tabletext"
                >
                  <!-- 只有讀取 -->
                  <div v-if="scope.row.readonly">
                    <el-select v-model="scope.row.role2">
                      <el-option
                        v-for="item in operateoptionreadonly"
                        v-bind:style="{ color: item.textcolor, 'font-weight': 'bold' }"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                  <!-- RWD -->
                  <div v-if="!scope.row.readonly">
                    <el-select v-model="scope.row.role2">
                      <el-option
                        v-for="item in operateoption"
                        v-bind:style="{ color: item.textcolor, 'font-weight': 'bold' }"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
                <!-- end資源 -->
                <!-- 操作 -->
                <!-- 預設5個角色操作不能編輯 -->
                <div
                  v-if="
                    scope.row.id != 0 &&
                      scope.row.ifoperation &&
                      scope.row.role2Id <= 5 &&
                      userId != 1
                  "
                  class="tabletext"
                  v-bind:style="{
                    color: textcolor(scope.row.role2),
                    'font-weight': 'bold',
                    'font-size': 'large'
                  }"
                >
                  {{ setRightLogo(scope.row.role2) }}
                </div>
                <!-- end預設5個角色操作不能編輯 -->
                <div
                  v-if="
                    scope.row.id != 0 &&
                      scope.row.ifoperation &&
                      (scope.row.role2Id > 5 || userId == 1)
                  "
                  class="tabletext"
                >
                  <el-select v-model="scope.row.role2">
                    <el-option
                      v-for="item in operateoperateoption"
                      v-bind:style="{ color: item.textcolor, 'font-weight': 'bold' }"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
                <!-- end操作 -->
              </div>
            </div>

            <!-- end編輯 -->
          </template>
        </el-table-column>
        <el-table-column prop="role3">
          <template slot-scope="scope">
            <!-- 顯示 -->
            <div v-if="!editmode">
              <!-- 無角色資料 -->
              <div v-if="roleselected[2] == null" class="tabletext">-</div>
              <!-- end無角色資料 -->
              <div v-if="roleselected[2] != null">
                <el-select v-model="roleselected[2]" v-if="scope.row.id == 0">
                  <el-option
                    v-for="item in roleselectobject[2]"
                    v-bind:style="{ color: item.textcolor, 'font-weight': 'bold' }"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <div
                  v-if="scope.row.id != 0"
                  v-bind:style="{
                    color: textcolor(scope.row.role3),
                    'font-weight': 'bold',
                    'font-size': 'large'
                  }"
                  class="tabletext"
                >
                  {{ setRightLogo(scope.row.role3) }}
                </div>
              </div>
            </div>
            <!-- 編輯 -->
            <div v-if="editmode">
              <!-- 無角色資料 -->
              <div v-if="roleselected[2] == null" class="tabletext">-</div>
              <!-- end無角色資料 -->
              <div v-if="roleselected[2] != null" class="tabletext">
                <div v-if="scope.row.id == 0" class="tabletext">
                  {{ roletitle(roleselected[2], roleselectobject[2]) }}
                </div>
                <!-- 預設5個角色不能編輯 -->
                <div
                  v-if="
                    scope.row.id != 0 &&
                      !scope.row.ifoperation &&
                      scope.row.role3Id <= 5 &&
                      userId != 1
                  "
                  class="tabletext"
                  v-bind:style="{
                    color: textcolor(scope.row.role3),
                    'font-weight': 'bold',
                    'font-size': 'large'
                  }"
                >
                  {{ setRightLogo(scope.row.role3) }}
                </div>
                <!-- end預設5個角色不能編輯 -->
                <!-- 資源 -->
                <div
                  v-if="
                    scope.row.id != 0 &&
                      !scope.row.ifoperation &&
                      (scope.row.role3Id > 5 || userId == 1)
                  "
                  class="tabletext"
                >
                  <!-- 只有讀取 -->
                  <div v-if="scope.row.readonly">
                    <el-select v-model="scope.row.role3">
                      <el-option
                        v-for="item in operateoptionreadonly"
                        v-bind:style="{ color: item.textcolor, 'font-weight': 'bold' }"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                  <!-- RWD -->
                  <div v-if="!scope.row.readonly">
                    <el-select v-model="scope.row.role3">
                      <el-option
                        v-for="item in operateoption"
                        v-bind:style="{ color: item.textcolor, 'font-weight': 'bold' }"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
                <!-- end資源 -->
                <!-- 操作 -->
                <!-- 預設5個角色操作不能編輯 -->
                <div
                  v-if="
                    scope.row.id != 0 &&
                      scope.row.ifoperation &&
                      scope.row.role3Id <= 5 &&
                      userId != 1
                  "
                  class="tabletext"
                  v-bind:style="{
                    color: textcolor(scope.row.role3),
                    'font-weight': 'bold',
                    'font-size': 'large'
                  }"
                >
                  {{ setRightLogo(scope.row.role3) }}
                </div>
                <!-- end預設5個角色操作不能編輯 -->
                <div
                  v-if="
                    scope.row.id != 0 &&
                      scope.row.ifoperation &&
                      (scope.row.role3Id > 5 || userId == 1)
                  "
                  class="tabletext"
                >
                  <el-select v-model="scope.row.role3">
                    <el-option
                      v-for="item in operateoperateoption"
                      v-bind:style="{ color: item.textcolor, 'font-weight': 'bold' }"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
                <!-- end操作 -->
              </div>
            </div>

            <!-- end編輯 -->
          </template>
        </el-table-column>
        <el-table-column prop="role4">
          <template slot-scope="scope">
            <!-- 顯示 -->
            <div v-if="!editmode">
              <!-- 無角色資料 -->
              <div v-if="roleselected[3] == null" class="tabletext">-</div>
              <!-- end無角色資料 -->
              <div v-if="roleselected[3] != null">
                <el-select v-model="roleselected[3]" v-if="scope.row.id == 0">
                  <el-option
                    v-for="item in roleselectobject[3]"
                    v-bind:style="{ color: item.textcolor, 'font-weight': 'bold' }"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <div
                  v-if="scope.row.id != 0"
                  v-bind:style="{
                    color: textcolor(scope.row.role4),
                    'font-weight': 'bold',
                    'font-size': 'large'
                  }"
                  class="tabletext"
                >
                  {{ setRightLogo(scope.row.role4) }}
                </div>
              </div>
            </div>
            <!-- 編輯 -->
            <div v-if="editmode">
              <!-- 無角色資料 -->
              <div v-if="roleselected[3] == null" class="tabletext">-</div>
              <!-- end無角色資料 -->
              <div v-if="roleselected[3] != null" class="tabletext">
                <div v-if="scope.row.id == 0" class="tabletext">
                  {{ roletitle(roleselected[3], roleselectobject[3]) }}
                </div>
                <!-- 預設5個角色不能編輯 -->
                <div
                  v-if="
                    scope.row.id != 0 &&
                      !scope.row.ifoperation &&
                      scope.row.role4Id <= 5 &&
                      userId != 1
                  "
                  class="tabletext"
                  v-bind:style="{
                    color: textcolor(scope.row.role4),
                    'font-weight': 'bold',
                    'font-size': 'large'
                  }"
                >
                  {{ setRightLogo(scope.row.role4) }}
                </div>
                <!-- end預設5個角色不能編輯 -->
                <!-- 資源 -->
                <div
                  v-if="
                    scope.row.id != 0 &&
                      !scope.row.ifoperation &&
                      (scope.row.role4Id > 5 || userId == 1)
                  "
                  class="tabletext"
                >
                  <!-- 只有讀取 -->
                  <div v-if="scope.row.readonly">
                    <el-select v-model="scope.row.role4">
                      <el-option
                        v-for="item in operateoptionreadonly"
                        v-bind:style="{ color: item.textcolor, 'font-weight': 'bold' }"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                  <!-- RWD -->
                  <div v-if="!scope.row.readonly">
                    <el-select v-model="scope.row.role4">
                      <el-option
                        v-for="item in operateoption"
                        v-bind:style="{ color: item.textcolor, 'font-weight': 'bold' }"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
                <!-- end資源 -->
                <!-- 操作 -->
                <!-- 預設5個角色操作不能編輯 -->
                <div
                  v-if="
                    scope.row.id != 0 &&
                      scope.row.ifoperation &&
                      scope.row.role4Id <= 5 &&
                      userId != 1
                  "
                  class="tabletext"
                  v-bind:style="{
                    color: textcolor(scope.row.role4),
                    'font-weight': 'bold',
                    'font-size': 'large'
                  }"
                >
                  {{ setRightLogo(scope.row.role4) }}
                </div>
                <!-- end預設5個角色操作不能編輯 -->
                <div
                  v-if="
                    scope.row.id != 0 &&
                      scope.row.ifoperation &&
                      (scope.row.role4Id > 5 || userId == 1)
                  "
                  class="tabletext"
                >
                  <el-select v-model="scope.row.role4">
                    <el-option
                      v-for="item in operateoperateoption"
                      v-bind:style="{ color: item.textcolor, 'font-weight': 'bold' }"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
                <!-- end操作 -->
              </div>
            </div>

            <!-- end編輯 -->
          </template>
        </el-table-column>
        <el-table-column prop="role5">
          <template slot-scope="scope">
            <!-- 顯示 -->
            <div v-if="!editmode">
              <!-- 無角色資料 -->
              <div v-if="roleselected[4] == null" class="tabletext">-</div>
              <!-- end無角色資料 -->
              <div v-if="roleselected[4] != null">
                <el-select v-model="roleselected[4]" v-if="scope.row.id == 0">
                  <el-option
                    v-for="item in roleselectobject[4]"
                    v-bind:style="{ color: item.textcolor, 'font-weight': 'bold' }"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <div
                  v-if="scope.row.id != 0"
                  v-bind:style="{
                    color: textcolor(scope.row.role5),
                    'font-weight': 'bold',
                    'font-size': 'large'
                  }"
                  class="tabletext"
                >
                  {{ setRightLogo(scope.row.role5) }}
                </div>
              </div>
            </div>

            <!-- 編輯 -->
            <div v-if="editmode">
              <!-- 無角色資料 -->
              <div v-if="roleselected[4] == null" class="tabletext">-</div>
              <!-- end無角色資料 -->
              <div v-if="roleselected[4] != null">
                <div v-if="scope.row.id == 0" class="tabletext">
                  {{ roletitle(roleselected[4], roleselectobject[4]) }}
                </div>
                <!-- 預設5個角色不能編輯 -->
                <div
                  v-if="
                    scope.row.id != 0 &&
                      !scope.row.ifoperation &&
                      scope.row.role5Id <= 5 &&
                      userId != 1
                  "
                  class="tabletext"
                  v-bind:style="{
                    color: textcolor(scope.row.role5),
                    'font-weight': 'bold',
                    'font-size': 'large'
                  }"
                >
                  {{ setRightLogo(scope.row.role5) }}
                </div>
                <!-- end預設5個角色不能編輯 -->
                <!-- 資源 -->
                <div
                  v-if="
                    scope.row.id != 0 &&
                      !scope.row.ifoperation &&
                      (scope.row.role5Id > 5 || userId == 1)
                  "
                  class="tabletext"
                >
                  <!-- 只有讀取 -->
                  <div v-if="scope.row.readonly">
                    <el-select v-model="scope.row.role5">
                      <el-option
                        v-for="item in operateoptionreadonly"
                        v-bind:style="{ color: item.textcolor, 'font-weight': 'bold' }"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                  <!-- RWD -->
                  <div v-if="!scope.row.readonly">
                    <el-select v-model="scope.row.role5">
                      <el-option
                        v-for="item in operateoption"
                        v-bind:style="{ color: item.textcolor, 'font-weight': 'bold' }"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
                <!-- end資源 -->
                <!-- 操作 -->
                <!-- 預設5個角色操作不能編輯 -->
                <div
                  v-if="
                    scope.row.id != 0 &&
                      scope.row.ifoperation &&
                      scope.row.role5Id <= 5 &&
                      userId != 1
                  "
                  class="tabletext"
                  v-bind:style="{
                    color: textcolor(scope.row.role5),
                    'font-weight': 'bold',
                    'font-size': 'large'
                  }"
                >
                  {{ setRightLogo(scope.row.role5) }}
                </div>
                <!-- end預設5個角色操作不能編輯 -->
                <div
                  v-if="
                    scope.row.id != 0 &&
                      scope.row.ifoperation &&
                      (scope.row.role5Id > 5 || userId == 1)
                  "
                  class="tabletext"
                >
                  <el-select v-model="scope.row.role5">
                    <el-option
                      v-for="item in operateoperateoption"
                      v-bind:style="{ color: item.textcolor, 'font-weight': 'bold' }"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </div>
                <!-- end操作 -->
              </div>
            </div>
            <!-- end編輯 -->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div style="height:50px;opacity:0">walalaal</div>
  </div>
</template>

<script>
// import naturalCompare from 'string-natural-compare'
import { mapState } from 'vuex'

// import { ModelSelect } from 'vue-search-select'
import {
  RoleAPI,
  ResourceAPI,
  RoleResourceAPI,
  RoleResourceMultiAPI
} from '@/plugins/systemapis.js'
export default {
  components: {},
  props: {
    reloadnum: Number
  },
  watch: {
    reloadnum: function(newVal) {
      console.log(newVal)
    },
    roleselected: function(newVal) {
      if (newVal.length != 0) {
        this.changeselect() //排除角色選擇
        this.getresource(1) //取得角色關聯資源
      }
    }
  },
  data() {
    // var roleObject = {
    //   id: 0,
    //   name: '',
    //   seq: 0
    // }
    var role = {
      role1: 'admin',
      role2: 'pmc',
      role3: 'user',
      role4: 'pid',
      role5: ''
    }
    var roleselected = []

    var tabledata = []
    var operateoption = [
      { value: 3, text: 'O', textcolor: 'green' }, //RWD
      { value: 2, text: '△', textcolor: 'orange' }, //RW
      { value: 1, text: '//', textcolor: 'blue' }, //R
      { value: 0, text: 'X', textcolor: 'red' } //X
    ]
    var operateoptionreadonly = [
      { value: 1, text: 'O', textcolor: 'green' }, //R
      { value: 0, text: 'X', textcolor: 'red' } //X
    ]
    var operateoperateoption = [
      { value: 4, text: 'O', textcolor: 'green' }, //O
      { value: 0, text: 'X', textcolor: 'red' } //X
    ]
    // var roleObjectnull = JSON.parse(JSON.stringify(roleObject))
    return {
      userId: 0, //使用者id
      operateoptionreadonly, //只有讀取
      operateoperateoption, //編輯操作選單
      operateoption, //編輯選單
      roledataShow: [], //角色資源for顯示關聯
      AllResource: [], //全部資源
      roleselected, //5個角色
      roleselectobjectall: [], //角色選單all
      roleselectobject: [], //角色選單
      role,
      editmode: false, //編輯模式
      tabledata,
      newbtm: false, //新增
      editbtm: false, //編輯
      deletebtm: false, //刪除
      customize1: false, //自定義一
      customize2: false, //自定義二
      customize3: false //自定義三
    }
  },
  computed: {
    ...mapState({
      authority: state => state.Authority
    }),
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
    this.userId = JSON.parse(localStorage.getItem('user')).id

    this.iniright()

    this.getrole() //取得角色
    // this.getAllResource()
    // this.getrole()
  },
  methods: {
    //編輯，角色title鎖定
    roletitle(value, option) {
      var temprole = ''
      option.forEach(item => {
        if (value == item.value) {
          temprole = item.text
        }
      })
      return temprole
    },
    setRightLogo(value) {
      if (value == 0) {
        return 'X' //X
      } else if (value == 1) {
        return '//' //R
      } else if (value == 2) {
        return '△' //RW
      } else if (value == 3) {
        return 'O' //RWD
      } else if (value == 4) {
        return 'O' //O
      }
    },
    textcolor(value) {
      if (value == 0) {
        return 'red' //X
      } else if (value == 1) {
        return 'blue' //R
      } else if (value == 2) {
        return 'orange' //RW
      } else if (value == 3) {
        return 'green' //RWD
      } else if (value == 4) {
        return 'green' //O
      }
    },

    //設定權限
    iniright() {
      this.authority.forEach(item => {
        if (item.name == 'system_role') {
          if (!item.operation.includes(1)) {
            if (item.operation.includes(4)) {
              this.newbtm = true
            } //新增
            if (item.operation.includes(2)) {
              this.editbtm = true
            } //編輯
            if (item.operation.includes(3)) {
              this.deletebtm = true
            } //刪除
            if (item.operation.includes(5)) {
              this.customize1 = true
            } //自定義一
            if (item.operation.includes(6)) {
              this.customize2 = true
            } //自定義二
            if (item.operation.includes(7)) {
              this.customize3 = true
            } //自定義三
          }
        }
      })
    },
    //編輯
    editfunc() {
      this.editmode = true
    },
    //儲存
    submitfunc() {
      this.dealeditdata() //處理編輯資料
      // this.editmode = false
    },
    //取消編輯
    canceledit() {
      this.getrole() //取得角色
      this.editmode = false
    },
    //取得角色列
    getrole() {
      var access_token_val = this.$cookies.get('access_token')
      this.RoleOption = []
      this.roleselected = []
      RoleAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          this.roleselectobjectall = []
          this.roleselected = []
          if (res.data != null) {
            res.data.forEach((item, index) => {
              if (item.id != 1) {
                if (index < 6) {
                  this.roleselected.push(item.id)
                }
                this.roleselectobjectall.push({ text: item.name, value: item.id })
              }
            })
            this.changeselect() //排除角色選擇
            // this.getresource(2) //取得角色關聯資源
          }
        },
        error => {
          console.log(error.response)
          // this.$layer.msg(this.$t('fail') + error.response.data.response)
        }
      )
    },
    //排除角色選擇
    changeselect() {
      var allid = []

      this.roleselectobjectall.forEach(item => {
        allid.push(item.value)
      })
      this.roleselectobject = []
      for (var i = 0; i < 5; i++) {
        var selected = []
        selected.push(this.roleselected[i])

        var selectdifferent = this.different(selected, this.roleselected)

        var selectdifferent1 = this.different(selectdifferent, allid) //取得自己所選&未選擇roleid

        var tempoption = [] //取得選單
        selectdifferent1.forEach(item => {
          for (var i = 0; i < this.roleselectobjectall.length; i++) {
            if (item == this.roleselectobjectall[i].value)
              tempoption.push(this.roleselectobjectall[i])
          }
        })
        // this.roleselectobjectall.forEach(item => {})

        this.roleselectobject.push(tempoption)
      }
    },
    //取差集
    different(arr2, arr1) {
      let result = arr1.filter(e => {
        return arr2.indexOf(e) === -1
      })
      return result
    },

    //取得全部資源
    getAllResource() {
      var access_token_val = this.$cookies.get('access_token')
      ResourceAPI.get({
        headers: {
          access_token: access_token_val
        }
      }).then(
        res => {
          this.AllResource = res.data
          this.dealgetAllResource()
        },
        error => {
          console.log(error.response)
          // this.$layer.msg(this.$t('fail') + error.response.data.response)
          // this.editmodal = false
        }
      )
    },
    //處理全部資源
    dealgetAllResource() {
      var temparray = [
        {
          id: 0,
          id2: 0,
          resource1: '',
          resource2: this.$t('system_permission') + '/' + this.$t('account_role'), //'權限/角色'
          role1: '',
          role2: '',
          role3: '',
          role4: '',
          role5: '',
          role1Id: 0,
          role2Id: 0,
          role3Id: 0,
          role4Id: 0,
          role5Id: 0
        }
      ]
      //第一層
      this.AllResource.forEach(item => {
        if (
          this.stringtointarray(item.level).length == 1 &&
          this.stringtointarray(item.level)[0] != 0
        ) {
          var temprole = [0, 0, 0, 0, 0]
          var temproleId = [0, 0, 0, 0, 0]
          this.roledataShow.forEach((roleitem, index) => {
            temproleId[index] = roleitem.roleId //設定角色id
            //role沒有資料
            if (roleitem.resource.length == 0) {
              temprole[index] = 0
            } else {
              //關聯role_resource
              roleitem.resource.forEach(roleRightItem => {
                if (item.id == roleRightItem.id) {
                  temprole[index] = roleRightItem.operationShow
                }
              })
            }
          })
          //判斷只有讀取功能
          if (item.seq == 2) {
            temparray.push({
              id: item.id,
              id2: 0,
              resource1: this.$t(item.name),
              resource2: '',
              role1: temprole[0],
              role2: temprole[1],
              role3: temprole[2],
              role4: temprole[3],
              role5: temprole[4],
              role1Id: temproleId[0],
              role2Id: temproleId[1],
              role3Id: temproleId[2],
              role4Id: temproleId[3],
              role5Id: temproleId[4],
              ifoperation: false,
              readonly: true,
              children: []
            })
          } else {
            temparray.push({
              id: item.id,
              id2: 0,
              resource1: this.$t(item.name),
              resource2: '',
              role1: temprole[0],
              role2: temprole[1],
              role3: temprole[2],
              role4: temprole[3],
              role5: temprole[4],
              role1Id: temproleId[0],
              role2Id: temproleId[1],
              role3Id: temproleId[2],
              role4Id: temproleId[3],
              role5Id: temproleId[4],
              ifoperation: false,
              readonly: false,
              children: []
            })
          }
        }
        item.level = this.stringtointarray(item.level) //level轉int array
      })
      //權限角色
      this.AllResource.forEach(item => {
        if (item.seq != 0 && item.level.length == 2) {
          for (var i = 0; i < temparray.length; i++) {
            if (temparray[i].id == item.level[0]) {
              var temprole = [0, 0, 0, 0, 0]
              var temproleId = [0, 0, 0, 0, 0]
              this.roledataShow.forEach((roleitem, index) => {
                temproleId[index] = roleitem.roleId //設定角色id
                //role沒有資料
                if (roleitem.resource.length == 0) {
                  temprole[index] = 0
                } else {
                  //關聯role_resource
                  roleitem.resource.forEach(roleRightItem => {
                    if (item.id == roleRightItem.id) {
                      temprole[index] = roleRightItem.operationShow
                    }
                  })
                }
              })
              //判斷只有讀取功能
              let readonly = false
              if (item.seq == 2) {
                readonly = true
              }
              //id存在
              if (temparray[i].id2 == 0) {
                temparray[i].id2 = item.id
                temparray[i].resource2 = this.$t(item.name)
                temparray[i].role1 = temprole[0]
                temparray[i].role2 = temprole[1]
                temparray[i].role3 = temprole[2]
                temparray[i].role4 = temprole[3]
                temparray[i].role5 = temprole[4]
                temparray[i].readonly = readonly
              } else {
                temparray.splice(i + 1, 0, {
                  id: item.id,
                  id2: item.id,
                  resource1: '',
                  resource2: this.$t(item.name),
                  role1: temprole[0],
                  role2: temprole[1],
                  role3: temprole[2],
                  role4: temprole[3],
                  role5: temprole[4],
                  role1Id: temproleId[0],
                  role2Id: temproleId[1],
                  role3Id: temproleId[2],
                  role4Id: temproleId[3],
                  role5Id: temproleId[4],
                  ifoperation: false,
                  readonly: readonly,
                  children: []
                })
              }
              break
            }
          }
        }
      })
      //第二層操作
      this.AllResource.forEach(item => {
        if (item.icon == 'cos5' || item.icon == 'cos6' || item.icon == 'cos7') {
          for (var i = 0; i < temparray.length; i++) {
            if (
              temparray[i].id == item.level[item.level.length - 2] ||
              temparray[i].id2 == item.level[item.level.length - 2]
            ) {
              var costype = 0
              if (item.icon == 'cos5') {
                costype = 5
              } else if (item.icon == 'cos6') {
                costype = 6
              } else if (item.icon == 'cos7') {
                costype = 7
              }
              var temprole = [0, 0, 0, 0, 0]
              var temproleId = [0, 0, 0, 0, 0]
              this.roledataShow.forEach((roleitem, index) => {
                temproleId[index] = roleitem.roleId //設定角色id
                //role沒有資料
                if (roleitem.resource.length == 0) {
                  temprole[index] = 0
                } else {
                  //關聯role_resource
                  roleitem.resource.forEach(roleRightItem => {
                    if (item.level[item.level.length - 2] == roleRightItem.id) {
                      //父資源
                      if (item.icon == 'cos5') {
                        temprole[index] = roleRightItem.SpecialOperation5
                      } else if (item.icon == 'cos6') {
                        temprole[index] = roleRightItem.SpecialOperation6
                      } else if (item.icon == 'cos7') {
                        temprole[index] = roleRightItem.SpecialOperation7
                      }
                    }
                  })
                }
              })
              temparray[i].children.push({
                id: item.id,
                id2: item.id,
                resource1: '',
                resource2: '└ ' + this.$t(item.name),
                costype: costype,
                role1: temprole[0],
                role2: temprole[1],
                role3: temprole[2],
                role4: temprole[3],
                role5: temprole[4],
                role1Id: temproleId[0],
                role2Id: temproleId[1],
                role3Id: temproleId[2],
                role4Id: temproleId[3],
                role5Id: temproleId[4],
                ifoperation: true,
                readonly: false,
                children: []
              })
              break
            }
          }
        }
      })

      this.tabledata = temparray
    },
    //字串轉int array
    stringtointarray(data) {
      return data.split(',').map(Number)
    },
    //取得角色資源權限
    getresource() {
      //id array轉成id string取多筆
      var tempidstring = '['
      this.roleselected.forEach(item => {
        tempidstring += item + ','
      })
      tempidstring = tempidstring.substring(0, tempidstring.length - 1) + ']'

      var access_token_val = this.$cookies.get('access_token')
      RoleResourceAPI.get({
        headers: {
          id: tempidstring,
          access_token: access_token_val
        }
      }).then(
        res => {
          //合併操作資源
          if (res.data != null) {
            this.roledataShow = this.dealroleresource(res.data)
          } else {
            this.roledataShow = []
          }

          this.getAllResource() //取得所有資源
        },
        error => {
          console.log(error.response)
          // this.$layer.msg(this.$t('fail') + error.response.data.response)
          this.editmodal = false
        }
      )
    },
    //合併操作資源
    dealroleresource(data) {
      var tempdata = []
      //處理每個角色
      data.forEach(item => {
        var temparray = []
        if (item.resourceRoleRels != null) {
          //合併每個資源操作
          item.resourceRoleRels.forEach(rolesesourceitem => {
            var tempfalg = true
            for (var i = 0; i < temparray.length; i++) {
              if (rolesesourceitem.resourceId == temparray[i].id) {
                temparray[i].operation.push(rolesesourceitem.operation)
                tempfalg = false
              }
            }
            if (tempfalg) {
              temparray.push({
                id: rolesesourceitem.resourceId,
                operation: [rolesesourceitem.operation]
              })
            } else {
              tempfalg = true
            }
          })
        }
        temparray.forEach(operationitem => {
          //RWD
          if (
            operationitem.operation.includes(2) &&
            operationitem.operation.includes(3) &&
            operationitem.operation.includes(4)
          ) {
            operationitem.operationShow = 3
          } else if (
            //RW
            operationitem.operation.includes(2) &&
            !operationitem.operation.includes(3) &&
            operationitem.operation.includes(4)
          ) {
            operationitem.operationShow = 2
          } else if (operationitem.operation.includes(1)) {
            //R
            operationitem.operationShow = 1
          } else if (operationitem.operation.includes(2) && !operationitem.operation.includes(3)) {
            //RW
            operationitem.operationShow = 2
          }

          //特殊操作
          operationitem.SpecialOperation5 = 0
          operationitem.SpecialOperation6 = 0
          operationitem.SpecialOperation7 = 0
          if (operationitem.operation.includes(5)) {
            operationitem.SpecialOperation5 = 4
          }
          if (operationitem.operation.includes(6)) {
            operationitem.SpecialOperation6 = 4
          }
          if (operationitem.operation.includes(7)) {
            operationitem.SpecialOperation7 = 4
          }
        })
        tempdata.push({ resource: temparray, roleId: item.resourceRoleRels[0].roleId })
      })

      //補無權限null
      var tempdata2 = []
      this.roleselected.forEach(item => {
        var tempflag = true
        for (var i = 0; i < tempdata.length; i++) {
          if (tempdata[i].roleId == item) {
            tempdata2.push(tempdata[i])
            tempflag = false
          }
        }
        if (tempflag) {
          tempdata2.push({ resource: [], roleId: item })
        }
      })
      return tempdata2
    },

    //處理編輯資料
    dealeditdata() {
      var rolearray = ['role1', 'role2', 'role3', 'role4', 'role5']
      var editarray = []
      this.roleselected.forEach((item, index) => {
        editarray.push({ resource: [], roleId: item })
        //處理第一層資源
        var temp = this.firstlayer(this.tabledata, rolearray[index])
        editarray[index].resource = temp
        //處理第二層資源

        var temp1 = this.secondlayer(this.tabledata, rolearray[index])
        if (temp1 != null) {
          temp1.forEach(item => {
            let tempflag = false
            editarray[index].resource.forEach(parentitem => {
              if (parentitem.id == item.id) {
                tempflag = true
                parentitem.operation = parentitem.operation.concat(item.operation)
                parentitem.operation = parentitem.operation.filter(
                  (item1, index1) => parentitem.operation.indexOf(item1) === index1
                )
              }
            })

            if (!tempflag) {
              editarray[index].resource.push(item)
            }
          })
        }
      })
      this.rooteditfunc(editarray) //判斷是否可編輯預設角色
    },
    //合併相同資源id
    dealsampresource(data) {
      if (data.resource.length != 0) {
        var temparray = []
        data.resource.forEach((item1, index1) => {
          var tempoperation = item1.operation
          var tempitem = item1
          data.resource.forEach((item2, index2) => {
            if (item1.id == item2.id && index1 != index2) {
              item2.operation.forEach(operationitem => {
                tempoperation.push(operationitem)
              })
            }
          })
          //1,2,3,4,5,6,7 去除1
          var b = []
          if (tempoperation.length > 1) {
            tempoperation.forEach(item => {
              if (item != 1) {
                b.push(item)
              }
            })
          } else {
            b = tempoperation
          }
          tempitem.operation = b
          if (tempitem.operation.length <= 7) {
            temparray.push(tempitem)
          }
        })
        data.resource = temparray
      }
      return data
    },
    //判斷是否可編輯預設角色
    rooteditfunc(data) {
      if (data != null) {
        let temparray = []
        if (this.userId == 1) {
          //root編輯
          temparray = data
        } else {
          //非root編輯，排除預設
          data.forEach(item => {
            if (item.roleId > 5) {
              temparray.push(item)
            }
          })
        }
        if (temparray.length != 0) {
          this.checkadmin(temparray)
        } else {
          this.getrole() //取得角色
          this.editmode = false
        }
      } else {
        this.getrole() //取得角色
        this.editmode = false
      }
    },
    //檢查admin角色設定設定O
    checkadmin(data) {
      data.forEach(item => {
        if (item.roleId == 2) {
          let tempflag = false
          let tempindex = 0
          item.resource.forEach((adminitem, index) => {
            if (adminitem.id == 105) {
              tempindex = index
            }
          })
          if (tempflag) {
            item.resource.splice(tempindex, 1)
          }
          item.resource.push({ id: 88, operation: [1], seq: 0 })
          item.resource.push({ id: 105, operation: [2, 3, 4, 5, 6, 7], seq: 0 })
        }
      })

      //排除operation 1
      data.forEach(item => {
        item.resource.forEach(resourceitem => {
          resourceitem.operation.indexOf(1)
          if (resourceitem.operation.length > 1 && resourceitem.operation.includes(1)) {
            let index = resourceitem.operation.indexOf(1)
            if (index > -1) {
              resourceitem.operation.splice(index, 1)
            }
          }
        })
      })

      this.calleditapi(data)
    },
    //角色資源送出call API
    calleditapi(data) {
      RoleResourceMultiAPI.put(JSON.stringify(data), {
        headers: {}
      }).then(
        () => {
          this.getrole() //取得角色
          this.editmode = false
          this.$layer.msg(this.$t('scuccess'))
        },
        error => {
          this.$layer.msg(error.response.data.response)
          console.log(error.response.data.response)
        }
      )
    },
    //選單RWD轉operation
    rwdtooperation(value) {
      if (value == 1) {
        return [1]
      } else if (value == 2) {
        return [2, 4]
      } else if (value == 3) {
        return [2, 3, 4]
      }
    },
    //處理第二層資源
    secondlayer(data, role) {
      var temparray = []
      data.forEach((item, index) => {
        if (index != 0 && item[role] != 0) {
          var operationarray = this.rwdtooperation(item[role])

          //特殊操作
          if (item.children.length != 0) {
            item.children.forEach(childrenitem => {
              if (childrenitem[role] == 4) {
                operationarray.push(childrenitem.costype)
              }
            })
          }
          var itemid = item.id2
          if (itemid == 0) {
            itemid = item.id
          }
          temparray.push({
            id: itemid,
            operation: operationarray,
            seq: 0
          })
        }
      })
      return temparray
    },
    //處理第一層資源
    firstlayer(data, role) {
      var temparray = []
      var tempob
      var secflag = false
      data.forEach((item, index) => {
        if (index != 0) {
          //判斷大標題
          if (item.id != item.id2) {
            //大標題顯示
            if (secflag) {
              temparray.push(tempob)
            }
            secflag = false
            tempob = item //下一個大標題放暫存
          }
          if (item[role] != 0) {
            secflag = true
          }
          //最後一筆
          if (index == data.length - 1) {
            if (secflag) {
              temparray.push(tempob)
            }
          }
        }
      })
      //賦予第一層資源可R
      if (temparray != null) {
        var editfistarray = []
        temparray.forEach(item => {
          editfistarray.push({
            id: item.id,
            operation: [1],
            seq: 0
          })
        })

        return editfistarray
      } else {
        return temparray //回傳空陣列
      }
    }
  }
}
</script>
<style>
.eltableclass {
  width: 100%;
  margin-bottom: 20px;
  font-weight: bold !important;
  font-family: 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
}
.moldnumberclass {
  max-width: 30px;
  text-align: center;
}
table.table td {
  vertical-align: middle;
  padding-top: 0;
  padding-bottom: 0rem;
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
.tabletext {
  text-align: center;
}
</style>
