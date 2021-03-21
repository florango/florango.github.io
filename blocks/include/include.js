async function loadInclude($block) {
    const $a = $block.querySelector('a');
    if($a && $a.href) {
        const url = new URL($a.href);
        const resp = await fetch(url.pathname + url.search);
        const text = await resp.text();        
        $block.innerHTML = text;
        $block.querySelectorAll('script').forEach(($script) => {
            eval($script.innerText);
        })    
    }
}

export default function decorate($block) {
    loadInclude($block);
}