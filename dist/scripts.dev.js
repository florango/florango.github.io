"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadInclude = loadInclude;
exports.hydrate = hydrate;
exports.createTag = createTag;
exports.loadCSS = loadCSS;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function loadInclude($block, blockName) {
  var resp, text;
  return regeneratorRuntime.async(function loadInclude$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(fetch("/blocks/".concat(blockName, "/").concat(blockName, ".html")));

        case 2:
          resp = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(resp.text());

        case 5:
          text = _context.sent;
          $block.innerHTML = text;

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
}

function hydrate() {}

function createTag(name, attrs) {
  var el = document.createElement(name);

  if (_typeof(attrs) === 'object') {
    for (var _i = 0, _Object$entries = Object.entries(attrs); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          key = _Object$entries$_i[0],
          value = _Object$entries$_i[1];

      el.setAttribute(key, value);
    }
  }

  return el;
}

function wrapSections(element) {
  document.querySelectorAll(element).forEach(function ($div) {
    if ($div.childNodes.length === 0 || !$div.firstElementChild) {
      // remove empty sections
      $div.remove();
    } else if (!$div.id) {
      var $wrapper = createTag('div', {
        "class": 'section-wrapper'
      });
      $div.parentNode.appendChild($wrapper);
      $wrapper.appendChild($div);
    }
  });
}

function decorateFullWidthImage() {
  document.querySelectorAll('img').forEach(function ($img) {
    var $section = $img.closest('div');

    if ($section.children.length === 1 || $section.children.length === 2 && $section.children[1].tagName.startsWith('H')) {
      $section.parentNode.classList.add('full-image');
      $section.parentNode.classList.remove('section-wrapper');
    }
  });
}
/**
 * Loads a CSS file.
 * @param {string} href The path to the CSS file
 */


function loadCSS(href) {
  if (!document.querySelector("head > link[href=\"".concat(href, "\"]"))) {
    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', href);

    link.onload = function () {};

    link.onerror = function () {};

    document.head.appendChild(link);
  }
}

function loadBlocks() {
  document.querySelectorAll('main div.section-wrapper > div > .block').forEach(function _callee($block) {
    var blockName;
    return regeneratorRuntime.async(function _callee$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            blockName = $block.getAttribute('data-block-name');
            Promise.resolve().then(function () {
              return _interopRequireWildcard(require("/blocks/".concat(blockName, "/").concat(blockName, ".js")));
            }).then(function (mod) {
              if (mod["default"]) {
                mod["default"]($block, blockName, document);
              }
            })["catch"](function (err) {
              return console.log("failed to load module for ".concat(blockName), err);
            });
            loadCSS("/blocks/".concat(blockName, "/").concat(blockName, ".css"));

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    });
  });
}

function decorateBlocks() {
  document.querySelectorAll('main div.section-wrapper > div > div').forEach(function ($block) {
    var classes = Array.from($block.classList.values());
    var blockName = classes[0];
    var $section = $block.closest('.section-wrapper');

    if ($section) {
      $section.classList.add("".concat(blockName, "-container").replace(/--/g, '-'));
    }

    var blocksWithOptions = [];
    blocksWithOptions.forEach(function (b) {
      if (blockName.startsWith("".concat(b, "-"))) {
        var _$block$classList;

        var options = blockName.substring(b.length + 1).split('-').filter(function (opt) {
          return !!opt;
        });
        blockName = b;
        $block.classList.add(b);

        (_$block$classList = $block.classList).add.apply(_$block$classList, _toConsumableArray(options));
      }
    });
    $block.classList.add('block');
    $block.setAttribute('data-block-name', blockName);
  });
}

function loadHeader() {}

function decoratePage() {
  var $img;
  return regeneratorRuntime.async(function decoratePage$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          wrapSections('main > div');
          loadHeader();
          decorateFullWidthImage();
          decorateBlocks();
          $img = document.querySelector('main img');

          if ($img) {
            if ($img.complete) {
              loadLater();
            } else {
              $img.addEventListener('load', function () {
                loadLater();
              });
              $img.addEventListener('error', function () {
                loadLater();
              });
            }
          } else {
            loadLater();
          }

          document.querySelector('main').classList.add('appear');

        case 7:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function loadLater() {
  document.body.classList.add('appear');
  loadBlocks();
  loadCSS('/lazy-style.css');
}

decoratePage();
//# sourceMappingURL=scripts.dev.js.map
