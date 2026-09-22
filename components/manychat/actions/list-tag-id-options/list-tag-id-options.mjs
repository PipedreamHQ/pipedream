import manychat from "../../manychat.app.mjs";

export default {
  key: "manychat-list-tag-id-options",
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
    manychat,
  },
  async run({ $ }) {
    const options = await manychat.propDefinitions.tagId.options.call(this.manychat, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
