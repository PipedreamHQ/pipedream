import userlist from "../../userlist.app.mjs";

export default {
  key: "userlist-new-user-joined-segment-instant",
  name: "New User Joined Segment Instant",
  description: "Emits an event when a new user joins a specific segment in Userlist.",
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
    segmentId: {
      propDefinition: [
        userlist,
        "segmentId",
      ],
    },
    segmentName: {
      propDefinition: [
        userlist,
        "segmentName",
      ],
    },
    additionalContext: {
      propDefinition: [
        userlist,
        "additionalContext",
      ],
      optional: true,
    },
  },
  methods: {
    _getPreviousCursor() {
      return this.db.get("previousCursor");
    },
    _setPreviousCursor(previousCursor) {
      this.db.set("previousCursor", previousCursor);
    },
  },
  async run() {
    const previousCursor = this._getPreviousCursor();

    const response = await this.userlist.emitSegmentJoinEvent({
      userId: this.userId,
      segmentId: this.segmentId,
      segmentName: this.segmentName,
      additionalContext: this.additionalContext,
    });

    for (const event of response) {
      if (previousCursor && event.created <= previousCursor) {
        break;
      }

      this.$emit(event, {
        id: event.id,
        summary: `New user ${event.user} joined segment ${event.properties.segment}`,
        ts: Date.parse(event.created),
      });
    }

    this._setPreviousCursor(response[0].created);
  },
};
