import squarespace from "../../squarespace.app.mjs";

export default {
  key: "squarespace-list-store-page-id-options",
  name: "List Store Page ID Options",
  description: "Retrieves available options for the Store Page ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    squarespace,
  },
  async run({ $ }) {
    const options = await squarespace.propDefinitions.storePageId.options.call(this.squarespace);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
