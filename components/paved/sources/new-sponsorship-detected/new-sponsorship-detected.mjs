import common from "../common/polling.mjs";

export default {
  ...common,
  key: "paved-new-sponsorship-detected",
  name: "New Sponsorship Detected",
  description: "Emit new event when a sponsorship is detected on a newsletter similar to yours. [See the documentation](https://docs.paved.com/list-sponsorships)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourcesFn() {
      return this.app.listSponsorships;
    },
    getResourcesFnArgs() {
      return {
        debug: true,
        slug: this.slug,
      };
    },
    generateMeta(resource) {
      return {
        id: resource.id,
        summary: `New Sponsorthip: ${resource.advertiser_name}`,
        ts: Date.parse(resource.run_date),
      };
    },
  },
};
