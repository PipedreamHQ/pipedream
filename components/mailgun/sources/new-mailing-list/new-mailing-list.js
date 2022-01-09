const {
  props,
  methods,
  ...common
} = require("../common-webhook");

module.exports = {
  ...common,
  key: "mailgun-new-mailing-list",
  name: "New Mailing List",
  type: "source",
  description: "Emit new event when a new mailing list is added to the associated Mailgun account.",
  version: "0.0.2",
  dedupe: "greatest",
  props: {
    ...props,
    timer: {
      propDefinition: [
        props.mailgun,
        "timer",
      ],
    },
  },
  methods: {
    ...methods,
    generateMeta(payload) {
      const ts = +new Date(payload.created_at);
      return {
        id: `${ts}`,
        summary: `New mailing list: ${payload.name}`,
        ts,
      };
    },
  },
  hooks: {
    async deploy() {
      const result = await this.mailgun.api("lists").list({
        limit: 100,
      });
      const sortedList = result.slice().sort((a, b) => b.created_at - a.created_at);
      for (let list of sortedList.slice(0, 5)) {
        this.$emit(list, this.generateMeta(list));
      }
    },
  },
  async run() {
    let result = [];
    let mailinglists = [];
    let address = null;
    do {
      if (address) {
        result = await this.mailgun.api("lists").list({
          limit: 100,
          address: address,
        });
      } else {
        result = await this.mailgun.api("lists").list({
          limit: 100,
        });
      }
      mailinglists.push(...result);
      if (result.length) {
        address = result[result.length - 1].address;
      }
    } while (result.length);
    const filter = mailinglists.filter((r) => {
      const idxAt = r.address.indexOf("@");
      const compareDomain = [];
      compareDomain.push(this.domain);
      return compareDomain.includes(r.address.substring(idxAt + 1));
    });
    const sortedList = filter.sort((a, b) => {
      const tsa = +new Date(a.created_at);
      const tsb = +new Date(b.created_at);
      return tsa - tsb;
    });
    for (let list of sortedList) {
      this.$emit(list, this.generateMeta(list));
    }
  },
};
