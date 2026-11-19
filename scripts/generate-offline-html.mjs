import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

// Point OFFLINE_BASE_URL at the running production server (default: the dev server on port 3000).
const BASE_URL = process.env.OFFLINE_BASE_URL || 'http://localhost:3000';
// OFFLINE_ONLY_HTML=1 writes only perseus-talent-offline.html (no PDF, no copies outside the repo).
const ONLY_HTML = process.env.OFFLINE_ONLY_HTML === '1';
const ROOT_DIR = process.cwd();

async function fileToBase64DataUri(filePath, mimeType) {
  try {
    const data = await fs.readFile(filePath);
    return `data:${mimeType};base64,${data.toString('base64')}`;
  } catch (err) {
    console.warn(`Could not read ${filePath}:`, err.message);
    return '';
  }
}

async function buildImageMap() {
  const imageMap = new Map();

  const images = [
    { rel: '/images/about/team-partnership.webp', mime: 'image/webp', file: 'public/images/about/team-partnership.webp' },
    { rel: '/images/candidates/career-consultation.webp', mime: 'image/webp', file: 'public/images/candidates/career-consultation.webp' },
    { rel: '/images/employers/leadership.webp', mime: 'image/webp', file: 'public/images/employers/leadership.webp' },
    { rel: '/images/home/executive-consultation.webp', mime: 'image/webp', file: 'public/images/home/executive-consultation.webp' },
    { rel: '/images/home/healthcare-professional.webp', mime: 'image/webp', file: 'public/images/home/healthcare-professional.webp' },
    { rel: '/images/home/interview-preparation.webp', mime: 'image/webp', file: 'public/images/home/interview-preparation.webp' },
    { rel: '/images/home/job-brief.webp', mime: 'image/webp', file: 'public/images/home/job-brief.webp' },
    { rel: '/images/home/leadership.webp', mime: 'image/webp', file: 'public/images/home/leadership.webp' },
    { rel: '/images/home/team-partnership.webp', mime: 'image/webp', file: 'public/images/home/team-partnership.webp' },
    { rel: '/images/insights/interview-preparation.webp', mime: 'image/webp', file: 'public/images/insights/interview-preparation.webp' },
    { rel: '/images/insights/job-brief.webp', mime: 'image/webp', file: 'public/images/insights/job-brief.webp' },
    { rel: '/images/specialisms/clinical-care.webp', mime: 'image/webp', file: 'public/images/specialisms/clinical-care.webp' },
    { rel: '/brand/logo-emblem.svg', mime: 'image/svg+xml', file: 'public/brand/logo-emblem.svg' },
    { rel: '/brand/logo-full.svg', mime: 'image/svg+xml', file: 'public/brand/logo-full.svg' },
  ];

  for (const item of images) {
    const fullPath = path.join(ROOT_DIR, item.file);
    const dataUri = await fileToBase64DataUri(fullPath, item.mime);
    if (dataUri) {
      imageMap.set(item.rel, dataUri);
    }
  }

  return imageMap;
}

function replaceImageSources(html, imageMap) {
  let processed = html;

  processed = processed.replace(/src=["'](\/_next\/image\?url=([^&"']+)&[^"']*)["']/g, (match, fullUrl, encodedPath) => {
    const decodedPath = decodeURIComponent(encodedPath);
    if (imageMap.has(decodedPath)) {
      return `src="${imageMap.get(decodedPath)}"`;
    }
    return match;
  });

  processed = processed.replace(/src=["'](\/(?:images|brand)\/[^"']+)["']/g, (match, rawPath) => {
    if (imageMap.has(rawPath)) {
      return `src="${imageMap.get(rawPath)}"`;
    }
    return match;
  });

  processed = processed.replace(/\s+srcset=["'][^"']*["']/g, '');

  return processed;
}

async function main() {
  console.log('Generating Standalone Offline HTML & Dynamic PDF for Perseus Talent...');
  const imageMap = await buildImageMap();
  console.log(`Loaded ${imageMap.size} base64 assets.`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Fetching CSS from running site...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  
  const cssUrls = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(l => l.href);
  });

  let allCss = '';
  for (const url of cssUrls) {
    try {
      const response = await page.request.get(url);
      allCss += (await response.text()) + '\n';
    } catch (err) {
      console.warn(`Could not fetch CSS from ${url}:`, err.message);
    }
  }

  // Strip local woff2 font-face rules that fail on file:/// protocol
  allCss = allCss.replace(/@font-face\s*\{[^}]*\/_next\/static\/media\/[^}]*\}/g, '');

  console.log('Extracting global header and footer...');
  const headerHtml = await page.evaluate(() => {
    const header = document.querySelector('header');
    return header ? header.outerHTML : '';
  });

  const footerHtml = await page.evaluate(() => {
    const footer = document.querySelector('footer');
    return footer ? footer.outerHTML : '';
  });

  const routes = [
    { id: 'home', path: '/', title: 'Perseus Talent | UK Healthcare Recruitment Consultancy' },
    { id: 'employers', path: '/employers', title: 'For Employers — Healthcare Recruitment | Perseus Talent' },
    { id: 'candidates', path: '/candidates', title: 'For Candidates — Register Your CV | Perseus Talent' },
    { id: 'fee-calculator', path: '/fee-calculator', title: 'Fee Calculator — Transparent 15% Pricing | Perseus Talent' },
    { id: 'specialisms', path: '/specialisms', title: 'Our Specialisms — Healthcare Practice Areas | Perseus Talent' },
    { id: 'specialism-healthcare', path: '/specialisms/healthcare', title: 'Healthcare Recruitment Specialism | Perseus Talent' },
    { id: 'about', path: '/about', title: 'About Us — Leadership, Heritage & Ethics | Perseus Talent' },
    { id: 'insights', path: '/insights', title: 'Insights — Perspectives on Healthcare Recruitment | Perseus Talent' },
    { id: 'insight-interview', path: '/insights/preparing-for-a-healthcare-interview', title: 'Preparing for a Healthcare Interview | Perseus Talent' },
    { id: 'contact', path: '/contact', title: 'Contact Us — Healthcare Recruitment Enquiries | Perseus Talent' },
    { id: 'privacy-policy', path: '/privacy-policy', title: 'Privacy Policy | Perseus Talent' },
    { id: 'terms', path: '/terms', title: 'Terms and Conditions | Perseus Talent' },
    { id: 'cookie-policy', path: '/cookie-policy', title: 'Cookie Policy | Perseus Talent' },
  ];

  const pagesHtml = [];

  for (const route of routes) {
    console.log(`Extracting route: ${route.path}...`);
    try {
      await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => {
        document.querySelectorAll('[data-reveal]').forEach(el => {
          el.classList.add('revealed');
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
      });

      const mainContent = await page.evaluate(() => {
        const main = document.querySelector('main');
        return main ? main.innerHTML : '';
      });

      pagesHtml.push({
        id: route.id,
        path: route.path,
        title: route.title,
        html: replaceImageSources(mainContent, imageMap)
      });
    } catch (err) {
      console.error(`Failed to extract route ${route.path}:`, err.message);
    }
  }

  await browser.close();

  const processedHeader = replaceImageSources(headerHtml, imageMap);
  const processedFooter = replaceImageSources(footerHtml, imageMap);

  const offlineHtml = `<!DOCTYPE html>
<html lang="en-GB" class="scroll-smooth">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Perseus Talent | UK Healthcare Recruitment Consultancy</title>
  <meta name="description" content="Perseus Talent — High-fidelity, self-contained offline website.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  
  <style>
    /* Inlined Compiled Tailwind CSS v4 */
    ${allCss}

    /* Strict Font Declarations */
    body, button, input, select, textarea, dt, dd {
      font-family: 'Manrope', system-ui, -apple-system, sans-serif;
    }
    h1, h2, h3, h4, .font-serif {
      font-family: 'Cormorant Garamond', Georgia, serif;
    }

    /* Force visual reveal states */
    [data-reveal] {
      opacity: 1 !important;
      transform: none !important;
      transition: none !important;
    }

    /* Showcase Top Bar */
    #showcase-bar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: #1B0B2B;
      border-bottom: 2px solid #C5A15B;
      color: #F7F5F0;
      padding: 0.5rem 1rem;
      font-size: 0.8125rem;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
      transition: transform 0.25s ease;
    }
    #showcase-bar.hidden-bar {
      transform: translateY(-100%);
    }
    #showcase-bar select {
      background: #2D1B42;
      color: #F7F5F0;
      border: 1px solid #C5A15B;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8125rem;
      cursor: pointer;
    }
    #showcase-toggle-pill {
      position: fixed;
      top: 0.5rem;
      right: 0.5rem;
      z-index: 101;
      background: #C5A15B;
      color: #1B0B2B;
      font-weight: 700;
      font-size: 0.75rem;
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      cursor: pointer;
      display: none;
    }
    #showcase-toggle-pill.visible {
      display: block;
    }

    /* Page container visibility */
    .perseus-page-view {
      display: none;
    }
    .perseus-page-view.active {
      display: block;
    }

    /* Mobile drawer active state */
    body.mobile-drawer-open {
      overflow: hidden;
    }
    #offline-mobile-drawer {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(27, 11, 43, 0.98);
      z-index: 95;
      padding: 2rem 1.5rem;
      overflow-y: auto;
      flex-direction: column;
      justify-content: space-between;
    }
    #offline-mobile-drawer.open {
      display: flex;
    }
  </style>
</head>
<body class="bg-silk font-sans text-purple-900 antialiased min-h-screen flex flex-col">

  <!-- Interactive Showcase Floating Control Bar -->
  <div id="showcase-bar">
    <div class="flex items-center gap-2">
      <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
      <span class="font-semibold tracking-wide text-gold-400">PERSEUS TALENT</span>
      <span class="text-white/60">· Offline Interactive Edition</span>
    </div>
    <div class="flex items-center gap-3 flex-wrap">
      <label for="page-selector" class="text-white/80 font-medium text-xs sm:text-sm">Page Tour:</label>
      <select id="page-selector" onchange="navigateToPage(this.value)">
        <option value="/">01 Home (/)</option>
        <option value="/employers">02 For Employers (/employers)</option>
        <option value="/candidates">03 For Candidates (/candidates)</option>
        <option value="/fee-calculator">04 Fee Calculator (/fee-calculator)</option>
        <option value="/specialisms">05 Our Specialisms (/specialisms)</option>
        <option value="/specialisms/healthcare">-- Specialism: Healthcare</option>
        <option value="/about">06 About Us (/about)</option>
        <option value="/insights">07 Insights & Perspectives (/insights)</option>
        <option value="/insights/preparing-for-a-healthcare-interview">-- Insight: Interview Prep</option>
        <option value="/contact">08 Contact Hub (/contact)</option>
        <option value="/privacy-policy">09 Privacy Policy</option>
        <option value="/terms">10 Terms & Conditions</option>
      </select>
      <button type="button" onclick="toggleShowcaseBar(true)" class="text-xs text-white/60 hover:text-gold-400 underline ml-2">Hide Bar</button>
    </div>
  </div>

  <button id="showcase-toggle-pill" type="button" onclick="toggleShowcaseBar(false)">Menu ▼</button>

  <!-- Shared Global Header -->
  <div id="perseus-header-wrapper">
    ${processedHeader}
  </div>

  <!-- Standalone Mobile Navigation Drawer -->
  <div id="offline-mobile-drawer" class="lg:hidden">
    <div class="flex justify-between items-center mb-8">
      <span class="text-gold-400 font-serif tracking-widest text-lg font-bold">PERSEUS TALENT</span>
      <button type="button" onclick="toggleMobileDrawer(false)" class="p-2 text-white hover:text-gold-400" aria-label="Close menu">
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
    <nav class="flex flex-col gap-5 text-xl font-serif text-white">
      <a href="/" class="hover:text-gold-400 border-b border-white/10 pb-2"><span class="text-gold-400 text-sm font-sans mr-2">01</span> Home</a>
      <a href="/employers" class="hover:text-gold-400 border-b border-white/10 pb-2"><span class="text-gold-400 text-sm font-sans mr-2">02</span> For Employers</a>
      <a href="/candidates" class="hover:text-gold-400 border-b border-white/10 pb-2"><span class="text-gold-400 text-sm font-sans mr-2">03</span> For Candidates</a>
      <a href="/specialisms" class="hover:text-gold-400 border-b border-white/10 pb-2"><span class="text-gold-400 text-sm font-sans mr-2">04</span> Our Specialisms</a>
      <a href="/about" class="hover:text-gold-400 border-b border-white/10 pb-2"><span class="text-gold-400 text-sm font-sans mr-2">05</span> About Us</a>
      <a href="/insights" class="hover:text-gold-400 border-b border-white/10 pb-2"><span class="text-gold-400 text-sm font-sans mr-2">06</span> Insights</a>
      <a href="/contact" class="hover:text-gold-400 border-b border-white/10 pb-2"><span class="text-gold-400 text-sm font-sans mr-2">07</span> Contact</a>
    </nav>
    <div class="mt-8 pt-6 border-t border-white/10 flex flex-col gap-4 text-sm font-sans">
      <a href="/fee-calculator" class="w-full py-3 text-center border border-gold-400 text-gold-400 font-semibold tracking-wider hover:bg-gold-400 hover:text-purple-950 transition-colors">CALCULATE YOUR FEE</a>
      <div class="text-white/70 flex flex-col gap-2 mt-2">
        <a href="tel:+447555004374" class="hover:text-gold-400">📞 07555 004374</a>
        <a href="mailto:Perseustalent@gmail.com" class="hover:text-gold-400">✉️ Perseustalent@gmail.com</a>
      </div>
    </div>
  </div>

  <!-- Page Views Container -->
  <main id="perseus-pages-container" class="flex-1">
    ${pagesHtml.map((page, index) => `
      <section id="page-section-${page.id}" data-path="${page.path}" data-title="${page.title}" class="perseus-page-view ${index === 0 ? 'active' : ''}">
        ${page.html}
      </section>
    `).join('\n')}
  </main>

  <!-- Shared Global Footer -->
  <div id="perseus-footer-wrapper">
    ${processedFooter}
  </div>

  <!-- Client-side Interactive Engine -->
  <script>
    const routesMap = ${JSON.stringify(routes.reduce((acc, r) => ({ ...acc, [r.path]: r.id }), {}))};

    function toggleShowcaseBar(hide) {
      const bar = document.getElementById('showcase-bar');
      const pill = document.getElementById('showcase-toggle-pill');
      if (hide) {
        bar.classList.add('hidden-bar');
        pill.classList.add('visible');
      } else {
        bar.classList.remove('hidden-bar');
        pill.classList.remove('visible');
      }
    }

    function navigateToPage(targetPath, targetHash) {
      const cleanPath = targetPath.split('#')[0] || '/';
      const hash = targetHash || targetPath.split('#')[1] || '';
      const sectionId = routesMap[cleanPath];

      if (!sectionId) {
        console.warn('Unknown route:', targetPath);
        return;
      }

      document.querySelectorAll('.perseus-page-view').forEach(p => p.classList.remove('active'));
      const activeSection = document.getElementById('page-section-' + sectionId);
      if (activeSection) {
        activeSection.classList.add('active');
        document.title = activeSection.getAttribute('data-title') || 'Perseus Talent';
      }

      const selector = document.getElementById('page-selector');
      if (selector) selector.value = cleanPath;

      toggleMobileDrawer(false);

      if (hash) {
        setTimeout(() => {
          const targetEl = document.getElementById(hash);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 60);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      updateNavHighlight(cleanPath);
    }

    function updateNavHighlight(path) {
      document.querySelectorAll('header nav a, #offline-mobile-drawer nav a').forEach(a => {
        const href = a.getAttribute('href');
        if (href === path || (path === '/' && href === '/')) {
          a.classList.add('text-gold-400');
        } else {
          a.classList.remove('text-gold-400');
        }
      });
    }

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }

      if (href.startsWith('/') || href.startsWith('#')) {
        e.preventDefault();
        if (href.startsWith('#')) {
          const activeView = document.querySelector('.perseus-page-view.active');
          const currentPath = activeView ? activeView.getAttribute('data-path') : '/';
          navigateToPage(currentPath, href.replace('#', ''));
        } else {
          const [p, h] = href.split('#');
          navigateToPage(p, h);
        }
      }
    });

    function toggleMobileDrawer(open) {
      const drawer = document.getElementById('offline-mobile-drawer');
      if (!drawer) return;
      if (open === undefined) {
        drawer.classList.toggle('open');
      } else if (open) {
        drawer.classList.add('open');
      } else {
        drawer.classList.remove('open');
      }
      document.body.classList.toggle('mobile-drawer-open', drawer.classList.contains('open'));
    }

    document.addEventListener('DOMContentLoaded', () => {
      const headerBtns = document.querySelectorAll('header button');
      headerBtns.forEach(btn => {
        if (btn.querySelector('svg') || btn.getAttribute('aria-label')?.includes('menu')) {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleMobileDrawer();
          });
        }
      });

      // Interactive Fee Calculator Engine
      function attachFeeCalculator() {
        const calcSections = document.querySelectorAll('#page-section-fee-calculator, #page-section-employers, #page-section-home');
        
        calcSections.forEach(sec => {
          const salaryInput = sec.querySelector('input[type="text"][placeholder*="40,000"], input[type="text"][placeholder*="salary"]');
          if (!salaryInput) return;

          const card = salaryInput.closest('.bg-purple-900') || salaryInput.closest('.grid');
          if (!card) return;

          const vatCheckbox = card.querySelector('input[type="checkbox"]');
          const presetBtns = card.querySelectorAll('button');
          const feeDisplay = card.querySelector('.font-serif.text-gold-500.tabular-nums, div[class*="min-h-[72px]"]');

          function updateFee() {
            const raw = salaryInput.value.replace(/[^0-9.]/g, '');
            const salary = parseFloat(raw) || 0;
            const fee = Math.round(salary * 0.15);
            const showVat = vatCheckbox ? vatCheckbox.checked : false;
            const vat = Math.round(fee * 0.20);
            const total = fee + (showVat ? vat : 0);

            const salaryDd = card.querySelector('dd');
            if (salaryDd) {
              salaryDd.textContent = salary > 0 ? '£' + salary.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—';
            }

            if (feeDisplay) {
              feeDisplay.textContent = salary > 0 ? '£' + (showVat ? total.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : fee.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })) : '—';
            }

            const headingSpan = card.querySelector('div.bg-white\\/5 span.block.text-xs, div.bg-white\\/10 span.block.text-xs') || feeDisplay?.closest('.border')?.querySelector('span.block.text-xs');
            if (headingSpan) {
              headingSpan.textContent = salary > 0 && showVat ? 'Estimated recruitment fee (including 20% VAT)' : 'Estimated recruitment fee (excluding VAT)';
            }

            let vatDl = card.querySelector('dl.vat-breakdown-dl');
            if (salary > 0 && showVat) {
              if (!vatDl) {
                vatDl = document.createElement('dl');
                vatDl.className = 'vat-breakdown-dl divide-y divide-white/10 text-sm mt-4';
                vatDl.innerHTML = \`
                  <div class="flex items-center justify-between py-2">
                    <dt class="text-white/70">VAT (20%, illustrative)</dt>
                    <dd class="font-sans text-white/80 tabular-nums vat-figure">£\${vat.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</dd>
                  </div>
                  <div class="flex items-center justify-between py-2 font-medium">
                    <dt class="text-white">Total including illustrative VAT</dt>
                    <dd class="font-sans text-white tabular-nums total-figure">£\${total.toLocaleString('en-GB', { minimumFractionDigits: 2 })}</dd>
                  </div>
                \`;
                const feeBox = feeDisplay ? feeDisplay.closest('.border') : null;
                if (feeBox && feeBox.parentElement) {
                  feeBox.parentElement.insertBefore(vatDl, feeBox.nextSibling);
                }
              } else {
                vatDl.style.display = 'block';
                vatDl.removeAttribute('hidden');
                const vf = vatDl.querySelector('.vat-figure');
                const tf = vatDl.querySelector('.total-figure');
                if (vf) vf.textContent = '£' + vat.toLocaleString('en-GB', { minimumFractionDigits: 2 });
                if (tf) tf.textContent = '£' + total.toLocaleString('en-GB', { minimumFractionDigits: 2 });
              }
            } else if (vatDl) {
              vatDl.style.display = 'none';
              vatDl.setAttribute('hidden', '');
            }

            presetBtns.forEach(btn => {
              const txt = btn.textContent.trim();
              const isMatch = (txt === '£35k' && salary === 35000) ||
                              (txt === '£50k' && salary === 50000) ||
                              (txt === '£75k' && salary === 75000) ||
                              (txt === '£100k' && salary === 100000);
              if (isMatch) {
                btn.classList.add('bg-gold-500', 'text-purple-900', 'font-semibold');
                btn.classList.remove('bg-white/5', 'text-white/80');
              } else {
                btn.classList.remove('bg-gold-500', 'text-purple-900', 'font-semibold');
                btn.classList.add('bg-white/5', 'text-white/80');
              }
            });

            const ctaBtn = card.querySelector('a[href*="/employers"]');
            if (ctaBtn) {
              ctaBtn.setAttribute('href', '/employers?salary=' + salary + '#enquiry');
            }
          }

          salaryInput.addEventListener('input', updateFee);
          if (vatCheckbox) vatCheckbox.addEventListener('change', updateFee);

          presetBtns.forEach(btn => {
            const txt = btn.textContent.trim();
            let val = null;
            if (txt === '£35k') val = '35,000';
            else if (txt === '£50k') val = '50,000';
            else if (txt === '£75k') val = '75,000';
            else if (txt === '£100k') val = '100,000';

            if (val) {
              btn.addEventListener('click', (e) => {
                e.preventDefault();
                salaryInput.value = val;
                updateFee();
              });
            }
          });
        });
      }

      // Contact Pathway Tabs Controller
      function attachContactTabs() {
        const contactSec = document.getElementById('page-section-contact');
        if (!contactSec) return;

        const tabs = contactSec.querySelectorAll('[role="tab"]');
        tabs.forEach(tab => {
          tab.addEventListener('click', () => {
            const panelId = tab.getAttribute('aria-controls');
            if (!panelId) return;

            tabs.forEach(t => {
              t.setAttribute('aria-selected', 'false');
              t.classList.remove('border-gold-400', 'text-gold-400');
              t.classList.add('border-transparent');
            });
            tab.setAttribute('aria-selected', 'true');
            tab.classList.add('border-gold-400', 'text-gold-400');
            tab.classList.remove('border-transparent');

            const panels = contactSec.querySelectorAll('[role="tabpanel"]');
            panels.forEach(p => {
              if (p.id === panelId) {
                p.removeAttribute('hidden');
                p.style.display = 'block';
              } else {
                p.setAttribute('hidden', '');
                p.style.display = 'none';
              }
            });
          });
        });
      }

      // Accordion expand/collapse
      document.querySelectorAll('button[aria-expanded]').forEach(btn => {
        btn.addEventListener('click', () => {
          const isExpanded = btn.getAttribute('aria-expanded') === 'true';
          btn.setAttribute('aria-expanded', !isExpanded);
          const panel = btn.nextElementSibling;
          if (panel) {
            panel.style.display = isExpanded ? 'none' : 'block';
          }
          const icon = btn.querySelector('svg');
          if (icon) {
            icon.style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(45deg)';
          }
        });
      });

      attachFeeCalculator();
      attachContactTabs();
    });
  </script>
</body>
</html>`;

  const outputPath = path.join(ROOT_DIR, 'perseus-talent-offline.html');
  await fs.writeFile(outputPath, offlineHtml, 'utf8');
  console.log(`Successfully generated ${outputPath}! Size: ${(Buffer.byteLength(offlineHtml) / 1024).toFixed(1)} KB`);

  if (ONLY_HTML) return;

  const artifactPath = path.join('C:/Users/nekba/.gemini/antigravity/brain/d2df8d38-3107-4f4f-885a-17bcbe2ae5ef', 'perseus-talent-offline.html');
  try {
    await fs.writeFile(artifactPath, offlineHtml, 'utf8');
    console.log(`Saved copy to artifact directory: ${artifactPath}`);
  } catch (err) {
    console.warn('Could not copy to artifact directory:', err.message);
  }

  // Generate Executive Showcase PDF from the offline HTML
  console.log('Generating Executive Showcase PDF from offline HTML...');
  const pdfBrowser = await chromium.launch({ headless: true });
  const pdfPage = await pdfBrowser.newPage({ viewport: { width: 1440, height: 900 } });
  await pdfPage.goto('file:///' + outputPath.replace(/\\/g, '/'), { waitUntil: 'networkidle' });
  
  // Hide the floating showcase bar in print / PDF mode
  await pdfPage.evaluate(() => {
    const bar = document.getElementById('showcase-bar');
    if (bar) bar.style.display = 'none';
    const pill = document.getElementById('showcase-toggle-pill');
    if (pill) pill.style.display = 'none';
  });

  const pdfOutputPath = path.join(ROOT_DIR, 'perseus-partner-showcase.pdf');
  await pdfPage.pdf({
    path: pdfOutputPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' }
  });
  console.log(`Successfully generated PDF: ${pdfOutputPath}`);

  const artifactPdfPath = path.join('C:/Users/nekba/.gemini/antigravity/brain/d2df8d38-3107-4f4f-885a-17bcbe2ae5ef', 'perseus-partner-showcase.pdf');
  try {
    await fs.copyFile(pdfOutputPath, artifactPdfPath);
    console.log(`Copied PDF to artifact directory: ${artifactPdfPath}`);
  } catch (err) {
    console.warn('Could not copy PDF to artifact directory:', err.message);
  }

  await pdfBrowser.close();
  console.log('All generation complete!');
}

main().catch(err => {
  console.error('Fatal error generating offline HTML and PDF:', err);
  process.exit(1);
});
