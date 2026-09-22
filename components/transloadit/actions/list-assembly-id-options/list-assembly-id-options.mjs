import transloadit from "../../transloadit.app.mjs";

export default {
  key: "transloadit-list-assembly-id-options",
  name: "List Assembly ID Options",
  description: "Retrieves available options for the Assembly ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    transloadit,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await transloadit.propDefinitions.assemblyId.options.call(this.transloadit, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
