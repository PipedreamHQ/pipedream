import { short } from "../../short.app.mjs";

export default {
  key: "short-list-domain-options",
  name: "List Domain Options",
  description: "Retrieves available options for the Domain field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    short,
  },
  async run({ $ }) {
    const options = await short.propDefinitions.domain.options.call(this.short, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
