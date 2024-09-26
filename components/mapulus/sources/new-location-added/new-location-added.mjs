import common from "../common/common.mjs";

export default {
  ...common,
  key: "mapulus-new-location-added",
  name: "New Location Added",
  description: "Emit new event when a new location is added.",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.mapulus.listLocations;
    },
    generateMeta(location) {
      return {
        id: location.id,
        summary: location.title,
        ts: Date.parse(location.created_at),
      };
    },
  },
};
