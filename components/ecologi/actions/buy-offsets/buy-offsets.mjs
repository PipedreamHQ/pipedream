import app from "../../ecologi.app.mjs";

export default {
  key: "ecologi-buy-offsets",
  name: "Buy Offsets",
  description: "Buy carbon avoidance credits through Ecologi. [See the documentation](https://docs.ecologi.com/docs/public-api-docs/e07bbee7fa605-purchase-carbon-avoidance)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    number: {
      propDefinition: [
        app,
        "number",
      ],
    },
    units: {
      propDefinition: [
        app,
        "units",
      ],
    },
    test: {
      propDefinition: [
        app,
        "test",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.buyOffsets({
      $,
      data: {
        number: this.number,
        units: this.units,
        test: this.test,
      },
    });
    $.export("$summary", "Successfully bought carbon avoidance credits");
    return response;
  },
};
