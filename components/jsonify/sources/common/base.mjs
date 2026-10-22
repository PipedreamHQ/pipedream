import jsonify from "../../jsonify.app.mjs";

export default {
  props: {
    jsonify,
    db: "$.service.db",
    timer: {
      propDefinition: [
        jsonify,
        "timer",
      ],
    },
    serveUrl: {
      propDefinition: [
        jsonify,
        "serveUrl",
      ],
    },
  },
  methods: {
    _getLastVersion() {
      return this.db.get("lastVersion");
    },
    _setLastVersion(version) {
      this.db.set("lastVersion", version);
    },
    _getSeenIds() {
      return this.db.get("seenIds") || [];
    },
    _setSeenIds(ids) {
      this.db.set("seenIds", [
        ...ids,
      ]);
    },
    async getHead() {
      return this.jsonify.getPage({
        serveUrl: this.serveUrl,
        limit: 1,
      });
    },
  },
};
