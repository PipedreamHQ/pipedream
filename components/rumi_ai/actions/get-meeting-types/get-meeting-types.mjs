import app from "../../rumi_ai.app.mjs";

export default {
  key: "rumi_ai-get-meeting-types",
  name: "Get Meeting Types",
  description: "Retrieve available meeting types. [See the documentation](https://rumiai.notion.site/Rumi-Public-API-Authentication-02055b7286874bd7b355862f1abe48d9)",
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

    const response = await app.getMeetingTypes({
      $,
    });

    $.export("$summary", `Successfully retrieved \`${response?.data?.meetingTypes?.length}\` meeting type(s)`);
    return response;
  },
};
