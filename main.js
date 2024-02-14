import {Data, Node} from "./framework/nodes.js"
import {Project, Musician, Label, Venue} from "./framework/data-custom.js";
import {constructGraph} from "./data-reading/interpereter.js";
import { Link, LinkTypes } from "./framework/links.js";


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
constructGraph(graph, "all_nodes.txt", "bands.txt");

setTimeout(() => {
    console.log(listByProject());
    console.log(Project.allProjects.size + " projects");
    console.log(Musician.allMusicians.size + " musicians");
    console.log(Link.nextId - 1 + " links");
}, 500);