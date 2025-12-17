import app from "../../rumi_ai.app.mjs";

export default {
  key: "rumi_ai-get-future-sessions",
  name: "Get Future Sessions",
  description: "Retrieve upcoming/future sessions. [See the documentation](https://rumiai.notion.site/Rumi-Public-API-Authentication-02055b7286874bd7b355862f1abe48d9)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
  },
  async run({ $ }) {
    const { app } = this;

    const response = await app.getFutureSessions({
      $,
    });

    $.export("$summary", `Successfully retrieved \`${response?.data?.sessions?.length}\` future session(s)`);
    return response;
  },
};
