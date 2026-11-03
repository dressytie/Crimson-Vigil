# Crimson Vigil — live website

This repository is the source for the browser game **Crimson Vigil**. The website opens directly to the cinematic DESCEND menu.

## One-time setup

1. Create a new **GitHub** repository (for example, `crimson-vigil`).
2. Upload the **contents** of this folder to the repository's `main` branch, including `index.html`, `netlify.toml`, and `.github/`.
3. At [Netlify](https://app.netlify.com/), choose **Add new project → Import an existing project → GitHub**. Authorize GitHub, then select your repository.
4. Netlify should detect `netlify.toml`. If prompted, use **Build command:** blank and **Publish directory:** `.` (repository root). Deploy.
5. Netlify assigns a stable `*.netlify.app` URL. You can change the site name in Netlify's domain settings if your desired name is available.

## Publishing every new patch

1. Get the latest updated `Crimson Vigil` HTML file.
2. Replace the repository's **`index.html`** with the new file (keep the exact filename).
3. Commit directly to `main`, or merge a pull request into `main`.
4. Netlify automatically deploys the new version to the **same URL**. Monitor the deployment in Netlify's Deploys tab.
5. Reload the site to see the new version. The configuration asks browsers not to cache the HTML.

**No need to create a new Netlify site or share a new link for each patch.**

## Safe testing

Use a separate GitHub branch and open a pull request. When Netlify's GitHub integration supports deploy previews for your site, it can provide a preview URL. Merge only after testing. You can also roll back via Netlify's deploy history.

## Save data and important notes

- Player progression is stored locally in each visitor's browser, not on a central server. Clearing browser data or using a different device may lose progress.
- Keep the same public domain and avoid changing existing localStorage keys or saved-data structures in patches, unless you implement a migration.
- The HTML currently loads Three.js from an external CDN, so visitors need an internet connection.
- This is a static website. No multiplayer server, accounts, or centralized leaderboard are included.
- **ChatGPT cannot automatically push changes to GitHub or Netlify from this file alone.** Each future update must be committed by you or by an explicitly connected deployment workflow.

## Basic checks

A GitHub Actions workflow runs `node --check` on the JavaScript extracted from the HTML after each push or pull request. This catches JavaScript syntax errors, but does not replace gameplay testing.
