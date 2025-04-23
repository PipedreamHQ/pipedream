import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import peerdom from "../../peerdom.app.mjs";

export default {
  key: "peerdom-new-member",
  name: "New Member Added",
  description: "Emit new event when a new member is added to a circle or assigned to a role. [See the documentation](https://api.peerdom.org/v1/docs)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    peerdom,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    circleId: {
      propDefinition: [
        peerdom,
        "circleId",
      ],
    },
  },
  methods: {
    _getLastTimestamp() {
      return this.db.get("lastTimestamp") || 0;
    },
    _setLastTimestamp(ts) {
      this.db.set("lastTimestamp", ts);
    },
    async _getNewMembers(circleId, since) {
      return this.peerdom._makeRequest({
        path: `/circles/${circleId}/members?since=${since}`,
      });
    },
  },
  hooks: {
    async deploy() {
      const currentTimestamp = Date.now();
      const newMembers = await this._getNewMembers(this.circleId, 0);

      newMembers.slice(0, 50).forEach((member) => {
        this.$emit(member, {
          id: member.id,
          summary: `New Member Added: ${member.name}`,
          ts: Date.parse(member.createdAt),
        });
      });

      this._setLastTimestamp(currentTimestamp);
    },
    async activate() {
      // No activation needed for polling
    },
    async deactivate() {
      // No deactivation needed for polling
    },
  },
  async run() {
    const lastTimestamp = this._getLastTimestamp();
    const newMembers = await this._getNewMembers(this.circleId, lastTimestamp);

    newMembers.forEach((member) => {
      this.$emit(member, {
        id: member.id,
        summary: `New Member Added: ${member.name}`,
        ts: Date.parse(member.createdAt),
      });
    });

    if (newMembers.length) {
      const latestTimestamp = Date.parse(newMembers[newMembers.length - 1].createdAt);
      this._setLastTimestamp(latestTimestamp);
    }
  },
};
