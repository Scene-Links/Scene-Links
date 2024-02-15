import { Musician, Project, Venue, Label } from "../framework/data-custom.js";
import { Link, LinkTypes} from "../framework/links.js";
import { Data, Node} from "../framework/nodes.js";
import { Graph, graph } from "./main.js";

let canvas = document.getElementById("canvas");
const infoText = document.getElementById("info");
const ctx = canvas.getContext("2d");

const animate = true;

function drawNode(node) {
    const screenX = Math.random() * canvas.width;
    const screenY = Math.random() *canvas.height;
    ctx.fillText(node.name, screenX, screenY);
}

function updateInfoText(dt) {
    infoText.textContext = `FPS: ${Math.round(1000 / dt)}`;
}

function draw() {
    ctx.fillStyle ='rgb(240, 200, 90';
    ctx.fillText("meow", 100, 100);

    for (graphNode in graph.nodes) {
        drawNode(graphNode);
    }

}

// animation
let startTime, previousTimestamp, timeElapsed; 
let animationComplete = false;
function render(timestamp) {
    if (startTime === undefined) {
        startTime = timestamp;
    }

    timeElapsed = timestamp - startTime;

    if (previousTimestamp !== undefined) {
        const dt = timestamp - previousTimestamp; //dt in milliseconds
    
        // updateCameraPosition(camera, dt);
        updateInfoText(dt);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();

    if (!animationComplete) { //trigger next frame
        previousTimestamp = timestamp;

        window.requestAnimationFrame(render);
    }
}

if (animate) {
    window.requestAnimationFrame(render);
} else {
    draw();
}
