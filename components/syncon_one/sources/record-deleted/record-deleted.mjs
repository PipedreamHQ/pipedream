import common from "../../common/webhook-source.mjs";

export default {
  ...common,
  key: "syncon_one-record-deleted",
  name: "Record Deleted",
  description:
    "Emit new event when a customer, company, lead, deal or custom record is permanently deleted, within seconds.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEvent() {
      return "record.deleted";
    },
    getPath() {
      return "/people";
    },
    fromEvent(envelope) {
      const recordId = envelope.data?.publicId ?? envelope.data?.recordId;
      if (!recordId) return null;
      return {
        id: `${recordId}-${envelope.id}`,
        record_id: recordId,
        object_type: envelope.data?.objectType ?? null,
        deleted: true,
        deleted_at: envelope.createdAt ?? null,
        event_id: envelope.id,
      };
    },
    getSummary() {
      return "Record Deleted";
    },
  },
};
