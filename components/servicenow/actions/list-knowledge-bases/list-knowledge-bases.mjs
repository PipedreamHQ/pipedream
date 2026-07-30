import servicenow from "../../servicenow.app.mjs";

export default {
  key: "servicenow-list-knowledge-bases",
  name: "List Knowledge Bases",
  description: "List the knowledge bases in the instance, to find the `sys_id`s that scope a search on **Search Knowledge Base**. [See the documentation](https://www.servicenow.com/docs/r/zurich/api-reference/rest-apis/c_TableAPI.html)",
  version: "0.0.1",
  type: "action",
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    servicenow,
    activeOnly: {
      type: "boolean",
      label: "Active Only",
      description: "Return only active knowledge bases.",
      default: true,
      optional: true,
    },
    limit: {
      propDefinition: [
        servicenow,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.servicenow.listKnowledgeBases({
      $,
      params: {
        sysparm_query: this.activeOnly
          ? "active=true"
          : undefined,
        sysparm_fields: "sys_id,title,description,active,owner",
        sysparm_limit: this.limit,
      },
    });

    const knowledgeBases = Array.isArray(response)
      ? response
      : [];
    $.export("$summary", `Found ${knowledgeBases.length} knowledge base(s)`);

    return response;
  },
};
