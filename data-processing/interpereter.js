import { readFile } from "fs";
import { Musician, Project, Venue, Label } from "../framework/data-custom.js";
import { Link, LinkTypes} from "../framework/links.js";
import {Data, Node} from "../framework/nodes.js"

export function constructGraph(graph, allNodesFileName, bandsFileName) { //, labelsFileName, venuesFileName
    const allNodesFile = readFile("./data/" + allNodesFileName, "utf-8", (err, data) => {
        const sections = data.trim().split("\n\n");

        if (sections[0] != null) {
            sections[0].split('\n').forEach((name) => {
                graph.addNode(new Node(name, new Musician()));
            });
        }
        
        if (sections[1] != null) {
            sections[1].split('\n').forEach( (name) =>{
                graph.addNode(new Node(name, new Project()));
            });
        }

        if (sections[2] != null) {
            sections[2].split('\n').forEach( (name) =>{
                graph.addNode(new Node(name, new Label()));
            });
        }

        if (sections[3] != null) {
            sections[3].split('\n').forEach( (name) =>{
                graph.addNode(new Node(name, new Venue()));
            });
        }
    });

    
    const bandsFile = readFile("./data/" + bandsFileName, "utf-8", (err, data) => {
        const bands = data.trim().split("\n\n");
        bands.forEach( (band) => {
            const fields = band.split('\n');
            const bandNode = Project.allProjects.get(fields[0]);
            
            if (fields[1] != null) {
                fields[1].split(',').forEach((personName) => {
                    bandNode.data.addMember(bandNode, Musician.allMusicians.get(personName.trim()), true);
                });
            }
            if (fields[2] != null) {
                fields[2].split(',').forEach((personName) => {
                    bandNode.data.addMember(bandNode, Musician.allMusicians.get(personName.trim()), false);
                });
            }
            if (fields[3] != null) {
                fields[3].split(',').forEach((personName) => {
                    bandNode.data.addPerformer(bandNode, Musician.allMusicians.get(personName.trim()), true);
                });
            }
            
            graph.addNode()
        });
    });
}