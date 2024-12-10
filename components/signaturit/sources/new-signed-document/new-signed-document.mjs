import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "signaturit-new-signed-document",
  name: "New Signed Document",
  description: "Emit new event when a document has been newly signed.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  sampleEmit,
};
