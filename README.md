# ✨ One-Click Fact-Check Any Post on X, Threads, Bluesky, or Mastodon

📍 **Author:** [GitHub](https://github.com/Startanuki07?tab=repositories) | **Script:** [Repository](https://github.com/Startanuki07/Grok-Fact-Checker)


**Adds a 🤖 fact-check button to every post on X (Twitter), Threads, Bluesky, and Mastodon — one click opens Grok in a private tab with a pre-filled prompt, leaving no query history.**

---

> 💡 **Overview**
> After installation, a small 🤖 button appears beside each post across all supported platforms. Clicking it opens Grok in a new private tab with the post's URL and a fact-checking prompt already filled in — privacy mode and focus mode activate automatically so your check stays discreet. Long-pressing the button skips the confirmation step and submits immediately. The script also silently removes Grok's promoted content so your fact-checking workspace stays clean.

<details open>
  <summary><small style="color: #666;">Hide image</small></summary>
  <img src="https://greasyfork.s3.us-east-2.amazonaws.com/g6aehs4nc1gaztevzse0bjy5tbff" alt="Image">
</details>

---

## Why Grok?

Why Grok? Because it is natively connected to X's real-time data stream, Grok has immediate context on trending topics, public figures, and platform-specific events that other AI tools would need to retrieve indirectly. For social media content in particular, that native awareness makes a practical difference.

This script is intended for casual users who occasionally encounter an unfamiliar post and want a quick, structured way to get context — without opening a new tab, pasting text manually, or writing a prompt from scratch.

While this provides a fast way to gather context, AI-generated verification should not be treated as fully authoritative. Users are encouraged to review the source links provided by Grok, compare them with other references if needed, and form their own judgment. AI-assisted summaries are meant to serve as a starting point for understanding, not as a final source of truth.

---

## 🎛 Getting Started

The 🤖 button appears automatically on every post after installation. No configuration is required to begin fact-checking. Settings and optional features are accessible from two places:

| Icon | Feature             | Where It Appears                                |
| ---- | ------------------- | ----------------------------------------------- |
| 🤖   | Fact-check button   | Next to each post on all supported platforms    |
| ⚙️   | Auto-Send toggle    | Userscript manager menu → "Auto Send"           |
| ⚙️   | Settings & Language | Userscript manager menu → "Settings & Language" |

---

## 🚀 Core Features

### 🤖 One-Click Fact Check

Click the 🤖 button on any post to open Grok in a new private tab with a fact-checking prompt and the post's URL pre-filled.

* Works across X / Twitter, Threads, Bluesky, Mastodon (multiple instances), ChatGPT, and Gemini.
* Privacy mode activates automatically on Grok — your query does not appear in your Grok history.
* Focus mode activates on the Grok page, hiding sidebars and navigation so you can read results without distraction.
* A brief loading curtain appears while the tab opens and the prompt is being submitted.

---

### ⏱ Long-Press to Auto-Send

Hold the 🤖 button for about one second to trigger immediate submission without the manual confirmation step.

* Useful when you want to check a post quickly without interacting with the Grok tab at all.
* Short taps still use the standard mode (manual or auto-send, depending on your settings).

---

### 🔇 Grok Ad Removal

Promoted content inside the Grok interface is automatically removed each time a fact-check session opens.

* This runs silently with no user action required.
* Applies only within the Grok tab opened by this script.

---

### 🌐 Multi-Platform Support

| Platform                                       | Supported                   |
| ---------------------------------------------- | --------------------------- |
| X / Twitter                                    | ✅ Full support              |
| Threads                                        | ✅ Full support              |
| Bluesky                                        | ✅ Full support              |
| Mastodon (social, online, world, jp, and more) | ✅ Full support              |
| ChatGPT                                        | ⚠️ Experimental — see below |
| Gemini                                         | ⚠️ Experimental — see below |

---

### 🔗 Post URL Highlighting (Optional)

After the prompt is filled in, the post URL inside the Grok input box can be highlighted automatically, making it easy to manually remove it if you prefer to send only the post content.

* This option is off by default. Enable it in Settings & Language → Settings panel.

---

## ⚙️ Additional Features

### Custom Prompt

Replace the default fact-checking prompt with your own text. The post URL is still appended automatically at the end.

* Enable and edit the custom prompt in Settings & Language → Settings panel.
* When enabled, your custom text replaces the built-in prompt for all platforms.

>💡 Flexible Use of Prompt Templates
The built-in modes provide structured examples for fact checking, analysis, and explanation. However, all prompt templates in this script are editable. By modifying the custom slots — or even the built-in modes — users can adapt the menu to support other tasks according to their own needs. The script does not restrict how Grok is used; verification is simply one of many possible applications.

---

### Auto-Send Toggle

Switch between manual mode (you click Submit in the Grok tab) and auto-send mode (the script clicks Submit automatically).

* Toggle from the userscript manager menu → "Auto Send".
* Manual mode is the default to avoid accidental submissions.
* Long-press always forces auto-send regardless of this setting.

---

### Language & Prompt Template Export / Import

The Settings panel includes Export Template and Import Translation options. Use these to back up your custom language settings as JSON or load a community-contributed language pack.

* Export copies the current template structure to your clipboard as JSON.
* Import reads a JSON block you paste in and applies it immediately.

---

## ⚠️ Experimental Features & Known Limitations

### ChatGPT — Experimental

ChatGPT cannot directly read post URLs. When this platform is enabled, the script inserts the post's visible text into the prompt instead.

* If the post text cannot be extracted, the script falls back to the URL automatically.
* A warning is shown when you first enable ChatGPT in the platform selector, asking you to confirm.
* Auto-send works on ChatGPT, but timing may vary depending on how quickly the interface loads.

---

### Gemini — Experimental

Gemini does not support automatic prompt filling in the same way as Grok or ChatGPT.

* After the Gemini tab opens, manual paste may be required.
* Automatic Temporary Chat mode switching is not available.
* A warning is shown when enabling Gemini in settings.

---

### Known Constraints

* Input timeout: If Grok input does not appear within ~20 seconds, the script will show a timeout message.
* Some CSP-restricted environments may block automation steps; fallback mode will display status instead of failing silently.

---

## 🔐 Security & Privacy Notice

| Data Type              | Source | Purpose                     | Storage      | Transmitted To |
| ---------------------- | ------ | --------------------------- | ------------ | -------------- |
| Selected language code | User   | Language preference         | Local device | None           |
| Custom prompt text     | User   | Override fact-check prompt  | Local device | None           |
| Platform preferences   | User   | Enable AI platforms         | Local device | None           |
| Auto-send preference   | User   | Control submission behavior | Local device | None           |

**This script does not collect or transmit personal data, post content, or query text.**

The post URL and prompt are sent directly from your browser to the selected platform (e.g., Grok). The script does not store or intercept this data.

---

* Maintained on Greasy Fork.
* Built with AI assistance by a hobbyist developer.
* Feedback welcome; translation tools may be used for responses.

