import icontact from "../../icontact.app.mjs";

export default {
  key: "icontact-list-campaign-id-options",
  name: "List Campaign ID Options",
  description: "Retrieves available options for the Campaign ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    icontact,
  },
  async run({ $ }) {
    const options = await icontact.propDefinitions.campaignId.options.call(this.icontact);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
