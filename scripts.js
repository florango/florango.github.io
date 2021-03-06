const upTo = (el, tagName) => {
    tagName = tagName.toLowerCase();

    while (el && el.parentNode) {
        el = el.parentNode;
        if (el.tagName && el.tagName.toLowerCase() == tagName) {
        return el;
        }
    }
    return null;
}

function decoratePage() {
    if (document.querySelector('main>div').className=='') {
      document.querySelectorAll('main>div').forEach(($div, i) => {
        console.log(i);
        if (i==0 && $div.querySelector('p picture')) {
          const $h1=$div.querySelector('h1');
          const $p=$div.querySelector('p:nth-of-type(2)');
          $div.classList.add('title');
          $divHeader=document.createElement('div');
          $divHeader.classList.add('header');
          $div.appendChild($divHeader);
          if ($h1) $divHeader.appendChild($h1);
          if ($p) $divHeader.appendChild($p);
        } else {
          $div.classList.add(($div.firstElementChild && $div.firstElementChild.tagName=='IMG')?'image':'default');
        }
      });
    }
  }

decoratePage();
  
  window.onload = function() {    
    scrani.onload();
  }

  window.onhashchange = function() {
    if (window.location.hash === "#menu") {
      document.querySelector("header div:nth-child(2)").style="display:block";
    } else {
      document.querySelector("header div:nth-child(2)").style="";
    }
  }
