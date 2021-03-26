let {
  API,
  Auth,
  getDeliveryStatus,
  getOrderStatus,
  getInventory,
} = await import('/libs/api/apiLoader.js');
const overlay = await import('/libs/overlay/overlay.js');

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

let cart = { FLORANGISTA: 1 };

function updateCart($quantity) {
  let value = $quantity.value;
  let $product = $quantity.closest('.product');
  let productId = $product?.id;
  if (value == 0) {
    delete cart[productId];
  } else {
    cart[productId] = value;
  }
  console.log(cart);
}

export default async function decorate($block, blockName) {
  overlay.show();
  try {
    await loadInclude($block, blockName);
    let $main = document.querySelector('main');
    let profileJSON = sessionStorage.getItem('userInfo');
    let profileData;
    if (profileJSON) {
      profileData = JSON.parse(profileJSON);
      let zip = profileData.zip;
      let status = await getDeliveryStatus(zip);
      if (status.dates.isShoppingTime) {
        let weekId = status.dates.deliveryWeek + '-' + status.dates.deliveryYear;
        let orderStatus = await getOrderStatus(profileData.id, weekId);
        if (!orderStatus?.saved) {
          let $container = $main.querySelector('.cart-container');
          let inventory = await getInventory();
          inventory = [
            {
              'id': 'FLORANGISTA',
              'commonName': 'This is the Florangista',
              'description': 'Your weekly delivery!',
              'color': 'Varied',
              'unit': 'BOX',
              'inQty': '30',
              'outQty': '0',
              'availableQty': '30',
              'price': '$25.00',
              'selectedQty': 1,
            },
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
                ${product.price}/${product.unit}
              </div>
              <div>
                <select class="quantity">
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
                </select>
              </div>`
            $cartItem.innerHTML = cartItemMarkup;
            $cartItem.querySelector('.quantity').addEventListener('change', e => {
              updateCart(e.target);
            });
            let selectedQty = (product.selectedQty) ? product.selectedQty : 0;
            $cartItem.querySelector(`select option[value='${selectedQty}']`).setAttribute('selected', true);
            $cart.append($cartItem);
          })
          showContainer($container);
        } else {
          let $container = $main.querySelector('.closed-container');
          showContainer($container);
        }
      } else {
        let $container = $main.querySelector('.status-container');
        showContainer($container);
      }
      overlay.hide();
    } else {
      window.location.href = "/Login.html"
    }
  } catch (ew) {
    console.error(ew);
  }
}

