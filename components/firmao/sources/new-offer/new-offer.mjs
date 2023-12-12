import common from "../common/common.mjs";

export default {
  ...common,
  key: "firmao-new-offer",
  name: "New Offer",
  description:
    "Emit new event when a new offer is created. [See the documentation](https://firmao.net/API-Documentation_EN.pdf)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
  },
  methods: {
    ...common.methods,
    getSummary(event) {
      return `New offer issuing ${event.issuingPerson}`;
    },
  },
  async run({ $ }) {
    const { data: orders } = await this.app.getOffers({
      $,
      params: {
        sort: "creationDate",
        dir: "DESC",
      },
    });
    this.processEvents(orders);
  },
};
