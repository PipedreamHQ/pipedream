import dixa from "../../dixa.app.mjs";

export default {
  key: "dixa-list-tag-id-options",
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
    dixa,
  },
  async run({ $ }) {
    const options = await dixa.propDefinitions.tagId.options.call(this.dixa, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
