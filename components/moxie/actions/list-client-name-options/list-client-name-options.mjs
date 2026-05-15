import moxie from "../../moxie.app.mjs";

export default {
  key: "moxie-list-client-name-options",
  name: "List Client Options",
  description: "Retrieves available options for the Client field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    moxie,
  },
  async run({ $ }) {
    const options = await moxie.propDefinitions.clientName.options.call(this.moxie);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
