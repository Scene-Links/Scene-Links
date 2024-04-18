import { Link } from "./links.js";
import { Node, Data} from "./nodes.js";

const GRAPH_NAME = "__graph__";

export class Graph {
    constructor() {
        this.nodes = [];
        this.namesToNodes = new Map(); //only a little redundant :>
    }

    addNode(node) {
        node.setGraph(this);
        this.nodes.push(node);
        this.namesToNodes.set(node.name, node);

        node.data.logThisNode();
    }

    /**
     * if a node w/ given name is in graph, return it.
     * otherwise create new node and return it
     * @param {string} name
     * @param {type} type
     */
    getOrAddNode(name, type=null) {
        if(!this.namesToNodes.has(name) || name == "-") {
            const node = new Node(name, new type());
            this.addNode(node);

            return node
        }

        return this.namesToNodes.get(name);
    }

    getNodeByID(ID) {
        if (ID < this.nodes.length && this.nodes[ID].id == ID) { //assuming no fucky stuff
            return this.nodes[ID];
        } else {
            this.nodes.forEach( (graphNode) => { //fucky stuff has ensued
                if (graphNode.id == ID) {
                    return graphNode;
                }
            });
        }
    }

    getString() {
        return JSON.stringify(this, (key, value) => {
            if (key == "") { //looking at the graph as a whole
                return value;
            } else {
                if (value == this) {
                    return GRAPH_NAME;
                } else {
                    return value;
                }
            }
        });
    }

    getPairwiseString() {
        let string = ""
        Link.allLinks.forEach((link) => {
            if (true) {
                string += link.nodeAID + "_" + this.getNodeByID(link.nodeAID).name.replaceAll(" ", "_");
                string += "\t";
                string += this.getNodeByID(link.nodeAID).data.type;
                string += "\t"
                string += link.nodeBID + "_" + this.getNodeByID(link.nodeBID).name.replaceAll(" ","_");
                string += "\t";
                string += this.getNodeByID(link.nodeBID).data.type;
                string += "\t"
                string += link.weight;
                string += "\n";
            }
        })
        return string
    }

    checkActivityAll() {
        this.nodes.forEach((node) => {
            node.data.checkActivity();
        });
    }
}
