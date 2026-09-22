import indiefunnels from "../../indiefunnels.app.mjs";

export default {
  key: "indiefunnels-list-subscriber-lists-options",
  name: "List Subscriber Lists Options",
  description: "Retrieves available options for the Subscriber Lists field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    indiefunnels,
  },
  async run({ $ }) {
    const options = await indiefunnels.propDefinitions.subscriberLists.options
      .call(this.indiefunnels);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
