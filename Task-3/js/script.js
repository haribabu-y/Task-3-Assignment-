let count = 0;
let idnum = 1
function splitDiv(event, element) {
    
    let styles = window.getComputedStyle(element);
    console.log("Styles: " + styles);
    console.log("Styles width: " + styles.width);
    console.log("Event OffsetX: " + event.offsetX);    

    let div_width = parseInt(styles.width) - event.offsetX;
    console.log("right div width: " + div_width);
    
    let leftDiv = document.createElement('div');
    leftDiv.setAttribute("style",`width:${event.offsetX}px; z-index:${count};border-left:none;`);
    leftDiv.setAttribute("onclick", "splitDiv(event,this)");
    leftDiv.setAttribute("class", `divs`);
    // leftDiv.setAttribute("draggable", true);
    leftDiv.setAttribute("ondragstart", "dragstartHandler(event)");
    leftDiv.setAttribute("id", `div${idnum}`);
    idnum++;
    element.appendChild(leftDiv);

    let rightDiv = document.createElement('div');
    rightDiv.setAttribute("style", `width:${div_width}px;z-index:${count};right:0;border-right:none;`);
    rightDiv.setAttribute("onclick", "splitDiv(event,this)");
    rightDiv.setAttribute("class", `divs`);
    // rightDiv.setAttribute("draggable", true);
    rightDiv.setAttribute("ondragstart", "dragstartHandler(event)");
    rightDiv.setAttribute("id", `div${idnum}`);
    idnum++;
    element.appendChild(rightDiv);
    element.removeAttribute("onclick");
    count++;
}

function allowCut() {
    const element = document.getElementById("mainElement");
    if(getComputedStyle(element).pointerEvents == "none") {
        element.style.pointerEvents = "auto";
    } else {
        element.style.pointerEvents = "none";
    }
    
}

function joinParts() {
    const element = document.getElementById("mainElement");
    element.innerHTML = ""; 
    element.setAttribute("onclick", "splitDiv(event,this)");   
}

function dragItems() {
    // const divsClassList = document.getElementsByClassName("divs");
    // console.log(divsClassList);
    
    // if(divsClassList[0].getAttribute("draggable") == "false") {
    //     for(let i=0; i<divsClassList.length;i++) {
    //         divsClassList[i].setAttribute("draggable", true);
    //     }
    // } else {
    //     for(let i=0; i<divsClassList.length;i++) {
    //         divsClassList[i].setAttribute("draggable", false);
    //     }
    // }
    const dragItems = document.querySelectorAll(".divs");
    // console.log(dragItems);
    if(dragItems[0].draggable == false) {
        dragItems.forEach(dragItem => {
            dragItem.draggable = true;
        });
    } else {
        dragItems.forEach(dragItem => {
            dragItem.draggable = false;
        });
    }  
    // document.getElementById("mainElement").setAttribute("onclick", "splitDiv(event,this)");
}

//draging the element into the another div element
function dragstartHandler(event) {
    // event.dataTransfor.setData("text/plain", event.target.id);
    event.dataTransfer.setData("text/plain", event.target.id);
    // console.log("Dragging: " + event.target.id);
}

function dragoverHandler(event) {
    // event.preventDefault();
    event.preventDefault()
    // console.log("Over drop zone");
}

let piecenum = 1;
function dropHandler(event,obj) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text/plain");
    const draggedElement = document.getElementById(data);

    const copy = document.createElement('div');
    copy.className = draggedElement.className;
    copy.textContent ="";
    copy.style.width = draggedElement.style.width;
    copy.id = `piece${piecenum}`;
    piecenum++;

    event.target.appendChild(copy);
    // console.log("Dropped: " + data);

    const droptime = new Date();
    const dropSeconds = droptime.getSeconds();
    obj.lastChild.setAttribute("tooltip-data", `${droptime.toLocaleTimeString()}`);
    if(dropSeconds % 2 == 0) {
        obj.lastChild.style.backgroundColor = "blue";
    } else {
        obj.lastChild.style.backgroundColor = "red";
    }

}

function buildTree() {
    const droppedElements = document.querySelectorAll("#dragplace .divs");
    const droppedElementsArray = [];

    const treeContainer = document.getElementById("buildTree");
    treeContainer.innerHTML = "";

    droppedElements.forEach(element => {
        droppedElementsArray.push(element);
    });

    const arrayLength = droppedElementsArray.length;

    const rows = Math.ceil(Math.log2(arrayLength + 1));

    const columns = Math.pow(2, rows) - 1;

    let column = 1;
    let baseWidth = 100;
    let n = 0;
    for(let i=0;i<rows;i++) {
        const row = document.createElement('div');
        row.className = 'tree-row';
        const nodeWidth = baseWidth / Math.pow(2, i);
        for(let j=0;j<column;j++) {
            if(n < arrayLength) {
                const nodeElement = document.getElementById(droppedElementsArray[n].id);

                const node = document.createElement('div');
                node.style.width = `${nodeWidth}%`;
                node.style.height = "80px";
                node.className = "nodes";
                    const content = document.createElement('div');
                    content.style.width = "50px";
                    content.style.height = "50px";
                    content.setAttribute("tooltip-data", `${nodeElement.getAttribute("tooltip-data")}`);
                    content.style.backgroundColor = nodeElement.style.backgroundColor;
                    node.appendChild(content);
                row.appendChild(node);
            }
            n++;
        }
        column *= 2;
        treeContainer.appendChild(row);
    }
}

