import security_reporter from "../../security_reporter.app.mjs";

export default {
  key: "security_reporter-list-client-id-options",
  name: "List Client ID Options",
  description: "Retrieves available options for the Client ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    security_reporter,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await security_reporter.propDefinitions.clientId.options
      .call(this.security_reporter, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
