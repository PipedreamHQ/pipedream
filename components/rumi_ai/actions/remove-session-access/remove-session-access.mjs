import app from "../../rumi_ai.app.mjs";

export default {
  key: "rumi_ai-remove-session-access",
  name: "Remove Session Access",
  description: "Remove user access from a session. [See the documentation](https://rumiai.notion.site/Rumi-Public-API-Authentication-02055b7286874bd7b355862f1abe48d9)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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
    accessRuleId: {
      type: "string",
      label: "Access Rule ID",
      description: "The ID of the access rule to remove. This is given when you add access to a session.",
    },
  },
  async run({ $ }) {
    const {
      app,
      accessRuleId,
      sessionId,
      sessionRecurrenceId,
    } = this;

    await app.removeSessionAccess({
      $,
      data: {
        id: accessRuleId,
        sessionID: sessionId,
        sessionRecurrenceID: sessionRecurrenceId,
        type: "email",
      },
    });

    $.export("$summary", "Successfully removed user from session");
    return {
      success: true,
    };
  },
};
