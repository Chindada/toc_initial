/* /tw/lang.js */
export default {
  // 側欄
  log_out: '登出', //登出
  introduction: '首頁',
  basicsetting_product: ' 製品管理',
  basicsetting_mold: ' 模具管理',
  basicsetting_machine: ' 設備管理',
  basicsetting_material: ' 原料管理',
  basicsetting_employee: ' 人員管理',
  basicsetting_workshop: ' 廠區管理',
  basicsetting_company: '夥伴管理',
  basicsetting_device: '裝置管理',
  basicsetting_device_dc: '採集裝置',
  basicsetting_device_ds: '串流裝置',
  basicsetting_device_rd: 'RD',
  produce: '生產管理',
  produce_manufacturingorder: '製令',
  produce_schedule: '排程',
  produce_task: '任務',
  produce_quality: '品檢',
  produce_storage: '入庫',
  dashboard: '看板管理',
  dashboard_station: '單站看板',
  dashboard_remote: '遠端看板',
  report: '報表管理',
  report_setting: '報表設定',
  analysis: '數據分析',
  analysis_group: '依廠區分析',
  analysis_machine: '依設備分析',
  analysis_part: '依製品分析',
  analysis_manufacturingorder: '依製令分析',
  analysis_mold: '依模具分析',
  analysis_shoot: '稼動分析',
  analysis_course: '歷程分析',
  analysis_totalyield: '總產量分析',
  analysis_workhryield: '工時產量分析',
  analysis_productivity: '生產效率分析',
  analysis_iom: 'IoM指標分析',
  analysis_yield: '產量分析',
  analysis_cttime: '週期時間分析',
  system: '系統管理',
  system_defect: '缺陷設定',
  system_user: '個人資料',
  system_environment: '環境設定',
  system_permission: '權限',
  system_resource: '資源列表',
  system_account: '帳號設定',
  system_authority: '權限認證',

  //共用
  all: '全部', //全部
  optional: '選填', //選填
  delete: '刪除', //刪除
  submit: '儲存', //儲存
  close: '關閉', //關閉
  new: '新增', //新增
  edit: '編輯', //編輯
  scuccess: '成功', //成功
  fail: '失敗', //失敗
  warrning_title: '警告', //警告
  warrning_body: '您是要確認刪除選項', //您是要確認刪除選項?
  status: '狀態', //狀態
  operating: '操作', //操作
  show_perpage: '每頁顯示', //每頁顯示
  search: '搜尋', //搜尋
  actvite: '啟用', //啟用
  disable: '停用', //停用
  length: '長度', //長度
  width: '寬度', //寬度
  height: '高度', //高度
  average_thickness: '平均厚度', //平均厚度
  max_thickness: ' 最大厚度', //最大厚度
  tab_standby_to_schedule: '待轉排程', //待轉排程
  tab_standby_to_task: '待轉任務', //待轉任務
  tab_in_schedule: '排程中', //排程中
  tab_in_task: '任務中', //任務中
  tab_finished: '已完成', //已完成
  tab_normal: '一般', ///一般
  tab_maintain: '待維護', //待維護
  tab_disable: '停用', //停用
  mon: '星期一', //星期一
  tue: '星期二', //星期二
  wed: '星期三', //星期三
  thu: '星期四', //星期四
  fri: '星期五', //星期五
  sat: '星期六', //星期六
  sun: '星期日', //星期日
  mon1: '一', //一
  tue1: '二', //二
  wed1: '三', //三
  thu1: '四', //四
  fri1: '五', //五
  sat1: '六', //六
  sun1: '日', //日
  number: '數量', //數量
  normal_number: '良品數', //良品數
  abnormal_number: '不良品數', //不良品數
  defect_record: '缺陷紀錄', //缺陷錄
  defect_total: '缺陷數', //缺陷總數
  select_all: '全選', //全選
  cancel: '取消', //取消
  confirm_title: '請確認', //請確認
  confirm_text1: '您是要', //您是要
  confirm_text2: '選項?', //選項?
  import_success: '匯入成功  ', //匯入成功
  import_success_text: '成功', //成功
  cancel_import: '取消匯入', //取消匯入
  import_error_text: '錯誤', //錯誤
  import_duplicated: '重複', //重複

  //首頁
  title_one: 'AIoM/IoM簡介', //AIoM/IoM簡介
  title_two: '系統特色', // 系統特色
  paragraph_one:
    '物聯網(IoT)和工業物聯網(IIoT)應用將在2019年爆發， 面對萬物皆聯網的未來趨勢，如何建構智慧射出成型工 廠，射出成型機首先要具備網路連結能力，【模具與成型產業智慧物聯網】，體積輕巧可簡單安裝於任何 品牌的射出成型機，只要完成感測器接點安裝、無線網路連結、及網頁設定等步驟，即可直接從感測器擷取資料， 無論何時何地都可透過專用軟體界面，如果射出成型工廠已經導入ERP或MES系統，直接記錄射出成型過程 中所生成的即時資訊，因應工廠管理模式的變格。', // 段落1
  paragraph_two:
    '在傳統管理模式下，射出工廠的射出成型機產能資訊需由人工監視，抄錄，並進行事後分析，發生產能或 品質異常時往往無法即時得知，只能事後進行品質檢 驗與相關異常補救措施，既沒有效率也不易真正發現 異常原因。實現於現場或遠端即時監控的射出成型工廠，便於即時監控產能外，並提供設備稼動率、生產 效率、製品良率之分析與記錄，能達到即時監看、同 步管理、節省時間、人力、及成本的目的，進一步深 入到製造執行層，甚至有能力整合設備自動化控制資 訊，一步步實現智慧工廠藍圖。', // 段落2

  //即時看板
  title_total: '總數',
  title_running: '運轉',
  title_idle: '閒置',
  title_error: '異常',
  title_shutdown: '停機',
  dc_error: 'DC 異常',
  eg_error: 'EG 異常',
  eg_sync: 'EG 同步中',
  page1: '第',
  page2: '頁，共',
  page3: '頁',

  //單站看板
  machine_number: '編號 : ',
  machine_model: '型號 : ',
  schedule_number: '排程編號',
  start_time: '開始時間',
  qty: '生產模次',
  ct_yaxis: '週期時間(秒)',
  ct_xaxis: '近30分鐘模次 or 近30模次',
  gyr_yaxis: '模次',
  gyr_xaxis1: '綠品',
  gyr_xaxis2: '黃品',
  gyr_xaxis3: '紅品(單位:模次)',

  //製令管理
  to_schedule: '轉排程', //轉排程
  manufacturingorder_number: '製令編號', //製令編號
  manufacturingorder_customize_number: '自定義製令', //自定義製令
  manufacturingorder_deadline: '完工期限', //完工期限
  manufacturingorder_order: '訂單編號', //訂單編號
  product_unselect: '未選擇製品', //未選擇製品
  new_one: '新增一筆', //新增一筆
  manufacturingorder: '製令', //製令
  to_schedule_mold: '模具',
  to_schedule_qty: '模次',
  to_schedule_material: '原料',
  to_schedule_workshop: '廠區',
  to_schedule_machine: '設備',
  to_schedule_selectall_btm: '選擇整頁', //選擇整頁
  to_schedule_clearall_btm: '清除全部', //清除全部
  status_option_schedule: '已排程', //已排程
  status_option_unschedule: '未排程', //未排程
  status_option_finished: '已完成', //已完成
  status_option_tasked: '任務中', //任務中
  // status_option_abort: '已完成(終止)', //已完成(終止)
  // status_option_others: '其他', //其他
  manufacturingorder_confirm: '製令確認', //製令確認
  no_mold_selected: '未選擇模具', //未選擇模具
  machine_no_workshop: '設備無廠區', //設備無廠區
  can_not_schedule: '無法排程(無人員排班)', //無法排程(無人員排班)
  mold_no_machine: '模具無可用設備', //模具無可用設備
  to_schedule_submit: '轉排程', //轉排程

  //排程管理
  schedule: '排程', //排程
  schedule_number: '排程編號', //排程編號
  schedule_start_time: '開始時間', //開始時間
  schedule_end_time: '結束時間', //結束時間

  //任務管理
  task: '任務', //任務
  task_number: '任務編號', //任務編號
  task_end: '結束任務', //結束任務
  task_start_time: '開始時間', //開始時間
  task_end_time: '結束時間', //結束時間
  task_edit: '編輯任務', //編輯任務
  // task_end: '結束', //結束
  task_on_machine_title: '設備已存在任務', //設備已存在任務
  task_on_machine_body1: '請先結束設備 ', //請結束設備
  task_on_machine_body2: ' 上的任務，再開始新任務', //上任務再開始新任務

  //品檢管理
  quality: '品檢', //品檢
  quality_number: '品檢編號', //品檢編號

  //入庫管理
  storage: '入庫', //入庫
  storage_sernumber: '入庫編號', //入庫編號

  //製品管理
  product_example: '製品範例', //製品範例
  product_import: '匯入製品', //製品範例
  product_number: '製品編號', //製品編號
  product_name: '製品名稱', //製品名稱
  mold_cavity: '模穴', //模穴
  product_weight: '重量(g)', //重量(g)
  product_length: '尺寸(長/寬/高,mm)', //尺寸(長/寬/高,mm)
  product_averageThickness: '肉厚(平均/最大,mm)', //肉厚(平均/最大,mm)
  product_mold_placeholder: '選擇模具', //選擇模具
  product_select_cavity: '選擇模穴', //選擇模穴
  product_material_placeholder: '選擇原料', //選擇原料
  product_material_remark: '原料備註', //原料備註
  product_mold_remark: '模具備註', //模具備註
  product_yieldrate: '良率(%)', //良率
  product: '製品', //製品

  //模具管理
  mold_qty: '模次', //模次
  mold_example: '模具範例', //製品範例
  mold_import: '匯入模具', //製品範例
  mold_rel_example: '設備關聯範例', //關聯範例
  mold_rel_import: '匯入設備關聯', //匯入關聯
  mold: '模具', //模具
  mold_number: '模具編號', //模具編號
  mold_name: '模具名稱', //模具名稱
  mold_cycletime: '計畫週期時間(s)', //計畫週期時間(s)
  mold_cavity_number: '模穴數', //模穴數
  mold_product_model: '機種', //機種
  mold_machine: '綁定設備', //綁定設備
  mold_updown_time_title: '換模時間(上模/下模 ,min)', //換模時間(上模/下模 ,min)
  mold_up_time: '上模時間', //上模時間
  mold_down_time: '下模時間', //下模時間
  mold_length_title: '尺寸(長/寬 ,mm)', //尺寸(長/寬 ,mm)
  mold_thickness_title: '厚度(靜模/動模 ,mm)', //厚度(靜模/動模 ,mm)
  mold_fixed_thickness: '靜模', //靜模
  mold_movable_thickness: '動模', //動模
  mold_stroke_title: '開模行程(mm)', //開模行程(mm)
  mold_coldhot_running_title: '流道重量(冷/熱 ,g)', //流道重量(冷/熱 ,g)
  mold_cold_running_weight: '冷流道', //冷流道
  mold_hot_running_weight: '熱流道', //熱流道
  mold_cold_running_max_diameter: '冷流道最大直徑(mm)', //冷流道最大直徑(mm)
  mold_green_range: '綠品參數(0~0.9)', //綠品參數(0~0.9)
  mold_yellow_range: '黃品參數(>綠品~0.9)', //黃品參數(>綠品~0.9)
  is_assigned: '已分配', //已分配
  un_assigned: '未分配', //未分配
  select_machine: '選擇設備', //選擇設備
  product_import_error1: '模穴不存在', //模穴不存在
  product_import_error2: '模具不存在', //模具不存在
  product_import_error3: '原料不存在', //原料不存在
  product_import_error4: '製品編號重複', //製品編號重複

  //設備管理
  machine: '設備', //設備
  machine_number: '設備編號', //設備編號
  machine_model: '設備型號', //設備型號
  machine_theoretical_injection_volume: '最大射出量(g)', //最大射出量(g)
  machine_brand: '設備品牌', //設備品牌
  machine_clamping_power: '鎖模力(ton)', //鎖模力(ton)
  machine_material_type: '綁定原料', //綁定原料
  machine_name: '設備別名', //設備別名
  machine_manufacture_date: '製造日期', //製造日期
  machine_purchas_date: '購買日期', //購買日期
  machine_max_injection_pressure: '最高射出壓力(mpa)', //最高射出壓力(mpa)
  machine_injection_speed: '射出速率(mm/s)', //射出速率(mm/s)
  machine_max_open_stroke: '最大開模行程(mm)', //最大開模行程(mm)
  machine_nozzle_closed_power: '噴嘴封閉力', //噴嘴封閉力
  machine_max_mold_thickness: '最大模厚(mm)', //最大模厚(mm)
  machine_min_mold_thickness: '最小模厚(mm)', //最小模厚(mm)
  machine_screw_diameter: '螺桿直徑(mm)', //螺桿直徑(mm)
  machine_screw_ratio: '螺桿長徑比', //螺桿長徑比
  machine_shooting_stroke: '射座行程(mm)', //射座行程(mm)
  machine_shot_stroke: '射出行程(mm)', //射出行程(mm)
  machine_heating_segment_number: '電熱段數', //電熱段數
  machine_tube_total_heat: '料管總加熱量(j/s)', //料管總加熱量(j/s)
  machine_material_type_general: '一般', //一般
  machine_material_type_transparent: '透明', //透明
  machine_material_type_black: '黑色', //黑色
  machine_material_type_white: '白色', //白色f
  machine_material_type_fiber: '加纖', //加纖
  machine_material_type_other: '其他', //其他
  workshop_machine_notset: '未設定廠區', //未設定廠區
  machine_last_update_time: '最後更新時間', //最後更新時間
  machine_set_dc: '綁定裝置', //綁定裝置
  machine_dc_isset: '已綁定', //已綁定
  select_workshop: '選擇廠區', //選擇廠區

  //原料管理
  material_example: '原料範例', //原料範例
  material_import: '匯入原料', //匯入原料
  material: '原料', //原料
  material_number: '原料編號', //原料編號
  material_name: '原料型號', //原料型號
  material_abbreviation: '原料簡稱', //原料簡稱
  material_brand: '原料品牌', //原料品牌
  material_machine: '綁定設備', //綁定設備
  material_specific_gravity: '比重', //比重
  material_specific_heat: '比熱', //比熱
  material_water_absorption_rate: '吸水率', //吸水率
  material_shrink_rate: '收縮率', //收縮率
  material_heat_transfer_coefficient: '熱傳導係數', //熱傳導係數
  material_melt_flow_index: '熔融指數', //熔融指數
  material_flow_length_ratio: '流長比', //流長比
  material_transmittance: '穿透率', //穿透率
  material_heat_deflection_temperature: '熱變形溫度(°C)', //熱變形溫度(°C)
  material_heat_tolerance: '耐熱度(°C)', //耐熱度(°C)
  material_glass_transition_temperature: '玻璃轉移點(°C)', //玻璃轉移點(°C)

  //人員管理
  employee_schedule_tab: '排班管理', //排班管理
  employee_class_tab: '班別管理', //班別管理
  employee_holiday_tab: '假日管理', //假日管理
  employee_schedule_schedule: '排班', //排班
  employee_type: '類型', //類型
  employee_mode: '模式', //模式
  employee_start_time: '開始時間', //開始時間
  employee_end_time: '結束時間', //結束時間
  employee_start_date: '開始日期', //開始日期
  employee_end_date: '結束日期', //結束日期
  employed_holiday_time_error: '結束時間不得早於開始時間', //結束時間不得早於開始時間
  employed_schedule_time_error: '結束日期不得早於開始日期', //結束日期不得早於開始日期
  employee_normal: '一般', //一般
  employee_overtime: '加班', //加班
  employee_everyday: '每日', //每日
  employee_odd_day: '單數日', //單數日
  employee_even_day: '雙數日', //雙數日
  employee_odd_week: '每週一三五', //每週一三五
  employee_even_week: '每週二四六', //每週二四六
  employee_time: '時間', //時間
  employee_date: '日期', //日期
  employee_class_notset: '未新增班別', //未新增班別
  employee_class: '班別', //班別
  employee_holiday: '假日', //假日
  employee_holiday_type: '類別', //類別
  employee_holiday_week: '星期', //星期
  employee_holiday_remark: '備註', //備註
  employee_holiday_national_holiday: '國定假日', //國定假日
  employee_holiday_official_holiday: '例假日', //例假日
  employee_holiday_vacation_holiday: '休假日', //休假日
  employee_holiday_custom_overtime: '自定義補班', //自定義補班
  employee_holiday_custom_rest: '自定義休息', //自定義休息

  //廠區管理
  workshop: '廠區', //廠區
  workshop_number: '廠區編號', //廠區編號
  workshop_name: '廠區名稱', //廠區名稱
  workshop_type: '類型', //類型
  workshop_remark: '備註', //備註
  workshop_machine: '設備廠區', //設備廠區
  workshop_mold: '模具倉', //模具倉
  workshop_material: '原料倉', //原料倉
  workshop_product: '製品倉', //製品倉
  workshop_machine_num: '設備總數', //設備總數

  //採集裝置
  dc_idle_time: '閒置時間(s)', //閒置時間(s
  dc_put_time_interval: '資料擷取最大區間(s)', //資料擷取最大區間(s)
  dc_create_time: '建立時間', //建立時間

  //缺陷管理
  defect: '缺陷', //缺陷
  defect_type: '類別', //類別
  defect_name: '缺陷名稱', //缺陷名稱
  defect_remark: '備註', //備註

  //環境變數
  carousel_frequency: '看板輪播頻率(s)', //輪播頻率(s)
  company_name: '公司名稱', //公司名稱
  language: '預設語系', //預設語系
  product_suffix: '製品編號後綴', //製品後綴
  product_suffix_mode: '製品編號後綴模式', //製品模式
  img_title_1: '看板圖示', //看板圖示
  img_title_2: '首頁圖示', //首頁圖示
  img_title_1_info: '(建議尺寸 71*55px)', //(建議尺寸 71*55 px)
  img_title_2_info: '(建議尺寸 240*49 px)', //(建議尺寸 1368*333 px)
  update_btm_title: '選擇上傳圖片', //選擇上傳圖片
  manufacturingorder_output_type: '製令明細匯出格式(.xls)', //製令匯出模式
  server_ip: '服務器 IP', //服務器IP
  multiple_page: '多個工作表', //分頁
  one_page: '合併工作表', //合併

  //新增
  remote_dashboard_setting: '遠端看板', //遠端看板
  ds_name: '串流裝置名稱', //串流裝置名稱
  select_dasboard: '選擇看板', //選擇看板
  page_mode: '輪播/頁面', //輪播/頁面
  not_setting: '未設定', //未設定
  carousel: '輪播', //輪播
  playing: '播放中', //播放中
  off_line: '斷線', //斷線
  setting_incomplete: '設定未完全', //設定未完全

  //報表
  manufacture_chart: '製造指標', //製造指標
  equipment_chart: '設備指標', //設備指標
  efficiency_chart: '效率指標', //效率指標
  efficiency1_chart: '良率指標', //良率指標
  stability_chart: '穩定指標', //穩定指標
  manufacture_index: '製造指標', //1.製造指標
  equipment_index: '設備指標', //2.設備指標
  efficiency_index: '效率指標', //3.效率指標
  stability_index: '穩定指標', //4.穩定指標
  schedules_index: '本日排程', //5.本日排程
  reportdate: '報表日期', //報表日期
  downdtime: '下載日期', //下載日期

  plan_number: '計畫產量', //計畫產量
  production_number: '累積數量', //生產量
  storage_number: '入庫量', //入庫量
  storage_rate: '入庫率', //入庫率
  storage_yieldrate: '良率', //入庫良率(Q)
  remaining_time: '餘工時', //餘工時
  report_manufacture_number: '製令編號', //製令編號
  report_machine_number: '設備編號', //設備編號
  d_day: '當日指標', //當日指標
  d_day_1: '前一日', //前一日
  d_day_2: '前二日', //前二日
  d_day_3: '前三日', //前三日
  d_day_7: '前七日', //前七日
  d_day_30: '前三十日', //前三十日
  short_tern: '短期趨勢', //短期趨勢
  logn_tern: '長期趨勢', //長期趨勢
  report_schedule_number: '排程編號', //排程編號
  report_mold_number: '模具編號', //模具編號
  plan_molds: '計畫模次', //計畫模次
  nodata: '無資料', //無資料

  //報表設定
  report_date: '日期', //日期
  report_download: '下載', //下載
  recipient_setting: '收件人設定', //收件人設定
  recipient_name: '收件人名稱', //收件人名稱
  recipient_1: '收件人一', //收件人一
  recipient_2: '收件人二', //收件人二
  recipient_3: '收件人三', //收件人三
  warning_setting: '警示設定', //警示設定
  red_setting: '紅色警示', //紅色警示
  yellow_setting: '黃色警示', //黃色警示
  mail_server_setting: '郵件伺服器設定', //郵件伺服器設定
  mail_host: '主機', //主機
  mail_port: '埠號', //埠號
  mail_account: '帳號', //帳號
  mail_password: '密碼', //密碼
  day: '日', //天
  day_7: '週', //7天
  day_30: '月', //30天
  start_date: '開始日期', //開始日期
  end_date: '結束日期', //結束日期
  utilization_rate: '稼動率', //稼動率
  productivity: '生產效率', //生產效率

  download_error1: '請勿早於部署日期', //'請勿早於部署日期'
  download_error2: '請勿選擇未來日期', //'請勿選擇未來日期'
  defaultmailserver: '使用預設郵件伺服器', //'使用預設
  confirm_export_manufacturingorder: '匯出製令可能會花費較長時間，確認繼續匯出?', //'確認匯出製令
  confirm: '確認', //'確認

  account_account: '帳號', //'帳號
  account_pw: '密碼', //'密碼
  account_confirm_pw: '確認密碼', //'確認密碼
  account_new_pw: '新密碼', //'新密碼
  account_name: '姓名', //'姓名
  account_role: '角色', //'角色
  account_mail: '信箱', //'信箱
  account_phone: '電話', //'電話
  change_pw: '變更密碼', //'變更密碼
  pw_not_same: '兩次輸入的密碼不一致', //'兩次輸入的密碼不一致
  account_existed: '帳號已存在', //'帳號已存在
  existed: ' 已存在', //'已存在

  personal_page: '個人資料', //'個人資料

  role_resources: '分配資源', //'分配資源
  inoutput: '匯入/匯出', //匯入匯出
  copy: '複製', //複製
  read: '僅限讀取', //僅限讀取
  output: '匯出', //匯出
  endtask: '結束任務', //結束任務
  toschedule: '轉排程', //轉排程
  system_role: '角色設定', //角色設定

  task_time_error: '時間輸入錯誤', //時間輸入錯誤
  error_reoprt: '任務狀況回報', //任務狀況回報
  employee: '人員', //人員
  no_more_quality: '任務的所有製品已完成品檢', //任務的所有製品已完成品檢
  no_more_storage: '任務的所有製品已完成入庫', //任務的所有製品已完成入庫
  no_more_qualityOEE: '此排程已完成品檢', //此排程已完成品檢
  no_more_storageOEE: '此排程已完成入庫', //此排程已完成入庫
  remark: '備註', //備註
  abnormal: '異常', //異常

  broadcast_setting: '推播設定', //推播設定
  broadcast_list: '推播列表', //推播列表
  broadcast_realtime: '即時', //即時
  broadcast_overtime: '逾時', //逾時
  broadcast_history: '歷史', //歷史
  broadcast_lift: '解除', //解除
  broadcast_name: '推播名稱', //推播名稱
  broadcast_monitor_item: '監控目標', //監控目標
  broadcast_data_type: '數據類型', //數據類型
  broadcast_uaps_range: 'UAPS範圍', //UAPS範圍
  broadcast_trigger_condition1: '條件', //觸發
  broadcast_trigger_condition2: '觸發條件', //觸發條件
  broadcast_continued_time: '持續時間(min)', //持續時間
  broadcast_effective_time: '有效時間', //有效時間
  broadcast_effective_starttime: '有效開始時間', //有效開始時間
  broadcast_effective_endtime: '有效結束時間', //有效結束時間
  broadcast_prompt_type: '提示類型', //提示類型
  broadcast_send_object: '發送對象', //發送對象
  broadcast_forever: '永久', //永久
  alerttype1: '閃爍', //閃爍
  alerttype2: '閃爍 & 聲音', //閃爍+聲音
  receiverworkshop: '全廠看板', //全廠看板
  more_than: '大於', //大於
  less_than: '小於', //小於

  role_list: '角色列表', //角色列表
  role_copy: '範例', //範例
  role_definition: '角色定義', //角色定義
  last_edit_time: '修改時間', //修改時間
  new_time: '建立時間', //建立時間
  role_used_num: '使用者數量', //使用者數量
  role_explanation: '說明', //說明

  occurTime: '發生時間', //角色列表
  continuedTime: '持續時間', //持續時間
  finishTime: '解除時間', //解除時間
  broadcast_lift_title: '確認解除', //確認解除
  broadcast_lift_body: '您是要確認解除這則推播', //您是要確認解除這則推播

  errortype: '異常類別', //異常類別
  errorname: '異常名稱', //異常類別
  relieveerror: '解除異常', //解除異常
  relieveallerror: '批量解除異常', //批量解除異常
  isfinisherror: '已解除', //已解除

  to_schedule_error1: '與現有排程時間衝突', //與現有排程時間衝突
  to_schedule_error2: '設備或模具時間衝突', //設備或模具時間衝突
  to_schedule_error3: '時間輸入錯誤', //時間輸入錯誤

  efficiency_mode: '效率指標', //效率指標
  stability_mode: '穩定指標', //穩定指標
  dashboard_mode: '看板模式', //看板模式

  role_R: '：讀、寫、刪 ', //R
  role_W: '：讀、寫', //W
  role_D: '：讀', //D
  role_X: '：無', //X

  clientName: '客戶名稱', //客戶名稱
  quality_onduty_error: '任務尚未結束，無法結束品檢', //'任務尚未結束，無法結束品檢'
  storage_onduty_error: '任務尚未結束，無法結束入庫', //任務尚未結束，無法結束入庫
  qualityOEE_onduty_error: '排程尚未結束，無法結束品檢', //'任務尚未結束，無法結束品檢'
  storageOEE_onduty_error: '排程尚未結束，無法結束入庫', //任務尚未結束，無法結束入庫

  task_error_report: '異常回報', //異常回報
  task_detail: '展開', //展開

  manufacture_date_error: '製造日期不得晚於今日', //製造日期不得晚於今日
  purchas_date_error: '製造日期不得晚於購買日期', //製造日期不得晚於購買日期
  toschedule_oee_dberror: '與下列排程時間衝突', //與下列排程時間衝突

  // plan_number: '計畫生產數量', //計畫生產數量
  actual_count: '實際生產數量', //實際生產數量
  // storage_number: '已入庫數量', //已入庫數量

  // plan_molds: '計畫生產模次', //計畫生產模次
  actual_molds: '實際生產模次', //實際生產模次

  dashboardstation_u: '負荷效率', //負荷效率
  dashboardstation_a: '稼動效率', //稼動效率
  dashboardstation_p: '產能效率', //產能效率
  dashboardstation_s: '穩定指標', //穩定指標
  dashboardstation_top: '上方數字 (紅色) : 整日', //上方數字(紅色) : 整日
  dashboardstation_bottom: '下方數字 (黑色) : 前五分鐘', //下方數字(黑色) : 前五分鐘

  storage_is_last_quality_not_end: '注意，品檢將一併結束', //注意，品檢將一併結束
  mold_cycletime_error: '模具週期時間錯誤',
  mold_cycletime_error1: '重複匯入模具編號',
  mold_cycletime_error2: '模具編號已存在',
  Mold_cycletime_can_not_be_0: '週期時間不得為0',
  employee_class_error: '與現有班別重複',
  machine_delete_mes1: '已綁定採集裝置,是否確認刪除設備?',

  report_red_yellow_mes: '紅色警示不得大於黃色警示', //紅色警示不得大於黃色警示
  report_daily_pdf: 'PDF 生產日報表', //PDF 生產日報表
  report_daily_xls: 'XLS 生產日報表', //XLS 生產日報表
  report_productivity: 'XLS 生產效率報表', //XLS 生產效率報表
  report_exception: 'XLS 異常報表', //XLS 異常報表
  report_quality: 'XLS 品質報表', //XLS 品質報表
  // report_week: '週報', //週報
  report_month_compare: '月報（比較每日）', //月報（比較每日）
  report_season_compare: '季報（比較每週）', //季報（比較每週）
  report_year_compare: '年報（比較每月）', //年報（比較每月）
  report_month: '月報', //月報
  report_season: '季報', //季報
  report_year: '年報', //年報

  report_type: '報表類型', //報表類型
  report_range: '時間範圍', //時間範圍
  report_error: '下載失敗', //下載失敗

  show_perpage_produce_1: '顯示第', //顯示第
  show_perpage_produce_2: '到第', //到第
  show_perpage_produce_3: '條紀錄，總共', //條紀錄，總共
  show_perpage_produce_4: '條紀錄，每頁顯示', //條紀錄，每頁顯示
  show_perpage_produce_5: '條紀錄', //條紀錄

  in_one_month_schedule: '1個月內', //1個月內~迄今
  in_three_month_schedule: '3個月內~迄今', //3個月內~迄今
  in_six_month_schedule: '6個月內~迄今', //6個月內~迄今
  in_twelve_month_schedule: '12個月內~迄今', //12個月內~迄今

  in_one_month: '1個月內', //1個月內
  in_three_month: '3個月內', //3個月內
  in_six_month: '6個月內', //6個月內
  in_twelve_month: '12個月內', //12個月內

  produce_time_type: '時間範圍', //時間範圍
  created_time: '創建時間', //創建時間
  data_not_complete: '資料未完善', //資料未完善
  task_end_cannot_earlier_start: '結束時間不得早於', //結束時間不得早於2020/08/18 12:00

  mold_import_ct_error: '週期時間不得小於等於0', //週期時間不得小於等於0
  mold_import_cavity_error: '模穴數不得小於等於0', //模穴數不得小於等於0
  mold_import_greenrange_error: '綠品參數值須介於0至0.9', //綠品參數值須介於0至0.9
  mold_import_yellowrange_error: '黃品參數值須大於綠品參數，且小於0.9', //黃品參數值須大於綠品參數，且小於0.9
  schedule_qty_error: '模次不得小於1', //模次不得小於1

  dashboard_schedule_start_time: '排程開始時間', //排程開始時間
  dashboard_schedule_end_time: '排程結束時間', //排程結束時間
  dashboard_qty: '已生產', //已生產
  dashboard_remaining_time: '剩餘時間', //剩餘時間
  dashboard_machine_maintenance: '設備保養中', //設備保養中
  dashboard_machine_shutdown: '設備停機中', //設備停機中
  original_text: '原有狀態文字', //原有狀態文字
  dashboard_title_placeholder: '字數1~4個字', //字數1~4個字
  dashboard_EG_shutdown: 'EG已關閉', //EG已關閉
  dashboard_data_shutdown: 'IoM即將關閉', //IoM即將關閉
  upper_bracket: '「',
  lower_bracket: '」',

  //夥伴管理
  partner_type: '夥伴類型',
  //場別管理
  basicsetting_workshoptype: '廠別管理',
  workshoptype: '廠別',
  workshoptype_number: '廠別編號',
  workshoptype_name: '廠別名稱',

  report_daily2_xls: 'XLS 生產日報表2', //XLS 生產日報表2
  machine_height: '寬(m)',
  machine_width: '長(m)',
  dashboard_workshop: '即時看板一', //即時看板一
  dashboard_workshop2: '即時看板二', //即時看板二
  dashboard_workshop3: '即時看板三', //即時看板三

  factory_factory_map: '廠區地圖', //廠區地圖
  factory_machine_map: '設備地圖', //設備地圖
  factory_tool: '工具列', //工具列
  factory_line: '線', //線
  factory_triangle: '三角形', //三角形
  factory_right_triangle: '直角三角形', //直角三角形
  factory_rectangle: '矩形', //矩形
  factory_round: '圓形', //圓形
  factory_text: '文字', //文字
  factory_door: '門', //門
  factory_grid: '格線', //格線
  factory_clear_grid: '去除網格', //去除網格
  factory_undo: '上一步', //上一步
  factory_redo: '下一步', //下一步
  factory_clear_all: '清除全部', //清除全部
  factory_save_file: '存檔', //存檔
  factory_read_file: '讀取', //讀取
  factory_download_png: '下載圖片', //下載圖片
  factory_complete: '完成', //完成
  factory_icon: '圖示', //圖示
  factory_brand: '品牌', //品牌
  factory_model: '型號', //型號
  factory_new_factory_map: '新增廠區地圖', //新增廠區地圖
  factory_edit_factory_map: '編輯廠區地圖', //編輯廠區地圖
  factory_factory_length: '廠區長度(m)', //廠區長度(米)
  factory_factory_width: '廠區寬度(m)', //廠區寬度(米)
  factory_factory_background_color: '廠區背景顏色', //廠區背景顏色
  factory_mode1: '模式一', //模式一
  factory_mode2: '模式二', //模式二
  factory_mode3: '模式三', //模式三
  factory_factory_height_error: '需輸入值3 ~ 100', //需輸入值3 ~ 100
  factory_factory_width_error: '需輸入值3 ~ 100', //需輸入值3 ~ 100
  factory_please_maintain: '請維護 ', //請維護
  factory_base_data: ' 基本資料', //基本資料
  factory_confirm_cover_map: '是否確認以當前畫面覆蓋存檔?', //是否確認以當前畫面覆蓋存檔?
  factory_map_exist: '目前已有廠區地圖', //目前已有廠區地圖
  factory_map_save_success: '廠區地圖: 存檔成功', //廠區地圖: 存檔成功
  factory_map_save_fail: '廠區地圖: 更新失敗', //廠區地圖: 更新失敗
  factory_map_new_fail: '廠區地圖: 新增失敗', //廠區地圖: 新增失敗
  factory_X_axis: '視窗 X 軸', //視窗 X 軸
  factory_Y_axis: '視窗 Y 軸', //視窗 Y 軸
  factory_map_read_success: '廠區地圖: 讀取成功', //廠區地圖: 讀取成功
  factory_map_not_setup_yet: ' 尚未建立廠區地圖', //尚未建立廠區地圖
  factory_machine_map_exist: '目前已有設備地圖', //目前已有設備地圖
  factory_machine_map_save_success: '設備地圖: 存檔成功', //設備地圖: 存檔成功
  factory_machine_map_save_fail: '設備地圖: 更新失敗', //設備地圖: 更新失敗
  factory_machine_map_new_fail: '設備地圖: 新增失敗', //設備地圖: 新增失敗
  factory_machine_map_read_success: '設備地圖: 讀取成功', //設備地圖: 讀取成功
  factory_machine_map_not_setup_yet: ' 尚未建立設備地圖', //尚未建立設備地圖

  analysis_time: '每日起迄時間', //每日起迄時間
  auto_relieve_notification: '自動解除推播', //自動解除推播
  manufacturing_order_example: '製令範例', //製令範例
  manufacturing_order_import: '製令匯入', //製令匯入
  import_error_type: '錯誤原因', //錯誤原因
  import_error_type_importerror: '輸入錯誤', //輸入錯誤
  import_error_data_type: '錯誤類別', //錯誤類別
  import_error_field: '欄位', //欄位
  import_requiredErr: '必填錯誤', //必填錯誤
  import_formatErr: '格式錯誤', //格式錯誤
  import_noMatchErr: '配對錯誤', //配對錯誤
  report_broadcast: 'XLS 推播報表', //XLS 推播報表
  please_select: '請選擇', //請選擇

  //排程甘特圖
  refresh: '重整', //重整
  time_unit: '時間單位', //時間單位
  one_hour: '一小時', //一小時
  two_hour: '二小時', //二小時
  tweleve_hour: '十二小時', //十二小時
  one_day: '一天', //一天
  gantt_sttime: '開始時間', //開始時間
  gantt_endtime: '結束時間', //結束時間
  working_time: '預計生產工時', //預計生產工時
  gantt_mes1: '無法編輯已開始之排程', //無法編輯已開始之排程
  gantt_mes2: '開始時間不得晚於或等於結束時間', //開始時間不得晚於或等於結束時間
  gantt_mes3: '結束時間不得早於或等於開始時間', //結束時間不得早於或等於開始時間
  gantt_mes4: '排程時間衝突', //排程時間衝突
  machine_conflict: '設備衝突', //設備衝突
  mold_conflict: '模具衝突', //模具衝突

  role_existed: '角色名稱已存在', //角色名稱已存在

  text_box: '文字方塊', //文字方塊
  no_objects_to_clear: '無物件可清除', //無物件可清除

  mold_cycletime_select: '模具週期時間', //模具週期時間

  // {{ $t('') }}
  // this.$t('')

  endtest: 'endtest' //endtest
}
