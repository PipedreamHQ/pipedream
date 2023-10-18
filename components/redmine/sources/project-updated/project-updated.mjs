import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import redmine from "../../redmine.app.mjs";

export default {
  key: "redmine-project-updated",
  name: "Project Updated",
  description: "Emits an event whenever a project is updated in Redmine",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    redmine,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    projectId: {
      propDefinition: [
        redmine,
        "projectId",
      ],
    },
  },
  methods: {
    _getLastUpdatedTime() {
      return this.db.get("lastUpdatedTime") ?? 0;
    },
    _setLastUpdatedTime(lastUpdatedTime) {
      this.db.set("lastUpdatedTime", lastUpdatedTime);
    },
  },
  async run() {
    const lastUpdatedTime = this._getLastUpdatedTime();
    let maxUpdatedTime = 0;

    const project = await this.redmine.getProjectUpdated({
      projectId: this.projectId,
    });

    const updatedOn = Date.parse(project.updated_on);
    if (updatedOn > lastUpdatedTime) {
      this.$emit(project, {
        id: project.id,
        summary: `Project ${project.name} updated`,
        ts: updatedOn,
      });
      maxUpdatedTime = Math.max(maxUpdatedTime, updatedOn);
    }

    this._setLastUpdatedTime(maxUpdatedTime);
  },
};
