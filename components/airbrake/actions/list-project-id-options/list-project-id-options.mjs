import airbrake from "../../airbrake.app.mjs";

export default {
  key: "airbrake-list-project-id-options",
  name: "List Project ID Options",
  description: "Retrieves available options for the Project ID field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    airbrake,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      optional: true,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await airbrake.propDefinitions.projectId.options
      .call(this.airbrake, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
