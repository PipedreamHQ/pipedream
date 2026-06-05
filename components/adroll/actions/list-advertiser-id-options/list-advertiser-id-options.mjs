import adroll from "../../adroll.app.mjs";

export default {
  key: "adroll-list-advertiser-id-options",
  name: "List Advertiser Id Options",
  description: "Retrieves available options for the Advertiser Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    adroll,
  },
  async run({ $ }) {
    const options = await adroll.propDefinitions.advertiserId.options.call(this.adroll);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
