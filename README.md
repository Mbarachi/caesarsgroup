# caesarsgroup

## Deploy to GitHub Pages

This project uses Create React App. We configured GitHub Pages for previews.

- Homepage: set to `https://Mbarachi.github.io/caesarsgroup`
- Router: uses `HashRouter` to avoid 404s on GitHub Pages

Steps:

1. Install dependencies and build:

```zsh
npm install
npm run build
```

2. Deploy to GitHub Pages:

```zsh
npm run deploy
```

This publishes the `build/` folder to the `gh-pages` branch and serves it at the URL above.

Notes:
- Push your latest changes to `main` before deploying.
- Custom domain? Add a `public/CNAME` with your domain and remove the `homepage` field.