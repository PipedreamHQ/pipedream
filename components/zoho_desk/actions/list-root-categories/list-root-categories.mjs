import zohoDesk from "../../zoho_desk.app.mjs";
export default {
  key: "zoho_desk-list-root-categories",
  name: "List Root Categories",
  description: "Lists root knowledge base categories for a help center. [See the documentation](https://desk.zoho.com/portal/APIDocument.do#KnowledgeBase_Listallrootcategoriesofthehelpcenter)",
  type: "action",
  version: "0.0.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    zohoDesk,
    orgId: {
      propDefinition: [
        zohoDesk,
        "orgId",
      ],
    },
    portalId: {
      propDefinition: [
        zohoDesk,
        "portalId",
        ({ orgId }) => ({
          orgId,
        }),
      ],
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Sort the categories by the specified attribute.",
      optional: true,
      options: [
        "name",
        "order",
      ],
    },
    searchValue: {
      type: "string",
      label: "Search Value",
      description: "Filter categories whose names match the provided value.",
      optional: true,
    },
    visibility: {
      type: "string",
      label: "Visibility",
      description: "Filter categories by visibility (e.g. ALL_USERS).",
      optional: true,
    },
    departmentId: {
      propDefinition: [
        zohoDesk,
        "departmentId",
      ],
      description: "Filter categories associated with the specified department.",
      optional: true,
    },
    hasArticles: {
      type: "boolean",
      label: "Has Articles",
      description: "Return only categories that contain articles when set to `true`.",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        zohoDesk,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const {
      portalId,
      sortBy,
      searchValue,
      visibility,
      departmentId,
      hasArticles,
      maxResults,
    } = this;

    const params = {
      portalId,
      sortBy,
      searchValue,
      visibility,
      departmentId,
      hasArticles,
    };

    const stream = this.zohoDesk.listKnowledgeBaseRootCategoriesStream({
      params,
      max: maxResults,
    });
    const categories = [];
    for await (const category of stream) {
      categories.push(category);
    }

    $.export("$summary", `Retrieved ${categories.length} root categor${categories.length === 1
      ? "y"
      : "ies"}.`);

    return categories;
  },
};
