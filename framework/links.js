import {Node} from "./nodes.js";
import {Project, Musician, Label, Venue} from "./data-custom.js"

export const LinkTypes = {
    Membership: "member",
    PerformedWith: "performed with",
    PlayedShowTogether: "played show together",
    SignedUnder: "signed under",
    PerformedAt: "performed at",
    FeaturedOnRecording: "featured on"
}

export class Link {
    static nextId = 0;
    constructor(nodeA, nodeB, type, presentness=true) {
        this.id = Link.nextId;
        Link.nextId += 1;

        this.nodeA = nodeA;
        this.nodeB = nodeB;

        this.type = type;

        switch (type) {
            case LinkTypes.Membership: // musician -> project
                if (! (nodeA.data instanceof Musician && nodeB.data instanceof Project)) {
                    throw new Error("meow");
                }


                this.presentness = presentness;
                this.directedness = true;
                break;

            case LinkTypes.PerformedWith: // musician/project -> musician/project
                if (! ((nodeA.data instanceof Musician || nodeA.data instanceof Project) &&
                    nodeB.data instanceof Musician || nodeB.data instanceof Project)) {
                    throw new Error("meow");
                }

                this.directedness = true;
                break;

            case LinkTypes.PlayedShowTogether: // project <-> project (same ticket but diff sets)
                if (! (nodeA.data instanceof Project && nodeB.data instanceof Project)) {
                    throw new Error("meow");
                }

                this.directedness = false;
                break;

            case LinkTypes.FeaturedOnRecording: // musician/project -> project
                if (! ((nodeA.data instanceof Musician || nodeA.data instanceof Project) && nodeB.data instanceof Project)) {
                    throw new Error("meow");
                }

                this.directedness = true;
                break;

            case CollaboratedOnRecording: // musician/project <-> musician/project
                if (! ((nodeA.data instanceof Musician || nodeA.data instanceof Project) &&
                    nodeB.data instanceof Musician || nodeB.data instanceof Project)) {
                    throw new Error("meow");
                }

                this.directedness = false;
                break;
    
            case SignedUnder: // project -> label
                if (! (nodeA.data instanceof Project && nodeB.data instanceof Label)) {
                    throw new Error("meow");
                }
                this.presentness = presentness;

                this.directedness = true;
                break;

            case PerformedAt: // musician/project -> venue
                if (! (nodeA.data instanceof Project && nodeB.data instanceof Venue)) {
                    throw new Error("meow");
                }

                this.directedness = true;
                break;

            default:
                throw new Error("unknown type");
        }
        this.nodeA.addLink(this);
        this.nodeB.addLink(this);
    }
    
    getNeighbor(currentNode) {
        if (currentNode == this.nodeA) {
            return this.nodeB;
        } else if (currentNode == this.nodeB) {
            return this.nodeA;
        } else {
            throw new Error("invalid method call")
        }
    }
}