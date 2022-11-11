import gitlab from "../../gitlab.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "gitlab-new-project",
  name: "New Project",
  description: "Emit new event when a project (i.e. repository) is created",
  version: "0.1.1",
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
  },
  hooks: {
    async activate() {
      const { data: projects } = await this.gitlab.listProjects({
        owned: true,
        max: 1,
      });
      if (projects.length > 0) {
        const lastProcessedProjectId = projects[0].id;
        this._setLastProcessedProjectId(lastProcessedProjectId);
        console.log(`Polling GitLab projects created after ID ${lastProcessedProjectId}`);
      }
    },
  },
  methods: {
    _getLastProcessedProjectId() {
      return this.db.get("lastProcessedProjectId");
    },
    _setLastProcessedProjectId(lastProcessedProjectId) {
      this.db.set("lastProcessedProjectId", lastProcessedProjectId);
    },
    generateMeta(data) {
      const {
        id,
        created_at: createdAt,
        name,
      } = data;
      return {
        id,
        summary: `New project: ${name}`,
        ts: +new Date(createdAt),
      };
    },
  },
  async run() {
    // We use the ID of the last processed project so that we
    // don't emit events for them (i.e. we only want to emit events
    // for new projects).
    let lastProcessedProjectId = this._getLastProcessedProjectId();
    const projects = await this.gitlab.getUnprocessedProjects(lastProcessedProjectId);

    if (projects.length === 0) {
      console.log("No new GitLab projects detected");
      return;
    }

    console.log(`Detected ${projects.length} new projects`);

    // We store the most recent project ID in the DB so that
    // we don't process it (and previous projects) in future runs.
    lastProcessedProjectId = projects[0].id;
    this._setLastProcessedProjectId(lastProcessedProjectId);

    // We need to sort the retrieved projects
    // in reverse order (since the Gitlab API sorts them
    // from most to least recent) and emit an event for each
    // one of them.
    projects.reverse().forEach((project) => {
      const meta = this.generateMeta(project);
      this.$emit(project, meta);
    });
  },
};
