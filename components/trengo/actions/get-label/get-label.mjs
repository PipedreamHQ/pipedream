import app from "../../trengo.app.mjs";

export default {
  key: "trengo-get-label",
  name: "Get Label",
  description: "Get a label by ID. [See the documentation](https://developers.trengo.com/reference/get-a-label)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    labelId: {
      propDefinition: [
        app,
        "labelId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getLabel({
      $,
      labelId: this.labelId,
    });
    $.export("$summary", `Successfully retrieved label with ID ${this.labelId}`);
    return response;
  },
};
