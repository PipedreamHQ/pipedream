import bloomerang from "../../bloomerang.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "bloomerang-new-donation",
  name: "New Donation",
  description: "Emit a new event when a donation is received in Bloomerang. [See the documentation](https://bloomerang.co/product/integrations-data-management/api/rest-api/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    bloomerang,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 900,
      },
    },
    donationType: {
      propDefinition: [
        bloomerang,
        "donationType",
      ],
    },
    fundId: {
      propDefinition: [
        bloomerang,
        "fundId",
      ],
    },
  },
  methods: {
    _getLastDonationTimestamp() {
      return this.db.get("lastDonationTimestamp") || 0;
    },
    _setLastDonationTimestamp(ts) {
      this.db.set("lastDonationTimestamp", ts);
    },
    async _getDonations() {
      const params = {
        donationType: this.donationType,
        fundId: this.fundId,
        since: this._getLastDonationTimestamp(),
      };
      return this.bloomerang._makeRequest({
        path: "/donations",
        params,
      });
    },
  },
  hooks: {
    async deploy() {
      const donations = await this._getDonations();
      const emitDonations = donations.slice(-50).reverse(); // Emit at most 50 latest donations

      for (const donation of emitDonations) {
        this.$emit(donation, {
          id: donation.id,
          summary: `New Donation from ${donation.constituentId}`,
          ts: new Date(donation.date).getTime(),
        });
      }

      if (donations.length > 0) {
        const latestTimestamp = new Date(donations[0].date).getTime();
        this._setLastDonationTimestamp(latestTimestamp);
      }
    },
  },
  async run() {
    const lastTimestamp = this._getLastDonationTimestamp();

    const params = {
      donationType: this.donationType,
      fundId: this.fundId,
    };

    const donations = await this._getDonations(params);

    for (const donation of donations) {
      const donationTimestamp = new Date(donation.date).getTime();
      if (donationTimestamp > lastTimestamp) {
        this.$emit(donation, {
          id: donation.id,
          summary: `New Donation: ${donation.amount}`,
          ts: donationTimestamp,
        });
      }
    }

    if (donations.length > 0) {
      const latestTimestamp = new Date(donations[0].date).getTime();
      this._setLastDonationTimestamp(latestTimestamp);
    }
  },
};
