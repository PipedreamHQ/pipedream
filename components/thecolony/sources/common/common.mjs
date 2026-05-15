import thecolony from "../../thecolony.app.mjs";

export default {
  props: {
    thecolony,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 5,
      },
    },
  },
  methods: {
    _getLastSeenId() {
      return this.db.get("lastSeenId");
    },
    _setLastSeenId(id) {
      this.db.set("lastSeenId", id);
    },
  },
};
