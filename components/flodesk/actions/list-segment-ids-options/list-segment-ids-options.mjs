import flodesk from "../../flodesk.app.mjs";

export default {
  key: "flodesk-list-segment-ids-options",
  name: "List Segments Options",
  description: "Retrieves available options for the Segments field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    flodesk,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await flodesk.propDefinitions.segmentIds.options.call(this.flodesk, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
