import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import illumidesk from "../../illumidesk.app.mjs";

export default {
  key: "illumidesk-new-course-member",
  name: "New Course Member",
  description: "Emit new event when a new member is added to a course.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    illumidesk,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    courseId: {
      propDefinition: [
        illumidesk,
        "courseId",
      ],
    },
  },
  methods: {
    _getLastMemberId() {
      return this.db.get("lastMemberId") || null;
    },
    _setLastMemberId(id) {
      this.db.set("lastMemberId", id);
    },
  },
  hooks: {
    async deploy() {
      const members = await this.illumidesk.addMemberToCourse({
        courseId: this.courseId,
      });
      if (members.length > 0) {
        const lastMemberId = members[0].id;
        this._setLastMemberId(lastMemberId);
      }
    },
  },
  async run() {
    const members = await this.illumidesk.addMemberToCourse({
      courseId: this.courseId,
    });
    const lastMemberId = this._getLastMemberId();
    let newLastMemberId = null;
    for (const member of members) {
      if (member.id === lastMemberId) {
        break;
      }
      if (!newLastMemberId) {
        newLastMemberId = member.id;
      }
      this.$emit(member, {
        id: member.id,
        summary: `New member: ${member.firstName} ${member.lastName}`,
        ts: Date.now(),
      });
    }
    if (newLastMemberId) {
      this._setLastMemberId(newLastMemberId);
    }
  },
};
