import base from "./base.mjs";

// Maps each fetched record to the webhook payload it came from: the payload's
// MessageId and the item's entry, which reflects the item as of the event rather
// than whatever it looks like by the time it is fetched.
const eventContexts = new WeakMap();

export default {
  ...base,
  methods: {
    ...base.methods,
    async fetchRecords(body) {
      const entries = body.PipelineItems ?? [];
      return Promise.all(entries.map(async (entry) => {
        const record = await this.app.getPipelineItem({
          parameters: {
            PipelineItemId: entry.PipelineItemId,
          },
        });
        eventContexts.set(record, {
          messageId: body.MessageId,
          payloadItem: entry,
        });
        return record;
      }));
    },
    /**
     * The webhook payload's `MessageId` and the item's entry in it, for a fetched record.
     */
    getEventContext(record) {
      return eventContexts.get(record) ?? {
        payloadItem: {},
      };
    },
    getDedupeId(item) {
      return item.PipelineItemId;
    },
    getAction() {
      throw new Error("getAction is not implemented");
    },
    generateMeta(item) {
      const contactName = item.ContactMetaData?.Name;
      const pipelineName = item.PipelineMetaData?.Name;
      const statusName = item.StatusMetaData?.Name;
      return {
        id: this.getDedupeId(item),
        summary: `${pipelineName} item ${this.getAction()}: ${contactName} (${statusName})`,
        ts: Date.parse(item.LastUpdate ?? item.DateCreated) || Date.now(),
      };
    },
  },
};
