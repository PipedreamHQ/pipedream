import app from "../../_4dem.app.mjs";

export default {
  key: "_4dem-list-sender-id-options",
  name: "List Sender ID Options",
  description: "Retrieves available options for the Sender ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
  },
  async run({ $ }) {
    const options = await app.propDefinitions.senderId.options.call(this.app, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
