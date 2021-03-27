import {
  API,
  Auth,
  init as initAPILoader, } from '/libs/api/apiLoader.js';
import { show as showOverlay, hide as hideOverlay } from '/libs/overlay/overlay.js';
// const { API, Auth } = await import('/libs/api/apiLoader.js');
// const overlay = await import('/libs/overlay/overlay.js');

async function loadInclude($block, blockName) {
  const resp = await fetch(`/blocks/${blockName}/${blockName}.html`);
  const text = await resp.text();
  $block.innerHTML = text;
}

export default async function decorate($block, blockName) {
  await loadInclude($block, blockName);
  await initAPILoader();
  let $form = $block.querySelector('form');
  $form.addEventListener('submit', async (e) => {
    e.preventDefault();
    showOverlay();

    let fields = {
      email: $form.querySelector('#userid').value,
      password: $form.querySelector('#password').value,
    }

    await Auth.signIn(fields.email, fields.password);
    const { attributes } = await Auth.currentAuthenticatedUser();

    const profileData = await API.post("florango", "/profile", {
      body: {
        email: fields.email
      }
    });

    sessionStorage.setItem('userInfo', JSON.stringify(profileData));
    window.location.href = '/account/Shopper.html';

  });
}