const gitlab = require("https://github.com/PipedreamHQ/pipedream/components/gitlab/gitlab.app.js");

module.exports = {
  name: "New Project",
  description: "Triggers when a new project (i.e. repository) is created",
  version: "0.0.1",
  dedupe: "greatest",
  props: {
    gitlab,
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
        collectLimit: 1,
        pageSize: 1,
      };
      const projects = await this.collectProjects(opts);
      if (projects.length > 0) {
        const lastProcessedProjectId = projects[0].id
        this.db.set("lastProcessedProjectId", lastProcessedProjectId);
        console.log(
          `Polling Gitlab projects created after ID ${lastProcessedProjectId}`
        );
      }
    },
  },
  methods: {
    generateMeta(data) {
      const {
        id,
        created_at,
        name,
      } = data;
      const summary = `New project: ${name}`;
      const ts = +new Date(created_at);
      return {
        id,
        summary,
        ts,
      };
    },
    async collectProjects(opts) {
      let { collectLimit } = opts;
      if (collectLimit !== undefined && collectLimit <= 0) {
        return [];
      }

      const projects = this.gitlab.getProjects(opts);
      const projectsCollected = [];
      for await (const project of projects) {
        projectsCollected.push(project);
        if (collectLimit !== undefined && --collectLimit == 0) {
          break;
        }
      }
      return projectsCollected;
    },
  },
  async run() {
    // We use the ID of the last processed project so that we
    // don't emit events for them (i.e. we only want to emit events
    // for new projects).
    let lastProcessedProjectId = this.db.get("lastProcessedProjectId");
    const opts = {
      lastProcessedProjectId,
    };
    const unprocessedProjects = await this.collectProjects(opts);

    if (unprocessedProjects.length <= 0) {
      console.log("No new Gitlab projects detected");
      return;
    }

    console.log(`Detected ${unprocessedProjects.length} new projects`);

    // We store the most recent project ID in the DB so that
    // we don't process it (and previous projects) in future runs.
    lastProcessedProjectId = unprocessedProjects[0].id;
    this.db.set("lastProcessedProjectId", lastProcessedProjectId);

    // We need to sort the retrieved projects
    // in reverse order (since the Gitlab API sorts them
    // from most to least recent) and emit an event for each
    // one of them.
    unprocessedProjects.reverse().forEach(project => {
      const meta = this.generateMeta(project);
      this.$emit(project, meta);
    });
  },
};
