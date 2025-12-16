import app from "../../eaccounting.app.mjs";

export default {
  key: "eaccounting-create-attachment",
  name: "Create Attachment",
  description: "Creates a new attachment. [See the documentation](https://developer.vismaonline.com)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    data: {
      type: "object",
      label: "Attachment Data",
      description: "The attachment data as a JSON object. [See the API documentation](https://developer.vismaonline.com) for the complete schema. Should include fileName, data (base64), and optional metadata.",
    },
  },
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  async run({ $ }) {
    const response = await this.app.createAttachment({
      $,
      data: this.data,
    });
    $.export("$summary", `Successfully created attachment with ID ${response.id || "N/A"}`);
    return response;
  },
};
