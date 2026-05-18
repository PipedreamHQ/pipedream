import onelogin from "../../onelogin.app.mjs";

export default {
  key: "onelogin-list-event-type-options",
  name: "List Event Type Options",
  description: "Retrieves available options for the Event Type field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    onelogin,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await onelogin.propDefinitions.eventType.options.call(this.onelogin, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
