import common from "../common/common.mjs";

export default {
  ...common,
  key: "intercom-tag-added-to-lead",
  name: "Tag Added To Lead",
  description: "Emit new event each time a new tag is added to a lead.",
  version: "0.0.8",
  type: "source",
  dedupe: "unique",
  methods: {
    generateMeta(lead, tag) {
      const {
        id,
        name,
      } = lead;
      return {
        id: `${id}${tag.id}`,
        summary: `Tag added to ${name
          ? name
          : id }`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const data = {
      query: {
        field: "role",
        operator: "=",
        value: "lead",
      },
    };

    const results = await this.intercom.searchContacts(data);
    for (const lead of results) {
      if (lead.tags.data.length > 0) {
        for (const tag of lead.tags.data) {
          const meta = this.generateMeta(lead, tag);
          this.$emit(tag, meta);
        }
      }
    }
  },
};
