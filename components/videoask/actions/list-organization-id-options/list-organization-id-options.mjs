import videoask from "../../videoask.app.mjs";

export default {
  key: "videoask-list-organization-id-options",
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
    videoask,
  },
  async run({ $ }) {
    const options = await videoask.propDefinitions.organizationId.options.call(this.videoask);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
