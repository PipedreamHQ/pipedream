import { axios } from "@pipedream/platform";
import _21risk from "../../_21risk.app.mjs";

export default {
  key: "_21risk-new-action",
  name: "New Action or Corrective Action Created",
  description: "Emit new event when a new action or corrective action is created due to non-compliance in a risk-model category during an audit. [See the documentation](https://api.21risk.com/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    _21risk,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  hooks: {
    async deploy() {
      const actions = await this._21risk.emitNewActionEvent();
      actions.slice(0, 50).forEach((action) => {
        this.$emit(action, {
          id: action.id,
          summary: `New Action: ${action.name}`,
          ts: new Date(action.createdAt).getTime(),
        });
      });
    },
  },
  methods: {
    _getLastTimestamp() {
      return this.db.get("lastTimestamp") || 0;
    },
    _setLastTimestamp(timestamp) {
      this.db.set("lastTimestamp", timestamp);
    },
  },
  async run() {
    const lastTimestamp = this._getLastTimestamp();
    const actions = await this._21risk.emitNewActionEvent({
      params: {
        $filter: `createdAt gt ${new Date(lastTimestamp).toISOString()}`,
      },
    });

    actions.forEach((action) => {
      this.$emit(action, {
        id: action.id,
        summary: `New Action: ${action.name}`,
        ts: new Date(action.createdAt).getTime(),
      });
    });

    if (actions.length > 0) {
      const latestTimestamp = new Date(actions[actions.length - 1].createdAt).getTime();
      this._setLastTimestamp(latestTimestamp);
    }
  },
};
