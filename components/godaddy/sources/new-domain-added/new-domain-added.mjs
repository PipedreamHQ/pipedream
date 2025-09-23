import common from "../common/base.mjs";

export default {
  ...common,
  key: "godaddy-new-domain-added",
  name: "New Domain Added",
  description: "Emit new event when a new domain is added. [See the documentation](https://developer.godaddy.com/doc/endpoint/domains#/v1/list)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    statuses: {
      propDefinition: [
        common.props.godaddy,
        "statuses",
      ],
    },
    statusGroups: {
      propDefinition: [
        common.props.godaddy,
        "statusGroups",
      ],
    },
    includes: {
      propDefinition: [
        common.props.godaddy,
        "includes",
      ],
    },
  },
  methods: {
    ...common.methods,
    generateMeta(domain) {
      return {
        id: domain.domain,
        summary: domain.domain,
        ts: Date.parse(domain.createdAt),
      };
    },
    async processEvents(max) {
      const lastTs = this._getLastTs();
      const domains = [];

      const results = this.godaddy.paginate({
        fn: this.godaddy.listDomains,
        params: {
          statuses: this.statuses,
          statusGroups: this.statusGroups,
          includes: this.includes,
          modifiedDate: lastTs,
        },
        max,
      });

      for await (const domain of results) {
        domains.push(domain);
      }

      if (!domains.length) {
        return;
      }

      this._setLastTs(domains[domains.length - 1].createdAt);

      domains.forEach((domain) => {
        const meta = this.generateMeta(domain);
        this.$emit(domain, meta);
      });
    },
  },
  hooks: {
    async deploy() {
      await this.processEvents(25);
    },
  },
  async run() {
    await this.processEvents();
  },
};
