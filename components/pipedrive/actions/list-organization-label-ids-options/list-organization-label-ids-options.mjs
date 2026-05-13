import pipedrive from "../../pipedrive.app.mjs";

export default {
  key: "pipedrive-list-organization-label-ids-options",
  name: "List Organization Label IDs Options",
  description: "Retrieves available options for the Organization Label IDs field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pipedrive,
  },
  async run({ $ }) {
    const options = await pipedrive.propDefinitions.organizationLabelIds.options
      .call(this.pipedrive);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
