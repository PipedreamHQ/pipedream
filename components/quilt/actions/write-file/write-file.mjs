import quilt from "../../quilt.app.mjs";

export default {
  key: "quilt-write-file",
  name: "Write File",
  description: "Writes a text file in the session's shared project, new or existing; everyone in the session gets it on their disk within moments. It replaces the file's contents, so read it first with **Read File**. Files someone else has claimed are refused. Needs **Join Session** first; when the agent is in more than one session, set **Session**. [See the documentation](https://github.com/DanielCarmichaelGit/heyquilt#apps-pipedream-zapier-make-n8n)",
  version: "0.0.1",
  ai: "optimized",
  annotations: {
    destructiveHint: true,
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
    path: {
      propDefinition: [
        quilt,
        "path",
      ],
      description: "The file to write, relative to the project folder, e.g. `notes/status.md`. Folders are created as needed.",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The complete new contents of the file, e.g. `Team status: ready`.",
    },
  },
  async run({ $ }) {
    const text = await this.quilt.callTool({
      $,
      name: "quilt_write_file",
      args: {
        session: this.session,
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
