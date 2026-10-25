# Akshay Mehta — Portfolio

A responsive, dependency-free personal portfolio built with semantic HTML, CSS, and vanilla JavaScript.

## Run locally

Open `index.html` directly in a browser, or serve this folder with any static web server. For example, with Python installed:

```powershell
py -m http.server 8000
```

Then visit <http://localhost:8000>.

## Customize before publishing

1. In `script.js`, set `SITE_CONFIG.pdfConverterUrl` and `SITE_CONFIG.myBillUrl` to the real website URLs.
2. Set `SITE_CONFIG.youtubeUrl` to the correct YouTube channel URL.
3. `SITE_CONFIG.contactEmail` controls the displayed contact email.
4. To deliver contact form messages to Gmail, create an EmailJS account, connect your Gmail account as an email service, and create a template addressed to `mehta2442009@gmail.com`. Use the template variables `{{name}}`, `{{email}}`, `{{service}}`, and `{{details}}` (set Reply-To to `{{email}}`). Copy the EmailJS service ID, template ID, and public key into `SITE_CONFIG.emailJsServiceId`, `SITE_CONFIG.emailJsTemplateId`, and `SITE_CONFIG.emailJsPublicKey` in `script.js`. Restrict the EmailJS allowed origins to your site domain and enable its available spam protections. The form does not send messages until those values are configured.
5. Replace the sample project imagery and placeholder copy in `index.html` with your own portfolio work. The project sample slots are examples, not claims of completed client work. The About section uses `akshay22.jpg`; replace that file or update its image path to use a different portrait.
6. Update website preview artwork and the technology-tag placeholders in `index.html` to match the live projects.

Never put a Gmail password, OAuth secret, or private API key in this static frontend. EmailJS uses a public key designed for browser use; protect the service by restricting allowed origins and enabling spam protections. For stronger control, use a backend with secrets stored server-side.

## Deployment

This is a static site. Publish `index.html`, `styles.css`, `script.js`, `hummingbird-logo.png`, and `akshay22.jpg` to any static hosting service (for example, GitHub Pages, Netlify, or Cloudflare Pages). No build step or package installation is required.
