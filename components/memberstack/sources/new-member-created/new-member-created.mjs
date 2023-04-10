import memberstack from "../../memberstack.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "memberstack-new-member-created",
  name: "New Member Created",
  description: "Emit new event when a new member is created. [See the docs](https://memberstack.notion.site/Admin-API-5b9233507d734091bd6ed604fb893bb8)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    memberstack,
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
      const members = await this.memberstack.paginate(this.memberstack.listMembers, {
        order: "ASC",
      });
      if (!(members?.length > 1)) {
        return;
      }
      this._setLastId(members[members.length - 1].id);
      members.slice(-25).reverse()
        .forEach((member) => this.emitEvent(member));
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId");
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    emitEvent(member) {
      const meta = this.generateMeta(member);
      this.$emit(member, meta);
    },
    generateMeta(member) {
      return {
        id: member.id,
        summary: `New member with ID ${member.id}`,
        ts: Date.parse(member.createdAt),
      };
    },
  },
  async run() {
    const params = {
      order: "ASC",
    };
    const lastId = this._getLastId();
    if (lastId) {
      params.after = lastId;
    }

    const members = await this.memberstack.paginate(this.memberstack.listMembers, params);
    if (!(members?.length > 1)) {
      return;
    }
    members.reverse().forEach((member) => this.emitEvent(member));
  },
};
