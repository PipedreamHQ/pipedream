import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "salesloft-new-person-instant",
  name: "New Person (Instant)",
  description: "Emit new event when a person is created in Salesloft. [See the documentation](https://developers.salesloft.com/docs/api/webhook-subscriptions/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "person_created";
    },
    getSummary(data) {
      return `New person created: ${data.display_name || data.email_address || data.id}`;
    },
  },
};
