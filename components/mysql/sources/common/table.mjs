import common from "../common.mjs";

const { mysql } = common.props;

export default {
  ...common,
  props: {
    ...common.props,
    table: {
      propDefinition: [
        mysql,
        "table",
      ],
    },
  },
};
