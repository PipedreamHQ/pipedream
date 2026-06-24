import twenty from "../../twenty.app.mjs";

export default {
  key: "twenty-list-record-id-options",
  name: "List Record ID Options",
  description: "Retrieves available options for the Record ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    twenty,
  },
  async run({ $ }) {
    const options = await twenty.propDefinitions.recordId.options.call(this.twenty, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
