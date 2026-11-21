# Putting the Perseus Talent website live

This guide is written for the business owner. You do not need to be technical. Take it one step at a time, and keep this file open while you work.

Nothing in this guide needs a password to be shared with anyone else. Wherever a password or key is needed, **you** type it into the website of the service concerned (Netlify, Google, Cloudflare). It should never be pasted into an email, a chat or a file in the project.

Official contact details used on the site: **Perseustalent@gmail.com** and **07555004374**.

---

## 1. What you will need

| Item | Why | Cost |
| --- | --- | --- |
| A domain name (for example `perseustalent.co.uk`) | The web address people type in | Roughly a few pounds a year from a domain seller |
| A Netlify account | Hosts the website | The free plan is enough to start |
| A GitHub account (recommended) | Lets Netlify pick up the website files and update the site automatically | Free |
| The Gmail account `Perseustalent@gmail.com` | Receives the enquiries by email | Free |
| A Cloudflare account (optional but recommended) | Gives the "are you human?" spam check on the forms | Free |

---

## 2. Buy the domain

1. Choose a domain seller you trust (for example 123 Reg, Namecheap, GoDaddy or Cloudflare Registrar).
2. Search for `perseustalent.co.uk` (or your preferred name) and buy it.
3. Keep the seller's login details safe. You will need to come back to the seller's website in step 8 to point the domain at Netlify.

---

## 3. Create a Netlify account

1. Go to <https://www.netlify.com> and choose **Sign up**.
2. The easiest way is **Sign up with GitHub** (create a free GitHub account first at <https://github.com> if you do not have one), or sign up with your email address.
3. Choose the **Free** plan if asked.

---

## 4. Put the website on Netlify

There are two ways. **Option A is recommended.**

### Option A: Connect the website files (recommended)

1. Ask whoever built the site for the project to be uploaded to a **private** GitHub repository, or upload it yourself.
2. In Netlify choose **Add new project**, then **Import an existing project**, then **GitHub**, and pick the Perseus repository.
3. Netlify reads the settings in the file `netlify.toml` automatically (build command `npm run build`). You should not need to change anything on this screen.
4. **Before pressing Deploy**, add the environment variables from step 5 if Netlify offers that screen. If not, deploy first, add them afterwards, and then press **Deploy** again (step 5 explains how).

From now on, whenever the website files change on GitHub, Netlify rebuilds and updates the live site by itself.

### Option B: Upload from a computer using the Netlify command line

Use this only if you cannot use GitHub. Someone comfortable with the command line runs `npm install -g netlify-cli`, then `netlify login`, then `netlify deploy --build --prod` from the project folder.

> Note: Netlify's "drag and drop a folder" feature is only for ready-made static websites. This site has forms that need a small server function, so plain drag-and-drop is **not** suitable. Use Option A or B.

---

## 5. Settings the site needs (environment variables)

These are private settings kept inside Netlify, not in the website files.

**Where to add them:** in Netlify open your site, then **Site configuration**, then **Environment variables**, then **Add a variable**. Add each row below. After adding or changing any variable, go to **Deploys** and choose **Trigger deploy**, then **Deploy site**, so the change takes effect.

| Name | Value to enter | What it does |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://perseustalent.co.uk` | The official web address, used in links and search results |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `true` | Lets Google list the site. Leave as `false` until you are ready to launch publicly |
| `FORM_DELIVERY` | `smtp` | Makes the forms send email through Gmail |
| `SMTP_USER` | `Perseustalent@gmail.com` | The Gmail account that sends the emails |
| `SMTP_APP_PASSWORD` | The 16-character Google App Password (see step 6) | Lets the website send email as that Gmail account. **You type this in yourself.** |
| `ENQUIRY_TO_ADDRESS` | `Perseustalent@gmail.com` | Where enquiries are delivered. You can list more than one address separated by commas, for example `Perseustalent@gmail.com,another@example.com` |
| `SEND_ACKNOWLEDGEMENT` | `true` or `false` | If `true`, the person who fills in a form also gets a short "thank you, we have received it" email. If you do not add this variable it is off |
| `TURNSTILE_ENABLED` | `true` (once you have the keys from step 7) | Switches on the spam check |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | The **Site key** from Cloudflare (step 7) | Public half of the spam check |
| `TURNSTILE_SECRET_KEY` | The **Secret key** from Cloudflare (step 7) | Private half of the spam check. Keep it secret |
| `SHOW_DRAFTS` | `false` | Makes sure unfinished articles are never shown on the live site |

Tips:

- If you also want to see every enquiry in a second mailbox, add a second address to `ENQUIRY_TO_ADDRESS`. Gmail can hide emails sent from an account to itself from the **Sent** folder, so a second address makes sure you have a record.
- `SMTP_HOST` and `SMTP_PORT` are not needed. The site uses Gmail's settings by default.
- If you leave `FORM_DELIVERY` unset on the live site, the forms deliberately show the "temporarily unavailable" message instead of losing enquiries.

---

## 6. Create a Google App Password

The website cannot use your normal Gmail password. Google lets you create a special 16-character password just for it.

1. Sign in to the Gmail account `Perseustalent@gmail.com` at <https://myaccount.google.com>.
2. Open **Security**.
3. Under "How you sign in to Google", make sure **2-Step Verification** is **On**. If it is not, turn it on and follow Google's steps (a phone number or authenticator app is needed).
4. Once 2-Step Verification is on, search for **App passwords** in the search box at the top of the Google Account page (it is not always shown as a menu item), or open <https://myaccount.google.com/apppasswords>.
5. Give it a name such as `Perseus website` and choose **Create**.
6. Google shows a 16-character password (four blocks of four letters). **Copy it now**, because Google will not show it again.
7. In Netlify, paste it as the value of `SMTP_APP_PASSWORD` (remove the spaces if there are any). Then **trigger a new deploy**.

If you ever think the password has been seen by someone else, go back to the same Google page, delete that App password and create a new one.

---

## 7. Spam protection (Cloudflare Turnstile)

This puts a quick, usually invisible, "are you human?" check on all three forms, to stop automated spam.

1. Create a free account at <https://dash.cloudflare.com/sign-up>.
2. In the left menu choose **Turnstile**, then **Add widget** (or **Add site**).
3. Name it `Perseus Talent` and add your domain (for example `perseustalent.co.uk`).
4. Choose the **Managed** widget type if asked, then create it.
5. Cloudflare shows a **Site key** and a **Secret key**. Copy them into Netlify as `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`.
6. Add `TURNSTILE_ENABLED` with the value `true`.
7. Trigger a new deploy.

If you skip this, the site still has two simpler protections (a hidden trap field and a minimum time to fill in the form), but they are weaker.

---

## 8. Connect your domain to Netlify

1. In Netlify open your site, then **Domain management**, then **Add a domain** (or **Add a domain you already own**).
2. Type your domain, for example `perseustalent.co.uk`, and confirm.
3. Netlify then shows you what to change at your domain seller. There are two ways, and Netlify will show the exact values to use:
   - **Easiest: use Netlify DNS.** Netlify gives you four "name server" addresses. Log in to your domain seller, find the **Nameservers** setting for the domain, and replace the current ones with Netlify's four.
   - **Or keep your seller's DNS** and add the records Netlify lists (usually an `A` record for the main domain and a `CNAME` record for `www`).
4. Changes can take from a few minutes up to 24 to 48 hours to spread across the internet.
5. Back in Netlify, under **HTTPS**, choose **Verify DNS configuration** and then **Provision certificate** (Netlify may do this automatically). This gives the padlock (`https://`).
6. Choose which version is the main one (with or without `www`). Netlify redirects the other one automatically.

---

## 9. After launch: test everything

Do these on the live site, ideally on both a computer and a phone. Use real email addresses you can check.

### Test each form

1. **Employer enquiry** (the Employers page and the Contact page): fill it in and submit.
2. **Candidate registration** (the Candidates page): fill it in, attach a CV and submit.
3. **General enquiry** (the Contact page): fill it in and submit.

For each one, check:

- [ ] You see the green "Thank you" message on the site.
- [ ] The email arrives in the **Inbox** of every address listed in `ENQUIRY_TO_ADDRESS` (also look in **Spam** the first time and mark it "Not spam").
- [ ] The email is **also in the Sent folder** of `Perseustalent@gmail.com`. If it is not there, that is a Gmail quirk with mail sent to yourself; the Inbox copy (and a second address, if you added one) is your record.
- [ ] The details look right: name, email, phone, message, and the job title where relevant.
- [ ] Clicking **Reply** replies to the person who filled in the form, not to your own address.
- [ ] If `SEND_ACKNOWLEDGEMENT` is `true`, the address you used on the form receives the polite "thank you" email.

### Test the CV upload

- [ ] A normal PDF, DOC or DOCX under **3MB** goes through and arrives as an attachment you can open.
- [ ] A file over 3MB is refused with a clear message.
- [ ] A different file type (for example a picture) is refused.
- [ ] On an Android phone, the file picker lets you choose a PDF or Word document.

### Test the spam check

- [ ] The "are you human?" check appears on each form and the form still submits normally.

### Test the "unavailable" fallback

This checks that visitors see a helpful message, rather than a broken page, if email ever stops working.

1. In Netlify, change the value of `SMTP_APP_PASSWORD` to something wrong (for example `wrong`) and trigger a deploy.
2. Submit the general form. You should see a message saying online enquiries are temporarily unavailable, with the email address and phone number to use instead.
3. **Put the correct App Password back** and trigger a deploy again. Submit one more test to make sure email works again.

### Final checks

- [ ] `https://perseustalent.co.uk` loads with the padlock, and the `www` version redirects to it.
- [ ] No "draft" or sample articles are visible (`SHOW_DRAFTS` is `false`).
- [ ] Search engines are allowed (`NEXT_PUBLIC_ALLOW_INDEXING` is `true`).

---

## 10. If something goes wrong

- **Forms say "temporarily unavailable":** the App Password is missing or wrong, 2-Step Verification was switched off, or the password was deleted. Create a new App Password (step 6), update it in Netlify and trigger a deploy.
- **Emails go to Spam:** open one and choose **Not spam**. Sending to your own Gmail address from the same Gmail account is the most common cause.
- **A change in Netlify does not seem to apply:** variables only take effect after a new deploy.
- **A very large CV fails:** the limit is 3MB. Ask the candidate to save a smaller PDF or email it to Perseustalent@gmail.com.

For urgent problems visitors can always reach you at Perseustalent@gmail.com or 07555004374, as the site tells them.

---

## 11. Updating articles and specialisms

Insights articles and specialisms are plain MDX files in the `content/` folder (`content/insights/` and `content/specialisms/`). They are edited in code by a developer and published by pushing the change to GitHub; Netlify rebuilds the website automatically. There is no admin panel, and the site does not list job vacancies (candidates register their CV on the Candidates page). See `README.md`, section "Adding New Content", for the file format.

---

## 12. SEO checklist for the owner

The site is already set up for search engines (page titles and descriptions, sitemap, `robots.txt`, structured data for articles). These steps need **you**, because they involve your accounts. Do them once the live site is running with `NEXT_PUBLIC_ALLOW_INDEXING=true`.

1. **Google Search Console** (<https://search.google.com/search-console>): add the **domain** `perseustalent.co.uk`, verify it by adding the DNS record that Google gives you (at your domain seller or in Netlify DNS), then open **Sitemaps** and submit `https://perseustalent.co.uk/sitemap.xml`.
2. **Bing Webmaster Tools** (<https://www.bing.com/webmasters>): sign in and choose **Import from Google Search Console**.
3. **Google Business Profile** (<https://business.google.com>): create the profile as a **service-area business** with **no public address**, using the website address and the official email and telephone number on this site. Do not add a street address unless you want one shown.
4. **Publish the three draft articles** after you have reviewed them (section 11), then aim for **one useful article a month**.
6. **Get listed honestly** in UK recruitment directories (for example REC membership, if it applies to you). **Never buy links.**
7. **Check the redirect:** `https://www.perseustalent.co.uk` should jump to `https://perseustalent.co.uk`. The rules are in `netlify.toml`; make sure the domain in Netlify includes both the `www` and non-`www` versions.
8. **Check the result:** in Search Console, **URL inspection** on the home page should say "URL is on Google" within a few days. If a page says "Excluded by noindex", check that `NEXT_PUBLIC_ALLOW_INDEXING` is `true` in Netlify and redeploy.
