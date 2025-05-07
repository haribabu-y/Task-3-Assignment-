// 
const cutArea = document.getElementById("mainElement");
const styles = window.getComputedStyle(cutArea);
let pieces = [ { width: parseInt(styles.width) } ];
// console.log(pieces);

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
    // console.log(cutAreaRect);
    const clickX = event.clientX - cutAreaRect.left;

    let accumulatedWidth = 0;
    for(let i=0; i < pieces.length; i++) {
        const pieceWidth = pieces[i].width;
        const startX = accumulatedWidth;
        const endX = startX + pieceWidth;

        if(clickX >= startX && clickX <= endX) {
            const relativeX = clickX - startX;
            if(relativeX <= 2 || relativeX >= pieceWidth -2) return;

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

function dropHandler(event,object) {
    // receiving the data that is send by the dragstart handler 
    event.preventDefault();
    const data = event.dataTransfer.getData("text/plain");
    // getting the element that is sent
    const draggedElement = document.getElementById(data);
    //appending the dragged element into the target
    event.target.appendChild(draggedElement);

    //finding the time od dropping
    const dropTime = new Date();
    //getting the dropping secondes
    let dropseconds = dropTime.getSeconds();
    // console.log(object);
    object.lastChild.setAttribute("toolTip-data", `${dropTime.toLocaleTimeString()}`);
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

function buildTree() {
    //Storing the tropprd element
    const droppedElements = document.querySelectorAll("#dragplace .piece");
    // console.log(droppedElements);
    const droppedElementsArray = [];
    droppedElements.forEach(element => {
        droppedElementsArray.push(element);
    });
    console.log(droppedElementsArray.length);
    
    const tree = buildBinaryTree(droppedElementsArray);
    console.log(tree);
    // alert("Tree builed successfully.");
       
}

function buildBinaryTree(array) {
    if(!array.length) return null;

    const root = new treeNode(array[0]);
    const queue = [root];
    let i=1;

    while(i < array.length) {
        const current = queue.shift();

        if(i < array.length) {
            current.left = new treeNode(array[i++]);
            queue.push(current.left);
        }

        if(i < array.length) {
            current.right = new treeNode(array[i++]);
            queue.push(current.right);
        }
    }

    return root;

}

function treeNode(value) {
    this.value = value;
    this.left = null;
    this.right = null;
}
