import pipefy from "../../pipefy.app.mjs";

export default {
  key: "pipefy-list-organization-options",
  name: "List Organization Options",
  description: "Retrieves available options for the Organization field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    pipefy,
  },
  async run({ $ }) {
    const options = await pipefy.propDefinitions.organization.options.call(this.pipefy);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
