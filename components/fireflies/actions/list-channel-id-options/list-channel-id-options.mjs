// x-pd-ai: optimized
import fireflies from "../../fireflies.app.mjs";

export default {
  key: "fireflies-list-channel-id-options",
  name: "List Channel ID Options",
  description: "Retrieves available options for the Channel ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    fireflies,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await fireflies.propDefinitions.channelId.options.call(this.fireflies, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
