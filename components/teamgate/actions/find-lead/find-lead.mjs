import teamgate from "../../teamgate.app.mjs";
import FIELDS from "../common/fields.mjs";

export default {
  key: "teamgate-find-lead",
  name: "Find Lead",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Find a lead [See the docs here](https://developers.teamgate.com/#1b80ca61-833a-472a-b127-e3b6d5e18902)",
  type: "action",
  props: {
    teamgate,
    fields: {
      propDefinition: [
        teamgate,
        "fields",
      ],
      options: FIELDS.LEAD,
      optional: true,
    },
    order: {
      propDefinition: [
        teamgate,
        "order",
      ],
      optional: true,
    },
    filters: {
      propDefinition: [
        teamgate,
        "filters",
      ],
      optional: true,
    },
    globalOperator: {
      propDefinition: [
        teamgate,
        "globalOperator",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      fields,
      order,
      filters,
      globalOperator,
    } = this;

    const embed = fields?.includes("customFields")
      ? "customFields"
      : "";

    const items = this.teamgate.paginate({
      fn: this.teamgate.listLeads,
      params: {
        fields,
        ...filters,
        order: order && Object.keys(order).map((key) => (`${key}:${order[key]}`))
          .toString(),
        embed,
        operator: globalOperator,
      },
    });

    const response = [];

    for await (const item of items) {
      response.push(item);
    }

    $.export("$summary", "Leads Successfuly fetched");
    return response;
  },
};
