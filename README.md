# ThinkPad

ThinkPad is a mobile-first web app for capturing current thoughts.

## Files

- `index.html`: app screen
- `styles.css`: mobile-first design
- `app.js`: thought recording, local storage, record deletion, and TXT share/download flow
- `manifest.json`: home-screen web app metadata
- `sw.js`: offline cache for hosted use
- `icon-512.png`: app icon

## iPhone Use

Host this folder on a static HTTPS host such as GitHub Pages, Netlify, or Vercel. Then open the URL in Safari on iPhone and add it to the Home Screen.

Records are stored in the browser or installed web app storage. Use `.txt Extract` to share or download all records as a text file.

## GitHub Pages

Upload this folder as the root of a GitHub repository.

Then open the repository settings:

- Pages
- Source: Deploy from a branch
- Branch: `main`
- Folder: `/ (root)`

The app entry point is `index.html`.
