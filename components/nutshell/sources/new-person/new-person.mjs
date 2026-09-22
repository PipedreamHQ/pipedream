import common from "../common/base.mjs";
import {
  ENDPOINTS, ENTITY_KEYS,
} from "../../common/constants.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "nutshell-new-person",
  name: "New Person Profile Created",
  description: "Emit new event when a new person profile is created. [See the documentation](https://developers.nutshell.com/reference/cde301caba6b033521a71e6bed772a58)",
  version: "1.0.0",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getPath() {
      return ENDPOINTS.CONTACTS;
    },
    getEntityKey() {
      return ENTITY_KEYS.CONTACTS;
    },
    getParams() {
      return {
        sort: "-createdTime",
      };
    },
    getSummary(item) {
      const name = typeof item.name === "object"
        ? (item.name?.displayName
          || [
            item.name?.givenName,
            item.name?.familyName,
          ].filter(Boolean).join(" ")
          || item.id)
        : (item.name || item.id);
      return `New Person: ${name}`;
    },
  },
  sampleEmit,
};
