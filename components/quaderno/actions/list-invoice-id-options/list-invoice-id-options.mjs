import { quaderno } from "../../quaderno.app.mjs";

export default {
  key: "quaderno-list-invoice-id-options",
  name: "List Invoice ID Options",
  description: "Retrieves available options for the Invoice ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    quaderno,
  },
  async run({ $ }) {
    const options = await quaderno.propDefinitions.invoiceId.options.call(this.quaderno, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
