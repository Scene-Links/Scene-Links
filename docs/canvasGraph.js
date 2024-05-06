// this section is bs xoxoxo i dont know how to code
let graph;
function fetchJSONData() {
    fetch("../graph-json/graph.json")
        .then((res) => {
            if (!res.ok) {
                throw new Error
                    (`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => 
              graph = data)
        .catch((error) => 
               console.error("Unable to fetch data:", error));
}
fetchJSONData();



let canvas = document.getElementById("canvas");
const infoText = document.getElementById("info");
const ctx = canvas.getContext("2d");

const animate = true;

//style
const PROJECT_FONT_SIZE = 13; //px
const MUSICIAN_FONT_SIZE = 10; //px

const ACTIVE_TEXT_COLOR = "White";
const INACTIVE_TEXT_COLOR = "DimGray";

const ACTIVE_MEMBER_LINK_COLOR = "Crimson";
const INACTIVE_MEMBER_LINK_COLOR = "DarkSlateGray";
const PERFORMED_WITH_LINK_COLOR = "Indigo";
const PLAYED_SHOW_TOGETHER_COLOR = "Orange";
const PERFORMED_AT_COLOR = "Gold";
const SHOW_AT_COLOR = "Navy";

const LOGO_SIZE = 34; //px

//physics
const PRESENT_MEMBER_STRENGTH = 144 /1800;
const PAST_MEMBER_STRENGTH = 108 /1800;
const PERFORMED_WITH_STRENGTH = 18 /1800;
const SHOW_TOGETHER_STRENGTH = 20/1800;
const PERFORMED_AT_STRENGTH = 50/1800;
const SHOW_AT_STRENGTH = 1/1800;

const NODE_REPULSION = 18000;
const BAND_BAND_REPULSION = 1; // multiplied on top of node repulsion

//visualization settings
let INCLUDE_PERFORMED_WITH = true;
let INCLUDE_PAST_MEMBERS = true;
let INCLUDE_VENUE = false;
let SHOW_INACTIVES = true;



const onScreenNodes = new Map();

const onScreenLinks = new Map();

const images = new Map();

class DrawnNode {
    constructor(element, screenX=-1, screenY=-1) {
        this.element = element;
        this.screenX = screenX;
        this.screenY = screenY;
    }

    setRandomPosition() {
        this.screenX = Math.random() * canvas.width * 0.9 + 10;
        this.screenY = Math.random() * canvas.height * 0.95 + 10;
    }

    draw() {
        ctx.textAlign = "center";

        if (this.element.data.active) {
            ctx.fillStyle = ACTIVE_TEXT_COLOR;
        } else {
            ctx.fillStyle = INACTIVE_TEXT_COLOR;
        }
       
        switch (this.element.data.type) {
            case "Musician":
                ctx.font = MUSICIAN_FONT_SIZE + "px Arial";
                break;

            case "Project":
                ctx.font = PROJECT_FONT_SIZE + "px Arial";
                break;
            
            default:
                ctx.font = MUSICIAN_FONT_SIZE + "px Arial";
        }
        
        if (this.element.data.imagePath == "") { //no image
            ctx.fillText(this.element.name, this.screenX, this.screenY);
            // console.log(this.screenX)

        } else { //image
            //image
            const img = images.get(this.element.data.imagePath);

            const real_width = LOGO_SIZE / img.height * img.width;

            ctx.drawImage(img, this.screenX - real_width/2, this.screenY - LOGO_SIZE/2, real_width, LOGO_SIZE);
            
            ctx.fillText(this.element.name, this.screenX, this.screenY + LOGO_SIZE);
        }
    }

    animate() { //in charge of movement. static? im too braindead to figure it out.
        onScreenNodes.forEach((otherDrawnNode) => {
            if (this.screenX > 0 && otherDrawnNode.screenX > 0 &&
                this.screenY > 0 && otherDrawnNode.screenY > 0) {

                const differenceX = (otherDrawnNode.screenX - this.screenX);
                const differenceY = (otherDrawnNode.screenY - this.screenY);

                const distance = Math.sqrt(differenceX ** 2 + differenceY ** 2);

                if (distance > 5) {
                    let change = NODE_REPULSION / (distance ** 3) - .00003; // last number is gravity factor or whatever

                    if (this.element.type == "Project" && otherDrawnNode.element.type == "Project") {
                        change *= BAND_BAND_REPULSION;
                    }

                    this.screenX -= change * differenceX;
                    this.screenY -= change * differenceY;
                }
            }
        })
    }
}

class DrawnLink {
    constructor(element, startID, endID) {
        this.element = element;
        this.startID = startID;
        this.endID = endID;

        this.startX = onScreenNodes.get(startID).screenX;
        this.startY = onScreenNodes.get(startID).screenY;
        this.endX = onScreenNodes.get(endID).screenX;
        this.endY = onScreenNodes.get(endID).screenY;
    }

    draw() {
        switch (this.element.type) {
            case "member":
                if (this.element.presentness) {
                    ctx.strokeStyle = ACTIVE_MEMBER_LINK_COLOR;
                } else {
                    ctx.strokeStyle = INACTIVE_MEMBER_LINK_COLOR;
                }
                break;
        
            case "performed with":
                ctx.strokeStyle = PERFORMED_WITH_LINK_COLOR;
                break;
            
            case "played show together":
                ctx.strokeStyle = PLAYED_SHOW_TOGETHER_COLOR;
                break;

            case "performed at":
                ctx.strokeStyle = PERFORMED_AT_COLOR;
                break;

            case "show at":
                ctx.strokeStyle = SHOW_AT_COLOR;
                break;

            default:
                ctx.strokeStyle = "White";
        }

        ctx.beginPath();
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(this.endX, this.endY);
        ctx.stroke();
    }

    length() {
        return Math.sqrt((this.startX - this.endX) ** 2 + (this.startY - this.endY) ** 2);
    }

    animate() {
        const startNode = onScreenNodes.get(this.startID);
        const endNode = onScreenNodes.get(this.endID)

        const length_difference = (this.length()
            //- (LINK_LENGTH + 3 * (startNode.element.links.length + endNode.element.links.length))
            );

        let change;

        switch (this.element.type) {
            case "member":
                if (this.element.presentness) {
                    change = length_difference * PRESENT_MEMBER_STRENGTH;
                } else {
                    change = length_difference * PAST_MEMBER_STRENGTH;
                }
                break;
        
            case "performed with":
                change = length_difference * PERFORMED_WITH_STRENGTH;
                break;

            case "played show together":
                change = length_difference * SHOW_TOGETHER_STRENGTH;
                break;
            
            case "performed at":
                change = length_difference * PERFORMED_AT_STRENGTH;
                break;

            case "show at":
                change = length_difference * SHOW_AT_STRENGTH;
                break;    
        }

        const directionX = (this.endX - this.startX) / this.length(); //unit direction vector
        const directionY = (this.endY - this.startY) / this.length();

        startNode.screenX += directionX * change;
        endNode.screenX -= directionX * change;

        startNode.screenY += directionY * change;
        endNode.screenY -= directionY * change;


        this.startX = startNode.screenX;
        this.startY = startNode.screenY;
        this.endX = endNode.screenX;
        this.endY = endNode.screenY;
    }
}

function moveScreenCenter() {
    let totalX = 0;
    let totalY = 0;

    onScreenNodes.forEach((node) => {
        totalX += node.screenX;
        totalY += node.screenY;
    })

    if (totalX == NaN || totalY == NaN) {
        return;
    }

    const avgX = totalX / onScreenNodes.size;
    const avgY = totalY / onScreenNodes.size;

    const changeX = canvas.width / 2 - avgX;
    const changeY = canvas.height / 2 - avgY;

    onScreenNodes.forEach((node) => {
        node.screenX += changeX;
        node.screenY += changeY;
    })
}

function initializeNode(node) {
    if (!SHOW_INACTIVES && !node.data.active) { // disclude inactive nodes if set to do so
        return;
    }
    if (!onScreenNodes.has(node.id)) {
        onScreenNodes.set(node.id, new DrawnNode(node));
        onScreenNodes.get(node.id).setRandomPosition();
    }
}

function initializeLink(link) { //sets up, does not draw

    if (!INCLUDE_PAST_MEMBERS && link.type == "member" && !link.presentness) { // disclude past memberships if set to do so
        return;
    }

    if (!INCLUDE_PERFORMED_WITH && link.type == "performed with") { // disclude performed w if set to do so
        return;
    }

    if (!INCLUDE_VENUE && link.type == "show at") { // disclude venue to show links if set to do so
        return;
    }

    if (!onScreenLinks.has(link.id)) {
        onScreenLinks.set(link.id, new DrawnLink(link, link.nodeAID, link.nodeBID));
    }
}


// function updateInfoText(dt) {
//     infoText.textContext = `FPS: ${Math.round(1000 / dt)}`;
// }

function initialize() {

    for (let i = 0; i < graph.nodes.length; i++) {
        const node = graph.nodes[i];
        initializeNode(node);
    }
    
    for (let i = 0; i < graph.nodes.length; i++) {
        const node = graph.nodes[i];

        for (let j = 0; j < node.links.length; j++) {
            const link = node.links[j];
            initializeLink(link);
        }
    }

    //store images
    graph.nodes.forEach( (node) => {
        if (node.data.imagePath != "") {
            const img = new Image();
            img.src = "../images/"+ node.data.imagePath;
            images.set(node.data.imagePath, img);
        }
    })
}

function draw() {
    ctx.fillStyle ='white';
    // ctx.fillText("meow", 100, 100);

    onScreenNodes.forEach((drawnNode) => {
        drawnNode.animate();
    });

    onScreenLinks.forEach((drawnLink) => {
        drawnLink.animate();
    });

    moveScreenCenter();

    onScreenLinks.forEach((drawnLink) => {
        drawnLink.draw();
    });

    onScreenNodes.forEach((drawnNode) => {
        drawnNode.draw();
    });

}

// animation
let startTime, previousTimestamp, timeElapsed; 
let animationComplete = false;

function render(timestamp) {
    if (startTime === undefined) { //first frame
        startTime = timestamp;
        initialize();
    }

    timeElapsed = timestamp - startTime;

    if (previousTimestamp !== undefined) {
        const dt = timestamp - previousTimestamp; //dt in milliseconds
        // updateInfoText(dt);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();

    // animationComplete = true;

    if (!animationComplete) { //trigger next frame
        previousTimestamp = timestamp;

        window.requestAnimationFrame(render);
        // setTimeout(() => {window.requestAnimationFrame(render)}, 50);
    }
}

if (animate) {
    window.requestAnimationFrame(render);
} else {
    draw();
}


//buttonography

function togglePastConnections() {
    const button = document.getElementById("togglePast")
    
    onScreenLinks.clear();

    if (INCLUDE_PAST_MEMBERS) {
        INCLUDE_PAST_MEMBERS = false;
        button.innerHTML = "Show Past Connections";
    } else {
        INCLUDE_PAST_MEMBERS = true;
        button.innerHTML = "Hide Past Connections";
    }

    //now just add the right links in
    for (let i = 0; i < graph.nodes.length; i++) {
        const node = graph.nodes[i];

        for (let j = 0; j < node.links.length; j++) {
            const link = node.links[j];
            initializeLink(link);
        }
    }
}

function togglePerformedWith() {

    const button = document.getElementById("togglePerformed")
    
    onScreenLinks.clear(); //remove all links

    if (INCLUDE_PERFORMED_WITH) {
        INCLUDE_PERFORMED_WITH = false;
        button.innerHTML = "Show Associated Performers";
    } else {
        INCLUDE_PERFORMED_WITH = true;
        button.innerHTML = "Hide Associated Performers";
    }

    //now just add the right links in
    for (let i = 0; i < graph.nodes.length; i++) {
        const node = graph.nodes[i];

        for (let j = 0; j < node.links.length; j++) {
            const link = node.links[j];
            initializeLink(link);
        }
    }
}