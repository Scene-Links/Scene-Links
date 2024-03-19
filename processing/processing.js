import { Musician, Project, Venue, Label } from "../framework/data-custom.js";
import { Link, LinkTypes} from "../framework/links.js";
import { Data, Node} from "../framework/nodes.js";

//bread first search mmmmmmmmmm yummy
function findDistance(startNode, endNode, connectionValidator= () => {return true}) {
    const queue = [];
    const nodeMap = new Map();

    nodeMap.set(startNode, null);

    while (queue.length > 0) {

    }
}

export function findDegree(node, connectionValidator= () => {return true}) {
    let degree = 0;

    node.links.forEach( (link) => {
        if (connectionValidator(link)) {
            degree += 1;
        }
    });

    // console.log(degree);
    // console.log(node.name);
    return degree;
}

export function tallyDegrees(graph, nodeValidator= () => {return true}, connectionValidator= () => {return true}) {
    const tallies = [];

    graph.nodes.forEach( (node) => {
        if (nodeValidator(node)) {
            const nodeDegree = findDegree(node, connectionValidator);

            //put into tally
            if (typeof tallies[nodeDegree] == "number") {
                tallies[nodeDegree] = tallies[nodeDegree] + 1;
            } else {
                tallies[nodeDegree] = 1;
            }
        }
    })
    
    //fill in gaps
    for (let i = 0; i < tallies.length; i++) {
        if (tallies[i] == undefined) {
            tallies[i] = 0;
        }
    }

    return tallies;
}