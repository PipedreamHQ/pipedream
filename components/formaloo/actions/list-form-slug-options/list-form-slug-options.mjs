import formaloo from "../../formaloo.app.mjs";

export default {
  key: "formaloo-list-form-slug-options",
  name: "List Form Slug Options",
  description: "Retrieves available options for the Form Slug field.",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    formaloo,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to retrieve.",
      min: 0,
      default: 0,
    },
  },
  async run({ $ }) {
    const options = await formaloo.propDefinitions.formSlug.options.call(this.formaloo, {
      page: this.page,
    });
    $.export("$summary", `Successfully retrieved ${options.length} option${options.length === 1
      ? ""
      : "s"}`);
    return options;
  },
};
