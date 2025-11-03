import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import popupsmart from "../../popupsmart.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "popupsmart-new-popup-form-data",
  name: "New Popup Form Data",
  description: "Emit new event when a new popup form data is received. [See the documentation](https://popupsmart.com/help/detail/how-to-auto-download-leads-using-an-api)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    popupsmart,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The ID of the campaign to get form data from.",
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || 0;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async startEvent(maxResults = 0) {
      const lastDate = this._getLastDate();
      let leads = this.popupsmart.paginate({
        maxResults,
        fn: this.popupsmart.listLeads,
        headers: {
          "x-campaign-id": this.campaignId,
        },
      });

      leads = leads.filter((item) => Date.parse(item.date) > lastDate);

      if (leads.length) {
        this._setLastDate(Date.parse(leads[0].date));
      }
      for (const item of leads.reverse()) {
        this.$emit(item, {
          id: item.id,
          summary: `New form data for popup ${this.campaignId}`,
          ts: Date.parse(item.date),
        });
      }
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25);
    },
  },
  async run() {
    await this.startEvent();
  },
  sampleEmit,
};
