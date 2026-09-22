import mailosaur from "../../mailosaur.app.mjs";

export default {
  key: "mailosaur-list-server-id-options",
  name: "List Server ID Options",
  description: "Retrieves available options for the Server ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    mailosaur,
  },
  async run({ $ }) {
    const options = await mailosaur.propDefinitions.serverId.options.call(this.mailosaur);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
