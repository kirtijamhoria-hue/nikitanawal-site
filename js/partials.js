// Injects the shared navbar and footer into every page.
// Content (phone/email/social links) is pulled live from content/settings.json
// so editing it once in the CMS updates every page.

function pathTo(file) {
  // Works whether the page is at the site root or one level deep (e.g. /projects/x.html)
  return document.body.dataset.depth === "1" ? "../" + file : file;
}

function renderNav(activePage) {
  const links = [
    ["index.html", "Home"],
    ["portfolio.html", "Portfolio"],
    ["about.html", "About"],
    ["services.html", "Services"],
    ["videos.html", "Videos"],
    ["contact.html", "Contact"],
  ];

  const linkHtml = links
    .map(([href, label]) => {
      const cls = activePage === href ? "active" : "";
      return `<li><a href="${pathTo(href)}" class="${cls}">${label}</a></li>`;
    })
    .join("");

  return `
  <nav class="nav">
    <div class="nav-inner">
      <a href="${pathTo("index.html")}" class="brand">
        <span class="brand-name">Nikita Nawal</span>
        <span class="brand-sub">Design Studio</span>
      </a>
      <button class="nav-toggle" id="navToggle" aria-label="Open menu">&#9776;</button>
      <ul class="nav-links" id="navLinks">
        ${linkHtml}
        <li class="nav-admin-item" style="display:none"><a href="${pathTo("admin/")}" class="nav-admin-link" id="adminLink">Admin</a></li>
      </ul>
      <a href="${pathTo("contact.html")}" class="nav-cta">Book a Consultation</a>
    </div>
  </nav>`;
}

function renderFooter(settings) {
  const s = settings || {};
  const bg = s.cta_image || s.hero_image || "";

  const ctaBand = `
  <section class="cta-band" style="${bg ? `background-image:url('${bg}')` : ""}">
    <div class="cta-band-overlay"></div>
    <div class="cta-band-content">
      <h2>Ready to transform your space?</h2>
      <a href="${pathTo("contact.html")}" class="btn btn-solid-accent">Book a Free Consultation</a>
    </div>
  </section>`;

  const pinIcon = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 22s7-7.1 7-12.5A7 7 0 0 0 5 9.5C5 14.9 12 22 12 22z"/><circle cx="12" cy="9.5" r="2.4"/></svg>`;
  const phoneIcon = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 4 6a2 2 0 0 1 0-2z"/></svg>`;
  const mailIcon = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>`;

  const socialIcons = [
    { url: s.instagram_url, path: `<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>` },
    { url: s.facebook_url, path: `<path d="M15 8h2V5h-2a4 4 0 0 0-4 4v2H9v3h2v6h3v-6h2.2l.8-3H14V9a1 1 0 0 1 1-1z"/>` },
    { url: s.linkedin_url, path: `<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 10v7M7 7v.01M11 17v-4.5a2 2 0 0 1 4 0V17M11 12.5V17" stroke-linecap="round"/>` },
    { url: s.pinterest_url, path: `<circle cx="12" cy="12" r="9"/><path d="M9.5 17c1-3.5 1.2-5 1.2-6.2a2 2 0 1 1 4 .2c0 1.4-1 3-2.4 3-1 0-1.6-.7-1.6-1.6" stroke-linecap="round"/>` },
  ]
    .filter((i) => i.url)
    .map(
      (i) => `
    <a href="${i.url}" target="_blank" rel="noopener" class="social-icon" aria-label="Social link">
      <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.6">${i.path}</svg>
    </a>`
    )
    .join("");

  const footer = `
  <footer>
    <div class="wrap">
      <div class="footer-grid footer-grid-4">
        <div>
          <div class="footer-brand">
            <span class="footer-brand-name">${s.studio_name || "Nikita Nawal Design Studio"}</span>
            <span class="footer-brand-sub">Design Studio</span>
          </div>
          <p style="color:rgba(243,238,229,0.7); max-width:34ch; margin-top:1em;">${(s.philosophy_body || "").split("\n\n")[0] || ""}</p>
        </div>
        <div>
          <h4>Navigate</h4>
          <ul class="footer-links">
            <li><a href="${pathTo("portfolio.html")}">Portfolio</a></li>
            <li><a href="${pathTo("about.html")}">About</a></li>
            <li><a href="${pathTo("services.html")}">Services</a></li>
            <li><a href="${pathTo("videos.html")}">Videos</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul class="footer-links footer-links-icon">
            <li>${pinIcon}<span>${s.address || ""}</span></li>
            <li>${phoneIcon}<a href="tel:${(s.phone_primary || "").replace(/-/g, "")}">${s.phone_primary || ""}</a></li>
            ${s.phone_secondary ? `<li>${phoneIcon}<a href="tel:${s.phone_secondary.replace(/-/g, "")}">${s.phone_secondary}</a></li>` : ""}
            ${s.email ? `<li>${mailIcon}<a href="mailto:${s.email}">${s.email}</a></li>` : ""}
          </ul>
          ${socialIcons ? `<div class="social-row">${socialIcons}</div>` : ""}
        </div>
        <div>
          <h4>Newsletter</h4>
          <p style="color:rgba(243,238,229,0.7);">Subscribe for design inspiration and studio updates.</p>
          <form class="footer-newsletter" onsubmit="event.preventDefault(); window.location.href='mailto:${s.email || ""}?subject=Newsletter signup&body=' + encodeURIComponent('Please add ' + this.email.value + ' to the newsletter.');">
            <input type="email" name="email" placeholder="your@email.com" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; ${new Date().getFullYear()} ${s.studio_name || "Nikita Nawal Design Studio"}. All rights reserved.</span>
        <span>Indore, Madhya Pradesh</span>
      </div>
    </div>
  </footer>`;

  return ctaBand + footer;
}

async function initPartials(activePage) {
  const headerEl = document.getElementById("site-header");
  const footerEl = document.getElementById("site-footer");
  if (headerEl) headerEl.innerHTML = renderNav(activePage);

  let settings = {};
  try {
    const res = await fetch(pathTo("content/settings.json"));
    settings = await res.json();
  } catch (e) {
    console.error("Could not load settings.json", e);
  }

  if (footerEl) footerEl.innerHTML = renderFooter(settings);

  // WhatsApp floating button
  if (settings.whatsapp_number) {
    const wa = document.createElement("a");
    wa.className = "wa-float";
    wa.target = "_blank";
    wa.rel = "noopener";
    wa.href = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(
      "Hi! I'd like to know more about your interior design services."
    )}`;
    wa.innerHTML = `<svg viewBox="0 0 32 32" fill="white"><path d="M16.001 3C9.373 3 4 8.373 4 15.001c0 2.386.7 4.61 1.902 6.484L4 29l7.7-1.87A11.94 11.94 0 0 0 16 27c6.628 0 12-5.373 12-12S22.63 3 16.001 3zm0 21.818c-1.98 0-3.86-.55-5.47-1.51l-.392-.233-4.57 1.11 1.132-4.454-.256-.406a9.77 9.77 0 0 1-1.51-5.324c0-5.42 4.406-9.818 9.826-9.818 5.42 0 9.826 4.398 9.826 9.818 0 5.42-4.406 9.817-9.826 9.817zm5.39-7.37c-.294-.147-1.738-.858-2.008-.955-.27-.098-.466-.147-.663.147-.196.294-.76.955-.932 1.152-.171.196-.343.22-.637.073-.294-.147-1.24-.457-2.363-1.458-.874-.78-1.464-1.744-1.636-2.038-.171-.294-.018-.453.13-.6.133-.132.294-.343.44-.514.148-.171.197-.294.295-.49.098-.196.049-.368-.025-.514-.073-.147-.663-1.597-.909-2.188-.24-.575-.484-.497-.663-.506l-.564-.01c-.196 0-.514.073-.784.368-.27.294-1.03 1.006-1.03 2.455 0 1.448 1.055 2.847 1.203 3.043.147.196 2.077 3.17 5.032 4.444.703.304 1.251.485 1.679.62.705.224 1.347.192 1.855.117.566-.085 1.738-.71 1.983-1.396.245-.686.245-1.274.171-1.397-.073-.122-.27-.196-.564-.343z"/></svg>`;
    document.body.appendChild(wa);
  }

  // Mobile menu toggle
  const toggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (toggle && navLinks) {
    toggle.addEventListener("click", () => navLinks.classList.toggle("open"));
  }

  // Admin link: shown once this browser has an active Decap CMS session
  // (Decap stores it in localStorage after a successful GitHub login).
  // Note: this only hides the link for people who've never logged in here —
  // the REAL access control is who you've added as a collaborator on the
  // GitHub repo (see admin/config.yml comments), since a hidden link is
  // never true security on its own.
  const adminLink = document.getElementById("adminLink");
  if (adminLink) {
    let hasSession = false;
    try {
      // Decap stores its login under a key ending in "cms-user"
      // (the exact name differs between versions, so check any match).
      hasSession = Object.keys(localStorage).some(
        (k) => /cms-user$/.test(k) && !!localStorage.getItem(k)
      );
    } catch (e) { /* storage blocked: leave the link hidden */ }
    adminLink.classList.toggle("visible", hasSession);
    adminLink.parentElement.style.display = hasSession ? "" : "none";
  }
}


// The admin panel saves projects as { "items": [...] }; older files were a bare list.
// This accepts either, so every page keeps working.
function asProjectList(data) {
  return Array.isArray(data) ? data : (data && data.items) || [];
}
