let collectedGraphComponent = [];
let graphComponentMatrix = [];

for(let i=0;i<rows;i++)
{
    let row=[]
    for(let j=0;j<cols;j++)
    {
        row.push([])
    }
    graphComponentMatrix.push(row)
}

function isGraphCylic(graphComponentMatrix) {
    let visited = []; 
    let dfsVisited = []; 

    for (let i = 0; i < rows; i++) {// visited array is 2d as original cells are represented in 2d matrix form.
        let visitedRow = [];
        let dfsVisitedRow = [];
        for (let j = 0; j < cols; j++) {
            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }
        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (!visited[i][j]) {
                let response = dfsCycleDetection(graphComponentMatrix, i, j, visited, dfsVisited);
                if (response) return [i, j];
            }
        }
    }
    
    return null;
}


function dfsCycleDetection(graphComponentMatrix, srcr, srcc, visited, dfsVisited) {
    visited[srcr][srcc] = true;
    dfsVisited[srcr][srcc] = true;

    for (let children = 0; children < graphComponentMatrix[srcr][srcc].length; children++) {
        let [nbrr, nbrc] = graphComponentMatrix[srcr][srcc][children];
        if (!visited[nbrr][nbrc]) {
            let response = dfsCycleDetection(graphComponentMatrix, nbrr, nbrc, visited, dfsVisited);
            if (response) return true; 
        }
        else if (visited[nbrr][nbrc] && dfsVisited[nbrr][nbrc]) {
            return true;
        }
    }

    dfsVisited[srcr][srcc] = false;
    return false;
}