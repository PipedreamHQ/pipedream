import common from "../common/base.mjs";

export default {
  ...common,
  key: "qr_api-create-text-qrcode",
  name: "Create Text QR Code",
  description: "Create a Text QR Code. [See the documentation](https://qrapi.io/api-documentation/#/qrcode/create_text_qr_code)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ...common.props,
    data: {
      type: "string",
      label: "Text",
      description: "The text to be encoded in the QR Code.",
    },
  },
  methods: {
    ...common.methods,
    getType() {
      return "text";
    },
    getParams() {
      return {
        data: this.data,
      };
    },
  },
};
