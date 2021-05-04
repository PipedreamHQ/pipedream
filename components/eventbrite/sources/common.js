const eventbrite = require("../eventbrite.app.js");

module.exports = {
  props: {
    eventbrite,
    db: "$.service.db",
    organization: { propDefinition: [eventbrite, "organization"] },
  },
  methods: {
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    generateEventMeta({ id, name, created }) {
      return {
        id,
        summary: name.text,
        ts: Date.parse(created),
      };
    },
    emitEvent(data) {
      const meta = this.generateMeta(data);
      this.$emit(data, meta);
    },
    async paginate(resourceFn, resource, params = null) {
      let results = [];
      let hasMoreItems;
      do {
        const result = await resourceFn(params);
        results = results.concat(result[resource]);
        hasMoreItems = result.pagination.has_more_items;
        params.continuation = result.pagination.continuation;
      } while (hasMoreItems);
      return results;
    },
  },
};