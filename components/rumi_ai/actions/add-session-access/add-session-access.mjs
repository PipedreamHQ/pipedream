import app from "../../rumi_ai.app.mjs";

export default {
  key: "rumi_ai-add-session-access",
  name: "Add Session Access",
  description: "Add access to a session for specific email addresses or domains. [See the documentation](https://rumiai.notion.site/Rumi-Public-API-Authentication-02055b7286874bd7b355862f1abe48d9)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    sessionId: {
      propDefinition: [
        app,
        "sessionId",
      ],
    },
    sessionRecurrenceId: {
      propDefinition: [
        app,
        "sessionRecurrenceId",
      ],
    },
    emails: {
      propDefinition: [
        app,
        "emails",
      ],
    },
    domains: {
      propDefinition: [
        app,
        "domains",
      ],
    },
    message: {
      propDefinition: [
        app,
        "message",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      sessionId,
      sessionRecurrenceId,
      emails,
      domains,
      message,
    } = this;

    const response = await app.addSessionAccess({
      $,
      data: {
        sessionID: sessionId,
        sessionRecurrenceID: sessionRecurrenceId,
        emails,
        domains,
        message,
      },
    });

    $.export("$summary", `Successfully added access to session \`${sessionId}\``);
    return response;
  },
};
