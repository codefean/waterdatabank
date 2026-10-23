/* ## One reusable detail page for every stable dataset ID. */
import {esc,loadDatasets,valueOrMissing,textLinks,safeURL,downloadCSV,errorView} from './shared.js';
import {topicTag} from './topic-colors.js';

async function start() {
  const rows=await loadDatasets(),params=new URLSearchParams(location.search);
  const row=rows.find(row=>row.id===params.get('id'));
  params.delete('id');
  const back='index.html'+(params.size?'?'+params:'');
  const main=document.querySelector('main');
  if(!row) {
    document.title='Dataset not found · SERES';
    main.innerHTML=`<section class="page-head"><h1>Dataset not found.</h1><p class="lead">This link may be incomplete, or the entry may have been removed.</p><a href="${esc(back)}">Back to the catalogue</a></section>`;return;
  }
  document.title=`${row.abbreviation||row.name} · SERES water data explorer`;
  const field=(label,value)=>`<div><dt>${label}</dt><dd>${label==='Topic'?topicTag(value):valueOrMissing(value)}</dd></div>`;
  const section=(title,text)=>text?`<section class="detail-section"><h2>${title}</h2><div class="prose">${textLinks(text)}</div></section>`:'';
  const sources=[...new Set((row.source_url||'').split(/\s+/).map(safeURL).filter(Boolean))];
  const dois=(row.doi||'').split(';').map(value=>value.trim()).filter(Boolean);
  main.innerHTML=`<section class="page-head detail-head"><a class="back" href="${esc(back)}">Back to results</a><p class="eyebrow">${topicTag(row.topic)}</p><h1>${esc(row.name)}</h1>${row.abbreviation&&row.abbreviation!==row.name?`<p class="abbreviation">${esc(row.abbreviation)}</p>`:''}<p class="lead">${valueOrMissing(row.variable)}</p>
    <div class="actions">${sources[0]?`<a class="button" href="${esc(sources[0])}">Visit data source</a>`:''}<button class="text-button" id="record-download" type="button">Download catalogue entry</button></div></section>
    <div class="detail-layout"><div>
      ${section('About this dataset',row.description)||'<section class="detail-section"><h2>About this dataset</h2><p class="muted">A description has not been added yet. Use the source and reference links for more information.</p></section>'}
      ${section('Caveats & limitations',row.caveats)||'<section class="detail-section"><h2>Caveats & limitations</h2><p class="muted">No caveats are recorded in this catalogue. Consult the provider’s documentation before use.</p></section>'}
      ${section('References',row.description_references)}${section('Caveat references',row.caveat_references)}
      ${sources.length?`<section class="detail-section"><h2>Data sources</h2><ul class="source-list">${sources.map(url=>`<li><a href="${esc(url)}">${esc(url)}</a></li>`).join('')}</ul></section>`:''}
      ${dois.length?`<section class="detail-section"><h2>DOIs</h2><ul>${dois.map(doi=>`<li><a href="https://doi.org/${esc(encodeURI(doi))}">${esc(doi)}</a></li>`).join('')}</ul></section>`:''}
      ${section('Team experience',row.experience)}${section('Notes',row.notes)}
      ${row.cleanup_notes?`<details class="import-notes"><summary>Catalogue preparation notes</summary><p class="prose">${esc(row.cleanup_notes)}</p><p>Original catalogue row: ${esc(row.source_row)}</p></details>`:''}
    </div><aside aria-label="Dataset specifications"><h2>At a glance</h2><dl class="specifications">
      ${[['Topic',row.topic],['Variable',row.variable],['Unit',row.unit],['Data format',row.data_format],['Grid type / CRS',row.grid_type],['Spatial range',row.spatial_range],['Spatial resolution',row.spatial_resolution],['Temporal range',row.temporal_range],['Temporal resolution',row.temporal_resolution],['Actively developed',row.actively_developed]].map(([label,value])=>field(label,value)).join('')}
    </dl></aside></div><p class="catalogue-note">Catalogue metadata may be incomplete or dated. Source links can point to a provider, paper or data portal; check the provider for access and reuse terms.</p>`;
  main.querySelector('#record-download').addEventListener('click',()=>downloadCSV([row],row.id+'.csv'));
}
start().catch(error=>{document.querySelector('main').innerHTML=errorView(error);});
