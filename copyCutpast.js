let ctrlKey;
document.addEventListener("keydown", (e) => {// crtl key is pressed
    ctrlKey = e.ctrlKey;// Boolean
}) 
document.addEventListener("keyup", (e) => { // crtl key is not pressed
    ctrlKey = e.ctrlKey; // Boolean
})

for (let i =0;i < rows;i++) {
    for (let j = 0;j < cols;j++) { // adding event listeners to each cell to selecting end points of selected portion
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        handleSelectedCells(cell);
    }
}

let copyBtn = document.querySelector(".copy");
let cutBtn = document.querySelector(".cut");
let pasteBtn = document.querySelector(".paste");


let rangeStorage = [];
function handleSelectedCells(cell) {
    cell.addEventListener("click", (e) => {
        
        if (!ctrlKey) return; // if control is not pressed
        if (rangeStorage.length >= 2) {// if two cells are already selected and we are clicking some where else range is reset
            defaultSelectedCellsUI();// setting cell border back to normal
            rangeStorage = [];
        }
        cell.style.border = "3px solid #218c74";

        let rid = Number(cell.getAttribute("rid"));
        let cid = Number(cell.getAttribute("cid"));
        rangeStorage.push([rid, cid]);
    })
}


function defaultSelectedCellsUI() { // set each selected cell borders back to normal
    for (let i = 0;i < rangeStorage.length;i++) {
        let cell = document.querySelector(`.cell[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][1]}"]`);
        cell.style.border = "1px solid lightgrey";
    }
}


let copyData = [];
copyBtn.addEventListener("click", (e) => {
    if (rangeStorage.length < 2) return; // if two cells are not selected
    copyData = [];

    let [strow, stcol, endrow, endcol] = [ rangeStorage[0][0], rangeStorage[0][1], rangeStorage[1][0], rangeStorage[1][1] ];

    for (let i = strow;i <= endrow;i++) {
        let copyRow = [];
        for (let j = stcol;j <= endcol;j++) {
            let cellProp = sheetDB[i][j];
            copyRow.push(cellProp);// we copy all properties of cell between two endpoints
        }
        copyData.push(copyRow);
    }

    defaultSelectedCellsUI();// remove selected borders
})


cutBtn.addEventListener("click", (e) => { // same as copy feature just current cell properties to defaults
    if (rangeStorage.length < 2) return;

    let [strow, stcol, endrow, endcol] = [ rangeStorage[0][0], rangeStorage[0][1], rangeStorage[1][0], rangeStorage[1][1] ];

    for (let i = strow;i <= endrow;i++) {
        for (let j = stcol;j <= endcol;j++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);

            // DB
            let cellProp = sheetDB[i][j];
            // setting properties to default
            cellProp.value = "";
            cellProp.bold = false;
            cellProp.italic = false;
            cellProp.underline = false;
            cellProp.fontSize = 14;
            cellProp.fontFamily = "monospace";
            cellProp.fontColor = "#000000";
            cellProp.BGcolor = "#000000";
            cellProp.alignment = "left";

            // UI
            cell.click();
        }
    }

    defaultSelectedCellsUI();
})


pasteBtn.addEventListener("click" ,(e) => {
    if (rangeStorage.length < 2) return;

    let rowDiff = Math.abs(rangeStorage[0][0] - rangeStorage[1][0]);
    let colDiff = Math.abs(rangeStorage[0][1] - rangeStorage[1][1]);

    // finding which cell is clicked
    let address = addressBar.value;
    let [stRow, stCol] = decodeRIDCIDFromAddress(address);

    // iterate over cell numbers of cell which were selected and set the properties
    for (let i = stRow,r = 0;i <= stRow+rowDiff;i++,r++) {
        for (let j = stCol,c = 0;j <= stCol+colDiff;j++,c++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            console.log(cell);
            if (!cell) continue;

            // DB
            let data = copyData[r][c];
            let cellProp = sheetDB[i][j];
            // setting values for paste
            cellProp.value = data.value;
            cellProp.bold = data.bold;
            cellProp.italic = data.italic;
            cellProp.underline = data.underline;
            cellProp.fontSize = data.fontSize;
            cellProp.fontFamily = data.fontFamily;
            cellProp.fontColor = data.fontColor;
            cellProp.BGcolor = data.BGcolor;
            cellProp.alignment = data.alignment;

            cell.click();
        }
    }
})