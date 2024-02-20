export class Node {
    static nextID = 0;
    constructor(name, data = new Data()) {
        this.id = Node.nextID;
        Node.nextID++;

        this.name = name;
        this.data = data;
        this.links = [];
        
        this.graph;

        data.parentID = this.id;
        // data.logThisNode(); //call this in graph
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
    constructor(location="", bio="", hasCompleteInfo=false) {
        this.location = location;
        this.bio = bio;
        this.hasCompleteInfo = hasCompleteInfo;

        this.graph;
        this.parentID;
    }

    setGraph(graph) {
        this.graph = graph;
    }
}



// export class Node {
//     static nextID = 0;
//     constructor(name, hasCompleteInfo=false, location="", bio="") {
//         this.id = Node.nextID;
//         Node.nextID++;
//         this.name = name;
//         this.hasCompleteInfo = hasCompleteInfo;
//         this.location = location;
//         this.bio = bio;
//         this.links = [];
//     }

//     addLink(link) {
//         this.links.push(link);
//     }

//     setComplete(status=true) {
//         this.hasCompleteInfo = status;
//     }
// }

// export class Project extends Node {
//     constructor(name, activity=ActivityStatuses.Active, hasCompleteInfo=false, location="", bio="") {
//         super(name, hasCompleteInfo, location, bio);
//         this.activity = activity;
//         this.members = 0;
//         this.inPlanning = false;
//     }

//     addMember(member, presentness = true) {
//         new Link(member, this, LinkTypes.Membership, presentness);
//         this.members++;
//     }
// }

// export class Musician extends Node {
//     constructor(name, hasCompleteInfo=false, location="", bio="") {
//         super(name, hasCompleteInfo, location, bio);
//     }

//     addProject(project, presentness=true) {
//         new Link(this, project, LinkTypes.Membership, presentness);
//     }
// }

// export class Label extends Node {
//     constructor(name, activity=ActivityStatuses.Active, hasCompleteInfo=false, location="", bio="") {
//         super(name, hasCompleteInfo, location, bio);
//         this.activity = activity;
//     }
// }

// export class Venue extends Node {
//     constructor(name, activity=ActivityStatuses.Active, hasCompleteInfo=false, location="", bio="") {
//         super(name, hasCompleteInfo, location, bio);
//         this.activity = activity;
//     }
// }