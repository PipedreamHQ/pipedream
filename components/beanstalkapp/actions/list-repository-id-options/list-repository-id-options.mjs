import beanstalkapp from "../../beanstalkapp.app.mjs";

export default {
  key: "beanstalkapp-list-repository-id-options",
  name: "List Repository ID Options",
  description: "Retrieves available options for the Repository ID field.",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    beanstalkapp,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      optional: true,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await beanstalkapp.propDefinitions.repositoryId.options
      .call(this.beanstalkapp, {
        page: this.page,
      });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
