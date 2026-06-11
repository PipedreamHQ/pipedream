import nifty from "../../nifty.app.mjs";

export default {
  key: "nifty-list-member-id-options",
  name: "List Member ID Options",
  description: "Retrieves available options for the Member ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    nifty,
  },
  async run({ $ }) {
    const options = await nifty.propDefinitions.memberId.options.call(this.nifty);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
