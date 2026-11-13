import quilt from "../../quilt.app.mjs";

export default {
  key: "quilt-send-message",
  name: "Send Message",
  description: "Posts a chat message in the session as the connected agent. Say who it is for with @Name in the text, set **To** for a direct message, or set **Everyone** for an announcement; a message that names nobody is refused. Needs **Join Session** first; when the agent is in more than one session, set **Session**. [See the documentation](https://github.com/DanielCarmichaelGit/heyquilt#apps-pipedream-zapier-make-n8n)",
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
    text: {
      type: "string",
      label: "Text",
      description: "The message, naming who it is for with @Name, e.g. `@Ana the build is fixed`.",
    },
    to: {
      propDefinition: [
        quilt,
        "person",
      ],
      description: "One person to send a direct message to instead of posting to the session, e.g. `Ana`. Use **Get Session Status** to list who is in the session.",
      optional: true,
    },
    everyone: {
      type: "boolean",
      label: "Everyone",
      description: "Set to `true` only for a real announcement to the whole session, e.g. `true`: it lets a message that @mentions nobody go out.",
      optional: true,
    },
  },
  async run({ $ }) {
    const text = await this.quilt.callTool({
      $,
      name: "quilt_message",
      args: {
        session: this.session,
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
