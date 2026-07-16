import crowdstrikeFalcon from "../../crowdstrike_falcon.app.mjs";
import {
  DEFAULT_LIMIT, LIMIT_MAX_DEFAULT,
} from "../../common/constants.mjs";

export default {
  key: "crowdstrike_falcon-search-alerts",
  name: "Search Alerts",
  description: "Search CrowdStrike Falcon alerts and return their IDs via GET /alerts/queries/alerts/v2. Detections are now delivered through the Alerts API (the legacy /detects/* collection was decommissioned), so filter on the alert product to retrieve endpoint detections. Use **Get Alert** to hydrate the returned IDs into full records. [See the documentation](https://developer.crowdstrike.com/api-reference/collections/alerts/#getqueriesalertsv2).",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    crowdstrikeFalcon,
    fqlFilter: {
      propDefinition: [
        crowdstrikeFalcon,
        "fqlFilter",
      ],
      description: "Optional FQL filter. Example: `status:'new'+severity:'High'`. Combine terms with `+`.",
    },
    limit: {
      propDefinition: [
        crowdstrikeFalcon,
        "limit",
      ],
      description: `Maximum number of alert IDs to return (1-${LIMIT_MAX_DEFAULT}). Default: ${DEFAULT_LIMIT}.`,
    },
    offset: {
      propDefinition: [
        crowdstrikeFalcon,
        "offset",
      ],
    },
    sort: {
      propDefinition: [
        crowdstrikeFalcon,
        "sort",
      ],
      description: "Optional sort in `field|direction` form, e.g. `created_timestamp|desc`. Sortable fields: timestamp, created_timestamp, updated_timestamp, status, severity.",
    },
  },
  async run({ $ }) {
    const response = await this.crowdstrikeFalcon.searchAlerts({
      $,
      params: {
        filter: this.fqlFilter,
        limit: this.limit ?? DEFAULT_LIMIT,
        offset: this.offset,
        sort: this.sort,
      },
    });
    const ids = response.resources ?? [];
    $.export("$summary", `Found ${ids?.length ?? 0} alert${ids?.length !== 1
      ? "s"
      : ""}`);
    return response;
  },
};
