import testlocally from "../../testlocally.app.mjs";

export default {
  key: "testlocally-list-servers-options",
  name: "List Servers Options",
  description: "Retrieves available options for the Servers field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    testlocally,
  },
  async run({ $ }) {
    const options = await testlocally.propDefinitions.servers.options.call(this.testlocally);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
