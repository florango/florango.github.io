import {
    applyTemplate,
} from '/scripts.js';

export default async function process($block, blockName, templateFileName, document) {
    if (templateFileName) {
        const $template = await applyTemplate($block, blockName, templateFileName, mine)
    }
}

function mine(content) {
    return content;
}

