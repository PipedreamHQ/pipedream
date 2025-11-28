import app from "../../trengo.app.mjs";

export default {
  key: "trengo-get-block",
  name: "Get Block",
  description: "Get a specific block. [See the documentation](https://developers.trengo.com/reference/get-a-block)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    helpCenterId: {
      propDefinition: [
        app,
        "helpCenterId",
      ],
    },
    blockId: {
      propDefinition: [
        app,
        "blockId",
        ({ helpCenterId }) => ({
          helpCenterId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getBlock({
      $,
      helpCenterId: this.helpCenterId,
      blockId: this.blockId,
    });
    $.export("$summary", "Successfully retrieved block");
    return response;
  },
};
