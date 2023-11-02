import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import meetingpulse from "../../meetingpulse.app.mjs";

export default {
  key: "meetingpulse-new-contribution-to-topic",
  name: "New Contribution to Topic",
  description: "Emit new event every time there is new data for all created topics for a meeting. [See the documentation](https://app.meet.ps/api/docs/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    meetingpulse,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    meetingId: {
      propDefinition: [
        meetingpulse,
        "meetingId",
      ],
    },
  },
  methods: {
    _getLastContributionId() {
      return this.db.get("lastContributionId") ?? null;
    },
    _setLastContributionId(id) {
      this.db.set("lastContributionId", id);
    },
  },
  async run() {
    const lastContributionId = this._getLastContributionId();
    const topics = await this.meetingpulse.getTopics({
      meetingId: this.meetingId,
    });
    let newLastContributionId = lastContributionId;

    for (const topic of topics) {
      for (const contribution of topic.contributions) {
        if (lastContributionId && contribution.id <= lastContributionId) {
          continue;
        }
        this.$emit(contribution, {
          id: contribution.id,
          summary: `New Contribution: ${contribution.title}`,
          ts: Date.parse(contribution.created),
        });
        newLastContributionId = Math.max(newLastContributionId, contribution.id);
      }
    }

    this._setLastContributionId(newLastContributionId);
  },
};
