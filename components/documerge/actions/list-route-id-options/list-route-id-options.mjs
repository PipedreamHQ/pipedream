import documerge from "../../documerge.app.mjs";

export default {
  key: "documerge-list-route-id-options",
  name: "List Route ID Options",
  description: "Retrieves available options for the Route ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    documerge,
  },
  async run({ $ }) {
    const options = await documerge.propDefinitions.routeId.options.call(this.documerge);
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
