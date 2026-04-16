import { getId } from "../../common/utils.mjs";
import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "freeagent-new-contact",
  name: "New Contact",
  description: "Emit new event when a new contact is created. [See the documentation](https://dev.freeagent.com/docs/contacts#list-all-contacts).",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getDataField() {
      return "contacts";
    },
    getFunction() {
      return this.freeagent.listContacts;
    },
    getSummary(item) {
      return `New Contact: ${getId(item.url)}`;
    },
  },
  sampleEmit,
};
