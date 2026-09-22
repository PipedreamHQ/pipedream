import oto from "../../oto.app.mjs";

export default {
  key: "oto-list-brand-name-options",
  name: "List Brand Name Options",
  description: "Retrieves available options for the Brand Name field.",
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
    const options = await oto.propDefinitions.brandName.options.call(this.oto);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
