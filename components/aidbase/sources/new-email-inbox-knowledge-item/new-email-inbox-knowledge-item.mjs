import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "aidbase-new-email-inbox-knowledge-item",
  name: "New Email Inbox Knowledge Item",
  description: "Emit new event when a new knowledge item is added to an email inbox.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    emailInboxId: {
      propDefinition: [
        common.props.aidbase,
        "emailInboxId",
      ],
    },
  },
  methods: {
    ...common.methods,
    getResourceFn() {
      return this.aidbase.listEmailInboxKnowledgeItems;
    },
    getArgs() {
      return {
        emailInboxId: this.emailInboxId,
      };
    },
  },
  sampleEmit,
};
