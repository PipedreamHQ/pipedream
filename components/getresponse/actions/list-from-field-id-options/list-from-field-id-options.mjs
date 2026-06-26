import getresponse from "../../getresponse.app.mjs";

export default {
  key: "getresponse-list-from-field-id-options",
  name: "List From Field ID Options",
  description: "Retrieves available options for the From Field ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    getresponse,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await getresponse.propDefinitions.fromFieldId.options.call(this.getresponse, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
