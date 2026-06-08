# ThinkPad

ThinkPad is a mobile-first web app for capturing current thoughts.

## Files

- `index.html`: app screen
- `styles.css`: mobile-first design
- `app.js`: thought recording, local storage, record deletion, and TXT share/download flow
- `manifest.json`: home-screen web app metadata
- `sw.js`: offline cache for hosted use
- `icon.svg`, `icon-512.png`: app icons

## iPhone Use

Host this folder on a static HTTPS host such as GitHub Pages, Netlify, or Vercel. Then open the URL in Safari on iPhone and add it to the Home Screen.

Records are stored in the iPhone browser/web-app storage. Use the TXT share button to share or download all records as a text file.

## Netlify

Deploy the `outputs/now` folder as a static site.

For Git-based deploys from the parent `now` folder, Netlify can use `netlify.toml`; the publish directory is already set to `outputs/now`.

For manual deploys, drag the contents of `outputs/now` into Netlify Drop.
