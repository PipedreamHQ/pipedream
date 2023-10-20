import reply from "../../reply_io.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "reply_io-new-link-clicked",
  name: "New Link Clicked",
  description: "Emit new event when a link is clicked in a campaign. [See the docs here](https://apidocs.reply.io/#f01ce84b-1971-4f97-bb6c-acc6e3196d3b)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    reply,
    db: "$.service.db",
    timer: {
      label: "Timer",
      description: "The timer that will trigger the event source",
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    campaignId: {
      propDefinition: [
        reply,
        "campaignId",
      ],
    },
    stepId: {
      propDefinition: [
        reply,
        "stepId",
        (c) => ({
          campaignId: c.campaignId,
        }),
      ],
    },
  },
  methods: {
    _getClickedEmails() {
      return this.db.get("clickedEmails");
    },
    _setClickedEmails(clickedEmails) {
      this.db.set("clickedEmails", clickedEmails);
    },
    generateMeta() {
      const ts = Date.now();
      return {
        id: ts,
        summary: "New Link Clicked",
        ts,
      };
    },
  },
  async run() {
    const clickedEmails = this._getClickedEmails() || 0;
    const stats = await this.reply.getCampaignStepStatistics({
      params: {
        campaignId: this.campaignId,
        stepId: this.stepId,
      },
    });
    if (stats.clickedEmails > clickedEmails) {
      const meta = this.generateMeta();
      this._setClickedEmails(stats.clickedEmails);
      this.$emit(stats, meta);
    }
  },
};
