import kaleido from "../../kaleido.app.mjs";

export default {
  key: "kaleido-list-consortia-id-options",
  name: "List Consortia ID Options",
  description: "Retrieves available options for the Consortia ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    kaleido,
  },
  async run({ $ }) {
    const options = await kaleido.propDefinitions.consortiaId.options.call(this.kaleido);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
