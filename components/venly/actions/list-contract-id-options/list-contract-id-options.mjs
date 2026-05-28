import { venly } from "../../venly.app.mjs";

export default {
  key: "venly-list-contract-id-options",
  name: "List Contract ID Options",
  description: "Retrieves available options for the Contract ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    venly,
  },
  async run({ $ }) {
    const options = await venly.propDefinitions.contractId.options.call(this.venly, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
