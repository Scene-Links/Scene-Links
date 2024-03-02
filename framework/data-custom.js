import {Data} from "./nodes.js";
import {Link, LinkTypes} from "./links.js"


export class Project extends Data {
    static allProjects = new Map();

    constructor(location="", bio="", active=true, logo ="", inPlanning = false, hasCompleteInfo=false) {
        super(location, bio, active, hasCompleteInfo);

        this.logo = logo;
        this.inPlanning = inPlanning;

        this.members = 0;
        
        this.type = "Project";
    }

    logThisNode() {
        Project.allProjects.set(
            this.graph.getNodeByID(this.parentID).name,
            this.graph.getNodeByID(this.parentID)
            );
    }

    addMember(parentNode, musician, graph, presentness =true) {
        new Link(musician, parentNode, LinkTypes.Membership, graph, presentness);

        if (presentness) {
            this.members++;
        }
    }

    addPerformer(parentNode, musician, graph, presentness =true) {
        new Link(musician, parentNode, LinkTypes.PerformedWith, graph, presentness);
    }
}

export class Musician extends Data {
    static allMusicians = new Map();

    constructor(location="", bio="", active=true, hasCompleteInfo=false) {
        super(location, bio, active, hasCompleteInfo);
        this.type = "Musician"
    }

    logThisNode() {
        Musician.allMusicians.set(
            this.graph.getNodeByID(this.parentID).name,
            this.graph.getNodeByID(this.parentID)
            );
    }

    addProject(parent, project, graph, presentness=true) {
        new Link(parent, project, LinkTypes.Membership, graph, presentness);
    }
}

export class Label extends Data {
    static allLabels = new Map();

    constructor(location="", bio="",  active=true, hasCompleteInfo=false) {
        super(location, bio, active, hasCompleteInfo);
        this.type = "Label";
    }

    logThisNode() {
        Label.allLabels.set(
            this.graph.getNodeByID(this.parentID).name,
            this.graph.getNodeByID(this.parentID)
            );
    }
}

export class Venue extends Data {
    static allVenues = new Map();

    constructor(location="", bio="", active=true, hasCompleteInfo=false) {
        super(location, bio, active, hasCompleteInfo);
        this.type = "Venue";
    }

    logThisNode() {
        Venue.allVenues.set(
            this.graph.getNodeByID(this.parentID).name,
            this.graph.getNodeByID(this.parentID)
            );
    }
}