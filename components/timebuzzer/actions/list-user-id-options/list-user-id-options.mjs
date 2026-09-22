import timebuzzer from "../../timebuzzer.app.mjs";

export default {
  key: "timebuzzer-list-user-id-options",
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
    timebuzzer,
  },
  async run({ $ }) {
    const options = await timebuzzer.propDefinitions.userId.options.call(this.timebuzzer);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
