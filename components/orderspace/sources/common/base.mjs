import orderspace from "../../orderspace.app.mjs";

export default {
  props: {
    orderspace,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async activate() {

    },
    async deactivate() {

    },
  },
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
  },
  async run() {

  },
};
