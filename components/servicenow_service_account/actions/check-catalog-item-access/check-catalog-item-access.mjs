import constants from "@pipedream/servicenow/common/constants.mjs";
import servicenow from "../../servicenow_service_account.app.mjs";
import {
  anyIs,
  assertSysIds,
  evaluateList,
  isBoolean,
  personRefusal,
  readByIds,
  readCriteria,
  readFailure,
  readLinks,
  readPerson,
  readProperties,
  splitIds,
  undecidedReason,
} from "../../common/user-criteria.mjs";

const MAX_ITEMS = 50;
const DELEGATION_CONCURRENCY = 10;
const USE_USER_CRITERIA = "glide.sc.use_user_criteria";
const OVERRIDE_ROLES = "glide.sc.entitlement.override";
// ServiceNow runs a criteria script in the caller's session, so these APIs see the integration
// user, not the person being checked. Only scripts that use the `user_id` variable instead can
// be left to ServiceNow.
// ponytail: text match only; a script include that reads the session user internally still passes.
const SESSION_USER_API = /\bgs\s*\.\s*(getUser\w*|hasRole\w*|getSession\w*|isMemberOf|isLoggedIn)\b|\bGlideSession\b/;
const USER_ID_VARIABLE = /\buser_id\b/;
// Block comments and whole-line `//` comments, which the base system's script template uses to
// warn against session-user APIs. A `//` after code is kept: it may sit inside a string.
const COMMENTS = /\/\*[\s\S]*?\*\/|^[ \t]*\/\/.*$/gm;
const DEFAULT_OVERRIDE_ROLES = [
  "admin",
];

export default {
  key: "servicenow_service_account-check-catalog-item-access",
  name: "Check Catalog Item Access",
  description: "Check which catalog items a given ServiceNow user may request, by evaluating each item's Available For and Not Available For user criteria for that user. **Search Catalog Items** and **Get Catalog Item Variables** run as the integration user, so they return items the person you act for may not be allowed to see or order: run this with that person's `sys_id` from **Find Users** (never the `sys_id` from **Get Current User**) and the item `sys_id`s before showing, describing, or ordering any of them, and keep only items whose `can_request` is `true`. Each result has the item `sys_id`, `can_request`, and a `reason`: `open_to_all`, `available_for`, or `entitlement_override` when it is `true`; `not_available_for`, `not_in_available_for`, `item_inactive`, `item_not_found` (or hidden from the integration user), `user_not_found` (or hidden), `user_inactive`, or `user_locked_out` when it is `false`; `scripted_criteria` when ServiceNow's own check (`CatItem.isDelegationAllowed`) decided it for that person on a Restricted item: a scripted criterion that uses `user_id`, or a match-all criterion with a multi-value field. `can_request` is `null` when the answer cannot be determined for that person, with reason `unresolved_script` (a scripted criterion that does not use `user_id` or that reads the session user, or, on an item whose Access Type is not Restricted, any scripted or multi-value match-all criterion), `unreadable` (the integration user cannot read a table, a criterion, a field of the item, link, or user, or the `glide.sc.use_user_criteria` property), `legacy_entitlements` (the instance does not use user criteria), or `check_failed` (ServiceNow returned an error or could not be reached): treat a `null` item as not available and do not offer it. The integration user must be able to read every row of the tables below: a row it cannot read looks the same as no row. Criteria are read from `user_criteria`, `sc_cat_item_user_criteria_mtom`, and `sc_cat_item_user_criteria_no_mtom`, and the person's roles, groups, company, department, and location from `sys_user`, `sys_user_has_role`, and `sys_user_grmember`; on a Restricted item, scripted criteria that use only the `user_id` variable are evaluated by ServiceNow (`CatItem.isDelegationAllowed`). Example: user `62826bf03710200044e0bfc8bcbe5df1` and items `[\"060f3afa3731300054b6a3549dbe5d3e\"]` return `[{\"sys_id\": \"060f3afa3731300054b6a3549dbe5d3e\", \"can_request\": true, \"reason\": \"available_for\"}]`. [See the documentation](https://www.servicenow.com/docs/r/zurich/servicenow-platform/service-catalog/t_AppUserCritItemsCat.html)",
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
      label: "User Sys ID",
      description: "The `sys_id` of the person you act for, from **Find Users** (`sys_user`). Example: `62826bf03710200044e0bfc8bcbe5df1`.",
    },
    catalogItemSysIds: {
      type: "string[]",
      label: "Catalog Item Sys IDs",
      description: `The \`sys_id\`s of the catalog items to check (1-${MAX_ITEMS}), from **Search Catalog Items**. Example: \`["060f3afa3731300054b6a3549dbe5d3e"]\`.`,
    },
  },
  methods: {
    itemVerdict(item, links, criteriaById, person, overrideRoles) {
      if (!item) {
        return {
          can_request: false,
          reason: "item_not_found",
        };
      }
      if (!isBoolean(item.active)) {
        return {
          can_request: null,
          reason: "unreadable",
        };
      }
      if (item.active === "false") {
        return {
          can_request: false,
          reason: "item_inactive",
        };
      }
      if (overrideRoles.some((role) => person.roleNames.has(role))) {
        return {
          can_request: true,
          reason: "entitlement_override",
        };
      }
      if (links.unreadable) {
        return {
          can_request: null,
          reason: "unreadable",
        };
      }
      const notAvailable = evaluateList(links.notAvailable, criteriaById, person.facts);
      const available = evaluateList(links.available, criteriaById, person.facts);
      if (anyIs(notAvailable, true)) {
        return {
          can_request: false,
          reason: "not_available_for",
        };
      }
      if (available.length && available.every((result) => result.value === false)) {
        return {
          can_request: false,
          reason: "not_in_available_for",
        };
      }
      const undecided = [
        ...notAvailable,
        ...(anyIs(available, true)
          ? []
          : available),
      ].filter((result) => result.value === null);
      if (!undecided.length) {
        return {
          can_request: true,
          reason: available.length
            ? "available_for"
            : "open_to_all",
        };
      }
      // ServiceNow's own check is right only on a Restricted item (a delegated one answers true for
      // everyone; a blank or hidden Access Type is not known to be Restricted) and only for scripts
      // that name the person through `user_id`.
      const code = (script) => script.replace(COMMENTS, "");
      const delegable = item.access_type === "restricted" && undecided.every(({
        why, script,
      }) => why === "ambiguous"
        || (why === "script" && USER_ID_VARIABLE.test(code(script)) && !SESSION_USER_API.test(code(script))));
      return {
        can_request: null,
        reason: item.access_type === undefined
          ? "unreadable"
          : undecidedReason(undecided),
        delegable,
      };
    },
    async askServiceNow($, itemSysId, userSysId) {
      try {
        // ServiceNow's "Check requested for delegation on item" operation returns
        // `{ result: new sn_sc.CatItem(item).isDelegationAllowed(user) }`, which the REST API
        // wraps in its own `result`: `{"result": {"result": false}}`. `_makeRequest` removes the
        // outer one.
        const response = await this.servicenow._makeRequest({
          $,
          baseURL: `${this.servicenow._instanceBaseUrl()}${constants.SERVICE_CATALOG_BASE_PATH}`,
          url: `/items/${itemSysId}/delegation/${userSysId}`,
        });
        return typeof response?.result === "boolean"
          ? {
            can_request: response.result,
            reason: "scripted_criteria",
          }
          : {
            can_request: null,
            reason: "check_failed",
          };
      } catch (error) {
        console.log(`Access check for item ${itemSysId} failed: HTTP ${error?.response?.status ?? "error"}`);
        return {
          can_request: null,
          reason: "check_failed",
        };
      }
    },
    // Each item's answer for the person; rejects when a read fails.
    async itemAnswers($, userSysId, itemIds, answer) {
      const app = this.servicenow;
      const [
        properties,
        person,
        items,
        available,
        notAvailable,
      ] = await Promise.all([
        readProperties(app, $, [
          USE_USER_CRITERIA,
          OVERRIDE_ROLES,
        ]),
        readPerson(app, $, userSysId),
        readByIds(app, $, "sc_cat_item", "sys_id", itemIds, [
          "sys_id",
          "active",
          "access_type",
        ]),
        readLinks(app, $, "sc_cat_item_user_criteria_mtom", "sc_cat_item", itemIds),
        readLinks(app, $, "sc_cat_item_user_criteria_no_mtom", "sc_cat_item", itemIds),
      ]);
      if (!properties.has(USE_USER_CRITERIA)) {
        // Without the property ServiceNow uses legacy entitlements, which this action doesn't read.
        return answer({
          allowed: null,
          reason: "unreadable",
        });
      }
      if (properties.get(USE_USER_CRITERIA) !== "true") {
        return answer({
          allowed: null,
          reason: "legacy_entitlements",
        });
      }
      const refused = personRefusal(person);
      if (refused) {
        return answer(refused);
      }
      // A hidden override list falls back to the base system's, which grants the fewest people.
      const overrideRoles = properties.has(OVERRIDE_ROLES)
        ? splitIds(properties.get(OVERRIDE_ROLES))
        : DEFAULT_OVERRIDE_ROLES;
      const itemsById = new Map(items.map((row) => [
        row.sys_id,
        row,
      ]));
      let criteriaById;
      try {
        criteriaById = await readCriteria(app, $, [
          ...available.byParent.values(),
          ...notAvailable.byParent.values(),
        ].flat());
      } catch (error) {
        const failed = readFailure(error);
        // Answers that need no criteria stand; every other item gets the failure.
        return itemIds.map((sysId) => {
          const settled = this.itemVerdict(itemsById.get(sysId), {
            unreadable: true,
          }, null, person, overrideRoles);
          return {
            sys_id: sysId,
            ...(settled.can_request === null
              ? {
                can_request: failed.allowed,
                reason: failed.reason,
              }
              : settled),
          };
        });
      }
      const result = itemIds.map((sysId) => ({
        sys_id: sysId,
        ...this.itemVerdict(
          itemsById.get(sysId),
          {
            available: available.byParent.get(sysId),
            notAvailable: notAvailable.byParent.get(sysId),
            unreadable: available.unreadable.has(sysId) || notAvailable.unreadable.has(sysId),
          },
          criteriaById,
          person,
          overrideRoles,
        ),
      }));
      const delegable = result.filter((row) => row.delegable);
      for (let i = 0; i < delegable.length; i += DELEGATION_CONCURRENCY) {
        await Promise.all(delegable.slice(i, i + DELEGATION_CONCURRENCY).map(async (row) => {
          Object.assign(row, await this.askServiceNow($, row.sys_id, userSysId));
        }));
      }
      result.forEach((row) => delete row.delegable);
      return result;
    },
  },
  async run({ $ }) {
    const userSysId = assertSysIds(this.userSysId, "User Sys ID", 1)[0];
    const itemIds = assertSysIds(this.catalogItemSysIds ?? [], "Catalog Item Sys IDs", MAX_ITEMS);
    const answer = (verdict) => itemIds.map((sysId) => ({
      sys_id: sysId,
      can_request: verdict.allowed,
      reason: verdict.reason,
    }));

    let result;
    try {
      result = await this.itemAnswers($, userSysId, itemIds, answer);
    } catch (error) {
      result = answer(readFailure(error));
    }

    const allowed = result.filter((row) => row.can_request === true).length;
    const unknown = result.filter((row) => row.can_request === null).length;
    $.export("$summary", `User ${userSysId} may request ${allowed} of ${result.length} catalog item(s)${unknown
      ? `; ${unknown} could not be determined`
      : ""}`);
    return result;
  },
};
