import { woovi } from "../../woovi.app.mjs";

export default {
  key: "woovi-list-charge-id-options",
  name: "List Charge ID Options",
  description: "Retrieves available options for the Charge ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    woovi,
  },
  async run({ $ }) {
    const options = await woovi.propDefinitions.chargeId.options.call(this.woovi, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
