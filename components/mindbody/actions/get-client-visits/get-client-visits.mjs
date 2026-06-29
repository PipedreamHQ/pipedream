import app from "../../mindbody.app.mjs";
import {
  DEFAULT_LIMIT,
  LIMIT_MAX,
  LIMIT_MIN,
} from "../../common/constants.mjs";

export default {
  key: "mindbody-get-client-visits",
  name: "Get Client Visits",
  description:
    "Returns the paginated list of visit records for a specific Mindbody client (member), each including its date/datetime (e.g. `StartDateTime`)."
    + " Use this to derive retention metrics: visit count is the total record count across all pages and last visit date is the latest `StartDateTime`."
    + " Requires the client's numeric ID - use **Search Clients** first to look up the ID by name or email."
    + " Note: **Get Client Details** may already surface scalar visit-summary fields; use this action when you need the full per-visit history for precise date math or milestone detection."
    + " Iterate `offset` to page through the full history."
    + " [See the documentation](https://developers.mindbodyonline.com/ui/documentation/public-api#/http/api-endpoints/client/get-client-visits)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    clientId: {
      propDefinition: [
        app,
        "clientId",
      ],
    },
    startDate: {
      propDefinition: [
        app,
        "startDate",
      ],
    },
    endDate: {
      propDefinition: [
        app,
        "endDate",
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: `Maximum number of visit records to return per page. Minimum ${LIMIT_MIN}, maximum ${LIMIT_MAX}. Defaults to ${DEFAULT_LIMIT}.`,
      min: LIMIT_MIN,
      max: LIMIT_MAX,
      default: DEFAULT_LIMIT,
      optional: true,
    },
    offset: {
      propDefinition: [
        app,
        "offset",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getClientVisits({
      $,
      params: {
        ClientId: this.clientId,
        StartDate: this.startDate,
        EndDate: this.endDate,
        Limit: this.limit,
        Offset: this.offset,
      },
    });
    const visits = response.Visits || [];
    $.export("$summary", `Retrieved ${visits.length} visit record${visits.length === 1
      ? ""
      : "s"} for client ${this.clientId}`);
    return response;
  },
};
