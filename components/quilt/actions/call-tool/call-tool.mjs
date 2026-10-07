import quilt from "../../quilt.app.mjs";

export default {
  key: "quilt-call-tool",
  name: "Call Tool",
  description: "Call any of Quilt's agent tools by name, with its arguments, as the connected agent: claims and file hand-offs, the change history, a partner's AI feed and more. The tool list is in [the documentation](https://github.com/DanielCarmichaelGit/heyquilt#apps-pipedream-zapier-make-n8n).",
  version: "0.0.1",
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
      description: "The tool's name, e.g. `quilt_history` or `quilt_claim`",
      async options() {
        const response = await this.quilt.listTools();
        return (response?.result?.tools || []).map(({
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
      description: "The tool's arguments, e.g. `{ \"path\": \"src/\", \"since\": \"2h\" }`",
      optional: true,
    },
  },
  async run({ $ }) {
    let args = this.args || {};
    if (typeof args === "string") {
      try {
        args = JSON.parse(args);
      } catch {
        throw new Error("Arguments must be a JSON object");
      }
    }
    const text = await this.quilt.callTool({
      $,
      name: this.tool,
      args,
    });
    $.export("$summary", `Called ${this.tool}`);
    return {
      text,
    };
  },
};
