import constants from "./constants.mjs";

export default {
  methods: {
    _setSecret(secret) {
      this.db.set(constants.SECRET, secret);
    },
    _getSecret() {
      return this.db.get(constants.SECRET);
    },
    _setTag(tag) {
      this.db.set(constants.TAG, tag);
    },
    _getTag() {
      return this.db.get(constants.TAG);
    },
  },
};
