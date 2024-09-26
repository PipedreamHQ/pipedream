import common from "../common/webhook.mjs";
import events from "../common/events.mjs";

export default {
  ...common,
  key: "parseur-new-table-processed",
  name: "New Table Processed",
  description: "Emit new event when a new table is processed. [See the docs](https://help.parseur.com/en/articles/3566155-send-parsed-data-using-webhooks).",
  type: "source",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    parserField: {
      propDefinition: [
        common.props.app,
        "parserField",
        ({ parserId }) => ({
          parserId,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    getEventName() {
      return events.TABLE_PROCESSED;
    },
    generateMeta() {
      const ts = Date.now();
      return {
        id: ts,
        summary: "Table Processed",
        ts,
      };
    },
  },
};
