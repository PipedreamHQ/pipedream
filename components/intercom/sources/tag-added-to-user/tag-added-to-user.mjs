import common from "../common.mjs";

export default {
  ...common,
  key: "intercom-tag-added-to-user",
  name: "Tag Added To User",
  description: "Emit new event each time a new tag is added to a user.",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    generateMeta(user, tag) {
      const {
        id,
        name,
      } = user;
      return {
        id: `${id}${tag.id}`,
        summary: `Tag added to ${name}`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const data = {
      query: {
        field: "role",
        operator: "=",
        value: "user",
      },
    };

    const results = await this.intercom.searchContacts(data);
    for (const user of results) {
      if (user.tags.data.length > 0) {
        for (const tag of user.tags.data) {
          const meta = this.generateMeta(user, tag);
          this.$emit(tag, meta);
        }
      }
    }
  },
};
