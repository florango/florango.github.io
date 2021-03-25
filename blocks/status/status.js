let {
  API,
  Auth,
  getDeliveryStatus,
  getOrderStatus,
} = await import('/libs/api/apiLoader.js');
let overlay = await import('/libs/overlay/overlay.js');

async function loadInclude($block, blockName) {
  const resp = await fetch(`/blocks/${blockName}/${blockName}.html`);
  const text = await resp.text();
  $block.innerHTML = text;
}

export default async function decorate($block, blockName) {
  try {
    await loadInclude($block, blockName);
    let $main = document.querySelector('main');
    let profileJSON = sessionStorage.getItem('userInfo');
    let profileData;
    if (profileJSON) {
      profileData = JSON.parse(profileJSON);
      console.log(profileData);
      let zip = profileData.zip;
      let status = await getDeliveryStatus(zip);
      console.log(status);
      if (status.dates.isShoppingTime) {
        let weekId = status.dates.deliveryWeek + '-' + status.dates.deliveryYear;
        let orderStatus = await getOrderStatus(profileData.id, weekId);
        console.log(orderStatus);
        if (!orderStatus?.saved) {
          let $container = $main.querySelector('.cart-container');
          $container.style.display = 'block';
        } else {
          let $container = $main.querySelector('.closed-container');
          $container.style.display = 'block';
        }
      } else {
        let $container = $main.querySelector('.status-container');
        $container.style.display = 'block';
      }
    } else {
      alert('Not logged in');
    }
  } catch (ew) {
    console.error(ew);
  }
}

