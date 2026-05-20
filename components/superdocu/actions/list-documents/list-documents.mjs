import app from "../../superdocu.app.mjs";

export default {
  key: "superdocu-list-documents",
  name: "List Documents",
  description: "List documents from Superdocu. [See the documentation](https://developers.superdocu.com/api/index.html)",
  version: "0.0.1",
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
    const response = await this.app.listDocuments({
      $,
    });

    const count = Array.isArray(response)
      ? response.length
      : response?.data?.length;

    $.export("$summary", count != null
      ? `Successfully retrieved \`${count}\` document(s)`
      : "Successfully retrieved documents");

    return response;
  },
};
