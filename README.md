<![CDATA[<div align="center">

# ANSWR

**AI-powered Google Forms solver — minimal, fast, private.**

Built with Groq API · Chrome Extension · Manifest V3

---

</div>

## Screenshots

<div align="center">
<table>
<tr>
<td align="center"><strong>Extension Popup</strong></td>
<td align="center"><strong>Solver Panel</strong></td>
</tr>
<tr>
<td><img src="screenshots/popup.png" alt="Extension Popup" width="360"/></td>
<td><img src="screenshots/panel.png" alt="Solver Panel" width="360"/></td>
</tr>
</table>
</div>

---

## What It Does

ANSWR injects a sleek floating panel into any Google Form. It scrapes the questions, sends them to the Groq API, and displays the answers — all without leaving the page.

- Scrapes MCQ and multi-select questions from Google Forms
- Uses Groq's blazing-fast LLM inference for answers
- Displays results in a premium dark-glass panel
- Everything runs locally — your API key never leaves your machine (except to Groq)

## Installation

1. Clone or download this repository
2. Open `chrome://extensions/` in Google Chrome
3. Enable **Developer mode** (top right toggle)
4. Click **Load unpacked** and select the `formsolver-fixed` folder
5. Click the extension icon and enter your [Groq API key](https://console.groq.com/keys)

## Usage

| Shortcut | Action |
|----------|--------|
| `Alt + P` | Open / close the solver panel |
| `Alt + S` | Solve the form instantly |

You can also click the floating **FS** button at the bottom-right of any Google Form page.

### Quick Start

1. Navigate to a Google Form
2. Press `Alt + P` to open the panel
3. Press `Alt + S` or click **Solve Form**
4. View answers directly in the panel

## Supported Models

| Model | Speed | Quality |
|-------|-------|---------|
| Llama 3.3 70B | Moderate | Best |
| Llama 3.1 8B | Fast | Good |
| Mixtral 8x7B | Moderate | Good |

Select your preferred model in the extension popup or panel settings.

## Tech Stack

- **Platform**: Chrome Extension (Manifest V3)
- **AI Backend**: [Groq API](https://groq.com)
- **Font**: [Manrope](https://fonts.google.com/specimen/Manrope)
- **Styling**: Custom CSS with glassmorphism
- **JS**: Vanilla — zero dependencies

## Project Structure

```
formsolver-fixed/
├── manifest.json      # Extension manifest (MV3)
├── content.js         # Core logic — scraping, API calls, panel UI
├── content.css        # Panel and trigger styling
├── popup.html         # Extension popup — settings & status
├── popup.js           # Popup logic — save config, detect forms
├── icons/             # Extension icons (16, 48, 128)
├── screenshots/       # Screenshots for README
│   ├── popup.png
│   └── panel.png
└── README.md
```

## Privacy

- Your Groq API key is stored in `chrome.storage.local` and **never** transmitted anywhere except directly to the Groq API
- No analytics, no telemetry, no tracking
- The extension only activates on `docs.google.com/forms/*`

## License

MIT

---

<div align="center">
<sub>Built with focus on aesthetics and simplicity.</sub>
</div>
]]>
