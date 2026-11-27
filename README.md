# Degaga Debelo: Portfolio Website

Personal brand website for **Degaga Debelo**, Junior Investment & Advisory Analyst.
Static HTML5, CSS3 and vanilla JavaScript (ES6). No frameworks, no libraries, no build step, no server.

Live address after deployment: `https://degagadebelo.github.io/`

## First step: add your email address

Your email address is deliberately **not** written into the pages. To switch it on:

1. Open `assets/js/main.js`.
2. Find this line near the top and type your address between the quotes:

   ```js
   const CONTACT_EMAIL = '';
   ```

3. Save and upload.

Your email then appears in the footer and on the contact card, and the form gains a **Send by email** button.
Until then those options stay hidden and the form sends through WhatsApp.

## Features

- Seven linked pages plus a custom 404 page
- Hero with financial grid, moving chart lines, particles, typing effect and a credentials ticker
- Sticky navigation, transparent at the top and dark after scrolling, with a mobile menu
- Light and dark themes that follow the system setting and remember the visitor's choice
- Animated timeline, counters, scroll reveals, parallax, ripple, loader and page transitions
- Project filters and detail dialogs, research library, certificate gallery with preview viewer
- Contact card, QR code, downloadable contact file, validated form and click to load Google Map
- Self hosted fonts, responsive WebP images, lazy loading
- Semantic HTML, skip link, keyboard support, ARIA labels, reduced motion support
- Meta descriptions, Open Graph, Twitter cards, JSON-LD, sitemap, robots file and favicons

## Folder structure

```
degagadebelo.github.io/
├── index.html              Home
├── about.html              Biography, education, objective, skills, values, languages
├── experience.html         Timeline, leadership, achievements
├── projects.html           Project cards and dialogs
├── research.html           Research library
├── certificates.html       Certificate gallery
├── contact.html            Business card, form, QR code, map
├── 404.html                Page not found
├── robots.txt
├── sitemap.xml
├── site.webmanifest
├── .nojekyll               Tells GitHub Pages to publish files as they are
├── LICENSE
├── README.md
└── assets/
    ├── css/
    │   ├── style.css       Design tokens, layout and components
    │   ├── responsive.css  Breakpoints, touch, no script and print rules
    │   └── animations.css  Motion and reduced motion rules
    ├── js/
    │   ├── main.js         Email setting, menu, hero, dialogs, filters, form, map
    │   ├── darkmode.js     Theme toggle and saved preference
    │   └── scroll.js       Header state, reveals, counters, timeline, parallax
    ├── images/             Portrait, AMG logo, share image, QR code, certificate previews
    ├── icons/              Logo and favicons
    ├── documents/          CV, contact file, research summaries, project briefs
    ├── certificates/       Certificate PDFs and the ECMA letter
    └── fonts/              Poppins, Inter, Roboto Mono and their licenses
```

## Preview on your computer

Double click `index.html`. For behaviour closest to the live site, run this in the project folder and open `http://localhost:8000`:

```bash
python3 -m http.server 8000
```

## Customization guide

### Replace files (keep the same file name and nothing else changes)

| What | File |
|---|---|
| CV | `assets/documents/Degaga-Debelo-CV.pdf` |
| Agricultural financing paper | `assets/documents/research/agricultural-financing-cooperative-bank-of-oromia.pdf` |
| Alcohol advertising paper | `assets/documents/research/alcohol-advertising-ban-digital-advertising.pdf` |
| Financial literacy paper | `assets/documents/research/financial-literacy-financial-inclusion-addis-ababa.pdf` |
| Project briefs | `assets/documents/projects/` |
| AMG logo | `assets/images/amg-logo.webp` |
| Social share image (1200 x 630) | `assets/images/og-image.jpg` |

The research and project PDFs supplied here are **one page summaries**. When you upload a full paper,
also change the sentence "Each download is a one page summary" near the top of the library in `research.html`.

**Portrait.** The home page uses `portrait-480.webp`, `portrait-720.webp` and `portrait-1080.webp`
(transparent background, width to height ratio 1212 : 1297). The About page and search data use
`degaga-debelo.jpg` (800 x 856). Replace all four.

### Edit text

Each page is plain HTML. The header and footer are the same on every page, so when you change them,
use your editor's "Replace in files" to update all pages together.

### Add a certificate

1. Put the PDF in `assets/certificates/`.
2. Save two preview images in `assets/images/certificates/`, 640 px and 1400 px wide, in WebP format.
3. In `certificates.html`, copy one `<article class="cert ...">` block and change the title, issuer, date,
   file paths, `data-width`, `data-height` and `data-category` (`finance`, `sustainability` or `letter`).
4. Update the certificate counter (`data-count`) in `index.html`.

The "Ethiopian Capital Market" card currently links to Google Drive. Check that the file is shared as
"Anyone with the link". To host it here, follow the steps above and replace that card.

### Add a project or paper

Copy an `<article class="card card--hover project">` block and its matching `<dialog>` in `projects.html`,
giving both a new `id`. For research, copy an `<li class="paper">` block in `research.html`.
Then update the counters in `index.html`.

### Add a role to the timeline

Copy an `<li class="timeline__item">` block in `experience.html`, give it a new `id`, and set the matching
`aria-controls` value and details `id`. Also add a row on the home page.

### Colours, type and spacing

All are CSS variables at the top of `assets/css/style.css`. Dark theme values are in the
`:root[data-theme="dark"]` block.

| Token | Value |
|---|---|
| `--navy` | `#081B33` |
| `--slate` | `#0F172A` |
| `--gold` | `#C9A227` |
| `--white` | `#FFFFFF` |
| `--mist` | `#F4F6F9` |

On light backgrounds, gold text uses the darker `--accent-text` so it stays readable.

### Contact details

Phone, LinkedIn, Telegram and WhatsApp links are written in the HTML; use "Replace in files" to change them.
If your phone number changes, also edit `assets/documents/Degaga-Debelo.vcf` and create a new QR code for
`assets/images/qr-contact.svg` with any QR generator, using the text of the `.vcf` file.
The QR code and contact file contain no email address; add an `EMAIL:` line if you want one and
regenerate the QR code.

### Receive form messages directly (optional)

By default the form prepares a message in the visitor's email app or WhatsApp. To receive submissions
without that step, create a form at a service such as Formspree and paste its URL into
`data-endpoint=""` on the form in `contact.html`.

## Deployment guide for GitHub Pages

The repository name must match your GitHub username. For `degagadebelo.github.io`, the account must be `degagadebelo`.

### Option A: upload in the browser

1. Sign in at [github.com](https://github.com) as `degagadebelo`.
2. Create a new **public** repository named `degagadebelo.github.io`.
3. Unzip the project on your computer.
4. In the empty repository choose **uploading an existing file**.
5. Drag in everything **inside** the `degagadebelo.github.io` folder (not the folder itself), so that
   `index.html` sits at the top level.
6. Commit the changes.
7. Open **Settings**, then **Pages**. Set the source to **Deploy from a branch**, branch **main**,
   folder **/ (root)**, and save.
8. Wait a few minutes, then visit `https://degagadebelo.github.io/`.

Hidden files such as `.nojekyll` may be skipped by drag and drop. The site works without it.

### Option B: Git

```bash
cd degagadebelo.github.io
git init
git add .
git commit -m "Publish portfolio website"
git branch -M main
git remote add origin https://github.com/degagadebelo/degagadebelo.github.io.git
git push -u origin main
```

### After publishing

- Register the site in [Google Search Console](https://search.google.com/search-console) and submit `sitemap.xml`.
- Check the share preview with LinkedIn's Post Inspector.
- Run Lighthouse in Chrome DevTools.
- When pages change, update the `lastmod` dates in `sitemap.xml`.
- If you move to a custom domain or another username, replace `https://degagadebelo.github.io/` in all
  HTML files, `sitemap.xml`, `robots.txt` and the contact file.

## Privacy

The site sets no cookies and has no analytics. It stores the theme choice and a "loader already shown"
flag in the visitor's browser. Google Maps loads only when a visitor asks for it.
Everything uploaded to a public repository is public, including your CV, certificates, the ECMA letter
(with its signature and stamp) and your phone number. Remove anything you would rather not publish.

## License

Source code is released under the MIT License; see `LICENSE`.

The name, biography, portrait, documents and certificates are © Degaga Debelo, all rights reserved,
and are not covered by the MIT License. The AMG Investment Bank name and logo belong to AMG Investment Bank;
confirm you have permission to display them. Certificate designs belong to their issuers.
Fonts are under the SIL Open Font License (`assets/fonts/LICENSES.txt`). Interface icons are from
[Lucide](https://lucide.dev) (ISC License); brand icons are from [Simple Icons](https://simpleicons.org) (CC0).
Brand marks remain the property of their owners.
