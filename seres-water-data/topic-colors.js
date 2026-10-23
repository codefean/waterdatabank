/* ## Topic assignments using the exact SERES regime palette. Edit colors here. */
import {esc} from './shared.js';

export const topicColors = {
  'Hydrosphere': '#1d3759',
  'Climate': '#544e76',
  'Biodiversity': '#151245',
  'Anthropocene dynamics': '#8a626b',
  'Vegetation': '#a3c979',
  'Land cover': '#e2c8a5',
  'Ocean': '#4d8084',
  'Soil': '#355090',
  'Conflict': '#b06965',
  'Democracy': '#b36c8e'
};

export function topicTag(topic) {
  const key=Object.keys(topicColors).find(key=>key.toLowerCase()===String(topic||'').trim().toLowerCase());
  const color=topicColors[key] || '#4a5878';
  // ## Choose black or white text to keep both light and dark labels readable.
  const [r,g,b]=color.match(/[a-f0-9]{2}/gi).map(hex=>{
    const v=parseInt(hex,16)/255;
    return v<=0.04045 ? v/12.92 : ((v+0.055)/1.055)**2.4;
  });
  const ink=r*0.2126+g*0.7152+b*0.0722>0.179 ? '#000000' : '#ffffff';
  return `<span class="tag topic-tag" style="--topic-color:${color};--topic-ink:${ink}">${esc(topic||'Not specified')}</span>`;
}
