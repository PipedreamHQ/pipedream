import common from "../common/base.mjs";

export default {
  ...common,
  key: "mailblaze-add-subscriber",
  name: "Add Subscriber",
  description: "Adds a new subscriber to your mailing list. [See the documentation](https://www.mailblaze.com/support/api-documentation)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  methods: {
    ...common.methods,
    getSummary(response) {
      return `Successfully added subscriber with Id: ${response.data.record.subscriber_uid}`;
    },
  },
};
