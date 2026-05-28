import intercom from "../../intercom.app.mjs";

export default {
  key: "intercom-list-tag-id-options",
  name: "List Tag ID Options",
  description: "Retrieves available options for the Tag ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    intercom,
  },
  async run({ $ }) {
    const options = await intercom.propDefinitions.tagId.options.call(this.intercom);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
