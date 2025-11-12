import common from "../common/base.mjs";

export default {
  ...common,
  key: "domain_group-new-agency-created",
  name: "New Agency Created",
  description: "Emit new event when a new agency is created. [See the documentation](https://developer.domain.com.au/docs/latest/apis/pkg_listing_management/references/me_getmyagencies/)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getResults() {
      const agencies = await this.domainGroup.listAgencies();
      const results = [];
      for (const agency of agencies) {
        results.push(agency);
      }
      return results;
    },
    generateMeta(item) {
      return {
        id: item.id,
        summary: `New Agency with ID: ${item.id}`,
        ts: Date.now(),
      };
    },
  },
};
