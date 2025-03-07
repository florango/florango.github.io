function wrapSections(selector) {
  document.querySelectorAll(selector).forEach(($div) => {
    if (!$div.id) {
      const $wrapper = createTag('div', { class: 'section-wrapper' });
      $div.parentNode.appendChild($wrapper);
      $wrapper.appendChild($div);
    }
  });
}

function toClassName(name) {
  return name && typeof name === 'string'
    ? name.toLowerCase().replace(/[^0-9a-z]/gi, '-')
    : '';
}

function createTag(name, attrs) {
  const el = document.createElement(name);
  if (typeof attrs === 'object') {
    for (const [key, value] of Object.entries(attrs)) {
      el.setAttribute(key, value);
    }
  }
  return el;
}

function decorateFullWidthImage() {
  document.querySelectorAll('img').forEach(($img) => {
    const $section = $img.closest('div');
    if ($section.children.length === 1 || ($section.children.length === 2 && $section.children[1].tagName.startsWith('H'))) {
      $section.parentNode.classList.add('full-image');
      $section.parentNode.classList.remove('section-wrapper');
    }
  })
}

/**
 * Loads a CSS file.
 * @param {string} href The path to the CSS file
 */
export function loadCSS(href) {
  if (!document.querySelector(`head > link[href="${href}"]`)) {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', href);
    link.onload = () => {
    };
    link.onerror = () => {
    };
    document.head.appendChild(link);
  }
}

function decorateBlocks() {
  document.querySelectorAll('main div.section-wrapper > div > div').forEach(($block) => {
    const classes = Array.from($block.classList.values());
    let blockName = classes[0];
    const $section = $block.closest('.section-wrapper');
    if ($section) {
      $section.classList.add(`${blockName}-container`.replace(/--/g, '-'));
    }
    const blocksWithOptions = [];
    blocksWithOptions.forEach((b) => {
      if (blockName.startsWith(`${b}-`)) {
        const options = blockName.substring(b.length + 1).split('-').filter((opt) => !!opt);
        blockName = b;
        $block.classList.add(b);
        $block.classList.add(...options);
      }
    });
    $block.classList.add('block');
    $block.setAttribute('data-block-name', blockName);
  });
}

function loadBlocks() {
  document.querySelectorAll('main div.section-wrapper > div > .block').forEach(async ($block) => {
    const blockName = $block.getAttribute('data-block-name');
    import(`/blocks/${blockName}/${blockName}.js`)
      .then((mod) => {
        if (mod.default) {
          mod.default($block, blockName, document);
        }
      })
      .catch((err) => console.log(`failed to load module for ${blockName}`, err));

    loadCSS(`/blocks/${blockName}/${blockName}.css`);
  });
}

async function decorateBlocksOld() {  
  document.querySelectorAll('main div.section-wrapper > div > div').forEach(async ($block) => {
    const classes = Array.from($block.classList.values());
    let blockName = classes[0];
    const $section = $block.closest('.section-wrapper');
    if ($section) {
      $section.classList.add(`${blockName}-container`.replaceAll('--', '-'));
    }
    const blocksWithOptions = [];
    blocksWithOptions.forEach((b) => {
      if (blockName.startsWith(`${b}-`)) {
        const options = blockName.substring(b.length + 1).split('-').filter((opt) => !!opt);
        blockName = b;
        $block.classList.add(b);
        $block.classList.add(...options);
      }
    });
    $block.classList.add('block');
    try {
      let mod = await import(`/blocks/${blockName}/${blockName}.js`);
      await mod.default($block, blockName, document);
    } catch (ew) {
      console.error(ew)
    }    
    loadCSS(`/blocks/${blockName}/${blockName}.css`);
  });  
}

async function loadHeader() {
  const resp = await fetch('/header.html');
  const html = await resp.text();
  document.querySelector('header').innerHTML = html;
}

async function decoratePage() {
  wrapSections('main > div');
  loadHeader();
  decorateFullWidthImage();
  decorateBlocks();  
  const $img = document.querySelector('main img');
  if ($img) {
    if ($img.complete) {
      loadLater();
    } else {
      $img.addEventListener('load', () => {
        loadLater();
      })
      $img.addEventListener('error', () => {
        loadLater();
      })
    }    
  } else {
    loadLater();
  }
  document.querySelector('main').classList.add('appear');
}

function loadLater() {
  document.body.classList.add('appear');  
  loadBlocks();
  loadCSS('/lazy-style.css');
}

decoratePage();

