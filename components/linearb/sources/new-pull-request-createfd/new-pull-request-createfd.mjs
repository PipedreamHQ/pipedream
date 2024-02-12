import { axios } from "@pipedream/platform";
import linearb from "../../linearb.app.mjs";

export default {
  key: "linearb-new-pull-request-created",
  name: "New Pull Request Created",
  description: "Emits an event when a new pull request is created. [See the documentation](https://linearb.helpdocs.io/search/api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    linearb,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60, // Run every minute
      },
    },
  },
  hooks: {
    async deploy() {
      const pullRequests = await this.linearb.getPullRequests({
        pageSize: 50,
        orderBy: "created",
        direction: "desc",
      });

      const latestPullRequests = pullRequests.slice(0, 50);
      for (const pr of latestPullRequests) {
        this.$emit(pr, {
          id: pr.id,
          summary: `New Pull Request: ${pr.title}`,
          ts: Date.parse(pr.created_at),
        });
      }

      // Store the timestamp of the latest pull request
      const latestTimestamp = latestPullRequests.length > 0
        ? Date.parse(latestPullRequests[0].created_at)
        : new Date().getTime();
      this.db.set("lastEmittedTime", latestTimestamp);
    },
  },
  methods: {
    ...linearb.methods,
    generateMeta(data) {
      return {
        id: data.id,
        summary: `New Pull Request: ${data.title}`,
        ts: Date.parse(data.created_at),
      };
    },
  },
  async run() {
    const lastEmittedTime = this.db.get("lastEmittedTime") || 0;
    const pullRequests = await this.linearb.getPullRequests({
      pageSize: 50,
      orderBy: "created",
      direction: "desc",
    });

    for (const pr of pullRequests) {
      const createdAt = Date.parse(pr.created_at);
      if (createdAt > lastEmittedTime) {
        this.$emit(pr, this.generateMeta(pr));
      }
    }

    // Update the last emitted time
    const latestTime = pullRequests.length > 0
      ? Date.parse(pullRequests[0].created_at)
      : lastEmittedTime;
    this.db.set("lastEmittedTime", latestTime);
  },
};
