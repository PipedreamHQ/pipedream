import { bilflo } from "../../bilflo.app.mjs";

export default {
  key: "bilflo-list-client-id-options",
  name: "List Client ID Options",
  description: "Retrieves available options for the Client ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bilflo,
  },
  async run({ $ }) {
    const options = await bilflo.propDefinitions.clientId.options.call(this.bilflo, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
