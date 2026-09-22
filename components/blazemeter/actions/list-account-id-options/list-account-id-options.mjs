import blazemeter from "../../blazemeter.app.mjs";

export default {
  key: "blazemeter-list-account-id-options",
  name: "List Account ID Options",
  description: "Retrieves available options for the Account ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    blazemeter,
  },
  async run({ $ }) {
    const options = await blazemeter.propDefinitions.accountId.options.call(this.blazemeter);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
