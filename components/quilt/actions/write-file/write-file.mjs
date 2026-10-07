import quilt from "../../quilt.app.mjs";

export default {
  key: "quilt-write-file",
  name: "Write File",
  description: "Write a text file in the session's shared project (new or existing). Everyone in the session gets it on their disk within moments. Files someone else has claimed are refused. [See the documentation](https://github.com/DanielCarmichaelGit/heyquilt#apps-pipedream-zapier-make-n8n)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    quilt,
    path: {
      type: "string",
      label: "Path",
      description: "Relative path in the project, e.g. `notes/standup.md`",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The whole new contents of the file",
    },
  },
  async run({ $ }) {
    const text = await this.quilt.callTool({
      $,
      name: "quilt_write_file",
      args: {
        path: this.path,
        content: this.content,
      },
    });
    $.export("$summary", `Wrote ${this.path}`);
    return {
      text,
    };
  },
};
