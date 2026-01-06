import common, { getProps } from "../common/base-create-update.mjs";
import task from "../../common/sobjects/task.mjs";

const docsLink =
  "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_task.htm";

export default {
  ...common,
  key: "salesforce_rest_api-create-task",
  name: "Create Task",
  description: `Creates a task. [See the documentation](${docsLink})`,
  version: "0.4.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  methods: {
    ...common.methods,
    getObjectType() {
      return "Task";
    },
    getAdvancedProps() {
      return task.extraProps;
    },
  },
  props: getProps({
    objType: task,
    docsLink,
    showDateInfo: true,
  }),
  async run({ $ }) {
    /* eslint-disable no-unused-vars */
    const {
      salesforce,
      getAdvancedProps,
      getObjectType,
      getAdditionalFields,
      formatDateTimeProps,
      useAdvancedProps,
      docsInfo,
      dateInfo,
      additionalFields,
      ActivityDate,
      RecurrenceEndDateOnly,
      RecurrenceStartDateOnly,
      ReminderDateTime,
      RecurrenceDayOfWeekMask,
      ...data
    } = this;
    /* eslint-enable no-unused-vars */
    const response = await salesforce.createRecord("Task", {
      $,
      data: {
        ...data,
        ...formatDateTimeProps({
          ActivityDate,
          RecurrenceEndDateOnly,
          RecurrenceStartDateOnly,
          ReminderDateTime,
        }),
        RecurrenceDayOfWeekMask: RecurrenceDayOfWeekMask?.reduce?.((acc, val) => acc + val, 0),
        ...getAdditionalFields(),
      },
    });
    $.export("$summary", `Succcessfully created task${this.Subject
      ? ` "${this.Subject}"`
      : ""}`);
    return response;
  },
};
