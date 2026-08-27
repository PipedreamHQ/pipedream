// x-pd-ai: optimized
import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-list-teams",
  name: "List Teams",
  description:
    "Return the full list of teams (workspaces) accessible to the connected account,"
    + " with pagination (`has_more`/`next_cursor`) so you know whether there could be more"
    + " than what came back. Use this — not **Get User Details** or **Get Current User**, which"
    + " only ever describe the caller's single current team — whenever the task asks to"
    + " enumerate, count, or check for multiple teams/workspaces, especially on an"
    + " Enterprise Grid org-wide token. Use the returned `id` (e.g. `T1234567890`)"
    + " wherever a Team ID is required."
    + " Returns `has_more: true` and `next_cursor` when more teams exist than were"
    + " fetched — raise `numPages` (or pass `cursor`) to see the rest."
    + " [See the documentation](https://api.slack.com/methods/auth.teams.list)",
  version: "0.0.1",
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
    const teams = [];
    const params = {
      limit: this.pageSize,
      cursor: this.cursor,
    };
    let page = 0;
    let nextCursor;

    do {
      const {
        teams: fetched, response_metadata: metadata,
      } = await this.slack.authTeamsList(params);
      teams.push(...fetched.map(({
        id, name,
      }) => ({
        id,
        name,
      })));
      nextCursor = metadata?.next_cursor;
      params.cursor = nextCursor;
      page++;
    } while (params.cursor && page < this.numPages);

    const hasMore = Boolean(nextCursor);

    $.export("$summary", `Successfully found ${teams.length} team${teams.length === 1
      ? ""
      : "s"}${hasMore
      ? " (more available — raise Number of Pages or pass the cursor)"
      : ""}`);

    return {
      teams,
      has_more: hasMore,
      ...(hasMore
        ? {
          next_cursor: nextCursor,
        }
        : {}),
    };
  },
};
