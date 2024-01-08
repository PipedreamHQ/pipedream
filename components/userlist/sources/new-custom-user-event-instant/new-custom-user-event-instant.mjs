import userlist from "../../userlist.app.mjs";

export default {
  key: "userlist-new-custom-user-event-instant",
  name: "New Custom User Event Instant",
  description: "Emits an event when a user performs a custom action in Userlist",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    userlist,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    userId: {
      propDefinition: [
        userlist,
        "userId",
      ],
    },
    username: {
      propDefinition: [
        userlist,
        "username",
      ],
    },
    actionType: {
      propDefinition: [
        userlist,
        "actionType",
      ],
    },
    additionalContext: {
      propDefinition: [
        userlist,
        "additionalContext",
      ],
    },
  },
  methods: {
    generateMeta(data) {
      const {
        id,
        created_at,
        name,
        user,
      } = data;
      const summary = `New event: ${name} by user ${user}`;
      return {
        id,
        summary,
        ts: Date.parse(created_at),
      };
    },
  },
  async run() {
    const {
      userId, username, actionType, additionalContext,
    } = this;
    const event = await this.userlist.emitCustomActionEvent({
      userId,
      username,
      actionType,
      additionalContext,
    });

    if (event && (!this.db.get("event") || this.db.get("event").id !== event.id)) {
      this.$emit(event, {
        id: event.id,
        summary: `New event with action type: ${event.name}`,
        ts: Date.now(),
      });
      this.db.set("event", event);
    }
  },
};
