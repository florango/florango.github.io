import {
    extractData,
    loadInclude,
    hydrateInclude,
    dressBlock
} from '/scripts.js';

export default async function decorate($block, blockName, document) {    
    // const data = await extractData($block)    
    // const $include = await loadInclude($block, blockName)    
    // await hydrateInclude($block, $include, data)
    await dressBlock($block, blockName)
}

