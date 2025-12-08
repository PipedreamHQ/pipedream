import common from "../common/base.mjs";

export default {
  ...common,
  key: "growsurf-new-campaign-referral-made",
  name: "New Campaign Referral Made",
  description: "Emit new event when a new referral is made for a campaign. [See the documentation](https://docs.growsurf.com/developer-tools/rest-api/api-reference#get-referrals-and-invites)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    campaignId: {
      propDefinition: [
        common.props.growsurf,
        "campaignId",
      ],
    },
  },
  methods: {
    ...common.methods,
    async getResources(max) {
      const results = this.growsurf.paginate({
        fn: this.growsurf.listReferrals,
        args: {
          campaignId: this.campaignId,
          params: {
            sortBy: "createdAt",
            desc: true,
          },
        },
        resourceKey: "referrals",
        max,
      });
      const referrals = [];
      const lastTs = this._getLastTs();
      let maxTs = lastTs;
      for await (const referral of results) {
        const ts = referral.createdAt;
        if (ts > lastTs) {
          referrals.push(referral);
          maxTs = Math.max(ts, maxTs);
        } else {
          break;
        }
      }
      this._setLastTs(maxTs);
      return referrals;
    },
    generateMeta(referral) {
      return {
        id: referral.id,
        summary: `New Campaign Referral Made: ${referral.email || referral.id}`,
        ts: referral.createdAt,
      };
    },
  },
};
