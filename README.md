# Plantworks Landing Site

Single-page landing site for Plantworks, an executive advisory practice for manufacturing leaders.

**Live:** https://plantworks.ai

## Stack

- Static HTML/CSS/JS — no framework, no build step
- Hosted on Netlify
- DNS via Cloudflare (proxy off for SSL provisioning)
- Form submissions captured via Netlify Forms
- Privacy-respecting analytics (PostHog), gated by consent banner

## Files

| File | Purpose |
|------|---------|
| `index.html` | Landing page |
| `privacy.html` | Privacy policy |
| `terms.html` | Terms of use |
| `plantworks-favicon.svg` | Favicon |
| `plantworks-mark-*.svg` | Logo mark — dark, light, brass variants |
| `plantworks-lockup-*.svg` | Mark + wordmark, dark and light |
| `netlify.toml` | Hosting config and security headers |

## Local preview

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploying

1. Push to `main` — Netlify auto-deploys
2. Form submissions appear in Netlify dashboard under `Forms → plantworks-inquiry`
3. Configure Netlify Forms notifications to forward to `trevor@plantworks.ai`

## Form

Inquiry form fields:

- name, email, company, role
- company-size (select)
- interest (select: briefing / workshop / advisory / exploring)
- message (free text)

Honeypot field `bot-field` filters obvious spam.

## Analytics

PostHog is wired in but **dormant by default**. To activate:

1. Open `index.html`
2. Find the `loadAnalytics()` function in the script block
3. Uncomment the PostHog snippet
4. Replace `YOUR_POSTHOG_KEY` with your actual project key
5. Redeploy

The cookie banner only appears for visitors who haven't yet chosen. Their choice is stored in `localStorage` under the key `pw-consent`. Analytics only loads after explicit acceptance.

To reset the banner for a visitor (e.g. for testing), they can clear localStorage in DevTools, or you can add a "manage cookies" link in the footer that does `localStorage.removeItem('pw-consent')` and reloads.

## Legal pages

- `privacy.html` — covers form data, analytics, cookies, retention, rights (incl. CCPA/CPRA)
- `terms.html` — informational use, IP, acceptable use, liability, governing law (Colorado)

Both pages link to each other in the footer. They are **boilerplate appropriate for a US-based B2B advisory practice** but should be reviewed by an attorney before significant traffic, especially before any EU client engagements.

## Notes

- All copy editable inline in the HTML files
- Tier prices hard-coded in `index.html` engagement section — search "Tier 0"
- The hero italic emphasis is `<em>` inside the `<h1>`
- Update the "Effective" / "Last updated" dates on legal pages whenever you make material changes
