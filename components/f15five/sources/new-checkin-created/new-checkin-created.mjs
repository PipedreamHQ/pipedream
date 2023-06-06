import common from "../common/common.mjs";

export default {
  ...common,
  key: "f15five-new-checkin-created",
  name: "New Checkin Created",
  description: "Emit new event for each new check-in. [See the documentation](https://my.15five.com/api/public/#tag/Check-in/paths/~1api~1public~1report~1/get)",
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
      const { results } = await this.f15five.listCheckins({
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
    generateMeta(checkin) {
      return {
        id: checkin.id,
        summary: `New Check-in with ID ${checkin.id}`,
        ts: Date.now(),
      };
    },
  },
};
