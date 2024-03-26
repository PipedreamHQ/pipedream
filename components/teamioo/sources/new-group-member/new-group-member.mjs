import teamioo from "../../teamioo.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "teamioo-new-group-member",
  name: "New Group Member",
  description: "Emits an event when a new member is added to a group. [See the documentation]()",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    teamioo,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    groupid: {
      propDefinition: [
        teamioo,
        "groupid",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Fetch and emit members on first run to establish state
      const members = await this.fetchGroupMembers(this.groupid);
      members.forEach((member) => {
        this.$emit(member, {
          id: member.id.toString(),
          summary: `New member: ${member.name}`,
          ts: Date.now(),
        });
      });
    },
  },
  methods: {
    async fetchGroupMembers(groupId) {
      const path = `/groups/${groupId}/members`;
      const response = await this.teamioo._makeRequest({
        path,
        method: "GET",
      });
      return response.members || [];
    },
    async checkNewMembers() {
      const groupId = this.groupid;
      const currentMembers = await this.fetchGroupMembers(groupId);
      const lastMemberId = this.db.get("lastMemberId") || 0;
      const newMembers = currentMembers.filter((member) => member.id > lastMemberId);

      if (newMembers.length > 0) {
        const maxId = Math.max(...newMembers.map((member) => member.id));
        this.db.set("lastMemberId", maxId);
      }

      return newMembers;
    },
  },
  async run() {
    const newMembers = await this.checkNewMembers();
    for (const member of newMembers) {
      this.$emit(member, {
        id: member.id.toString(),
        summary: `New member: ${member.name}`,
        ts: Date.now(),
      });
    }
  },
};
