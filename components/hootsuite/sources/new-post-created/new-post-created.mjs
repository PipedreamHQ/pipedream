import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import dayjs from "dayjs";
import hootsuite from "../../hootsuite.app.mjs";
import constants from "../common/constants.mjs";

export default {
  name: "New Post Created",
  version: "0.0.3",
  key: "hootsuite-new-post-created",
  description: "Emit new event on each new created post. [See docs here](https://platform.hootsuite.com/docs/api/index.html#operation/retrieveMessages).",
  type: "source",
  dedupe: "unique",
  props: {
    hootsuite,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    states: {
      label: "States",
      description: "Selected the states to filter",
      options: constants.STATES,
      type: "string[]",
    },
  },
  methods: {
    emitEvent(data) {
      if (!this.states.includes(data.state)) {
        return;
      }

      this.$emit(data, {
        id: data.id,
        summary: `New post created with ID ${data.id}`,
        ts: new Date(),
      });
    },
    _setLastSyncTimestamp() {
      this.db.set("lastSyncTimestamp", dayjs().toISOString());
    },
    _getLastSyncTimestamp() {
      return this.db.get("lastSyncTimestamp");
    },
  },
  hooks: {
    async deploy() {
      this._setLastSyncTimestamp();

      const { data: posts } = await this.hootsuite.getPosts({
        params: {
          startTime: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString(),
          endTime: new Date().toISOString(),
        },
      });

      posts.forEach(this.emitEvent);
    },
  },
  async run() {
    const lastSyncTimestamp = this._getLastSyncTimestamp();
    this._setLastSyncTimestamp();

    const { data: posts } = await this.hootsuite.getPosts({
      params: {
        startTime: dayjs(lastSyncTimestamp).subtract(24, "hour")
          .toISOString(),
        endTime: dayjs().add(24, "hour")
          .toISOString(),
      },
    });

    posts.forEach(this.emitEvent);
  },
};
