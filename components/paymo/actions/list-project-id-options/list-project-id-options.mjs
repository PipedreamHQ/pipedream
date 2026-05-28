import { paymo } from "../../paymo.app.mjs";

export default {
  key: "paymo-list-project-id-options",
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
    paymo,
  },
  async run({ $ }) {
    const options = await paymo.propDefinitions.projectId.options.call(this.paymo, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
