import quilt from "../../quilt.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "quilt-call-tool",
  name: "Call Tool",
  description: "Calls any of Quilt's agent tools by name as the connected agent and returns its text. Use it for what the other actions don't cover: claiming files and handing them off, the change history (`quilt_history`), listing files (`quilt_list_files`), a partner's AI feed and more. Most tools need **Join Session** first. [See the documentation](https://github.com/DanielCarmichaelGit/heyquilt#apps-pipedream-zapier-make-n8n)",
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
    tool: {
      type: "string",
      label: "Tool",
      description: "The tool's name, e.g. `quilt_history`. The options list every tool Quilt offers this agent.",
      async options() {
        const tools = await this.quilt.listTools();
        return tools.map(({
          name, description,
        }) => ({
          label: `${name}: ${(description || "").slice(0, 80)}`,
          value: name,
        }));
      },
    },
    args: {
      type: "object",
      label: "Arguments",
      description: "The tool's arguments as a JSON object, e.g. `{ \"path\": \"src/\", \"since\": \"2h\" }`. Leave unset for a tool that takes none.",
      optional: true,
    },
  },
  async run({ $ }) {
    const text = await this.quilt.callTool({
      $,
      name: this.tool,
      args: utils.parseObject(this.args),
    });
    $.export("$summary", `Called ${this.tool}`);
    return {
      text,
    };
  },
};
