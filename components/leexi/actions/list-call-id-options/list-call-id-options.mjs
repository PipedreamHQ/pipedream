import leexi from "../../leexi.app.mjs";

export default {
  key: "leexi-list-call-id-options",
  name: "List Call ID Options",
  description: "Retrieves available options for the Call ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    leexi,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await leexi.propDefinitions.callId.options.call(this.leexi, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
