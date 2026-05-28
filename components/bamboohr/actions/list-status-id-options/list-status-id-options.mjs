import { bamboohr } from "../../bamboohr.app.mjs";

export default {
  key: "bamboohr-list-status-id-options",
  name: "List Status ID Options",
  description: "Retrieves available options for the Status ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    bamboohr,
  },
  async run({ $ }) {
    const options = await bamboohr.propDefinitions.statusId.options.call(this.bamboohr, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
