# Ryan M. Dengcong — Developer Portfolio

A responsive portfolio for Ryan M. Dengcong, Web Developer / Programmer. Built with React, TypeScript, Vite, Tailwind CSS, Three.js, React Three Fiber, Motion for React, and Lucide React.

## Run locally

Use **Node.js 24 LTS** (the version in `.nvmrc`) and npm.

```sh
npm ci
npm run dev
```

Open the development address printed by Vite in your browser. The server is configured for **0.0.0.0:5173**, with strict port selection so it cannot silently move to a different port. Use your development platform’s port forwarding when needed.

For a production preview:

```sh
npm run build
npm run preview
```

The preview server defaults to port **4173**. Preview is for checking the generated site, not a production hosting service.

### If an HTML visualization is blank or reports an error

The source `index.html` is a **Vite entry point**, not a standalone HTML document. It imports `/src/main.tsx`; Vite must transform TypeScript/JSX, resolve npm imports, and serve the imported CSS and 3D modules. Opening the file directly or embedding its contents in an HTML visualization does not run that pipeline.

- Start `npm run dev` from the repository.
- On the same computer as the server, open `http://localhost:5173/`.
- For a remote workspace, use an actual forwarded URL for **port 5173**, if your platform provides one. Your own browser's `localhost` refers to your own computer, not the cloud machine.
- The cloud onboarding HTML visualization does not provide this port-forwarding capability. An `index.html` file-preview button is not a working application preview. Use a local checkout or a deployment from the instructions below when no forwarded URL is available.
- If you reinstall dependencies while Vite is running and requests fail with `504 (Outdated Optimize Dep)`, stop your development server, run `npm run dev` again, and reload the page.

The same rule applies to production: serve `dist/` with `npm run preview` or a static host instead of opening `dist/index.html` as a local file.

## What’s included

- A dark `#0D0D0F` design with subtle blue accents, generous spacing, and locally hosted Manrope typography.
- Home, About, Skills, Projects, and Contact sections.
- A slowly rotating metallic sculpture with a locally generated studio reflection map. Pointer movement changes its orientation.
- A pause control, support for the operating system’s reduced-motion preference, and automatic animation suspension when the hero or browser tab is hidden.
- Static SVG artwork if WebGL fails, is unavailable, or loses its context; the portfolio remains functional.
- Responsive navigation, a skip link, visible keyboard focus, accessible section headings, and native project dialogs with focus containment, Escape dismissal, and focus restoration.
- Three custom SVG concept illustrations, labeled sample projects, and honest placeholders for unprovided details.
- Project repository and live-demo links when configured; no fake repositories or empty links.
- A contact email link and copy action when an email is configured. No backend, secrets, analytics, or external image/font services are required.

## Personalize before publishing

Start with **`src/content.ts`**:

1. Edit the introduction and toolkit in `src/content.ts` to reflect your background and the technologies you want to highlight.
2. Set `profile.email`, `profile.linkedin`, and optionally `profile.resume`. Missing values intentionally remain `null`; a résumé link appears only when supplied.
3. Replace sample project objects with your real work. Set `github` and optionally `live` to full HTTPS URLs. Set `sample: false` only for real projects, and describe your actual contribution and results.
4. Add your images to `public/images/` and set each project’s `image` to a relative path such as `images/my-project.webp`. Provide useful `imageAlt` text.
5. Replace the clearly labeled interface concepts when you have real projects to show. The current copy does not claim client work, experience, or results.
6. Update the page description and social metadata in `index.html` if your positioning changes. The social preview image is `public/images/social-preview.png`; add a canonical URL once your Cloudflare Workers hostname is confirmed.

The GitHub profile is based on this repository’s owner: `https://github.com/ryandengcong`.

Design tokens and responsive styles live in `src/styles.css`. The 3D scene is in `src/components/Sculpture.tsx`; its loading and failure boundaries are in `HeroArt.tsx`.

Sample project graphics are interface illustrations, **not working demo applications**. The portfolio itself is fully functional. Their fictional data and names do not represent clients, affiliations, or real results.

## Validate

```sh
npm run typecheck
npm run build
npx playwright install chromium
npm run test:e2e
```

The browser suite serves the production build and tests desktop/mobile content, working local images, navigation, project dialogs, contact placeholders, reduced motion, WebGL failure/context loss, pause controls, and layout widths from 320 to 1440 pixels. It also runs automated axe accessibility checks on the page and project dialog. One desktop case is intentionally skipped because it checks the mobile-only menu. Automated accessibility checks complement, rather than replace, manual keyboard and screen-reader review.

If your environment already supplies Chromium:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e
```

On Linux CI, use `npx playwright install --with-deps chromium` to install browser system dependencies. Build again before testing changes; the suite validates `dist/`, not the development server.

Vite reports a size advisory for the Three.js scene chunk. The scene is dynamically imported, so the main interface can render while it loads. The large renderer dependency is isolated from the initial application bundle; the static artwork is displayed during loading.

## Deploy

This is a static site. No server-side runtime or environment variables are required.

### Vercel

Import this GitHub repository, choose the **Vite** preset, use **Node.js 24**, build with `npm run build`, and publish `dist`. Deploy through Vercel after reviewing and pushing your changes.

### Netlify

Import the repository, set **Node.js 24**, the build command to `npm run build`, and the publish directory to `dist`. Alternatively, build locally and upload the generated `dist` directory.

### GitHub Pages

A manual deployment workflow is included in `.github/workflows/deploy-pages.yml`.

1. Review, commit, and push this application to GitHub.
2. In the repository’s **Settings → Pages**, select **GitHub Actions** as the source.
3. Open **Actions → Deploy portfolio to GitHub Pages → Run workflow** on the branch containing your website.
4. Wait for deployment; GitHub reports the public address in the deployment result.

The workflow is manual so pushing code does not automatically publish it. `base: './'` in `vite.config.ts` and relative public-asset paths support both a domain root and a GitHub Pages repository subdirectory. Navigation uses local hash anchors, so no SPA rewrite rules are necessary.

For any static host, serve the **contents of `dist/`** over HTTP(S), not the source directory or a `file://` URL.

## Cloud workspace notes

The checkout is `/workspace/ryan-dengcong-portfolio`. Each cloud task is already isolated; use the existing checkout and do not create a worktree unless explicitly requested.

This workspace requires a writable npm cache override during installation:

```sh
npm --cache /workspace/.npm ci
npm run build
npm run dev -- --port 5173 --strictPort
```

Dependencies and build outputs can persist in a snapshot; live servers must be restarted. The repository has no required secrets. Runtime assets, fonts, and lighting are local.

## Review and commit

Review `git diff --cached` if the changes have been staged, or `git diff` and `git status` otherwise. Suggested commit:

```sh
git add .gitignore .nvmrc .github README.md index.html package.json package-lock.json playwright.config.ts tsconfig*.json vite.config.ts src public tests
git commit -m "Build professional 3D developer portfolio"
```

The build output, installed dependencies, browser traces, and test reports are ignored. Deployment remains a separate action.

## Assets

Project illustrations, fallback artwork, and favicon are included in `public/`. Manrope is bundled through Fontsource under the SIL Open Font License; a copy is shipped in `public/licenses/manrope-OFL.txt`. Lucide supplies the interface icons; GitHub and LinkedIn marks are separate SVG brand assets.
