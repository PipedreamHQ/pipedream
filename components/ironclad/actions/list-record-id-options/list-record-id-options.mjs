import ironclad from "../../ironclad.app.mjs";

export default {
  key: "ironclad-list-record-id-options",
  name: "List Record ID Options",
  description: "Retrieves available options for the Record ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ironclad,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await ironclad.propDefinitions.recordId.options.call(this.ironclad, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
