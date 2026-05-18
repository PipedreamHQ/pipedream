import boldsign from "../../boldsign.app.mjs";

export default {
  key: "boldsign-list-sent-by-options",
  name: "List Sent By Options",
  description: "Retrieves available options for the Sent By field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    boldsign,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await boldsign.propDefinitions.sentBy.options
      .call(this.boldsign, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
