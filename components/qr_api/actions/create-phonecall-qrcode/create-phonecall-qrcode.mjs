import common from "../common/base.mjs";

export default {
  ...common,
  key: "qr_api-create-phonecall-qrcode",
  name: "Create Phone Call QR Code",
  description: "Create a Phone Call QR Code. [See the documentation](https://qrapi.io/api-documentation/#/qrcode/create_phonecall_qr_code)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ...common.props,
    number: {
      type: "string",
      label: "Number",
      description: "The phone number you want to encode in the QR Code.",
    },
  },
  methods: {
    ...common.methods,
    getType() {
      return "phonecall";
    },
    getParams() {
      return {
        number: this.number,
      };
    },
  },
};
