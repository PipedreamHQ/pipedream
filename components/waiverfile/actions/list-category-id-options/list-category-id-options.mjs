import { waiverfile } from "../../waiverfile.app.mjs";

export default {
  key: "waiverfile-list-category-id-options",
  name: "List Category ID Options",
  description: "Retrieves available options for the Category ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    waiverfile,
  },
  async run({ $ }) {
    const options = await waiverfile.propDefinitions.categoryId.options.call(this.waiverfile, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
