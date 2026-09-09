import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-browse-files",
  name: "Browse Files",
  description:
    "List files shared in a channel or across the workspace."
    + " Accepts a channel ID (preferred — resolves instantly) or channel name (resolved by"
    + " scanning up to 5 pages, ~5,000 channels, of the workspace's channel list — a name beyond"
    + " that bound will not be found)."
    + " Filter by file type (e.g. `images`, `pdfs`, `snippets`)."
    + " Returns file metadata including name, type, size, and download URL."
    + " [See the documentation](https://api.slack.com/methods/files.list)",
  version: "0.0.8",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    slack,
    channel: {
      type: "string",
      label: "Channel",
      description: "Prefer a channel ID (e.g. `C1234567890`) — use **List Channels** to look it up; it resolves instantly. A channel name (e.g. `general` or `#general`) is also accepted, but resolving it scans up to 5 pages (~5,000 channels) of the workspace's channel list, which can be slow — and a valid channel beyond that bound will not be found. If omitted, lists files across the workspace.",
      optional: true,
    },
    types: {
      type: "string",
      label: "File Types",
      description: "Filter by file type. Comma-separated: `all`, `spaces`, `snippets`, `images`, `gdocs`, `zips`, `pdfs`. Default: `all`.",
      optional: true,
    },
    count: {
      type: "integer",
      label: "Count",
      description: "Number of files to return. Default: 20.",
      default: 20,
      optional: true,
    },
  },
  async run({ $ }) {
    const args = {
      count: this.count ?? 20,
      types: this.types,
    };
    if (this.channel) {
      args.channel = await this.slack.resolveChannelId(this.channel);
    }
    const response = await this.slack.listFiles(args);
    const files = response.files || [];
    $.export("$summary", `Found ${files.length} file${files.length === 1
      ? ""
      : "s"}`);
    return {
      files,
    };
  },
};
