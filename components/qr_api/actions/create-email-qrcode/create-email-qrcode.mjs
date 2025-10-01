import common from "../common/base.mjs";

export default {
  ...common,
  key: "qr_api-create-email-qrcode",
  name: "Create Email QR Code",
  description: "Create an Email QR Code. [See the documentation](https://qrapi.io/api-documentation/#/qrcode/create_email_qr_code)",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    address: {
      type: "string",
      label: "Email Address",
      description: "The email address you want to encode in the QR Code.",
    },
  },
  methods: {
    ...common.methods,
    getType() {
      return "email";
    },
    getParams() {
      return {
        address: this.address,
      };
    },
  },
};
