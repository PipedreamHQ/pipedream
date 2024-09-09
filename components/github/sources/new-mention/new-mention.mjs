import common from "../common/common-polling.mjs";

export default {
  ...common,
  key: "github-new-mention",
  name: "New Mention",
  description: "Emit new event when you are @mentioned in a new commit, comment, issue or pull request. [See the documentation](https://docs.github.com/en/rest/activity/notifications?apiVersion=2022-11-28#list-notifications-for-the-authenticated-user)",
  version: "0.1.18",
  type: "source",
  hooks: {
    ...common.hooks,
    async activate() {
      const user = await this.github.getAuthenticatedUser();
      this._setUserLogin(user.login);
    },
  },
  dedupe: "unique",
  methods: {
    ...common.methods,
    _getUserLogin() {
      return this.db.get("userLogin");
    },
    _setUserLogin(userLogin) {
      this.db.set("userLogin", userLogin);
    },
  },
  async run() {
    const login = this._getUserLogin();

    const notifications = await this.github.getFilteredNotifications({
      reason: "mention",
      data: {
        participating: true,
        all: true,
      },
    });

    for (const notification of notifications) {
      const subject = await this.github.getFromUrl({
        url: notification?.subject?.url,
      });

      if (!subject.comments_url) continue;

      const comments = await this.github.getFromUrl({
        url: subject.comments_url,
      });

      for (const comment of comments) {
        if (comment?.body?.includes(`@${login}`)) {
          this.$emit(comment, {
            id: comment.id,
            summary: `New notification ${comment.id}`,
            ts: Date.parse(comment.created_at),
          });
        }
      }
    }
  },
};
