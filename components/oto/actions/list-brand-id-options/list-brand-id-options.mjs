import oto from "../../oto.app.mjs";

export default {
  key: "oto-list-brand-id-options",
  name: "List Brand ID Options",
  description: "Retrieves available options for the Brand ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    oto,
  },
  async run({ $ }) {
    const options = await oto.propDefinitions.brandId.options.call(this.oto);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
