import quilt from "../../quilt.app.mjs";

export default {
  key: "quilt-read-file",
  name: "Read File",
  description: "Read a shared project file in the session as text, as it is right now. [See the documentation](https://github.com/DanielCarmichaelGit/heyquilt#apps-pipedream-zapier-make-n8n)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    quilt,
    path: {
      type: "string",
      label: "Path",
      description: "Relative path in the project, e.g. `src/app.js`",
    },
  },
  async run({ $ }) {
    const text = await this.quilt.callTool({
      $,
      name: "quilt_read_file",
      args: {
        path: this.path,
      },
    });
    $.export("$summary", `Read ${this.path}`);
    return {
      text,
    };
  },
};
