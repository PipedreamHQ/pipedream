//const github = require("https://github.com/PipedreamHQ/pipedream/components/github/github.app.js");
const github = require("./github.app.js");

module.exports = {
  name: "New Security Alert",
  description: "GitHub discovered a [security vulnerability](https://help.github.com/articles/about-security-alerts-for-vulnerable-dependencies/) in one of your repositories.",
  version: "0.0.1",
  props: {
    db: "$.service.db",
    github,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 5,
      },
    },
  },
  dedupe: "greatest",
  async run(event) {
    const since = this.db.get("since")

    const notifications = await this.github.getNotifications({
      participating: false,
      since,
    })

    const filtered_notifications = notifications.filter(notification => notification.reason === 'security_alert')
    //console.log(filtered_notifications)

    let maxDate = since
    for(let i = 0; i < filtered_notifications.length; i++) {
      console.log(filtered_notifications[i])
      if(!maxDate || new Date(filtered_notifications[i].updated_at) > new Date(maxDate)) {
        maxDate = filtered_notifications[i].updated_at
      }
      //filtered_notifications[i].security_alert = await this.github.getUrl({ url: filtered_notifications[i].subject.url })
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
