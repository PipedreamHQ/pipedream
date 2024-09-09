import common from "../common.mjs";

export default {
  ...common,
  key: "intercom-new-user",
  name: "New Users",
  description: "Emit new event each time a new user is added.",
  version: "0.0.4",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta({
      id, name, created_at: createdAt,
    }) {
      return {
        id,
        summary: name,
        ts: createdAt,
      };
    },
  },
  async run() {
    let lastUserCreatedAt = this._getLastUpdate();
    const data = {
      query: {
        operator: "AND",
        value: [
          {
            field: "created_at",
            operator: ">",
            value: lastUserCreatedAt,
          },
          {
            field: "role",
            operator: "=",
            value: "user",
          },
        ],
      },
    };

    const results = await this.intercom.searchContacts(data);
    for (const user of results) {
      if (user.created_at > lastUserCreatedAt)
        lastUserCreatedAt = user.created_at;
      const meta = this.generateMeta(user);
      this.$emit(user, meta);
    }

    this._setLastUpdate(lastUserCreatedAt);
  },
};
