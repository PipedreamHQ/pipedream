import freedcamp from "../../freedcamp.app.mjs";

export default {
  key: "freedcamp-list-group-id-options",
  name: "List Group ID Options",
  description: "Retrieves available options for the Group ID field.",
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
    const options = await freedcamp.propDefinitions.groupId.options.call(this.freedcamp);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
