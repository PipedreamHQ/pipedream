import chartmogul from "../../chartmogul.app.mjs";

export default {
  key: "chartmogul-add-tags-via-email",
  name: "Add Tags To Customer Via Email",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Adds tags to customers that have the specified email address. [See the docs here](https://dev.chartmogul.com/reference/add-tags-to-customers-with-email)",
  type: "action",
  props: {
    chartmogul,
    customerEmail: {
      propDefinition: [
        chartmogul,
        "customerEmail",
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
      customerEmail,
      tags,
    } = this;

    const response = await this.chartmogul.addInfoViaEmail({
      $,
      info: "tags",
      email: customerEmail,
      tags,
    });

    $.export("$summary", `Tags Successfully added with ID ${response.entries[0].id}`);
    return response;
  },
};
