import servicenow from "../../servicenow.app.mjs";
import {
  mapConcurrently, sysId, sysIdList,
} from "../../common/utils.mjs";

const MAX_ITEMS = 50;
const CONCURRENCY = 5;

const requestFailure = (error, what) => {
  const status = error?.response?.status;
  // A broken connection (401) or a bug fails the whole action; any other request error is
  // that check's answer.
  if (!error?.isAxiosError || status === 401) {
    throw error;
  }
  console.log(`${what} failed: ${status
    ? `HTTP ${status}`
    : error.code ?? "no response"}`);
  return status;
};

export default {
  key: "servicenow-check-delegated-item-access",
  name: "Check Delegated Item Access",
  description: "Check whether the connected user may request each catalog item for another person, as the Service Portal checks it before an order on someone's behalf. **Order Catalog Item**, **Add Item to Cart**, **Checkout Cart**, **Submit Cart Order**, and **Checkout Order Guide** check only that the connected user may view an item: ServiceNow accepts any `requestedFor` without checking the item's Available For and Not Available For criteria for that person. Run this with the recipient's `sys_id` from **Find Users** and the item `sys_id`s before ordering any of them for someone other than the connected user, and order only items whose `can_request` is `true`. Each result has the item `sys_id`, `can_request`, and a `reason`: `delegation_allowed` when it is `true` (the recipient's criteria include them, or the item's Access Type is Delegated and the connected user may request it); when it is `false`, `delegation_denied` (the recipient's criteria exclude them), `item_unavailable` (ServiceNow refuses delegation on the item: it does not exist, is inactive, or the connected user may not view it), `recipient_inactive`, or `recipient_not_found` (no active user with that `sys_id` that the connected user can see). `can_request` is `null` when ServiceNow refused the check (`unreadable`, HTTP 403) or returned an error, an unexpected response, or could not be reached (`check_failed`): treat a `null` item as not available for that person. ServiceNow skips the criteria for a connected user who holds a role in `glide.sc.entitlement.override`, as it does in the portal. Example: user `62826bf03710200044e0bfc8bcbe5df1` and items `[\"060f3afa3731300054b6a3549dbe5d3e\"]` return `[{\"sys_id\": \"060f3afa3731300054b6a3549dbe5d3e\", \"can_request\": true, \"reason\": \"delegation_allowed\"}]`. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_ServiceCatalogAPI.html)",
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
      propDefinition: [
        servicenow,
        "requestedFor",
      ],
      label: "Requested For Sys ID",
      description: "The `sys_id` of the person the items are requested for, from **Find Users** (`sys_user`). Example: `62826bf03710200044e0bfc8bcbe5df1`.",
      optional: false,
    },
    catalogItemSysIds: {
      type: "string[]",
      label: "Catalog Item Sys IDs",
      description: `The \`sys_id\`s of the catalog items or order guides to check (1-${MAX_ITEMS}), from **Search Catalog Items**. Example: \`["060f3afa3731300054b6a3549dbe5d3e"]\`.`,
    },
  },
  methods: {
    // ServiceNow's delegation check answers `true` for a recipient who is inactive or does not
    // exist, so the recipient is confirmed first. Returns null when the items may be checked.
    async recipientRefusal($, userSysId) {
      try {
        const user = await this.servicenow.getTableRecordById({
          $,
          table: "sys_user",
          recordId: userSysId,
          params: {
            sysparm_fields: "sys_id,active",
          },
        });
        if (user?.sys_id !== userSysId) {
          console.log(`Unexpected sys_user response for recipient ${userSysId}`);
          return {
            can_request: null,
            reason: "check_failed",
          };
        }
        return String(user.active) === "true"
          ? null
          : {
            can_request: false,
            reason: "recipient_inactive",
          };
      } catch (error) {
        const status = requestFailure(error, `Recipient lookup for ${userSysId}`);
        if (status === 404) {
          return {
            can_request: false,
            reason: "recipient_not_found",
          };
        }
        return {
          can_request: null,
          reason: status === 403
            ? "unreadable"
            : "check_failed",
        };
      }
    },
    async itemAnswer($, userSysId, itemSysId) {
      try {
        const response = await this.servicenow.checkDelegatedItemAccess({
          $,
          catalogItemSysId: itemSysId,
          userSysId,
        });
        // ServiceNow answers `{ "result": { "result": <boolean>, "errMsg"?: string } }`.
        const allowed = response?.result;
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
        const status = requestFailure(error, `Delegation check for item ${itemSysId}`);
        // 400 "Security constraints prevent delegation on item".
        if (status === 400) {
          return {
            can_request: false,
            reason: "item_unavailable",
          };
        }
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
    const userSysId = sysId(this.userSysId, "Requested For Sys ID");
    const itemIds = sysIdList(this.catalogItemSysIds ?? [], "Catalog Item Sys IDs", MAX_ITEMS);

    const refusal = await this.recipientRefusal($, userSysId);
    const result = refusal
      ? itemIds.map((id) => ({
        sys_id: id,
        ...refusal,
      }))
      : await mapConcurrently(itemIds, CONCURRENCY, async (id) => ({
        sys_id: id,
        ...(await this.itemAnswer($, userSysId, id)),
      }));

    const allowed = result.filter((row) => row.can_request === true).length;
    const unknown = result.filter((row) => row.can_request === null).length;
    $.export("$summary", `${allowed} of ${result.length} catalog item(s) may be requested for user ${userSysId}${refusal
      ? ` (${refusal.reason})`
      : ""}${unknown
      ? `; ${unknown} could not be determined`
      : ""}`);
    return result;
  },
};
