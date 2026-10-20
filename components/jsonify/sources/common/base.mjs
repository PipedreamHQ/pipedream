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
    getLastVersion() {
      return this.db.get("lastVersion");
    },
    setLastVersion(version) {
      this.db.set("lastVersion", version);
    },
    async getHead() {
      return this.jsonify.getPage({
        serveUrl: this.serveUrl,
        limit: 1,
      });
    },
  },
};
