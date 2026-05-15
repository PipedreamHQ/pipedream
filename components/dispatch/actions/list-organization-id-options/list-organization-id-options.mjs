import dispatch from "../../dispatch.app.mjs";

export default {
  key: "dispatch-list-organization-id-options",
  name: "List Organization ID Options",
  description: "Retrieves available options for the Organization ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dispatch,
  },
  async run({ $ }) {
    const options = await dispatch.propDefinitions.organizationId.options.call(this.dispatch);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
