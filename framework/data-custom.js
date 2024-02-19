import {Data} from "./nodes.js";
import {Link, LinkTypes} from "./links.js"


export class Project extends Data {
    static allProjects = new Map();

    constructor(location="", bio="", active=true, logo ="", inPlanning = false, hasCompleteInfo=false) {
        super(location, bio, hasCompleteInfo);

        this.active = active;
        this.logo = logo;
        this.inPlanning = inPlanning;

        this.members = 0;
    }

    logThisNode() {
        Project.allProjects.set(this.parent.name, this.parent);
    }

    addMember(parentNode, musician, graph, presentness =true) {
        new Link(musician, parentNode, LinkTypes.Membership, graph, presentness);
        this.members++;
    }

    addPerformer(parentNode, musician, graph, presentness =true) {
        new Link(musician, parentNode, LinkTypes.PerformedWith, graph, presentness);
    }
}

export class Musician extends Data {
    static allMusicians = new Map();

    constructor(location="", bio="", hasCompleteInfo=false) {
        super(location, bio, hasCompleteInfo);
    }

    logThisNode() {
        Musician.allMusicians.set(this.parent.name, this.parent);
    }

    addProject(parent, project, graph, presentness=true) {
        new Link(parent, project, LinkTypes.Membership, graph, presentness);
    }
}

export class Label extends Data {
    static allLabels = new Map();

    constructor(location="", bio="", hasCompleteInfo=false, active=true) {
        super(location, bio, hasCompleteInfo);
        this.active = active;
    }

    logThisNode() {
        Label.allLabels.set(this.parent.name, this.parent);
    }
}

export class Venue extends Data {
    static allVenues = new Map();

    constructor(location="", bio="", active =true, hasCompleteInfo=false) {
        super(location, bio, hasCompleteInfo);
        this.active = active;
    }

    logThisNode() {
        Venue.allVenues.set(this.parent.name, this.parent);
    }
}