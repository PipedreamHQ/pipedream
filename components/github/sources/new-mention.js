const github = require("https://github.com/PipedreamHQ/pipedream/components/github/github.app.js");
//const github = require("./github.app.js");

module.exports = {
  name: "New Mention",
  description: "Triggers when you are @mentioned in a new commit, comment, issue or pull request.",
  version: "0.0.1",
  props: {
    github,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 5,
      },
    },
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const user = await this.github.getUser()
      this.db.set("login", user.login)
    },
  },
  dedupe: "greatest",
  async run(event) {
    const since = this.db.get("since")
    const login = this.db.get("login")

    const notifications = await this.github.getNotifications({
      participating: true,
      since,
    })

    const mentions = notifications.filter(notification => notification.reason === 'mention')
    let maxDate = since
    for(let i = 0; i < mentions.length; i++) {
      if(!maxDate || new Date(mentions[i].updated_at) > new Date(maxDate)) {
        maxDate = mentions[i].updated_at
      }
      const comment = await this.github.getUrl({ url: mentions[i].subject.latest_comment_url })

      if (comment.body.indexOf(`@${login}`) > -1) {
        this.$emit(comment, {
          summary: comment.body,
          ts: comment.updated_at && +new Date(comment.updated_at),
          id: comment.updated_at && +new Date(comment.updated_at),
        })
      }
    }

    if (maxDate !== since) {
      this.db.set("since", maxDate)
    }
  },
};
