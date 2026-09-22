import cogmento from "../../cogmento.app.mjs";

export default {
  key: "cogmento-list-user-ids-options",
  name: "List User IDs Options",
  description: "Retrieves available options for the User IDs field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    cogmento,
  },
  async run({ $ }) {
    const options = await cogmento.propDefinitions.userIds.options.call(this.cogmento);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
