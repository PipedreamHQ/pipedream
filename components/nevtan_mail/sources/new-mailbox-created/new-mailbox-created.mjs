import common from "../common/base.mjs";
import constants from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "nevtan_mail-new-mailbox-created",
  name: "New Mailbox Created",
  description:
    "Emit new event when a mailbox is created in your workspace. Requires an admin API key.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  sampleEmit,
  methods: {
    ...common.methods,
    getEvent() {
      return constants.EVENT.MAILBOX_CREATED;
    },
    generateMeta(body) {
      return {
        id: `${constants.EVENT.MAILBOX_CREATED}-${body.id}`,
        summary: `New mailbox: ${body.email}`,
        ts: Date.parse(body.created_at) || Date.now(),
      };
    },
  },
};
