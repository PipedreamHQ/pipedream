import { reply_io } from "../../reply_io.app.mjs";

export default {
  key: "reply_io-list-campaign-id-options",
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
    reply_io,
  },
  async run({ $ }) {
    const options = await reply_io.propDefinitions.campaignId.options.call(this.reply_io, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
