import common from "../common/knowledge.mjs";

export default {
  ...common,
  key: "salesforce_rest_api-get-knowledge-data-category-groups",
  name: "Get Knowledge Data Category Groups",
  description: "Fetch data category groups visible to the current user. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.knowledge_dev.meta/knowledge_dev/resources_knowledge_support_dcgroups.htm)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    topCategoriesOnly: {
      type: "boolean",
      label: "Top Categories Only",
      description: "Return only top-level categories if `true`, entire tree if `false`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      app,
      topCategoriesOnly,
      language,
    } = this;

    const response = await app.getKnowledgeDataCategoryGroups({
      $,
      params: {
        sObjectName: "KnowledgeArticleVersion",
        topCategoriesOnly,
      },
      headers: {
        ...app._makeRequestHeaders(),
        "Accept": "application/json",
        "Accept-Language": language || "en-US",
      },
    });

    $.export("$summary", `Successfully fetched \`${response.categoryGroups?.length || 0}\` data category groups`);
    return response;
  },
};
