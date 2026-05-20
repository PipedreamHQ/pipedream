import botconversa from "../../botconversa.app.mjs";

export default {
  key: "botconversa-list-subscriber-id-options",
  name: "List Subscriber Id Options",
  description: "Retrieves available options for the Subscriber Id field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    botconversa,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await botconversa.propDefinitions.subscriberId.options.call(this.botconversa, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
