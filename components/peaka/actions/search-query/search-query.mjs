import app from "../../peaka.app.mjs";

export default {
  key: "peaka-search-query",
  name: "Search Query",
  description: "Performs a search for a specific query in Peaka and returns the matches as rows. [See the documentation](https://docs.peaka.com/api-reference/data-%3E-query/list-queries).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    term: {
      type: "string",
      label: "Query Term",
      description: "The term to search for in queries.",
    },
  },
  methods: {
    listQueries({
      projectId, ...args
    } = {}) {
      return this.app._makeRequest({
        path: `/data/projects/${projectId}/queries`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      listQueries,
      projectId,
      term,
    } = this;

    const response = await listQueries({
      $,
      projectId,
    });

    const matches = response?.filter(({
      name, displayName, queryType, inputQuery,
    }) => {
      return name.includes(term)
        || displayName.includes(term)
        || queryType.includes(term)
        || inputQuery.includes(term);
    });

    if (!matches.length) {
      $.export("$summary", "No queries found matching the term.");
      return [];
    }

    $.export("$summary", `Successfully found ${matches.length} queries matching the query term.`);
    return matches;
  },
};
