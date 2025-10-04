import devin from "../../devin.app.mjs";

export default {
  key: "devin-get-session",
  name: "Get Session",
  description: "Retrieve details about an existing session. [See the documentation](https://docs.devin.ai/api-reference/sessions/retrieve-details-about-an-existing-session)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
  },
  async run({ $ }) {
    const response = await this.devin.getSession({
      $,
      sessionId: this.sessionId,
    });

    $.export("$summary", `Successfully retrieved session: ${response.title || this.sessionId}`);
    return response;
  },
};
