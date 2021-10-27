import {
    hydrateBlock
} from '/scripts.js';

export default async function decorate($block, blockName, document) {
    await hydrateBlock($block, blockName)
}

