import common from "../common/base-single.mjs";

export default {
  ...common,
  type: "source",
  name: "New Deal Stage Change",
  key: "teamgate-deal-stage-changed",
  description: "Emit new event when a deal stage is changed. [See docs here](https://developers.teamgate.com/#b692423c-78f3-449b-bb8b-ad73a240f833)",
  version: "0.0.1",
  props: {
    ...common.props,
    dealId: {
      propDefinition: [
        common.props.teamgate,
        "deals",
      ],
    },
  },
  methods: {
    ...common.methods,
    getSummary({
      stage: {
        name, id,
      },
    }) {
      return `Stage changed: ${name} (${id})`;
    },
    getFn() {
      return this.teamgate.getDeal(this.dealId);
    },
    getActualValue(item) {
      return item.stage.id;
    },
  },
};
