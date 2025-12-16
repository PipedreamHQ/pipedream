import app from "../../eaccounting.app.mjs";

export default {
  key: "eaccounting-get-attachments",
  name: "Get Attachments",
  description: "Retrieves a list of attachments. [See the documentation](https://developer.vismaonline.com)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    includeMatched: {
      type: "boolean",
      label: "Include Matched",
      description: "When set to false, returns only unmatched attachments. Default: true",
      optional: true,
      default: true,
    },
    includeTemporaryUrl: {
      type: "boolean",
      label: "Include Temporary URL",
      description: "When set to false, returns attachments without the TemporaryUrl. Default: true",
      optional: true,
      default: true,
    },
  },
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
  },
  async run({ $ }) {
    const response = await this.app.getAttachments({
      $,
      params: {
        includeMatched: this.includeMatched,
        includeTemporaryUrl: this.includeTemporaryUrl,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.data?.length || 0} attachments`);
    return response;
  },
};
