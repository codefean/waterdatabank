/* ## Load the shared header and mark the current navigation link. */
import {seresURL} from './config.js';

async function loadHeader() {
  const response = await fetch('header.html');
  if (!response.ok) throw Error('Header could not be loaded.');
  const header = document.querySelector('#site-header');
  header.innerHTML = await response.text();
  const page = location.pathname.split('/').pop() || 'index.html';
  header.querySelector(`nav a[href="${['index.html','contact.html'].includes(page) ? page : ''}"]`)?.setAttribute('aria-current', 'page');
  try {
    const url = new URL(seresURL);
    if (['https:', 'http:'].includes(url.protocol)) {
      const link = header.querySelector('#seres-link');
      if (link) { link.href = url.href; link.hidden = false; }
    }
  } catch { /* ## A blank SERES URL leaves this optional link hidden. */ }
}
loadHeader().catch(error => console.warn(error.message));
