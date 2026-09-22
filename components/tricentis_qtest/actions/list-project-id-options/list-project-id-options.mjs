import tricentis_qtest from "../../tricentis_qtest.app.mjs";

export default {
  key: "tricentis_qtest-list-project-id-options",
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
    tricentis_qtest,
  },
  async run({ $ }) {
    const options = await tricentis_qtest.propDefinitions.projectId.options
      .call(this.tricentis_qtest);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
