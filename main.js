import {Data, Node} from "./framework/nodes.js"
import {Project, Musician, Label, Venue} from "./framework/data-custom.js";
import {constructGraph} from "./data-processing/interpereter.js";


class Graph {
    constructor() {
        this.nodes = [];
    }

    addNode(node) {
        this.nodes.push(node);
    }
}


// const project = new Node("Earpiercindsinf", new Project("rochester", "gay"));

// console.log(project.name);
// console.log(project.data.bio);

// const cas = new Node("cassingtonwoofington", new Musician("rochester"));
// project.data.addMember(project, cas);

// console.log(project.links);

const graph = new Graph();
constructGraph(graph, "all_nodes_sample_1.txt", "bands_sample_1.txt");

setTimeout(() => {
    Array.from(Project.allProjects.values()).forEach( (band) => {
        console.log(band.name);
        band.links.forEach( (link) => {
            console.log(link.getNeighbor(band).name);
        });
        console.log('');
    });
}, 100);