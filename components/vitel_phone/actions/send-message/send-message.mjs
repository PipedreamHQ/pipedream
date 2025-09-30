import app from "../../vitel_phone.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "vitel_phone-send-message",
  name: "Send Message",
  description: "Send a new message. [See the documentation](https://www.vitelglobal.com)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    frm: {
      type: "string",
      label: "Source Number",
      description: "The source phone number",
    },
    dst: {
      type: "string",
      label: "Destination Number",
      description: "The destination phone number",
    },
    message: {
      type: "string",
      label: "Message",
      description: "The SMS message to send",
    },
  },
  methods: {
    sendMessage(args = {}) {
      return this.app.makeRequest({
        path: "/vitelsms.php",
        ...args,
      });
    },
    summary(resp) {
      const isStr = typeof resp === "string";
      const response = utils.checkResponse(resp);
      return isStr
        ? response
        : "Successfully sent message";
    },
  },
  run({ $: step }) {
    const {
      // eslint-disable-next-line no-unused-vars
      app,
      sendMessage,
      summary,
      ...params
    } = this;

    return sendMessage({
      step,
      params,
      summary,
    });
  },
};
