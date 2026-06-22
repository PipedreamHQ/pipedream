import common from "../common/base.mjs";
import {
  ENDPOINTS, ENTITY_KEYS,
} from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "nutshell-new-lead",
  name: "New Lead",
  description: "Emit new event when a new lead is created. [See the documentation](https://developers.nutshell.com/reference/132e65861bebcb3781c3d37e66aff309)",
  version: "1.0.0",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getPath() {
      return ENDPOINTS.LEADS;
    },
    getEntityKey() {
      return ENTITY_KEYS.LEADS;
    },
    getSummary(item) {
      const name = typeof item.name === "object"
        ? (item.name?.displayName ?? item.name?.givenName ?? item.id)
        : (item.name || item.id);
      return `New Lead: ${name}`;
    },
  },
  sampleEmit,
};
