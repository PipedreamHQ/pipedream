import chartmogul from "../../chartmogul.app.mjs";

export default {
  key: "chartmogul-add-custom-attributes-via-email",
  name: "Add Custom Attributes To Customer Via Email",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Adds custom attributes to customers that have the specified email address. [See the docs here](https://dev.chartmogul.com/reference/add-custom-attributes-to-customers-with-email)",
  type: "action",
  props: {
    chartmogul,
    customerEmail: {
      propDefinition: [
        chartmogul,
        "customerEmail",
      ],
    },
    custom: {
      propDefinition: [
        chartmogul,
        "custom",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      customerEmail,
      custom,
    } = this;

    const response = await this.chartmogul.addInfoViaEmail({
      $,
      info: "custom",
      email: customerEmail,
      custom: custom && custom.map((item) => JSON.parse(item)),
    });

    $.export("$summary", `Custom Attributes Successfully added with ID ${response.entries[0].id}`);
    return response;
  },
};
