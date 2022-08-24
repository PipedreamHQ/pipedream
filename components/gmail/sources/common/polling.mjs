import gmail from "../../gmail.app.mjs";

export default {
  props: {
    gmail,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  methods: {
    getLastMessageId() {
      return this.db.get("lastMessageId");
    },
    setLastMessageId(lastMessageId) {
      if (lastMessageId) {
        this.db.set("lastMessageId", lastMessageId);
      }
    },
  },
};
