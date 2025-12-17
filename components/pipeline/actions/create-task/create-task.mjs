import pipeline from "../../pipeline.app.mjs";

export default {
  name: "Create Task",
  key: "pipeline-create-task",
  description: "Creates a new calendar task in your Pipeline account. [See the docs here](https://app.pipelinecrm.com/api/docs#tag/Calendar-Entries-(Tasks-and-Events)/paths/~1calendar_entries/post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pipeline,
    eventCategoryId: {
      propDefinition: [
        pipeline,
        "eventCategoryId",
      ],
    },
    name: {
      propDefinition: [
        pipeline,
        "name",
      ],
      description: "The name of the task",
    },
    description: {
      propDefinition: [
        pipeline,
        "description",
      ],
      description: "A more detailed description of the task",
    },
    allDay: {
      propDefinition: [
        pipeline,
        "allDay",
      ],
      description: "Specify if this task is all day",
    },
    dueDate: {
      type: "string",
      label: "Due Date",
      description: "Datetime [in ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601). Due date of the task. For example `2023-02-22T23:31:23+00:00` or `2023-02-22`",
    },
  },
  async run({ $ }) {
    const data = {
      calendar_entry: {
        type: "CalendarTask",
        category_id: this.eventCategoryId,
        name: this.name,
        description: this.description,
        all_day: this.allDay,
        due_date: this.dueDate,
      },
    };

    const response = await this.pipeline.createCalendarEntry({
      data,
      $,
    });

    $.export("$summary", `Successfully created task with ID ${response.id}.`);

    return response;
  },
};
