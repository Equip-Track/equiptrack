# EquipTrack – IT Asset Lifecycle Portal

Final Project for **ITC 122 – Introduction to Web Design**
Group 4 · ETEEAP BSCS · Arellano University

## What's inside
| Path | Purpose |
|---|---|
| `index.html` | Home – hero, live counters, features, lifecycle preview, activity feed |
| `assets.html` | Asset Inventory – search, filter, sort, asset detail window |
| `lifecycle.html` | 6-stage IT asset lifecycle + depreciation & refresh planner |
| `borrow.html` | Equipment request form with live ticket preview and validation |
| `monitor.html` | Borrowing monitor – status tracking, returns, extensions, CSV export |
| `guide.html` | How it works – explainer video, audio, steps, policy, FAQ |
| `about.html` | About the project, team, contact form and map |
| `css/style.css` | All styles (external stylesheet, dark/light themes, responsive) |
| `js/` | `data.js` (sample data), `app.js` (shared), one script per page |
| `images/` | Logo, favicon, video poster, map placeholder |
| `media/` | Explainer video (MP4), ambience audio (MP3), notification chime (WAV) |

## Run locally
Double-click `index.html` – no installation needed.

## Host on GitHub Pages (free)
1. Create a free account at github.com.
2. Click **New repository** and name it `equiptrack` (Public).
3. Click **uploading an existing file** and drag **all files and folders inside this `src` folder** (not the `src` folder itself).
4. Click **Commit changes**.
5. Go to **Settings → Pages**. Under *Build and deployment*, set **Source: Deploy from a branch**, **Branch: main / (root)**, then **Save**.
6. Wait 1–10 minutes. The site will be live at `https://<your-username>.github.io/equiptrack/`.

> Data entered in the forms is saved in the browser (localStorage) for demonstration. A production version would connect to a database.
