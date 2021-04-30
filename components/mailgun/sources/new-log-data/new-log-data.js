const common = require("../common-webhook");
const moment = require("moment");
const { mailgun } = common.props;

module.exports = {
  ...common,
  key: "new-log-data",
  name: "New log data",
  description:
    "Emit an event when new data is logged in Mailgun's Control Panel. Occurs for most   actions within the associated Mailgun account.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    ...common.props,
    domain: { propDefinition: [mailgun, "domain"] },
    baseRegion: { propDefinition: [mailgun, "baseRegion"] },
    timer:  { propDefinition: [mailgun, "timer"] },
  },
  hooks: {
    async deploy() {
      // Emits sample events on the first run during deploy.
      const mailgunEvents = await this.mailgun.getMailgunEvents(this.domain,null);
      if (mailgunEvents.items.length === 0) {
        console.log("No data available, skipping iteration");
        return;
      }
      mailgunEvents.items.forEach(this.emitEvent);
      console.log(mailgunEvents.items.length);
      this.db.set("next", mailgunEvents.paging.last);
    },
  },
  methods: {
    ...common.methods,
    generateMeta(eventPayload) {
      const ts = eventPayload.timestamp;
      return {
        id: eventPayload.id,
        summary: `New data logged ${eventPayload.event}, with log-level: ${eventPayload["log-level"]}`,
        ts,
      };
    },
    emitEvent(eventPayload) {
      const meta = this.generateMeta(eventPayload);
      this.$emit(eventPayload, meta);
    },
  },
  async run() {
    let next = this.db.get("next");
    let mailgunEvents = null;
    do{
        let nextUrlPart = "";
        if(next){
          const idxSlash = next.lastIndexOf("/");
          nextUrlPart = next.substring(idxSlash+1);
        }
        mailgunEvents = await this.mailgun.getMailgunEvents(this.domain,nextUrlPart);
        console.log(mailgunEvents.items.length);
        if (mailgunEvents.items.length === 0) {
          this.db.set("next", mailgunEvents.paging.last);
          console.log(`No data available, skipping iteration`);
          break;
        }
        this.db.set("next", mailgunEvents.paging.next);
        mailgunEvents.items.forEach(this.emitEvent);
      }while(mailgunEvents.items.length > 0);
  },
};