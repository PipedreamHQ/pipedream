import { axios } from "@pipedream/platform";
import vivocalendar from "../../vivocalendar.app.mjs";

export default {
  key: "vivocalendar-new-user",
  name: "New Staff Member Created",
  description: "Emits an event when a new staff member is created in VIVO Calendar.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    vivocalendar,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    staffName: {
      propDefinition: [
        vivocalendar,
        "staffName",
      ],
    },
    staffContact: {
      propDefinition: [
        vivocalendar,
        "staffContact",
      ],
    },
    staffPosition: {
      propDefinition: [
        vivocalendar,
        "staffPosition",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Emit events for the latest staff members during the deploy phase
      const lastStaffMembers = await this.vivocalendar.getLatestStaffMembers();
      for (const member of lastStaffMembers.slice(-50).reverse()) {
        this.$emit(member, {
          id: member.id,
          summary: `New Staff Member: ${member.name}`,
          ts: Date.parse(member.created_at),
        });
      }
      this.db.set("lastProcessedTimestamp", Date.parse(lastStaffMembers[lastStaffMembers.length - 1]?.created_at) || 0);
    },
  },
  methods: {
    ...vivocalendar.methods,
    async getLatestStaffMembers() {
      let hasMore = true;
      let page = 1;
      let staffMembers = [];
      while (hasMore) {
        const response = await this.vivocalendar.createStaffMember({
          staffName: this.staffName,
          staffContact: this.staffContact,
          staffPosition: this.staffPosition,
          page: page,
        });
        if (!response || response.length === 0) {
          hasMore = false;
        } else {
          staffMembers = staffMembers.concat(response);
          page++;
        }
      }
      return staffMembers;
    },
    async getNewStaffMembersSince(lastTimestamp) {
      let hasMore = true;
      let page = 1;
      let newStaffMembers = [];
      while (hasMore) {
        const response = await this.vivocalendar.createStaffMember({
          staffName: this.staffName,
          staffContact: this.staffContact,
          staffPosition: this.staffPosition,
          page: page,
        });
        if (!response || response.length === 0) {
          hasMore = false;
        } else {
          const newStaff = response.filter(
            (staffMember) => Date.parse(staffMember.created_at) > lastTimestamp,
          );
          newStaffMembers = newStaffMembers.concat(newStaff);
          if (newStaff.length < response.length) {
            // We've reached the end of new staff members
            hasMore = false;
          }
          page++;
        }
      }
      return newStaffMembers;
    },
  },
  async run() {
    const lastProcessedTimestamp = this.db.get("lastProcessedTimestamp") || 0;
    const newStaffMembers = await this.getNewStaffMembersSince(lastProcessedTimestamp);

    let maxTimestamp = lastProcessedTimestamp;
    for (const member of newStaffMembers) {
      const memberTimestamp = Date.parse(member.created_at);
      this.$emit(member, {
        id: member.id,
        summary: `New Staff Member: ${member.name}`,
        ts: memberTimestamp,
      });
      maxTimestamp = Math.max(maxTimestamp, memberTimestamp);
    }

    this.db.set("lastProcessedTimestamp", maxTimestamp);
  },
};
