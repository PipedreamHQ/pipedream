import quilt from "../../quilt.app.mjs";

export default {
  key: "quilt-read-file",
  name: "Read File",
  description: "Returns a shared project file's text as it is right now in the session. Binary and very large files are refused. Fails with \"You are not in a session\" until **Join Session** has been run. [See the documentation](https://github.com/DanielCarmichaelGit/heyquilt#apps-pipedream-zapier-make-n8n)",
  version: "0.0.1",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    quilt,
    path: {
      propDefinition: [
        quilt,
        "path",
      ],
      description: "The file to read, relative to the project folder, e.g. `README.md`. Use the `quilt_list_files` tool in **Call Tool** to see the project's files.",
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
