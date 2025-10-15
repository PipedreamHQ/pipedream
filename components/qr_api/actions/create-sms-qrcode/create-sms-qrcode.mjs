import common from "../common/base.mjs";

export default {
  ...common,
  key: "qr_api-create-sms-qrcode",
  name: "Create SMS QR Code",
  description: "Create a SMS QR Code. [See the documentation](https://qrapi.io/api-documentation/#/qrcode/create_sms_qr_code)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ...common.props,
    phoneNo: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the recipient of the SMS.",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message of the SMS.",
    },
  },
  methods: {
    ...common.methods,
    getType() {
      return "SMS";
    },
    getParams() {
      return {
        phone_no: this.phoneNo,
        message: this.message,
      };
    },
  },
};
