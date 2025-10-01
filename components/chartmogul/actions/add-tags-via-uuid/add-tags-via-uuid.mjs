import chartmogul from "../../chartmogul.app.mjs";

export default {
  key: "chartmogul-add-tags-via-uuid",
  name: "Add Tags To Customer Via UUID",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Adds tags to a given customer. [See the docs here](https://dev.chartmogul.com/reference/add-tags-to-customer)",
  type: "action",
  props: {
    chartmogul,
    customerId: {
      propDefinition: [
        chartmogul,
        "customerId",
      ],
    },
    tags: {
      propDefinition: [
        chartmogul,
        "tags",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      customerId,
      tags,
    } = this;

    const response = await this.chartmogul.addInfoViaUUID({
      $,
      info: "tags",
      customerId,
      tags,
    });

    $.export("$summary", "Tags Successfully added");
    return response;
  },
};
