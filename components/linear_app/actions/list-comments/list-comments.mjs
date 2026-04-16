import linearApp from "../../linear_app.app.mjs";

export default {
  key: "linear_app-list-comments",
  name: "List Comments",
  description: "List comments in Linear. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=comments)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    linearApp,
    teamId: {
      propDefinition: [
        linearApp,
        "teamId",
      ],
      description: "Filter issue selection by team",
      optional: true,
    },
    issueId: {
      propDefinition: [
        linearApp,
        "issueId",
        (c) => ({
          teamId: c.teamId,
        }),
      ],
      description: "Filter results by issue",
      optional: true,
    },
    body: {
      type: "string",
      label: "Body",
      description: "Search for comments containing this text",
      optional: true,
    },
    orderBy: {
      propDefinition: [
        linearApp,
        "orderBy",
      ],
    },
    first: {
      type: "integer",
      label: "First",
      description: "The number of comments to return",
      optional: true,
    },
    after: {
      type: "string",
      label: "After",
      description: "The cursor to return the next page of comments",
      optional: true,
    },
  },
  async run({ $ }) {
    const variables = {
      filter: {
        issue: {
          id: {
            eq: this.issueId,
          },
        },
        body: {
          contains: this.body,
        },
      },
      orderBy: this.orderBy,
      first: this.first,
      after: this.after,
    };

    const {
      nodes, pageInfo,
    } = await this.linearApp.listComments(variables);

    $.export("$summary", `Found ${nodes.length} comments`);

    return {
      nodes,
      pageInfo,
    };
  },
};
