import white_swan from "../../white_swan.app.mjs";

export default {
  key: "white_swan-list-client-email-options",
  name: "List Client Email Options",
  description: "Retrieves available options for the Client Email field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    white_swan,
  },
  async run({ $ }) {
    const options = await white_swan.propDefinitions.clientEmail.options.call(this.white_swan);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
