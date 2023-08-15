import zerotier from "../../zerotier.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  type: "source",
  dedupe: "unique",
  props: {
    zerotier,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    networkId: {
      propDefinition: [
        zerotier,
        "networkId",
      ],
    },
  },
  methods: {
    _getNodeStatus(nodeId) {
      return this.db.get(nodeId);
    },
    _setNodeStatus(nodeId, status) {
      return this.db.set(nodeId, status);
    },
  },
  async run() {
    const nodes = await this.zerotier.getNetworkNodes({
      networkId: this.networkId,
    });

    for (const node of nodes) {
      const {
        clock,
        lastSeen,
        nodeId,
        name,
        networkId,
      } = node;
      const previousStatus = this._getNodeStatus(nodeId);
      const rightStatus = this.getRightStatus();

      const online = !(lastSeen === 0) && ((clock - lastSeen) < 180000);   //lastSeen === 0 means Zerotier reset api to 0 and indicates device has never connected since

      if (previousStatus == null)
        this._setNodeStatus(nodeId, online);
      else if (online != previousStatus) {
        this._setNodeStatus(nodeId, online);

        if (online === rightStatus) {
          const statusName = rightStatus
            ? "online"
            : "offline";
          this.$emit(node, {
            id: `${networkId} - ${nodeId} - ${clock}`,
            summary: `Node ${nodeId} (${name}) is ${statusName}`,
            ts: Date.now(),
          });
        }
      }
    }
  },
};
