import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import freedcamp from "../../freedcamp.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "freedcamp-new-project-created",
  name: "New Project Created",
  description: "Emit new event when a new project is created in Freedcamp. [See the documentation](https://freedcamp.com/help_/tutorials/wiki/wiki_public/view/DFaab#get_fcu_3)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    freedcamp,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    async emitEvent(maxResults = false) {
      const lastId = this._getLastId();

      const { data: { projects } } = await this.freedcamp.listProjects();

      const responseArray =  projects
        .sort((a, b) => b.project_id - a.project_id)
        .filter((item) => item.project_id > lastId);

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        this._setLastId(responseArray[0].project_id);
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item.project_id,
          summary: `New Project: ${item.project_name}`,
          ts: Date.parse(new Date()),
        });
      }
    },
  },
  hooks: {
    async deploy() {
      await this.emitEvent(25);
    },
  },
  async run() {
    await this.emitEvent();
  },
  sampleEmit,
};
