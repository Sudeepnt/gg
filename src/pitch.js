/* Pitch us: intro text + "Click Here to Start" → the old gg site's application form, ported unchanged (same markup,
   class names, CSS scoped under .ggform, validation and fields). Copy and labels come from the CMS (cms.pitch, cms.form);
   submissions go through inquiries.js to the same Supabase table and storage bucket as before. */
import snapshot from './cms-data.json';
import { loadCMS } from './cms.js';
import { saveInquiry, uploadFile } from './inquiries.js';

const root = document.getElementById('pitch');
if (root) {
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ICON = {
    check: '<path d="M20 6 9 17l-5-5"/>', x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>', down: '<path d="m6 9 6 6 6-6"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
    loader: '<path d="M21 12a9 9 0 1 1-6.219-8.56"/>',
  };
  const ico = (n, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICON[n]}</svg>`;
  const platformsOf = L => String(L.platformOptions || 'Console, Mobile, PC, VR').split(',').map(x => x.trim()).filter(Boolean);
  const MAX_FILES = 5, MAX_BYTES = 50 * 1024 * 1024;
  let cms = snapshot, ov = null, files = [], platforms = [], multi = false, bot = false;

  /* the application form opens as a full-screen page over the site (like the old /form page) */
  function openForm() {
    if (ov) return;
    ov = document.createElement('div');
    ov.className = 'ggov';
    ov.setAttribute('data-lenis-prevent', '');
    ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', (((cms.form || {}).labels) || {}).formAria || 'Application form');
    ov.innerHTML = form();
    document.body.appendChild(ov);
    document.body.style.overflow = 'hidden';
    wire(); ov.scrollTop = 0;
  }
  function closeForm() { if (!ov) return; ov.remove(); ov = null; document.body.style.overflow = ''; }
  const show = v => { if (v === 'form') openForm(); else { closeForm(); window.ggGo && window.ggGo('pitch'); } };
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && ov && !ov.querySelector('.ggpop')) closeForm(); });

  function intro() {
    const p = cms.pitch || {};
    return `<div class="pt-intro">
      <h3 class="pt-h">${esc(p.title)}</h3>
      ${(p.paragraphs || []).map(t => `<p class="lead">${esc(t)}</p>`).join('')}
      <div class="fbtns"><button class="btn" type="button" id="pstart">${esc(p.buttonText || 'Click Here to Start')}</button></div>
    </div>`;
  }

  const grp = (label, hint, inner, cls = '') =>
    `<div class="form-group ${cls}"><label>${esc(label)}</label>${hint ? `<p class="field-hint">${esc(hint)}</p>` : ''}${inner}</div>`;
  const inp = (id, o = {}) => `<input id="${id}" type="${o.type || 'text'}" ${o.req ? 'required' : ''} ${o.ph ? `placeholder="${esc(o.ph)}"` : ''}>`;
  const area = (id, req) => `<textarea id="${id}" ${req ? 'required' : ''} maxlength="2000"></textarea><span class="char-count" id="${id}_c">0/2000</span>`;

  function form() {
    const f = cms.form || {}, L = f.labels || {};
    const d = (k, dflt) => L[k] || dflt;
    return `<div class="ggform form-page-container"><button type="button" class="close-button" id="pf_close" aria-label="${esc(d('closeForm', 'Close form'))}">${ico('x')}</button><div class="form-card" id="pf_card">
      <div class="form-header">
        <div class="header-top"><img class="header-logo" src="/logos/logo1black.png" alt="Logo" width="80" height="80"></div>
        <h1>${esc(f.title)}</h1>
        <p class="intro-text">${esc(f.intro)}</p>
      </div>
      <form id="pform" class="application-form">
        ${grp(d('studioName', 'Studio / Creator Name'), '', inp('pf_studio', { req: 1 }))}
        ${grp(d('studioWebsite', 'Studio or Portfolio Website'), d('studioWebsiteHint', '(If solo creator, link to portfolio or previous work)'), inp('pf_site', { type: 'url' }))}
        ${grp(d('yourName', 'Your Name'), '', inp('pf_name', { req: 1 }))}
        ${grp(d('email', 'Your Email Address'), '', inp('pf_email', { type: 'email', req: 1 }))}
        ${grp(d('country', 'Country'), '', inp('pf_country', { req: 1 }))}
        ${grp(d('gameTitle', 'Game / Project Title'), d('gameTitleHint', '(This can be a working title or internal project codename.)'), inp('pf_title', { req: 1 }))}
        ${grp(d('collaboration', 'What kind of collaboration are you seeking?'), d('collaborationHint', '(Select all that apply)'),
          `<div class="support-info">
            <p><strong>${esc(d('collabCoDev', 'Co-Development Partnership'))}:</strong> ${esc(L.collabCoDevDesc)}</p>
            <p><strong>${esc(d('collabCoFunding', 'Project Co-Funding'))}:</strong> ${esc(L.collabCoFundingDesc)}</p>
            <p><strong>${esc(d('collabPublishing', 'Go-To-Market & Publishing Support'))}:</strong> ${esc(L.collabPublishingDesc)}</p>
          </div>
          <div class="select-wrapper"><select id="pf_collab" required>
            <option value="">${esc(d('selectPlaceholder', 'Select an option'))}</option>
            <option value="co-dev">${esc(d('collabCoDev', 'Co-Development Partnership'))}</option>
            <option value="co-funding">${esc(d('collabCoFunding', 'Project Co-Funding'))}</option>
            <option value="publishing">${esc(d('collabPublishing', 'Go-To-Market & Publishing Support'))}</option>
          </select>${ico('down', 'select-arrow')}</div>`)}
        ${grp(d('description', 'Short Project Description'), d('descriptionHint', '(Tell us what you’re building, why it matters, and what makes it distinct.)'), area('pf_desc', true))}
        ${grp(d('totalBudget', 'Total Project Budget (USD)'), d('totalBudgetHint', '(The estimated total cost to ship the project, including any spend to date.)'), inp('pf_total'))}
        ${grp(d('budgetAsk', 'Collaboration Budget Ask (USD)'), d('budgetAskHint', '(How much support are you seeking from Gattabara Games?)'), inp('pf_ask', { type: 'number', req: 1 }))}
        ${grp(d('platforms', 'Target Platform(s)'), d('platformsHint', '(Select all that apply.)'),
          `<div class="platforms-grid">${platformsOf(L).map(p => `<div class="checkbox-row" data-plat="${p}"><div class="custom-checkbox"></div><span>${p}</span></div>`).join('')}</div>`)}
        ${grp(d('genre', 'Genre'), '', inp('pf_genre', { req: 1 }))}
        ${grp(`${d('compTitle', 'Comparable Title')} 1`, d('compTitleHint', '(Based on gameplay, tone, and scope. Preferably released in the last 10 years.)'), inp('pf_comp1'))}
        ${grp(`${d('compTitle', 'Comparable Title')} 2`, '', inp('pf_comp2'))}
        ${grp(`${d('compTitle', 'Comparable Title')} 3`, '', inp('pf_comp3'))}
        ${grp(d('materials', 'Playable / Materials'), L.materialsHint || '',
          `<div class="upload-area" id="pf_drop">${ico('upload', 'upload-icon')}
            <p><span>${esc(d('chooseFile', 'Choose a file to upload'))}</span> ${esc(d('dragDrop', 'or drag and drop here'))}</p>
            <input id="pf_files" type="file" multiple hidden accept=".pdf,.doc,.docx,.zip,.rar,.txt,.jpg,.png,.mp4,.mov">
          </div><div id="pf_list"></div>`)}
        ${grp(d('materialsLinks', 'Materials (Links) and/or Access Details'), L.materialsLinksHint || '', `<textarea id="pf_links" maxlength="2000"></textarea><span class="char-count" id="pf_links_c">0/2000</span>`)}
        <div class="form-group checkbox-group">
          <div class="checkbox-wrapper"><input type="checkbox" id="multiplayer"><div class="custom-checkbox" id="pf_multi_box"></div></div>
          <div class="checkbox-text"><label for="multiplayer">${esc(d('multiplayer', 'Is this a Multiplayer Build?'))}</label><p class="field-hint">${esc(d('multiplayerHint', '(Check the box if the build requires local/online multiplayer.)'))}</p></div>
        </div>
        ${grp(d('launchWindow', 'Target Launch Window (Quarter / Year)'), d('launchWindowHint', '(Format: Q1 2026)'), inp('pf_launch', { req: 1, ph: d('launchWindowHint', 'Q1 2026') }))}
        ${grp(d('estimatedPrice', 'Estimated Launch Price (USD)'), d('estimatedPriceHint', '(Your current target price at launch. This can evolve.)'), inp('pf_price', { req: 1 }))}
        ${grp(d('teamSize', 'Current Team Size'), d('teamSizeHint', '(Number of people actively working on the project.)'), inp('pf_team'))}
        ${grp(d('additionalNotes', 'Additional Notes'), d('additionalNotesHint', '(Anything else we should know about the project, team, or vision.)'), `<textarea id="pf_notes" maxlength="2000"></textarea><span class="char-count" id="pf_notes_c">0/2000</span>`)}
        ${grp(d('howHeard', 'How did you hear about Gattabara Games?'), d('howHeardHint', '(Referral, person, event, community, etc. Helps us route your submission internally.)'), inp('pf_heard'))}
        <div class="recaptcha-box">
          <div class="recaptcha-left">
            <div class="captcha-checkbox-wrapper" id="pf_bot"><div class="captcha-checkbox"></div><span class="captcha-label">${esc(d('notRobot', "I'm not a robot"))}</span></div>
            <p class="recaptcha-msg">${esc(d('captchaNote', 'reCAPTCHA is changing its terms of service.'))}<br><a href="#" onclick="return false">${esc(d('captchaAction', 'Take action.'))}</a></p>
          </div>
          <div class="recaptcha-right"><div class="recaptcha-branding">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2v4c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l3.46 2c.79-1.43 1.24-3.07 1.24-4.8 0-5.52-4.48-10-10-10z" fill="#4285F4"/><path d="M6 12c0-1.01.25-1.97.7-2.8L3.24 7.2C2.45 8.63 2 10.27 2 12c0 5.52 4.48 10 10 10v-4c-3.31 0-6-2.69-6-6z" fill="#9BA2A6"/><path d="M12 18l-3.46 2C9.33 21.43 10.63 22 12 22s2.67-.57 3.46-2L12 18z" fill="#9BA2A6"/></svg>
            <span class="branding-text">${esc(d('captchaBrand', 'reCAPTCHA'))}</span>
            <div class="branding-links"><a href="#" onclick="return false">${esc(d('captchaPrivacy', 'Privacy'))}</a> - <a href="#" onclick="return false">${esc(d('captchaTerms', 'Terms'))}</a></div>
          </div></div>
        </div>
        <div class="form-footer"><button type="submit" class="submit-button" id="psend">${esc(d('submit', 'Submit'))}</button></div>
      </form>
      <div id="pf_ov"></div>
    </div></div>`;
  }

  /* centered notice (replaces the browser's alert()) */
  function notify(message) {
    const host = ov || document.body;
    if (host.querySelector('.ggpop')) return;
    const pop = document.createElement('div');
    pop.className = 'ggpop'; pop.setAttribute('role', 'alertdialog'); pop.setAttribute('aria-modal', 'true');
    pop.innerHTML = `<div class="ggpop-card"><p></p><button type="button">OK</button></div>`;
    pop.querySelector('p').textContent = message;
    const done = () => { pop.remove(); document.removeEventListener('keydown', key, true); };
    const key = e => { if (e.key === 'Escape' || e.key === 'Enter') { e.stopPropagation(); done(); } };
    pop.addEventListener('mousedown', e => { if (e.target === pop) done(); });
    pop.querySelector('button').onclick = done;
    host.appendChild(pop); document.addEventListener('keydown', key, true);
    pop.querySelector('button').focus();
  }
  const $ = s => (ov || root).querySelector(s), val = id => $('#' + id).value.trim();
  const mb = n => (n / (1024 * 1024)).toFixed(2);

  function renderFiles() {
    const box = $('#pf_list'); $('#pf_drop').classList.toggle('has-files', files.length > 0);
    box.innerHTML = files.length ? `<div class="selected-files-list">${files.map((f, i) =>
      `<div class="file-item"><span class="file-name">${esc(f.name)}</span><span class="file-size">(${mb(f.size)} MB)</span><button type="button" class="remove-file" data-rm="${i}">${ico('x')}</button></div>`).join('')}
      <div class="total-size-indicator">Total: ${mb(files.reduce((n, f) => n + f.size, 0))} MB / 50 MB</div></div>` : '';
    box.querySelectorAll('[data-rm]').forEach(b => b.onclick = e => { e.stopPropagation(); files.splice(+b.dataset.rm, 1); renderFiles(); });
  }
  function addFiles(list) {
    const add = Array.from(list);
    if (files.length + add.length > MAX_FILES) return notify(((cms.form || {}).labels || {}).alertFiles || 'You can only upload up to 5 files.');
    if (files.concat(add).reduce((n, f) => n + f.size, 0) > MAX_BYTES) return notify(((cms.form || {}).labels || {}).alertSize || 'Total file size must be under 50MB.');
    files = files.concat(add); renderFiles();
  }

  /* loading / success / error overlays, same as the old page */
  function status(s, extra = '') {
    const L = (cms.form || {}).labels || {}, ov = $('#pf_ov'), btn = $('#psend');
    btn.disabled = s === 'loading';
    btn.innerHTML = s === 'loading' ? `${ico('loader', 'spin')}${esc(L.submitting || 'Submitting...')}` : s === 'success' ? `${ico('check')}${esc(L.submitted || 'Submitted!')}` : esc(s === 'error' ? (L.tryAgain || 'Try Again') : (L.submit || 'Submit'));
    ov.innerHTML = s === 'loading' ? `<div class="ov"><div class="ovi">${ico('loader', 'spin')}<h2>${esc(L.sendingTitle || 'Sending Application')}</h2><p>${esc(extra)}</p></div></div>`
      : s === 'success' ? `<div class="ov ok"><div class="ovi"><div class="badge good">${ico('check')}</div><h2>${esc(L.successTitle || 'Application Received!')}</h2><p>${esc(L.successMessage || 'Thank you for introducing your project. Our team will review your application and get back to you soon.')}</p><button type="button" class="darkbtn" id="pf_ret">${esc(L.successButton || 'Return to Pitch Page')}</button></div></div>`
      : s === 'error' ? `<div class="ov bad"><div class="ovi"><div class="badge fail">${ico('x')}</div><h2>${esc(L.failTitle || 'Submission Failed')}</h2><p class="errbox">${esc(extra)}</p><button type="button" class="darkbtn" id="pf_retry">${esc(L.tryAgain || 'Try Again')}</button></div></div>` : '';
    const r = $('#pf_ret'); if (r) r.onclick = () => { reset(); show('intro'); };
    const t = $('#pf_retry'); if (t) t.onclick = () => status('idle');
  }
  const reset = () => { files = []; platforms = []; multi = false; bot = false; };

  async function submit(e) {
    const L = (cms.form || {}).labels || {};
    e.preventDefault();
    if (!bot) return notify(((cms.form || {}).labels || {}).alertRobot || 'Please verify that you are not a robot.');
    status('loading', '');
    try {
      const attachedFiles = []; let n = 0;
      for (const f of files) { n++; status('loading', `Uploading ${f.name} (${n}/${files.length})...`); attachedFiles.push(await uploadFile(f)); }
      status('loading', L.finalizing || 'Finalizing submission...');
      const formData = {
        studioName: val('pf_studio'), studioWebsite: val('pf_site'), yourName: val('pf_name'), email: val('pf_email'),
        country: val('pf_country'), gameTitle: val('pf_title'), collaborationTypes: [$('#pf_collab').value], description: $('#pf_desc').value,
        totalBudget: val('pf_total'), budgetAsk: val('pf_ask'), platforms: platforms.slice(),
        genre: val('pf_genre'), compTitle1: val('pf_comp1'), compTitle2: val('pf_comp2'), compTitle3: val('pf_comp3'),
        materialsLink: $('#pf_links').value, isMultiplayer: multi, launchWindow: val('pf_launch'),
        estimatedPrice: val('pf_price'), teamSize: val('pf_team'), additionalNotes: $('#pf_notes').value, howHeard: val('pf_heard'), isCaptchaVerified: bot,
      };
      await saveInquiry({
        name: formData.yourName, email: formData.email,
        message: `Studio: ${formData.studioName}\nProject: ${formData.gameTitle}\nDescription: ${formData.description}`,
        fullData: { ...formData, attachedFiles },
      });
      files = []; status('success');
    } catch (ex) {
      console.error('Submission error:', ex);
      status('error', ex.message || L.errorFallback || 'An unexpected error occurred. Please check your connection and try again.');
    }
  }

  function wire() {
    $('#pf_close').onclick = () => show('intro');
    $('#pform').addEventListener('submit', submit);
    [['pf_desc'], ['pf_links'], ['pf_notes']].forEach(([id]) => $('#' + id).addEventListener('input', () => ($('#' + id + '_c').textContent = $('#' + id).value.length + '/2000')));
    ov.querySelectorAll('[data-plat]').forEach(r => r.onclick = () => {
      const p = r.dataset.plat, on = !platforms.includes(p);
      platforms = on ? [...platforms, p] : platforms.filter(x => x !== p);
      const box = r.querySelector('.custom-checkbox'); box.classList.toggle('checked', on); box.innerHTML = on ? ico('check', 'check-icon') : '';
    });
    $('#multiplayer').addEventListener('change', e => { multi = e.target.checked; const b = $('#pf_multi_box'); b.classList.toggle('checked', multi); b.innerHTML = multi ? ico('check', 'check-icon') : ''; });
    $('#pf_bot').onclick = () => { bot = !bot; $('#pf_bot').classList.toggle('verified', bot); $('#pf_bot .captcha-checkbox').innerHTML = bot ? `<svg class="ico" style="width:20px;height:20px;color:#00ad00;stroke-width:4" viewBox="0 0 24 24">${ICON.check}</svg>` : ''; };
    const drop = $('#pf_drop'), input = $('#pf_files');
    drop.addEventListener('click', () => input.click());
    input.onclick = e => e.stopPropagation();
    input.onchange = () => { addFiles(input.files); input.value = ''; };
    drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('drag-active'); });
    drop.addEventListener('dragleave', e => { e.preventDefault(); drop.classList.remove('drag-active'); });
    drop.addEventListener('drop', e => { e.preventDefault(); drop.classList.remove('drag-active'); if (e.dataTransfer.files) addFiles(e.dataTransfer.files); });
    renderFiles();
  }

  function render() {
    root.innerHTML = intro();
    $('#pstart').onclick = () => show('form');
    window.dispatchEvent(new Event('resize'));   /* panel height changed: let the window stack re-measure */
  }

  render();
  loadCMS().then(c => { cms = c; if (!ov) render(); });   /* live copy from Supabase replaces the bundled snapshot */
}
