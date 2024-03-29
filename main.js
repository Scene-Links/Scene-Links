import {Data, Node} from "./framework/nodes.js"
import {Project, Musician, Label, Venue} from "./framework/data-custom.js";
import {constructGraph} from "./data-reading/interpereter.js";
import { Link, LinkTypes } from "./framework/links.js";

import { findDegree, tallyDegrees, findPath, countNeighbors} from "./processing/processing.js";
import { tallyActiveMembersPerProject, tallyActiveProjectMembershipPerPerson, tallyMinDistances } from "./processing/statistics.js";

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

    checkActivityAll() {
        this.nodes.forEach( (node) => {
            node.data.checkActivity();
        });
    }
}

function listByProject() {
    let string = "";

    Array.from(Project.allProjects.values()).forEach( (band) => {
        string += band.name;

        if (band.data.active) {
            string += " (active)";
        } else {
            string += " (inactive)";
        }

        string += "\n";
        string += "\t connections: " + findDegree(band);
        string += "\n";
        string += "\t active members: " + findDegree(band, (link) => {return (link.type == LinkTypes.Membership && link.presentness == true)});
        string += "\n";
        string += "\t connected bands: " + countNeighbors(band);
        string += "\n"

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

setTimeout(async () => { //wait for construct graph to finish ig. be patient shes got erectile dysfunction
    graph.checkActivityAll();

    // console.log(listByProject());
    console.log(Project.allProjects.size + " projects");
    console.log(Musician.allMusicians.size + " musicians");
    console.log(Link.nextId - 1 + " links");

    writeFileSync('./graph-json/graph.json', graph.getString(), 'utf-8', (err) => {
            if (err) throw err;
        }
    );
    console.log('Data added to file');

    console.log("distribution of connections per musician: " +
                tallyDegrees(graph, (node) => {return node.data instanceof Musician}));

    console.log("distribution of connections per project: " +
                tallyDegrees(graph, (node) => {return node.data instanceof Project}));
                
    console.log("distribution of members in a band: " +
                tallyActiveMembersPerProject(graph, (node) => {return node.data.active}));

    console.log("distribution of active band memberships per musician: " +
                tallyActiveProjectMembershipPerPerson(graph));

    // let string = ""
    // findPath(graph.getNodeByID(57), graph.getNodeByID(57)).forEach((node) => string += node.name + ", ")
    // console.log(string);

    console.log(countNeighbors(graph.getNodeByID(1)));

    console.log("distribution of shortest distances between nodes: "
                + tallyMinDistances(graph));

    console.log("distribution of shortest distances between musicians: "
                + tallyMinDistances(graph, (node) => {return node.data.type == "Musician"}));

    console.log("distribution of shortest distances between projects: "
                + tallyMinDistances(graph, (node) => {return node.data.type == "Project"}));
}, 100);