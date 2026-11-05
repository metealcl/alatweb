# ALAT website security review — 2026-11-05

## Scope and limitations
Authorized, non-destructive review of https://alatmedya.tech and the current public metealcl/alatweb source at 6c635b7656cb10a3afce08397789e10ec9e7680d. This is a bounded static-site review, not a comprehensive penetration test or certification. CepLog, email/WhatsApp providers, GitHub infrastructure, DNS account settings and authenticated systems were not tested. No credential guessing, load testing, exploitation, form transmission or persistent payloads were used. Repository history and binary assets were not secret-scanned.

## Observed evidence before changes
- HTTPS HEAD returned 200 with certificate verification enabled (curl, 2026-11-05 06:37 UTC). HTTP HEAD returned 301 with Location: https://alatmedya.tech/.
- HTTPS response omitted Content-Security-Policy, Strict-Transport-Security, X-Frame-Options, X-Content-Type-Options, Referrer-Policy and Permissions-Policy.
- Four GET requests to /.env, /.git/config, /package.json and /alat-audit-missing-20261105 returned 404. These checks do not prove all sensitive paths are protected.
- Three legacy pages loaded executable https://cdn.tailwindcss.com without a pinned artifact or integrity attribute: privacy-policy.html, kvkk.html, cookie-policy.html.
- Source review found no innerHTML, document.write or eval sinks in the reviewed text files. Lab uses textContent; mailto values use encodeURIComponent.
- No matches for selected GitHub token, AWS access-key ID and private-key patterns in current HTML/CSS/JS. This is not exhaustive secret detection.
- Static source has no authentication, server-side database or payment endpoint. SQL injection and account authorization testing are not applicable to these files; no claim is made about other systems.
- Access-Control-Allow-Origin: * on public static content is not treated as a demonstrated credential/data leak.

## Findings and remediation
### SEC-01 — Low: unconstrained script loading / remote runtime dependency
Defense-in-depth gap and third-party supply-chain exposure, not a demonstrated exploit. Removed the three remote Tailwind scripts and migrated their content into the site's stylesheet/layout. Removed inline style attributes. Added CSP to all HTML:
default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; upgrade-insecure-requests.
Google Fonts remains an explicit external style/font dependency. CSP is delivered through meta, not an HTTP response header.

### SEC-02 — Low: missing response-level hardening (OPEN)
HSTS, X-Content-Type-Options: nosniff, and frame-ancestors / X-Frame-Options were absent. No sensitive authenticated action exists on this reviewed site, which limits demonstrated clickjacking impact. A GitHub Pages HTML commit cannot set these HTTP headers. No ineffective meta frame-ancestors or _headers file was added.
Next infrastructure step: configure a supported reverse proxy/CDN or hosting platform to return CSP including frame-ancestors 'none', X-Content-Type-Options: nosniff and suitable Permissions-Policy. Introduce HSTS after validating HTTPS coverage; do not blindly enable includeSubDomains or preload. Recheck delivered headers afterwards.

### SEC-03 — Informational: referrer behavior and legacy policy mismatch
Added strict-origin-when-cross-origin referrer policy via meta. Cookie page now describes the observed lack of site analytics/storage and the external font/communication dependencies. Existing privacy/KVKK legal statements are preserved, not legally certified or verified.

## Product changes
Project brief preview and clipboard copy with explicit unsent status; optional timing/priority; bounded input lengths; homepage FAQ; branded 404 page. Contact still creates a mailto draft and does not submit to a server. No fake success acknowledgement.

## Validation
- All 25 HTML files checked for CSP and absence of inline/remote executable scripts and inline style/event attributes.
- Internal file destinations checked against the repository tree; no missing destinations.
- JavaScript parses.
- Handler tests with a mocked DOM: brief preview uses textContent, copy output matches the current form, mailto body round-trips through percent encoding.
- A synthetic HTML string and an &bcc= value stayed inside the encoded message body; no additional recipient parameter was created. This is a handler test, not an end-to-end browser exploit test.
- Browser rendering/CSP enforcement and clipboard permissions were not verified in this environment. Header-dependent findings remain open.
- No critical/high exploitable vulnerability was demonstrated by these limited checks. Absence of a finding is not a guarantee of security.

References:
https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP
https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors
https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https
