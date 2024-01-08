import {Node, Project, Musician, Label, Venue} from "./framework/nodes.js";


class Graph {
    constructor() {
        this.nodes = [];
    }

    addNode(node) {
        this.nodes[node.id] = node;
    }
}


const project = new Project("Earpiercindsinf");

console.log("hi");
console.log(project.name);
console.log(project.members);

const cas = new Musician("cassingtonwoofington");
project.addMember(cas);

console.log(project.members);