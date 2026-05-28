import freedcamp from "../../freedcamp.app.mjs";

export default {
  key: "freedcamp-list-project-id-options",
  name: "List Project ID Options",
  description: "Retrieves available options for the Project ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    freedcamp,
  },
  async run({ $ }) {
    const options = await freedcamp.propDefinitions.projectId.options.call(this.freedcamp, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
