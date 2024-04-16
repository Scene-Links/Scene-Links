import {Data, Node} from "./framework/nodes.js"
import {Project, Musician, Label, Venue} from "./framework/data-custom.js";
import {constructGraph, readShowsIn, readShowsShowsModing} from "./data-reading/interpereter.js";
import { Link, LinkTypes } from "./framework/links.js";

import { findDegree, tallyDegrees, findPath, countNeighbors} from "./processing/processing.js";
import { tallyActiveMembersPerProject, tallyActiveProjectMembershipPerPerson, tallyMinDistances } from "./processing/statistics.js";

import { writeFileSync } from "fs";
import { Graph } from "./framework/Graph.js";

const filePathToWriteTo = "./txt-outs/bandMembership.txt";


function listByProject() {
    let string = "";

    Array.from(Project.allProjects.values()).forEach( (band) => {
        string += band.name;

        // if (band.data.active) {
        //     string += " (active)";
        // } else {
        //     string += " (inactive)";
        // }

        // string += "\n";
        string += "\t" + findDegree(band); //"\t connections: "
        // string += "\n";
        string += "\t" + findDegree(band, (link) => {return (link.type == LinkTypes.Membership && link.presentness == true)}); //"\t active members: "
        // string += "\n";
        string += "\t" + countNeighbors(band); //"\t connected bands:"
        // string += "\n"

        // band.links.forEach( (link) => {
        //     if (link.presentness == null) {
        //         string += link.getNeighbor(band).name + ", " + link.type;
        //     } else if (link.presentness) {
        //         string += link.getNeighbor(band).name + ", " + link.type + " (present)";
        //     } else {
        //         string += link.getNeighbor(band).name + ", " + link.type + " (past)";
        //     }
        //     string += "\n";
        // });


        string += "\n";;
    });

    return string;
}

function listByMember() {
    let string = "";

    Array.from(Musician.allMusicians.values()).forEach( (musician) => {
        string += musician.name;

        // if (band.data.active) {
        //     string += " (active)";
        // } else {
        //     string += " (inactive)";
        // }

        // string += "\n";
        string += "\t" + findDegree(musician); //"\t connections: "
        // string += "\n";
        string += "\t" + findDegree(musician, (link) => {return (link.type == LinkTypes.Membership && link.presentness == true)}); //"\t active members: "
        // string += "\n";
        string += "\t" + countNeighbors(musician); //"\t connected bands:"
        // string += "\n"

        // band.links.forEach( (link) => {
        //     if (link.presentness == null) {
        //         string += link.getNeighbor(band).name + ", " + link.type;
        //     } else if (link.presentness) {
        //         string += link.getNeighbor(band).name + ", " + link.type + " (present)";
        //     } else {
        //         string += link.getNeighbor(band).name + ", " + link.type + " (past)";
        //     }
        //     string += "\n";
        // });


        string += "\n";;
    });

    return string;
}



const graph = new Graph();

constructGraph(graph, "all_nodes.txt", "bands.txt");
// readShowsIn(graph, "shows.txt");
// readShowsShowsModing(graph, "shows.txt");


setTimeout(async () => { //wait for construct graph to finish ig. be patient shes got erectile dysfunction
    graph.checkActivityAll();

    console.log(listByMember());
    console.log(Project.allProjects.size + " projects");
    console.log(Musician.allMusicians.size + " musicians");
    console.log(Link.nextId - 1 + " links");

    writeFileSync(filePathToWriteTo, graph.getPairwiseString(), 'utf-8', (err) => {
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

    console.log("distribution of shortest distances between nodes: "
                + tallyMinDistances(graph));

    console.log("distribution of shortest distances between musicians: "
                + tallyMinDistances(graph, (node) => {return node.data.type == "Musician"}));

    console.log("distribution of shortest distances between projects: "
                + tallyMinDistances(graph, (node) => {return node.data.type == "Project"}));
}, 100);
