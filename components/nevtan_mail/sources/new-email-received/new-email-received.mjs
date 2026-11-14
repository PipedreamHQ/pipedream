import common from "../common/base.mjs";
import constants from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "nevtan_mail-new-email-received",
  name: "New Email Received",
  description: "Emit new event when an email arrives in your NevTan Mail mailbox.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  sampleEmit,
  methods: {
    ...common.methods,
    getEvent() {
      return constants.EVENT.EMAIL_RECEIVED;
    },
    generateMeta(body) {
      return {
        id: `${constants.EVENT.EMAIL_RECEIVED}-${body.id}`,
        summary: body.subject?.trim() || `Email from ${body.from}`,
        ts: Date.parse(body.received_at ?? body.sent_at) || Date.now(),
      };
    },
  },
};
