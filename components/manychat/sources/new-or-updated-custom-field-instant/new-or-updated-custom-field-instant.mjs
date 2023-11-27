import { axios } from "@pipedream/platform";
import manychat from "../../manychat.app.mjs";

export default {
  key: "manychat-new-or-updated-custom-field-instant",
  name: "New or Updated Custom Field (Instant)",
  description: "Emits an event when a selected custom field on a user profile is added or updated. [See the documentation](https://api.manychat.com/swagger)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    manychat: {
      type: "app",
      app: "manychat",
    },
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    customField: {
      propDefinition: [
        manychat,
        "customField",
      ],
    },
  },
  hooks: {
    async deploy() {
      // Fetch last known state of the custom field for all users
      const users = await this.manychat.findByCustomField({
        customField: this.customField,
        value: "", // Fetch all users regardless of the value
      });
      // Store the latest state of the custom field for all users
      for (const user of users) {
        this.db.set(`customField_${user.id}`, user[this.customField]);
      }
    },
  },
  methods: {
    isUpdatedCustomField(user) {
      const lastKnownValue = this.db.get(`customField_${user.id}`);
      return lastKnownValue !== user[this.customField];
    },
    emitEventsForUpdatedUsers(users) {
      users.forEach((user) => {
        if (this.isUpdatedCustomField(user)) {
          this.$emit(user, {
            id: user.id,
            summary: `Custom field updated for user ${user.id}`,
            ts: Date.now(),
          });
          this.db.set(`customField_${user.id}`, user[this.customField]);
        }
      });
    },
  },
  async run(event) {
    const { body } = event;
    if (body.field === this.customField) {
      // Emit the event for the updated custom field
      this.$emit(body, {
        id: `${body.user_id}-${body.field}`,
        summary: `Custom field ${body.field} updated for user ${body.user_id}`,
        ts: Date.parse(body.timestamp),
      });
      // Update the stored value for this custom field
      this.db.set(`customField_${body.user_id}`, body.value);
    }
    // Respond to the HTTP request
    this.http.respond({
      status: 200,
    });
  },
};
