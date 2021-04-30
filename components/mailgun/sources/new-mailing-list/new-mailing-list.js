const common = require("../common-webhook");
const moment = require("moment");
const { mailgun } = common.props;

module.exports = {
  ...common,
  key: "new-mailing-list",
  name: "New mailing list",
  description:
    "Emit an event when a new mailing list is added to the associated Mailgun account.",
  version: "0.0.1",
  dedupe: "greatest",
  props: {
    ...common.props,
    baseRegion: { propDefinition: [mailgun, "baseRegion"] },
    timer:  { propDefinition: [mailgun, "timer"] },
  },
  hooks: {
    async deploy() {
      // Emits sample events on the first run during deploy.
        const mailgunLists = await this.mailgun.getMailgunLists("first",10);
        console.log(JSON.stringify(mailgunLists));
        const { items: mailgunListItems = [] } = mailgunLists;
        console.log(mailgunListItems.length);
        if (mailgunListItems.length === 0) {
          console.log("No data available, skipping iteration");
          return;
        }
        mailgunListItems.forEach(this.emitEvent);
        this.db.set("next", mailgunLists.paging.last);
    },
  },
  methods: {
    ...common.methods,
    generateMeta(eventPayload) {
        const ts = moment(eventPayload.created_at).unix();
        return {
            id: ts,
            summary: `A new mailing list "${eventPayload.name}" has been created.`,
            ts,
        };
    },
    emitEvent(eventPayload) {
      const meta = this.generateMeta(eventPayload);
      this.$emit(eventPayload, meta);
    },
  },
  async run() {
    let mailgunLists;
    let next = null;
    let address = null;
    let page = "next";
    do{
        next = this.db.get("next");
        if(next){
          const nextUrlParams = new URLSearchParams(next);
          address = nextUrlParams.get("address");
          if(!address){
            page = "last";
          }
        }
        mailgunLists = await this.mailgun.getMailgunLists(page,100,address);
        if (mailgunLists.items.length === 0) {
          this.db.set("next", mailgunLists.paging.last);
          console.log("No data available, skipping iteration");
          break;
        }
        mailgunLists.items.forEach(this.emitEvent);
        this.db.set("next", mailgunLists.paging.next);
    }while(mailgunLists.items.length > 0);
  },
};