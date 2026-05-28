import { sendspark } from "../../sendspark.app.mjs";

export default {
  key: "sendspark-list-dynamic-id-options",
  name: "List Dynamic ID Options",
  description: "Retrieves available options for the Dynamic ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    sendspark,
  },
  async run({ $ }) {
    const options = await sendspark.propDefinitions.dynamicId.options.call(this.sendspark, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
