import servicenow from "../../servicenow.app.mjs";
import { knowledgeArticleUrl } from "../../common/utils.mjs";

export default {
  key: "servicenow-get-article",
  name: "Get Article",
  description: "Retrieve a single knowledge article, including its entire HTML body (`content`), as the connected user: ServiceNow applies the article's and its knowledge base's Can Read and Cannot Read criteria. Run **Search Knowledge Base** first to find an article, then pass its `number` or `sys_id` here. When the connected user may not read the article, or it does not exist, the response is `{ \"error_msg\": \"Knowledge article not found\" }` instead of the article. Users who can manage the knowledge base also get draft and retired articles; check `workflow_state` if only published articles should be used. Pass `fields` to limit the response when only checking access. The view count is not changed. Also returns `url`, a link to the article on the instance that you can share with users (omitted when the article is not found). The `attachments` array is only returned when the article record has `display_attachments` enabled. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/knowledge-api.html)",
  version: "0.1.2",
  type: "action",
  ai: "optimized",
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

    if (!response?.sys_id) {
      return response;
    }

    return {
      ...response,
      url: knowledgeArticleUrl(this.servicenow._instanceBaseUrl(), response.sys_id),
    };
  },
};
