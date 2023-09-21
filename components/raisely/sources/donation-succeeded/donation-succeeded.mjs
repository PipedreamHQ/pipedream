import common from "../common/common.mjs";

export default {
  ...common,
  key: "raisely-donation-succeeded",
  name: "Donation Succeeded",
  description: "Emit new event when a donation has succeeded.",
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
      return (donation.status === "OK") && (!this.campaignId || (this.campaignId === donation.campaignUuid));
    },
    generateMeta(donation) {
      return {
        id: donation.uuid,
        summary: `New Donation Succeeded "${donation.uuid}"`,
        ts: Date.parse(donation[this.getTsField()]),
      };
    },
  },
};
