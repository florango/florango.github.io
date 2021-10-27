import {
    extractData,
    loadInclude,
    hydrateInclude,
    decorateBlock
} from '/scripts.js';

export default async function decorate($block, blockName, document) {    
    const data = await extractData($block)
    //console.log(data)
    const $include = await loadInclude($block, blockName)    
    await hydrateInclude($block, $include, data)
    // await decorateBlock($block, blockName)
}

