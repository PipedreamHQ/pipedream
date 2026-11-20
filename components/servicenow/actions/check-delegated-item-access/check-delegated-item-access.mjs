import { ConfigurationError } from "@pipedream/platform";
import servicenow from "../../servicenow.app.mjs";

const MAX_ITEMS = 50;
const CONCURRENCY = 5;
const SYS_ID = /^[0-9a-f]{32}$/;

export default {
  key: "servicenow-check-delegated-item-access",
  name: "Check Delegated Item Access",
  description: "Check whether the connected user may request each catalog item for another person, as the Service Portal checks it before an order on someone's behalf. **Order Catalog Item**, **Add Item to Cart**, **Checkout Cart**, **Submit Cart Order**, and **Checkout Order Guide** check only that the connected user may view an item: ServiceNow accepts any `requestedFor` without checking the item's Available For and Not Available For criteria for that person. Run this with the recipient's `sys_id` from **Find Users** and the item `sys_id`s before ordering any of them for someone other than the connected user, and order only items whose `can_request` is `true`. Each result has the item `sys_id`, `can_request`, and a `reason`: `delegation_allowed` when it is `true` (the recipient's criteria include them, or the item's Access Type is Delegated and the connected user may request it); `delegation_denied` when it is `false`. `can_request` is `null` when ServiceNow refused the check (`unreadable`, HTTP 403) or returned an error, an unexpected response, or could not be reached (`check_failed`): treat a `null` item as not available for that person. ServiceNow skips the criteria for a connected user who holds a role in `glide.sc.entitlement.override`, as it does in the portal. Example: user `62826bf03710200044e0bfc8bcbe5df1` and items `[\"060f3afa3731300054b6a3549dbe5d3e\"]` return `[{\"sys_id\": \"060f3afa3731300054b6a3549dbe5d3e\", \"can_request\": true, \"reason\": \"delegation_allowed\"}]`. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_ServiceCatalogAPI.html)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    servicenow,
    userSysId: {
      type: "string",
      label: "Requested For Sys ID",
      description: "The `sys_id` of the person the items are requested for, from **Find Users** (`sys_user`). Example: `62826bf03710200044e0bfc8bcbe5df1`.",
    },
    catalogItemSysIds: {
      type: "string[]",
      label: "Catalog Item Sys IDs",
      description: `The \`sys_id\`s of the catalog items or order guides to check (1-${MAX_ITEMS}), from **Search Catalog Items**. Example: \`["060f3afa3731300054b6a3549dbe5d3e"]\`.`,
    },
  },
  methods: {
    sysIds(value, label, max) {
      const ids = [
        ...new Set((Array.isArray(value)
          ? value
          : [
            value,
          ]).map((id) => String(id ?? "").trim()).filter(Boolean)),
      ];
      if (!ids.length || ids.length > max) {
        throw new ConfigurationError(`\`${label}\` must list 1-${max} \`sys_id\`s. Got ${ids.length}.`);
      }
      const invalid = ids.find((id) => !SYS_ID.test(id));
      if (invalid) {
        throw new ConfigurationError(`\`${label}\` must hold 32-character ServiceNow \`sys_id\`s. Got: \`${invalid}\`.`);
      }
      return ids;
    },
    async itemAnswer($, userSysId, itemSysId) {
      try {
        const response = await this.servicenow.checkDelegatedItemAccess({
          $,
          catalogItemSysId: itemSysId,
          userSysId,
        });
        const allowed = response?.result ?? response;
        if (typeof allowed !== "boolean") {
          console.log(`Unexpected delegation response for item ${itemSysId}`);
          return {
            can_request: null,
            reason: "check_failed",
          };
        }
        return {
          can_request: allowed,
          reason: allowed
            ? "delegation_allowed"
            : "delegation_denied",
        };
      } catch (error) {
        const status = error?.response?.status;
        // A broken connection (401) or a bug fails the whole action; any other request error is
        // that item's answer.
        if (!error?.isAxiosError || status === 401) {
          throw error;
        }
        console.log(`Delegation check failed for item ${itemSysId}: ${status
          ? `HTTP ${status}`
          : error.code}`);
        return {
          can_request: null,
          reason: status === 403
            ? "unreadable"
            : "check_failed",
        };
      }
    },
  },
  async run({ $ }) {
    const userSysId = this.sysIds(this.userSysId, "Requested For Sys ID", 1)[0];
    const itemIds = this.sysIds(this.catalogItemSysIds ?? [], "Catalog Item Sys IDs", MAX_ITEMS);

    const result = new Array(itemIds.length);
    let next = 0;
    const worker = async () => {
      while (next < itemIds.length) {
        const index = next++;
        result[index] = {
          sys_id: itemIds[index],
          ...(await this.itemAnswer($, userSysId, itemIds[index])),
        };
      }
    };
    await Promise.all(Array.from({
      length: Math.min(CONCURRENCY, itemIds.length),
    }, worker));

    const allowed = result.filter((row) => row.can_request === true).length;
    const unknown = result.filter((row) => row.can_request === null).length;
    $.export("$summary", `${allowed} of ${result.length} catalog item(s) may be requested for user ${userSysId}${unknown
      ? `; ${unknown} could not be determined`
      : ""}`);
    return result;
  },
};
