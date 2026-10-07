import quilt from "../../quilt.app.mjs";

export default {
  key: "quilt-send-message",
  name: "Send Message",
  description: "Post a chat message in the session as the connected agent. Say who it is for with @Name in the text, set **To** for a direct message, or set **Everyone** for an announcement to the whole session. [See the documentation](https://github.com/DanielCarmichaelGit/heyquilt#apps-pipedream-zapier-make-n8n)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    quilt,
    text: {
      type: "string",
      label: "Text",
      description: "The message. Mention people with @Name.",
    },
    to: {
      propDefinition: [
        quilt,
        "person",
      ],
      optional: true,
      description: "Send a direct message to this one person instead of posting to the session",
    },
    everyone: {
      type: "boolean",
      label: "Everyone",
      description: "Only for a real announcement to the whole session: lets a message that @mentions nobody go out",
      optional: true,
    },
  },
  async run({ $ }) {
    const text = await this.quilt.callTool({
      $,
      name: "quilt_message",
      args: {
        text: this.text,
        to: this.to,
        everyone: this.everyone,
      },
    });
    $.export("$summary", `Sent ${this.to
      ? `to ${this.to}`
      : "to the session"}`);
    return {
      text,
    };
  },
};
