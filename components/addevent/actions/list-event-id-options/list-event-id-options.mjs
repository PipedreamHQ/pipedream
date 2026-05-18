import addevent from "../../addevent.app.mjs";

export default {
  key: "addevent-list-event-id-options",
  name: "List Event ID Options",
  description: "Retrieves available options for the Event ID field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    addevent,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await addevent.propDefinitions.eventId.options
      .call(this.addevent, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
