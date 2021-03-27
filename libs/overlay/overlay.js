import { loadCSS } from '/scripts.js';
//let { loadCSS } = await import('/scripts.js')

let $overlay

async function load() {
  $overlay = document.createElement('div');
  $overlay.classList.add('loading');
  document.querySelector('body').appendChild($overlay);
  await loadCSS('/libs/overlay/overlay.css');
}

load()

export function visible(isVisible) {
  if(!isVisible) {
    $overlay.style.display = 'none';
  } else {
    $overlay.style.display = 'block';
  }
}

export function show() {
  visible(true);
}

export function hide() {
  visible(false);
}

hide();