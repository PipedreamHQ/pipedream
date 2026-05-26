import elmah_io from "../../elmah_io.app.mjs";

export default {
  key: "elmah_io-list-log-id-options",
  name: "List Log ID Options",
  description: "Retrieves available options for the Log ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    elmah_io,
  },
  async run({ $ }) {
    const options = await elmah_io.propDefinitions.logId.options.call(this.elmah_io);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
