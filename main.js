import {Data, Node} from "./framework/nodes.js"
import {Project, Musician, Label, Venue} from "./framework/data-custom.js";
import {constructGraph} from "./data-processing/interpereter.js";
import { LinkTypes } from "./framework/links.js";


class Graph {
    constructor() {
        this.nodes = [];
    }

    addNode(node) {
        this.nodes.push(node);
    }
}

function listByProject() {
    let string = "";
    Array.from(Project.allProjects.values()).forEach( (band) => {
        string += band.name;
        string += "\n";

        band.links.forEach( (link) => {
            if (link.presentness == null) {
                string += link.getNeighbor(band).name + ", " + link.type;
            } else if (link.presentness) {
                string += link.getNeighbor(band).name + ", " + link.type + " (present)";
            } else {
                string += link.getNeighbor(band).name + ", " + link.type + " (past)";
            }
            string += "\n";
        });

        string += "\n";;
    });

    return string;
}


// const project = new Node("Earpiercindsinf", new Project("rochester", "gay"));

// console.log(project.name);
// console.log(project.data.bio);

// const cas = new Node("cassingtonwoofington", new Musician("rochester"));
// project.data.addMember(project, cas);

// console.log(project.links);

const graph = new Graph();
constructGraph(graph, "all_nodes_sample_1.txt", "bands_sample_1.txt");

setTimeout(() => console.log(listByProject()), 100);