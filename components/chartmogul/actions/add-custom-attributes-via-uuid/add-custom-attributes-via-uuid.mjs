import chartmogul from "../../chartmogul.app.mjs";

export default {
  key: "chartmogul-add-custom-attributes-via-uuid",
  name: "Add Custom Attributes To Customer Via UUID",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Adds custom attributes to a given customer. [See the docs here](https://dev.chartmogul.com/reference/add-custom-attributes-to-customer)",
  type: "action",
  props: {
    chartmogul,
    customerId: {
      propDefinition: [
        chartmogul,
        "customerId",
      ],
    },
    custom: {
      propDefinition: [
        chartmogul,
        "custom",
      ],
      optional: true,
    },
    source: {
      propDefinition: [
        chartmogul,
        "source",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      customerId,
      custom,
      source,
    } = this;

    const response = await this.chartmogul.addInfoViaUUID({
      $,
      info: "custom",
      customerId,
      custom: custom && custom.map((item) => JSON.parse(item)),
      source,
    });

    $.export("$summary", "Custom Attributes Successfully added");
    return response;
  },
};
