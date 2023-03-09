import eventbrite from "../../eventbrite.app.mjs";

export default {
  props: {
    eventbrite,
    db: "$.service.db",
    organization: {
      propDefinition: [
        eventbrite,
        "organization",
      ],
    },
  },
  methods: {
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    emitEvent(data) {
      const meta = this.generateMeta(data);
      this.$emit(data, meta);
    },
    async *resourceStream(resourceFn, resource, ...params) {
      let hasMoreItems;
      do {
        const {
          [resource]: items, pagination = {},
        } = await resourceFn(...params);
        for (const item of items) {
          yield item;
        }

        hasMoreItems = !!pagination.has_more_items;
        params.continuation = pagination.continuation;
      } while (hasMoreItems);
    },
  },
};
