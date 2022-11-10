import { hooks } from "../helper/hooks";
import { postAjax } from "../helper/send_request";
import { DataCache } from "../map/data_cache";
import { PortalInfoDetailed } from "./portal_info";


/**
 * code to retrieve the portal detail data from the servers
 */
export class PortalDetails {
    private cache: DataCache<PortalInfoDetailed>;
    private requestQueue: Map<PortalGUID, Promise<PortalInfoDetailed>>;

    constructor() {
        this.cache = new DataCache();
        this.cache.startExpireInterval(20);

        this.requestQueue = new Map();
    }

    get(guid: PortalGUID): PortalInfoDetailed | undefined {
        return this.cache.get(guid);
    }


    isFresh(guid: PortalGUID): boolean {
        return this.cache.isFresh(guid);
    }


    request(guid: PortalGUID): Promise<PortalInfoDetailed> {
        if (!this.requestQueue.has(guid)) {

            this.requestQueue.set(guid, this.doRequest(guid));
        }

        return this.requestQueue.get(guid);
    }


    private doRequest(guid: PortalGUID): Promise<PortalInfoDetailed> {
        const promise = new Promise<PortalInfoDetailed>((resolve, reject) => {
            postAjax("getPortalDetails", { guid },
                data => {

                    if (data && data.error === "RETRY") return this.request(guid);
                    if (!data || data.error || !data.result) return reject();

                    const portal = new PortalInfoDetailed(data.result as IITC.EntityPortalDetailed);
                    this.cache.store(guid, portal);

                    // TODO: move to hook handler
                    if (guid === selectedPortal) {
                        renderPortalDetails(guid);
                    }

                    // NOTE: we dropped "details"
                    const oldEntData = [guid, portal.timestamp2, data.result];
                    hooks.trigger("portalDetailLoaded", { guid, success: true, portal: oldEntData });
                    resolve(portal);
                },
                () => {
                    hooks.trigger("portalDetailLoaded", { guid, success: false });
                    reject();
                }
            );
        })

        return promise;
    }
}

export const portalDetail = new PortalDetails();