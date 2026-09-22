import basecamp from "../../basecamp.app.mjs";

export default {
  key: "basecamp-list-account-id-options",
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
    basecamp,
  },
  async run({ $ }) {
    const options = await basecamp.propDefinitions.accountId.options.call(this.basecamp);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
