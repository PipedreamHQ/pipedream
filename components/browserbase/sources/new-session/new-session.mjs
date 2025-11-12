import { STATUS_OPTIONS } from "../../common/constants.mjs";
import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "browserbase-new-session",
  name: "New Session Created",
  description: "Emit new event when a new session is created. [See the documentation](https://docs.browserbase.com/reference/api/list-sessions)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    status: {
      type: "string",
      label: "Status",
      description: "The status of the session.",
      options: STATUS_OPTIONS,
      optional: true,
    },
    q: {
      type: "string",
      label: "Query",
      description: "Query sessions by user metadata. See [Querying Sessions by User Metadata](https://docs.browserbase.com/features/sessions#querying-sessions-by-user-metadata) for the schema of this query.",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getFunction() {
      return this.browserbase.listSessions;
    },
    getParams() {
      return {
        status: this.status,
        q: this.q || null,
      };
    },
    getSummary(item) {
      return `New session: ${item.id}`;
    },
  },
  sampleEmit,
};
