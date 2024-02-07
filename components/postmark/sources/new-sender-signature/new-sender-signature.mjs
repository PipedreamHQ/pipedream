import common from "../common-polling.mjs";

export default {
  ...common,
  key: "postmark-new-sender-signature",
  name: "New Sender Signature",
  description: "Emit new event when a new sender signature is created.",
  version: "0.0.1",
  type: "source",
  methods: {
    ...common.methods,
    getFunction() {
      return this.postmark.listSenderSignatures;
    },
    getFieldList() {
      return "SenderSignatures";
    },
    getSummary(item) {
      return `New sender signature whit ID ${item.ID} was successfully created!`;
    },
  },
};
