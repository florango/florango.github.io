let titleEl = document.querySelector('body > main > div:nth-child(1)')

titleEl.className = 'title'

let headerEl = document.createElement("div")
headerEl.className = 'header'

let children = titleEl.children

for(var i in children) {
    let child = children[i];    
    headerEl.appendChild(child.remove())
}

titleEl.appendChild(headerEl)




