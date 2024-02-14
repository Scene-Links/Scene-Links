import { readFile } from "fs";
import { Musician, Project, Venue, Label } from "../framework/data-custom.js";
import { Link, LinkTypes} from "../framework/links.js";
import {Data, Node} from "../framework/nodes.js"

export function constructGraph(graph, allNodesFileName, bandsFileName) { //, labelsFileName, venuesFileName
    const allNodesFile = readFile("./data/" + allNodesFileName, "utf-8", (err, data) => {
        const sections = data.trim().split("\n\n"); //split between double line breaks

        if (sections[0] != null) {  // first section: musicians
            sections[0].split('\n').forEach((name) => {
                if (Musician.allMusicians.get(name.trim()) != null) {
                    throw new Error ("duplicate musician in " + allNodesFileName + ": " + name);
                }

                graph.addNode(new Node(name.trim(), new Musician()));
            });
        }
        
        if (sections[1] != null) { //second section: projects (bands)
            sections[1].split('\n').forEach( (name) =>{
                if (Project.allProjects.get(name.trim()) != null) {
                    throw new Error ("duplicate project in " + allNodesFileName + ": " + name);
                }

                graph.addNode(new Node(name.trim(), new Project()));
            });
        }

        if (sections[2] != null) { //third section: labels
            sections[2].split('\n').forEach( (name) =>{
                if (Label.allLabels.get(name.trim()) != null) {
                    throw new Error ("duplicate label in " + allNodesFileName + ": " + name);
                }

                graph.addNode(new Node(name.trim(), new Label()));
            });
        }

        if (sections[3] != null) { //fourth sections: venues
            sections[3].split('\n').forEach( (name) =>{
                if (Venue.allVenues.get(name.trim()) != null) {
                    throw new Error ("duplicate venue in " + allNodesFileName + ": " + name);
                }

                graph.addNode(new Node(name.trim(), new Venue()));
            });
        }
    });

    
    const bandsFile = readFile("./data/" + bandsFileName, "utf-8", (err, data) => {
        const bands = data.trim().split("\n\n");
        bands.forEach( (band) => {
            const fields = band.split('\n');
            if (!Project.allProjects.has(fields[0])) {
                console.log(band);
                throw new Error("project '" + fields[0] + "' not in " + allNodesFileName);
            }

            const bandNode = Project.allProjects.get(fields[0].trim());
            
            if (fields[1] != null) {
                fields[1].split(',').forEach((personName) => {
                    if (!Musician.allMusicians.has(personName.trim())) {
                        if (personName != "-") {
                            console.log(band);
                            throw new Error("name '" + personName.trim() + "' not in " + allNodesFileName);
                        }
                    } else {
                        bandNode.data.addMember(bandNode, Musician.allMusicians.get(personName.trim()), true);
                    }
                });
            }

            if (fields[2] != null) {
                fields[2].split(',').forEach((personName) => {
                    if (!Musician.allMusicians.has(personName.trim())) {
                        if(personName != "-") {
                            console.log(band);
                            throw new Error("name '" + personName.trim() + "' not in " + allNodesFileName);
                        }
                    } else {
                        bandNode.data.addMember(bandNode, Musician.allMusicians.get(personName.trim()), false);
                    }
                });
            }
            
            if (fields[3] != null) {
                fields[3].split(',').forEach((personName) => {
                    if (!Musician.allMusicians.has(personName.trim())) {
                        throw new Error("name '" + personName.trim() + "' not in " + allNodesFileName);
                    }

                    bandNode.data.addPerformer(bandNode, Musician.allMusicians.get(personName.trim()), true);
                });
            }
            
            graph.addNode()
        });
    });
}