import app from "../../plivo.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
  },
  methods: {
    setAppId(value) {
      this.db.set(constants.APP_ID, value);
    },
    getAppId() {
      return this.db.get(constants.APP_ID);
    },
    setLastEndTime(value) {
      this.db.set(constants.LAST_END_TIME, value);
    },
    getLastEndTime() {
      return this.db.get(constants.LAST_END_TIME);
    },
    setLastMessageTime(value) {
      this.db.set(constants.LAST_MESSAGE_TIME, value);
    },
    getLastMessageTime() {
      return this.db.get(constants.LAST_MESSAGE_TIME);
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    processEvents() {
      throw new Error("processEvents not implemented");
    },
  },
};
