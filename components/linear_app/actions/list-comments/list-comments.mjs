import linearApp from "../../linear_app.app.mjs";
import fields from "../../common/fields.mjs";

// Documented Comment fields, used to validate `fields`.
const COMMENT_FIELDS = [
  "archivedAt",
  "body",
  "botActor",
  "children",
  "createdAt",
  "editedAt",
  "id",
  "issue",
  "parent",
  "reactionData",
  "resolvedAt",
  "resolvingUser",
  "updatedAt",
  "url",
  "user",
];

// Enough to read a discussion thread. Deliberately NOT `user`: on the SDK model that
// is a lazy relation getter, and the serialized response exposes the author under
// `_user` instead — naming `user` here produced an unresolved promise in the output.
const COMPACT_FIELDS = [
  "id",
  "body",
  "createdAt",
  "url",
];

export default {
  key: "linear_app-list-comments",
  name: "List Comments",
  description: "List comments in Linear. **Pass `issueId` to read one issue's discussion** — resolve the issue first with **Search Issues** or **Get Issue**. Without it this searches comments across the ENTIRE workspace, and a `body` search alone will surface unrelated comments from other teams that happen to share a word. **Response size matters here:** comment bodies are free text and each comment carries nested `user`, `issue` and `reactionData`; pass `fields: \"compact\"` (`id,body,createdAt,url`) to read a thread without the surrounding metadata. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Query?query=comments)",
  version: "0.2.2",
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
      description: "The issue whose comments you want. Strongly preferred over a bare `body` search — without it, the search runs across every team in the workspace.",
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
    fields: fields.fieldsProp({
      resource: "comments",
      compact: COMPACT_FIELDS,
      guidance: "The nested `issue` object and `reactionData` are repeated on every comment; request them only when you need more than the thread itself.",
    }),
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
      nodes: fields.projectRecords(nodes, this.fields, {
        compact: COMPACT_FIELDS,
        known: COMMENT_FIELDS,
      }),
      pageInfo,
    };
  },
};
