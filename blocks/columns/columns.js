import {
  applyTemplate,
} from '/scripts.js';

export default async function process($block, blockName, templateFileName, document) {
  if (templateFileName) {
      const $template = applyTemplate($block, blockName, templateFileName)
  }
}

function mine($contentModel) {
  console.log($contentModel)
  return $contentModel;
}
