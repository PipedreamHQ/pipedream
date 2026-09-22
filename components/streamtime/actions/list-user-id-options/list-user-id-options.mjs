import streamtime from "../../streamtime.app.mjs";

export default {
  key: "streamtime-list-user-id-options",
  name: "List User Options",
  description: "Retrieves available options for the User field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    streamtime,
  },
  async run({ $ }) {
    const options = await streamtime.propDefinitions.userId.options.call(this.streamtime);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
