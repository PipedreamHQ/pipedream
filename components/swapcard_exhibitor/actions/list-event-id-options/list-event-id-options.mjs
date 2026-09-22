import swapcard_exhibitor from "../../swapcard_exhibitor.app.mjs";

export default {
  key: "swapcard_exhibitor-list-event-id-options",
  name: "List Event ID Options",
  description: "Retrieves available options for the Event ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    swapcard_exhibitor,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await swapcard_exhibitor.propDefinitions.eventId.options
      .call(this.swapcard_exhibitor, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
