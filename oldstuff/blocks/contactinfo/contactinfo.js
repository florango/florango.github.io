import { show as showOverlay, hide as hideOverlay } from '/libs/overlay/overlay.js';
import VCard from 'https://cdn.skypack.dev/vcard-creator'
import fileSaver from 'https://cdn.skypack.dev/file-saver';

async function loadInclude($block, blockName) {
  const resp = await fetch(`/blocks/${blockName}/${blockName}.html`);
  const text = await resp.text();
  $block.innerHTML = text;


  // Define a new vCard
  const vCard = new VCard()

  // Some variables
  const lastname = 'Mejía'
  const firstname = 'Karol'
  const additional = ''
  const prefix = ''
  const suffix = ''



  vCard
    .addName(lastname, firstname, additional, prefix, suffix)
    .addCompany('Florango')
    .addJobtitle('Chief Florangista')
    .addEmail('Karol@Florango.com')
    .addPhoneNumber(4242727091, 'STORE')
    .addPhoneNumber(3053350108, 'MOBILE')
    .addAddress('', '', '74275 Highway 111', 'Palm Desert', 'CA', '92260', 'USA')
    .addURL('http://www.Florango.com')
    .addPhoto('/assets/images/FlorRider.png', 'image/png')
  const cardString = vCard.toString();
  console.log(cardString)

  const cardBlob = new Blob([cardString], { type: "text/vcard;charset=utf-8" });
  console.log(cardBlob)


  const $contactInfo = document.querySelector('.contactinfo-container');
  const $link = document.createElement('a');
  $link.append('Contact Card')
  $link.href = '#'//URL.createObjectURL(cardBlob)
  $link.addEventListener('click',
    () => {
      saveAs(cardBlob, "card.vcf");
    })

  $contactInfo.appendChild($link)
  //$link.click();
}

export default async function decorate($block, blockName) {
  await loadInclude($block, blockName);
}

