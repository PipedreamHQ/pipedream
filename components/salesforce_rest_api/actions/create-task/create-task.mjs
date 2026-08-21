// x-pd-ai: optimized
import common, { getProps } from "../common/base-create-update.mjs";
import task from "../../common/sobjects/task.mjs";

const docsLink =
  "https://developer.salesforce.com/docs/atlas.en-us.object_reference.meta/object_reference/sforce_api_objects_task.htm";

export default {
  ...common,
  key: "salesforce_rest_api-create-task",
  name: "Create Task",
  description: "Create a Salesforce task (a to-do item with a due date, no specific time)."
    + " Use **Create Event** instead for scheduled meetings with a start and end time."
    + " Use **Find Records** to get the `WhoId` (contact or lead) and `WhatId` (related record) to link the task to."
    + " "
    + `[See the documentation](${docsLink})`,
  version: "0.4.8",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  methods: {
    ...common.methods,
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
      getAdditionalFields,
      formatDateTimeProps,
      docsInfo,
      dateInfo,
      additionalFields,
      ActivityDate,
      ...data
    } = this;
    /* eslint-enable no-unused-vars */
    const response = await salesforce.createRecord("Task", {
      $,
      data: {
        ...data,
        ...formatDateTimeProps({
          ActivityDate,
        }),
        ...getAdditionalFields(),
      },
    });
    $.export("$summary", `Successfully created task (ID: ${response.id})`);
    return response;
  },
};
