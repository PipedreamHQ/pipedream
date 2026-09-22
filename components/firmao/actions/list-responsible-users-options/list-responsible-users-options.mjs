import firmao from "../../firmao.app.mjs";

export default {
  key: "firmao-list-responsible-users-options",
  name: "List Responsible Users Options",
  description: "Retrieves available options for the Responsible Users field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    firmao,
  },
  async run({ $ }) {
    const options = await firmao.propDefinitions.responsibleUsers.options.call(this.firmao);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
