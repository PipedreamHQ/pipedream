import hotmart from "../../hotmart.app.mjs";

export default {
  key: "hotmart-list-subscriber-code-options",
  name: "List Subscriber Code Options",
  description: "Retrieves available options for the Subscriber Code field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    hotmart,
  },
  async run({ $ }) {
    const options = await hotmart.propDefinitions.subscriberCode.options.call(this.hotmart);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
