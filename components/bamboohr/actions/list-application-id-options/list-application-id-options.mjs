import bamboohr from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-list-application-id-options",
  name: "List Application ID Options",
  description: "Retrieves available options for the Application ID field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bamboohr,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await bamboohr.propDefinitions.applicationId.options
      .call(this.bamboohr, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
