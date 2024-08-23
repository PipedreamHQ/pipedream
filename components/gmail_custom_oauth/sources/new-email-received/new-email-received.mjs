import base from "../../../gmail/sources/new-email-received/new-email-received.mjs";
import common from "../common/polling-history.mjs";

export default {
  ...common,
  key: "gmail_custom_oauth-new-email-received",
  name: "New Email Received",
  description: "Emit new event when a new email is received.",
  type: "source",
  version: "0.0.13",
  dedupe: "unique",
  props: {
    ...common.props,
    label: {
      propDefinition: [
        common.props.gmail,
        "label",
      ],
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    ...base.methods,
  },
};
