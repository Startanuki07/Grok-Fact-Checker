// ==UserScript==
// @name         Grok Fact Checker
// @name:zh-TW   Grok 事實查核器
// @name:zh-CN   Grok 事实核查器
// @name:ja      Grok ファクトチェッカー
// @name:ko      Grok 팩트체커
// @name:es      Grok Verificador de Datos
// @name:pt-BR   Grok Verificador de Fatos
// @name:fr      Grok Vérificateur de Faits
// @namespace    https://greasyfork.org/en/users/1575945-star-tanuki07
// @homepageURL  https://github.com/Startanuki07
// @version      1.6.4.0
// @license      MIT
// @author       Star_tanuki07
// @icon         https://abs.twimg.com/favicons/twitter.ico
// @match        https://twitter.com/*
// @match        https://x.com/*
// @match        https://www.threads.net/*
// @match        https://www.threads.com/*
// @match        https://bsky.app/*
// @match        https://mastodon.social/*
// @match        https://mastodon.online/*
// @match        https://mstdn.jp/*
// @match        https://mastodon.world/*
// @match        https://*.mastodon.social/*
// @match        https://gemini.google.com/*
// @match        https://chatgpt.com/*
// @match        https://www.meta.ai/*
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-end
// @description      Adds a 🤖 fact-check button next to posts on X (Twitter), Threads, Bluesky, and Mastodon. Choose from Grok, ChatGPT, Gemini, or Meta AI to check a post's claims in one click. Best suited for users who occasionally encounter unfamiliar news or claims and want a quick, discreet way to verify them.
// @description:zh-TW 在 X (Twitter)、Threads、Bluesky 與 Mastodon 的貼文旁加入 🤖 查核按鈕，可選擇 Grok、ChatGPT、Gemini 或 Meta AI，一鍵查核貼文內容。適合偶爾看到不確定的資訊、想低調快速查核的一般用戶。
// @description:zh-CN 在 X (Twitter)、Threads、Bluesky 与 Mastodon 的帖子旁添加 🤖 核查按钮，可选择 Grok、ChatGPT、Gemini 或 Meta AI，一键核查帖子内容。适合偶尔遇到存疑信息、想低调快速核查的普通用户。
// @description:ja    X (Twitter)・Threads・Bluesky・Mastodon の投稿に 🤖 ファクトチェックボタンを追加。Grok・ChatGPT・Gemini・Meta AI から選んでワンクリックで内容を確認できます。気になる情報をさりげなく手早く確認したい方に向いています。
// @description:ko    X (Twitter)・Threads・Bluesky・Mastodon 게시물에 🤖 팩트체크 버튼을 추가합니다. Grok・ChatGPT・Gemini・Meta AI 중에서 선택해 클릭 한 번으로 내용을 확인할 수 있습니다. 가끔 접하는 낯선 정보를 조용히 빠르게 확인하고 싶은 분에게 적합합니다.
// @description:es    Añade un botón 🤖 de verificación a las publicaciones en X (Twitter), Threads, Bluesky y Mastodon. Elige entre Grok, ChatGPT, Gemini o Meta AI para verificar el contenido con un clic. Ideal para quienes ocasionalmente ven información dudosa y quieren comprobarla de forma rápida y discreta.
// @description:pt-BR Adiciona um botão 🤖 de verificação às publicações no X (Twitter), Threads, Bluesky e Mastodon. Escolha entre Grok, ChatGPT, Gemini ou Meta AI para verificar o conteúdo com um clique. Ideal para quem ocasionalmente encontra informações duvidosas e quer verificá-las de forma rápida e discreta.
// @description:fr    Ajoute un bouton 🤖 de vérification aux publications sur X (Twitter), Threads, Bluesky et Mastodon. Choisissez Grok, ChatGPT, Gemini ou Meta AI pour vérifier le contenu en un clic. Idéal pour ceux qui rencontrent occasionnellement des informations douteuses et veulent les vérifier rapidement et discrètement.
// ==/UserScript==

(function () {
  "use strict";

  const escapeHtmlText = s => String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  const LANG_DICT = {
    "zh-TW": {
      name: "🇹🇼 繁體中文 (Traditional Chinese)",
      prompt:
        "請以繁體中文詳細查核以下貼文：分析所有聲明的真實性，指出錯誤、誤導或斷章取義之處，最後給出判斷（屬實／部分屬實／不實／無法核實）：\n",
      ui: {
        menu_auto: "⚙️ 預設自動送出",
        menu_lang: "⚙️ 設定面板",
        init: "環境初始化...",
        mode_direct: "🚀 直出模式 (自動送出)",
        mode_std: "🛡️ 標準模式 (僅填寫)",
        mode_fast: "🚀 急速直出模式啟用",
        privacy_check: "🔒 切換至隱私模式...",
        privacy_skip: "⚠️ 跳過隱私設定",
        privacy_skip_sub: "繼續執行...",
        writing: "📝 寫入指令...",
        sending: "🚀 正在送出...",
        done: "✅ 完成",
        done_manual: "✅ 指令已填入",
        done_manual_sub: "請確認後手動送出",
        error_btn: "⚠️ 找不到送出鈕",
        error_btn_sub: "請手動點擊",
        error_timeout: "⚠️ 逾時",
        error_timeout_sub: "找不到輸入框",
        error_script: "❌ 腳本錯誤",
        error_script_sub: "請查看控制台",
        toggle_focus: "切換專注模式",
        settings_title: "⚙️ 設定選項 / 切換語言",
        lang_section_title: "🌐 切換語言",
        custom_prompt_section: "🤖 自訂 AI 問答模版",
        custom_prompt_checkbox: "啟用自訂模版（取代預設查核指令）",
        custom_prompt_placeholder: "輸入自訂 AI 問答指令...\n\n（貼文網址將自動附加在末尾）",
        custom_prompt_save: "💾 儲存設定",
        custom_prompt_saved: "✅ 已儲存",
        highlight_url_checkbox: "填入後反白貼文網址（方便手動刪除）",
        curtain_animation_checkbox: "跳轉後顯示轉場動畫（黑幕進度提示）",
        unsaved_title: "有未儲存的變更",
        unsaved_save_close: "💾 儲存並關閉",
        unsaved_discard: "不儲存，直接關閉",
        unsaved_cancel: "取消",
        platform_section: "🤖 AI 平台選擇",
        platform_at_least_one: "⚠️ 至少需要選擇一個平台",
        open_fg: "前景開啟",
        open_bg: "背景開啟",
        btn_title: "點擊：查核 ／ 長按 1 秒：強制自動送出",
        close_btn: "❌ 關閉",
        tab_template: "模版",
        tab_platform: "平台",
        tab_language: "語言",
        custom_lang_section: "✏️ 自訂語言",
        custom_lang_loaded: "已載入：",
        custom_lang_none: "尚未載入自訂語言。",
        custom_lang_export: "📤 匯出模版",
        custom_lang_import: "📥 匯入翻譯",
        custom_lang_clear_title: "移除自訂語言",
        unsaved_footer_hint: "有未儲存的變更",
        meta_login_notice: "需登入 FB/IG",
        highlight_note: "⚠️ 非 Grok 平台（ChatGPT/Gemini/Meta AI）也支援反白，但準確度依各網站而定",
      },
    },
    "zh-CN": {
      name: "🇨🇳 简体中文 (Simplified Chinese)",
      prompt:
        "请以简体中文详细核查以下帖子：分析所有声明的真实性，指出错误、误导或断章取义之处，最后给出判断（属实／部分属实／不实／无法核实）：\n",
      ui: {
        menu_auto: "⚙️ 默认自动发送",
        menu_lang: "⚙️ 设置面板",
        init: "环境初始化...",
        mode_direct: "🚀 直出模式 (自动发送)",
        mode_std: "🛡️ 标准模式 (仅填写)",
        mode_fast: "🚀 急速直出模式启用",
        privacy_check: "🔒 切换至隐私模式...",
        privacy_skip: "⚠️ 跳过隐私设置",
        privacy_skip_sub: "继续执行...",
        writing: "📝 写入指令...",
        sending: "🚀 正在发送...",
        done: "✅ 完成",
        done_manual: "✅ 指令已填入",
        done_manual_sub: "请确认后手动发送",
        error_btn: "⚠️ 找不到发送按钮",
        error_btn_sub: "请手动点击",
        error_timeout: "⚠️ 超时",
        error_timeout_sub: "找不到输入框",
        error_script: "❌ 脚本错误",
        error_script_sub: "请查看控制台",
        toggle_focus: "切换专注模式",
        settings_title: "⚙️ 设置选项 / 切换语言",
        lang_section_title: "🌐 切换语言",
        custom_prompt_section: "🤖 自定义 AI 问答模板",
        custom_prompt_checkbox: "启用自定义模板（替代默认查核指令）",
        custom_prompt_placeholder: "输入自定义 AI 问答指令...\n\n（帖子链接将自动附加在末尾）",
        custom_prompt_save: "💾 保存设置",
        custom_prompt_saved: "✅ 已保存",
        highlight_url_checkbox: "填入后反白贴文链接（方便手动删除）",
        curtain_animation_checkbox: "跳转后显示转场动画（黑幕进度提示）",
        unsaved_title: "有未保存的更改",
        unsaved_save_close: "💾 保存并关闭",
        unsaved_discard: "不保存，直接关闭",
        unsaved_cancel: "取消",
        platform_section: "🤖 AI 平台选择",
        platform_at_least_one: "⚠️ 至少需要选择一个平台",
        open_fg: "前台打开",
        open_bg: "后台打开",
        btn_title: "点击：核查 ／ 长按 1 秒：强制自动发送",
        close_btn: "❌ 关闭",
        tab_template: "模板",
        tab_platform: "平台",
        tab_language: "语言",
        custom_lang_section: "✏️ 自定义语言",
        custom_lang_loaded: "已加载：",
        custom_lang_none: "尚未加载自定义语言。",
        custom_lang_export: "📤 导出模板",
        custom_lang_import: "📥 导入翻译",
        custom_lang_clear_title: "移除自定义语言",
        unsaved_footer_hint: "有未保存的更改",
        meta_login_notice: "需登录 FB/IG",
        highlight_note: "⚠️ 非 Grok 平台（ChatGPT/Gemini/Meta AI）也支持高亮，但准确度依各网站而定",
      },
    },
    en: {
      name: "🇺🇸 English",
      prompt:
        "Please thoroughly fact-check the following post in English: analyze all claims for accuracy, flag errors, misleading statements, or out-of-context framing, and give a verdict (TRUE / PARTIALLY TRUE / FALSE / UNVERIFIABLE):\n",
      ui: {
        menu_auto: "⚙️ Auto Send",
        menu_lang: "⚙️ Settings",
        init: "Initializing...",
        mode_direct: "🚀 Direct Mode (Auto Send)",
        mode_std: "🛡️ Standard Mode (Fill Only)",
        mode_fast: "🚀 Fast Direct Mode",
        privacy_check: "🔒 Switching to Privacy Mode...",
        privacy_skip: "⚠️ Skip Privacy Check",
        privacy_skip_sub: "Proceeding...",
        writing: "📝 Writing Command...",
        sending: "🚀 Sending...",
        done: "✅ Done",
        done_manual: "✅ Command Filled",
        done_manual_sub: "Please send manually",
        error_btn: "⚠️ Send Button Not Found",
        error_btn_sub: "Click manually",
        error_timeout: "⚠️ Timeout",
        error_timeout_sub: "Input box not found",
        error_script: "❌ Script Error",
        error_script_sub: "Check Console",
        toggle_focus: "Toggle Focus Mode",
        settings_title: "⚙️ Settings & Language",
        lang_section_title: "🌐 Select Language",
        custom_prompt_section: "🤖 Custom AI Prompt Template",
        custom_prompt_checkbox: "Use custom template (replaces default fact-check prompt)",
        custom_prompt_placeholder: "Enter your custom AI prompt...\n\n(Post URL will be appended automatically)",
        custom_prompt_save: "💾 Save Settings",
        custom_prompt_saved: "✅ Saved",
        highlight_url_checkbox: "Highlight post URL after filling (easy to delete manually)",
        curtain_animation_checkbox: "Show transition animation after redirect (overlay progress)",
        unsaved_title: "You have unsaved changes",
        unsaved_save_close: "💾 Save & Close",
        unsaved_discard: "Discard & Close",
        unsaved_cancel: "Cancel",
        platform_section: "🤖 AI Platform",
        platform_at_least_one: "⚠️ At least one platform must be selected",
        open_fg: "Foreground",
        open_bg: "Background",
        btn_title: "Click: Fact-check / Hold 1s: Force Auto-send",
        close_btn: "❌ Close",
        tab_template: "Template",
        tab_platform: "Platform",
        tab_language: "Language",
        custom_lang_section: "✏️ Custom Language",
        custom_lang_loaded: "Loaded: ",
        custom_lang_none: "No custom language loaded.",
        custom_lang_export: "📤 Export Template",
        custom_lang_import: "📥 Import Translation",
        custom_lang_clear_title: "Remove custom language",
        unsaved_footer_hint: "You have unsaved changes",
        meta_login_notice: "requires FB/IG login",
        highlight_note: "⚠️ Highlighting on non-Grok platforms (ChatGPT/Gemini/Meta AI) works, but accuracy may still vary by site.",
      },
    },
    ja: {
      name: "🇯🇵 日本語 (Japanese)",
      prompt:
        "以下の投稿を日本語で詳しくファクトチェックしてください。すべての主張の正確性を分析し、誤り・誤解を招く情報・文脈の歪曲を指摘した上で、判定（事実／部分的に事実／不正確／検証不可）を示してください：\n",
      ui: {
        menu_auto: "⚙️ 自動送信",
        menu_lang: "⚙️ 設定パネル",
        init: "初期化中...",
        mode_direct: "🚀 直接モード (自動送信)",
        mode_std: "🛡️ 標準モード (入力のみ)",
        mode_fast: "🚀 高速直接モード",
        privacy_check: "🔒 プライバシーモードへ切替...",
        privacy_skip: "⚠️ プライバシー設定をスキップ",
        privacy_skip_sub: "続行します...",
        writing: "📝 コマンド入力中...",
        sending: "🚀 送信中...",
        done: "✅ 完了",
        done_manual: "✅ 入力完了",
        done_manual_sub: "手動で送信してください",
        error_btn: "⚠️ 送信ボタンなし",
        error_btn_sub: "手動でクリック",
        error_timeout: "⚠️ タイムアウト",
        error_timeout_sub: "入力欄が見つかりません",
        error_script: "❌ スクリプトエラー",
        error_script_sub: "コンソールを確認",
        toggle_focus: "集中モード切替",
        settings_title: "⚙️ 設定 / 言語切替",
        lang_section_title: "🌐 言語を選択",
        custom_prompt_section: "🤖 カスタムAIプロンプト",
        custom_prompt_checkbox: "カスタムテンプレートを使用（デフォルト指示を置き換え）",
        custom_prompt_placeholder: "カスタムAIプロンプトを入力...\n\n（投稿URLは自動的に末尾に追加されます）",
        custom_prompt_save: "💾 設定を保存",
        custom_prompt_saved: "✅ 保存完了",
        highlight_url_checkbox: "入力後に投稿URLをハイライト（手動削除しやすくする）",
        curtain_animation_checkbox: "遷移後にトランジションアニメーションを表示（進捗オーバーレイ）",
        unsaved_title: "保存されていない変更があります",
        unsaved_save_close: "💾 保存して閉じる",
        unsaved_discard: "保存せずに閉じる",
        unsaved_cancel: "キャンセル",
        platform_section: "🤖 AIプラットフォーム選択",
        platform_at_least_one: "⚠️ 少なくとも1つのプラットフォームを選択してください",
        open_fg: "フォアグラウンド",
        open_bg: "バックグラウンド",
        btn_title: "クリック：ファクトチェック ／ 長押し 1秒：強制自動送信",
        close_btn: "❌ 閉じる",
        tab_template: "テンプレート",
        tab_platform: "プラットフォーム",
        tab_language: "言語",
        custom_lang_section: "✏️ カスタム言語",
        custom_lang_loaded: "読込済み：",
        custom_lang_none: "カスタム言語は読み込まれていません。",
        custom_lang_export: "📤 テンプレートを書き出す",
        custom_lang_import: "📥 翻訳を読み込む",
        custom_lang_clear_title: "カスタム言語を削除",
        unsaved_footer_hint: "保存されていない変更があります",
        meta_login_notice: "FB/IG のログインが必要",
        highlight_note: "⚠️ Grok 以外のプラットフォーム（ChatGPT/Gemini/Meta AI）でもハイライトは機能しますが、精度はサイトによって異なります。",
      },
    },
    ko: {
      name: "🇰🇷 한국어 (Korean)",
      prompt:
        "다음 게시물을 한국어로 자세히 팩트체크해 주세요. 모든 주장의 사실 여부를 분석하고, 오류·오해의 소지가 있는 정보·맥락 왜곡을 지적한 후 판정(사실／부분적 사실／허위／확인 불가)을 내려 주세요：\n",
      ui: {
        menu_auto: "⚙️ 자동 전송",
        menu_lang: "⚙️ 설정 패널",
        init: "초기화 중...",
        mode_direct: "🚀 직접 모드 (자동 전송)",
        mode_std: "🛡️ 표준 모드 (입력만)",
        mode_fast: "🚀 고속 직접 모드",
        privacy_check: "🔒 비공개 모드로 전환...",
        privacy_skip: "⚠️ 개인정보 설정 건너뛰기",
        privacy_skip_sub: "계속 진행...",
        writing: "📝 명령어 입력 중...",
        sending: "🚀 전송 중...",
        done: "✅ 완료",
        done_manual: "✅ 입력 완료",
        done_manual_sub: "수동으로 전송하세요",
        error_btn: "⚠️ 전송 버튼 없음",
        error_btn_sub: "수동 클릭 필요",
        error_timeout: "⚠️ 시간 초과",
        error_timeout_sub: "입력창을 찾을 수 없음",
        error_script: "❌ 스크립트 오류",
        error_script_sub: "콘솔 확인",
        toggle_focus: "집중 모드 전환",
        settings_title: "⚙️ 설정 / 언어 전환",
        lang_section_title: "🌐 언어 선택",
        custom_prompt_section: "🤖 커스텀 AI 프롬프트",
        custom_prompt_checkbox: "커스텀 템플릿 사용 (기본 팩트체크 명령 대체)",
        custom_prompt_placeholder: "커스텀 AI 프롬프트 입력...\n\n(게시물 URL이 자동으로 추가됩니다)",
        custom_prompt_save: "💾 설정 저장",
        custom_prompt_saved: "✅ 저장됨",
        highlight_url_checkbox: "입력 후 게시물 URL 강조 표시 (수동 삭제 용이)",
        curtain_animation_checkbox: "이동 후 전환 애니메이션 표시 (오버레이 진행 표시)",
        unsaved_title: "저장되지 않은 변경 사항이 있습니다",
        unsaved_save_close: "💾 저장 후 닫기",
        unsaved_discard: "저장 안 하고 닫기",
        unsaved_cancel: "취소",
        platform_section: "🤖 AI 플랫폼 선택",
        platform_at_least_one: "⚠️ 최소 하나의 플랫폼을 선택해야 합니다",
        open_fg: "포그라운드",
        open_bg: "백그라운드",
        btn_title: "클릭: 팩트체크 / 1초 길게 누르기: 강제 자동 전송",
        close_btn: "❌ 닫기",
        tab_template: "템플릿",
        tab_platform: "플랫폼",
        tab_language: "언어",
        custom_lang_section: "✏️ 사용자 지정 언어",
        custom_lang_loaded: "불러옴: ",
        custom_lang_none: "불러온 사용자 지정 언어가 없습니다.",
        custom_lang_export: "📤 템플릿 내보내기",
        custom_lang_import: "📥 번역 가져오기",
        custom_lang_clear_title: "사용자 지정 언어 삭제",
        unsaved_footer_hint: "저장되지 않은 변경 사항이 있습니다",
        meta_login_notice: "FB/IG 로그인 필요",
        highlight_note: "⚠️ Grok 외 플랫폼(ChatGPT/Gemini/Meta AI)에서도 하이라이트가 작동하지만, 정확도는 사이트마다 다를 수 있습니다.",
      },
    },
    es: {
      name: "🇪🇸 Español (Spanish)",
      prompt:
        "Por favor, verifica exhaustivamente la siguiente publicación en español: analiza la veracidad de todas las afirmaciones, señala errores, información engañosa o descontextualización, y emite un veredicto (VERDADERO / PARCIALMENTE VERDADERO / FALSO / NO VERIFICABLE):\n",
      ui: {
        menu_auto: "⚙️ Envío automático",
        menu_lang: "⚙️ Panel de configuración",
        init: "Inicializando...",
        mode_direct: "🚀 Modo directo (Envío automático)",
        mode_std: "🛡️ Modo estándar (Solo rellenar)",
        mode_fast: "🚀 Modo directo rápido",
        privacy_check: "🔒 Cambiando al modo privado...",
        privacy_skip: "⚠️ Omitir configuración de privacidad",
        privacy_skip_sub: "Continuando...",
        writing: "📝 Escribiendo comando...",
        sending: "🚀 Enviando...",
        done: "✅ Listo",
        done_manual: "✅ Comando escrito",
        done_manual_sub: "Por favor, envía manualmente",
        error_btn: "⚠️ Botón de envío no encontrado",
        error_btn_sub: "Haz clic manualmente",
        error_timeout: "⚠️ Tiempo de espera agotado",
        error_timeout_sub: "Cuadro de entrada no encontrado",
        error_script: "❌ Error de script",
        error_script_sub: "Revisa la consola",
        toggle_focus: "Alternar modo enfoque",
        settings_title: "⚙️ Configuración / Idioma",
        lang_section_title: "🌐 Seleccionar idioma",
        custom_prompt_section: "🤖 Plantilla AI personalizada",
        custom_prompt_checkbox: "Usar plantilla personalizada (reemplaza el prompt predeterminado)",
        custom_prompt_placeholder: "Ingresa tu prompt AI personalizado...\n\n(La URL de la publicación se añadirá automáticamente)",
        custom_prompt_save: "💾 Guardar configuración",
        custom_prompt_saved: "✅ Guardado",
        highlight_url_checkbox: "Resaltar URL de publicación al rellenar (fácil de eliminar manualmente)",
        curtain_animation_checkbox: "Mostrar animación de transición tras redirigir (superposición de progreso)",
        unsaved_title: "Hay cambios sin guardar",
        unsaved_save_close: "💾 Guardar y cerrar",
        unsaved_discard: "Cerrar sin guardar",
        unsaved_cancel: "Cancelar",
        platform_section: "🤖 Plataforma AI",
        platform_at_least_one: "⚠️ Se debe seleccionar al menos una plataforma",
        open_fg: "Primer plano",
        open_bg: "Segundo plano",
        btn_title: "Clic: Verificar / Mantener 1s: Envío automático forzado",
        close_btn: "❌ Cerrar",
        tab_template: "Plantilla",
        tab_platform: "Plataforma",
        tab_language: "Idioma",
        custom_lang_section: "✏️ Idioma personalizado",
        custom_lang_loaded: "Cargado: ",
        custom_lang_none: "No hay ningún idioma personalizado cargado.",
        custom_lang_export: "📤 Exportar plantilla",
        custom_lang_import: "📥 Importar traducción",
        custom_lang_clear_title: "Quitar idioma personalizado",
        unsaved_footer_hint: "Hay cambios sin guardar",
        meta_login_notice: "requiere inicio de sesión en FB/IG",
        highlight_note: "⚠️ El resaltado funciona en plataformas que no son Grok (ChatGPT/Gemini/Meta AI), pero la precisión puede variar según el sitio.",
      },
    },
    "pt-BR": {
      name: "🇧🇷 Português BR (Portuguese)",
      prompt:
        "Por favor, verifique detalhadamente os fatos da seguinte publicação em português: analise a veracidade de todas as afirmações, sinalize erros, informações enganosas ou contexto distorcido, e emita um veredicto (VERDADEIRO / PARCIALMENTE VERDADEIRO / FALSO / NÃO VERIFICÁVEL):\n",
      ui: {
        menu_auto: "⚙️ Envio automático",
        menu_lang: "⚙️ Painel de configurações",
        init: "Inicializando...",
        mode_direct: "🚀 Modo direto (Envio automático)",
        mode_std: "🛡️ Modo padrão (Apenas preencher)",
        mode_fast: "🚀 Modo direto rápido",
        privacy_check: "🔒 Mudando para o modo privado...",
        privacy_skip: "⚠️ Ignorar configuração de privacidade",
        privacy_skip_sub: "Continuando...",
        writing: "📝 Escrevendo comando...",
        sending: "🚀 Enviando...",
        done: "✅ Concluído",
        done_manual: "✅ Comando preenchido",
        done_manual_sub: "Por favor, envie manualmente",
        error_btn: "⚠️ Botão de envio não encontrado",
        error_btn_sub: "Clique manualmente",
        error_timeout: "⚠️ Tempo esgotado",
        error_timeout_sub: "Caixa de entrada não encontrada",
        error_script: "❌ Erro de script",
        error_script_sub: "Verifique o console",
        toggle_focus: "Alternar modo foco",
        settings_title: "⚙️ Configurações / Idioma",
        lang_section_title: "🌐 Selecionar idioma",
        custom_prompt_section: "🤖 Modelo AI personalizado",
        custom_prompt_checkbox: "Usar modelo personalizado (substitui o prompt padrão)",
        custom_prompt_placeholder: "Digite seu prompt AI personalizado...\n\n(A URL da publicação será adicionada automaticamente)",
        custom_prompt_save: "💾 Salvar configurações",
        custom_prompt_saved: "✅ Salvo",
        highlight_url_checkbox: "Destacar URL da publicação ao preencher (fácil de excluir manualmente)",
        curtain_animation_checkbox: "Mostrar animação de transição após redirecionar (sobreposição de progresso)",
        unsaved_title: "Há alterações não salvas",
        unsaved_save_close: "💾 Salvar e fechar",
        unsaved_discard: "Fechar sem salvar",
        unsaved_cancel: "Cancelar",
        platform_section: "🤖 Plataforma AI",
        platform_at_least_one: "⚠️ Pelo menos uma plataforma deve ser selecionada",
        open_fg: "Primeiro plano",
        open_bg: "Segundo plano",
        btn_title: "Clique: Verificar / Segurar 1s: Envio automático forçado",
        close_btn: "❌ Fechar",
        tab_template: "Modelo",
        tab_platform: "Plataforma",
        tab_language: "Idioma",
        custom_lang_section: "✏️ Idioma personalizado",
        custom_lang_loaded: "Carregado: ",
        custom_lang_none: "Nenhum idioma personalizado carregado.",
        custom_lang_export: "📤 Exportar modelo",
        custom_lang_import: "📥 Importar tradução",
        custom_lang_clear_title: "Remover idioma personalizado",
        unsaved_footer_hint: "Há alterações não salvas",
        meta_login_notice: "requer login no FB/IG",
        highlight_note: "⚠️ O destaque funciona em plataformas fora do Grok (ChatGPT/Gemini/Meta AI), mas a precisão pode variar de acordo com o site.",
      },
    },
    fr: {
      name: "🇫🇷 Français (French)",
      prompt:
        "Veuillez vérifier en détail les informations de la publication suivante en français : analysez la véracité de toutes les affirmations, signalez les erreurs, informations trompeuses ou éléments sortis de leur contexte, et donnez un verdict (VRAI / PARTIELLEMENT VRAI / FAUX / NON VÉRIFIABLE) :\n",
      ui: {
        menu_auto: "⚙️ Envoi automatique",
        menu_lang: "⚙️ Panneau de configuration",
        init: "Initialisation...",
        mode_direct: "🚀 Mode direct (Envoi automatique)",
        mode_std: "🛡️ Mode standard (Remplir seulement)",
        mode_fast: "🚀 Mode direct rapide",
        privacy_check: "🔒 Passage en mode privé...",
        privacy_skip: "⚠️ Ignorer la confidentialité",
        privacy_skip_sub: "Poursuite en cours...",
        writing: "📝 Écriture de la commande...",
        sending: "🚀 Envoi en cours...",
        done: "✅ Terminé",
        done_manual: "✅ Commande saisie",
        done_manual_sub: "Veuillez envoyer manuellement",
        error_btn: "⚠️ Bouton d'envoi introuvable",
        error_btn_sub: "Cliquez manuellement",
        error_timeout: "⚠️ Délai dépassé",
        error_timeout_sub: "Zone de saisie introuvable",
        error_script: "❌ Erreur de script",
        error_script_sub: "Vérifiez la console",
        toggle_focus: "Basculer le mode concentration",
        settings_title: "⚙️ Paramètres / Langue",
        lang_section_title: "🌐 Sélectionner la langue",
        custom_prompt_section: "🤖 Modèle AI personnalisé",
        custom_prompt_checkbox: "Utiliser un modèle personnalisé (remplace le prompt par défaut)",
        custom_prompt_placeholder: "Entrez votre prompt AI personnalisé...\n\n(L'URL de la publication sera ajoutée automatiquement)",
        custom_prompt_save: "💾 Enregistrer les paramètres",
        custom_prompt_saved: "✅ Enregistré",
        highlight_url_checkbox: "Surligner l'URL de la publication après remplissage (suppression manuelle facile)",
        curtain_animation_checkbox: "Afficher l'animation de transition après redirection (superposition de progression)",
        unsaved_title: "Des modifications non enregistrées existent",
        unsaved_save_close: "💾 Enregistrer et fermer",
        unsaved_discard: "Fermer sans enregistrer",
        unsaved_cancel: "Annuler",
        platform_section: "🤖 Plateforme AI",
        platform_at_least_one: "⚠️ Au moins une plateforme doit être sélectionnée",
        open_fg: "Premier plan",
        open_bg: "Arrière-plan",
        btn_title: "Clic : Vérifier / Maintenir 1s : Envoi automatique forcé",
        close_btn: "❌ Fermer",
        tab_template: "Modèle",
        tab_platform: "Plateforme",
        tab_language: "Langue",
        custom_lang_section: "✏️ Langue personnalisée",
        custom_lang_loaded: "Chargé : ",
        custom_lang_none: "Aucune langue personnalisée chargée.",
        custom_lang_export: "📤 Exporter le modèle",
        custom_lang_import: "📥 Importer la traduction",
        custom_lang_clear_title: "Supprimer la langue personnalisée",
        unsaved_footer_hint: "Des modifications non enregistrées existent",
        meta_login_notice: "connexion FB/IG requise",
        highlight_note: "⚠️ La surbrillance fonctionne sur les plateformes autres que Grok (ChatGPT/Gemini/Meta AI), mais la précision peut varier selon le site.",
      },
    },
  };

  const LangSystem = {
    _currentKey: GM_getValue("cfg_lang_code", null),

    getKey: () => LangSystem._currentKey,
    setKey: (code) => {
      LangSystem._syncCustomIntoDict();
      if (!LANG_DICT[code]) return;
      LangSystem._currentKey = code;
      GM_setValue("cfg_lang_code", code);
    },

    getCustom: () => {
      try {
        const raw = GM_getValue("cfg_custom_lang", "");
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.ui === "object" && typeof parsed.prompt === "string") {
          return parsed;
        }
      } catch (e) {}
      return null;
    },

    _syncCustomIntoDict: () => {
      const custom = LangSystem.getCustom();
      if (custom) {
        LANG_DICT.custom = {
          name:   "🈺 " + (custom.langName || "Custom"),
          prompt: custom.prompt,
          ui:     custom.ui,
        };
      } else {
        delete LANG_DICT.custom;
      }
    },

    getCurrent: () => {
      LangSystem._syncCustomIntoDict();
      const code = LangSystem.getKey();
      if (code && LANG_DICT[code]) return LANG_DICT[code];

      const browserLang = navigator.language.toLowerCase();
      if (browserLang.includes("zh-cn") || browserLang.includes("zh-hans")) return LANG_DICT["zh-CN"];
      if (browserLang.includes("zh")) return LANG_DICT["zh-TW"];
      if (browserLang.includes("ja")) return LANG_DICT["ja"];
      if (browserLang.includes("ko")) return LANG_DICT["ko"];
      if (browserLang.includes("pt")) return LANG_DICT["pt-BR"];
      if (browserLang.includes("fr")) return LANG_DICT["fr"];
      if (browserLang.includes("es")) return LANG_DICT["es"];
      if (browserLang.includes("en")) return LANG_DICT["en"];

      return LANG_DICT["en"];
    },

    getText: (key) => {
      const dict = LangSystem.getCurrent();
      return dict.ui[key] || LANG_DICT["zh-TW"].ui[key] || key;
    },

    getPrompt: () => {
      if (GM_getValue("cfg_custom_prompt_enabled", false)) {
        const custom = GM_getValue("cfg_custom_prompt", "").trim();
        if (custom) return custom + "\n";
      }
      return LangSystem.getCurrent().prompt;
    },
  };

  const GROK_URL = "https://x.com/i/grok";

  const ICONS = {
    ROBOT:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7h10a2 2 0 0 1 2 2v1l1 1v3l-1 1v3a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-3l-1 -1v-3l1 -1v-1a2 2 0 0 1 2 -2z" /><path d="M10 16h4" /><circle cx="8.5" cy="11.5" r=".5" fill="currentColor" /><circle cx="15.5" cy="11.5" r=".5" fill="currentColor" /><path d="M9 7l-1 -4" /><path d="M15 7l1 -4" /></svg>',
    SENDING:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="#1d9bf0" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 14l11 -11" /><path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" /></svg>',
    ROCKET:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="#f91880" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 13a8 8 0 0 1 7 7a6 6 0 0 0 3 -5a9 9 0 0 0 6 -8a3 3 0 0 0 -3 -3a9 9 0 0 0 -8 6a6 6 0 0 0 -5 3" /><path d="M7 14a6 6 0 0 0 -3 8" /><path d="M14 7a6 6 0 0 0 8 -3" /></svg>',
    EYE_OPEN:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>',
    EYE_OFF:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" /><path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 3.15 -3.692 5.252 -4.753m3.243 -.745c.168 -.006 .337 -.006 .505 .006c3.6 0 6.6 2 9 6c-.632 1.053 -1.333 1.944 -2.103 2.673" /><path d="M3 3l18 18" /></svg>',
    CHATGPT:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z" /><path d="M9.5 9h5" /><path d="M9.5 13h3.5" /></svg>',
    GEMINI:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C11.45 8.05 8.05 11.45 2 12C8.05 12.55 11.45 15.95 12 22C12.55 15.95 15.95 12.55 22 12C15.95 11.45 12.55 8.05 12 2Z"/></svg>',
    META:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6.5 8.5C4 8.5 2.5 10.5 2.5 12.5S4 16.5 6.5 16.5c2.8 0 4-2 5.5-4.5m0 0c1.5-2.5 2.7-4.5 5.5-4.5 2.5 0 4 2 4 4.5s-1.5 4.5-4 4.5c-2.8 0-4-2-5.5-4.5"/></svg>',
  };
  ICONS.GROK = ICONS.ROBOT;

  const PLATFORM_DEFS = [
    { key: "grok",    name: "Grok",    color: "#1d9bf0" },
    { key: "chatgpt", name: "ChatGPT", color: "#10a37f" },
    { key: "gemini",  name: "Gemini",  color: "#8b5cf6" },
    { key: "meta",    name: "Meta AI",    color: "#0866ff" },
  ];

  function registerMenus() {
    GM_registerMenuCommand(LangSystem.getText("menu_lang"), () => {
      showLanguageSelectionUI();
    });
    const isAutoSend = GM_getValue("cfg_auto_send", false);
    const autoSendText = isAutoSend ? "✅ ON" : "❌ OFF";
    GM_registerMenuCommand(
      `${LangSystem.getText("menu_auto")}: ${autoSendText}`,
      () => {
        GM_setValue("cfg_auto_send", !isAutoSend);
        location.reload();
      },
    );
  }

  GM_addStyle(`
        .my-grok-robot-btn {
            display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px;
            border-radius: 9999px; background-color: transparent; color: rgb(113, 118, 123);
            cursor: pointer; transition: all 0.2s; margin-right: 8px; border: none; outline: none;
            user-select: none; -webkit-user-select: none;
        }
        .threads-grok-btn { margin-right: 0; margin-left: 8px; color: inherit; }
        .my-grok-robot-btn:hover { background-color: rgba(29, 155, 240, 0.1); color: rgb(29, 155, 240); }
        .my-grok-robot-btn.charging { color: #f91880; background-color: rgba(249, 24, 128, 0.1); transform: scale(1.15); }
        .my-grok-robot-btn svg { width: 20px; height: 20px; }
        
        .my-grok-robot-btn.tm-native-sized { width: auto !important; height: auto !important; }

        .grok-curtain-overlay {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background-color: rgba(0, 0, 0, 0.88);
            z-index: 2147483647; display: flex; align-items: center; justify-content: center;
            transition: opacity 0.3s ease-out; opacity: 1; pointer-events: auto; flex-direction: column; gap: 10px;
        }
        .grok-curtain-fade-out { opacity: 0; pointer-events: none; }
        .grok-curtain-text {
            color: #ffffff; font-family: sans-serif; font-size: 22px; font-weight: 500;
            letter-spacing: 1.5px; text-shadow: 0 2px 10px rgba(0,0,0,0.5); text-align: center;
        }
        .grok-curtain-sub { color: #8899a6; font-size: 14px; margin-top: 5px; }

        .grok-lang-panel {
            background: #16181c; border: 1px solid #2f3336; border-radius: 16px;
            padding: 0; width: 510px; height: 710px; max-width: 94vw; max-height: 94vh;
            display: flex; flex-direction: column;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            overflow: hidden; transform: translateZ(0);
        }
        .grok-lang-title { color: #e7e9ea; font-size: 16px; font-weight: 700; margin: 0; }
        .grok-lang-btn {
            background: transparent; border: 1px solid #536471; color: #e7e9ea;
            padding: 10px; border-radius: 8px; cursor: pointer; transition: all 0.2s; font-size: 14px;
            text-align: left;
        }
        .grok-lang-btn:hover { background: rgba(29, 155, 240, 0.1); border-color: #1d9bf0; color: #1d9bf0; }
        .grok-lang-btn.active { background: #1d9bf0; border-color: #1d9bf0; color: white; }

        .grok-custom-checkbox-row {
            display: flex; align-items: center; gap: 10px; cursor: pointer;
            color: #e7e9ea; font-size: 13px; user-select: none; padding: 6px 0;
        }
        .grok-custom-checkbox-row input[type="checkbox"] {
            width: 16px; height: 16px; accent-color: #1d9bf0; cursor: pointer; flex-shrink: 0;
        }
        .grok-custom-textarea {
            width: 100%; min-height: 100px; max-height: 200px;
            background: #0d1117; border: 1px solid #536471; border-radius: 8px;
            color: #e7e9ea; font-size: 13px; line-height: 1.5; padding: 10px;
            resize: vertical; font-family: inherit; box-sizing: border-box;
            transition: border-color 0.2s;
        }
        .grok-custom-textarea:focus { outline: none; border-color: #1d9bf0; }
        .grok-custom-textarea::placeholder { color: #536471; }
        .grok-save-btn {
            background: #1d9bf0; border: none; color: white;
            padding: 10px; border-radius: 8px; cursor: pointer;
            font-size: 14px; font-weight: 600; transition: background 0.2s; width: 100%;
        }
        .grok-save-btn:hover { background: #1a8cd8; }
        .grok-save-btn.saved { background: #00ba7c; }
        .grok-save-btn:disabled { background: #2f3336; color: #536471; cursor: not-allowed; }

        .gfc-panel-header {
            display: flex; align-items: center; justify-content: space-between;
            padding: 16px 20px 12px; flex-shrink: 0; border-bottom: 1px solid #2f3336;
        }
        .gfc-panel-close {
            background: transparent; border: none; color: #8899a6; cursor: pointer;
            width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center;
            justify-content: center; transition: all 0.15s; flex-shrink: 0; font-size: 16px; padding: 0;
        }
        .gfc-panel-close:hover { background: rgba(244, 33, 46, 0.12); color: #f4212e; }

        .gfc-tab-bar {
            display: flex; gap: 4px; padding: 8px 12px 0; flex-shrink: 0;
        }
        .gfc-tab-btn {
            flex: 1; background: transparent; border: none; color: #8899a6;
            padding: 10px 8px 12px; font-size: 13px; font-weight: 600; cursor: pointer;
            display: flex; flex-direction: column; align-items: center; gap: 4px;
            border-bottom: 2px solid transparent; transition: color 0.15s, border-color 0.15s;
        }
        .gfc-tab-btn span.gfc-tab-icon { font-size: 16px; line-height: 1; }
        .gfc-tab-btn:hover { color: #e7e9ea; }
        .gfc-tab-btn.active { color: #1d9bf0; border-bottom-color: #1d9bf0; }

        .gfc-tab-body {
            padding: 16px 20px 20px; overflow-y: auto; overflow-x: hidden;
            display: flex; flex-direction: column; gap: 14px; flex: 1;
        }
        .gfc-tab-body::-webkit-scrollbar { width: 5px; }
        .gfc-tab-body::-webkit-scrollbar-track { background: transparent; }
        .gfc-tab-body::-webkit-scrollbar-thumb { background: #536471; border-radius: 3px; }
        .gfc-tab-pane { display: none; flex-direction: column; gap: 14px; }
        .gfc-tab-pane.active {
            display: flex;
            animation: gfc-pane-fade-in 0.22s ease-out;
        }
        @keyframes gfc-pane-fade-in {
            from { opacity: 0; transform: translateY(6px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        .gfc-card {
            background: #1c1f23; border: 1px solid #2f3336; border-radius: 12px;
            padding: 14px; display: flex; flex-direction: column; gap: 10px;
        }
        .gfc-card-title {
            display: flex; align-items: center; gap: 8px; color: #e7e9ea;
            font-size: 13px; font-weight: 700;
        }
        .gfc-card-hint { color: #8899a6; font-size: 11px; line-height: 1.6; }

        .gfc-collapse {
            overflow: hidden; max-height: 0; opacity: 0; margin-top: 0;
            transition: max-height 0.25s ease, opacity 0.2s ease, margin-top 0.25s ease;
        }
        .gfc-collapse.open { max-height: 240px; opacity: 1; margin-top: 4px; }

        .gfc-plat-row {
            display: flex; align-items: center; gap: 10px; padding: 8px 4px;
            border-radius: 8px; transition: background 0.12s, opacity 0.25s ease, filter 0.25s ease;
        }
        .gfc-plat-row:hover { background: rgba(255,255,255,0.04); }
        .gfc-plat-row input[type="checkbox"] { width: 16px; height: 16px; cursor: pointer; flex-shrink: 0; }
        .gfc-plat-row-name { flex: 1; }
        .gfc-plat-open-select {
            background: #16181c; border: 1px solid #2f3336; color: #e7e9ea;
            font-size: 12px; padding: 5px 8px; border-radius: 6px; cursor: pointer;
            flex-shrink: 0; transition: border-color 0.15s;
        }
        .gfc-plat-open-select:hover { border-color: #536471; }
        .gfc-plat-open-select:focus { outline: none; border-color: #1d9bf0; }

        .gfc-tab-btn { position: relative; }
        .gfc-new-badge {
            position: absolute; top: 2px; right: 4px; width: 8px; height: 8px;
            border-radius: 50%; background: #f4212e; pointer-events: none;
            animation: gfc-new-pulse 1.6s ease-in-out infinite;
        }
        @keyframes gfc-new-pulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(244,33,46,0.5); }
            50%      { box-shadow: 0 0 0 4px rgba(244,33,46,0); }
        }
        
        .gfc-new-badge-inline {
            display: inline-block; width: 8px; height: 8px; border-radius: 50%;
            background: #f4212e; flex-shrink: 0; pointer-events: none;
            animation: gfc-new-pulse 1.6s ease-in-out infinite;
        }

        .gfc-lang-grid {
            display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
        }
        .gfc-lang-cell {
            background: transparent; border: 1px solid #536471; color: #e7e9ea;
            padding: 10px 8px; border-radius: 8px; cursor: pointer; transition: all 0.15s;
            font-size: 13px; text-align: left; line-height: 1.3;
        }
        .gfc-lang-cell:hover { border-color: #1d9bf0; color: #1d9bf0; background: rgba(29,155,240,0.08); }
        .gfc-lang-cell.selected { background: #1d9bf0; border-color: #1d9bf0; color: white; }

        .gfc-panel-footer {
            padding: 12px 20px; border-top: 1px solid #2f3336; flex-shrink: 0;
            display: flex; gap: 10px; align-items: center;
        }
        .gfc-unsaved-dot {
            width: 8px; height: 8px; border-radius: 50%; background: #ffd400; flex-shrink: 0;
            opacity: 0; transform: scale(0.4);
            transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .gfc-unsaved-dot.visible { opacity: 1; transform: scale(1); }

        .gfc-plat-drop {
            background: #16181c; border: 1px solid #2f3336; border-radius: 12px;
            padding: 6px; display: flex; flex-direction: column; gap: 2px;
            box-shadow: 0 -4px 24px rgba(0,0,0,0.6); min-width: 168px;
            z-index: 2147483647; transform: translateZ(0);
            animation: gfc-drop-in 0.15s ease-out;
        }
        @keyframes gfc-drop-in {
            from { opacity: 0; transform: translateY(6px) translateZ(0); }
            to   { opacity: 1; transform: translateY(0)   translateZ(0); }
        }
        .gfc-plat-item {
            display: flex; align-items: center; gap: 10px;
            background: transparent; border: none; color: #e7e9ea;
            padding: 9px 12px; border-radius: 8px; cursor: pointer;
            font-size: 14px; font-weight: 500; transition: background 0.12s;
            width: 100%; text-align: left;
        }
        .gfc-plat-item:hover { background: rgba(255,255,255,0.08); }
        .gfc-plat-item-icon { width: 18px; height: 18px; display: inline-flex; flex-shrink: 0; }
        .gfc-plat-item-icon svg { width: 18px; height: 18px; }

        .grok-unsaved-dialog {
            position: absolute; inset: 0; background: rgba(0,0,0,0.75);
            border-radius: 16px; display: flex; flex-direction: column;
            align-items: center; justify-content: center; gap: 12px; padding: 24px;
            z-index: 10; animation: gfc-dialog-fade-in 0.18s ease-out;
        }
        @keyframes gfc-dialog-fade-in {
            from { opacity: 0; transform: scale(0.97); }
            to   { opacity: 1; transform: scale(1); }
        }
        .grok-unsaved-title {
            color: #e7e9ea; font-size: 15px; font-weight: 600; text-align: center;
        }
        .grok-unsaved-btn {
            width: 100%; padding: 10px; border-radius: 8px; border: none;
            cursor: pointer; font-size: 14px; font-weight: 600; transition: opacity 0.2s;
        }
        .grok-unsaved-btn:hover { opacity: 0.85; }
        .grok-unsaved-btn.primary { background: #1d9bf0; color: white; }
        .grok-unsaved-btn.danger  { background: transparent; color: #f4212e; border: 1px solid #f4212e; }
        .grok-unsaved-btn.ghost   { background: transparent; color: #8899a6; border: 1px solid #536471; }
        .grok-unsaved-row { display: flex; gap: 10px; width: 100%; }
        .grok-unsaved-row .grok-unsaved-btn { width: auto; flex: 1; }

        .grok-sidebar-toggle {
            position: fixed; bottom: 20px; left: 20px; width: 40px; height: 40px;
            background-color: rgba(21, 32, 43, 0.8); border: 1px solid rgba(113, 118, 123, 0.3);
            border-radius: 50%; color: #eff3f4; display: flex; align-items: center; justify-content: center;
            cursor: pointer; z-index: 9999; transition: all 0.2s; box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            opacity: 0; pointer-events: none;
        }
        .grok-sidebar-toggle:hover { background-color: rgba(29, 155, 240, 0.9); transform: scale(1.1); opacity: 1 !important; pointer-events: auto !important; }
        .grok-sidebar-toggle.visible { opacity: 1; pointer-events: auto; }
        .grok-sidebar-toggle svg { width: 22px; height: 22px; }

        body.grok-focus-mode header[role="banner"],
        body.grok-focus-mode [data-testid="sidebarColumn"],
        body.grok-focus-mode div[data-testid="TopNavBar"] { display: none !important; }
        body.grok-focus-mode main[role="main"] { align-items: center !important; width: 100% !important; margin: 0 !important; padding: 0 !important; }
        body.grok-focus-mode div[data-testid="primaryColumn"] { max-width: 900px !important; width: 100% !important; margin: 0 auto !important; border: none !important; }
    `);

  function findAny(selectors, root = document) {
    for (const selector of selectors) {
      const el = root.querySelector(selector);
      if (el) return el;
    }
    return null;
  }

  const _adsHidden = new WeakSet();
  function removeGrokAds() {
    const keywords = [
      "建立重複工作",
      "在 grok.com 上存取更多功能",
      "grok.com",
      "Get more with grok.com",
    ];
    const candidates = document.querySelectorAll('span, div[dir="ltr"]');
    candidates.forEach((el) => {
      if (!el.innerText) return;
      if (keywords.some((kw) => el.innerText.includes(kw))) {
        const btn = el.closest("button");
        if (btn && !_adsHidden.has(btn)) {
          btn.style.display = "none";
          _adsHidden.add(btn);
        }
      }
    });
  }

  function createSidebarToggle() {
    if (document.querySelector(".grok-sidebar-toggle")) return;
    const btn = document.createElement("div");
    btn.className = "grok-sidebar-toggle";
    btn.innerHTML = ICONS.EYE_OPEN;
    btn.title = LangSystem.getText("toggle_focus");
    let isFocusMode = false;
    btn.addEventListener("click", () => {
      isFocusMode = !isFocusMode;
      if (isFocusMode) {
        document.body.classList.add("grok-focus-mode");
        btn.innerHTML = ICONS.EYE_OFF;
      } else {
        document.body.classList.remove("grok-focus-mode");
        btn.innerHTML = ICONS.EYE_OPEN;
      }
    });
    document.body.appendChild(btn);
  }

  let curtainElement = null;
  let curtainMsgElement = null;
  let curtainSubElement = null;
  function isCurtainEnabled() {
    return GM_getValue("cfg_curtain_enabled", true);
  }

  function showCurtain(initialText, subText = "") {
    if (!isCurtainEnabled()) return;
    const old = document.querySelector(".grok-curtain-overlay");
    if (old) old.parentNode?.removeChild(old);

    curtainElement = document.createElement("div");
    curtainElement.className = "grok-curtain-overlay";
    curtainMsgElement = document.createElement("div");
    curtainMsgElement.className = "grok-curtain-text";
    curtainMsgElement.textContent = initialText;
    curtainSubElement = document.createElement("div");
    curtainSubElement.className = "grok-curtain-sub";
    curtainSubElement.textContent = subText;
    curtainElement.appendChild(curtainMsgElement);
    curtainElement.appendChild(curtainSubElement);
    document.body.appendChild(curtainElement);

    setTimeout(() => hideCurtain(0), 1800);
  }

  function updateCurtainText(text, sub = null) {
    if (!isCurtainEnabled()) return;
    if (curtainMsgElement) curtainMsgElement.textContent = text;
    if (sub !== null && curtainSubElement) curtainSubElement.textContent = sub;
  }

  function hideCurtain(delay = 500) {
    if (!isCurtainEnabled()) return;
    if (curtainElement) {
      setTimeout(() => {
        if (curtainElement)
          curtainElement.classList.add("grok-curtain-fade-out");
      }, delay);
      setTimeout(() => {
        if (curtainElement && curtainElement.parentNode) {
          curtainElement.parentNode.removeChild(curtainElement);
          curtainElement = null;
          curtainMsgElement = null;
          curtainSubElement = null;
        }
      }, delay + 350);
    }
  }

  function showLanguageSelectionUI(initialTab = "template") {
    if (document.querySelector(".grok-curtain-overlay")) {
      const existing = document.querySelector(".grok-curtain-overlay");
      existing.parentNode.removeChild(existing);
    }
    const overlay = document.createElement("div");
    overlay.className = "grok-curtain-overlay";
    const panel = document.createElement("div");
    panel.className = "grok-lang-panel";
    panel.style.position = "relative";

    const header = document.createElement("div");
    header.className = "gfc-panel-header";
    const title = document.createElement("div");
    title.className = "grok-lang-title";
    title.innerText = LangSystem.getText("settings_title");
    header.appendChild(title);
    const headerCloseBtn = document.createElement("button");
    headerCloseBtn.className = "gfc-panel-close";
    headerCloseBtn.innerHTML = "✕";
    headerCloseBtn.title = LangSystem.getText("close_btn");
    header.appendChild(headerCloseBtn);
    panel.appendChild(header);

    const TABS = [
      { key: "template", icon: "🤖", labelKey: "tab_template" },
      { key: "platform",  icon: "🌐", labelKey: "tab_platform" },
      { key: "language",  icon: "🔤", labelKey: "tab_language" },
    ];
    const tabBar = document.createElement("div");
    tabBar.className = "gfc-tab-bar";
    const tabBtns = {};
    TABS.forEach(({ key, icon, labelKey }) => {
      const tabBtn = document.createElement("button");
      tabBtn.className = "gfc-tab-btn";
      if (key === initialTab) tabBtn.classList.add("active");
      tabBtn.innerHTML = `<span class="gfc-tab-icon">${icon}</span><span>${LangSystem.getText(labelKey)}</span>`;
      if (key === "platform" && isFeatureNew("open_behavior")) {
        const badge = document.createElement("span");
        badge.className = "gfc-new-badge";
        tabBtn.appendChild(badge);
      }
      tabBtn.onclick = () => switchTab(key);
      tabBar.appendChild(tabBtn);
      tabBtns[key] = tabBtn;
    });
    panel.appendChild(tabBar);

    const tabBody = document.createElement("div");
    tabBody.className = "gfc-tab-body";
    const tabPanes = {};
    TABS.forEach(({ key }) => {
      const pane = document.createElement("div");
      pane.className = "gfc-tab-pane";
      if (key === initialTab) pane.classList.add("active");
      tabBody.appendChild(pane);
      tabPanes[key] = pane;
    });
    panel.appendChild(tabBody);

    let currentTab = initialTab;
    function switchTab(key) {
      currentTab = key;
      Object.entries(tabBtns).forEach(([k, el]) => el.classList.toggle("active", k === key));
      Object.entries(tabPanes).forEach(([k, el]) => el.classList.toggle("active", k === key));
      if (key === "platform" && isFeatureNew("open_behavior")) {
        markFeatureSeen("open_behavior");
        tabBtns.platform.querySelector(".gfc-new-badge")?.remove();
      }
    }
    if (initialTab === "platform" && isFeatureNew("open_behavior")) {
      markFeatureSeen("open_behavior");
      tabBtns.platform.querySelector(".gfc-new-badge")?.remove();
    }

    const templateCard = document.createElement("div");
    templateCard.className = "gfc-card";

    const customLabel = document.createElement("div");
    customLabel.className = "gfc-card-title";
    customLabel.innerText = LangSystem.getText("custom_prompt_section");
    templateCard.appendChild(customLabel);

    const checkRow = document.createElement("label");
    checkRow.className = "grok-custom-checkbox-row";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = GM_getValue("cfg_custom_prompt_enabled", false);
    const checkLabel = document.createElement("span");
    checkLabel.innerText = LangSystem.getText("custom_prompt_checkbox");
    checkRow.appendChild(checkbox);
    checkRow.appendChild(checkLabel);
    templateCard.appendChild(checkRow);

    const textareaWrap = document.createElement("div");
    textareaWrap.className = "gfc-collapse" + (checkbox.checked ? " open" : "");
    const textarea = document.createElement("textarea");
    textarea.className = "grok-custom-textarea";
    textarea.placeholder = LangSystem.getText("custom_prompt_placeholder");
    textarea.value = GM_getValue("cfg_custom_prompt", "");
    textarea.style.height = "88px";
    textarea.style.minHeight = "88px";
    textarea.style.resize = "none";
    textareaWrap.appendChild(textarea);
    templateCard.appendChild(textareaWrap);

    checkbox.addEventListener("change", () => {
      textareaWrap.classList.toggle("open", checkbox.checked);
      refreshFooterState();
    });

    tabPanes.template.appendChild(templateCard);

    const highlightCard = document.createElement("div");
    highlightCard.className = "gfc-card";
    const highlightRow = document.createElement("label");
    highlightRow.className = "grok-custom-checkbox-row";
    const highlightChk = document.createElement("input");
    highlightChk.type = "checkbox";
    highlightChk.checked = GM_getValue("cfg_highlight_url", false);
    const highlightLabel = document.createElement("span");
    highlightLabel.innerText = LangSystem.getText("highlight_url_checkbox");
    highlightRow.appendChild(highlightChk);
    highlightRow.appendChild(highlightLabel);
    highlightCard.appendChild(highlightRow);

    const highlightNote = document.createElement("div");
    highlightNote.className = "gfc-card-hint gfc-collapse";
    highlightNote.style.paddingLeft = "26px";
    highlightNote.innerText = LangSystem.getText("highlight_note");
    function updateHighlightNote() {
      const checkedKeys = Object.entries(platformCheckboxes)
        .filter(([, c]) => c.checked).map(([k]) => k);
      highlightNote.classList.toggle("open", checkedKeys.some(k => k !== "grok"));
    }
    highlightCard.appendChild(highlightNote);
    highlightChk.addEventListener("change", refreshFooterState);
    tabPanes.template.appendChild(highlightCard);

    const curtainCard = document.createElement("div");
    curtainCard.className = "gfc-card";
    const curtainRow = document.createElement("label");
    curtainRow.className = "grok-custom-checkbox-row";
    const curtainChk = document.createElement("input");
    curtainChk.type = "checkbox";
    curtainChk.checked = GM_getValue("cfg_curtain_enabled", true);
    const curtainLabel = document.createElement("span");
    curtainLabel.innerText = LangSystem.getText("curtain_animation_checkbox");
    curtainRow.appendChild(curtainChk);
    curtainRow.appendChild(curtainLabel);
    if (isFeatureNew("curtain_all_platforms")) {
      const curtainBadge = document.createElement("span");
      curtainBadge.className = "gfc-new-badge-inline";
      curtainRow.appendChild(curtainBadge);
      curtainChk.addEventListener("change", () => {
        markFeatureSeen("curtain_all_platforms");
        curtainBadge.remove();
      }, { once: true });
    }
    curtainCard.appendChild(curtainRow);
    curtainChk.addEventListener("change", refreshFooterState);
    tabPanes.template.appendChild(curtainCard);

    const platformCard = document.createElement("div");
    platformCard.className = "gfc-card";
    const platformLabel = document.createElement("div");
    platformLabel.className = "gfc-card-title";
    platformLabel.innerText = LangSystem.getText("platform_section");
    platformCard.appendChild(platformLabel);

    const enabledPlatformsInit = getEnabledPlatforms();
    const platformCheckboxes = {};
    const platformOpenSelects = {};
    const PLAT_COLORS = Object.fromEntries(PLATFORM_DEFS.map(p => [p.key, p.color]));

    PLATFORM_DEFS.forEach(({ key, name }) => {
      const row = document.createElement("label");
      row.className = "gfc-plat-row";
      const chk = document.createElement("input");
      chk.type = "checkbox";
      chk.checked = enabledPlatformsInit.includes(key);
      chk.style.accentColor = PLAT_COLORS[key];

      const iconEl = document.createElement("span");
      iconEl.style.cssText = `width:16px;height:16px;display:inline-flex;align-items:center;flex-shrink:0;color:${PLAT_COLORS[key]};`;
      iconEl.innerHTML = getPlatformIcon(key);

      const nameEl = document.createElement("span");
      nameEl.innerText = key === "meta" ? `${name} (${LangSystem.getText("meta_login_notice")})` : name;

      const wrapper = document.createElement("span");
      wrapper.className = "gfc-plat-row-name";
      wrapper.style.cssText = "display:inline-flex;align-items:center;gap:6px;";
      wrapper.appendChild(iconEl);
      wrapper.appendChild(nameEl);

      const openSelect = document.createElement("select");
      openSelect.className = "gfc-plat-open-select";
      const optFg = document.createElement("option");
      optFg.value = "fg";
      optFg.innerText = LangSystem.getText("open_fg");
      const optBg = document.createElement("option");
      optBg.value = "bg";
      optBg.innerText = LangSystem.getText("open_bg");
      openSelect.appendChild(optFg);
      openSelect.appendChild(optBg);
      openSelect.value = getOpenBehavior(key) ? "fg" : "bg";
      openSelect.addEventListener("click", (e) => e.stopPropagation());
      openSelect.addEventListener("change", (e) => {
        e.stopPropagation();
        refreshFooterState();
      });

      row.appendChild(chk);
      row.appendChild(wrapper);
      row.appendChild(openSelect);
      platformCard.appendChild(row);
      platformCheckboxes[key] = chk;
      platformOpenSelects[key] = openSelect;
    });

    const platformWarn = document.createElement("div");
    platformWarn.className = "gfc-collapse";
    platformWarn.style.cssText = "color:#f4212e;font-size:12px;";
    platformWarn.innerText = LangSystem.getText("platform_at_least_one");
    platformCard.appendChild(platformWarn);

    Object.values(platformCheckboxes).forEach(chk => {
      chk.addEventListener("change", () => {
        const anyChecked = Object.values(platformCheckboxes).some(c => c.checked);
        platformWarn.classList.toggle("open", !anyChecked);
        updateHighlightNote();
        refreshFooterState();
      });
    });
    updateHighlightNote();

    tabPanes.platform.appendChild(platformCard);

    const langCard = document.createElement("div");
    langCard.className = "gfc-card";
    const langLabel = document.createElement("div");
    langLabel.className = "gfc-card-title";
    langLabel.innerText = LangSystem.getText("lang_section_title");
    langCard.appendChild(langLabel);

    const currentCode = GM_getValue("cfg_lang_code", null);
    const initialLangCode = currentCode || (() => {
      const navLang = navigator.language.toLowerCase();
      if (navLang.includes("zh-hant") || navLang.includes("zh-tw") || navLang.includes("zh-hk")) return "zh-TW";
      if (navLang.includes("zh-hans") || navLang.includes("zh-cn") || navLang.includes("zh")) return "zh-CN";
      if (navLang.includes("ja")) return "ja";
      if (navLang.includes("ko")) return "ko";
      if (navLang.includes("pt")) return "pt-BR";
      if (navLang.includes("fr")) return "fr";
      if (navLang.includes("es")) return "es";
      return "en";
    })();
    let selectedLangCode = initialLangCode;
    LangSystem._syncCustomIntoDict();
    const langGrid = document.createElement("div");
    langGrid.className = "gfc-lang-grid";
    const langCells = {};
    Object.keys(LANG_DICT).forEach((code) => {
      const cell = document.createElement("button");
      cell.className = "gfc-lang-cell";
      if (code === selectedLangCode) cell.classList.add("selected");
      cell.innerText = LANG_DICT[code].name;
      cell.onclick = () => {
        selectedLangCode = code;
        Object.entries(langCells).forEach(([c, el]) => el.classList.toggle("selected", c === code));
        refreshFooterState();
      };
      langGrid.appendChild(cell);
      langCells[code] = cell;
    });
    langCard.appendChild(langGrid);
    tabPanes.language.appendChild(langCard);

    const customLangCard = document.createElement("div");
    customLangCard.className = "gfc-card";
    buildCustomLangSection(customLangCard);
    tabPanes.language.appendChild(customLangCard);

    const initialState = {
      enabled:   GM_getValue("cfg_custom_prompt_enabled", false),
      prompt:    GM_getValue("cfg_custom_prompt", "").trim(),
      highlight: GM_getValue("cfg_highlight_url", false),
      curtain:   GM_getValue("cfg_curtain_enabled", true),
      platforms: GM_getValue("cfg_platforms", '["grok"]'),
      langCode:  initialLangCode,
      openBehavior: JSON.stringify(
        Object.fromEntries(PLATFORM_DEFS.map(p => [p.key, getOpenBehavior(p.key)]))
      ),
    };

    function hasUnsavedChanges() {
      const currentPlatforms = JSON.stringify(
        PLATFORM_DEFS.map(p => p.key).filter(k => platformCheckboxes[k]?.checked)
      );
      const currentOpenBehavior = JSON.stringify(
        Object.fromEntries(PLATFORM_DEFS.map(p => [p.key, platformOpenSelects[p.key]?.value === "fg"]))
      );
      return (
        checkbox.checked      !== initialState.enabled      ||
        textarea.value.trim() !== initialState.prompt       ||
        highlightChk.checked  !== initialState.highlight    ||
        curtainChk.checked    !== initialState.curtain      ||
        currentPlatforms      !== initialState.platforms    ||
        selectedLangCode      !== initialState.langCode     ||
        currentOpenBehavior   !== initialState.openBehavior
      );
    }

    function doSave() {
      const enabledKeys = PLATFORM_DEFS.map(p => p.key).filter(k => platformCheckboxes[k]?.checked);
      if (enabledKeys.length > 0) {
        GM_setValue("cfg_platforms", JSON.stringify(enabledKeys));
      }
      GM_setValue("cfg_custom_prompt_enabled", checkbox.checked);
      GM_setValue("cfg_custom_prompt", textarea.value.trim());
      GM_setValue("cfg_highlight_url", highlightChk.checked);
      GM_setValue("cfg_curtain_enabled", curtainChk.checked);
      GM_setValue("cfg_open_behavior", JSON.stringify(
        Object.fromEntries(PLATFORM_DEFS.map(p => [p.key, platformOpenSelects[p.key]?.value === "fg"]))
      ));

      const langChanged = selectedLangCode !== initialState.langCode;
      if (langChanged) {
        LangSystem.setKey(selectedLangCode);
        document.querySelectorAll(".my-grok-robot-btn").forEach(b => {
          b.title = LangSystem.getText("btn_title");
        });
      }

      initialState.enabled      = checkbox.checked;
      initialState.prompt       = textarea.value.trim();
      initialState.highlight    = highlightChk.checked;
      initialState.curtain      = curtainChk.checked;
      initialState.platforms    = JSON.stringify(enabledKeys);
      initialState.langCode     = selectedLangCode;
      initialState.openBehavior = JSON.stringify(
        Object.fromEntries(PLATFORM_DEFS.map(p => [p.key, platformOpenSelects[p.key]?.value === "fg"]))
      );

      return langChanged;
    }

    function doClose() {
      overlay.classList.add("grok-curtain-fade-out");
      setTimeout(() => overlay.remove(), 350);
    }

    function showUnsavedDialog() {
      const dialog = document.createElement("div");
      dialog.className = "grok-unsaved-dialog";

      const dialogTitle = document.createElement("div");
      dialogTitle.className = "grok-unsaved-title";
      dialogTitle.innerText = LangSystem.getText("unsaved_title");
      dialog.appendChild(dialogTitle);

      const saveCloseBtn = document.createElement("button");
      saveCloseBtn.className = "grok-unsaved-btn primary";
      saveCloseBtn.innerText = LangSystem.getText("unsaved_save_close");
      saveCloseBtn.onclick = () => { doSave(); doClose(); };
      dialog.appendChild(saveCloseBtn);

      const discardBtn = document.createElement("button");
      discardBtn.className = "grok-unsaved-btn danger";
      discardBtn.innerText = LangSystem.getText("unsaved_discard");
      discardBtn.onclick = () => doClose();
      dialog.appendChild(discardBtn);

      const cancelBtn = document.createElement("button");
      cancelBtn.className = "grok-unsaved-btn ghost";
      cancelBtn.innerText = LangSystem.getText("unsaved_cancel");
      cancelBtn.onclick = () => dialog.remove();
      dialog.appendChild(cancelBtn);

      panel.appendChild(dialog);
    }

    const footer = document.createElement("div");
    footer.className = "gfc-panel-footer";
    const unsavedDot = document.createElement("div");
    unsavedDot.className = "gfc-unsaved-dot";
    unsavedDot.title = LangSystem.getText("unsaved_footer_hint");
    const saveBtn = document.createElement("button");
    saveBtn.className = "grok-save-btn";
    saveBtn.innerText = LangSystem.getText("custom_prompt_save");
    saveBtn.onclick = () => {
      const langChanged = doSave();
      saveBtn.innerText = LangSystem.getText("custom_prompt_saved");
      saveBtn.classList.add("saved");
      refreshFooterState();
      if (langChanged) {
        setTimeout(() => {
          doClose();
          setTimeout(() => showLanguageSelectionUI(currentTab), 360);
        }, 700);
      } else {
        setTimeout(() => doClose(), 700);
      }
    };
    footer.appendChild(unsavedDot);
    footer.appendChild(saveBtn);
    panel.appendChild(footer);

    function refreshFooterState() {
      unsavedDot.classList.toggle("visible", hasUnsavedChanges());
    }
    refreshFooterState();

    headerCloseBtn.onclick = () => {
      if (hasUnsavedChanges()) {
        showUnsavedDialog();
      } else {
        doClose();
      }
    };

    overlay.appendChild(panel);
    overlay.style.opacity = "0";
    document.body.appendChild(overlay);
    requestAnimationFrame(() => { overlay.style.opacity = ""; });
  }

  function buildCustomLangTemplate() {
    const base = LangSystem.getCurrent();
    const template = {
      "_note": [
        "=== GROK FACT CHECKER — Custom Language Translation Template ===",
        "TASK: Translate ONLY the string VALUES. DO NOT rename or remove any KEYS.",
        "RULES:",
        "  1. Keep ALL \\n newline positions unchanged.",
        "  2. Keep ALL emoji characters unchanged.",
        "  3. 'langName' should be the native name of your language (e.g. 'Deutsch', 'ภาษาไทย').",
        "  4. 'prompt' is the fact-check instruction sent to the AI — translate the meaning, keep the trailing \\n.",
        "  5. '_note' must be kept verbatim.",
        "  6. When done: paste or import this JSON via the ✏️ Custom Language panel.",
        "=================================================================="
      ],
      "langName": base.name || "Custom Language",
      "prompt": base.prompt,
      "ui": Object.assign({}, base.ui)
    };
    return JSON.stringify(template, null, 2);
  }

  function buildCustomLangSection(card) {
    const sectionLabel = document.createElement("div");
    sectionLabel.className = "gfc-card-title";
    sectionLabel.innerText = LangSystem.getText("custom_lang_section");
    card.appendChild(sectionLabel);

    const statusRow = document.createElement("div");
    statusRow.style.cssText = "font-size:12px;color:#8899a6;";
    const existing = LangSystem.getCustom();
    statusRow.innerText = existing
      ? LangSystem.getText("custom_lang_loaded") + (existing.langName || "Custom")
      : LangSystem.getText("custom_lang_none");
    card.appendChild(statusRow);

    const btnRow = document.createElement("div");
    btnRow.style.cssText = "display:flex;gap:8px;";

    const exportBtn = document.createElement("button");
    exportBtn.className = "grok-lang-btn";
    exportBtn.style.cssText = "flex:1;text-align:center;font-size:13px;padding:8px 6px;";
    exportBtn.innerText = LangSystem.getText("custom_lang_export");
    exportBtn.onclick = () => showCustomLangDialog("export", statusRow);
    btnRow.appendChild(exportBtn);

    const importBtn = document.createElement("button");
    importBtn.className = "grok-lang-btn";
    importBtn.style.cssText = "flex:1;text-align:center;font-size:13px;padding:8px 6px;";
    importBtn.innerText = LangSystem.getText("custom_lang_import");
    importBtn.onclick = () => showCustomLangDialog("import", statusRow);
    btnRow.appendChild(importBtn);

    const clearBtn = document.createElement("button");
    clearBtn.className = "grok-lang-btn";
    clearBtn.style.cssText = "flex:0 0 auto;font-size:13px;padding:8px 10px;color:#f4212e;border-color:#f4212e;";
    clearBtn.innerText = "\ud83d\uddd1";
    clearBtn.title = LangSystem.getText("custom_lang_clear_title");
    clearBtn.onclick = () => {
      if (!LangSystem.getCustom()) return;
      GM_setValue("cfg_custom_lang", "");
      if (LangSystem.getKey() === "custom") {
        GM_setValue("cfg_lang_code", null);
        LangSystem._currentKey = null;
      }
      statusRow.innerText = LangSystem.getText("custom_lang_none");
      statusRow.style.color = "#8899a6";
      setTimeout(() => location.reload(), 400);
    };
    btnRow.appendChild(clearBtn);

    card.appendChild(btnRow);
  }

  function showCustomLangDialog(mode, statusRowRef) {
    const existingDialog = document.querySelector(".gfc-custom-lang-dialog");
    if (existingDialog) existingDialog.remove();

    const MULTILANG_HINT = "English:       Export → translate the values → Import\nDeutsch:       Exportieren → Werte übersetzen → Importieren\nFrançais:      Exporter → traduire les valeurs → Importer\nEspañol:       Exportar → traducir los valores → Importar\nItaliano:      Esporta → traduci i valori → Importa\nPortuguês:     Exportar → traduzir os valores → Importar\nРусский:       Экспорт → перевести значения → Импорт\nУкраїнська:    Експорт → перекласти значення → Імпорт\nภาษาไทย:       ส่งออก → แปลค่า → นำเข้า\nTürkçe:        Dışa aktar → değerleri çevir → İçe aktar\nPolski:        Eksportuj → przetłumacz wartości → Importuj\nČeština:       Exportovat → přeložit hodnoty → Importovat\nRomână:        Exportați → traduceți valorile → Importați\nMagyar:        Exportálás → értékek fordítása → Importálás\nΕλληνικά:      Εξαγωγή → μετάφραση τιμών → Εισαγωγή\nالعربية:       تصدير ← ترجمة القيم ← استيراد\nעברית:         ייצוא ← תרגום הערכים ← ייבוא\nفارسی:         صادر کردن ← ترجمه مقادیر ← وارد کردن\nहिन्दी:        निर्यात → मान अनुवाद करें → आयात\nবাংলা:         রপ্তানি → মান অনুবাদ করুন → আমদানি\nIndonesia:     Ekspor → terjemahkan nilai → Impor\nBahasa Melayu: Eksport → terjemah nilai → Import\nFilipino:      I-export → isalin ang mga halaga → I-import\nTiếng Việt:    Xuất → dịch các giá trị → Nhập\nNederlands:    Exporteren → waarden vertalen → Importeren\nSvenska:       Exportera → översätt värdena → Importera\nKiswahili:     Hamisha → tafsiri maadili → Ingiza\n(...)";

    const overlay = document.createElement("div");
    overlay.className = "gfc-custom-lang-dialog";
    overlay.style.cssText = [
      "position:fixed;inset:0;z-index:2147483647;",
      "display:flex;align-items:center;justify-content:center;",
      "background:rgba(0,0,0,0.82);",
    ].join("");

    const box = document.createElement("div");
    box.style.cssText = [
      "background:#16181c;border:1px solid #2f3336;border-radius:16px;",
      "padding:20px;width:500px;max-width:94vw;max-height:88vh;",
      "display:flex;flex-direction:column;gap:10px;overflow-y:auto;",
      "box-shadow:0 4px 28px rgba(0,0,0,0.8);",
    ].join("");

    const title = document.createElement("div");
    title.style.cssText = "color:#e7e9ea;font-size:15px;font-weight:700;flex-shrink:0;";
    title.innerText = mode === "export"
      ? "\ud83d\udce4 Export Template"
      : "\ud83d\udce5 Import Translation";
    box.appendChild(title);

    const steps = document.createElement("div");
    steps.style.cssText = "color:#e7e9ea;font-size:12px;line-height:1.7;flex-shrink:0;";
    steps.innerText = mode === "export"
      ? "1. Click \"\ud83d\udce4 Copy\" to copy the JSON template to clipboard.\n2. Translate only the VALUES (right side of each colon). Do NOT rename keys.\n3. Change \"langName\" to your language name.\n4. Come back and use \"\ud83d\udce5 Import Translation\" to apply."
      : "1. Paste your translated JSON into the field below.\n2. Only \"langName\", \"prompt\", and \"ui\" are required.\n3. Click \"\u2705 Apply\" to save and reload.";
    box.appendChild(steps);

    const hintBox = document.createElement("pre");
    hintBox.style.cssText = [
      "background:#0d1117;border:1px solid #2f3336;border-radius:8px;",
      "padding:10px;font-size:11px;color:#8899a6;line-height:1.6;",
      "max-height:140px;overflow-y:auto;white-space:pre-wrap;",
      "word-break:break-word;flex-shrink:0;margin:0;font-family:inherit;",
    ].join("");
    hintBox.innerText = MULTILANG_HINT;
    box.appendChild(hintBox);

    const ta = document.createElement("textarea");
    ta.className = "grok-custom-textarea";
    ta.style.cssText = "width:100%;min-height:160px;max-height:35vh;resize:vertical;box-sizing:border-box;font-size:12px;flex-shrink:0;";
    ta.placeholder = mode === "export"
      ? "(template will appear here if clipboard is unavailable)"
      : '{\n  "langName": "Your Language",\n  "prompt": "...",\n  "ui": { ... }\n}';

    if (mode === "export") {
      const json = buildCustomLangTemplate();
      navigator.clipboard.writeText(json).then(() => {
        ta.value = json;
        ta.readOnly = true;
        ta.style.color = "#536471";
        steps.innerText = "\u2705 Template copied to clipboard!\n\nNow translate the values, then use \"\ud83d\udce5 Import Translation\" to apply.";
      }).catch(() => {
        ta.value = json;
        ta.readOnly = false;
      });
    }
    box.appendChild(ta);

    const errMsg = document.createElement("div");
    errMsg.style.cssText = "color:#f4212e;font-size:12px;display:none;flex-shrink:0;";
    box.appendChild(errMsg);

    const dialogBtnRow = document.createElement("div");
    dialogBtnRow.style.cssText = "display:flex;gap:8px;flex-shrink:0;";

    if (mode === "export") {
      const copyBtn = document.createElement("button");
      copyBtn.className = "grok-save-btn";
      copyBtn.style.cssText = "flex:1;font-size:13px;";
      copyBtn.innerText = "\ud83d\udce4 Copy to Clipboard";
      copyBtn.onclick = () => {
        const json = buildCustomLangTemplate();
        navigator.clipboard.writeText(json).then(() => {
          copyBtn.innerText = "\u2705 Copied!";
          copyBtn.style.background = "#00ba7c";
          setTimeout(() => {
            copyBtn.innerText = "\ud83d\udce4 Copy to Clipboard";
            copyBtn.style.background = "";
          }, 2000);
        }).catch(() => {
          ta.readOnly = false;
          ta.value = json;
          ta.select();
          document.execCommand("copy");
          copyBtn.innerText = "\u2705 Copied!";
          setTimeout(() => { copyBtn.innerText = "\ud83d\udce4 Copy to Clipboard"; }, 2000);
        });
      };
      dialogBtnRow.appendChild(copyBtn);
    } else {
      const applyBtn = document.createElement("button");
      applyBtn.className = "grok-save-btn";
      applyBtn.style.cssText = "flex:1;font-size:13px;";
      applyBtn.innerText = "\u2705 Apply";
      applyBtn.onclick = () => {
        const raw = ta.value.trim();
        errMsg.style.display = "none";
        if (!raw) {
          errMsg.innerText = "\u26a0\ufe0f Please paste your translated JSON first.";
          errMsg.style.display = "block";
          return;
        }
        try {
          const parsed = JSON.parse(raw);
          if (!parsed.ui || typeof parsed.ui !== "object") {
            errMsg.innerText = "\u274c Invalid format: missing \"ui\" object.";
            errMsg.style.display = "block";
            return;
          }
          if (typeof parsed.prompt !== "string") {
            errMsg.innerText = "\u274c Invalid format: missing \"prompt\" string.";
            errMsg.style.display = "block";
            return;
          }
          GM_setValue("cfg_custom_lang", JSON.stringify({
            langName: parsed.langName || "Custom",
            prompt:   parsed.prompt,
            ui:       parsed.ui,
          }));
          LangSystem.setKey("custom");
          if (statusRowRef) {
            statusRowRef.innerText = "Loaded: " + (parsed.langName || "Custom");
            statusRowRef.style.color = "#00ba7c";
          }
          applyBtn.innerText = "\u2705 Applied!";
          applyBtn.style.background = "#00ba7c";
          overlay.remove();
          setTimeout(() => location.reload(), 600);
        } catch (err) {
          errMsg.innerText = "\u274c JSON parse error: " + err.message;
          errMsg.style.display = "block";
        }
      };
      dialogBtnRow.appendChild(applyBtn);
    }

    const closeBtn = document.createElement("button");
    closeBtn.className = "grok-lang-btn";
    closeBtn.style.cssText = "flex:0 0 auto;font-size:13px;padding:8px 16px;";
    closeBtn.innerText = "\u274c Close";
    closeBtn.onclick = () => overlay.remove();
    dialogBtnRow.appendChild(closeBtn);

    box.appendChild(dialogBtnRow);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.remove();
    });

    if (mode === "import") setTimeout(() => ta.focus(), 50);
  }

  function simulateTypeInput(element, text) {
    if (!element) return;
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLTextAreaElement.prototype,
      "value",
    ).set;
    if (element.value.length > 0) {
      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(element, "");
      } else {
        element.value = "";
      }
      element.dispatchEvent(new Event("input", { bubbles: true }));
    }
    element.focus();
    if (nativeInputValueSetter) {
      nativeInputValueSetter.call(element, text);
    } else {
      element.value = text;
    }
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
    try {
      element.dispatchEvent(
        new InputEvent("input", {
          bubbles: true,
          inputType: "insertText",
          data: text,
        }),
      );
    } catch (e) {}
  }

  function safeSimulateClick(element) {
    if (!element) return;
    const clickable =
      element.closest("button") ||
      element.closest('[role="button"]') ||
      element;
    clickable.focus();
    clickable.click();
    clickable.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true }),
    );
  }

  function findSendButton() {
    const selectors = [
      'button[aria-label="問 Grok 一些問題"]',
      'button[aria-label="傳送"]',
      'button[aria-label="Ask Grok"]',
      'button[aria-label="Send"]',
      'button[aria-label="Grok"]',
      'button[aria-label="Grokに聞く"]',
      'button[aria-label="送信"]',
      'button[aria-label="Grokに質問"]',
      'button[aria-label="向 Grok 提问"]',
      'button[aria-label="发送"]',
      'button[aria-label="Grok에게 질문하기"]',
      'button[aria-label="보내기"]',
      'button[aria-label="Preguntarle a Grok"]',
      'button[aria-label="Publicar"]',
      'button[aria-label="Enviar"]',
      'button[aria-label="Perguntar ao Grok"]',
      'button[aria-label="Postar"]',
      'button[aria-label="Demander à Grok"]',
      'button[aria-label="Publier"]',
      'button[aria-label="Envoyer"]',
      'button[data-testid="grok-send-button"]',
    ];
    let btn = findAny(selectors);
    if (btn) return btn;
    const SVG_PATTERNS = [
      "M21 3l-6.5 18",
      "M10 14l11 -11",
      "M12 3.59l7.4",
    ];
    const svgs = document.querySelectorAll("button svg path");
    for (const path of svgs) {
      const d = path.getAttribute("d");
      if (d && SVG_PATTERNS.some((p) => d.startsWith(p)))
        return path.closest("button");
    }
    return null;
  }

  function findPrivacyButton() {
    const ariaLabels = [
      "私人",
      "非公開",
      "Private",
      "隐私",
      "プライベート",
      "비공개",
      "프라이빗",
      "Privado",
      "Privé",
      "Privat",
      "Privato",
    ];
    for (const label of ariaLabels) {
      const btn = document.querySelector(
        `button[aria-label="${label}"], [role="button"][aria-label="${label}"]`,
      );
      if (btn) return btn;
    }
    return null;
  }

  let _automationRunning = false;
  let _grokAutomationRan = false;

  function runGrokAutomation(hashData = null) {
    const payload   = hashData?.payload   ?? "";
    const forceSend = hashData?.forceSend ?? false;
    if (!payload) { console.warn("[GrokCheck] runGrokAutomation: no payload, abort"); return; }
    if (_automationRunning || _grokAutomationRan) return;
    _automationRunning = true;
    _grokAutomationRan = true;
    const t0 = Date.now();
    const ts = () => `+${Date.now() - t0}ms`;

    const configAutoSend = GM_getValue("cfg_auto_send", false);
    const shouldSend = forceSend || configAutoSend;

    const statusTitle = forceSend
      ? LangSystem.getText("mode_fast")
      : shouldSend
        ? LangSystem.getText("mode_direct")
        : LangSystem.getText("mode_std");

    showCurtain(LangSystem.getText("init"), statusTitle);
    removeGrokAds();
    let attempts = 0;
    const maxAttempts = 40;
    const BTN_RETRY_LIMIT = 12;
    let hasClickedPrivacy = false;
    let hasClickedFocus = false;

    const interval = setInterval(() => {
      try {
        attempts++;

        if (!hasClickedPrivacy) {
          const privacyBtn = findPrivacyButton();
          const privacyLabel = privacyBtn?.getAttribute("aria-label") ?? "null";
          if (privacyBtn) {
            safeSimulateClick(privacyBtn);
            hasClickedPrivacy = true;
            updateCurtainText(LangSystem.getText("privacy_check"), statusTitle);
          } else if (attempts >= BTN_RETRY_LIMIT) {
            hasClickedPrivacy = true;
            updateCurtainText(LangSystem.getText("privacy_skip"), LangSystem.getText("privacy_skip_sub"));
          }
        }

        if (!hasClickedFocus) {
          const focusLabels = [
            "聚焦模式", "Focus Mode", "集中モード",
            "フォーカスモード", "フォーカスモードを修了",
            "집중 모드", "Modo enfoque", "Mode concentration",
            "Modo foco", "Mode Concentration", "Modo de enfoque",
          ];
          let focusBtn = null;
          let matchedLabel = null;
          for (const label of focusLabels) {
            const btn = document.querySelector(
              `button[aria-label="${label}"], [role="button"][aria-label="${label}"]`,
            );
            if (btn) { focusBtn = btn; matchedLabel = label; break; }
          }
          if (!focusBtn) {
            for (const path of document.querySelectorAll("button svg path")) {
              const d = path.getAttribute("d") ?? "";
              if (d.startsWith("M3 5.5C3 4.12") || d.startsWith("M10.59 12L4.54")) {
                focusBtn = path.closest("button");
                matchedLabel = `SVG:${d.slice(0, 20)}`;
                break;
              }
            }
          }
          if (focusBtn) {
            safeSimulateClick(focusBtn);
            hasClickedFocus = true;
          }
          if (!hasClickedFocus && attempts >= BTN_RETRY_LIMIT) {
            hasClickedFocus = true;
          }
        }

        if (!hasClickedPrivacy || !hasClickedFocus) return;

        const textarea = findAny([
          'textarea[placeholder*="Grok"]',
          'textarea[aria-label*="Grok"]',
          'textarea[data-testid="grok-input"]',
          "textarea",
        ]);

        if (textarea && payload) {
          clearInterval(interval);
          updateCurtainText(LangSystem.getText("writing"), statusTitle);

          setTimeout(() => {
            simulateTypeInput(textarea, payload);

            const highlightDone = waitForHighlight((finish) => {
              if (!GM_getValue("cfg_highlight_url", false)) return finish();
              const urlStart = payload.lastIndexOf("https://");
              if (urlStart === -1) return finish();
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  try {
                    textarea.focus();
                    textarea.setSelectionRange(urlStart, payload.length);
                  } catch (e) {}
                  finish();
                });
              });
            }, 200);

            highlightDone.then(() => {
              if (shouldSend) {
                updateCurtainText(LangSystem.getText("sending"), statusTitle);

                const sendBtnPre = findSendButton();

                let sendFired = false;
                function fireSend(trigger) {
                  if (sendFired) return;
                  sendFired = true;
                  sendObs.disconnect();
                  clearTimeout(sendFallback);
                  if (!textarea.value) {
                    simulateTypeInput(textarea, payload);
                  }
                  const btn = findSendButton();
                  if (btn) {
                    safeSimulateClick(btn);
                    updateCurtainText(LangSystem.getText("done"));
                  } else {
                    updateCurtainText(LangSystem.getText("error_btn"), LangSystem.getText("error_btn_sub"));
                  }
                  cleanup();
                }

                const sendObs = new MutationObserver(() => {
                  const btn = findSendButton();
                  if (btn && !btn.disabled && btn.getAttribute("aria-disabled") !== "true") {
                    fireSend("MutationObserver");
                  }
                });
                sendObs.observe(document.body, {
                  subtree: true,
                  attributes: true,
                  attributeFilter: ["disabled", "aria-disabled"],
                });

                const sendFallback = setTimeout(() => {
                  fireSend("fallback");
                }, 1500);

              } else {
                updateCurtainText(LangSystem.getText("done_manual"), LangSystem.getText("done_manual_sub"));
                cleanup();
              }
            });
          }, 500);

        } else if (attempts >= maxAttempts) {
          updateCurtainText(LangSystem.getText("error_timeout"), LangSystem.getText("error_timeout_sub"));
          cleanup();
          clearInterval(interval);
        }
      } catch (err) {
        clearInterval(interval);
        updateCurtainText(LangSystem.getText("error_script"), LangSystem.getText("error_script_sub"));
        setTimeout(() => cleanup(), 2000);
      }
    }, 500);
  }

  function cleanup() {
    _automationRunning = false;
    try { hideCurtain(800); } catch (e) {}
  }

  function runMetaAutomation(payload, forceSend) {
    if (!payload) return;
    showCurtain(LangSystem.getText("init"), forceSend ? LangSystem.getText("mode_direct") : LangSystem.getText("mode_std"));

    function findVisibleEditor() {
      const candidates = document.querySelectorAll('[data-testid="composer-input"][contenteditable="true"]');
      for (const el of candidates) {
        if (el.closest(".hidden")) continue;
        return el;
      }
      return null;
    }

    function findMetaSendBtn() {
      return document.querySelector('button[data-testid="composer-send-button"]');
    }

    function fillEditor(editor) {
      updateCurtainText(LangSystem.getText("writing"));
      editor.focus();
      document.execCommand("selectAll", false, null);
      document.execCommand("delete", false, null);

      let pasteOk = false;
      try {
        const dt = new DataTransfer();
        dt.setData("text/plain", payload);
        const ev = new ClipboardEvent("paste", { clipboardData: dt, bubbles: true, cancelable: true });
        editor.dispatchEvent(ev);
        pasteOk = true;
      } catch (e) {
        console.warn("[GrokCheck][Meta] ClipboardEvent paste 失敗：", e);
      }

      setTimeout(() => {
        const expectedLen = payload.replace(/\n/g, "").trim().length;
        const filled = editor.innerText?.replace(/\n/g, "").trim();
        if (!pasteOk || !filled || filled.length < expectedLen - 5) {
          console.log("[GrokCheck][Meta] paste 未生效，改用 execCommand insertText fallback");
          editor.focus();
          document.execCommand("selectAll", false, null);
          document.execCommand("insertText", false, payload);
        }
        const highlightDone = waitForHighlight((finish) => {
          setTimeout(() => {
            const actual = editor.innerText?.trim() || "";
            if (actual.length > 0) {
              console.log(`[GrokCheck][Meta] 寫入驗證：目前 innerText 長度=${actual.length}`);
              if (GM_getValue("cfg_highlight_url", false)) {
                const urlStart = payload.lastIndexOf("https://");
                if (urlStart !== -1) {
                  requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                      highlightUrlInContenteditable(editor, payload, payload.slice(urlStart));
                      finish();
                    });
                  });
                  return;
                }
              }
            } else {
              console.warn("[GrokCheck][Meta] 寫入驗證失敗！editor.innerText 仍為空");
            }
            finish();
          }, 200);
        }, 500);
        highlightDone.then(startAutoSend);
      }, 300);
    }

    function startAutoSend() {
      if (!forceSend) {
        updateCurtainText(LangSystem.getText("done_manual"), LangSystem.getText("done_manual_sub"));
        hideCurtain();
        return;
      }
      updateCurtainText(LangSystem.getText("sending"));
      let sendAttempts = 0;
      const sendInterval = setInterval(() => {
        sendAttempts++;
        const btn = findMetaSendBtn();
        if (btn && !btn.disabled && btn.getAttribute("aria-disabled") !== "true") {
          clearInterval(sendInterval);
          btn.click();
          updateCurtainText(LangSystem.getText("done"));
          hideCurtain(800);
        } else if (sendAttempts >= 40) {
          clearInterval(sendInterval);
          updateCurtainText(LangSystem.getText("error_btn"), LangSystem.getText("error_btn_sub"));
          hideCurtain(800);
        }
      }, 400);
    }

    let attempts = 0;
    const waitEditor = setInterval(() => {
      attempts++;
      const editor = findVisibleEditor();
      if (editor) {
        clearInterval(waitEditor);
        console.log(`[GrokCheck][Meta] 找到可見 contenteditable（第 ${attempts} 次嘗試），準備填入 payload，長度=${payload.length}`);
        fillEditor(editor);
      } else if (attempts >= 60) {
        console.warn("[GrokCheck][Meta] 逾時：60 次嘗試後仍找不到可見的 contenteditable composer-input");
        clearInterval(waitEditor);
        updateCurtainText(LangSystem.getText("error_timeout"), LangSystem.getText("error_timeout_sub"));
        hideCurtain(800);
      }
    }, 400);
  }

  function runChatGPTAutomation(forceSend, payload) {
    if (!payload) return;
    showCurtain(LangSystem.getText("init"), forceSend ? LangSystem.getText("mode_direct") : LangSystem.getText("mode_std"));

    (function watchAndClearAfterSubmit() {
      let btnExistedLastPoll = null;
      let textAtSubmit = null;
      let pendingChecks = 0;
      let attempts = 0;
      const pollInterval = setInterval(() => {
        attempts++;
        const editor = findChatGPTEditor();
        const btn = findChatGPTSendBtn();
        const btnExists = !!btn;

        if (textAtSubmit === null) {
          if (btnExistedLastPoll === true && btnExists === false && editor) {
            textAtSubmit = editor.innerText;
            pendingChecks = 0;
          }
          btnExistedLastPoll = btnExists;
        } else {
          pendingChecks++;
          if (editor && editor.isConnected && textAtSubmit.trim() && editor.innerText === textAtSubmit && pendingChecks >= 2) {
            editor.focus();
            document.execCommand("selectAll", false, null);
            document.execCommand("delete", false, null);
            clearInterval(pollInterval);
          } else if (editor && editor.innerText !== textAtSubmit) {
            clearInterval(pollInterval);
          }
        }

        if (attempts >= 60) clearInterval(pollInterval);
      }, 500);
    })();

    function findChatGPTSendBtn() {
      return (
        document.querySelector('button[data-testid="send-button"]') ||
        document.querySelector('button[aria-label="Send prompt"]') ||
        document.querySelector('button[aria-label="傳送提示"]') ||
        document.querySelector('button[aria-label="プロンプトを送信"]') ||
        document.querySelector('button[aria-label="프롬프트 전송"]') ||
        document.querySelector('button[aria-label="Enviar mensaje"]') ||
        document.querySelector('button[aria-label="Envoyer le message"]') ||
        [...document.querySelectorAll("button svg path")]
          .find(p => (p.getAttribute("d") || "").startsWith("M15.192 8.906"))
          ?.closest("button")
      );
    }

    function findChatGPTEditor() {
      return (
        document.querySelector("#prompt-textarea") ||
        document.querySelector('div[contenteditable="true"][data-testid="prompt-textarea"]') ||
        document.querySelector('div.ProseMirror[contenteditable="true"]') ||
        document.querySelector('div[contenteditable="true"]')
      );
    }

    function startAutoSend() {
      if (!forceSend) {
        updateCurtainText(LangSystem.getText("done_manual"), LangSystem.getText("done_manual_sub"));
        hideCurtain();
        return;
      }
      updateCurtainText(LangSystem.getText("sending"));
      let sendAttempts = 0;
      const sendInterval = setInterval(() => {
        sendAttempts++;
        const btn = findChatGPTSendBtn();
        if (btn && !btn.disabled && btn.getAttribute("aria-disabled") !== "true") {
          clearInterval(sendInterval);
          btn.click();
          updateCurtainText(LangSystem.getText("done"));
          hideCurtain(800);
        } else if (sendAttempts >= 40) {
          clearInterval(sendInterval);
          updateCurtainText(LangSystem.getText("error_btn"), LangSystem.getText("error_btn_sub"));
          hideCurtain(800);
        }
      }, 400);
    }

    function startHighlightWatch() {
      return waitForHighlight((finish) => {
        if (!GM_getValue("cfg_highlight_url", false) || !payload) return finish();
        const urlStart = payload.lastIndexOf("https://");
        if (urlStart === -1) return finish();
        let hlAttempts = 0;
        const hlInterval = setInterval(() => {
          hlAttempts++;
          const editor = findChatGPTEditor();
          const filled = editor?.innerText?.replace(/\n/g, "").trim();
          if (editor && filled && filled.length >= 5) {
            clearInterval(hlInterval);
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                highlightUrlInContenteditable(editor, payload, payload.slice(urlStart));
                finish();
              });
            });
          } else if (hlAttempts >= 30) {
            clearInterval(hlInterval);
            finish();
          }
        }, 300);
      }, 9500);
    }

    startHighlightWatch().then(startAutoSend);
  }

  function runGeminiAutomation(payload, forceSend) {
    if (!payload) return;
    showCurtain(LangSystem.getText("init"), forceSend ? LangSystem.getText("mode_direct") : LangSystem.getText("mode_std"));

    function findGeminiSendButton() {
      for (const ic of document.querySelectorAll("button mat-icon")) {
        const txt = ic.textContent.trim();
        if (txt === "send" || ic.getAttribute("fonticon") === "send" ||
            ic.getAttribute("data-mat-icon-name") === "send") {
          return ic.closest("button");
        }
      }
      return document.querySelector('button[aria-label*="send" i], button[aria-label*="送信"], button[aria-label*="傳送"]');
    }

    function fillEditor(editor) {
      updateCurtainText(LangSystem.getText("writing"));
      editor.focus();
      document.execCommand("selectAll", false, null);
      document.execCommand("delete", false, null);

      let pasteOk = false;
      try {
        const dt = new DataTransfer();
        dt.setData("text/plain", payload);
        dt.setData("text/html", "<p>" + escapeHtmlText(payload).replace(/\n/g, "</p><p>") + "</p>");
        const ev = new ClipboardEvent("paste", { clipboardData: dt, bubbles: true, cancelable: true });
        editor.dispatchEvent(ev);
        pasteOk = true;
      } catch (e) {}

      setTimeout(() => {
        const expectedLen = payload.replace(/\n/g, "").trim().length;
        const filled = editor.innerText?.replace(/\n/g, "").trim();
        if (!pasteOk || !filled || filled.length < expectedLen - 5) {
          editor.focus();
          document.execCommand("selectAll", false, null);
          document.execCommand("insertText", false, payload);
        }
        const highlightDone = waitForHighlight((finish) => {
          if (!GM_getValue("cfg_highlight_url", false)) return finish();
          const urlStart = payload.lastIndexOf("https://");
          if (urlStart === -1) return finish();
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              highlightUrlInContenteditable(editor, payload, payload.slice(urlStart));
              finish();
            });
          });
        }, 200);

        if (forceSend) {
          updateCurtainText(LangSystem.getText("sending"));
          highlightDone.then(() => {
            setTimeout(() => {
              const btn = findGeminiSendButton();
              if (btn) {
                btn.click();
                updateCurtainText(LangSystem.getText("done"));
              } else {
                updateCurtainText(LangSystem.getText("error_btn"), LangSystem.getText("error_btn_sub"));
              }
              hideCurtain(800);
            }, 700);
          });
        } else {
          highlightDone.then(() => {
            updateCurtainText(LangSystem.getText("done_manual"), LangSystem.getText("done_manual_sub"));
            hideCurtain();
          });
        }
      }, 400);
    }

    let attempts = 0;
    const waitEditor = setInterval(() => {
      attempts++;
      const editor = document.querySelector('div.ql-editor[contenteditable="true"]');
      if (editor) {
        clearInterval(waitEditor);

        let tempBtnAttempts = 0;
        const waitTempBtn = setInterval(() => {
          tempBtnAttempts++;
          const tempBtn = document.querySelector("temp-chat-button button");
          if (tempBtn) {
            clearInterval(waitTempBtn);
            tempBtn.click();
            setTimeout(() => {
              const editorAfter = document.querySelector('div.ql-editor[contenteditable="true"]');
              fillEditor(editorAfter || editor);
            }, 700);
          } else if (tempBtnAttempts >= 60) {
            clearInterval(waitTempBtn);
            console.warn("[GrokCheck][Gemini] 逾時：60 次嘗試後仍找不到 temp-chat-button，降級為不開無痕直接填字");
            fillEditor(editor);
          }
        }, 300);
      } else if (attempts >= 60) {
        clearInterval(waitEditor);
        updateCurtainText(LangSystem.getText("error_timeout"), LangSystem.getText("error_timeout_sub"));
        hideCurtain(800);
      }
    }, 400);
  }

  function waitForHighlight(runHighlight, timeoutMs) {
    return new Promise((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        resolve();
      };
      try {
        runHighlight(finish);
      } catch (e) {
        finish();
      }
      setTimeout(finish, timeoutMs);
    });
  }

  function highlightUrlInContenteditable(editor, fullText, targetSubstring) {
    try {
      if (!targetSubstring) return false;
      const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT, null);
      const nodeRecords = [];
      let domText = "";
      let node;
      while ((node = walker.nextNode())) {
        nodeRecords.push({ node, start: domText.length });
        domText += node.textContent;
      }
      const urlStart = domText.lastIndexOf(targetSubstring);
      if (urlStart === -1) return false;
      const urlEnd = urlStart + targetSubstring.length;

      function locate(pos) {
        for (let i = nodeRecords.length - 1; i >= 0; i--) {
          const rec = nodeRecords[i];
          if (pos >= rec.start) {
            return { node: rec.node, offset: pos - rec.start };
          }
        }
        return null;
      }

      const startLoc = locate(urlStart);
      const endLoc = locate(urlEnd);
      if (!startLoc || !endLoc) return false;

      const range = document.createRange();
      range.setStart(startLoc.node, Math.min(startLoc.offset, startLoc.node.textContent.length));
      range.setEnd(endLoc.node, Math.min(endLoc.offset, endLoc.node.textContent.length));
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      return true;
    } catch (e) {
      console.warn("[GrokCheck] highlightUrlInContenteditable 失敗（不影響主流程）：", e);
      return false;
    }
  }

  function getEnabledPlatforms() {
    try {
      const val = GM_getValue("cfg_platforms", null);
      if (val) return JSON.parse(val);
    } catch (e) {}
    return ["grok"];
  }

  function getOpenBehavior(key) {
    try {
      const val = GM_getValue("cfg_open_behavior", null);
      if (val) {
        const parsed = JSON.parse(val);
        if (typeof parsed[key] === "boolean") return parsed[key];
      }
    } catch (e) {}
    return true;
  }

  const NEW_FEATURES = {
    open_behavior: "1.6.0",
    curtain_all_platforms: "1.6.3",
  };
  function isFeatureNew(featureKey) {
    const introducedVersion = NEW_FEATURES[featureKey];
    if (!introducedVersion) return false;
    const seenVersion = GM_getValue(`cfg_feature_seen_${featureKey}`, "");
    return seenVersion !== introducedVersion;
  }
  function markFeatureSeen(featureKey) {
    const introducedVersion = NEW_FEATURES[featureKey];
    if (!introducedVersion) return;
    GM_setValue(`cfg_feature_seen_${featureKey}`, introducedVersion);
  }

  async function buildTabUrl(platform, text, forceSend) {
    function encodePayload(str) {
      const bytes = new TextEncoder().encode(str);
      let binary = "";
      for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
      return btoa(binary);
    }
    if (platform === "grok") {
      const encoded = encodePayload(text);
      return `${GROK_URL}#gfc|${forceSend ? "1" : "0"}|${encoded}`;
    }
    if (platform === "chatgpt") {
      await GM_setValue("chatgpt_payload", text);
      await GM_setValue("chatgpt_force_send", forceSend);
      await GM_setValue("chatgpt_ts", Date.now());
      return `https://chatgpt.com/?prompt=${encodeURIComponent(text)}&temporary-chat=true`;
    }
    if (platform === "gemini") {
      await GM_setValue("gemini_payload", text);
      await GM_setValue("gemini_force_send", forceSend);
      await GM_setValue("gemini_ts", Date.now());
      const encoded = encodePayload(text);
      return `https://gemini.google.com/#gfc|${forceSend ? "1" : "0"}|${encoded}`;
    }
    if (platform === "meta") {
      await GM_setValue("meta_payload", text);
      await GM_setValue("meta_force_send", forceSend);
      await GM_setValue("meta_ts", Date.now());
      return `https://www.meta.ai/?q=${encodeURIComponent(text)}`;
    }
    console.warn(`[GrokCheck] buildTabUrl: unknown platform "${platform}"`);
    return null;
  }

  function getPlatformIcon(key) {
    return ICONS[key.toUpperCase()] || ICONS.ROBOT;
  }

  function showPlatformDropdown(anchorEl, textOrFn, btnEl, buildPayloadFor) {
    document.querySelector(".gfc-plat-drop")?.remove();

    const resolvePayload = typeof buildPayloadFor === "function"
      ? buildPayloadFor
      : () => (typeof textOrFn === "string" ? textOrFn : "");

    const platforms = getEnabledPlatforms();
    const rect = anchorEl.getBoundingClientRect();

    const drop = document.createElement("div");
    drop.className = "gfc-plat-drop";
    const dropEstHeight = platforms.length * 42 + 16;
    const showAbove = rect.top > dropEstHeight + 8;
    drop.style.cssText = showAbove
      ? `position:fixed;bottom:${window.innerHeight - rect.top + 8}px;left:${Math.max(4, rect.left - 8)}px;`
      : `position:fixed;top:${rect.bottom + 8}px;left:${Math.max(4, rect.left - 8)}px;box-shadow:0 4px 24px rgba(0,0,0,0.6);`;

    PLATFORM_DEFS.filter(p => platforms.includes(p.key)).forEach(({ key, name, color }) => {
      const item = document.createElement("button");
      item.className = "gfc-plat-item";

      const iconEl = document.createElement("span");
      iconEl.className = "gfc-plat-item-icon";
      iconEl.style.color = color;
      iconEl.innerHTML = getPlatformIcon(key);
      item.appendChild(iconEl);

      const nameEl = document.createElement("span");
      nameEl.innerText = key === "meta" ? `${name} (${LangSystem.getText("meta_login_notice")})` : name;
      item.appendChild(nameEl);

      item.addEventListener("click", async (e) => {
        e.stopPropagation();
        btnEl.innerHTML = getPlatformIcon(key);
        const payload = resolvePayload(key);
        const url = await buildTabUrl(key, payload, false);
        if (url) GM_openInTab(url, { active: getOpenBehavior(key) });
      });

      drop.appendChild(item);
    });

    document.body.appendChild(drop);

    const closeHandler = (e) => {
      if (!drop.contains(e.target) && e.target !== anchorEl) {
        drop.remove();
        document.removeEventListener("click", closeHandler, true);
      }
    };
    setTimeout(() => document.addEventListener("click", closeHandler, true), 0);
  }

  function createGrokButton(getUrlFn, isThreads = false, getContentFn = null, cloneSource = null) {
    const btn = cloneSource ? cloneSource.cloneNode(true) : document.createElement("button");
    btn.classList.add("my-grok-robot-btn");
    if (isThreads) btn.classList.add("threads-grok-btn");
    if (cloneSource) {
      btn.classList.add("tm-native-sized");
      btn.removeAttribute("data-testid");
      btn.removeAttribute("id");
      btn.querySelectorAll("[data-testid], [id]").forEach((_el) => { _el.removeAttribute("data-testid"); _el.removeAttribute("id"); });
      btn.querySelectorAll("button, [role=\"button\"]").forEach((_el) => _el.removeAttribute("disabled"));
      btn.setAttribute("role", "button");
    }
    const _initPlatforms = getEnabledPlatforms();
    btn.innerHTML = getPlatformIcon(
      (_initPlatforms.length === 1 && _initPlatforms[0] !== "grok") ? _initPlatforms[0] : "grok"
    );
    btn.title = LangSystem.getText("btn_title");
    let pressTimer = null;
    let isLongPress = false;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
    });
    btn.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      isLongPress = false;
      btn.style.transition = "transform 1s ease-out";
      pressTimer = setTimeout(() => {
        isLongPress = true;
        btn.innerHTML = ICONS.ROCKET;
        btn.classList.add("charging");
      }, 1000);
    });
    btn.addEventListener("mouseleave", () => {
      if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
      if (!isLongPress) {
        btn.classList.remove("charging");
        btn.style.transition = "all 0.2s";
        btn.style.transform = "scale(1)";
        if (btn.innerHTML !== ICONS.SENDING) {
          btn.innerHTML = getPlatformIcon(
            (_initPlatforms.length === 1 && _initPlatforms[0] !== "grok") ? _initPlatforms[0] : "grok"
          );
        }
      }
    });
    btn.addEventListener("mouseup", async (e) => {
      if (e.button !== 0) return;
      if (pressTimer) clearTimeout(pressTimer);
      e.stopPropagation();
      e.preventDefault();

      const url = getUrlFn();
      if (!url) return;

      const currentPrompt = LangSystem.getPrompt();
      const platforms = getEnabledPlatforms();

      function buildPayloadFor(_platform) {
        const content = getContentFn ? getContentFn() : "";
        if (content && content.trim()) {
          return `${currentPrompt}\n"${content.trim()}"\n\n${url}`;
        }
        return `${currentPrompt}${url}`;
      }

      btn.classList.remove("charging");
      btn.style.transition = "all 0.2s";
      btn.style.transform = "scale(1)";

      if (isLongPress) {
        const target = platforms.includes("grok") ? "grok" : platforms[0];
        btn.innerHTML = ICONS.SENDING;
        setTimeout(() => { btn.innerHTML = getPlatformIcon(target); }, 2000);
        const tabUrl = await buildTabUrl(target, buildPayloadFor(target), true);
        if (tabUrl) GM_openInTab(tabUrl, { active: getOpenBehavior(target) });
      } else if (platforms.length === 1) {
        const platform = platforms[0];
        btn.innerHTML = ICONS.SENDING;
        setTimeout(() => { btn.innerHTML = getPlatformIcon(platform); }, 2000);
        const tabUrl = await buildTabUrl(platform, buildPayloadFor(platform), false);
        if (tabUrl) GM_openInTab(tabUrl, { active: getOpenBehavior(platform) });
      } else {
        showPlatformDropdown(btn, url, btn, buildPayloadFor);
      }
    });
    return btn;
  }

  const AdapterX = {
    isMatch: () =>
      location.hostname.includes("twitter.com") ||
      location.hostname.includes("x.com"),
    init: () => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType !== 1) return;
            if (node.tagName === "ARTICLE") {
              AdapterX.insertBtn(node);
            } else {
              node.querySelectorAll?.("article").forEach(AdapterX.insertBtn);
              const ancestor = node.closest?.("article");
              if (ancestor) AdapterX.insertBtn(ancestor);
            }
          });
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });
      document.querySelectorAll("article").forEach(AdapterX.insertBtn);
    },
    insertBtn: (article) => {
      const toolbar = article.querySelector('div[role="group"]');
      if (!toolbar) return;
      if (toolbar.querySelector(".my-grok-robot-btn")) return;
      if (!article.querySelector('[data-testid="tweetText"]')) return;

      const getUrl = () => {
        const linkElement = article.querySelector('a[href*="/status/"] > time');
        if (linkElement) {
          let url = linkElement.parentElement.getAttribute("href");
          if (!url.startsWith("/")) url = "/" + url;
          return `https://x.com${url}`;
        }
        const fallback = article.querySelector('a[href*="/status/"]');
        if (fallback) {
          let url = fallback.getAttribute("href");
          return `https://x.com${url.startsWith("/") ? url : "/" + url}`;
        }
        return window.location.href;
      };

      const getContent = () => {
        const tweetTextEl = article.querySelector('[data-testid="tweetText"]');
        return tweetTextEl ? (tweetTextEl.innerText?.trim() || "") : "";
      };

      const _cloneSrc = toolbar.children[toolbar.children.length - 1] || null;
      const btn = createGrokButton(getUrl, false, getContent, _cloneSrc);
      toolbar.appendChild(btn);
    },
  };

  const AdapterThreads = {
    isMatch: () => location.hostname.includes("threads"),
    init: () => {
      AdapterThreads.scan();
      const observer = new MutationObserver(() => AdapterThreads.scan());
      observer.observe(document.body, { childList: true, subtree: true });
    },
    scan: () => {
      const svgs = document.querySelectorAll(
        'svg[aria-label*="分享"], svg[aria-label*="Share"], svg[aria-label*="Send"], svg[aria-label*="Repost"]',
      );
      svgs.forEach((svg) => {
        const btnRole = svg.closest('[role="button"]');
        if (!btnRole) return;
        const toolbar = btnRole.parentElement;
        if (!toolbar) return;
        if (toolbar.querySelector(".my-grok-robot-btn")) return;
        const postContainer = toolbar.closest('[data-pressable-container="true"]')
          || toolbar.closest('article')
          || toolbar.parentElement;
        const getContent = () => {
          if (!postContainer) return "";
          const langDiv = postContainer.querySelector("div[lang]");
          if (langDiv) {
            const t = langDiv.innerText?.trim();
            if (t) return t;
          }
          const textNodes = postContainer.querySelectorAll('span[dir="auto"], div[dir="auto"]');
          for (const node of textNodes) {
            const t = node.innerText?.trim();
            if (t && t.length > 5) return t;
          }
          return "";
        };
        const robotBtn = createGrokButton(
          () => AdapterThreads.getUrl(toolbar),
          true,
          getContent,
        );
        toolbar.appendChild(robotBtn);
      });
    },
    getUrl: (toolbarElement) => {
      let current = toolbarElement;
      for (let i = 0; i < 8; i++) {
        if (!current) break;
        const postLink = current.querySelector('a[href*="/post/"]');
        if (postLink) {
          const href = postLink.getAttribute("href");
          return `https://www.threads.net${href}`;
        }
        current = current.parentElement;
      }
      if (window.location.href.includes("/post/")) return window.location.href;
      return null;
    },
  };

  const AdapterBluesky = {
    isMatch: () => location.hostname === "bsky.app",
    init: () => {
      AdapterBluesky.scan();
      const observer = new MutationObserver(() => AdapterBluesky.scan());
      observer.observe(document.body, { childList: true, subtree: true });
      console.log("[GrokCheck] Bluesky adapter activated");
    },
    injectButton: (item, toolbar) => {
      if (toolbar.querySelector(".my-grok-robot-btn")) return;
      const robotBtn = createGrokButton(
        () => AdapterBluesky.getUrl(item),
        false,
        () => AdapterBluesky.getText(item),
      );
      const rightGroup = toolbar.lastElementChild;
      if (rightGroup) toolbar.insertBefore(robotBtn, rightGroup);
      else toolbar.appendChild(robotBtn);
    },
    scan: () => {
      const containerEls = document.querySelectorAll(
        '[data-testid^="feedItem-by-"], [data-testid^="postThreadItem-by-"]'
      );
      if (containerEls.length > 0) {
        containerEls.forEach((item) => {
          const replyBtn = item.querySelector('[data-testid="replyBtn"]');
          if (!replyBtn) return;
          const toolbar = replyBtn.parentElement?.parentElement;
          if (!toolbar) return;
          AdapterBluesky.injectButton(item, toolbar);
        });
      } else {
        document
          .querySelectorAll('[data-testid="replyBtn"]')
          .forEach((replyBtn) => {
            const toolbar = replyBtn.parentElement?.parentElement?.parentElement;
            const item    = toolbar?.parentElement;
            if (!toolbar || !item) return;
            if (!item.querySelector('[data-testid="postText"]')) return;
            AdapterBluesky.injectButton(item, toolbar);
          });
      }
    },
    getUrl: (item) => {
      const links = item.querySelectorAll('a[href*="/post/"]');
      if (links.length > 0) return links[0].href;
      return window.location.href;
    },
    getText: (item) => {
      const postTextEl = item.querySelector('[data-testid="postText"]');
      if (postTextEl) return postTextEl.innerText?.trim() || "";
      return "";
    },
  };

  const AdapterMastodon = {
    isMatch: () =>
      location.hostname.includes("mastodon") ||
      !!document.querySelector(
        ".status__action-bar, .detailed-status__action-bar",
      ),
    init: () => {
      AdapterMastodon.scan();
      const observer = new MutationObserver(() => AdapterMastodon.scan());
      observer.observe(document.body, { childList: true, subtree: true });
      console.log("[GrokCheck] Mastodon adapter activated");
    },
    scan: () => {
      document
        .querySelectorAll(".status__action-bar, .detailed-status__action-bar")
        .forEach((bar) => {
          if (bar.querySelector(".my-grok-robot-btn")) return;
          const post = bar.closest(".status, .detailed-status");
          if (!post) return;
          if (post.classList.contains("status-reply")) return;

          const robotBtn = createGrokButton(
            () => AdapterMastodon.getUrl(post),
            false,
            () => {
              const contentEl = post.querySelector('.status__content p, .status__content__text');
              return contentEl ? (contentEl.innerText?.trim() || "") : "";
            },
          );
          robotBtn.style.marginLeft = "8px";

          const lastWrapper = bar.querySelector(
            ".status__action-bar__button-wrapper:last-child",
          );
          if (lastWrapper) lastWrapper.after(robotBtn);
          else bar.appendChild(robotBtn);
        });
    },
    getUrl: (post) => {
      const link = post.querySelector('a[href*="/@"][href*="/"]');
      if (link) return link.href;
      return window.location.href;
    },
  };

  function decodeGfcHash(hash, label) {
    if (!hash.startsWith("#gfc|")) return null;
    try {
      const parts = hash.slice(1).split("|");
      if (parts.length < 3) return null;
      const forceSend = parts[1] === "1";
      const bytes = Uint8Array.from(atob(parts.slice(2).join("|")), c => c.charCodeAt(0));
      const payload = new TextDecoder().decode(bytes);
      if (payload.length > 5000 || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(payload)) {
        console.warn(`[GrokCheck] ${label}: suspicious payload rejected (length or control chars).`);
        return null;
      }
      return { forceSend, payload };
    } catch (e) { return null; }
  }

  function init() {
    console.log(`[GrokCheck] init() 啟動，hostname=${window.location.hostname}`);
    registerMenus();
    if (!GM_getValue("cfg_lang_code")) {
      let defaultCode = "en";
      const navLang = navigator.language.toLowerCase();
      if (navLang.includes("zh-hant") || navLang.includes("zh-tw") || navLang.includes("zh-hk")) defaultCode = "zh-TW";
      else if (navLang.includes("zh-hans") || navLang.includes("zh-cn") || navLang.includes("zh")) defaultCode = "zh-CN";
      else if (navLang.includes("ja")) defaultCode = "ja";
      else if (navLang.includes("ko")) defaultCode = "ko";
      else if (navLang.includes("pt")) defaultCode = "pt-BR";
      else if (navLang.includes("fr")) defaultCode = "fr";
      else if (navLang.includes("es")) defaultCode = "es";

      GM_setValue("cfg_lang_code", defaultCode);
      console.log(
        `[GrokCheck] First run detected. Language auto-detected: ${defaultCode}.`,
      );
    }

    if (window.location.href.includes("/i/grok")) {
      function parseHashPayload() {
        return decodeGfcHash(location.hash, "Grok");
      }

      function tryRunAutomation(retriesLeft) {
        const hashData = parseHashPayload();
        if (hashData) {
          runGrokAutomation(hashData);
        } else if (retriesLeft > 0) {
          setTimeout(() => tryRunAutomation(retriesLeft - 1), 200);
        }
      }

      const safeRunAutomation = () => {
        try {
          tryRunAutomation(25);
        } catch (err) {
          console.error("[GrokCheck] Automation error:", err);
        }
      };

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () =>
          setTimeout(safeRunAutomation, 800),
        );
      } else {
        setTimeout(safeRunAutomation, 800);
      }
      let _obsDebounce = null;
      const obs = new MutationObserver(() => {
        if (_obsDebounce) return;
        _obsDebounce = setTimeout(() => {
          _obsDebounce = null;
          removeGrokAds();
        }, 200);
      });
      obs.observe(document.body, { childList: true, subtree: true });

      window.addEventListener('beforeunload', () => {
        obs.disconnect();
      });
    } else if (window.location.hostname === "chatgpt.com") {
      const ts       = GM_getValue("chatgpt_ts", 0);
      const isRecent = (Date.now() - ts) < 30000;
      const payload = GM_getValue("chatgpt_payload", "");
      if (isRecent && payload) {
        const forceSend = GM_getValue("chatgpt_force_send", false);
        GM_setValue("chatgpt_ts", 0);
        GM_setValue("chatgpt_payload", "");
        GM_setValue("chatgpt_force_send", false);
        const delay = document.readyState === "loading" ? 2000 : 1500;
        const run = () => setTimeout(() => runChatGPTAutomation(forceSend, payload), delay);
        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", run);
        } else {
          run();
        }
      }
    } else if (window.location.hostname === "www.meta.ai") {
      const ts       = GM_getValue("meta_ts", 0);
      const isRecent = (Date.now() - ts) < 30000;
      const payload  = GM_getValue("meta_payload", "");
      console.log(`[GrokCheck][Meta] hostname 分流觸發，ts=${ts}，isRecent=${isRecent}，payload長度=${payload.length}`);
      if (isRecent && payload) {
        const forceSend = GM_getValue("meta_force_send", false);
        console.log(`[GrokCheck][Meta] 條件成立，forceSend=${forceSend}，即將排程 runMetaAutomation`);
        GM_setValue("meta_ts", 0);
        GM_setValue("meta_payload", "");
        GM_setValue("meta_force_send", false);
        const delay = document.readyState === "loading" ? 2000 : 1500;
        const run = () => setTimeout(() => runMetaAutomation(payload, forceSend), delay);
        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", run);
        } else {
          run();
        }
      } else {
        console.warn("[GrokCheck][Meta] 條件不成立，automation 不會執行（isRecent 為 false 或 payload 為空）");
      }
    } else if (window.location.hostname === "gemini.google.com") {
      function parseGeminiHashPayload() {
        return decodeGfcHash(location.hash, "Gemini");
      }

      function tryRunGemini() {
        const data = parseGeminiHashPayload();
        if (data) {
          runGeminiAutomation(data.payload, data.forceSend);
          return;
        }
        const ts      = GM_getValue("gemini_ts", 0);
        const payload = GM_getValue("gemini_payload", "");
        const force   = GM_getValue("gemini_force_send", false);
        if (payload && (Date.now() - ts) < 30000) {
          GM_setValue("gemini_payload", "");
          GM_setValue("gemini_force_send", false);
          GM_setValue("gemini_ts", 0);
          runGeminiAutomation(payload, force);
        }
      }

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => setTimeout(tryRunGemini, 1500));
      } else {
        setTimeout(tryRunGemini, 1500);
      }
    } else {
      if (AdapterBluesky.isMatch()) {
        AdapterBluesky.init();
      } else if (AdapterThreads.isMatch()) {
        console.log("[GrokCheck] Threads adapter activated");
        AdapterThreads.init();
      } else if (AdapterX.isMatch()) {
        console.log("[GrokCheck] X adapter activated");
        AdapterX.init();
      } else {
        const mastodonObserver = new MutationObserver(() => {
          if (
            document.querySelector(
              ".status__action-bar, .detailed-status__action-bar",
            )
          ) {
            mastodonObserver.disconnect();
            AdapterMastodon.init();
          }
        });
        mastodonObserver.observe(document.body, {
          childList: true,
          subtree: true,
        });
        if (
          document.querySelector(
            ".status__action-bar, .detailed-status__action-bar",
          )
        ) {
          mastodonObserver.disconnect();
          AdapterMastodon.init();
        }
      }
    }
  }

  init();
})();