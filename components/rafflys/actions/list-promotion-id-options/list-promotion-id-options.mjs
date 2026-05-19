import rafflys from "../../rafflys.app.mjs";

export default {
  key: "rafflys-list-promotion-id-options",
  name: "List Promotion ID Options",
  description: "Retrieves available options for the Promotion ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    rafflys,
  },
  async run({ $ }) {
    const options = await rafflys.propDefinitions.promotionId.options.call(this.rafflys);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
