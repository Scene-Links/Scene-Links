import {Data, Node} from "./framework/nodes.js"
import {Project, Musician, Label, Venue} from "./framework/data-custom.js";
import {constructGraph} from "./data-reading/interpereter.js";
import { Link, LinkTypes } from "./framework/links.js";
import { writeFileSync } from "fs";

const GRAPH_NAME = "__graph__";


export class Graph {
    constructor() {
        this.nodes = [];
    }

    addNode(node) {
        node.setGraph(this);
        this.nodes.push(node);

        node.data.logThisNode();
    }

    getNodeByID(ID) {
        if (this.nodes[ID].id == ID) { //assuming no fucky stuff
            return this.nodes[ID]
        } else {
            for (graphNode in this.nodes) { //fucky stuff has ensued
                if (graphNode.id == ID) {
                    return graphNode;
                }
            }
        }
    }

    getString() {
        return JSON.stringify(graph, (key, value) => {
            if (key == "") { //looking at the graph as a whole
                return value;
            } else {
                if (value == graph) {
                    return GRAPH_NAME;
                } else {
                    return value;
                }
            }
        });
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



export const graph = new Graph();
constructGraph(graph, "all_nodes.txt", "bands.txt");

setTimeout(async () => {
    console.log(Project.allProjects.size + " projects");
    console.log(Musician.allMusicians.size + " musicians");
    console.log(Link.nextId - 1 + " links");

    writeFileSync('./graph-json/graph.json', graph.getString(), 'utf-8', (err) => {
            if (err) throw err;
            console.log('Data added to file');
      }
    );
    
    fetch("./graph-json/graph.json")
    .then(response => {
       return response.json();
    })
    .then(data => console.log(data));
}, 100);