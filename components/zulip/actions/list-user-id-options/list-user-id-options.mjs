import zulip from "../../zulip.app.mjs";

export default {
  key: "zulip-list-user-id-options",
  name: "List User ID Options",
  description: "Retrieves available options for the User ID field.",
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
    const options = await zulip.propDefinitions.userId.options.call(this.zulip);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
