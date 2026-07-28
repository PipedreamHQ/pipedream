import monta from "../../monta.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "monta-list-inbound-forecast-groups",
  name: "List Inbound Forecast Groups",
  description: "List inbound forecast groups matching the provided filters. Use this to find group references for **Get Inbound Forecast Group**, **Update Inbound Forecast Group**, or **Delete Inbound Forecast Group**. [See the documentation](https://api-v6.monta.nl/index.html#tag/InboundForecast/paths/~1inboundforecast~1group/get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    monta,
    createdSince: {
      type: "string",
      label: "Created Since",
      description: "Only return groups created on or after this ISO 8601 date and time (e.g. `2026-07-24T14:30:00Z`)",
      optional: true,
    },
    createdUntil: {
      type: "string",
      label: "Created Until",
      description: "Only return groups created on or before this ISO 8601 date and time (e.g. `2026-07-24T14:30:00Z`)",
      optional: true,
    },
    approved: {
      type: "boolean",
      label: "Approved",
      description: "Filter by approval status",
      optional: true,
    },
    sku: {
      propDefinition: [
        monta,
        "sku",
      ],
      description: "Only return groups containing this product SKU",
      optional: true,
    },
    reference: {
      propDefinition: [
        monta,
        "reference",
      ],
      description: "Only return groups matching this reference",
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve",
      min: 0,
      optional: true,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description: `The number of groups to return per page (Monta's default is ${constants.DEFAULT_PAGE_SIZE})`,
      min: constants.MIN_PAGE_SIZE,
      max: constants.MAX_PAGE_SIZE,
      default: constants.DEFAULT_PAGE_SIZE,
      optional: true,
    },
  },
  async run({ $ }) {
    const groups = await this.monta.listInboundForecastGroups({
      $,
      params: {
        created_since: this.createdSince,
        created_until: this.createdUntil,
        approved: this.approved,
        sku: this.sku,
        reference: this.reference,
        page: this.page,
        page_size: this.pageSize,
      },
    });

    $.export("$summary", `Successfully retrieved ${groups.length} inbound forecast group${groups.length === 1
      ? ""
      : "s"}`);

    return groups;
  },
};
