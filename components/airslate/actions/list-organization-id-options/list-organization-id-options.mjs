import airslate from "../../airslate.app.mjs";

export default {
  key: "airslate-list-organization-id-options",
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
    airslate,
  },
  async run({ $ }) {
    const options = await airslate.propDefinitions.organizationId.options.call(this.airslate, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
