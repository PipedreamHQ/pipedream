const intercom = require("https://github.com/PipedreamHQ/pipedream/components/intercom/intercom.app.js");

module.exports = {
  name: "Tag Added To User",
  description: "Emits an event each time a new tag is added to a user.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    intercom,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15,
      },
    },
  },

  async run(event) {
    const data = {
      query:  {
        field: "role",
        operator: "=",
        value: "user"
      }
    }
    
    let results = null;
    let starting_after = null;

    while (results.data.pages.next !== null && results.data.pages.next !== undefined) {
      if (resuls)
        starting_after = results.data.pages.next.starting_after;
      results = await this.intercom.searchContacts(data, starting_after);
      for (const user of results.data.data) {
        if (user.tags.data.length > 0) {
          for (const tag of user.tags.data) {
          this.$emit(tag, {
            id: `${user.id}${tag.id}`,
            summary: `Tag added to ${user.name}`,
            ts: Date.now(),
          });  
        }
      }
    }
  }
};