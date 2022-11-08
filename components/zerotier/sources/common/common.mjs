import zerotier from "../../zerotier.app.mjs";

export default {
  type: "source",
  dedupe: "unique",
  props: {
    zerotier,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
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
        online,
        nodeId,
        name,
        networkId,
      } = node;
      const previousStatus = this._getNodeStatus(nodeId);
      const rightStatus = this.getRightStatus();

      if (online != previousStatus) {
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
