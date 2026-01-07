import common from "../common/common-webhook.mjs";

export default {
  ...common,
  key: "aircall-new-note-added",
  name: "New Note Added",
  description: "Emit new event when a new note is added to a call",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getHistoricalEvents() {
      let page = 1;
      let total, count = 0;
      const callsWithNotes = [];

      do {
        const {
          calls, meta,
        } = await this.aircall.listCalls({
          order: "desc",
          page,
        });

        total = meta.total; // total number of results
        count += calls.length;  // count of results processed so far
        page++;

        const withNotes = calls.filter((call) => call.comments?.length > 0);
        callsWithNotes.push(...withNotes);

      } while (count < total && callsWithNotes.length < 25);

      return callsWithNotes;
    },
    getEventType() {
      return "call.commented";
    },
    generateMeta(call) {
      const comments = JSON.stringify(call.comments.map((comment) => comment.id));
      return {
        id: `${call.id}${comments}`,
        summary: call.raw_digits,
        ts: Date.now(),
      };
    },
  },
};
