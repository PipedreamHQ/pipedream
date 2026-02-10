import common from "../common/base-polling.mjs";

export default {
  ...common,
  key: "getprospect-new-lead-created",
  name: "New Lead Created",
  description: "Emit new event when contacts with emails are added to the GetProspect B2B leads database. [See the documentation](https://getprospect.readme.io/reference/publicapiinsightscontroller_publicsearchcontacts)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.getprospect.listLeads;
    },
    getData(lastTs) {
      return lastTs
        ? {
          lastUpdated: lastTs,
        }
        : undefined;
    },
    generateMeta(item) {
      return {
        id: item.getProspectId,
        summary: `New Lead with ID: ${item.getProspectId}`,
        ts: Date.parse(item.lastUpdatedAt),
      };
    },
  },
};
