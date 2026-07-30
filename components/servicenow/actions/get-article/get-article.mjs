import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow-get-article",
  name: "Get Article",
  description: "Retrieve a single knowledge article, including its entire HTML body (`content`). Run **Search Knowledge Base** first to find an article, then pass its `number` or `sys_id` here. The `attachments` array is only returned when the article record has `display_attachments` enabled. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/knowledge-api.html)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    servicenow,
    articleId: {
      type: "string",
      label: "Article ID",
      description: "The `sys_id` or the KB number of the article to retrieve. **Search Knowledge Base** returns both: use its `number` (example: `KB0000017`), or the `sys_id` portion of its `id` (an `id` of `kb_knowledge:3b07857187032100deddb882a2e3ec20` means a `sys_id` of `3b07857187032100deddb882a2e3ec20`).",
    },
    fields: {
      propDefinition: [
        servicenow,
        "fields",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.servicenow.getKnowledgeArticle({
      $,
      articleId: this.articleId,
      params: {
        fields: this.fields?.join(","),
      },
    });

    $.export("$summary", `Successfully retrieved article \`${response?.number || this.articleId}\``);

    return response;
  },
};
