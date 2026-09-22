import productive_io from "../../productive_io.app.mjs";

export default {
  key: "productive_io-list-event-id-options",
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
    productive_io,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await productive_io.propDefinitions.eventId.options.call(this.productive_io, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
