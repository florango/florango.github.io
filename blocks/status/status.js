import  {
  API,
  Auth,
  getDeliveryStatus,
  getOrderStatus,
  getInventory,
  init as initAPILoader,
} from '/libs/api/apiLoader.js';
import {show as showOverlay, hide as hideOverlay} from '/libs/overlay/overlay.js';

// let {
//   API,
//   Auth,
//   getDeliveryStatus,
//   getOrderStatus,
//   getInventory,
// } = await import('/libs/api/apiLoader.js');
// const overlay = await import('/libs/overlay/overlay.js');

async function loadInclude($block, blockName) {
  const resp = await fetch(`/blocks/${blockName}/${blockName}.html`);
  const text = await resp.text();
  $block.innerHTML = text;
}

async function getFlowerPics() {
  let flowerPicsHTML = await (await fetch('/flower-pictures.plain.html')).text();
  let parser = new DOMParser();
  let document = parser.parseFromString(flowerPicsHTML, 'text/html');
  let prods = document.querySelectorAll('div.flowers>div');
  prods.forEach((prod) => {
    prod.id = prod.innerText;
    let $img = prod.querySelector('img');
    let $source = prod.querySelector('source');
    let src = $img?.getAttribute('src');
    $img?.setAttribute('src', src);
    $source?.setAttribute('srcset', src);
  })
  return document;
}

function showContainer($container) {
  $container.style.display = 'block';
}

function hideContainer($container) {
  $container.style.display = 'none';
}

let cart = {
  items: {},
  total: 0
};

const FLORANGISTA = {
  'id': 'FLORANGISTA',
  'commonName': 'This is the Florangista',
  'description': 'Your weekly delivery!',
  'color': 'Varied',
  'unit': 'BOX',
  'inQty': 30,
  'outQty': 0,
  'availableQty': 30,
  'price': 25,
  'selectedQty': 1,
};

function updateCartItem($quantity) {
  let qty = $quantity.value;
  let price = $quantity.getAttribute('price');
  let $product = $quantity.closest('.product');
  let productId = $product?.id;
  updateCart(productId, price, qty);
}

function updateCart(productId, price, newQuantity) {
  let total = cart.total;
  let currentQuantity = cart.items[productId] || 0;
  total -= currentQuantity * price;
  delete cart.items[productId];
  if (newQuantity != 0) {
    total += newQuantity * price;
    cart.items[productId] = newQuantity;
  }
  cart.total = total;
  let shipping = (total >= 50) ? 'FREE' : '+$5';
  document.querySelector('main .cart-container .summary .total-price').textContent = `$${total}`;
  document.querySelector('main .cart-container .summary .shipping-price').textContent = `${shipping} delivery`;

  console.log(cart);
}

async function handleSave() {
  showOverlay();
  try {
    await API.post("florango", "/orders", {
      body: {
        cart: cart.items,
        userId: profileData.id,
        closingDate: status.dates.shoppingEndDate,
        weekId
      }
    });
  } catch (ew) {
    console.error(ew);
  }
  let $cartContainer = document.querySelector('main .cart-container');
  let $closedContainer = document.querySelector('main .closed-container');
  hideContainer($cartContainer);
  showContainer($closedContainer);
  hideOverlay();
}

async function handleSkip() {
  if (confirm("Are you sure you want to skip this delivery?")) {
    cart.items = {
      SKIPPED: 0
    }
    handleSave();
  }
}

let profileData, weekId, status;

export default async function decorate($block, blockName) {
  showOverlay();

  try {
    // let {
    //   API,
    //   Auth,
    //   getDeliveryStatus,
    //   getOrderStatus,
    //   getInventory,
    //   init,
    // } = await import('/libs/api/apiLoader.js');
    // await init();
    await loadInclude($block, blockName);
    await initAPILoader();
    let $main = document.querySelector('main');
    let profileJSON = sessionStorage.getItem('userInfo');
    if (profileJSON) {
      profileData = JSON.parse(profileJSON);
      let zip = profileData.zip;
      status = await getDeliveryStatus(zip);
      if (status.dates.isShoppingTime) {
        weekId = status.dates.deliveryWeek + '-' + status.dates.deliveryYear;
        let orderStatus = await getOrderStatus(profileData.id, weekId);
        if (!orderStatus?.saved) {
          let $container = $main.querySelector('.cart-container');
          let inventory = await getInventory();
          inventory = [
            FLORANGISTA,
            ...inventory,
          ]
          let $flowerPicsDoc = await getFlowerPics();
          let $cart = $container.querySelector('.cart');
          let $products = '';
          inventory.map((product, i) => {
            let $flowerPic = $flowerPicsDoc.querySelector('#' + product.id + ' picture');
            let $cartItem = document.createElement('div');
            $cartItem.id = product.id;
            $cartItem.classList.add('product');
            let cartItemMarkup = `
              <div class="picture">
                ${$flowerPic?.outerHTML}
              </div>
              <div class="info">
                <p class="name">
                  ${product.commonName}
                </p>
                <p class="description">
                  ${product.description}
                </p>
              </div>
              <div class="price">
                $${product.price}/${product.unit}
              </div>
              <div>
                <select class="quantity" price="${product.price}">
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </select>
              </div>`
            $cartItem.innerHTML = cartItemMarkup;
            $cartItem.querySelector('.quantity').addEventListener('change', e => {
              updateCartItem(e.target);
            });
            let selectedQty = (product.selectedQty) ? product.selectedQty : 0;
            $cartItem.querySelector(`select option[value='${selectedQty}']`).setAttribute('selected', true);
            $cart.append($cartItem);
          })
          $container.querySelector('a.save').addEventListener('click', e => {
            handleSave();
          });
          $container.querySelector('a.skip').addEventListener('click', e => {
            handleSkip();
          });
          updateCart(FLORANGISTA.id, FLORANGISTA.price, 1);
          showContainer($container);
        } else {
          let $container = $main.querySelector('.closed-container');
          showContainer($container);
        }
      } else {
        let $container = $main.querySelector('.status-container');
        showContainer($container);
      }
      hideOverlay();
    } else {
      window.location.href = "/Login.html"
    }
  } catch (ew) {
    console.error(ew);
  }
}

