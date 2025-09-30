import common from "../common/base.mjs";

export default {
  ...common,
  key: "qr_api-create-url-qrcode",
  name: "Create URL QR Code",
  description: "Create a URL QR Code. [See the documentation](https://qrapi.io/api-documentation/#/qrcode/create_url_qr_code)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    url: {
      type: "string",
      label: "URL",
      description: "The URL to encode in the QR Code.",
    },
  },
  methods: {
    ...common.methods,
    getType() {
      return "url";
    },
    getParams() {
      return {
        url: this.url,
      };
    },
  },
};
