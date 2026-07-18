import crowdstrikeFalcon from "../../crowdstrike_falcon.app.mjs";
import {
  DEFAULT_LIMIT, LIMIT_MAX_DEFAULT,
} from "../../common/constants.mjs";

export default {
  key: "crowdstrike_falcon-search-hosts",
  name: "Search Hosts",
  description: "Search CrowdStrike Falcon hosts and return full device records via GET /devices/combined/devices/v1, including `status` (containment status), `reduced_functionality_mode` and other sensor-health fields. Use **Get Host** to retrieve a specific device by ID. [See the documentation](https://developer.crowdstrike.com/api-reference/collections/hosts/#combineddevicesbyfilter).",
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
      description: "Optional FQL filter. Example: `platform_name:'Windows'+status:'normal'`. Combine terms with `+`.",
    },
    limit: {
      propDefinition: [
        crowdstrikeFalcon,
        "limit",
      ],
      description: `Maximum number of device records to return (1-${LIMIT_MAX_DEFAULT}). Default: ${DEFAULT_LIMIT}.`,
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
      description: "Optional sort in `field.direction` form, e.g. `hostname.asc` or `status.desc`.",
    },
    fields: {
      type: "string",
      label: "Fields",
      description: "The fields to return, comma delimited.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.crowdstrikeFalcon.searchHosts({
      $,
      params: {
        filter: this.fqlFilter,
        limit: this.limit ?? DEFAULT_LIMIT,
        offset: this.offset,
        sort: this.sort,
        fields: this.fields,
      },
    });
    const devices = response.resources ?? [];
    $.export("$summary", `Found ${devices?.length ?? 0} host${devices?.length !== 1
      ? "s"
      : ""}`);
    return response;
  },
};
