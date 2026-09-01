// x-pd-ai: optimized
import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-list-group-conversations",
  name: "List Group Conversations",
  description:
    "Return a list of multi-person direct message (group DM) conversations the connected"
    + " account is a member of. Use the returned `id` (e.g. `G1234567890`) wherever a Group"
    + " conversation ID is required."
    + " Returns `has_more: true` and `next_cursor` when more conversations exist than were"
    + " fetched — raise `numPages` (or pass `cursor`) to see the rest."
    + " [See the documentation](https://api.slack.com/methods/conversations.list)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    slack,
    pageSize: {
      propDefinition: [
        slack,
        "pageSize",
      ],
    },
    numPages: {
      propDefinition: [
        slack,
        "numPages",
      ],
    },
    cursor: {
      propDefinition: [
        slack,
        "cursor",
      ],
    },
  },
  async run({ $ }) {
    const groups = [];
    const params = {
      types: "mpim",
      limit: this.pageSize,
      cursor: this.cursor,
    };
    let page = 0;
    let nextCursor;

    do {
      const {
        channels, response_metadata: metadata,
      } = await this.slack.conversationsList(params);
      groups.push(...channels.map(({
        id, purpose, is_archived: isArchived,
      }) => ({
        id,
        purpose: purpose?.value,
        is_archived: isArchived,
      })));
      nextCursor = metadata?.next_cursor;
      params.cursor = nextCursor;
      page++;
    } while (params.cursor && page < this.numPages);

    const hasMore = Boolean(nextCursor);

    $.export("$summary", `Successfully found ${groups.length} group conversation${groups.length === 1
      ? ""
      : "s"}${hasMore
      ? " (more available — raise Number of Pages or pass the cursor)"
      : ""}`);

    return {
      groups,
      has_more: hasMore,
      ...(hasMore
        ? {
          next_cursor: nextCursor,
        }
        : {}),
    };
  },
};
