import hrCloud from "../../hr_cloud.app.mjs";

export default {
  key: "hr_cloud-create-task",
  name: "Create Task",
  description: "Creates a new task. [See the documentation](https://help.hrcloud.com/api/#/task#POST_tasks)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    hrCloud,
    applicationCode: {
      propDefinition: [
        hrCloud,
        "applicationCode",
      ],
      reloadProps: true,
    },
    title: {
      propDefinition: [
        hrCloud,
        "title",
      ],
    },
    employeeIds: {
      propDefinition: [
        hrCloud,
        "employeeId",
      ],
      type: "string[]",
      label: "Employee IDs",
      description: "Array of related employee IDs",
    },
    assigneeType: {
      propDefinition: [
        hrCloud,
        "assigneeType",
      ],
      reloadProps: true,
    },
    assignedEmployeeId: {
      propDefinition: [
        hrCloud,
        "employeeId",
      ],
      label: "Assignee Employee ID",
      description: "ID of assigned employee",
      hidden: true,
      optional: true,
    },
  },
  additionalProps(existingProps) {
    const props = {};

    if (this.assigneeType === "SpecificEmployee") {
      existingProps.assignedEmployeeId.hidden = false;
      existingProps.assignedEmployeeId.optional = false;
    }

    if (this.assigneeType === "Hierarchy") {
      props.hierarchyLevel = {
        type: "integer",
        label: "Hierarchy Level",
        description: "Level of upper hierarchy level. From 1 to 9",
        max: 9,
      };
    }

    if (this.applicationCode === "coreHr" || this.applicationCode === "benefits") {
      props.fixedDueDate = {
        type: "string",
        label: "Fixed Due Date",
        description: "Fixed DueDate to complete task (YYYY-MM-DD)",
      };
    }

    if (this.applicationCode === "onboard" || this.applicationCode === "offboard") {
      props.relativeDueDate = {
        type: "string",
        label: "Relative Due Date",
        description: "Relative DueDate for StartDate or SeparationDate to complete task. Example: `{\"timeUnit\": \"Day\", \"direction\": \"After\", \"offset\": 10}`",
      };
    }

    return props;
  },
  async run({ $ }) {
    const response = await this.hrCloud.createTask({
      $,
      data: {
        taskType: "task",
        applicationCode: this.applicationCode,
        title: this.title,
        relatedToEmployeeIds: this.employeeIds,
        assigneeType: this.assigneeType,
        assignedEmployeeId: this.assignedEmployeeId,
        hierarchyLevel: this.hierarchyLevel,
        fixedDueDate: this.fixedDueDate,
        relativeDueDate: typeof this.relativeDueDate === "string"
          ? JSON.parse(this.relativeDueDate)
          : this.relativeDueDate,
      },
    });

    $.export("$summary", `Successfully created task \`${this.title}\``);
    return response;
  },
};
