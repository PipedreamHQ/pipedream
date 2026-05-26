import coupontools from "../../coupontools.app.mjs";

export default {
  key: "coupontools-list-directory-id-options",
  name: "List Directory ID Options",
  description: "Retrieves available options for the Directory ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    coupontools,
  },
  async run({ $ }) {
    const options = await coupontools.propDefinitions.directoryId.options.call(this.coupontools);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
