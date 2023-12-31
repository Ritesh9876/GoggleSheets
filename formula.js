for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur", (e) => {
            let address = addressBar.value;
            let [activeCell, cellProp] = getCellAndCellProp(address);
            
            let enteredData = activeCell.innerText;

            if (enteredData === cellProp.value) return;

            cellProp.value = enteredData;
           // as data is hard coded then remove formula , break child-parent relationships
            removeChildFromParent(cellProp.formula);
           cellProp.formula = "";
           updateChildrenCells(address);
        })
    }
}


let formulaBar = document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown", async (e) => {
    let inputFormula = formulaBar.value;
    if (e.key === "Enter" && inputFormula) {
        let evaluatedValue=evaluateFormula(inputFormula)

        let address = addressBar.value;
        let [cell, cellProp] = getCellAndCellProp(address);
        // As formula has changed we need to remove this child from children's array of the its parent
        if (inputFormula !== cellProp.formula) removeChildFromParent(cellProp.formula);

        addChildToGraphComponent(inputFormula, address);

        let cycleResponse = isGraphCylic(graphComponentMatrix);
        if (cycleResponse) {
            let response = confirm("Your formula is cyclic. Do you want to trace your path?");
            while (response === true) {
                await isGraphCylicTracePath(graphComponentMatrix, cycleResponse);
                response = confirm("Your formula is cyclic. Do you want to trace your path?");
            }

            removeChildFromGraphComponent(inputFormula, address);
            return;
        }
        setCellUIAndCellProp(evaluatedValue,inputFormula,address) // update values
        addChildToParent(inputFormula) // as this cell contains dependencies it becomes child of other cells

        updateChildrenCells(address);// as this cell's value is changed its children values are depended on it, so they need to be changed.
    }
})


function updateChildrenCells(parentAddress) {
    let [parentCell, parentCellProp] = getCellAndCellProp(parentAddress);
    let children = parentCellProp.children;

    for (let i = 0; i < children.length; i++) {
        let childAddress = children[i];
        let [childCell, childCellProp] = getCellAndCellProp(childAddress);
        let childFormula = childCellProp.formula;

        let evaluatedValue = evaluateFormula(childFormula);
        setCellUIAndCellProp(evaluatedValue, childFormula, childAddress);
        updateChildrenCells(childAddress);
    }
}

function addChildToParent(formula) {
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
            parentCellProp.children.push(childAddress);
        }
    }
}

function removeChildFromGraphComponent(formula, childAddress) {
    let [crid, ccid] = decodeRIDCIDFromAddress(childAddress);
    let encodedFormula = formula.split(" ");

    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [prid, pcid] = decodeRIDCIDFromAddress(encodedFormula[i]);
            graphComponentMatrix[prid][pcid].pop();
        }
    }
}

function addChildToGraphComponent(formula, childAddress) {
    let [crid, ccid] = decodeRIDCIDFromAddress(childAddress);
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [prid, pcid] = decodeRIDCIDFromAddress(encodedFormula[i]);
            // B1: A1 + 10
            // rid -> i, cid -> j
            graphComponentMatrix[prid][pcid].push([crid, ccid]);
        }
    }
}
function removeChildFromParent(formula) {
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
            let idx = parentCellProp.children.indexOf(childAddress);
            parentCellProp.children.splice(idx, 1);
        }
    }
}

function evaluateFormula(formula){  // can make it advance by using stack or something
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [cell, cellProp] = getCellAndCellProp(encodedFormula[i]);
            encodedFormula[i] = cellProp.value;
        }
    }
    let decodedFormula = encodedFormula.join(" ");
    return eval(decodedFormula);
}


function setCellUIAndCellProp(evaluatedValue, formula, address) {
    let [cell, cellProp] = getCellAndCellProp(address);

    //UI update
    cell.innerText = evaluatedValue;
    // DB update
    cellProp.value = evaluatedValue;
    cellProp.formula = formula;
}