import { PRIORITY_OPTIONS } from "../../common/constants.mjs";
import teamioo from "../../teamioo.app.mjs";

export default {
  key: "teamioo-create-task",
  name: "Create Task",
  description: "Creates a new task in Teamioo. [See the documentation](https://demo.teamioo.com/teamiooapi)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    teamioo,
    taskType: {
      type: "string",
      label: "Task Type",
      description: "The type of the task, either 'personal' or 'group'",
      options: [
        "personal",
        "group",
      ],
      reloadProps: true,
    },
    headline: {
      type: "string",
      label: "Headline",
      description: "The name of the task.",
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "The urgency of the task.",
      options: PRIORITY_OPTIONS,
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the task (markdown supported).",
      optional: true,
    },
    hasFirstGroupIndex: {
      type: "boolean",
      label: "Has First Group Index",
      description: "If true, the task will be pushed to the top of tasks in the specified group. Otherwise the next available task group index is used.",
      optional: true,
    },
    deadline: {
      type: "string",
      label: "Due Date",
      description: "Deadline for finishing the task. Corresponding calendar event will be created in the group calendar.",
      optional: true,
    },
    assignedUser: {
      propDefinition: [
        teamioo,
        "userId",
      ],
      optional: true,
    },
    taggedUsers: {
      propDefinition: [
        teamioo,
        "userId",
      ],
      type: "string[]",
      label: "Tagged Users",
      description: "Tagged users - ignored in private tasks.",
      optional: true,
    },
    tags: {
      propDefinition: [
        teamioo,
        "tags",
      ],
      optional: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.taskType === "group") {
      props.groupId = {
        type: "string",
        label: "Group ID",
        description: "The ID of the group.",
        options: async () => {
          const groups = await this.teamioo.listGroups();

          return groups.map(({
            displayName: label, _id: value,
          }) => ({
            label,
            value,
          }));
        },
      };
    }

    return props;
  },
  async run({ $ }) {
    const {
      teamioo,
      taskType,
      groupId,
      priority,
      ...data
    } = this;

    const response = await teamioo.createTask({
      $,
      data: {
        groupId: (taskType === "personal")
          ? "personal"
          : groupId,
        priority: parseInt(priority),
        ...data,
      },
    });

    $.export("$summary", `Successfully created task: ${response.newDocId}`);
    return response;
  },
};
