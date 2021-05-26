const common = require("../common.js");

module.exports = {
  ...common,
  key: "firebase_admin_sdk-new-doc-in-firestore-collection",
  name: "New Document in Firestore Collection",
  description: "Emits an event when a structured query returns new documents",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    db: "$.service.db",
    apiKey: {
      propDefinition: [
        common.props.firebase,
        "apiKey",
      ],
    },
    query: {
      propDefinition: [
        common.props.firebase,
        "query",
      ],
    },
  },
  hooks: {
    ...common.hooks,
    async deploy() {
      await this.firebase.initializeApp();
      const {
        idToken,
        refreshToken,
        expiresIn,
      } = await this.firebase.getToken(
        this.apiKey,
      );
      this.setTokenInfo(idToken, refreshToken, expiresIn);
      await this.firebase.deleteApp();
    },
  },
  methods: {
    ...common.methods,
    _getToken() {
      return this.db.get("token");
    },
    _setToken(token) {
      this.db.set("token", token);
    },
    _getRefreshToken() {
      return this.db.get("refreshToken");
    },
    _setRefreshToken(refreshToken) {
      this.db.set("refreshToken", refreshToken);
    },
    _getExpires() {
      return this.db.get("expires");
    },
    _setExpires(expires) {
      this.db.set("expires", expires);
    },
    getExpiresTime(expires, timestamp = null) {
      if (timestamp) return (timestamp * 1000) + (expires * 1000);
      else return Date.now() + expires * 1000;
    },
    setTokenInfo(token, refreshToken, expires, timestamp = null) {
      this._setToken(token);
      this._setRefreshToken(refreshToken);
      this._setExpires(this.getExpiresTime(expires, timestamp));
    },
    generateMeta({ document }) {
      const {
        name,
        createTime,
      } = document;
      const id = name.substring(name.lastIndexOf("/") + 1);
      return {
        id,
        summary: name,
        ts: Date.parse(createTime),
      };
    },
  },
  async run(event) {
    // refresh the authorization token if it will expire before the next run
    const {
      timestamp,
      interval_seconds: intervalSeconds,
    } = event;
    if (intervalSeconds) {
      const intervalMs = 1000 * intervalSeconds;
      const nextRun = (timestamp * 1000) + intervalMs;
      const expires = this._getExpires("expires");
      if (expires <= nextRun) {
        const refreshToken = this._getRefreshToken("refreshToken");
        const {
          id_token: newToken,
          refresh_token: newRefreshToken,
          expires_in: expiresIn,
        } = await this.firebase.refreshToken(this.apiKey, refreshToken);
        this.setTokenInfo(newToken, newRefreshToken, expiresIn, timestamp);
      }
    }

    const token = this._getToken();
    const { projectId } = this.firebase.$auth;
    const parent = `projects/${projectId}/databases/(default)/documents`;
    const structuredQuery = JSON.parse(this.query);

    const queryResults = await this.firebase.runQuery(
      token,
      parent,
      structuredQuery,
    );

    for (const result of queryResults) {
      const meta = this.generateMeta(result);
      this.$emit(result, meta);
    }
  },
};
