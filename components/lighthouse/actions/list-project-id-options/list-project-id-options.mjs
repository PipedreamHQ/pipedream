import lighthouse from "../../lighthouse.app.mjs";

export default {
  key: "lighthouse-list-project-id-options",
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
    lighthouse,
  },
  async run({ $ }) {
    const options = await lighthouse.propDefinitions.projectId.options.call(this.lighthouse, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
