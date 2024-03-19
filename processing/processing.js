import { Musician, Project, Venue, Label } from "../framework/data-custom.js";
import { Link, LinkTypes} from "../framework/links.js";
import { Data, Node} from "../framework/nodes.js";

//bread first search mmmmmmmmmm yummy
function findDistance(startNode, endNode, validconnections=["member"]) {
    const queue = [];
    const nodeMap = new Map();

    nodeMap.set(startNode, null);

    while (queue.length > 0) {

    }
}

export function findDegree(node, validconnections=["member"]) {
    let degree = 0;

    node.links.forEach( (link) => {
        if (validconnections.includes(link.type)) {
            degree += 1;
        }
    });

    return degree;
}

export function tallyDegrees(graph, nodeTypes=[Musician, Project, Label, Venue], validconnections=["member"]) {
    const barGraph = new Map();

    graph.nodes.forEach( (node) => {
        //check is node is right type
        nodeTypes.forEach( (type) => {
            if (node.data instanceof type) {
                const nodeDegree = findDegree(node, validconnections);

                if (barGraph.has(nodeDegree)) {
                    barGraph.set(nodeDegree, barGraph.get(nodeDegree) + 1);
                } else {
                    barGraph.set(nodeDegree, 1);
                }
            }
        });
    })

    return barGraph;
}