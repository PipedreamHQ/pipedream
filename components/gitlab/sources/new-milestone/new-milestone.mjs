import gitlab from "../../gitlab.app.mjs";

export default {
  key: "gitlab-new-milestone",
  name: "New Milestone",
  description: "Emit new event when a milestone is created in a project",
  version: "0.1.0",
  dedupe: "greatest",
  type: "source",
  props: {
    gitlab,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
    projectId: {
      propDefinition: [
        gitlab,
        "projectId",
      ],
    },
  },
  hooks: {
    async activate() {
      const milestones = await this.gitlab.listMilestones(this.projectId, {
        max: 1,
      });
      if (milestones.length > 0) {
        const lastProcessedMilestoneId = milestones[0].id;
        this.db.set("lastProcessedMilestoneId", lastProcessedMilestoneId);
        console.log(`Polling GitLab milestones created after ID ${lastProcessedMilestoneId}`);
      }
    },
  },
  methods: {
    _getLastProcessedMilestoneId() {
      return this.db.get("lastProcessedMilestoneId");
    },
    _setLastProcessedMilestoneId(lastProcessedMilestoneId) {
      this.db.set("lastProcessedMilestoneId", lastProcessedMilestoneId);
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
    // We use the ID of the last processed milestone so that we
    // don't emit events for them (i.e. we only want to emit events
    // for new milestones).
    let lastProcessedMilestoneId = this._getLastProcessedMilestoneId();
    const milestones = await this.gitlab.getUnprocessedMilestones(
      this.projectId,
      lastProcessedMilestoneId,
    );

    if (milestones.length === 0) {
      console.log("No new GitLab milestones detected");
      return;
    }

    console.log(`Detected ${milestones.length} new milestones`);

    // We store the most recent milestone ID in the DB so that
    // we don't process it (and previous milestones) in future runs.
    lastProcessedMilestoneId = milestones[0].id;
    this._setLastProcessedMilestoneId(lastProcessedMilestoneId);

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
