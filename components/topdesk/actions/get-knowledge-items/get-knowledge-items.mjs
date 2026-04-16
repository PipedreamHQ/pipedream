import app from "../../topdesk.app.mjs";

export default {
  key: "topdesk-get-knowledge-items",
  name: "Get Knowledge Items",
  description: "Returns a list of Knowledge Items. [See the documentation](https://developers.topdesk.com/explorer/?page=knowledge-base#/Knowledge%20Items/getKnowledgeItems)",
  version: "0.0.3",
  type: "action",
  props: {
    app,
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of knowledge items to return. Leave empty to return all items.",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Additional fields to include in the response. ID and number are always included.",
      optional: true,
      options: [
        "parent",
        "visibility",
        "urls",
        "news",
        "manager",
        "status",
        "standardSolution",
        "externalLink",
        "language",
        "title",
        "description",
        "content",
        "commentsForOperators",
        "keywords",
        "creator",
        "modifier",
        "creationDate",
        "modificationDate",
        "translation.creator",
        "translation.modifier",
        "translation.creationDate",
        "translation.modificationDate",
        "availableTranslations",
      ],
    },
    query: {
      type: "string",
      label: "Query",
      description: `A FIQL query to filter the response. Use semicolons to combine multiple conditions.

**Available filter fields:**
- \`parent.id\`, \`parent.number\`
- \`visibility.sspVisibility\`, \`visibility.sspVisibleFrom\`, \`visibility.sspVisibleUntil\`
- \`visibility.sspVisibilityFilteredOnBranches\`, \`visibility.operatorVisibilityFilteredOnBranches\`
- \`visibility.publicKnowledgeItem\`, \`visibility.branches.id\`, \`visibility.branches.name\`
- \`manager.id\`, \`manager.name\`
- \`status.id\`, \`status.name\`
- \`standardSolution.id\`, \`standardSolution.name\`
- \`externalLink.id\`, \`externalLink.type\`, \`externalLink.date\`
- \`archived\`, \`news\`

**Operators:**
- \`==\` (equals), \`!=\` (not equals)
- \`=gt=\` (greater than), \`=ge=\` (greater than or equal)
- \`=lt=\` (less than), \`=le=\` (less than or equal)
- \`=in=\` (in list), \`=out=\` (not in list)

**Example:** \`parent.id==3fa85f64-5717-4562-b3fc-2c963f66afa6;externalLink.id=in=(oneTool,otherTool)\`

[See the documentation](https://developers.topdesk.com/explorer/?page=knowledge-base#/Knowledge%20Items/getKnowledgeItems) for more information.`,
      optional: true,
    },
    language: {
      type: "string",
      label: "Language",
      description: "The language of the Knowledge Item content, in BCP 47 format (e.g., `en`)",
      optional: true,
    },
  },
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  async run({ $ }) {
    const {
      app,
      maxResults,
      fields,
      query,
      language,
    } = this;

    const items = [];
    const paginator = app.paginate({
      fn: app.listKnowledgeItems,
      fnArgs: {
        $,
        params: {
          fields: Array.isArray(fields) && fields?.length
            ? fields.join(",")
            : typeof fields === "string" && fields.length
              ? fields
              : undefined,
          query,
          language,
          page_size: 100,
        },
      },
      maxResults,
      dataField: "item",
    });

    for await (const item of paginator) {
      items.push(item);
    }

    $.export("$summary", `Successfully retrieved \`${items.length}\` knowledge item(s)`);

    return items;
  },
};
