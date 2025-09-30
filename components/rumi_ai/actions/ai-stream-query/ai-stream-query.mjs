import app from "../../rumi_ai.app.mjs";

export default {
  key: "rumi_ai-ai-stream-query",
  name: "AI Stream Query",
  description: "Stream an AI query against session memories. [See the documentation](https://rumiai.notion.site/Rumi-Public-API-Authentication-02055b7286874bd7b355862f1abe48d9)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    query: {
      propDefinition: [
        app,
        "query",
      ],
    },
    requestId: {
      propDefinition: [
        app,
        "requestId",
      ],
    },
    tz: {
      propDefinition: [
        app,
        "tz",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      query,
      requestId,
      tz,
    } = this;

    const response = await app.streamAiQuery({
      $,
      data: {
        query,
        requestId,
        tz,
      },
    });

    $.export("$summary", "Successfully executed AI stream query");
    return response;
  },
};
