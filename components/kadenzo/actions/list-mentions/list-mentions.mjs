import kadenzo from "../../kadenzo.app.mjs";

export default {
  key: "kadenzo-list-mentions",
  name: "List Mentions",
  description:
    "List social listening mentions of the keywords you track, newest first. [See the documentation](https://studio.kadenzo.app/developers).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    kadenzo,
    platform: {
      type: "string",
      label: "Platform",
      description: "Limit to one source, e.g. `reddit`, `bluesky`, `youtube`, `hackernews`. Leave empty for all.",
      optional: true,
    },
    since: {
      type: "string",
      label: "Since",
      description: "Only mentions published after this ISO 8601 timestamp, e.g. `2026-08-01T00:00:00Z`.",
      optional: true,
    },
    unreadOnly: {
      type: "boolean",
      label: "Unread Only",
      description: "Only mentions not yet marked read in the dashboard.",
      optional: true,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum mentions to return (1-100). Defaults to 25.",
      optional: true,
      min: 1,
      max: 100,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.platform) params.platform = this.platform;
    if (this.since) params.since = this.since;
    if (this.unreadOnly) params.unread = "true";
    if (this.limit) params.limit = this.limit;

    const response = await this.kadenzo.listMentions({ $, params });
    const count = response.mentions?.length ?? 0;
    $.export("$summary", `Found ${count} mention${count === 1 ? "" : "s"}`);
    return response;
  },
};
