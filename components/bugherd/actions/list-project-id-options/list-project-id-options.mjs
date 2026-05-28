import { bugherd } from "../../bugherd.app.mjs";

export default {
  key: "bugherd-list-project-id-options",
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
    bugherd,
  },
  async run({ $ }) {
    const options = await bugherd.propDefinitions.projectId.options.call(this.bugherd, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
