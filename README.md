# edwingoogle1.github.io

Personal portfolio site for Edwin Ng (CTO / Head of Engineering), published via GitHub Pages at
https://edwingoogle1.github.io

Static HTML/CSS/JS — no build step. The project grid is fetched live from the
[GitHub REST API](https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user) for
`edwingoogle1` on every page load, so new or updated repos show up automatically.

## Local preview

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Structure

- `index.html` — page markup
- `styles.css` — styling (light/dark mode via `prefers-color-scheme`)
- `script.js` — fetches and renders repos, plus search/sort controls
