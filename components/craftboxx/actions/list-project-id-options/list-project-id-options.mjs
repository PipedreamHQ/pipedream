import craftboxx from "../../craftboxx.app.mjs";

export default {
  key: "craftboxx-list-project-id-options",
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
    craftboxx,
    page: {
      propDefinition: [
        craftboxx,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const options = await craftboxx.propDefinitions.projectId.options.call(this.craftboxx, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
