import { convenia } from "../../convenia.app.mjs";

export default {
  key: "convenia-list-employee-id-options",
  name: "List Employee ID Options",
  description: "Retrieves available options for the Employee ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    convenia,
  },
  async run({ $ }) {
    const options = await convenia.propDefinitions.employeeId.options.call(this.convenia, {});
    $.export("$summary", `Successfully retrieved ${options.length} option${
      options.length === 1
        ? ""
        : "s"
    }`);
    return options;
  },
};
