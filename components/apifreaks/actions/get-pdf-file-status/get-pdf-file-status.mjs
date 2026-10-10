import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-get-pdf-file-status",
  name: "Check File Status",
  description: "This API checks the status of a PDF file using its unique file ID, providing information about its creation and potential deletion time. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    fileId: {
      type: "string",
      label: "File Id",
      description: "The unique ID of the file whose status is requested.",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/pdf/file-status",
      params: {
        "file_id": this.fileId,
      },
    });
    $.export("$summary", "Successfully executed Check File Status");
    return response;
  },
};
