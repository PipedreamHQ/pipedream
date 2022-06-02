import harvest from "../../harvest.app.mjs";
import {
  isValidDate, isValidTime, removeNullEntries,
} from "../../common/utils.mjs";

export default {
  key: "harvest-create-timesheet-entry",
  name: "Create Timesheet Entry",
  description: "Creates a new time entry object. [See docs here](https://help.getharvest.com/api-v2/timesheets-api/timesheets/time-entries/)",
  version: "0.0.1",
  type: "action",
  props: {
    harvest,
    projectId: {
      propDefinition: [
        harvest,
        "projectId",
      ],
    },
    taskId: {
      propDefinition: [
        harvest,
        "taskId",
      ],
    },
    spentDate: {
      type: "string",
      label: "Spent date (YYYY-MM-DD)",
      description: "The ISO 8601 formatted date on which the time entry was spent. Example: 2019-07-26",
    },
    userId: {
      propDefinition: [
        harvest,
        "userId",
      ],
    },
    specifyStartEndTime: {
      type: "boolean",
      label: "Specify start and end time",
      description: "Specify start and end time",
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.specifyStartEndTime === true) {
      props.startedTime = {
        type: "string",
        label: "Start time(H:MM am/pm)",
        description: "The time the entry started. Defaults to the current time. Example: 8:00am.",
      };
      props.endedTime = {
        type: "string",
        label: "End time(H:MM am/pm)",
        description: "The time the entry ended. Defaults to the current time. Example: 8:00am.",
      };
    }
    return props;
  },
  async run({ $ }) {
    const params = removeNullEntries({
      project_id: this.projectId,
      task_id: this.taskId,
      user_id: this.userId,
      spent_date: isValidDate(this.spentDate) && this.spentDate,
      started_time: isValidTime(this.startedTime) && this.startedTime.replace(/\s/g, ""),
      ended_time: isValidTime(this.endedTime) && this.endedTime.replace(/\s/g, ""),
    });
    const response = await this.harvest.createTimeEntry({
      $,
      params,
    });
    response && $.export("$summary", "Successfully created time entry");
    return response;
  },
};
