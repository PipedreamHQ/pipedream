import common from "../common/common.mjs";

export default {
  ...common,
  key: "f15five-new-high-five-received",
  name: "New High Five Received",
  description: "Emit new event for each new high five received. [See the documentation](https://my.15five.com/api/public/#tag/High-Five/paths/~1api~1public~1high-five~1/get)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    user: {
      propDefinition: [
        common.props.f15five,
        "user",
      ],
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    async getResources(params) {
      const { results } = await this.f15five.listHighFives({
        params: this.getParams(params),
      });
      return results;
    },
    getParams(params = {}) {
      return {
        ...params,
        user_id: this.user,
        order_by: "-id",
      };
    },
    generateMeta(event) {
      return {
        id: event.id,
        summary: `New high five with ID ${event.id}`,
        ts: Date.parse(event.create_ts),
      };
    },
  },
};
