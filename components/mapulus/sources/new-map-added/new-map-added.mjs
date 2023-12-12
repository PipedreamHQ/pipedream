import common from "../common/common.mjs";

export default {
  ...common,
  key: "mapulus-new-map-added",
  name: "New Map Added",
  description: "Emit new event when a new map is added.",
  type: "source",
  version: "0.0.2",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.mapulus.listMaps;
    },
    generateMeta(map) {
      return {
        id: map.id,
        summary: map.title,
        ts: Date.parse(map.created_at),
      };
    },
  },
};
