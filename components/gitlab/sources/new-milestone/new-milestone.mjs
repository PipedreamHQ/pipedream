import gitlab from "../../gitlab.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "gitlab-new-milestone",
  name: "New Milestone",
  description: "Emit new event when a milestone is created in a project",
  version: "0.1.3",
  dedupe: "greatest",
  type: "source",
  props: {
    gitlab,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    projectId: {
      propDefinition: [
        gitlab,
        "projectId",
      ],
    },
  },
  methods: {
    _getLastProcessedMilestoneTime() {
      return this.db.get("lastProcessedMilestoneTime");
    },
    _setLastProcessedMilestoneTime(lastProcessedMilestoneTime) {
      this.db.set("lastProcessedMilestoneTime", lastProcessedMilestoneTime);
    },
    generateMeta(data) {
      const {
        id,
        created_at: createdAt,
        title,
      } = data;
      return {
        id,
        summary: `New milestone: ${title}`,
        ts: +new Date(createdAt),
      };
    },
  },
  async run() {
    const isoDateNow = new Date().toISOString()
      .slice(0, -5) + "Z";
    let lastProcessedMilestoneTime = this._getLastProcessedMilestoneTime() ?? isoDateNow;
    const newOrUpdatedMilestones = await this.gitlab.listMilestones(this.projectId, {
      params: {
        updated_after: lastProcessedMilestoneTime,
      },
    });

    const milestones = newOrUpdatedMilestones.filter(
      ({ created_at }) => Date.parse(created_at) > Date.parse(lastProcessedMilestoneTime),
    );

    if (milestones.length === 0) {
      console.log("No new GitLab milestones detected");
      if (!this._getLastProcessedMilestoneTime()) {
        this._setLastProcessedMilestoneTime(lastProcessedMilestoneTime);
      }
      return;
    }

    console.log(`Detected ${milestones.length} new milestones`);

    // We store the most recent milestone ID in the DB so that
    // we don't process it (and previous milestones) in future runs.
    lastProcessedMilestoneTime = milestones[0].created_at;
    this._setLastProcessedMilestoneTime(lastProcessedMilestoneTime);

    // We need to sort the retrieved milestones
    // in reverse order (since the Gitlab API sorts them
    // from most to least recent) and emit an event for each
    // one of them.
    milestones.reverse().forEach((milestone) => {
      const meta = this.generateMeta(milestone);
      this.$emit(milestone, meta);
    });
  },
};
