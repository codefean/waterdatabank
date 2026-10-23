/* ## Small shared helpers. Content lives in data/datasets.csv. No dependencies. */
export const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function safeURL(value) {
  try { const url=new URL(value); return ['https:','http:'].includes(url.protocol) ? url.href : ''; } catch { return ''; }
}
export function parseCSV(text) {
  const rows=[]; let row=[],field='',quoted=false;
  text=text.replace(/^\uFEFF/,'');
  for(let i=0;i<text.length;i++) {
    const c=text[i];
    if(c==='"') { if(quoted && text[i+1]==='"') {field+='"';i++;} else quoted=!quoted; }
    else if(c===',' && !quoted) {row.push(field);field='';}
    else if((c==='\n'||c==='\r') && !quoted) {
      if(c==='\r'&&text[i+1]==='\n')i++;
      row.push(field);rows.push(row);row=[];field='';
    } else field+=c;
  }
  if(quoted)throw Error('The catalogue contains an unclosed quoted cell.');
  if(field||row.length){row.push(field);rows.push(row);}
  const headers=rows.shift()||[];
  if(new Set(headers).size!==headers.length)throw Error('CSV column names must be unique.');
  return rows.filter(row=>row.some(value=>value.trim())).map(row=>Object.fromEntries(headers.map((key,i)=>[key,row[i]?.trim()||''])));
}
export async function loadDatasets() {
  const response=await fetch('data/datasets.csv');
  if(!response.ok)throw Error('The dataset catalogue could not be loaded.');
  const rows=parseCSV(await response.text());
  const ids=new Set();
  for(const row of rows) {
    if(!row.id||!row.name)throw Error('Every dataset needs an id and name.');
    if(ids.has(row.id))throw Error(`Duplicate dataset id: ${row.id}`);
    ids.add(row.id);
  }
  return rows;
}
export const valueOrMissing = value => value ? esc(value) : '<span class="muted">Not specified</span>';
export function textLinks(text) {
  return String(text||'').split(/(https?:\/\/[^\s<>"\u201d]+)/g).map(part=>{
    if(!/^https?:\/\//.test(part))return esc(part);
    let url=part.replace(/[.,;]+$/,'');
    while(url.endsWith(')')&&(url.match(/\)/g)||[]).length>(url.match(/\(/g)||[]).length)url=url.slice(0,-1);
    const suffix=part.slice(url.length);
    return safeURL(url)?`<a href="${esc(safeURL(url))}">${esc(url)}</a>${esc(suffix)}`:esc(part);
  }).join('');
}
export function downloadCSV(rows, filename='water-data-results.csv') {
  if(!rows.length)return;
  const fields=Object.keys(rows[0]);
  // ## Prefix formula-like values in downloaded spreadsheet cells.
  const quote=value=>'"'+String(value??'').replace(/^[=+@-]/,"'$&").replaceAll('"','""')+'"';
  const csv=[fields,...rows.map(row=>fields.map(key=>row[key]))].map(row=>row.map(quote).join(',')).join('\r\n');
  const url=URL.createObjectURL(new Blob(['\uFEFF',csv],{type:'text/csv;charset=utf-8'}));
  const link=Object.assign(document.createElement('a'),{href:url,download:filename});link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
export const errorView = error => `<section class="empty"><h1>Catalogue unavailable.</h1><p>${esc(error.message)}</p><p>Please reload the page or <a href="data/datasets.csv">download the CSV</a>.</p></section>`;
