import app from "../../ecologi.app.mjs";

export default {
  key: "ecologi-buy-trees",
  name: "Buy Trees",
  description: "Purchase trees through Ecologi. [See the documentation](https://docs.ecologi.com/docs/public-api-docs/004342d262f93-purchase-trees)",
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
    name: {
      propDefinition: [
        app,
        "name",
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
    const response = await this.app.buyTrees({
      $,
      data: {
        number: this.number,
        name: this.name,
        test: this.test,
      },
    });

    $.export("$summary", `Successfully bought ${this.number} tree(s)`);

    return response;
  },
};
