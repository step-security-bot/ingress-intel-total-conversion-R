/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable unicorn/switch-case-braces */
/* eslint-disable max-classes-per-file */
import { FACTION } from "../constants";


export class PortalInfoBase {

    // readonly guid: PortalGUID;
    // readonly timestamp: number;
    readonly team: FACTION;
    readonly latE6: number;
    readonly lngE6: number;

    constructor(data: IITC.EntityPortalBasic) {
        this.team = this.teamStr2Faction(data[1]);
        this.latE6 = data[2];
        this.lngE6 = data[3];
    }


    private teamStr2Faction(team: IITC.EntityTeam): FACTION {
        switch (team) {
            case "R": return FACTION.RES;
            case "E": return FACTION.ENL;
            default:
            case "N": return FACTION.none;
        }
    }
}


export class PortalInfo extends PortalInfoBase {

    readonly level: number;
    readonly health: number;
    readonly resCount: number;
    readonly image: string;
    readonly title: string;
    readonly ornaments: [];
    readonly mission: boolean;
    readonly mission50plus: boolean;
    readonly artifactBrief: null | [];
    readonly timestamp2: number;

    constructor(data: IITC.EntityPortalOverview) {
        super(data as unknown as IITC.EntityPortalBasic);

        this.level = data[4];
        this.health = data[5];
        this.resCount = data[6];
        this.image = data[7];
        this.title = data[8];
        this.ornaments = data[9];
        this.mission = data[10];
        this.mission50plus = data[11];
        this.artifactBrief = data[12];
        this.timestamp2 = data[13];
    }
}


export class PortalMOD {

    public owner: string;
    public type: string;
    public qualitiy: string;
    public stats: { [index: string]: number };

    constructor(data: IITC.EntityPortalMod) {
        this.owner = data[0];
        this.type = data[1];
        this.qualitiy = data[2];
        this.stats = data[3];
    }
}


export class PortalMODNone extends PortalMOD {
    constructor() {
        super(["", "", "", {}])
    }
}
export const NoPortalMod = new PortalMODNone();


export class PortalRESO {
    public owner: string;
    public level: number;
    public energy: number;

    constructor(data: IITC.EntityPortalReso) {
        this.owner = data[0];
        this.level = data[1];
        this.energy = data[2];
    }
}
