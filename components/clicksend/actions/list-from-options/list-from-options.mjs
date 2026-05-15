import clicksend from "../../clicksend.app.mjs";

export default {
  key: "clicksend-list-from-options",
  name: "List Sender ID Options",
  description: "Retrieves available options for the Sender ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    clicksend,
  },
  async run({ $ }) {
    const options = await clicksend.propDefinitions.from.options.call(this.clicksend);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
