// 
const cutArea = document.getElementById("mainElement");
const styles = window.getComputedStyle(cutArea);
let pieces = [ { width: parseInt(styles.width) } ];
console.log(pieces);

// console.log(styles.width);

let divnum = 1;

function renderPieces() {
    cutArea.innerHTML = "";
    pieces.forEach((piece) => {
        const div = document.createElement("div");
        div.className = "piece";
        div.style.width = piece.width + "px";
        div.setAttribute("id", `div${divnum}`);
        divnum++;
        div.setAttribute("ondragstart", "dragstartHandler(event)");
        cutArea.appendChild(div);
      });
}

function splitDiv(event) {
    const cutAreaRect = cutArea.getBoundingClientRect();
    console.log(cutAreaRect);
    console.log(event.clientX);
    console.log(cutAreaRect.left);
    
    const clickX = event.clientX - cutAreaRect.left;
    console.log(clickX);
    console.log(pieces.length);
    
    

    let accumulatedWidth = 0;
    for(let i=0; i < pieces.length; i++) {
        const pieceWidth = pieces[i].width;
        const startX = accumulatedWidth;
        const endX = startX + pieceWidth;

        if(clickX >= startX && clickX <= endX) {
            const relativeX = clickX - startX;

            pieces.splice(i, 1,
                { width: relativeX },
                { width: pieceWidth - relativeX }
            );
            break;
        }

        accumulatedWidth += pieceWidth;
    }
    
    renderPieces();
}

// renderPieces();

// allowing the user to cut the dic element after clicking the button
function allowCut() {
    const element = document.getElementById("mainElement");
    if(getComputedStyle(element).pointerEvents == "none") {
        element.style.pointerEvents = "auto";
        element.style.cursor = "crosshair";
    } else {
        element.style.pointerEvents = "none";
        element.style.cursor = "not-allowed";
    }   
}

//Joining the already cutted parts of the div element 
function joinParts() {
    const element = document.getElementById("mainElement");
    element.innerHTML = ""; 
    // element.setAttribute("onclick", "splitDiv(event)"); 
    pieces = [ { width: parseInt(styles.width) } ];  
}

//Making the div pieces draggable to drag and drop in the target div 
function dragItems() {
    const dragItems = document.querySelectorAll(".piece");
    // console.log(dragItems);
    if(dragItems[0].draggable == false) {
        dragItems.forEach(dragItem => {
            dragItem.draggable = true;
            dragItem.style.cursor = "grab";
        });
    } else {
        dragItems.forEach(dragItem => {
            dragItem.draggable = false;
            dragItem.style.cursor = "auto";
        });
    }    
}


//Dragging the elements to the another div
function dragstartHandler(event) {
    //setting the data in the dragging element with its id
    event.dataTransfer.setData("text/plain", event.target.id);

}

function dragoverHandler(event) {
    //making the receiving div to receive the dragging data
    event.preventDefault();
}

let piecenum = 1;
function dropHandler(event,object) {
    // receiving the data that is send by the dragstart handler 
    event.preventDefault();
    const data = event.dataTransfer.getData("text/plain");

    // getting the element that is sent
    const draggedElement = document.getElementById(data);
    console.log(draggedElement);
    

    const copy = document.createElement('div');
    copy.className = draggedElement.className;
    copy.textContent = "";
    copy.style.width = draggedElement.style.width;
    copy.id = `piece${piecenum}`;
    // copy.style.pointerEvents = "none";
    piecenum++;
    console.log(copy);
    

    //appending the dragged element into the target
    event.target.appendChild(copy);

    //finding the time od dropping
    const dropTime = new Date();
    //getting the dropping secondes
    let dropseconds = dropTime.getSeconds();
    // console.log(object);
    object.lastChild.setAttribute("tooltipData", `${dropTime.toLocaleTimeString()}`);
    // Based on the secondes setting the background color of the div element
    if(dropseconds % 2 == 0) {
        // console.log(dropseconds);
        // console.log("even Secondes");
        object.lastChild.style.backgroundColor = "blue";
        
    } else {
        // console.log(dropseconds);
        // console.log("odd secondes");
        object.lastChild.style.backgroundColor = "red";
    }
}

// function buildTree() {
//     //Storing the tropprd element
//     const droppedElements = document.querySelectorAll("#dragplace .piece");
//     // console.log(droppedElements);
//     const droppedElementsArray = [];
//     droppedElements.forEach(element => {
//         droppedElementsArray.push(element);
//     });
//     console.log(droppedElementsArray.length);
    
//     const tree = buildBinaryTree(droppedElementsArray);
//     console.log(tree);
//     // alert("Tree builed successfully.");
       
// }

// function buildBinaryTree(array) {
//     if(!array.length) return null;

//     const root = new treeNode(array[0]);
//     const queue = [root];
//     let i=1;

//     while(i < array.length) {
//         const current = queue.shift();

//         if(i < array.length) {
//             current.left = new treeNode(array[i++]);
//             queue.push(current.left);
//         }

//         if(i < array.length) {
//             current.right = new treeNode(array[i++]);
//             queue.push(current.right);
//         }
//     }

//     return root;

// }

// function treeNode(value) {
//     this.value = value;
//     this.left = null;
//     this.right = null;
// }

function buildTree() {
    const droppedElements = document.querySelectorAll("#dragplace .piece");
    const droppedElementsArray = [];
    console.log(droppedElements);

    //Colllecting the div to build binary tree
    const treeContainer = document.getElementById("binaryTree");
    treeContainer.innerHTML = "";    

    droppedElements.forEach(element => {
        droppedElementsArray.push(element);
    });
    console.log(droppedElementsArray);
    
    const nodeCount = droppedElementsArray.length;
    console.log(nodeCount);
    

    // calculating the number of rows for binary tree
    const rows = Math.ceil(Math.log2(nodeCount + 1));
    console.log(rows);

    // treeContainer.style.gridTemplateRows = `repeat(${rows}, 80px)`;

    //Calculating the number of columns required for the binary tree
    const columns = Math.pow(2, rows) - 1;
    console.log(columns);

    // treeContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

    //arragning the items in the tree
    let column = 1;
    let baseWidth = 100;
    let n = 0;
    for(let i=0; i<rows; i++) {
        const row = document.createElement('div');
        row.className = "tree-row";
        const nodeWidth = baseWidth / Math.pow(2,i);
        for(let j=0;j<column;j++) {
            if(n < nodeCount) {
                const nodeDiv = document.getElementById(droppedElementsArray[n].id);
                // console.log(nodeDiv);
                // console.log(droppedElementsArray[n].id);
                
                
                const node = document.createElement('div');
                node.style.width = `${nodeWidth}%`;
                node.style.height = "50px";
                node.className = "nodes";
                // node.style.backgroundColor = nodeDiv.style.backgroundColor;
                // node.setAttribute("tooltipData", `${nodeDiv.getAttribute("tooltipData")}`);
                    const content = document.createElement('div');
                    content.style.width = "50px";
                    content.style.height = "50px";
                    content.setAttribute("tooltipData", `${nodeDiv.getAttribute("tooltipData")}`);
                    content.style.backgroundColor = nodeDiv.style.backgroundColor;
                    // content.style.backgroundColor = "green";
                    node.appendChild(content);
                row.appendChild(node);
            }
            n++;
        }
        column = column * 2;
        treeContainer.appendChild(row);
    }


    //Arraging the nodes in its positions
    // droppedElementsArray.forEach((value, index) => {
    //     const row = Math.floor(Math.log2(index + 1));
    //     // console.log(row);        
    //     const positionLevel = index - Math.pow(2, row) + 1;
    //     // console.log(positionLevel);        
    //     const rowStart = Math.pow(2, rows - row - 1);
    //     // console.log(rowStart);        
    //     const step = Math.pow(2, rows - row);
    //     // console.log(step);

    //     const column = rowStart + positionLevel * step;
    //     // console.log(value);
        
    //     const nodeDiv = document.getElementById(value.id);

    //     const node = document.createElement('div');
    //     // console.log(node);
        
    //     node.className = "node";
    //     node.style.backgroundColor = nodeDiv.style.backgroundColor;
    //     node.setAttribute("tooltipData", `${nodeDiv.getAttribute("tooltipData")}`);
    //     node.style.gridRow = `${row + 1}`;
    //     node.style.gridColumn = `${column}`;
    //     // node.textContent = value;

    //     treeContainer.appendChild(node);
    // });
    
}

const page1Btn = document.getElementById("page1btn");
const page2Btn = document.getElementById("page2btn");

const treebtn = document.getElementById("buildTreeBtn");
const treeContainer = document.getElementById("binaryTree");

const actionElement = document.getElementById("maindiv");
const dropElement = document.getElementById("dragplace");

page1Btn.addEventListener('click', () => {
    treebtn.style.display = "none";
    treeContainer.style.display = "none";
    actionElement.style.display = "flex";
    dropElement.style.display = "flex";
});

page2Btn.addEventListener('click', () => {
    treebtn.style.display = "block";
    treeContainer.style.display = "grid";
    actionElement.style.display = "none";
    dropElement.style.display = "none";
});