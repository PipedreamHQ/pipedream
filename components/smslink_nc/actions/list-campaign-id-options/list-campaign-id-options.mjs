import { smslink_nc } from "../../smslink_nc.app.mjs";

export default {
  key: "smslink_nc-list-campaign-id-options",
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
    smslink_nc,
  },
  async run({ $ }) {
    const options = await smslink_nc.propDefinitions.campaignId.options.call(this.smslink_nc, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
