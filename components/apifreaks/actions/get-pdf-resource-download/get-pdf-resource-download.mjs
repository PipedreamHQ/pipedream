import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-pdf-resource-download",
  name: "Download PDF Resource",
  description: "This API downloads PDF files or ZIP archives from the server using their unique resource ID. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    resourceId: {
      type: "string",
      label: "Resource Id",
      description: "The unique identifier of the file or ZIP archive to download. Pick an uploaded/generated file, or map a ZIP archive ID from a previous PDF task step.",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/pdf/resource/download",
      params: {
        "resource_id": this.resourceId,
      },
    });
    $.export("$summary", "Successfully executed Download PDF Resource");
    return response;
  },
};
