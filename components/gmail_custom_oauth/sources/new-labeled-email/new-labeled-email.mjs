import sampleEmit from "./test-event.mjs";
import base from "../../../gmail/sources/new-labeled-email/new-labeled-email.mjs";
import common from "../common/polling-history.mjs";

export default {
  ...common,
  key: "gmail_custom_oauth-new-labeled-email",
  name: "New Labeled Email",
  description: "Emit new event when a new email is labeled.",
  type: "source",
  version: "0.0.10",
  dedupe: "unique",
  props: {
    ...common.props,
    label: {
      propDefinition: [
        common.props.gmail,
        "label",
      ],
    },
  },
  methods: {
    ...common.methods,
    ...base.methods,
  },
  sampleEmit,
};
