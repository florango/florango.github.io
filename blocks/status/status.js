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

export default async function decorate($block, blockName) {
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
          let $flowerPicsDoc = await getFlowerPics();
          let $cart = $container.querySelector('.cart');
          let $products = '';
          inventory.map((product, i) => {
            let $flowerPic = $flowerPicsDoc.querySelector('#' + product.id + ' picture');
            let cartMarkup = `<div class="product">
                            <div class="picture">
                              ${$flowerPic.outerHTML}
                            </div>
                            <div class="description">
                              ${product.description}
                            </div>
                            <div class="price">
                              ${product.price}/${product.unit}
                            </div>
                          </div>`
            $products += cartMarkup;
          })
          console.log($products);
          $cart.innerHTML = $products;
          showContainer($container);
        } else {
          let $container = $main.querySelector('.closed-container');
          showContainer($container);
        }
      } else {
        let $container = $main.querySelector('.status-container');
        showContainer($container);
      }
    } else {
      alert('Not logged in');
    }
  } catch (ew) {
    console.error(ew);
  }
}

