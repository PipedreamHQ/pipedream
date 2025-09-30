import app from "../../rumi_ai.app.mjs";

export default {
  key: "rumi_ai-get-past-sessions",
  name: "Get Past Sessions",
  description: "Retrieve past sessions/meetings. [See the documentation](https://rumiai.notion.site/Rumi-Public-API-Authentication-02055b7286874bd7b355862f1abe48d9)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const {
      app, limit,
    } = this;

    const response = await app.getPastSessions({
      $,
      params: {
        limit,
      },
    });

    $.export("$summary", `Successfully retrieved \`${response?.data?.sessions?.length}\` past session(s)`);
    return response;
  },
};
