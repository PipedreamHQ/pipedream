import app from "../../u301.app.mjs";

export default {
  key: "u301-create-qrcode",
  name: "Create QR Code",
  description: "Create a QR Code from the shortened URL. [See the documentation](https://docs.u301.com/api-reference/endpoint/create-a-qrcode)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    url: {
      propDefinition: [
        app,
        "url",
      ],
    },
    width: {
      propDefinition: [
        app,
        "width",
      ],
    },
    margin: {
      propDefinition: [
        app,
        "margin",
      ],
    },
  },
  async run({ $ }) {
    const {
      app, ...params
    } = this;
    const response = await app.createQrCode({
      $,
      params,
    });

    $.export("$summary", `Successfully created the QR Code for the url: ${this.url}`);

    return response;
  },
};
