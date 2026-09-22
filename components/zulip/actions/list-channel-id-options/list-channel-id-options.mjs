import zulip from "../../zulip.app.mjs";

export default {
  key: "zulip-list-channel-id-options",
  name: "List Channel ID Options",
  description: "Retrieves available options for the Channel ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zulip,
  },
  async run({ $ }) {
    const options = await zulip.propDefinitions.channelId.options.call(this.zulip);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
