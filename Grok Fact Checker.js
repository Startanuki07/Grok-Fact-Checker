// ==UserScript==
// @name         Grok Fact Checker
// @name:zh-TW   Grok 事實查核器
// @name:zh-CN   Grok 事实核查器
// @name:ja      Grok ファクトチェッカー
// @name:ko      Grok 팩트체커
// @name:es      Grok Verificador de Datos
// @name:pt-BR   Grok Verificador de Fatos
// @name:fr      Grok Vérificateur de Faits
// @namespace    https://greasyfork.org/en/users/1575945-star-tanuki07?locale_override=1
// @namespace    https://github.com/Startanuki07
// @version      1.3
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
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @description      Adds a 🤖 fact-check button to every post on X (Twitter), Threads, Bluesky, and Mastodon. Click to open Grok in a new private tab with a pre-filled prompt and post URL — privacy mode and focus mode are applied automatically. Long-press for instant auto-send. Includes Grok ad removal and multi-language auto-detection. Best suited for users who occasionally encounter unfamiliar news or claims and want a quick, discreet way to verify them.
// @description:zh-TW 在 X (Twitter)、Threads、Bluesky 與 Mastodon 每則貼文旁加入 🤖 事實查核按鈕。點擊後自動在新分頁以私人模式開啟 Grok，填入查核 Prompt 與貼文網址，並自動切換隱私模式與專注模式，不留查核紀錄。長按可強制自動送出。附帶自動移除 Grok 廣告、多語言自動偵測。適合偶爾看到不確定的資訊、想低調快速查核的一般用戶。
// @description:zh-CN 在 X (Twitter)、Threads、Bluesky 与 Mastodon 每条帖子旁添加 🤖 事实核查按钮。点击后自动在新标签页以隐私模式打开 Grok，填入查核 Prompt 与帖子链接，并自动切换隐私模式与专注模式，不留查核记录。长按可强制自动发送。附带自动移除 Grok 广告、多语言自动检测。适合偶尔遇到存疑信息、想低调快速核查的普通用户。
// @description:ja    X (Twitter)・Threads・Bluesky・Mastodon の各投稿に 🤖 ファクトチェックボタンを追加。クリックで新しいタブにプライベートモードで Grok を起動し、プロンプトと投稿 URL を自動入力。プライバシーモードと集中モードも自動で適用されるため、チェック履歴が残りません。長押しで強制自動送信。Grok 広告の自動除去・多言語自動検出にも対応。
// @description:ko    X (Twitter)・Threads・Bluesky・Mastodon 의 모든 게시물에 🤖 팩트체크 버튼을 추가합니다. 클릭하면 새 탭에서 비공개 모드로 Grok을 열고 프롬프트와 게시물 URL을 자동 입력합니다. 개인정보 모드와 집중 모드가 자동으로 적용되어 조회 기록이 남지 않습니다. 길게 누르면 강제 자동 전송. Grok 광고 자동 제거 및 다국어 자동 감지 지원.
// @description:es    Añade un botón 🤖 de verificación de datos a cada publicación en X (Twitter), Threads, Bluesky y Mastodon. Al hacer clic, abre Grok en una nueva pestaña privada con un prompt prellenado y la URL de la publicación. El modo privado y el modo enfoque se aplican automáticamente. Mantén presionado para envío automático instantáneo. Incluye eliminación de anuncios de Grok y detección automática de idioma.
// @description:pt-BR Adiciona um botão 🤖 de verificação de fatos a cada publicação no X (Twitter), Threads, Bluesky e Mastodon. Clique para abrir o Grok em uma nova aba privada com um prompt pré-preenchido e a URL da publicação. O modo privado e o modo foco são aplicados automaticamente. Pressione e segure para envio automático instantâneo. Inclui remoção de anúncios do Grok e detecção automática de idioma.
// @description:fr    Ajoute un bouton 🤖 de vérification des faits à chaque publication sur X (Twitter), Threads, Bluesky et Mastodon. Cliquez pour ouvrir Grok dans un nouvel onglet privé avec un prompt prérempli et l'URL de la publication. Le mode privé et le mode concentration sont appliqués automatiquement. Maintenez appuyé pour un envoi automatique instantané. Inclut la suppression des publicités Grok et la détection automatique de la langue.
// ==/UserScript==

(function () {
  "use strict";

  const LANG_DICT = {
    "zh-TW": {
      name: "🇹🇼 繁體中文 (Traditional Chinese)",
      prompt:
        "請進行事實查核，詳細分析以下這則貼文的真實性，並指出可能的錯誤或誤導資訊：\n",
      ui: {
        menu_auto: "⚙️ 預設自動送出",
        menu_lang: "⚙️ 設定選項及切換語言",
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
        unsaved_title: "有未儲存的變更",
        unsaved_save_close: "💾 儲存並關閉",
        unsaved_discard: "不儲存，直接關閉",
        unsaved_cancel: "取消",
        platform_section: "🤖 AI 平台選擇",
        platform_at_least_one: "⚠️ 至少需要選擇一個平台",
        btn_title: "點擊：查核 ／ 長按 1 秒：強制自動送出",
        close_btn: "❌ 關閉",
      },
    },
    "zh-CN": {
      name: "🇨🇳 简体中文 (Simplified Chinese)",
      prompt:
        "请进行事实核查，详细分析以下帖子的真实性，并指出可能的错误或误导信息：\n",
      ui: {
        menu_auto: "⚙️ 默认自动发送",
        menu_lang: "⚙️ 设置选项及切换语言",
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
        highlight_url_checkbox: "填入後反白貼文链接（方便手动删除）",
        unsaved_title: "有未保存的更改",
        unsaved_save_close: "💾 保存并关闭",
        unsaved_discard: "不保存，直接关闭",
        unsaved_cancel: "取消",
        platform_section: "🤖 AI 平台选择",
        platform_at_least_one: "⚠️ 至少需要选择一个平台",
        btn_title: "点击：核查 ／ 长按 1 秒：强制自动发送",
        close_btn: "❌ 关闭",
      },
    },
    en: {
      name: "🇺🇸 English",
      prompt:
        "Please fact-check this post. Analyze its authenticity in detail and point out any potential errors or misleading information:\n",
      ui: {
        menu_auto: "⚙️ Auto Send",
        menu_lang: "⚙️ Settings & Language",
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
        unsaved_title: "You have unsaved changes",
        unsaved_save_close: "💾 Save & Close",
        unsaved_discard: "Discard & Close",
        unsaved_cancel: "Cancel",
        platform_section: "🤖 AI Platform",
        platform_at_least_one: "⚠️ At least one platform must be selected",
        btn_title: "Click: Fact-check / Hold 1s: Force Auto-send",
        close_btn: "❌ Close",
      },
    },
    ja: {
      name: "🇯🇵 日本語 (Japanese)",
      prompt:
        "以下の投稿の事実確認（ファクトチェック）を行ってください。信憑性を詳細に分析し、誤りや誤解を招く情報があれば指摘してください：\n",
      ui: {
        menu_auto: "⚙️ 自動送信",
        menu_lang: "⚙️ 設定と言語切替",
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
        unsaved_title: "保存されていない変更があります",
        unsaved_save_close: "💾 保存して閉じる",
        unsaved_discard: "保存せずに閉じる",
        unsaved_cancel: "キャンセル",
        platform_section: "🤖 AIプラットフォーム選択",
        platform_at_least_one: "⚠️ 少なくとも1つのプラットフォームを選択してください",
        btn_title: "クリック：ファクトチェック ／ 長押し 1秒：強制自動送信",
        close_btn: "❌ 閉じる",
      },
    },
    ko: {
      name: "🇰🇷 한국어 (Korean)",
      prompt:
        "다음 게시물의 사실 여부를 확인해 주세요. 진위를 자세히 분석하고 오류나 오해의 소지가 있는 정보를 지적해 주세요:\n",
      ui: {
        menu_auto: "⚙️ 자동 전송",
        menu_lang: "⚙️ 설정 및 언어 전환",
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
        unsaved_title: "저장되지 않은 변경 사항이 있습니다",
        unsaved_save_close: "💾 저장 후 닫기",
        unsaved_discard: "저장 안 하고 닫기",
        unsaved_cancel: "취소",
        platform_section: "🤖 AI 플랫폼 선택",
        platform_at_least_one: "⚠️ 최소 하나의 플랫폼을 선택해야 합니다",
        btn_title: "클릭: 팩트체크 / 1초 길게 누르기: 강제 자동 전송",
        close_btn: "❌ 닫기",
      },
    },
    es: {
      name: "🇪🇸 Español (Spanish)",
      prompt:
        "Por favor, verifica los datos de esta publicación. Analiza su autenticidad en detalle y señala cualquier posible error o información engañosa:\n",
      ui: {
        menu_auto: "⚙️ Envío automático",
        menu_lang: "⚙️ Configuración e idioma",
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
        unsaved_title: "Hay cambios sin guardar",
        unsaved_save_close: "💾 Guardar y cerrar",
        unsaved_discard: "Cerrar sin guardar",
        unsaved_cancel: "Cancelar",
        platform_section: "🤖 Plataforma AI",
        platform_at_least_one: "⚠️ Se debe seleccionar al menos una plataforma",
        btn_title: "Clic: Verificar / Mantener 1s: Envío automático forzado",
        close_btn: "❌ Cerrar",
      },
    },
    "pt-BR": {
      name: "🇧🇷 Português BR (Portuguese)",
      prompt:
        "Por favor, verifique os fatos desta publicação. Analise sua autenticidade em detalhes e aponte possíveis erros ou informações enganosas:\n",
      ui: {
        menu_auto: "⚙️ Envio automático",
        menu_lang: "⚙️ Configurações e idioma",
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
        unsaved_title: "Há alterações não salvas",
        unsaved_save_close: "💾 Salvar e fechar",
        unsaved_discard: "Fechar sem salvar",
        unsaved_cancel: "Cancelar",
        platform_section: "🤖 Plataforma AI",
        platform_at_least_one: "⚠️ Pelo menos uma plataforma deve ser selecionada",
        btn_title: "Clique: Verificar / Segurar 1s: Envio automático forçado",
        close_btn: "❌ Fechar",
      },
    },
    fr: {
      name: "🇫🇷 Français (French)",
      prompt:
        "Veuillez vérifier les faits de cette publication. Analysez son authenticité en détail et signalez toute erreur potentielle ou information trompeuse :\n",
      ui: {
        menu_auto: "⚙️ Envoi automatique",
        menu_lang: "⚙️ Paramètres et langue",
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
        unsaved_title: "Des modifications non enregistrées existent",
        unsaved_save_close: "💾 Enregistrer et fermer",
        unsaved_discard: "Fermer sans enregistrer",
        unsaved_cancel: "Annuler",
        platform_section: "🤖 Plateforme AI",
        platform_at_least_one: "⚠️ Au moins une plateforme doit être sélectionnée",
        btn_title: "Clic : Vérifier / Maintenir 1s : Envoi automatique forcé",
        close_btn: "❌ Fermer",
      },
    },
  };

  const LangSystem = {
    getKey: () => GM_getValue("cfg_lang_code", null),
    setKey: (code) => {
      if (LANG_DICT[code]) GM_setValue("cfg_lang_code", code);
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

    getCurrent: () => {
      const code = LangSystem.getKey();
      if (code && LANG_DICT[code]) return LANG_DICT[code];

      const browserLang = navigator.language;
      if (browserLang.includes("zh-CN")) return LANG_DICT["zh-CN"];
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
      const custom = LangSystem.getCustom();
      if (custom && custom.ui[key]) return custom.ui[key];
      const dict = LangSystem.getCurrent();
      return dict.ui[key] || LANG_DICT["zh-TW"].ui[key] || key;
    },

    getPrompt: () => {
      if (GM_getValue("cfg_custom_prompt_enabled", false)) {
        const custom = GM_getValue("cfg_custom_prompt", "").trim();
        if (custom) return custom + "\n";
      }
      const customLang = LangSystem.getCustom();
      if (customLang && customLang.prompt) return customLang.prompt;
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
  };
  ICONS.GROK = ICONS.ROBOT;

  function registerMenus() {
    const isAutoSend = GM_getValue("cfg_auto_send", false);
    const autoSendText = isAutoSend ? "✅ ON" : "❌ OFF";
    GM_registerMenuCommand(
      `${LangSystem.getText("menu_auto")}: ${autoSendText}`,
      () => {
        GM_setValue("cfg_auto_send", !isAutoSend);
        location.reload();
      },
    );
    GM_registerMenuCommand(LangSystem.getText("menu_lang"), () => {
      showLanguageSelectionUI();
    });
  }

  const style = document.createElement("style");
  style.textContent = `
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
            padding: 20px; width: 300px; display: flex; flex-direction: column; gap: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }
        .grok-lang-title { color: #e7e9ea; font-size: 18px; font-weight: bold; text-align: center; margin-bottom: 8px; }
        .grok-lang-btn {
            background: transparent; border: 1px solid #536471; color: #e7e9ea;
            padding: 10px; border-radius: 8px; cursor: pointer; transition: all 0.2s; font-size: 14px;
            text-align: left;
        }
        .grok-lang-btn:hover { background: rgba(29, 155, 240, 0.1); border-color: #1d9bf0; color: #1d9bf0; }
        .grok-lang-btn.active { background: #1d9bf0; border-color: #1d9bf0; color: white; }

        .grok-settings-divider { border: none; border-top: 1px solid #2f3336; margin: 8px 0; }
        .grok-settings-section-label {
            color: #8899a6; font-size: 12px; font-weight: 600; text-transform: uppercase;
            letter-spacing: 0.8px; padding: 4px 0 6px; margin-top: 4px;
        }
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
        .grok-lang-panel { max-height: 90vh; overflow-y: auto; overflow-x: visible; transform: translateZ(0); }

        .grok-lang-list {
            max-height: 220px; overflow-y: auto; overflow-x: hidden;
            -webkit-overflow-scrolling: touch; display: flex; flex-direction: column; gap: 12px;
            margin: 0 -2px; padding: 2px;
        }
        .grok-lang-list::-webkit-scrollbar { width: 4px; }
        .grok-lang-list::-webkit-scrollbar-track { background: transparent; }
        .grok-lang-list::-webkit-scrollbar-thumb { background: #536471; border-radius: 2px; }

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
            z-index: 10;
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
    `;
  document.head.appendChild(style);

  function findAny(selectors, root = document) {
    for (const selector of selectors) {
      const el = root.querySelector(selector);
      if (el) return el;
    }
    return null;
  }

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
        if (btn) btn.style.display = "none";
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
  const CURTAIN_ENABLED = true;

  function showCurtain(initialText, subText = "") {
    if (!CURTAIN_ENABLED) return;
    const old = document.querySelector(".grok-curtain-overlay");
    if (old) old.parentNode?.removeChild(old);

    curtainElement = document.createElement("div");
    curtainElement.className = "grok-curtain-overlay";
    curtainMsgElement = document.createElement("div");
    curtainMsgElement.className = "grok-curtain-text";
    curtainMsgElement.innerHTML = initialText;
    curtainSubElement = document.createElement("div");
    curtainSubElement.className = "grok-curtain-sub";
    curtainSubElement.innerHTML = subText;
    curtainElement.appendChild(curtainMsgElement);
    curtainElement.appendChild(curtainSubElement);
    document.body.appendChild(curtainElement);

    setTimeout(() => hideCurtain(0), 1800);
  }

  function updateCurtainText(text, sub = null) {
    if (!CURTAIN_ENABLED) return;
    if (curtainMsgElement) curtainMsgElement.innerHTML = text;
    if (sub !== null && curtainSubElement) curtainSubElement.innerHTML = sub;
  }

  function hideCurtain(delay = 500) {
    if (!CURTAIN_ENABLED) return;
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

  function showLanguageSelectionUI() {
    if (document.querySelector(".grok-curtain-overlay")) {
      const existing = document.querySelector(".grok-curtain-overlay");
      existing.parentNode.removeChild(existing);
    }
    const overlay = document.createElement("div");
    overlay.className = "grok-curtain-overlay";
    const panel = document.createElement("div");
    panel.className = "grok-lang-panel";
    panel.style.width = "460px";
    panel.style.position = "relative";

    const title = document.createElement("div");
    title.className = "grok-lang-title";
    title.innerText = LangSystem.getText("settings_title");
    panel.appendChild(title);

    const customLabel = document.createElement("div");
    customLabel.className = "grok-settings-section-label";
    customLabel.innerText = LangSystem.getText("custom_prompt_section");
    panel.appendChild(customLabel);

    const checkRow = document.createElement("label");
    checkRow.className = "grok-custom-checkbox-row";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = GM_getValue("cfg_custom_prompt_enabled", false);
    const checkLabel = document.createElement("span");
    checkLabel.innerText = LangSystem.getText("custom_prompt_checkbox");
    checkRow.appendChild(checkbox);
    checkRow.appendChild(checkLabel);
    panel.appendChild(checkRow);

    const textarea = document.createElement("textarea");
    textarea.className = "grok-custom-textarea";
    textarea.placeholder = LangSystem.getText("custom_prompt_placeholder");
    textarea.value = GM_getValue("cfg_custom_prompt", "");
    textarea.style.display = checkbox.checked ? "block" : "none";
    textarea.style.height = "88px";
    textarea.style.minHeight = "88px";
    textarea.style.resize = "none";
    panel.appendChild(textarea);

    checkbox.addEventListener("change", () => {
      textarea.style.display = checkbox.checked ? "block" : "none";
    });

    const highlightRow = document.createElement("label");
    highlightRow.className = "grok-custom-checkbox-row";
    highlightRow.style.marginTop = "6px";
    const highlightChk = document.createElement("input");
    highlightChk.type = "checkbox";
    highlightChk.checked = GM_getValue("cfg_highlight_url", false);
    const highlightLabel = document.createElement("span");
    highlightLabel.innerText = LangSystem.getText("highlight_url_checkbox");
    highlightRow.appendChild(highlightChk);
    highlightRow.appendChild(highlightLabel);
    panel.appendChild(highlightRow);

    const platformLabel = document.createElement("div");
    platformLabel.className = "grok-settings-section-label";
    platformLabel.style.marginTop = "6px";
    platformLabel.innerText = LangSystem.getText("platform_section");
    panel.appendChild(platformLabel);

    const enabledPlatformsInit = getEnabledPlatforms();
    const platformCheckboxes = {};
    const PLAT_COLORS = { grok: "#1d9bf0", chatgpt: "#10a37f", gemini: "#8b5cf6" };

    const EXPERIMENTAL_WARN_MSG = {
      chatgpt: {
        "zh-TW": "⚠️ ChatGPT 目前為實驗性支援\n\nChatGPT 無法直接解析貼文網址，腳本會改將貼文內文填入查核指令。若無法擷取內文，將自動 fallback 到網址。\n\n確定要開啟 ChatGPT 選項嗎？",
        "zh-CN": "⚠️ ChatGPT 目前为实验性支持\n\nChatGPT 无法直接解析帖子链接，脚本会将帖子内文填入查核指令。若无法提取内文，将自动 fallback 到链接。\n\n确定要开启 ChatGPT 选项吗？",
        "ja":    "⚠️ ChatGPT は現在実験的なサポートです\n\nChatGPT は投稿 URL を直接解析できないため、スクリプトが投稿本文をプロンプトに挿入します。本文が取得できない場合は URL にフォールバックします。\n\nChatGPT を有効にしますか？",
        "ko":    "⚠️ ChatGPT는 현재 실험적으로 지원됩니다\n\nChatGPT는 게시물 URL을 직접 분석할 수 없어 스크립트가 게시물 본문을 프롬프트에 삽입합니다. 본문을 가져올 수 없으면 URL로 폴백됩니다.\n\nChatGPT를 활성화하시겠습니까?",
        "en":    "⚠️ ChatGPT is currently experimental\n\nChatGPT cannot parse post URLs directly. The script will insert the post content into the prompt instead. If content cannot be extracted, it will fall back to the URL.\n\nEnable ChatGPT anyway?",
        "es":    "⚠️ ChatGPT es actualmente experimental\n\nChatGPT no puede analizar URLs de publicaciones directamente. El script insertará el contenido de la publicación en el prompt. Si no se puede extraer el contenido, se usará la URL.\n\n¿Activar ChatGPT de todas formas?",
        "pt-BR": "⚠️ ChatGPT é experimental no momento\n\nO ChatGPT não consegue analisar URLs de publicações diretamente. O script inserirá o conteúdo da publicação no prompt. Se não for possível extrair o conteúdo, usará a URL.\n\nAtivar ChatGPT mesmo assim?",
        "fr":    "⚠️ ChatGPT est actuellement expérimental\n\nChatGPT ne peut pas analyser directement les URL de publications. Le script insérera le contenu de la publication dans le prompt. Si le contenu ne peut pas être extrait, l'URL sera utilisée.\n\nActiver ChatGPT quand même ?",
      },
      gemini: {
        "zh-TW": "⚠️ Gemini 目前不支援模版自動填入功能\n\n跳轉後需手動貼上內容，且無法自動切換暫時聊天模式。\n\n確定要強制開啟 Gemini 選項嗎？",
        "zh-CN": "⚠️ Gemini 目前不支持模板自动填入功能\n\n跳转后需手动粘贴内容，且无法自动切换临时聊天模式。\n\n确定要强制开启 Gemini 选项吗？",
        "ja":    "⚠️ Gemini は現在テンプレートの自動入力に対応していません\n\n開いた後は手動でテキストを貼り付けてください。一時チャットへの自動切替もできません。\n\nGemini を強制的に有効にしますか？",
        "ko":    "⚠️ Gemini는 현재 템플릿 자동 입력을 지원하지 않습니다\n\n열린 후 수동으로 내용을 붙여넣으세요. 임시 채팅 자동 전환도 불가합니다.\n\nGemini를 강제로 활성화하시겠습니까？",
        "en":    "⚠️ Gemini does not currently support auto-fill templates.\n\nYou will need to paste the content manually after opening. Automatic Temporary Chat switching is also unavailable.\n\nForce-enable Gemini anyway?",
        "es":    "⚠️ Gemini no admite actualmente el relleno automático de plantillas.\n\nDeberás pegar el contenido manualmente. El cambio automático al chat temporal tampoco está disponible.\n\n¿Forzar la activación de Gemini?",
        "pt-BR": "⚠️ O Gemini não suporta preenchimento automático de modelos no momento.\n\nVocê precisará colar o conteúdo manualmente. A troca automática para chat temporário também não está disponível.\n\nForçar ativação do Gemini mesmo assim?",
        "fr":    "⚠️ Gemini ne prend pas en charge le remplissage automatique des modèles pour le moment.\n\nVous devrez coller le contenu manuellement. La bascule automatique vers le chat temporaire n'est pas disponible non plus.\n\nForcer l'activation de Gemini quand même ?",
      },
    };

    const EXPERIMENTAL_KEYS = new Set(["chatgpt", "gemini"]);

    PLATFORM_DEFS.forEach(({ key, name }) => {
      const row = document.createElement("label");
      row.className = "grok-custom-checkbox-row";
      const chk = document.createElement("input");
      chk.type = "checkbox";
      chk.checked = enabledPlatformsInit.includes(key);
      chk.style.accentColor = PLAT_COLORS[key];

      if (EXPERIMENTAL_KEYS.has(key)) {
        row.style.opacity = chk.checked ? "1" : "0.4";
        row.style.filter  = chk.checked ? "none" : "grayscale(0.6)";
        chk.addEventListener("change", () => {
          if (chk.checked) {
            const langCode = LangSystem.getKey() || "en";
            const msgMap = EXPERIMENTAL_WARN_MSG[key];
            const msg = msgMap[langCode] || msgMap["en"];
            if (!confirm(msg)) {
              chk.checked = false;
              row.style.opacity = "0.4";
              row.style.filter  = "grayscale(0.6)";
            } else {
              row.style.opacity = "1";
              row.style.filter  = "none";
            }
          } else {
            row.style.opacity = "0.4";
            row.style.filter  = "grayscale(0.6)";
          }
        });
      }

      const iconEl = document.createElement("span");
      iconEl.style.cssText = `width:16px;height:16px;display:inline-flex;align-items:center;flex-shrink:0;color:${PLAT_COLORS[key]};`;
      iconEl.innerHTML = getPlatformIcon(key);

      const nameEl = document.createElement("span");
      if (EXPERIMENTAL_KEYS.has(key)) {
        nameEl.innerHTML = `${name} <span style="color:#f4212e;font-size:11px;font-weight:600;">(⚠️ 實驗性)</span>`;
      } else {
        nameEl.innerText = name;
      }

      const wrapper = document.createElement("span");
      wrapper.style.cssText = "display:inline-flex;align-items:center;gap:6px;";
      wrapper.appendChild(iconEl);
      wrapper.appendChild(nameEl);

      row.appendChild(chk);
      row.appendChild(wrapper);
      panel.appendChild(row);
      platformCheckboxes[key] = chk;
    });

    const platformWarn = document.createElement("div");
    platformWarn.style.cssText = "color:#f4212e;font-size:12px;display:none;padding:4px 0;";
    platformWarn.innerText = LangSystem.getText("platform_at_least_one");
    panel.appendChild(platformWarn);

    Object.values(platformCheckboxes).forEach(chk => {
      chk.addEventListener("change", () => {
        const anyChecked = Object.values(platformCheckboxes).some(c => c.checked);
        platformWarn.style.display = anyChecked ? "none" : "block";
      });
    });

    const saveBtn = document.createElement("button");
    saveBtn.className = "grok-save-btn";
    saveBtn.innerText = LangSystem.getText("custom_prompt_save");
    saveBtn.onclick = () => {
      GM_setValue("cfg_custom_prompt_enabled", checkbox.checked);
      GM_setValue("cfg_custom_prompt", textarea.value.trim());
      GM_setValue("cfg_highlight_url", highlightChk.checked);
      saveBtn.innerText = LangSystem.getText("custom_prompt_saved");
      saveBtn.classList.add("saved");
      setTimeout(() => {
        saveBtn.innerText = LangSystem.getText("custom_prompt_save");
        saveBtn.classList.remove("saved");
      }, 2000);
    };
    panel.appendChild(saveBtn);

    const divider = document.createElement("hr");
    divider.className = "grok-settings-divider";
    panel.appendChild(divider);

    const langLabel = document.createElement("div");
    langLabel.className = "grok-settings-section-label";
    langLabel.innerText = LangSystem.getText("lang_section_title");
    panel.appendChild(langLabel);

    const currentCode = GM_getValue("cfg_lang_code", "zh-TW");
    const langList = document.createElement("div");
    langList.className = "grok-lang-list";
    Object.keys(LANG_DICT).forEach((code) => {
      const btn = document.createElement("button");
      btn.className = "grok-lang-btn";
      if (code === currentCode) btn.classList.add("active");
      btn.innerText = LANG_DICT[code].name;
      btn.onclick = () => {
        LangSystem.setKey(code);
        setTimeout(() => location.reload(), 150);
      };
      langList.appendChild(btn);
    });
    panel.appendChild(langList);

    buildCustomLangSection(panel);

    const initialState = {
      enabled:   GM_getValue("cfg_custom_prompt_enabled", false),
      prompt:    GM_getValue("cfg_custom_prompt", "").trim(),
      highlight: GM_getValue("cfg_highlight_url", false),
      platforms: GM_getValue("cfg_platforms", '["grok","chatgpt","gemini"]'),
    };

    function hasUnsavedChanges() {
      const currentPlatforms = JSON.stringify(
        PLATFORM_DEFS.map(p => p.key).filter(k => platformCheckboxes[k]?.checked)
      );
      return (
        checkbox.checked      !== initialState.enabled   ||
        textarea.value.trim() !== initialState.prompt    ||
        highlightChk.checked  !== initialState.highlight ||
        currentPlatforms      !== initialState.platforms
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

    const closeBtn = document.createElement("button");
    closeBtn.className = "grok-lang-btn";
    closeBtn.innerText = LangSystem.getText("close_btn");
    closeBtn.style.textAlign = "center";
    closeBtn.style.marginTop = "10px";
    closeBtn.onclick = () => {
      if (hasUnsavedChanges()) {
        showUnsavedDialog();
      } else {
        doClose();
      }
    };
    panel.appendChild(closeBtn);

    overlay.appendChild(panel);
    document.body.appendChild(overlay);
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

  function buildCustomLangSection(panel) {
    const divider = document.createElement("hr");
    divider.className = "grok-settings-divider";
    panel.appendChild(divider);

    const sectionLabel = document.createElement("div");
    sectionLabel.className = "grok-settings-section-label";
    sectionLabel.innerText = "\u270f\ufe0f Custom Language";
    panel.appendChild(sectionLabel);

    const statusRow = document.createElement("div");
    statusRow.style.cssText = "font-size:12px;color:#8899a6;padding:2px 0 8px;";
    const existing = LangSystem.getCustom();
    statusRow.innerText = existing
      ? "Loaded: " + (existing.langName || "Custom")
      : "No custom language loaded.";
    panel.appendChild(statusRow);

    const btnRow = document.createElement("div");
    btnRow.style.cssText = "display:flex;gap:8px;";

    const exportBtn = document.createElement("button");
    exportBtn.className = "grok-lang-btn";
    exportBtn.style.cssText = "flex:1;text-align:center;font-size:13px;padding:8px 6px;";
    exportBtn.innerText = "\ud83d\udce4 Export Template";
    exportBtn.onclick = () => showCustomLangDialog("export", statusRow);
    btnRow.appendChild(exportBtn);

    const importBtn = document.createElement("button");
    importBtn.className = "grok-lang-btn";
    importBtn.style.cssText = "flex:1;text-align:center;font-size:13px;padding:8px 6px;";
    importBtn.innerText = "\ud83d\udce5 Import Translation";
    importBtn.onclick = () => showCustomLangDialog("import", statusRow);
    btnRow.appendChild(importBtn);

    const clearBtn = document.createElement("button");
    clearBtn.className = "grok-lang-btn";
    clearBtn.style.cssText = "flex:0 0 auto;font-size:13px;padding:8px 10px;color:#f4212e;border-color:#f4212e;";
    clearBtn.innerText = "\ud83d\uddd1";
    clearBtn.title = "Remove custom language";
    clearBtn.onclick = () => {
      if (!LangSystem.getCustom()) return;
      GM_setValue("cfg_custom_lang", "");
      statusRow.innerText = "No custom language loaded.";
      statusRow.style.color = "#8899a6";
      setTimeout(() => location.reload(), 400);
    };
    btnRow.appendChild(clearBtn);

    panel.appendChild(btnRow);
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
    const payload = hashData?.payload ?? GM_getValue("check_payload", "");
    const forceSend = hashData?.forceSend ?? GM_getValue("force_direct_send", false);
    if (!payload) { console.warn("[GrokCheck] runGrokAutomation: no payload, abort"); return; }
    if (_automationRunning || _grokAutomationRan) return;
    _automationRunning = true;
    _grokAutomationRan = true;
    const t0 = Date.now();
    const ts = () => `+${Date.now() - t0}ms`;

    const configAutoSend = GM_getValue("cfg_auto_send", false);
    const shouldSend = forceSend || configAutoSend;

    let statusTitle = shouldSend
      ? LangSystem.getText("mode_direct")
      : LangSystem.getText("mode_std");
    if (forceSend) statusTitle = LangSystem.getText("mode_fast");

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

            if (GM_getValue("cfg_highlight_url", false)) {
              const urlStart = payload.lastIndexOf("https://");
              if (urlStart !== -1) {
                requestAnimationFrame(() => {
                  requestAnimationFrame(() => {
                    try {
                      textarea.focus();
                      textarea.setSelectionRange(urlStart, payload.length);
                    } catch (e) {}
                  });
                });
              }
            }

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

  function runChatGPTAutomation(forceSend) {
    function findTempChatBtn() {
      return (
        document.querySelector("#conversation-header-actions > div > span > button") ||
        document.querySelector('button[aria-label*="暫存對話"]') ||
        document.querySelector('button[aria-label*="Temporary chat"]') ||
        document.querySelector('button[aria-label*="一時的なチャット"]') ||
        document.querySelector('button[aria-label*="임시 채팅"]') ||
        document.querySelector('button[aria-label*="Chat temporal"]') ||
        document.querySelector('button[aria-label*="Chat temporaire"]') ||
        document.querySelector('button[aria-label*="Chat temporário"]')
      );
    }

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

    let privAttempts = 0;
    let hasClickedPrivacy = false;
    const privInterval = setInterval(() => {
      privAttempts++;
      const tempBtn = findTempChatBtn();
      if (tempBtn) {
        clearInterval(privInterval);
        tempBtn.click();
        hasClickedPrivacy = true;
        if (forceSend) {
          let sendAttempts = 0;
          const sendInterval = setInterval(() => {
            sendAttempts++;
            const btn = findChatGPTSendBtn();
            if (btn && !btn.disabled && btn.getAttribute("aria-disabled") !== "true") {
              clearInterval(sendInterval);
              btn.click();
            } else if (sendAttempts >= 40) {
              clearInterval(sendInterval);
            }
          }, 400);
        }
      } else if (privAttempts >= 30) {
        clearInterval(privInterval);
        if (forceSend) {
          let sendAttempts = 0;
          const sendInterval = setInterval(() => {
            sendAttempts++;
            const btn = findChatGPTSendBtn();
            if (btn && !btn.disabled && btn.getAttribute("aria-disabled") !== "true") {
              clearInterval(sendInterval);
              btn.click();
            } else if (sendAttempts >= 40) {
              clearInterval(sendInterval);
            }
          }, 400);
        }
      }
    }, 300);
  }

  function runGeminiAutomation(payload, forceSend) {
    if (!payload) return;

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
      editor.focus();
      document.execCommand("selectAll", false, null);
      document.execCommand("delete", false, null);

      let pasteOk = false;
      try {
        const dt = new DataTransfer();
        dt.setData("text/plain", payload);
        dt.setData("text/html", "<p>" + payload.replace(/\n/g, "</p><p>") + "</p>");
        const ev = new ClipboardEvent("paste", { clipboardData: dt, bubbles: true, cancelable: true });
        editor.dispatchEvent(ev);
        pasteOk = true;
      } catch (e) {}

      setTimeout(() => {
        const filled = editor.innerText?.replace(/\n/g, "").trim();
        if (!pasteOk || !filled || filled.length < 5) {
          editor.focus();
          document.execCommand("selectAll", false, null);
          document.execCommand("insertText", false, payload);
        }
        if (forceSend) {
          setTimeout(() => {
            const btn = findGeminiSendButton();
            if (btn) btn.click();
          }, 900);
        }
      }, 400);
    }

    let attempts = 0;
    const waitEditor = setInterval(() => {
      attempts++;
      const editor = document.querySelector('div.ql-editor[contenteditable="true"]');
      if (editor) {
        clearInterval(waitEditor);

        const tempBtn = document.querySelector("temp-chat-button button");
        if (tempBtn) {
          tempBtn.click();
          setTimeout(() => {
            const editorAfter = document.querySelector('div.ql-editor[contenteditable="true"]');
            fillEditor(editorAfter || editor);
          }, 700);
        } else {
          fillEditor(editor);
        }
      } else if (attempts >= 60) {
        clearInterval(waitEditor);
      }
    }, 400);
  }

  const PLATFORM_DEFS = [
    { key: "grok",    name: "Grok",    color: "#1d9bf0" },
    { key: "chatgpt", name: "ChatGPT", color: "#10a37f" },
    { key: "gemini",  name: "Gemini",  color: "#8b5cf6" },
  ];

  function getEnabledPlatforms() {
    try {
      const val = GM_getValue("cfg_platforms", null);
      if (val) return JSON.parse(val);
    } catch (e) {}
    return ["grok"];
  }

  function buildTabUrl(platform, text, forceSend) {
    if (platform === "grok") {
      const encoded = btoa(unescape(encodeURIComponent(text)));
      return `${GROK_URL}#gfc|${forceSend ? "1" : "0"}|${encoded}`;
    }
    if (platform === "chatgpt") {
      GM_setValue("chatgpt_force_send", forceSend);
      GM_setValue("chatgpt_ts", Date.now());
      return `https://chatgpt.com/?prompt=${encodeURIComponent(text)}`;
    }
    if (platform === "gemini") {
      GM_setValue("gemini_payload", text);
      GM_setValue("gemini_force_send", forceSend);
      GM_setValue("gemini_ts", Date.now());
      const encoded = btoa(unescape(encodeURIComponent(text)));
      return `https://gemini.google.com/#gfc|${forceSend ? "1" : "0"}|${encoded}`;
    }
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
    drop.style.cssText = `position:fixed;bottom:${window.innerHeight - rect.top + 8}px;left:${Math.max(4, rect.left - 8)}px;`;

    PLATFORM_DEFS.filter(p => platforms.includes(p.key)).forEach(({ key, name, color }) => {
      const item = document.createElement("button");
      item.className = "gfc-plat-item";

      const iconEl = document.createElement("span");
      iconEl.className = "gfc-plat-item-icon";
      iconEl.style.color = color;
      iconEl.innerHTML = getPlatformIcon(key);
      item.appendChild(iconEl);

      const nameEl = document.createElement("span");
      nameEl.innerText = name;
      item.appendChild(nameEl);

      item.addEventListener("click", (e) => {
        e.stopPropagation();
        btnEl.innerHTML = getPlatformIcon(key);
        const payload = resolvePayload(key);
        const url = buildTabUrl(key, payload, false);
        if (url) GM_openInTab(url, { active: true });
        drop.remove();
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

  function createGrokButton(getUrlFn, isThreads = false, getContentFn = null) {
    const btn = document.createElement("button");
    btn.className = "my-grok-robot-btn";
    if (isThreads) btn.classList.add("threads-grok-btn");
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
      }, 800);
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
        if (btn.innerHTML !== ICONS.SENDING) btn.innerHTML = ICONS.ROBOT;
      }
    });
    btn.addEventListener("mouseup", (e) => {
      if (e.button !== 0) return;
      if (pressTimer) clearTimeout(pressTimer);
      e.stopPropagation();
      e.preventDefault();

      const url = getUrlFn();
      if (!url) return;

      const currentPrompt = LangSystem.getPrompt();
      const platforms = getEnabledPlatforms();

      function buildPayloadFor(platform) {
        if (platform === "chatgpt") {
          const content = getContentFn ? getContentFn() : "";
          const body = content && content.trim() ? content.trim() : url;
          return `${currentPrompt}${body}`;
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
        const tabUrl = buildTabUrl(target, buildPayloadFor(target), true);
        if (tabUrl) GM_openInTab(tabUrl, { active: true });
      } else if (platforms.length === 1) {
        const platform = platforms[0];
        btn.innerHTML = ICONS.SENDING;
        setTimeout(() => { btn.innerHTML = getPlatformIcon(platform); }, 2000);
        const tabUrl = buildTabUrl(platform, buildPayloadFor(platform), false);
        if (tabUrl) GM_openInTab(tabUrl, { active: true });
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

      const btn = createGrokButton(getUrl, false, getContent);
      const wrapper = document.createElement("div");
      wrapper.style.cssText =
        "display:flex;align-items:center;justify-content:center;";
      wrapper.appendChild(btn);
      toolbar.appendChild(wrapper);
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
      console.log("Grok Checker: Bluesky 模式啟動");
    },
    scan: () => {
      document
        .querySelectorAll('[data-testid^="feedItem-by-"]')
        .forEach((item) => {
          const replyBtn = item.querySelector('[data-testid="replyBtn"]');
          if (!replyBtn) return;
          const toolbar = replyBtn.parentElement?.parentElement;
          if (!toolbar) return;
          if (toolbar.querySelector(".my-grok-robot-btn")) return;

          const robotBtn = createGrokButton(
            () => AdapterBluesky.getUrl(item),
            false,
            () => AdapterBluesky.getText(item),
          );
          const rightGroup = toolbar.lastElementChild;
          if (rightGroup) toolbar.insertBefore(robotBtn, rightGroup);
          else toolbar.appendChild(robotBtn);
        });
    },
    getUrl: (item) => {
      const links = item.querySelectorAll('a[href*="/post/"]');
      if (links.length > 0) return links[0].href;
      return window.location.href;
    },
    getText: (item) => {
      for (const el of item.querySelectorAll("div.css-146c3p1")) {
        const text = el.innerText?.trim();
        if (text && text.length > 0) return text;
      }
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
      console.log("Grok Checker: Mastodon 模式啟動");
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

  function init() {
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
        const hash = location.hash;
        if (!hash.startsWith("#gfc|")) return null;
        try {
          const parts = hash.slice(1).split("|");
          if (parts.length < 3) return null;
          const forceSend = parts[1] === "1";
          const payload = decodeURIComponent(escape(atob(parts.slice(2).join("|"))));
          if (payload.length > 5000 || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(payload)) {
            console.warn("[GrokCheck] Suspicious payload rejected (length or control chars).");
            return null;
          }
          return { forceSend, payload };
        } catch (e) {
          return null;
        }
      }

      function tryRunAutomation(retriesLeft) {
        const hashData = parseHashPayload();
        const gmVal = GM_getValue("is_fact_checking", false);
        if (hashData || gmVal) {
          runGrokAutomation(hashData);
        } else if (retriesLeft > 0) {
          setTimeout(() => tryRunAutomation(retriesLeft - 1), 200);
        } else {
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
        console.log('[GrokCheck] MutationObserver disconnected');
      });
    } else if (window.location.hostname === "chatgpt.com") {
      const ts       = GM_getValue("chatgpt_ts", 0);
      const isRecent = (Date.now() - ts) < 30000;
      const payload = GM_getValue("chatgpt_payload", "");
      if (isRecent && payload) {
        const forceSend = GM_getValue("chatgpt_force_send", false);
        GM_setValue("chatgpt_ts", 0);
        const delay = document.readyState === "loading" ? 2000 : 1500;
        const run = () => setTimeout(() => runChatGPTAutomation(forceSend), delay);
        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", run);
        } else {
          run();
        }
      }
    } else if (window.location.hostname === "gemini.google.com") {
      function parseGeminiHashPayload() {
        const hash = location.hash;
        if (!hash.startsWith("#gfc|")) return null;
        try {
          const parts = hash.slice(1).split("|");
          if (parts.length < 3) return null;
          const forceSend = parts[1] === "1";
          const payload = decodeURIComponent(escape(atob(parts.slice(2).join("|"))));
          if (payload.length > 5000 || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(payload)) {
            console.warn("[GrokCheck] Gemini: suspicious payload rejected.");
            return null;
          }
          return { forceSend, payload };
        } catch (e) { return null; }
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
        console.log("Grok Checker: Threads 模式啟動");
        AdapterThreads.init();
      } else if (AdapterX.isMatch()) {
        console.log("Grok Checker: X 模式啟動");
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