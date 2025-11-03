import { parseObject } from "../../common/utils.mjs";
import ispringLearn from "../../ispring_learn.app.mjs";

export default {
  key: "ispring_learn-enroll-users-in-courses",
  name: "Enroll Users in Courses",
  description: "Enrolls users to the specified courses on iSpring Learn.",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ispringLearn,
    userIds: {
      propDefinition: [
        ispringLearn,
        "userId",
      ],
      type: "string[]",
    },
    courseIds: {
      propDefinition: [
        ispringLearn,
        "courseIds",
      ],
    },
    accessDate: {
      type: "string",
      label: "Access Date",
      description: "The date and time when learners are supposed to start studying the course. If the start date and time aren't indicated, the current date and time will be auto-populated.",
      optional: true,
    },
    lockAfterDueDate: {
      type: "boolean",
      label: "Lock After Due Date",
      description: "This parameter indicates whether the course will be blocked after the due date.",
      optional: true,
    },
    dueDateType: {
      type: "string",
      label: "Due Date Type",
      description: "This parameter indicates whether the course has a due date or it isn't time-limited.",
      options: [
        {
          label: "Unlimited",
          value: "unlimited",
        },
        {
          label: "Default",
          value: "default",
        },
        {
          label: "Due Date",
          value: "due_date",
        },
        {
          label: "Pue Period",
          value: "due_period",
        },
      ],
      default: "default",
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.dueDateType === "due_date") {
      props.dueDate = {
        type: "string",
        label: "Due Date",
        description: "The limit date of the enrollment. Format: YYYY-MM-DDTHH:MM:SSZ",
      };
    }
    if (this.dueDateType === "due_period") {
      props.duePeriod = {
        type: "string",
        label: "Due Period",
        description: "The limit period of the enrollment. It is measured in hours.",
      };
    }
    return props;
  },
  async run({ $ }) {
    const response = await this.ispringLearn.enrollUser({
      $,
      data: {
        learnerIds: parseObject(this.userIds),
        courseIds: parseObject(this.courseIds),
        accessDate: this.accessDate,
        lockAfterDueDate: this.lockAfterDueDate,
        dueDateType: this.dueDateType,
        dueDate: this.dueDate,
        duePeriod: this.duePeriod,
      },
    });

    $.export("$summary", "Successfully enrolled users in courses");
    return response;
  },
};
