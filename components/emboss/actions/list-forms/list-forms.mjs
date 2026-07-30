import emboss from "../../emboss.app.mjs";

export default {
  key: "emboss-list-forms",
  name: "List Forms",
  description: "List the forms in your Emboss account (id, title, status). Use this to look up a `form_id` for **Fill Existing Form**, instead of typing it in by hand. [See the documentation](https://getemboss.ai/docs/reference/create-form)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    emboss,
    page: {
      type: "integer",
      label: "Page",
      description: "The page of results to fetch. Defaults to the first page.",
      optional: true,
    },
  },
  async run({ $ }) {
    const { forms = [] } = await this.emboss.listForms({
      $,
      params: {
        page: this.page,
      },
    });
    $.export("$summary", `Found ${forms.length} form(s)`);
    return forms;
  },
};
