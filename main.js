import {Data, Node} from "./framework/nodes.js"
import {Project, Musician, Label, Venue, ActivityStatuses} from "./framework/nodes-custom.js";


class Graph {
    constructor() {
        this.nodes = [];
    }

    addNode(node) {
        this.nodes[node.id] = node;
    }
}


const project = new Node("Earpiercindsinf", new Project("rochester", "gay", ActivityStatuses.Active));

console.log(project.name);
console.log(project.data.bio);

const cas = new Node("cassingtonwoofington", new Musician("rochester"));
project.data.addMember(project, cas);

console.log(project.links);