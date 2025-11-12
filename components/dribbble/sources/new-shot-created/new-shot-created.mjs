import dribbble from "../../dribbble.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "dribbble-new-shot-created",
  name: "New Shot Created",
  description: "Emit new events when new shots are created",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    dribbble,
    timer: {
      type: "$.interface.timer",
      label: "Polling schedule",
      description: "How often to poll the Dribbble API",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
  },
  methods: {
    _setLastShotId(id) {
      this.db.set("lastShotId", id);
    },
    _getLastShotId() {
      return this.db.get("lastShotId");
    },
    _setLastSyncTime(time) {
      this.db.set("lastSyncTime", time);
    },
    _getLastSyncTime() {
      return this.db.get("lastSyncTime");
    },
    emitEvent(shot) {
      this.$emit(shot, {
        id: shot.id,
        summary: shot.title,
        ts: Date.parse(shot.published_at),
      });
    },
  },
  hooks: {
    async deploy() {
      const shots = await this.dribbble.getShots({
        params: {
          per_page: 10,
        },
      });

      shots.forEach(this.emitEvent);
    },
  },
  async run() {
    const lastShotId = this._getLastShotId();

    let page = 1;

    while (true) {
      const lastSyncTime = this._getLastSyncTime();

      this._setLastSyncTime(new Date().getTime());

      const shots = await this.dribbble.getShots({
        params: {
          page: page,
          per_page: 100,
        },
      });

      shots.filter((shot) => Date.parse(shot.published_at) > lastSyncTime).forEach(this.emitEvent);

      this._setLastShotId(shots[0].id);

      if (
        shots.length < 100 ||
        shots.filter((shot) => shot.id === lastShotId).length
      ) {
        return;
      }

      page++;
    }
  },
};
