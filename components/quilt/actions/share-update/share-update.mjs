import quilt from "../../quilt.app.mjs";

export default {
  key: "quilt-share-update",
  name: "Share Update",
  description: "Posts what the connected agent is doing to the session's live feed, which everyone sees next to their own AI's work: the plan when it starts a request, and the result and changed files when it finishes. Not a chat message; use **Send Message** to talk to someone. Needs **Join Session** first; when the agent is in more than one session, set **Session**. [See the documentation](https://github.com/DanielCarmichaelGit/heyquilt#apps-pipedream-zapier-make-n8n)",
  version: "0.0.1",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    quilt,
    session: {
      propDefinition: [
        quilt,
        "session",
      ],
    },
    summary: {
      type: "string",
      label: "Summary",
      description: "The plan, progress or result in one to three sentences, e.g. `Posted the nightly test report to notes/report.md`.",
    },
    request: {
      type: "string",
      label: "Request",
      description: "What was asked for, in a sentence, only when starting a new request, e.g. `Post the nightly test report`.",
      optional: true,
    },
    files: {
      propDefinition: [
        quilt,
        "files",
      ],
      description: "Files that were changed, as paths relative to the project folder, e.g. `[\"notes/report.md\"]`.",
    },
  },
  async run({ $ }) {
    const text = await this.quilt.callTool({
      $,
      name: "quilt_share",
      args: {
        session: this.session,
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
