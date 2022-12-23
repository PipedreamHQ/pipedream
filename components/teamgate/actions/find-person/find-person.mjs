import teamgate from "../../teamgate.app.mjs";
import FIELDS from "../common/fields.mjs";

export default {
  key: "teamgate-find-person",
  name: "Find Person",
  version: "0.0.1",
  description: "Find a person [See the docs here](https://developers.teamgate.com/#7708cc10-52d4-4ec3-bcc5-1222f21480bb)",
  type: "action",
  props: {
    teamgate,
    fields: {
      propDefinition: [
        teamgate,
        "fields",
      ],
      options: FIELDS.PERSON,
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
      fn: this.teamgate.listPeople,
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

    $.export("$summary", "People Successfuly fetched");
    return response;
  },
};
