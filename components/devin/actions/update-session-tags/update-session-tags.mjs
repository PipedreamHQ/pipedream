import devin from "../../devin.app.mjs";

export default {
  key: "devin-update-session-tags",
  name: "Update Session Tags",
  description: "Update the tags for an existing session. [See the documentation](https://docs.devin.ai/api-reference/sessions/update-session-tags)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    devin,
    sessionId: {
      propDefinition: [
        devin,
        "sessionId",
      ],
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "New tags to set for the session (this will replace existing tags)",
    },
  },
  async run({ $ }) {
    const response = await this.devin.updateSessionTags({
      $,
      sessionId: this.sessionId,
      data: {
        tags: this.tags,
      },
    });

    $.export("$summary", `Successfully updated tags for session ${this.sessionId}`);
    return response;
  },
};
