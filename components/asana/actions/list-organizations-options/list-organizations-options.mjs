import asana from "../../asana.app.mjs";

export default {
  key: "asana-list-organizations-options",
  name: "List Organizations Options",
  description: "Retrieves available options for the Organizations field.",
  version: "0.0.3",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    asana,
  },
  async run({ $ }) {
    const options = await asana.propDefinitions.organizations.options.call(this.asana);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
