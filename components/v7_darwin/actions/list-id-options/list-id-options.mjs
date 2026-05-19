import v7_darwin from "../../v7_darwin.app.mjs";

export default {
  key: "v7_darwin-list-id-options",
  name: "List Dataset ID Options",
  description: "Retrieves available options for the Dataset ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    v7_darwin,
  },
  async run({ $ }) {
    const options = await v7_darwin.propDefinitions.id.options.call(this.v7_darwin);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
