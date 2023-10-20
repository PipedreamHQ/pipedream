import meistertask from "../../meistertask.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    meistertask,
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
      const resourceFn = this.getResourceFn();
      const args = this.getArgs();
      args.params.items = 25;

      const events = await resourceFn(args);

      if (!(events?.length > 0)) {
        return;
      }
      this._setLastCreated(Date.parse(events[0].created_at));
      events.reverse().forEach((event) => this.emitEvent(event));
    },
  },
  methods: {
    _getLastCreated() {
      return this.db.get("lastCreated") || 0;
    },
    _setLastCreated(lastCreated) {
      this.db.set("lastCreated", lastCreated);
    },
    emitEvent(event) {
      const meta = this.generateMeta(event);
      this.$emit(event, meta);
    },
    getArgs() {
      return {
        params: {
          sort: "-created_at",
        },
      };
    },
    isLater(date1, date2) {
      return date1 > date2;
    },
    getResourceFn() {
      throw new Error("getResourceFn is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run({ $ }) {
    const lastCreated = this._getLastCreated();
    let newLastCreated;

    const resourceFn = this.getResourceFn();
    let args = this.getArgs();
    args = {
      ...args,
      params: {
        ...args.params,
        page: 1,
        items: 100,
      },
      $,
    };

    while (true) {
      const events = await resourceFn(args); console.log(events);
      if (!(events?.length > 0)) {
        return;
      }
      if (!newLastCreated) {
        newLastCreated = Date.parse(events[0].created_at);
        this._setLastCreated(newLastCreated);
      }
      for (const event of events) {
        if (this.isLater(Date.parse(event.created_at), lastCreated)) {
          this.emitEvent(event);
        } else {
          return;
        }
      }
      if (events.length < args.params.items) {
        return;
      }
      args.params.page += 1;
    }
  },
};
