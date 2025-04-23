import { axios } from "@pipedream/platform";
import peerdom from "../../peerdom.app.mjs";

export default {
  key: "peerdom-new-role",
  name: "New Role Created",
  description: "Emit new event when a new role is created in a circle. [See the documentation](https://api.peerdom.org/v1/docs)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    peerdom,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 3600,
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
    async getRoles(circleId) {
      return this.peerdom._makeRequest({
        method: "GET",
        path: `/circles/${circleId}/roles`,
      });
    },
    async emitRoleEvents() {
      const storedRoleIds = this.db.get("roleIds") || [];
      const roles = await this.getRoles(this.circleId);
      const newRoles = roles.filter((role) => !storedRoleIds.includes(role.id));

      for (const role of newRoles) {
        this.$emit(role, {
          id: role.id,
          summary: `New Role Created: ${role.name}`,
          ts: new Date(role.createdAt).getTime(),
        });
      }

      const allRoleIds = roles.map((role) => role.id);
      this.db.set("roleIds", allRoleIds);
    },
  },
  hooks: {
    async deploy() {
      await this.emitRoleEvents();
    },
    async activate() {
      // Add code for activation if needed
    },
    async deactivate() {
      // Add code for deactivation if needed
    },
  },
  async run() {
    await this.emitRoleEvents();
  },
};
