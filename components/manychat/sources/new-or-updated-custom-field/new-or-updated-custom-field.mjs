import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import manychat from "../../manychat.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "manychat-new-or-updated-custom-field",
  name: "New Or Updated Custom Field",
  description: "Emit new event when a selected custom field on a user profile is added or updated. [See the documentation](https://api.manychat.com/swagger)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    manychat,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    customFieldId: {
      propDefinition: [
        manychat,
        "customFieldId",
      ],
    },
    customFieldValue: {
      propDefinition: [
        manychat,
        "customFieldValue",
      ],
    },
  },
  methods: {
    _setUserIds(userIds) {
      return this.db.set("userIds", userIds);
    },
    _getUserIds() {
      return this.db.get("userIds") || [];
    },
    _emitEvent(user) {
      const ts = Date.now();

      this.$emit(user, {
        id: user.id + ts,
        summary: `Custom field added or updated for user ${user.id}`,
        ts: ts,
      });
    },
    compareValues(user, userIds) {
      if (!userIds.includes(user.id)) {
        this._emitEvent(user);
      }
    },
  },
  async run() {
    const { data: users } = await this.manychat.findByCustomField({
      params: {
        field_id: this.customFieldId,
        field_value: this.customFieldValue,
      },
    });

    const userIds = this._getUserIds();
    users.forEach((user) => this.compareValues(user, userIds));

    const newUserIds = users.map((user) => user.id);
    this._setUserIds(newUserIds);
  },
  sampleEmit,
};
