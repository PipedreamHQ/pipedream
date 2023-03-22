import common from "../common/base.mjs";

export default {
  ...common,
  key: "wubook_ratechecker-new-stay-created",
  name: "New Stay Created",
  description: "Emit new event when a new stay is created. [See the docs](https://wubook.net/wrpeeker/ratechecker/api_examples)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    competitorId: {
      propDefinition: [
        common.props.wubook,
        "competitorId",
      ],
    },
  },
  methods: {
    ...common.methods,
    async getResources() {
      return this.wubook.getStays({
        params: {
          competitor_id: this.competitorId,
        },
      });
    },
    getIdField() {
      return "stay_id";
    },
    generateMeta(stay) {
      return {
        id: stay.stay_id,
        summary: `Stay ${stay.stay}`,
        ts: Date.now(),
      };
    },
  },
};
