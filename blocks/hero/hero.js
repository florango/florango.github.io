import {
    extractData,
    loadInclude,
    hydrateBlock,
    decorateBlock
} from '/scripts.js';

export default async function decorate($block, blockName, document) {    
    const data = await extractData($block)
    //console.log(data)
    const $include = await loadInclude($block, blockName)    
    await hydrateBlock($block, $include, data)
    // await decorateBlock($block, blockName)
}

