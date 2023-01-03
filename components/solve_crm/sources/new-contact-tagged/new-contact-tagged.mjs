import common from "../common/base.mjs";

export default {
  ...common,
  key: "solve_crm-new-contact-tagged",
  name: "New Contact Tagged (Instant)",
  description: "Emit new event when the specified tag is added to a contact. [See the docs here](https://solve360.com/api/webhook-management/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    category: {
      propDefinition: [
        common.props.solveCrm,
        "category",
      ],
    },
  },
  methods: {
    ...common.methods,
    async getHistoricalEvents(limit) {
      return this.solveCrm.listContacts({
        params: {
          limit,
          sortdir: "DESC",
          sortfield: "updated",
          filtermode: "category",
          filtervalue: this.category,
        },
      });
    },
    getEventParams() {
      return {
        event: "items.categorize",
        constrainttype: "contact",
        title: "Pipedream New Tagged Contact",
      };
    },
    generateMeta(body) {
      const ts = new Date(body.occured);
      return {
        id: `${body.objectid}-${ts.getTime()}`,
        summary: `New tagged contact with ID ${body.objectid}`,
        ts: ts.getTime(),
      };
    },
  },
};
