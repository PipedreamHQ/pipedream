import common from "../common/polling.mjs";

export default {
  ...common,
  key: "supercast-new-episode-created",
  name: "New Episode Created",
  description: "Emit new event when a new episode is created in Supercast. [See the documentation](https://supercast.readme.io/reference/postepisodes)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourcesFn() {
      return this.app.listEpisodes;
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Episode: ${resource.title}`,
        ts: Date.parse(resource.created_at),
      };
    },
  },
};
