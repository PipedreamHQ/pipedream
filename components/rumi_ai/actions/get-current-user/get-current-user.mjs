import app from "../../rumi_ai.app.mjs";

export default {
  key: "rumi_ai-get-current-user",
  name: "Get Current User",
  description: "Get information about the current authenticated user. [See the documentation](https://rumiai.notion.site/Rumi-Public-API-Authentication-02055b7286874bd7b355862f1abe48d9)",
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

    const response = await app.getCurrentUser({
      $,
    });

    $.export("$summary", "Successfully retrieved current user information");
    return response;
  },
};
