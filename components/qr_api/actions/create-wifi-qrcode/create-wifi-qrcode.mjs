import constants from "../../common/constants.mjs";
import common from "../common/base.mjs";

export default {
  ...common,
  key: "qr_api-create-wifi-qrcode",
  name: "Create WiFi QR Code",
  description: "Create a WiFi QR Code. [See the documentation](https://qrapi.io/api-documentation/#/qrcode/create_wifi_qr_code)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    ...common.props,
    ssid: {
      type: "string",
      label: "SSID",
      description: "The SSID of the WiFi network.",
    },
    authentication: {
      type: "string",
      label: "Authentication",
      description: "The security protocol of the WiFi network. If you're not sure, check security setting in network properties.",
      options: constants.AUTHENTICATION_OPTIONS,
      optional: true,
    },
    psk: {
      type: "string",
      label: "PSK",
      description: "The password of the WiFi network.",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getType() {
      return "wifi";
    },
    getParams() {
      return {
        ssid: this.ssid,
        authentication: this.authentication,
        psk: this.psk,
      };
    },
  },
};
