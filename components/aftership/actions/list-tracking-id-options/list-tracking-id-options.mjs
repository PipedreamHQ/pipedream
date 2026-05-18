import aftership from "../../aftership.app.mjs";

export default {
  key: "aftership-list-tracking-id-options",
  name: "List Tracking ID Options",
  description: "Retrieves available options for the Tracking ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    aftership,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await aftership.propDefinitions.trackingId.options
      .call(this.aftership, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
