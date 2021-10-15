import {
    API,
    Auth,
    init as initAPILoader, } from '/libs/api/apiLoader.js';
  import { show as showOverlay, hide as hideOverlay } from '/libs/overlay/overlay.js';
  
  async function loadInclude($block, blockName) {
    const resp = await fetch(`/blocks/${blockName}/${blockName}.html`);
    const text = await resp.text();
    $block.innerHTML = text;
  }
  
  export default async function decorate($block, blockName) {
    await loadInclude($block, blockName);
    await initAPILoader();
  }