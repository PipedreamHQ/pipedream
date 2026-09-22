import pointagram from "../../pointagram.app.mjs";

export default {
  key: "pointagram-list-score-series-id-options",
  name: "List Score Series ID Options",
  description: "Retrieves available options for the Score Series ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pointagram,
  },
  async run({ $ }) {
    const options = await pointagram.propDefinitions.scoreSeriesId.options.call(this.pointagram);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
