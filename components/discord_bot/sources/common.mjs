import constants from "../common/constants.mjs";
import common from "../common/base.mjs";

export default {
  ...common,
  methods: {
    ...common.methods,
    _getLastMessageIDs() {
      this.db.get(constants.LAST_MESSAGE_IDS);
    },
    _setLastMessageIDs(lastMessageIDs) {
      this.db.set(constants.LAST_MESSAGE_IDS, lastMessageIDs);
    },
  },
};
