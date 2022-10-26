/* eslint-disable pipedream/props-description */
/* eslint-disable pipedream/props-label */
import common from "./task-props.mjs";

export default {
  props: {
    ...common.props,
    taskId: {
      ...common.props.taskId,
      optional: true,
    },
    checklistId: {
      propDefinition: [
        common.props.clickup,
        "checklists",
        (c) => ({
          taskId: c.taskId,
          useCustomTaskIds: c.useCustomTaskIds,
          authorizedTeamId: c.authorizedTeamId,
        }),
      ],
      description: "To show options please select a **Task** first",
    },
  },
};
