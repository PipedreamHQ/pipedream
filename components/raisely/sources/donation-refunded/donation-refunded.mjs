import common from "../common/common.mjs";

export default {
  ...common,
  key: "raisely-donation-refunded",
  name: "Donation Refunded",
  description: "Emit new event when a donation has been refunded.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    campaignId: {
      propDefinition: [
        common.props.raisely,
        "campaignId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.raisely.listDonations;
    },
    getParams() {
      return {
        campaign: this.campaignId,
      };
    },
    getTsField() {
      return "updatedAt";
    },
    isRelevant(donation) {
      return donation.status === "REFUNDED" && (!this.campaignId || (this.campaignId === donation.campaignUuid));
    },
    generateMeta(donation) {
      return {
        id: donation.uuid,
        summary: `New Donation Refunded "${donation.uuid}"`,
        ts: Date.parse(donation[this.getTsField()]),
      };
    },
  },
};
