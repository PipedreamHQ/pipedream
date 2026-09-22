import microsoftTeams from "../../microsoft_teams.app.mjs";

export default {
  key: "microsoft_teams-search-messages",
  name: "Search Messages",
  description: "Search for email or chat messages. [See the documentation](https://learn.microsoft.com/en-us/graph/api/search-query?view=graph-rest-1.0&tabs=http)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    microsoftTeams,
    entityType: {
      type: "string",
      label: "Entity Type",
      description: "The type of entity to search for",
      options: [
        {
          label: "Email Messages",
          value: "message",
        },
        {
          label: "Chat Messages",
          value: "chatMessage",
        },
      ],
    },
    queryString: {
      type: "string",
      label: "Query String",
      description: "The query string to search for",
    },
    from: {
      type: "integer",
      label: "From",
      description: "The index of the first result to return",
      default: 0,
      optional: true,
    },
    size: {
      type: "integer",
      label: "Size",
      description: "The number of results to return",
      default: 25,
      max: 25,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.microsoftTeams.searchQuery({
      content: {
        requests: [
          {
            entityTypes: [
              this.entityType,
            ],
            query: {
              queryString: this.queryString,
            },
            from: this.from,
            size: this.size,
          },
        ],
      },
    });

    if (response.value[0].hitsContainers[0].hits?.length > 0) {
      $.export("$summary", `Successfully fetched ${response.value[0].hitsContainers[0].hits.length} result${response.value[0].hitsContainers[0].hits.length === 1
        ? ""
        : "s"}`);
    } else {
      $.export("$summary", "No results found");
    }

    return response;
  },
};
