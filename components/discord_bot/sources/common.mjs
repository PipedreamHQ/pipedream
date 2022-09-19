import constants from "../constants.mjs";
import common from "../common.mjs";

export default {
  ...common,
  methods: {
    ...common.methods,
    _getLastMessageIDs() {
      return this.db.get(constants.LAST_MESSAGE_IDS) ?? {};
    },
    _setLastMessageIDs(lastMessageIDs) {
      this.db.set(constants.LAST_MESSAGE_IDS, lastMessageIDs);
    },
    _getGuildMemberIDs() {
      return this.db.get(constants.GUILD_MEMBER_IDS) ?? {};
    },
    _setGuildMemberIDs(memberIDs) {
      this.db.set(constants.GUILD_MEMBER_IDS, memberIDs);
    },
  },
};
