import common from "../common/base.mjs";
import constants from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "nevtan_mail-new-email-sent",
  name: "New Email Sent",
  description: "Emit new event when an email is sent from your NevTan Mail mailbox.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  sampleEmit,
  methods: {
    ...common.methods,
    getEvent() {
      return constants.EVENT.EMAIL_SENT;
    },
    generateMeta(body) {
      const recipients = Array.isArray(body.to)
        ? body.to.join(", ")
        : body.to;
      return {
        id: `${constants.EVENT.EMAIL_SENT}-${body.id}`,
        summary: body.subject?.trim() || `Email to ${recipients}`,
        ts: Date.parse(body.sent_at ?? body.received_at) || Date.now(),
      };
    },
  },
};
