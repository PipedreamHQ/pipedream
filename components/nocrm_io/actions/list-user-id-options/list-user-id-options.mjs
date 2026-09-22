import nocrm_io from "../../nocrm_io.app.mjs";

export default {
  key: "nocrm_io-list-user-id-options",
  name: "List User ID Options",
  description: "Retrieves available options for the User ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    nocrm_io,
  },
  async run({ $ }) {
    const options = await nocrm_io.propDefinitions.userId.options.call(this.nocrm_io);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
