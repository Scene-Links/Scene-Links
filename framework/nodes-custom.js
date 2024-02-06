import {Data} from "./nodes.js";
import {Link, LinkTypes} from "./links.js"

export const ActivityStatuses = {
    Active: Symbol("active"),
    Inactive: Symbol("inactive"),
    InPlanning: Symbol("InPlanning"),
}

export class Project extends Data {
    constructor(location="", bio="", activity=ActivityStatuses.Active, logo ="", inPlanning = false, hasCompleteInfo=false) {
        super(location, bio, hasCompleteInfo);

        this.activity = activity;
        this.logo = logo;
        this.inPlanning = inPlanning;

        this.members = 0;
    }

    addMember(parentNode, musician, presentness =true) {
        new Link(musician, parentNode, LinkTypes.Membership, presentness);
        this.members++;
    }

    addPerformer(parentNode, musician, presentness =true) {
        new Link(musician, parentNode, LinkTypes.Membership, presentness);
    }
}

export class Musician extends Data {
    constructor(location="", bio="", hasCompleteInfo=false) {
        super(location, bio, hasCompleteInfo);
    }

    addProject(project, presentness=true) {
        new Link(this, project, LinkTypes.Membership, presentness);
    }
}

export class Label extends Data {
    constructor(location="", bio="", hasCompleteInfo=false, activity=ActivityStatuses.Active) {
        super(location, bio, hasCompleteInfo);
        this.activity = activity;
    }
}

export class Venue extends Data {
    constructor(location="", bio="", activity=ActivityStatuses.Active, hasCompleteInfo=false) {
        super(location, bio, hasCompleteInfo);
        this.activity = activity;
    }
}