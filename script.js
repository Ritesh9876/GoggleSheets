let rows = 100
let cols = 26
// infinite scrolling

let addressColCont = document.querySelector(".address-col-cont");
let addressRowCont = document.querySelector(".address-row-cont");
let cellsCont = document.querySelector(".cells-cont");
let addressBar = document.querySelector(".address-bar");

// Adding first main vertical side column
for (let i = 0;i < rows;i++) {
    let addressCol = document.createElement("div");
    addressCol.setAttribute("class", "address-col");
    addressCol.innerText = i+1;
    addressColCont.appendChild(addressCol);
}

// Adding top horizontal row
for (let i = 0;i < cols;i++) {
    let addressRow = document.createElement("div");
    addressRow.setAttribute("class", "address-row");
    addressRow.innerText = String.fromCharCode(65 + i);
    addressRowCont.appendChild(addressRow);
}

// Adding all cells
for (let i = 0;i < rows;i++) {
    let rowCont = document.createElement("div");
    rowCont.setAttribute("class", "row-cont");
    for (let j = 0;j < cols;j++) {
        let cell = document.createElement("div");
        cell.setAttribute("class", "cell");
        cell.setAttribute("contenteditable", "true");
        cell.setAttribute("spellcheck", "false");

        // Attributes for cell and storage identification
        cell.setAttribute("rid", i);
        cell.setAttribute("cid", j);

        rowCont.appendChild(cell);
        addListenerForAddressBarDisplay(cell, i, j);
    }
    cellsCont.appendChild(rowCont);
}

function addListenerForAddressBarDisplay(cell, i, j) {
    cell.addEventListener("click", (e) => {
        let rowID = i+1;
        let colID = String.fromCharCode(65 + j);
        addressBar.value = `${colID}${rowID}`;
    })
}

// select first cell from the start
let firstCell=document.querySelector('.cell')
firstCell.click()