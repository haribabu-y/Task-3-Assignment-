let count = 0;
let idnum = 1
function splitDiv(event, element) {
    let leftDiv = document.createElement('div');
    let styles = window.getComputedStyle(element);

    let div_width = parseInt(styles.width) - event.offsetX;

    leftDiv.setAttribute("style",`width:${event.offsetX-1}px; z-index:${count};border-left:none;`);
    leftDiv.setAttribute("onclick", "splitDiv(event,this)");
    leftDiv.setAttribute("class", `divs`);
    // leftDiv.setAttribute("draggable", true);
    leftDiv.setAttribute("ondragstart", "dragstartHandler(event)");
    leftDiv.setAttribute("id", `div${idnum}`);
    idnum++;
    element.appendChild(leftDiv);

    let rightDiv = document.createElement('div');
    rightDiv.setAttribute("style", `width:${div_width-1}px;z-index:${count};right:0;border-right:none;`);
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
    document.getElementById("mainElement").setAttribute("onclick", "splitDiv(event,this)");
}

//draging the element into the another div element
function dragstartHandler(event) {
    // event.dataTransfor.setData("text/plain", event.target.id);
    event.dataTransfer.setData("text/plain", event.target.id);
    console.log("Dragging: " + event.target.id);
}

function dragoverHandler(event) {
    // event.preventDefault();
    event.preventDefault()
    console.log("Over drop zone");
}

function dropHandler(event) {
    // event.preventDefault();
    // // const data = event.dataTransfer.getData("text/plain");
    // const data = event.dataTransfer.getData("text/plain");
    // const draggedElement = document.getElementById(data);
    // event.target.appendChild(draggedElement);
    event.preventDefault();
    const data = event.dataTransfer.getData("text/plain");
    const draggedElement = document.getElementById(data);
    event.target.appendChild(draggedElement);
    console.log("Dropped: " + data);
}

