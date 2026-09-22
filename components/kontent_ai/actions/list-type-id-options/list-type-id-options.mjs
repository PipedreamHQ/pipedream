import kontent_ai from "../../kontent_ai.app.mjs";

export default {
  key: "kontent_ai-list-type-id-options",
  name: "List Type Id Options",
  description: "Retrieves available options for the Type Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    kontent_ai,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await kontent_ai.propDefinitions.typeId.options.call(this.kontent_ai, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
