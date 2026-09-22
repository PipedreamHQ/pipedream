import edusign from "../../edusign.app.mjs";

export default {
  key: "edusign-list-classroom-id-options",
  name: "List Classroom ID Options",
  description: "Retrieves available options for the Classroom ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    edusign,
  },
  async run({ $ }) {
    const options = await edusign.propDefinitions.classroomId.options.call(this.edusign);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
