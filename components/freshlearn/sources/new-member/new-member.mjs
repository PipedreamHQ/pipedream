import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import freshlearn from "../../freshlearn.app.mjs";

export default {
  key: "freshlearn-new-member",
  name: "New Member",
  description: "Emit new event when a new member is added",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    freshlearn,
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
      // Get most recent members
      const members = await this.freshlearn.emitNewMemberEvent();
      // Sort them by createdDate
      const sortedMembers = members.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
      // Get most recent timestamp
      const lastMemberTimestamp = new Date(sortedMembers[0].createdDate).getTime();
      // Store the timestamp
      this.db.set("lastMemberTimestamp", lastMemberTimestamp);
    },
  },
  async run() {
    // Retrieve new members
    const members = await this.freshlearn.emitNewMemberEvent();
    // Get stored timestamp
    const lastMemberTimestamp = this.db.get("lastMemberTimestamp") || 0;

    // Filter members to get only new ones
    const newMembers = members.filter((member) => new Date(member.createdDate).getTime() > lastMemberTimestamp);

    // Process each new member
    for (const member of newMembers) {
      // Emit the member as a new event
      this.$emit(member, {
        id: member.id,
        summary: `${member.fullName} (${member.email})`,
        ts: new Date(member.createdDate).getTime(),
      });
    }

    // If there were new members, update the timestamp
    if (newMembers.length > 0) {
      const lastNewMemberTimestamp = new Date(newMembers[0].createdDate).getTime();
      this.db.set("lastMemberTimestamp", lastNewMemberTimestamp);
    }
  },
};
