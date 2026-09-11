// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import app from "../../mixpanel_service_account.app.mjs";

export default {
  key: "mixpanel_service_account-query-profiles",
  name: "Query Profiles",
  description: "Look up user profiles and their stored properties. Results are paginated: when the number of results equals `page_size`, call again with the returned `session_id` and the next `page` number. [See the documentation](https://docs.mixpanel.com/reference/engage-query)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    distinctId: {
      type: "string",
      label: "Distinct ID",
      description: "A single `distinct_id` to fetch the profile for, for example `user_1234`. Set only one of Distinct ID, Distinct IDs, or Where.",
      optional: true,
    },
    distinctIds: {
      propDefinition: [
        app,
        "distinctIds",
      ],
      description: "Several `distinct_id` values to fetch profiles for in one call, for example `[\"user_1234\", \"user_5678\"]`. Set only one of Distinct ID, Distinct IDs, or Where.",
      optional: true,
    },
    where: {
      propDefinition: [
        app,
        "where",
      ],
      description: "A segmentation expression that selects which profiles to return. Profile properties are addressed as `user[\"...\"]`, for example `user[\"$email\"] == \"jane@example.com\"` or `user[\"$city\"] == \"Austin\"`. [See the expression syntax](https://docs.mixpanel.com/reference/segmentation-expressions)",
    },
    filterByCohortId: {
      type: "integer",
      label: "Cohort ID",
      description: "Return only the profiles in this saved cohort, for example `12345`. Use **List Saved Cohorts** to find the ID.",
      optional: true,
    },
    includeAllUsers: {
      type: "boolean",
      label: "Include All Users",
      description: "Only applies when Cohort ID is set. When `true` (the default), every `distinct_id` in the cohort is returned even if it has no profile. Set to `false` to return only users that have a profile.",
      optional: true,
    },
    outputProperties: {
      type: "string[]",
      label: "Output Properties",
      description: "The profile property names to return, for example `$email` and `$last_seen`. Leave empty to return every property. Restricting this can speed up large queries considerably.",
      optional: true,
    },
    dataGroupId: {
      type: "string",
      label: "Data Group ID",
      description: "Set this to query group profiles (companies, workspaces) instead of user profiles. The value is the numeric ID of a group key, for example `1234567890`, not the group key's name. [See the documentation](https://docs.mixpanel.com/docs/data-structure/group-analytics#exporting-group-profiles-via-api)",
      optional: true,
    },
    sessionId: {
      type: "string",
      label: "Session ID",
      description: "The `session_id` value returned by a previous call, for example `1234567890-EXAMPL`. Required whenever Page is greater than 0, and speeds up paging through a large result set.",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Which page of results to return. Pages start at 0. Any value above 0 also requires Session ID.",
      min: 0,
      optional: true,
    },
    workspaceId: {
      propDefinition: [
        app,
        "workspaceId",
      ],
    },
  },
  async run({ $ }) {
    if (this.page > 0 && !this.sessionId) {
      throw new ConfigurationError("Session ID is required when Page is greater than 0. Run this action without Page first, then pass the `session_id` from its response.");
    }

    // Mixpanel accepts several selectors at once but does not define how they
    // combine, so more than one would return an undefined result set.
    const selectorCount = [
      this.distinctId,
      this.distinctIds?.length,
      this.where,
    ].filter(Boolean).length;
    if (selectorCount > 1) {
      throw new ConfigurationError("Set only one of Distinct ID, Distinct IDs, or Where. Mixpanel does not define how multiple profile selectors combine.");
    }

    const response = await this.app.queryProfiles({
      $,
      params: {
        workspace_id: this.workspaceId,
      },
      data: {
        distinct_id: this.distinctId,
        distinct_ids: this.distinctIds && JSON.stringify(this.distinctIds),
        where: this.where,
        filter_by_cohort: this.filterByCohortId && JSON.stringify({
          id: this.filterByCohortId,
        }),
        include_all_users: this.includeAllUsers,
        output_properties: this.outputProperties && JSON.stringify(this.outputProperties),
        data_group_id: this.dataGroupId,
        session_id: this.sessionId,
        page: this.page,
      },
    });

    const {
      results = [], total,
    } = response;
    // Mentioning the total unconditionally reads as "Found 0 profiles of 0".
    $.export("$summary", `Found ${results.length} profile${results.length === 1
      ? ""
      : "s"}${total > results.length
      ? ` (${total} total matching)`
      : ""}`);

    return response;
  },
};
