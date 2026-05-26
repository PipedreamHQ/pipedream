import lightspeed_retail_pos from "../../lightspeed_retail_pos.app.mjs";

export default {
  key: "lightspeed_retail_pos-list-account-id-options",
  name: "List Account Options",
  description: "Retrieves available options for the Account field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    lightspeed_retail_pos,
  },
  async run({ $ }) {
    const options = await lightspeed_retail_pos.propDefinitions.accountId.options
      .call(this.lightspeed_retail_pos);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
