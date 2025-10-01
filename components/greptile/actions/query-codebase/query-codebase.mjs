import app from "../../greptile.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "greptile-query-codebase",
  name: "Query Codebase",
  description: "Search the user's codebase using a natural language query. [See the documentation](https://docs.greptile.com/apps/overview)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    query: {
      type: "string",
      label: "Query",
      description: "A string containing the question in natural language.",
    },
    repositories: {
      type: "string[]",
      label: "Repositories",
      description: "List of repositories indexed in Greptile to reference while answering your question. Array of JSON objects with keys `remote`, `branch` and `repository` eg. `{\"remote\":\"github\",\"branch\":\"main\",\"repository\":\"PipedreamHQ/pipedream\"}`",
    },
    sessionId: {
      type: "string",
      label: "Session ID",
      description: "Only use this if you intend to need to retrieve chat history later.",
      optional: true,
    },
    genius: {
      type: "boolean",
      label: "Genius",
      description: "Genius requests are smarter but 8-10 seconds slower, great for complex usecases like reviewing PR and updating technical docs.",
      optional: true,
    },
  },
  methods: {
    queryCodebase(args = {}) {
      return this.app.post({
        path: "/query",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      queryCodebase,
      query,
      repositories,
      sessionId,
      genius,
    } = this;

    const response = await queryCodebase({
      $,
      data: {
        messages: [
          {
            content: query,
          },
        ],
        repositories: utils.parseArray(repositories),
        sessionId,
        genius,
      },
    });
    $.export("$summary", "Successfully queried the codebase.");
    return response;
  },
};
