import diffy from "../../diffy.app.mjs";

export default {
  key: "diffy-list-project-id-options",
  name: "List Project Options",
  description: "Retrieves available options for the Project field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    diffy,
  },
  async run({ $ }) {
    const options = await diffy.propDefinitions.projectId.options.call(this.diffy);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
