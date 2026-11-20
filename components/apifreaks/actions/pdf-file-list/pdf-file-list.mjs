import app from "../../apifreaks.app.mjs";

export default {
  key: "apifreaks-pdf-file-list",
  name: "List PDF Files",
  description: "Internal trigger that lists your uploaded PDF files to power file pickers. Hidden from the Zap editor. [See the documentation](https://apifreaks.com/docs).",
  version: "0.0.1",
  type: "action",
  props: {
    app,

  },
  async run({ $ }) {
    const response = await this.app._makeRequest({
      $,
      method: "GET",
      path: "/v1.0/pdf/files",
    });
    $.export("$summary", "Successfully executed List PDF Files");
    return response;
  },
};
