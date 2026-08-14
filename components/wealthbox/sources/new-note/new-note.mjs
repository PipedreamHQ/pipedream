import common from "../common/common.mjs";

export default {
  ...common,
  key: "wealthbox-new-note",
  name: "New Note",
  description: "Emit new event for each new note created in Wealthbox. Polls GET /notes ordered by `created_at`; the payload includes note id, content, and its linked resource. [See the documentation](https://dev.wealthbox.com/#notes-retrieve-all-notes-get)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    resourceType: {
      type: "string",
      label: "Resource Type",
      description: "Optional. Restrict notes to a linked resource type (for example `Contact`).",
      optional: true,
    },
    resourceId: {
      type: "string",
      label: "Resource ID",
      description: "Optional. Restrict notes to a specific linked resource id. Run **List Contact Options** to find contact ids.",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    async getEvents({ params }) {
      const response = await this.wealthbox.listNotes({
        params: {
          ...params,
          resource_type: this.resourceType,
          resource_id: this.resourceId,
        },
      });
      return response?.status_updates || [];
    },
    generateMeta(note) {
      return {
        id: note.id,
        summary: `New Note: ${note.id}`,
        ts: this.getCreatedAtTs(note),
      };
    },
  },
  async run() {
    await this.processEvent();
  },
};
