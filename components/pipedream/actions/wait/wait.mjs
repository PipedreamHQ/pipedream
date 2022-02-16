// legacy_hash_id: a_m8iXpW
export default {
  key: "pipedream-wait",
  name: "Wait N milliseconds",
  description: "Pauses your code for the specified number of milliseconds",
  version: "0.1.1",
  type: "action",
  props: {
    pipedream: {
      type: "app",
      app: "pipedream",
    },
    ms: {
      type: "string",
      label: "Number of milliseconds to wait",
    },
  },
  async run() {
    await new Promise((resolve) => setTimeout(resolve, this.ms || 0));
  },
};
