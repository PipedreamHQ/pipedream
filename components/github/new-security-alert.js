const github = require("https://github.com/PipedreamHQ/pipedream/components/github/github.app.js");
//const github = require("./github.app.js");

module.exports = {
  name: "New Security Alert",
  description: "Triggers when GitHub discovers a security vulnerability in one of your repositories",
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
  dedupe: "greatest",
  async run(event) {
    const since = this.db.get("since")

    const notifications = await this.github.getNotifications({
      participating: false,
      since,
    })

    const filtered_notifications = notifications.filter(notification => notification.reason === 'security_alert')

    let maxDate = since
    for(let i = 0; i < filtered_notifications.length; i++) {
      console.log(filtered_notifications[i])
      if(!maxDate || new Date(filtered_notifications[i].updated_at) > new Date(maxDate)) {
        maxDate = filtered_notifications[i].updated_at
      }

      this.$emit(filtered_notifications[i], {
        summary: filtered_notifications[i].subject.title,
        ts: filtered_notifications[i].updated_at && +new Date(filtered_notifications[i].updated_at),
        id: filtered_notifications[i].updated_at && +new Date(filtered_notifications[i].updated_at),
      })
    }
      
    if (maxDate !== since) {
      this.db.set("since", maxDate)
    }
  },
};
