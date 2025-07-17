import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import lark from "../../lark.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "lark-new-user-added-to-group-chat",
  name: "New User Added to Group Chat",
  description: "Emit new event when a new user is added to a group chat. [See the documentation](https://open.larksuite.com/document/server-docs/group/chat-member/get)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    lark,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    chatId: {
      propDefinition: [
        lark,
        "chatId",
      ],
    },
  },
  methods: {
    _getMemberIds() {
      return this.db.get("memberIds") || [];
    },
    _setMemberIds(memberIds) {
      this.db.set("memberIds", memberIds);
    },
    async emitEvent(maxResults = false) {
      const memberIds = this._getMemberIds();

      const response = this.lark.paginate({
        fn: this.lark.listChatMembers,
        chatId: this.chatId,
      });

      let responseArray = [];
      for await (const item of response) {
        responseArray.push(item);
      }

      const newMembers = responseArray
        .filter(({ member_id }) => !memberIds.includes(member_id))
        .reverse();

      if (maxResults && (newMembers.length > maxResults)) {
        newMembers.length = maxResults;
      }

      const allMemberIds = responseArray.map(({ member_id }) => member_id);
      this._setMemberIds(allMemberIds);

      for (const member of newMembers.reverse()) {
        this.$emit(member, {
          id: member.member_id,
          summary: `New member added: ${member.name}`,
          ts: Date.now(),
        });
      }
    },
  },
  hooks: {
    async deploy() {
      await this.emitEvent(25);
    },
  },
  async run() {
    await this.emitEvent();
  },
  sampleEmit,
};
