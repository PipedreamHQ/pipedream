import common from "../common/base.mjs";

export default {
  ...common,
  key: "storyscale-new-tour-created",
  name: "New Tour Created",
  description: "Emit new event when a new tour is created. [See the documentation](https://prodapi.storyscale.com/api/documentation)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getTsField() {
      return "created_at";
    },
    generateMeta(tour) {
      return {
        id: tour.id,
        summary: `New Tour ${tour.name}`,
        ts: Date.parse(tour.created_at),
      };
    },
  },
};
