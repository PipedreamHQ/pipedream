import common from "./list-props.mjs";

export default {
  props: {
    ...common.props,
    useCustomTaskIds: {
      propDefinition: [
        common.props.clickup,
        "useCustomTaskIds",
      ],
    },
    authorizedTeamId: {
      propDefinition: [
        common.props.clickup,
        "authorizedTeamId",
      ],
    },
  },
};
