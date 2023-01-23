import base from "../common/base.mjs";

export default {
  ...base,
  key: "drip-new-tag-applied",
  name: "New Tag Applied (Instant)",
  description: "Emit new event when a tag is applied to a subscriber",
  version: "0.0.2",
  dedupe: "unique",
  type: "source",
  methods: {
    ...base.methods,
    getEventType() {
      return "subscriber.applied_tag";
    },
    getSummary({
      properties: { tag },
      subscriber: {
        email, first_name, last_name,
      },
    }) {
      let string = `New Tag ${tag} for ${email}`;
      if (first_name) string += ` - ${first_name} ${last_name}`;
      return string;
    },
  },
};
