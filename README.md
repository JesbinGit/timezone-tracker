# Global Team Clock — Editing Department

A minimal, dark-themed world clock dashboard for a distributed video editing team. Quickly check any team member's local time before calling or messaging them.

![Screenshot placeholder](https://img.shields.io/badge/status-ready-brightgreen)

## Features

- **Live clocks** for every team member, updating every second
- **Time-of-day indicators** — Daytime (green), Evening (yellow), Early Morning (blue), Late Night (red)
- **Search** by name, city, or country
- **Sort** alphabetically or by local time
- **Add / Edit / Remove** team members through the UI — no code changes needed
- **localStorage persistence** — your changes survive browser refreshes
- **Restore defaults** with one click
- **DST-aware** — uses `Intl.DateTimeFormat` with IANA timezone identifiers
- **Responsive** — works on desktop, tablet, and mobile
- **Zero dependencies** — vanilla HTML, CSS, and JavaScript

## Quick Start (Local)

1. Clone or download this repository.
2. Open `index.html` in any modern browser.

That's it — no build step, no server.

## Deploy on GitHub Pages

1. **Create a GitHub repository** and push all project files:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repo → **Settings** → **Pages**.
   - Under **Source**, select **Deploy from a branch**.
   - Choose **main** branch and **/ (root)** folder.
   - Click **Save**.

3. Your site will be live at:
   ```
   https://YOUR_USERNAME.github.io/YOUR_REPO/
   ```

## Project Structure

```
├── index.html      Main HTML page
├── style.css       All styles
├── script.js       Application logic
├── team.json       Default team data (reference)
└── README.md       This file
```

## Customisation

### Change the default team

Edit the `DEFAULT_DATA` object inside `script.js` (or update `team.json` for reference). The app loads defaults from the embedded JS object on first visit.

### Change your local clock timezone

In `script.js`, update the `LOCAL_TZ` constant:

```js
const LOCAL_TZ = 'Asia/Kolkata'; // Change to your IANA timezone
```

Also update the label in `index.html`:

```html
<div class="header-local-label">Your Time — Bengaluru</div>
```

### Add departments (future)

The data model already supports multiple departments:

```json
{
  "departments": {
    "editing": { "label": "Editing", "members": [...] },
    "design": { "label": "Design", "members": [...] }
  }
}
```

The current UI renders only the `editing` department. Adding a department switcher is a straightforward future enhancement.

## Time-of-Day Categories

| Time Range    | Category      | Colour        |
|---------------|---------------|---------------|
| 6 AM – 9 AM  | Early Morning | Blue          |
| 9 AM – 6 PM  | Daytime       | Green         |
| 6 PM – 10 PM | Evening       | Yellow/Orange |
| 10 PM – 6 AM | Late Night    | Red (muted)   |

These are **courtesy indicators only** — they do not represent working hours or availability.

## Browser Support

Any modern browser with `Intl.DateTimeFormat` support (Chrome, Firefox, Safari, Edge — all recent versions).

## Licence

MIT
