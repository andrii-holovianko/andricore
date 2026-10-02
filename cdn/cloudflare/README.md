# Cloudflare CDN for andricore.com

Official Adobe BYO-CDN worker proxying `andricore.com` to `main--andricore--andrii-holovianko.aem.live`.

- DNS (Cloudflare, proxied): `@` and `www` → CNAME `main--andricore--andrii-holovianko.aem.live`
- Redirect rule: `www.andricore.com/*` → `https://andricore.com/${1}` (301)
- Deploy: `npx wrangler deploy` from this folder
