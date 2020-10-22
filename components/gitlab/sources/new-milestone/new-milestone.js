const gitlab = require("../../gitlab.app.js");

module.exports = {
  key: "gitlab-new-milestone",
  name: "New Milestone",
  description: "Emit an event when a new milestone is created in a project",
  version: "0.0.1",
  dedupe: "greatest",
  props: {
    gitlab,
    projectId: { propDefinition: [gitlab, "projectId"] },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const opts = {
        projectId: this.projectId,
        pageSize: 1,
      };
      const milestones = await this.collectMilestones(opts);
      if (milestones.length > 0) {
        const lastProcessedMilestoneId = milestones[0].id
        this.db.set("lastProcessedMilestoneId", lastProcessedMilestoneId);
        console.log(
          `Polling Gitlab milestones created after ID ${lastProcessedMilestoneId}`
        );
      }
    },
  },
  methods: {
    generateMeta(data) {
      const {
        id,
        created_at,
        title,
      } = data;
      const ts = +new Date(created_at);
      return {
        id,
        summary: title,
        ts,
      };
    },
    async collectMilestones(opts) {
      const milestones = this.gitlab.getMilestones(opts);
      const milestonesCollected = [];
      for await (const milestone of milestones) {
        milestonesCollected.push(milestone);
      }
      return milestonesCollected;
    },
  },
  async run() {
    // We use the ID of the last processed milestone so that we
    // don't emit events for them (i.e. we only want to emit events
    // for new milestones).
    let lastProcessedMilestoneId = this.db.get("lastProcessedMilestoneId");
    const opts = {
      projectId: this.projectId,
      lastProcessedMilestoneId,
    };
    const unprocessedMilestones = await this.collectMilestones(opts);

    if (unprocessedMilestones.length <= 0) {
      console.log("No new Gitlab milestones detected");
      return;
    }

    console.log(`Detected ${unprocessedMilestones.length} new milestones`);

    // We store the most recent milestone ID in the DB so that
    // we don't process it (and previous milestones) in future runs.
    lastProcessedMilestoneId = unprocessedMilestones[0].id;
    this.db.set("lastProcessedMilestoneId", lastProcessedMilestoneId);

    // We need to sort the retrieved milestones
    // in reverse order (since the Gitlab API sorts them
    // from most to least recent) and emit an event for each
    // one of them.
    unprocessedMilestones.reverse().forEach(milestone => {
      const meta = this.generateMeta(milestone);
      this.$emit(milestone, meta);
    });
  },
};
