import Data from "./nodes.js";

const ActivityStatuses = {
    Active: Symbol("active"),
    Inactive: Symbol("inactive"),
    InPlanning: Symbol("InPlanning"),
}

export class Project extends Data {
    constructor(location, bio, activity=ActivityStatuses.Active, logo ="", hasCompleteInfo=false) {
        super(location, bio, this.hasCompleteInfo)
        this.activity = activity;
        this.members = 0;
        this.inPlanning = false;
        this.logo = logo;
    }

    addMember(musician, presentness =true) {
        new Link(musician, this, LinkTypes.Membership, presentness);
        this.members++;
    }

    addPerformer(musician, presentness =true) {
        new Link(musician, this, LinkTypes.Membership, presentness);
    }
}

export class Musician extends Data {
    constructor(hasCompleteInfo=false, location="", bio="") {
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