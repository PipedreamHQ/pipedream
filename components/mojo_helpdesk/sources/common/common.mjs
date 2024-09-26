import mojoHelpdesk from "../../mojo_helpdesk.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    mojoHelpdesk,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      const events = await this.getResources({
        per_page: 10,
      });
      if (!(events?.length > 0)) {
        return;
      }
      this._setLastTs(Date.parse(events[0][this.getSortField()]));
      events.reverse().forEach((event) => this.emitEvent(event));
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs");
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    emitEvent(event) {
      const meta = this.generateMeta(event);
      this.$emit(event, meta);
    },
    getSortField() {
      throw new Error("getSortField is not implemented");
    },
    getResources() {
      throw new Error("getResources is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    const sortField = this.getSortField();
    let newLastTs = null;

    const perPage = 100;
    let page = 1;
    let done = false;

    while (!done) {
      const events = await this.getResources({
        page,
        per_page: perPage,
      });

      if (!newLastTs && events?.length > 0) {
        newLastTs = Date.parse(events[0][sortField]);
      }

      for (const event of events) {
        if (Date.parse(event[sortField]) <= lastTs) {
          done = true;
          break;
        }
        this.emitEvent(event);
      }

      if (events?.length < perPage) {
        break;
      }
      page++;
    }

    this._setLastTs(newLastTs);
  },
};
