/* ## Load the shared footer on every page. */
async function loadFooter() {
  const response = await fetch('footer.html');
  if (!response.ok) throw Error('Footer could not be loaded.');
  document.querySelector('#site-footer').innerHTML = await response.text();
}
loadFooter().catch(error => console.warn(error.message));
