Element.prototype.isNodeList = function () { return false; }
NodeList.prototype.isNodeList = HTMLCollection.prototype.isNodeList = function () { return true; }

async function processNode($node, $contentModel) {
  console.log($node);
}

function visitNode($node, $contentModel) {

  let $any, $repeat, q, name, $content;
  if (($node?.nodeType != Node.TEXT_NODE)) {
    const $repeater = $node.getAttribute('multi');
    q = $node.getAttribute('q');
    name = $node.getAttribute('name') || q;
    if (q) {
      if ($repeater) {
        console.log('repeat')
        $repeat = $node;
        const repeatedHTML = $repeat.innerHTML;
        let $contents = $contentModel.querySelectorAll(q);
        $repeat.replaceChildren();
        $contents.forEach($subContentModel => {
          const $childTemplate = createTag('div', { class: 'subtemplate-wrapper' });
          $childTemplate.innerHTML = repeatedHTML;
          processNode($childTemplate, $subContentModel);
          if ($node.firstChild)
            visitNode($childTemplate, $subContentModel);
          if ($node.nextSibling)
            visitNode($childTemplate, $subContentModel);
          $repeat.append($childTemplate);
        })
      } else {
        console.log('any')
        $any = $node;
        if (q) {
          $content = $contentModel.querySelector(q);
          $any.innerHTML = ($content) ? $content?.outerHTML : ' ';
          //$any.replaceWith($any.firstChild);
        }
        processNode($node, $contentModel);
        if ($node.firstChild)
          visitNode($node.firstChild, $contentModel);
        if ($node.nextSibling)
          visitNode($node.nextSibling, $contentModel);
      }
    } else {
      processNode($node, $contentModel);
      if ($node.firstChild)
        visitNode($node.firstChild, $contentModel);
      if ($node.nextSibling)
        visitNode($node.nextSibling, $contentModel);
    }
  } else {
    processNode($node, $contentModel);
    if ($node.firstChild)
      visitNode($node.firstChild, $contentModel);
    if ($node.nextSibling)
      visitNode($node.nextSibling, $contentModel);
  }
}






async function eprocessNode($node, $contentModel) {
  let $any, $repeat, q, name, $content;
  if (($node?.nodeType != Node.TEXT_NODE)) {
    const $repeater = $node.getAttribute('multi');
    q = $node.getAttribute('q');
    name = $node.getAttribute('name') || q;
    if (q) {
      if ($repeater) {
        console.log('repeat')
        $repeat = $node;
        const repeatedHTML = $repeat.innerHTML;
        let $contents = $contentModel.querySelectorAll(q);
        $repeat.replaceChildren();
        $contents.forEach($subContentModel => {
          const $childTemplate = createTag('div', { class: 'subtemplate-wrapper' });
          $childTemplate.innerHTML = repeatedHTML;
          visitNode($childTemplate, $subContentModel);
          $repeat.append($childTemplate);
        })
      } else {
        console.log('any')
        $any = $node;
        if (q) {
          $content = $contentModel.querySelector(q);
          $any.innerHTML = ($content) ? $content?.outerHTML : ' ';
          $any.replaceWith($any.firstChild);
        }
        visitNode($node, $contentModel);
      }
    } else {
      console.log('normal')
      visitNode($node, $contentModel);
    }
  }
}


async function fetchTemplate(blockName, templateFileName) {
  const resp = await fetch(`/blocks/${blockName}/${templateFileName}`);
  const markup = await resp?.text();
  const $template = createTag('div', { class: 'template-wrapper' });
  $template.innerHTML = markup;
  return $template;
}

export async function applyTemplate($block, blockName, templateFileName, modifierFunc) {

  console.log(blockName + ':::')
  const $template = await fetchTemplate(blockName, templateFileName);



  visitNode($template, $block);



  // const $anys = Array.from($template.querySelectorAll('[q]'));
  // let content = [];
  // $anys.forEach(($any) => {
  //   const q = $any.getAttribute('q');
  //   let name = $any.getAttribute('name') || q;
  //   const loop = $any.getAttribute('loop');
  //   if (q) {
  //     let $content
  //     if (loop) {
  //       $content = $block.querySelectorAll(q);
  //     } else {
  //       $content = $block.querySelector(q);
  //     }
  //     let record = {
  //       name, $any, $content,
  //     };
  //     content = [...content, record];
  //   }
  // });
  // if (modifierFunc) {
  //   modifierFunc(content);
  // }
  // for (let i in content) {
  //   const record = content[i];
  //   const name = record['name'];
  //   const $any = record['$any'];
  //   const $content = record['$content'];
  //   if ($content.isNodeList()) {
  //     $content.forEach($n => {
  //       $any.appendChild($n);
  //     })
  //   } else
  //     $any.innerHTML = ($content) ? $content?.outerHTML : ' ';
  //   //$any.replaceWith($any.firstChild);
  // }
  $block.innerHTML = $template.innerHTML;
  console.log('///' + blockName)
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
      const $firstTag = $div.firstElementChild;
      let titleClass = ''
      if ($firstTag && $firstTag.id) {
        titleClass = $firstTag.id + '-container';
      }
      const $wrapper = createTag('div', { class: 'section-wrapper ' + titleClass });
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

async function loadBlocks() {
  const resp = await fetch('/blocks/config.json')
  const blocksConfig = await resp.json();
  // console.log(blocksConfig)
  document.querySelectorAll('main div.section-wrapper > div > .block').forEach(async ($block) => {
    const blockName = $block.getAttribute('data-block-name');
    if (blocksConfig[blockName]) {
      const blockConfig = blocksConfig[blockName];
      // console.log(blocksConfig[blockName])
      const scriptFileName = blockConfig['script'];
      const templateFileName = blockConfig['template'];
      if (scriptFileName) {
        import(`/blocks/${blockName}/${scriptFileName}`)
          .then((mod) => {
            if (mod.default) {
              mod.default($block, blockName, templateFileName);
            }
          })
          .catch((err) => console.log(`failed to load module ${blockName}/${scriptFileName}`, err));
      }
      const stylesFileName = blockConfig['styles']
      if (stylesFileName)
        loadCSS(`/blocks/${blockName}/${stylesFileName}`);
    }
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

async function loadHeader() {
  const resp = await fetch('/header.html');
  const html = await resp.text();
  document.querySelector('header').innerHTML = html;
}

function decorateButtons() {

}

async function decoratePage() {
  wrapSections('main > div');
  loadHeader();
  decorateFullWidthImage();
  decorateBlocks();
  decorateButtons()
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