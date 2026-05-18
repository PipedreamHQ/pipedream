import airtop from "../../airtop.app.mjs";

export default {
  key: "airtop-list-session-id-options",
  name: "List Session ID Options",
  description: "Retrieves available options for the Session ID field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    airtop,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      optional: true,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await airtop.propDefinitions.sessionId.options
      .call(this.airtop, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
