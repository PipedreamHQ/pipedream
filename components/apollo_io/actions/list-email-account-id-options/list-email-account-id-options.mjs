import apollo_io from "../../apollo_io.app.mjs";

export default {
  key: "apollo_io-list-email-account-id-options",
  name: "List Email Account ID Options",
  description: "Retrieves available options for the Email Account ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    apollo_io,
  },
  async run({ $ }) {
    const options = await apollo_io.propDefinitions.emailAccountId.options
      .call(this.apollo_io);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
