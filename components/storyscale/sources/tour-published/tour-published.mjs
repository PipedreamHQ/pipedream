import common from "../common/base.mjs";

export default {
  ...common,
  key: "storyscale-tour-published",
  name: "Tour Published",
  description: "Emit new event when a tour gets published. [See the documentation](https://prodapi.storyscale.com/api/documentation)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    isRelevant(tour) {
      return tour.is_published;
    },
    generateMeta(tour) {
      return {
        id: tour.id,
        summary: `New Tour Published ${tour.name}`,
        ts: Date.parse(tour.updated_at),
      };
    },
  },
};
