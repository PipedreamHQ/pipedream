import linearApp from "../../linear_app.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "linear_app-list-comments",
  name: "List Comments",
  description: "List comments in Linear, optionally filtered by issue or body text. Returns comment objects with `id`, `body`, `createdAt`, and author details. Supports pagination via `first`/`after`. Use **Search Issues** to find an issue ID to filter by. Example: `issueId: \"iss_01abc\", body: \"PR #\"` → returns `{nodes: [{id: \"cmt_xyz\", body: \"Fixed in PR #123.\", createdAt: \"2024-01-15T10:00:00Z\"}], pageInfo: {endCursor: \"...\", hasNextPage: false}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=comments)",
  version: "0.1.0",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    linearApp,
    issueId: {
      propDefinition: [
        linearApp,
        "issueId",
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
    fields: {
      type: "string[]",
      label: "Fields",
      description: "Optional list of field names to include in each returned comment object. When omitted, the full comment payload is returned. Pass a subset to reduce response size, e.g. `[\"id\", \"body\", \"createdAt\"]`.",
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
      nodes: nodes.map((comment) => utils.pickFields(comment, this.fields)),
      pageInfo,
    };
  },
};
