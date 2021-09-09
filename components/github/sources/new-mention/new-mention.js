const common = require("../common-polling.js");

module.exports = {
  ...common,
  key: "github-new-mention",
  name: "New Mention",
  description:
    "Emit new events when you are @mentioned in a new commit, comment, issue or pull request",
  version: "0.0.4",
  type: "source",
  hooks: {
    async activate() {
      const user = await this.github.getUser();
      this.db.set("login", user.login);
    },
  },
  dedupe: "greatest",
  methods: {
    ...common.methods,
    generateMeta(data) {
      const ts = new Date(data.updated_at).getTime();
      return {
        id: data.updated_at,
        summary: data.body,
        ts,
      };
    },
  },
  async run() {
    const since = this.db.get("since");
    const login = this.db.get("login");

    const mentions = await this.getFilteredNotifications(
      {
        participating: true,
        since,
      },
      "mention",
    );

    let maxDate = since;
    for (const mention of mentions) {
      if (!maxDate || new Date(mention.updated_at) > new Date(maxDate)) {
        maxDate = mention.updated_at;
      }

      if (mention.subject.latest_comment_url == null) continue;
      const comment = await this.github.getUrl({
        url: mention.subject.latest_comment_url,
      });

      if (comment.body.indexOf(`@${login}`) > -1) {
        const meta = this.generateMeta(comment);
        this.$emit(comment, meta);
      }
    }

    if (maxDate !== since) {
      this.db.set("since", maxDate);
    }
  },
};
