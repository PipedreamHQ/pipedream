import common from "../common/base.mjs";

export default {
  ...common,
  key: "mastodon-new-status-boosted",
  name: "New Status Boosted",
  description: "Emit new event when the specified status is boosted. [See the docs here](https://docs.joinmastodon.org/methods/statuses/#reblogged_by)",
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
      const users = await this.mastodon.listBoostedBy({
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
        summary: `New boost by ${user.display_name}`,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const users = await this.mastodon.listBoostedBy({
      statusId: this.statusId,
    });
    for (const user of users) {
      const meta = this.generateMeta(user);
      this.$emit(user, meta);
    }
  },
};
