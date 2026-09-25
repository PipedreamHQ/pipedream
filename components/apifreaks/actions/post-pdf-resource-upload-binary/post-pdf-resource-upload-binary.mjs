import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-post-pdf-resource-upload-binary",
  name: "Upload a PDF in Binary Format",
  description: "This API uploads PDF files to the API Freaks server in binary format. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    fileName: {
      type: "string",
      label: "File Name",
      description: "The desired name for the uploaded PDF file. This name will be used for storage on the server. **NOTE**: Please ensure file_name has extension `.pdf`.",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "POST",
      path: "/v1.0/pdf/resource/upload-binary",
      params: {
        "file_name": this.fileName,
      },
    });
    $.export("$summary", "Successfully executed Upload a PDF in Binary Format");
    return response;
  },
};
