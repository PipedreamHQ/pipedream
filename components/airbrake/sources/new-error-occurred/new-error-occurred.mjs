import airbrake from "../../airbrake.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Error Occurred",
  version: "0.0.4",
  key: "airbrake-new-error-occurred",
  description: "Emit new event for each error occurred. [See docs here](https://docs.airbrake.io/docs/devops-tools/api/#list-notices-v4)",
  type: "source",
  dedupe: "unique",
  props: {
    airbrake,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    projectId: {
      propDefinition: [
        airbrake,
        "projectId",
      ],
    },
  },
  methods: {
    emitEvent(data) {
      this._setLastNoticeId(data.id);

      this.$emit(data, {
        id: data.id,
        summary: `New error with id ${data.id}`,
        ts: Date.parse(data.created_at),
      });
    },
    _setLastNoticeId(id) {
      this.db.set("lastNoticeId", id);
    },
    _getLastNoticeId() {
      return this.db.get("lastNoticeId");
    },
  },
  hooks: {
    async deploy() {
      const { notices } = await this.airbrake.getProjectNotices({
        projectId: this.projectId,
        params: {
          page: 1,
        },
      });

      notices.slice(-10).reverse()
        .forEach(this.emitEvent);
    },
  },
  async run() {
    const lastNoticeId = this._getLastNoticeId();

    let page = 1;

    while (page >= 0) {
      const { notices } = await this.airbrake.getProjectNotices({
        projectId: this.projectId,
        params: {
          page,
        },
      });

      notices.reverse().forEach(this.emitEvent);

      if (notices.filter((notice) => notice.id === lastNoticeId)) {
        return;
      }

      page++;
    }
  },
};
