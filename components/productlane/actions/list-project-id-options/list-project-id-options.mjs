import { productlane } from "../../productlane.app.mjs";

export default {
  key: "productlane-list-project-id-options",
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
    productlane,
  },
  async run({ $ }) {
    const options = await productlane.propDefinitions.projectId.options.call(this.productlane, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
