import common from "../common/base.mjs";

export default {
  ...common,
  key: "telnyx-new-phone-number",
  name: "New Phone Number",
  description: "Emit new event when a new phone number is added [See the documentation](https://developers.telnyx.com/api/numbers/list-available-phone-numbers)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.telnyxApp.getPhoneNumbers;
    },
    generateMeta(phoneNumber) {
      return {
        id: phoneNumber.phone_number,
        summary: `New Phone Number: ${phoneNumber.phone_number}`,
        ts: Date.now(),
      };
    },
  },
};
