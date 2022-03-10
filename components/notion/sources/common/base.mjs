import notion from "../../notion.app.mjs";
import constants from "./constants.mjs";

export default {
  props: {
    notion,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  methods: {
    getLastCursor() {
      return this.db.get(constants.LAST_CURSOR) ?? undefined;
    },
    setLastCursor(cursor) {
      this.db.set(constants.LAST_CURSOR, cursor);
    },
  },
};
