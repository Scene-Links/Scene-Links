export class Node {
    static nextID = 0;
    constructor(name, data = new Data()) {
        this.id = Node.nextID;
        Node.nextID++;

        this.name = name;
        this.data = data;
        this.links = [];
        this.neighboringNodesToLinks = new Map(); //this is only slightly redundant <3333

        this.type = data.type;
        this.graph;

        data.parentID = this.id;
    }

    setGraph(graph) {
        this.graph = graph;
        this.data.setGraph(graph);
    }

    addLink(link) {
        this.links.push(link);
    }

    setComplete(status=true) {
        this.hasCompleteInfo = status;
    }

    equals(other) {
        if (!other instanceof Node) {
            return false;
        } else {
            return (this.id == other.id);
        }
    }
}

export class Data {
    constructor(location="", bio="", active=true, hasCompleteInfo=false, imagePath="", hyperLinks=[]) {
        this.location = location;
        this.bio = bio;
        this.active = active;
        this.hasCompleteInfo = hasCompleteInfo;
        this.imagePath = imagePath;
        this.hyperLinks = hyperLinks;

        this.graph;
        this.parentID;
    }

    setGraph(graph) {
        this.graph = graph;
    }

    checkActivity() {
        this.active = false; //guilty til proven innocent

        const parent = this.graph.getNodeByID(this.parentID);

        parent.links.forEach((link) => {
            if (link.presentness) {
                this.active = true;
                // return;
            }
        });
    }
}