import app from "../../lever.app.mjs";

export default {
  key: "lever-list-feedback-templates",
  name: "List Feedback Templates",
  description:
    "Returns the feedback form templates configured in the Lever account, including each template's field definitions."
    + " Use this before **Submit Feedback** to resolve the `baseTemplateId` and the field IDs required for `fieldValues` — without it those IDs are unknown."
    + " Returns each template's id, text (name), and fields (each with an id, type, and prompt text)."
    + " Returns one page (up to `limit`); if the response's `hasNext` is true, pass its `next` value to `offset` to fetch the following page."
    + " Example: call with no arguments → returns templates like `{ id: \"<templateId>\", text: \"Onsite Interview\", fields: [{ id: \"<fieldId>\", type: \"score-system\", text: \"Overall\" }] }`; pass that template id as `baseTemplateId` and the field ids inside `fieldValues` when calling **Submit Feedback**."
    + " [See the documentation](https://hire.lever.co/developer/documentation#feedback-templates)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
      description: "Maximum number of templates to return (1–100). Defaults to 100.",
    },
    offset: {
      propDefinition: [
        app,
        "offset",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listFeedbackTemplates({
      $,
      params: {
        limit: this.limit,
        offset: this.offset,
      },
    });
    const templates = response.data ?? response;
    $.export("$summary", `Retrieved ${templates.length} feedback template${templates.length === 1
      ? ""
      : "s"}`);
    return response;
  },
};
