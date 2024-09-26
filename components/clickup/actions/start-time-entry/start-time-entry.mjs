import builder from "../../common/builder.mjs";
import propsFragments from "../../common/props-fragments.mjs";
import common from "../common/task-props.mjs";

export default {
  ...common,
  key: "clickup-start-time-entry",
  name: "Start Time Entry",
  description: "Start time entry. [See documentation here](https://clickup.com/api/clickupreference/operation/StartatimeEntry)",
  version: "0.0.3",
  type: "action",
  props: {
    ...common.props,
    description: {
      label: "Description",
      description: "Description of the time entry",
      type: "string",
    },
    listWithFolder: {
      optional: true,
      propDefinition: [
        common.props.clickup,
        "listWithFolder",
      ],
    },
  },
  additionalProps: builder.buildListProps({
    listPropsOptional: true,
    tailProps: {
      taskId: {
        ...propsFragments.taskId,
        description: "To show options please select a **List** first",
      },
    },
  }),
  async run({ $ }) {
    const response = await this.clickup.startTimeEntry({
      $,
      teamId: this.workspaceId,
      params: {
        custom_task_ids: this.useCustomTaskIds,
      },
      data: {
        tid: this.taskId,
        description: this.description,
      },
    });

    $.export("$summary", "Successfully started time entry");

    return response;
  },
};
