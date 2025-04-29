import common from "../common/base.mjs";

export default {
  ...common,
  key: "nile_database-new-tenant-created",
  name: "New Tenant Created",
  description: "Emit new event when a new tenant is added to a Nile Database",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.nile.listTenants;
    },
    generateMeta(tenant) {
      return {
        id: tenant.id,
        summary: `New Tenant ID: ${tenant.id}`,
        ts: Date.now(),
      };
    },
  },
};
