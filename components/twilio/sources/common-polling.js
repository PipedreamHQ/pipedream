const twilio = require("../twilio.app.js");

module.exports = {
  props: {
    twilio,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },
  methods: {
    _getCreatedAfter() {
      return this.db.get("createdAfter");
    },
    _setCreatedAfter(createdAfter) {
      this.db.set("createdAfter", createdAfter);
    },
    emitEvent(result) {
      const meta = this.generateMeta(result);
      this.$emit(result, meta);
    },
  },
  async run(event) {
    const resourceFn = this.getResourceFn();
    let createdAfter = this._getCreatedAfter();
    const params = {};
    if (createdAfter) params.dateCreatedAfter = createdAfter;
    const results = await resourceFn(params);
    for (const result of results) {
      this.emitEvent(result);
      if (
        !createdAfter ||
        Date.parse(result.dateCreated) > Date.parse(createdAfter)
      )
        createdAfter = result.dateCreated;
    }
    this._setCreatedAfter(createdAfter);
  },
};