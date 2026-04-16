import slack from "../../slack_v2.app.mjs";

export default {
  key: "slack_v2-browse-files",
  name: "Browse Files",
  description:
    "List files shared in a channel or across the workspace."
    + " Accepts a channel ID or channel name (resolved automatically)."
    + " Filter by file type (e.g. `images`, `pdfs`, `snippets`)."
    + " Returns file metadata including name, type, size, and download URL."
    + " [See the documentation](https://api.slack.com/methods/files.list)",
  version: "0.0.1",
  type: "action",
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
      description: "Channel ID (e.g. `C1234567890`) or channel name (e.g. `general` or `#general`). Resolved automatically. If omitted, lists files across the workspace.",
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
