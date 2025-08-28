import common from "../common/knowledge.mjs";

export default {
  ...common,
  key: "salesforce_rest_api-get-knowledge-data-category-details",
  name: "Get Knowledge Data Category Details",
  description: "Fetch details of a specific data category and its child categories. [See the documentation](https://developer.salesforce.com/docs/atlas.en-us.knowledge_dev.meta/knowledge_dev/resources_knowledge_support_dcdetail.htm)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    groupName: {
      type: "string",
      label: "Group Name",
      description: "The name of the data category group.",
    },
    categoryName: {
      type: "string",
      label: "Category Name",
      description: "The name of the data category.",
    },
  },
  async run({ $ }) {
    const {
      app,
      groupName,
      categoryName,
      language,
    } = this;

    const response = await app.getKnowledgeDataCategoryDetails({
      $,
      groupName,
      categoryName,
      params: {
        sObjectName: "KnowledgeArticleVersion",
      },
      headers: {
        ...app._makeRequestHeaders(),
        "Accept": "application/json",
        "Accept-Language": language || "en-US",
      },
    });

    $.export("$summary", "Successfully fetched details for category");
    return response;
  },
};
