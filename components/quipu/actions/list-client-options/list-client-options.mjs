import quipu from "../../quipu.app.mjs";

export default {
  key: "quipu-list-client-options",
  name: "List Client Options",
  description: "Retrieves available options for the Client field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    quipu,
  },
  async run({ $ }) {
    const options = await quipu.propDefinitions.client.options.call(this.quipu);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
