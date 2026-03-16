import everstox from "../../everstox.app.mjs";

export default {
  key: "everstox-get-return",
  name: "Get Return",
  description: "Get a return from Everstox. [See the documentation](https://api.everstox.com/api/v1/ui/#/Returns%20V2/district_core.api.shops.returns_v2.returns_v2.ReturnsV2.get)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    everstox,
    returnId: {
      propDefinition: [
        everstox,
        "returnId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.everstox.getReturn({
      $,
      returnId: this.returnId,
    });
    $.export("$summary", `Successfully retrieved return with ID \`${this.returnId}\`.`);
    return response;
  },
};
