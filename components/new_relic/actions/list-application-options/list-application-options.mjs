import new_relic from "../../new_relic.app.mjs";

export default {
  key: "new_relic-list-application-options",
  name: "List Application ID Options",
  description: "Retrieves available options for the Application ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    new_relic,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await new_relic.propDefinitions.application.options.call(this.new_relic, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
