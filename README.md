# Nikita Nawal Design Studio — Website

A free-to-host portfolio website with a self-editable admin panel (no monthly
platform fee, unlike Hercules/Replit/Base44). This uses:

- **Plain HTML/CSS/JS** — no build step, no framework, loads fast
- **Decap CMS** (free, open-source) — the admin dashboard for adding projects,
  photos, videos and testimonials
- **Netlify** (free tier) — hosting for the site itself
- **Cloudflare Workers** (free tier) — a small OAuth proxy that lets the CMS
  log in via GitHub and save changes directly to your repo
- **GitHub** (free) — stores your content as files; every edit is a saved,
  reversible version

The only unavoidable ongoing cost is the domain name itself (~₹800–1,200/year,
same as any website, anywhere).

---

## 1. Push this folder to GitHub

1. Create a free GitHub account if you don't have one: https://github.com/signup
2. Create a new **empty** repository (e.g. `nikitanawal-website`) — don't add a README/gitignore when prompted, since this folder already has one.
3. From inside this folder, run:
   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/nikitanawal-website.git
   git push -u origin main
   ```

## 2. Connect it to Netlify (free hosting)

1. Sign up free at https://app.netlify.com (sign in with GitHub — one click).
2. **Add new site → Import an existing project → Deploy with GitHub** → pick your `nikitanawal-website` repo.
3. Build settings: leave the build command **blank** and set publish directory to `.` (this is a no-build static site). Click **Deploy**.
4. Netlify gives you a free URL immediately, like `random-name-123.netlify.app` — the site is now live.

## 3. Turn on the admin login (GitHub OAuth — no Netlify Identity needed)

Netlify has deprecated Git Gateway, so this site uses a small, free, self-hosted
OAuth proxy instead — more future-proof, and genuinely free forever (Cloudflare's
free tier is generous and has no expiry).

### 3a. Create a GitHub OAuth App (one-time, ~2 minutes)
1. Go to https://github.com/settings/developers → **OAuth Apps → New OAuth App**.
2. **Application name**: anything, e.g. "Nikita Nawal Site Admin"
3. **Homepage URL**: your Netlify site URL (e.g. `https://nikitanawal.com`)
4. **Authorization callback URL**: you'll fill this in after step 3b — leave a
   placeholder like `https://example.com/callback` for now, you'll edit it shortly.
5. Click **Register application**. Copy the **Client ID**, and click
   **Generate a new client secret** and copy that too — you'll need both next.

### 3b. Deploy the OAuth proxy (Cloudflare Worker, free, no CLI needed)
1. Sign up free at https://dash.cloudflare.com (no credit card required for the free tier).
2. Go to **Workers & Pages → Create → Create Worker**. Give it a name (e.g. `nikitanawal-oauth`) and deploy the default template.
3. Click **Edit code**. Delete the placeholder code and paste in the contents of `oauth-proxy/worker.js` from this folder. Click **Deploy**.
4. Your Worker now has a URL like `https://nikitanawal-oauth.yourname.workers.dev` — copy it.
5. Go back to your GitHub OAuth App (step 3a) and update the **Authorization callback URL** to: `https://nikitanawal-oauth.yourname.workers.dev/callback`
6. Back in Cloudflare, go to your Worker → **Settings → Variables and Secrets** → add two **secret** variables: `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`, pasted from step 3a. Save.

### 3c. Point the site at your new proxy
1. Open `admin/config.yml` in this folder and edit the two placeholder lines:
   ```yaml
   repo: YOUR-GITHUB-USERNAME/nikitanawal-website
   base_url: https://nikitanawal-oauth.yourname.workers.dev
   ```
2. Re-upload the updated file to GitHub (or push via GitHub Desktop) and redeploy on Netlify.

### 3d. Control who can log in
Access is controlled by **GitHub repo collaborators**, not a separate invite
system. On your repo page: **Settings → Collaborators → Add people**, and
invite whichever GitHub account(s) should be able to use `/admin` — e.g.
Nitesh's GitHub account, plus your own temporarily while testing. Anyone not
added as a collaborator cannot log in, even if they find the `/admin` URL.

## 4. Connect the real domain

1. **Site configuration → Domain management → Add a custom domain** → enter `nikitanawal.com`.
2. Netlify shows you the DNS records to add. If the domain is currently with Wix (as discussed — her old site is on Wix, which often also hosts the domain), go into the Wix domain settings and either:
   - Update the DNS records to point to Netlify (keeps the domain registered with Wix, just points it elsewhere), or
   - Transfer the domain to a registrar of your choice (more steps, not required)
3. Netlify auto-issues a free SSL certificate once DNS is pointed correctly (usually within a few hours).

## 5. Using the admin panel day-to-day

1. Go to `nikitanawal.com/admin`
2. Click **Login with GitHub**, and sign in with a GitHub account that's been added as a collaborator on the repo (see step 3d)
3. **Portfolio Projects** → add/edit a project — same fields as discussed:
   Title, Slug, Category, Style, Location, Area, Scope, Duration, Hero Image,
   Gallery Images, Video Embed URL, Narrative, Client Quote, Client Name,
   Featured toggle, Display Order.
4. **Site Settings** → edit the phone number, tagline, philosophy text,
   founder photo, services, testimonials — all in one place, updates
   everywhere on the site instantly.
5. Click **Publish** — the change goes live within about a minute.

### Image uploads
Clicking any image field opens a real upload button — select a photo from
your phone or computer directly, same as the Convex-based upload Hercules
described. Images are stored in your GitHub repo automatically.

**Before uploading:** resize to under ~2000px wide and compress with
https://squoosh.app — same guidance as before, since this setup (like
Hercules) doesn't auto-compress images for you.

### Adding a video
Paste a YouTube or Vimeo **embed** URL into "Walkthrough Video Embed URL" —
e.g. `https://www.youtube.com/embed/VIDEO_ID`. Videos never autoplay or
preload; they only load once a visitor clicks the play button, on both the
project page and the Videos gallery page.

### New projects automatically get a working page
There's no need to create a new HTML file per project — `project.html`
reads whichever project's slug is in the URL and renders it from
`content/projects.json`. Add a project in the CMS and it's instantly
reachable at `nikitanawal.com/project.html?slug=your-slug`, and shows up on
the Portfolio grid and (if Featured) the homepage automatically.

## 6. What this setup does NOT include (trade-offs vs. Hercules)

- No AI chat to build new page layouts — structural changes (a new page, a
  redesigned section) require editing HTML/CSS directly, not prompting an AI.
- No automatic image compression — same limitation Hercules had.
- The contact form currently opens the visitor's email app rather than
  submitting silently. To collect submissions directly, add
  `data-netlify="true"` to the `<form>` tag in `contact.html` and Netlify
  Forms (free, generous limit) will capture entries into your dashboard —
  ask a developer or send this file back to an AI coding tool for that one
  small change if you'd like it done.
- Netlify's free tier has generous but real limits (100GB bandwidth/month,
  300 build minutes/month) — a small studio portfolio site will not come
  close to these under normal traffic.

## 7. Recap: who pays for what, going forward

| Item | Cost | Who should pay |
|---|---|---|
| Domain renewal | ~₹800–1,200/year | Nikita (studio expense, same as rent) |
| Netlify hosting | **Free**, within normal traffic | — |
| GitHub | **Free** | — |
| Decap CMS | **Free**, open-source | — |

No monthly platform bill, unlike Hercules/Replit — the only recurring cost
left is the domain itself, which is unavoidable on any platform.
