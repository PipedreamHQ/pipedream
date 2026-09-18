import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-post-pdf-resource-upload",
  name: "Upload Multiple PDFs and Get File IDs",
  description: "This API uploads multiple PDF files to the API Freaks server and generates their unique file IDs. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,

  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "POST",
      path: "/v1.0/pdf/resource/upload",
    });
    $.export("$summary", "Successfully executed Upload Multiple PDFs and Get File IDs");
    return response;
  },
};
