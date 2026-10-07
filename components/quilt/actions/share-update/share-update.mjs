import quilt from "../../quilt.app.mjs";

export default {
  key: "quilt-share-update",
  name: "Share Update",
  description: "Share what the connected agent is doing in the session's live feed: a plan when it starts, or a result and the files it changed when it finishes. [See the documentation](https://github.com/DanielCarmichaelGit/heyquilt#apps-pipedream-zapier-make-n8n)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    quilt,
    summary: {
      type: "string",
      label: "Summary",
      description: "The plan, progress or result, in one to three sentences",
    },
    request: {
      type: "string",
      label: "Request",
      description: "What was asked for, in a sentence (only when starting a new request)",
      optional: true,
    },
    files: {
      propDefinition: [
        quilt,
        "files",
      ],
      optional: true,
      description: "Files that were changed, as relative paths",
    },
  },
  async run({ $ }) {
    const text = await this.quilt.callTool({
      $,
      name: "quilt_share",
      args: {
        summary: this.summary,
        request: this.request,
        files: this.files,
      },
    });
    $.export("$summary", "Shared an update");
    return {
      text,
    };
  },
};
