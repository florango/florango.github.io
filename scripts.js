/**
 * Fetches the Include markup from the Block
 * @param {*} $block The Block provided from the Document
 * @param {string} blockName The name of the Block provided from the Document
 */
export async function fetchInclude($block, blockName) {
  const resp = await fetch(`/blocks/${blockName}/${blockName}.html`);
  const text = await resp.text();
  return text;
}

/**
 * Extracts the Names/Values from the Block on the Document
 * @param {*} $block The Block provided from the Document
 */
export async function extractData($block) {
  const $rows = Array.from($block.children);
  const data = {};
  $rows.forEach(($row) => {
    const $key = $row.firstChild;
    const $value = $key.nextSibling;
    data[$key.innerHTML] = $value.innerHTML;
  });
  return data;
}

/**
 * Merges the Block, Include and Data into a displayable Component
 * @param {*} $block The Block provided from the Document
 * @param {string} $include The markup from the Block HTML file
 * @param {Object} data The Names/Values to be applied  
 * @param {Boolean} keepWrapper Keep the Wrapper Tag (false by default)
 */
export async function hydrateInclude($block, $include, data, keepWrapper) {
  $block.innerHTML = $include;  
  for (let key in data) {
    const $any = $block.querySelector('any[key="' + key + '"');
    const value = data[key];
    if ($any && value) {
      $any.innerHTML = value;
      if (!keepWrapper)
        $any.replaceWith($any.firstChild);
    }
  }
  return $block;
}

/**
 * Creates a displayable Component from a Block in a single operation
 * @param {*} $block The Block provided from the Document
 * @param {string} blockName The name of the Block provided from the Document
 */
export async function dressBlock($block, blockName) {
  let data = await extractData($block);
  const $include = await fetchInclude($block, blockName);
  await hydrateInclude($block, $include, data);
  return $block;
}

export function createTag(name, attrs) {
  const el = document.createElement(name);
  if (typeof attrs === 'object') {
    for (const [key, value] of Object.entries(attrs)) {
      el.setAttribute(key, value);
    }
  }
  return el;
}

function wrapSections(element) {
  document.querySelectorAll(element).forEach(($div) => {
    if ($div.childNodes.length === 0 || !$div.firstElementChild) {
      $div.remove();
    } else if (!$div.id) {
      const $wrapper = createTag('div', { class: 'section-wrapper' });
      $div.parentNode.appendChild($wrapper);
      $wrapper.appendChild($div);
    }
  });
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

function loadHeader() {

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
  loadCSS('/styles/lazy-styles.css');
}

decoratePage();