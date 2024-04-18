import { readFile } from "fs";
import { Musician, Project, Venue, Label, Show } from "../framework/data-custom.js";
import { Link, LinkTypes} from "../framework/links.js";
import {Data, Node} from "../framework/nodes.js"
import {Graph} from "../framework/Graph.js";

export function constructGraph(graph, allNodesFileName, bandsFileName) { //, labelsFileName, venuesFileName
    readAllNodesIn(graph, allNodesFileName);
    
    setTimeout(() => {readAllBandsIn(graph, bandsFileName, allNodesFileName)}, 50);
}

export function readAllNodesIn(graph, allNodesFileName) {
    const allNodesFile = readFile("./data/" + allNodesFileName, "utf-8", (err, data) => {
        const sections = data.trim().split("\n\n"); //split between double line breaks

        if (sections[0] != null) { // first section: musicians
            sections[0].split('\n').forEach((name) => {
                if (Musician.allMusicians.get(name.trim()) != null) {
                    throw new Error("duplicate musician in " + allNodesFileName + ": " + name);
                }

                graph.addNode(new Node(name.trim(), new Musician()));
            });
        }

        if (sections[1] != null) { //second section: projects (bands)
            sections[1].split('\n').forEach((name) => {
                if (Project.allProjects.get(name.trim()) != null) {
                    throw new Error("duplicate project in " + allNodesFileName + ": " + name);
                }

                graph.addNode(new Node(name.trim(), new Project()));
            });
        }

        if (sections[2] != null) { //third section: labels
            sections[2].split('\n').forEach((name) => {
                if (Label.allLabels.get(name.trim()) != null) {
                    throw new Error("duplicate label in " + allNodesFileName + ": " + name);
                }

                graph.addNode(new Node(name.trim(), new Label()));
            });
        }

        if (sections[3] != null) { //fourth sections: venues
            sections[3].split('\n').forEach((name) => {
                if (Venue.allVenues.get(name.trim()) != null) {
                    throw new Error("duplicate venue in " + allNodesFileName + ": " + name);
                }

                graph.addNode(new Node(name.trim(), new Venue()));
            });
        }
    });
}

export function readAllBandsIn(graph, bandsFileName, allNodesFileName) {
    const bandsFile = readFile("./data/" + bandsFileName, "utf-8", (err, data) => {
        const bands = data.trim().split("+\n").slice(1);

        bands.forEach((band) => {
            const fields = band.trim().split('\n');
            if (!Project.allProjects.has(fields[0])) {
                console.log(band);
                throw new Error("project '" + fields[0] + "' not in " + allNodesFileName);
            }

            const bandNode = Project.allProjects.get(fields[0].trim());

            if (fields[1] != null) {
                fields[1].split(',').forEach((personName) => {
                    if (!Musician.allMusicians.has(personName.trim())) { //if not in database
                        if (personName != "-") { //if spot left empty
                            console.log(band);
                            throw new Error("name '" + personName.trim() + "' not in " + allNodesFileName);
                        };
                    } else {
                        bandNode.data.addMember(bandNode, Musician.allMusicians.get(personName.trim()), graph, true);
                    }
                });
            }

            if (fields[2] != null) {
                fields[2].split(',').forEach((personName) => {
                    if (!Musician.allMusicians.has(personName.trim())) {
                        if (personName != "-") {
                            console.log(band);
                            throw new Error("name '" + personName.trim() + "' not in " + allNodesFileName);
                        }
                    } else {
                        bandNode.data.addMember(bandNode, Musician.allMusicians.get(personName.trim()), graph, false);
                    }
                });
            }

            if (fields[3] != null) {
                fields[3].split(',').forEach((personName) => {
                    if (!Musician.allMusicians.has(personName.trim())) {
                        if (personName != "-") {
                            throw new Error("name '" + personName.trim() + "' not in " + allNodesFileName);
                        }
                    } else {
                        bandNode.data.checkActivity();
                        bandNode.data.addPerformer(bandNode, Musician.allMusicians.get(personName.trim()), graph, bandNode.data.activity);
                    }
                });
            }

            if (fields[4] != null && fields[4] != "-") {
                bandNode.data.imagePath = fields[4].trim();
            }

            // graph.addNode(bandNode);
        });
    });
}

export function readShowsIn(graph, showsFileName) { //currently only looks at bands and draws links btwn them, no show nodes or anything
    const showsFile = readFile("./data/" + showsFileName, "utf-8", (err, data) => {
        const shows = data.split("\n\n");

        shows.forEach((show) => {
            const bands = show.split("\n")[3].split(",");

            //for every pair of bands
            for (let i=0; i < bands.length - 1; i++) {
                const node1 = graph.getOrAddNode(bands[i].trim(), Project);
                for (let j = i+1; j < bands.length; j++) {
                    const node2 = graph.getOrAddNode(bands[j].trim(), Project);
                    
                    //if link already exists, increase weight, o.w. create new link.
                    if (node1.neighboringNodesToLinks.has(node2)) {
                        node1.neighboringNodesToLinks.get(node2).weight += 1;
                    } else {
                        new Link(node1, node2, LinkTypes.PlayedShowTogether);
                        console.log(node1.name, node2.name);
                    }
                }
            }
        });
    });
}

export function readShowsShowsModing(graph, showsFileName) {
    const showsFile = readFile("./data/" + showsFileName, "utf-8", (err, data) => {
        const shows = data.split("\n\n");

        shows.forEach((show) => {
            const fields = show.split("\n");

            const showNode = new Node(fields[0], new Show(fields[2]));
            graph.addNode(showNode);
            console.log(fields[0], fields[1])
            showNode.data.addVenue(showNode, graph.getOrAddNode(fields[1].trim(), Venue));

            const bands = fields[3].split(",");

            bands.forEach( (bandName) => {
                const bandNode = graph.getOrAddNode(bandName.trim(), Project);
                bandNode.data.addShow(bandNode, showNode, graph);
            })
        });
    });
}