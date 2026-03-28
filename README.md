# Social Media Rotator

Browser-based overlay generator for streamers. The app runs entirely in the browser and builds shareable overlay URLs from the settings page.

## Development

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

## Structure

- `src/pages/index.astro` is the landing page.
- `src/pages/settings.astro` generates overlay URLs and preview state.
- `src/pages/overlay.astro` renders the browser source.
- `src/lib/` holds shared site, platform, and token helpers.
