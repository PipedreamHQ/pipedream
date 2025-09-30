import vida from "../../vida.app.mjs";

export default {
  key: "vida-provide-context",
  name: "Add Context",
  description: "Uploads additional context for a conversation with your AI agent. Helpful when integrating data from external CRMs. [See the documentation](https://vida.io/docs/api-reference/knowledge/add-context)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    vida,
    target: {
      type: "string",
      label: "Target",
      description: "Phone number in E.164 format or VIDA username of the user.",
    },
    context: {
      type: "string",
      label: "Context",
      description: "Context information to inject",
    },
  },
  async run({ $ }) {
    const response = await this.vida.addContext({
      $,
      data: {
        target: this.target,
        context: this.context,
      },
    });
    $.export("$summary", `Successfully uploaded additional context for target ${this.target}`);
    return response;
  },
};
