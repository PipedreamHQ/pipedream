import dotsimple from "../../dotsimple.app.mjs";

export default {
  key: "dotsimple-list-account-id-options",
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
    dotsimple,
  },
  async run({ $ }) {
    const options = await dotsimple.propDefinitions.accountId.options.call(this.dotsimple);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
