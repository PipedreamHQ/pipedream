import common from "../common/base.mjs";

export default {
  ...common,
  key: "mastodon-new-status-favorited",
  name: "New Status Favorited",
  description: "Emit new event when the specified status is favorited. [See the docs here](https://docs.joinmastodon.org/methods/statuses/#favourited_by)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    statusId: {
      propDefinition: [
        common.props.mastodon,
        "userStatusId",
      ],
    },
  },
  hooks: {
    async deploy() {
      const users = await this.mastodon.listFavoritedBy({
        statusId: this.statusId,
      });
      for (const user of users.slice(0, 10).reverse()) {
        const meta = this.generateMeta(user);
        this.$emit(user, meta);
      }
    },
  },
  methods: {
    generateMeta(user) {
      return {
        id: user.id,
        summary: `New favorite by ${user.display_name}`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const users = await this.mastodon.listFavoritedBy({
      statusId: this.statusId,
    });
    for (const user of users) {
      const meta = this.generateMeta(user);
      this.$emit(user, meta);
    }
  },
};
