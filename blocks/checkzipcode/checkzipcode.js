import {
    API,
    Auth,
    getDeliveryStatus,
    session,
    init as initAPILoader,
} from '/libs/api/apiLoader.js';
import { show as showOverlay, hide as hideOverlay } from '/libs/overlay/overlay.js';

async function loadInclude($block, blockName) {
    const resp = await fetch(`/blocks/${blockName}/${blockName}.html`);
    const text = await resp.text();
    $block.innerHTML = text;
}

export default async function decorate($block, blockName) {
    await loadInclude($block, blockName);
    await initAPILoader();
    let $form = $block.querySelector('form');
    $form.addEventListener('submit', async (e) => {
        e.preventDefault();
        showOverlay();

        let fields = {
            zip: $form.querySelector('#zip').value,
        }
        let status = await getDeliveryStatus(fields.zip);
        console.log(status.status);
        switch (status.status) {
            case 'YES':
                session.set('status', status);
                window.location.href = '/account/Signup';                
                break;
            case 'SOON':
            case 'NO':
            default:
                window.location.href = '/account/CaptureLead';
                break;
        }

    })
}

