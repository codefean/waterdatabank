/* ## Searchable catalogue. Edit data/datasets.csv to add or update entries. */
import {esc,normalize,loadDatasets,valueOrMissing,downloadCSV,errorView} from './shared.js';
import {topicTag} from './topic-colors.js';

// ## Broad variable groups use only the supplied variable field, never descriptions.
const groups = [
  ['Precipitation', /precipitation|rainfall|\bp\b/],
  ['Soil moisture', /soil moisture|soil water/],
  ['Groundwater & water storage', /groundwater|grace|water storage/],
  ['Evaporation & transpiration', /evaporation|evapotranspiration|transpiration|\bet\b|\bepot\b/],
  ['Temperature', /temperature|\bsst\b|\bt\b/],
  ['Rivers & runoff', /discharge|runoff|basin/],
  ['Drought & aridity', /drought|aridity/],
  ['Vegetation & carbon', /vegetation|ndvi|\bevi\b|\bgpp\b|photosynthe|chlorophyll|biomass|canopy|carbon|\bsif\b|reflectance|rooting|phenology|\bnee\b/],
  ['Biodiversity', /biodiversity|species|living planet|ecosystem resilience/],
  ['Land cover & wetlands', /land cover|land use|wetland|burned area|\blc\b/],
  ['Ocean conditions', /salinity|backscattering|attenuation|coast/],
  ['Human activity', /population|crop|conflict|democracy/]
];
const variableGroups = row => {
  if(!row.variable)return ['Not specified'];
  const matches=groups.filter(([,pattern])=>pattern.test(normalize(row.variable))).map(([label])=>label);
  return matches.length ? matches : ['Other variables'];
};

async function start() {
  const rows=await loadDatasets();
  const app=document.querySelector('#app');
  const topics=[...new Set(rows.map(row=>row.topic||'Not specified'))].sort();
  const variables=[...new Set(rows.flatMap(variableGroups))].sort();
  const options=values=>values.map(value=>`<option value="${esc(value)}">${esc(value)}</option>`).join('');
  app.innerHTML=`<form class="filters" role="search" aria-label="Find datasets">
    <label class="search">Search the catalogue<input id="search" type="search" placeholder="Try soil moisture, ERA5, daily or 0.25°"></label>
    <label>Topic<select id="topic"><option value="">All topics</option>${options(topics)}</select></label>
    <label>Variable group<select id="variable"><option value="">All variables</option>${options(variables)}</select></label>
    <div class="tools"><button type="reset" class="text-button">Clear filters</button><button type="button" id="download" class="text-button">Download results CSV</button></div>
  </form>
  <div class="results-head"><p class="muted">Click an entry or Learn more to open its dataset page.</p></div>
  <div id="results"></div><button id="more" type="button" class="button" hidden>Show more datasets</button>
  <p class="catalogue-note">Coverage and development notes reflect the supplied catalogue. Check the original provider for current availability, terms and updates.</p>`;
  const form=app.querySelector('form');
  const search=app.querySelector('#search'),topic=app.querySelector('#topic'),variable=app.querySelector('#variable');
  const more=app.querySelector('#more'),results=app.querySelector('#results'),download=app.querySelector('#download');
  let shown=25, matches=[];
  function restore() {
    const params=new URLSearchParams(location.search);
    search.value=params.get('q')||'';
    for(const [control,key] of [[topic,'topic'],[variable,'variable']]) {
      const value=params.get(key);
      control.value=[...control.options].some(option=>option.value===value)?value:control.options[0].value;
    }
  }
  function update(save=true) {
    const words=normalize(search.value).trim().split(/\s+/).filter(Boolean);
    matches=rows.filter(row=>(!topic.value||(row.topic||'Not specified')===topic.value) &&
      (!variable.value||variableGroups(row).includes(variable.value)) &&
      words.every(word=>normalize(Object.values(row).join(' ')).includes(word)));
    matches.sort((a,b)=>a.name.localeCompare(b.name,undefined,{sensitivity:'base',numeric:true}));
    const params=new URLSearchParams();
    for(const [key,value] of [['q',search.value.trim()],['topic',topic.value],['variable',variable.value]])if(value)params.set(key,value);
    if(save)history.replaceState(null,'',location.pathname+(params.size?'?'+params:''));
    const detailURL=row=>'dataset.html?'+new URLSearchParams({id:row.id,...Object.fromEntries(params)});
    download.disabled=!matches.length;
    results.innerHTML=matches.length?`<table><caption class="sr-only">Matching datasets, their variables, topics and coverage</caption><thead><tr><th scope="col">Dataset & variable</th><th scope="col">Topic</th><th scope="col">Spatial resolution</th><th scope="col">Temporal coverage</th><th scope="col"><span class="sr-only">Details</span></th></tr></thead><tbody>${matches.slice(0,shown).map(row=>`
      <tr data-href="${esc(detailURL(row))}"><td class="dataset-name"><a href="${esc(detailURL(row))}">${esc(row.name)}</a>${row.abbreviation&&row.abbreviation!==row.name?`<span class="abbreviation">${esc(row.abbreviation)}</span>`:''}<p>${valueOrMissing(row.variable)}</p></td>
      <td data-label="Topic">${topicTag(row.topic)}</td>
      <td data-label="Spatial resolution">${valueOrMissing(row.spatial_resolution)}</td>
      <td data-label="Temporal coverage">${valueOrMissing(row.temporal_range)}${row.temporal_resolution?`<small>${esc(row.temporal_resolution)}</small>`:''}</td>
      <td class="learn"><a href="${esc(detailURL(row))}" aria-label="Learn more about ${esc(row.name)}${row.variable?' — '+esc(row.variable):''}">Learn more</a></td></tr>`).join('')}</tbody></table>`:
      '<div class="empty"><h2>No datasets match.</h2><p>Try a broader search or clear the filters.</p></div>';
    more.hidden=shown>=matches.length;
  }
  form.addEventListener('submit',event=>event.preventDefault());
  form.addEventListener('input',()=>{shown=25;update();});
  form.addEventListener('reset',()=>setTimeout(()=>{shown=25;update();},0));
  more.addEventListener('click',()=>{
    const previous=shown;shown+=25;update();
    const next=results.querySelectorAll('tbody tr')[previous]?.querySelector('a');next?.focus();
  });
  download.addEventListener('click',()=>downloadCSV(matches));
  // ## The row opens the same page as its native, keyboard-accessible links.
  results.addEventListener('click',event=>{
    if(event.target.closest('a,button')||window.getSelection()?.toString())return;
    const row=event.target.closest('tr[data-href]');
    if(!row)return;
    if(event.ctrlKey||event.metaKey)window.open(row.dataset.href,'_blank','noopener');
    else location.href=row.dataset.href;
  });
  window.addEventListener('popstate',()=>{restore();shown=25;update(false);});
  restore();update(false);
}
start().catch(error=>{document.querySelector('#app').innerHTML=errorView(error);});
