import dealcloud from "../../dealcloud.app.mjs";

export default {
  key: "dealcloud-list-entry-type-id-options",
  name: "List Object ID Options",
  description: "Retrieves available options for the Object ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    dealcloud,
  },
  async run({ $ }) {
    const options = await dealcloud.propDefinitions.entryTypeId.options.call(this.dealcloud);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
