import codeqr from "../../codeqr.app.mjs";

export default {
  key: "codeqr-list-link-id-options",
  name: "List Link ID Options",
  description: "Retrieves available options for the Link ID field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    codeqr,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await codeqr.propDefinitions.linkId.options.call(this.codeqr, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
