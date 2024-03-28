import { Link, LinkTypes} from "../framework/links.js";
import { Musician, Project, Venue, Label } from "../framework/data-custom.js";

import {findDegree, tallyDegrees, findPath, countNeighbors} from "./processing.js";

export function tallyActiveProjectMembershipPerPerson (graph) {
    return tallyDegrees(graph,
        (node) => {return node.data instanceof Musician},
        (link) => {return link.type == LinkTypes.Membership && link.presentness == true}
        );
}

//who cares!!!!!!!!!!
// export function tallyAllProjectMembershipPerPerson(graph) {
//     return tallyDegrees(graph,
//         (node) => {return node.data instanceof Musician},
//         (link) => {return link.type == LinkTypes.Membership}
//         );
// }

export function tallyActiveMembersPerProject (graph, nodeValidator = () => {return true}, connectionValidator = () => {return true}) {
    return tallyDegrees(graph,
        (node) => {return (node.data instanceof Project) && nodeValidator(node)},
        (link) => {return (link.type == LinkTypes.Membership && link.presentness == true) && connectionValidator(link)}
        );
}

// distance– returns -1 if not connected
export function distance(startNode, endNode, connectionValidator = () => {return true}) {
    return findPath(startNode, endNode, connectionValidator).length - 1;
}

export function tallyMinDistances(graph, nodeValidator = () => {return true}, connectionValidator = () => {return true}) {
    const tallies = [];

    graph.nodes.forEach((node1) => {
        
        if (nodeValidator(node1)) {
            graph.nodes.forEach((node2) => {
                if (nodeValidator(node2)) {

                    const dist = distance(node1, node2, connectionValidator);
    
                    if (dist > 0) {
                        //put into tally
                        if (typeof tallies[dist] == "number") {
                            tallies[dist] = tallies[dist] + 1;
                        } else {
                            tallies[dist] = 1;
                        }
                    }
                }
            });
        }
    });

    //fill in gaps
    for (let i = 0; i < tallies.length; i++) {
        if (tallies[i] == undefined) {
            tallies[i] = 0;
        }
    }

    return tallies;
}