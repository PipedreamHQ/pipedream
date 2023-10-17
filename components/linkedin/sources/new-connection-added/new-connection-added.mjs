import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "linkedin-new-connection-added",
  name: "New Connection Added",
  description: "Emit new event when a new connection is added in LinkedIn. [See the documentation](https://learn.microsoft.com/en-us/linkedin/shared/integrations/people/connections-api)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    listConnections(args = {}) {
      return this.linkedin._makeRequest({
        path: "/connections",
        ...args,
        params: {
          ...args.params,
          q: "viewer",
        },
      });
    },
    generateMeta(connection) {
      return {
        id: connection.to,
        summary: `New Connection ${connection.to}`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const items = this.paginate({
      resourceFn: this.listConnections,
      resourceKey: "elements",
    });

    for await (const item of items) {
      const meta = this.generateMeta(item);
      this.$emit(item, meta);
    }
  },
};
