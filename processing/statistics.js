import { Link, LinkTypes} from "../framework/links.js";
import { Musician, Project, Venue, Label } from "../framework/data-custom.js";

import {findDegree, tallyDegrees, findPath} from "./processing.js";

export function tallyActiveProjectMembershipPerPerson (graph) {
    return tallyDegrees(graph,
        (node) => {return node.data instanceof Musician},
        (link) => {return link.type == LinkTypes.Membership && link.presentness == true}
        );
}

//who cares!!!!!!!!!!
// export function tallyAllProjectMembershipPerPerson(graph) {
//     return tallyDegrees(graph,
//         (node) => {return node.data instanceof Musician},
//         (link) => {return link.type == LinkTypes.Membership}
//         );
// }

export function tallyActiveMembersPerProject (graph) {
    return tallyDegrees(graph,
        (node) => {return node.data instanceof Project},
        (link) => {return link.type == LinkTypes.Membership && link.presentness == true}
        );
}