import microsoftEntraId from "../../microsoft_entra_id.app.mjs";

export default {
  key: "microsoft_entra_id-search-groups",
  name: "Search Groups",
  description: "Searches for groups by name or description. [See the documentation](https://learn.microsoft.com/en-us/graph/api/group-list?view=graph-rest-1.0&tabs=http)",
  version: "0.0.6",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    microsoftEntraId,
    query: {
      type: "string",
      label: "Search Query",
      description: "Keywords to search by",
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "The maximum number of groups to return",
      optional: true,
      default: 100,
    },
  },
  async run({ $ }) {
    const response = await this.microsoftEntraId.listGroups({
      params: {
        "$search": `"displayName:${this.query}" OR "description:${this.query}"`,
        "$top": this.maxResults,
      },
    });

    if (response.value?.length) {
      $.export("$summary", `Found ${response.value.length} group${response.value.length === 1
        ? ""
        : "s"} matching criteria.`);
    }

    return response;
  },
};
