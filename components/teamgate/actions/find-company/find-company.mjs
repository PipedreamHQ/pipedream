import teamgate from "../../teamgate.app.mjs";
import FIELDS from "../common/fields.mjs";

export default {
  key: "teamgate-find-company",
  name: "Find Company",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Find a company [See the docs here](https://developers.teamgate.com/#6be9bc87-47bb-4c32-b46b-9c0771deac83)",
  type: "action",
  props: {
    teamgate,
    fields: {
      propDefinition: [
        teamgate,
        "fields",
      ],
      options: FIELDS.COMPANY,
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
      fn: this.teamgate.listCompanies,
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

    $.export("$summary", "Companies Successfuly fetched");
    return response;
  },
};
